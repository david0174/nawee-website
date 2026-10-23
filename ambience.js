// Background sounds for the lesson dialogues (office, outdoor, street, café, home), generated live with the
// Web Audio API – no audio files, no licenses. Quiet on purpose: the conversation must stay easy to understand.
// Use: NaweeAmbience.start("outdoor"), NaweeAmbience.stop().

window.NaweeAmbience = (() => {
    let ctx = null, out = null, nodes = [], timers = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    const noise = (seconds = 2, brown = false) => {
        const b = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
        const d = b.getChannelData(0);
        let last = 0;
        for (let i = 0; i < d.length; i += 1) {
            const w = Math.random() * 2 - 1;
            if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
        }
        return b;
    };
    // a looping noise bed through a filter
    const bed = (type, freq, gain, brown = false, q = 0.7) => {
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = noise(3, brown); src.loop = true;
        f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = gain;
        src.connect(f).connect(g).connect(out); src.start();
        nodes.push(src);
        return { f, g };
    };
    // something that happens now and then (bird call, car passing, cup, keyboard …)
    const every = (min, max, fn) => {
        const tick = () => { fn(ctx.currentTime + 0.05); timers.push(setTimeout(tick, rand(min, max) * 1000)); };
        timers.push(setTimeout(tick, rand(min, max) * 500));
    };
    const tone = (t, f1, f2, dur, gain, type = "sine") => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.05);
    };
    const bird = (t) => {
        const base = rand(2600, 4200), notes = Math.floor(rand(2, 6));
        for (let i = 0; i < notes; i += 1) {
            const s = t + i * rand(0.09, 0.16);
            tone(s, base * rand(0.9, 1.15), base * rand(1.1, 1.4), rand(0.06, 0.11), 0.05);
        }
    };
    const car = (t) => {
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = noise(4, true); f.type = "lowpass"; f.frequency.setValueAtTime(200, t); f.frequency.linearRampToValueAtTime(700, t + 1.6); f.frequency.linearRampToValueAtTime(200, t + 3.6);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.28, t + 1.7); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
        src.connect(f).connect(g).connect(out); src.start(t); src.stop(t + 4);
    };
    const click = (t, gain = 0.05) => {
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = noise(0.1); f.type = "bandpass"; f.frequency.value = rand(2000, 4000);
        g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        src.connect(f).connect(g).connect(out); src.start(t); src.stop(t + 0.05);
    };
    const typing = (t) => { const n = Math.floor(rand(4, 12)); for (let i = 0; i < n; i += 1) click(t + i * rand(0.08, 0.2), 0.03); };
    const clink = (t) => { tone(t, 2800, 2750, 0.25, 0.03); tone(t + 0.01, 4200, 4100, 0.18, 0.015); };

    const SCENES = {
        office: () => { bed("lowpass", 400, 0.05, true); bed("bandpass", 120, 0.02); every(3, 7, typing); every(9, 16, clink); },
        outdoor: () => { const w = bed("lowpass", 600, 0.06, true); every(1.5, 4.5, bird); every(12, 22, car);
            // wind comes and goes
            timers.push(setInterval(() => w.g.gain.setTargetAtTime(rand(0.03, 0.09), ctx.currentTime, 1.5), 3000)); },
        street: () => { bed("lowpass", 350, 0.12, true); every(4, 9, car); every(6, 12, bird); },
        cafe: () => { bed("bandpass", 700, 0.05, false, 0.6); bed("lowpass", 300, 0.04, true); every(2, 5, clink); every(7, 12, typing); },
        home: () => { bed("lowpass", 250, 0.05, true); every(14, 25, car); },
    };

    const stop = () => {
        timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = [];
        if (out && ctx) {
            const o = out, old = nodes;
            o.gain.setTargetAtTime(0, ctx.currentTime, 0.3); // fade out, then clean up
            setTimeout(() => { old.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } }); o.disconnect(); }, 1200);
        }
        nodes = [];
        out = null;
    };
    const start = (scene) => {
        stop();
        if (!SCENES[scene]) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = ctx || new AC();
        ctx.resume();
        out = ctx.createGain();
        out.gain.setValueAtTime(0, ctx.currentTime);
        out.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2); // fade in
        out.connect(ctx.destination);
        SCENES[scene]();
    };
    window.addEventListener("pagehide", stop);
    return { start, stop, scenes: Object.keys(SCENES) };
})();
