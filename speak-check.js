// Pronunciation check (picture cards, David 2026-11-07): the learner records a word, a small speech model writes down
// what it heard, and we compare it with the word. Everything runs ON THE DEVICE: the model (Whisper tiny.en, MIT license,
// ~41 MB) and the library (transformers.js 3.8.1, Apache 2.0) are served from this website (models/, vendor/transformers/),
// downloaded once and kept in the browser cache. The recording stays in memory on this device – nothing is uploaded.
// API: window.NaweeSpeak = { supported, load(onProgress), record({ onLevel }), check(samples, word) }.

(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const supported = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder && AC && window.WebAssembly);
    const here = (p) => new URL(p, location.href).href;

    // ---------- the speech model (loaded once, on first use) ----------
    let model = null, ready = false, pct = 0;
    const listeners = new Set();   // everyone waiting sees the download progress
    const load = (onProgress) => {
        if (onProgress && !ready) { listeners.add(onProgress); onProgress(pct); }
        if (model) return model;
        const files = {};
        model = import(here("vendor/transformers/transformers.min.js")).then(({ pipeline, env }) => {
            env.allowRemoteModels = false;            // never ask Hugging Face or any other site
            env.allowLocalModels = true;
            env.localModelPath = here("models/");
            env.useBrowserCache = true;               // saved in the browser after the first download
            env.backends.onnx.wasm.wasmPaths = here("vendor/transformers/");
            return pipeline("automatic-speech-recognition", "whisper-tiny.en", {
                dtype: { encoder_model: "q8", decoder_model_merged: "q8" }, device: "wasm",
                progress_callback: (e) => {
                    if (e.status !== "progress" || !e.total) return;
                    files[e.file] = [e.loaded, e.total];
                    const v = Object.values(files), done = v.reduce((a, x) => a + x[0], 0), all = v.reduce((a, x) => a + x[1], 0);
                    pct = Math.min(99, Math.round((done / Math.max(all, 40e6)) * 100));
                    listeners.forEach((f) => f(pct));
                },
            });
        });
        model.then(() => { ready = true; listeners.clear(); }, () => { model = null; listeners.clear(); });   // failed: try again next time
        return model;
    };

    // ---------- record one word: stops by itself after a short silence (or after 4 s) ----------
    const record = ({ onLevel, maxMs = 4000 } = {}) => new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then((stream) => {
            const ctx = new AC();
            ctx.resume?.();   // some browsers start it paused
            const an = ctx.createAnalyser(); an.fftSize = 1024;
            ctx.createMediaStreamSource(stream).connect(an);
            const buf = new Float32Array(an.fftSize);
            const rec = new MediaRecorder(stream), chunks = [];
            let spoke = false, quietSince = 0, peak = 0, timer = null;
            const t0 = performance.now();
            rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
            rec.onstop = () => {
                stream.getTracks().forEach((t) => t.stop()); clearInterval(timer); ctx.close();
                resolve({ blob: new Blob(chunks, { type: rec.mimeType || "audio/webm" }), loud: peak > 0.02, peak });
            };
            const stop = () => { if (rec.state === "recording") rec.stop(); };
            rec.start();
            timer = setInterval(() => {
                an.getFloatTimeDomainData(buf);
                const rms = Math.sqrt(buf.reduce((a, x) => a + x * x, 0) / buf.length);
                peak = Math.max(peak, rms); onLevel?.(Math.min(1, rms * 8));
                const now = performance.now();
                if (rms > 0.03) { spoke = true; quietSince = 0; } else if (spoke && !quietSince) quietSince = now;
                if ((spoke && quietSince && now - quietSince > 700) || now - t0 > maxMs) stop();
            }, 50);
            record.stop = stop;   // the "stop" button
        }).catch(reject);
    });

    // recording → 16 kHz mono samples (what Whisper expects)
    const samples = async (blob) => {
        const ctx = new AC();
        const audio = await new Promise((res, rej) => blob.arrayBuffer().then((b) => ctx.decodeAudioData(b, res, rej)));
        ctx.close();
        const off = new OfflineAudioContext(1, Math.ceil(audio.duration * 16000), 16000);
        const src = off.createBufferSource(); src.buffer = audio; src.connect(off.destination); src.start();
        return (await off.startRendering()).getChannelData(0);
    };

    // ---------- compare what was heard with the word ----------
    const norm = (s) => String(s).toLowerCase().replace(/[’']/g, "").replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
    const dist = (a, b) => {
        const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
        for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
        for (let i = 1; i <= a.length; i += 1) for (let j = 1; j <= b.length; j += 1)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return d[a.length][b.length];
    };
    const same = (heard, word) => {
        const h = norm(heard), w = norm(word), hs = h.replace(/ /g, ""), ws = w.replace(/ /g, "");
        if (!h) return false;
        if (h === w || hs === ws || ` ${h} `.includes(` ${w} `)) return true;
        if (hs === `${ws}s` || hs === `${ws}es` || `${hs}s` === ws) return true;            // chair / chairs
        return ws.length >= 6 && dist(hs, ws) <= 1;                                         // one letter off in a long word
    };
    const check = async (blob, word) => {
        const pipe = await load();
        const out = await pipe(await samples(blob));
        // Whisper writes [BLANK_AUDIO], (silence) … when it hears nothing useful
        const heard = String(out.text || "").replace(/\[[^\]]*\]|\([^)]*\)/g, "").replace(/^[\s"“]+|[\s".!?,”]+$/g, "").trim();
        return { heard, ok: same(heard, word) };
    };

    window.NaweeSpeak = { supported, load, record, check, ready: () => ready, stop: () => record.stop?.() };
})();
