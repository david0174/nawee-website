// Grammar track (grammatik.html / grammar.html): overview of the lessons, ?l=<id> opens one lesson.
// A lesson: rule → how to build it → German comparison (German page) → examples from Nawee's texts (tap to hear,
// link to the text) → practice with instant feedback → speaking task → mark as completed.
// Progress in localStorage "nawee-grammar-v1" ({ done: { id: { score, of, date } } }). Content: grammar-data.js.

(() => {
    const root = document.querySelector("[data-grammar]");
    if (!root || typeof GRAMMAR === "undefined") return;
    const de = (document.documentElement.lang || "en").startsWith("de");
    const L = (v) => (v && typeof v === "object" ? v[de ? "de" : "en"] : v) || "";
    const page = de ? "grammatik.html" : "grammar.html";
    const readPage = de ? "lesen.html" : "reading.html";
    const KEY = "nawee-grammar-v1";
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ done: {} }, load());
    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress"));
    };
    const T = de ? {
        eyebrow: "GRAMMATIK", title: "Grammatik", beta: "BETA",
        lead: "Für alle, die die Regeln hinter dem Englischen verstehen wollen: kurze Lektionen mit Beispielen aus unseren Lesetexten, einem Vergleich mit dem Deutschen und Übungen mit sofortigem Feedback.",
        soon: "Bald dabei: present continuous, Steigerung (comparatives), going to / will, some & any …", start: "Lektion starten →", done: (s, n) => `✓ Abgeschlossen · ${s}/${n} richtig`, completedOnly: "✓ Abgeschlossen",
        back: "← Alle Grammatik-Lektionen", rule: "Die Regel", build: "So bildest du es", german: "Anders als im Deutschen", examples: "In unseren Texten",
        examplesHint: "Tippe auf einen Satz, um ihn zu hören.", from: "aus", practice: "Üben", check: "Prüfen", right: "Richtig!", wrong: "Nicht ganz – richtig ist:", typeHere: "Antwort eintippen",
        score: (s, n) => `${s} von ${n} richtig`, again: "Nochmal üben", speak: "Jetzt du: sag es selbst", speakHint: "Antworte laut auf Englisch – erst dann das Beispiel ansehen.", showModel: "Beispiel zeigen", play: "▶ Beispiel anhören", pause: "⏸ Pause", resume: "▶ Weiter", replay: "↻ Nochmal anhören", markDone: "✓ Als abgeschlossen markieren", markUndo: "↩ Doch nicht abgeschlossen",
        betaNote: "Beta: Diese Lektion ist neu. Sag uns unten, was dir geholfen hat und was fehlt.", privacy: "Dein Fortschritt wird in diesem Browser gespeichert.",
    } : {
        eyebrow: "GRAMMAR", title: "Grammar", beta: "BETA",
        lead: "For everyone who wants to understand the rules behind English: short lessons with examples from our reading texts and practice with instant feedback.",
        soon: "Coming soon: present continuous, comparatives, going to / will, some & any …", start: "Start the lesson →", done: (s, n) => `✓ Completed · ${s}/${n} correct`, completedOnly: "✓ Completed",
        back: "← All grammar lessons", rule: "The rule", build: "How to build it", german: "", examples: "In our texts",
        examplesHint: "Tap a sentence to hear it.", from: "from", practice: "Practice", check: "Check", right: "Correct!", wrong: "Not quite – the answer is:", typeHere: "Type your answer",
        score: (s, n) => `${s} of ${n} correct`, again: "Practice again", speak: "Your turn: say it yourself", speakHint: "Answer out loud in English – then look at the example.", showModel: "Show example", play: "▶ Listen to the example", pause: "⏸ Pause", resume: "▶ Continue", replay: "↻ Listen again", markDone: "✓ Mark as completed", markUndo: "↩ Mark as not completed",
        betaNote: "Beta: this lesson is new. Tell us below what helped and what’s missing.", privacy: "Your progress is saved in this browser.",
    };

    // browser voice (American English) – later David's recordings can replace it
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const say = (text) => {
        if (!synth) return;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = 0.9;
        const v = synth.getVoices().find((x) => /en.US/i.test(x.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(x.name)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
        if (v) u.voice = v;
        synth.speak(u);
        return u;
    };

    // right / wrong / done tones – the same sounds and the same on/off setting ("nawee-sound") as the lessons and games
    let tones = null;
    const sfx = (kind) => {
        try { if (localStorage.getItem("nawee-sound") === "off") return; } catch { /* ignore */ }
        try {
            tones = tones || new (window.AudioContext || window.webkitAudioContext)();
            if (tones.state === "suspended") tones.resume();
            const tone = (freq, start, length, type = "sine", volume = 0.22) => {
                const t0 = tones.currentTime + start, osc = tones.createOscillator(), gain = tones.createGain();
                osc.type = type; osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.0001, t0);
                gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
                gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
                osc.connect(gain).connect(tones.destination);
                osc.start(t0); osc.stop(t0 + length + 0.05);
            };
            if (kind === "correct") { tone(880, 0, 0.12); tone(1318.5, 0.09, 0.2); }
            if (kind === "wrong") { tone(110, 0, 0.32, "sawtooth", 0.09); tone(116, 0, 0.32, "sawtooth", 0.07); tone(55, 0, 0.32, "square", 0.05); }  // buzzer
            if (kind === "complete") { tone(659.3, 0, 0.16); tone(784, 0.12, 0.16); tone(1046.5, 0.24, 0.32); }
        } catch { /* audio not available – stay silent */ }
    };

    const id = new URLSearchParams(location.search).get("l");
    const lesson = GRAMMAR.find((g) => g.id === id);

    // ---------- overview ----------
    if (!lesson) {
        document.title = `${T.title} | Nawee`;
        root.innerHTML = `<p class="eyebrow">${T.eyebrow} <span class="gr-beta">${T.beta}</span></p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p>
            <div class="rd-list">${GRAMMAR.map((g) => { const d = data.done[g.id]; return `<a class="rd-card${d ? " is-done" : ""}" href="${page}?l=${g.id}">
                <span class="rd-card-icon" aria-hidden="true">${g.icon}</span>
                <span class="rd-card-body"><span class="rd-card-meta">${g.level}${g.beta ? ` · ${T.beta}` : ""}</span><strong>${esc(L(g.title))}</strong>
                <span class="rd-card-status">${d ? (d.of ? T.done(d.score, d.of) : T.completedOnly) : `${esc(L(g.teaser))} · ${T.start}`}</span></span></a>`; }).join("")}</div>
            <p class="gr-soon">${T.soon}</p>
            <p class="as-disclaimer">${T.privacy}</p>`;
        return;
    }

    // ---------- one lesson ----------
    document.title = `${L(lesson.title)} – ${T.title} | Nawee`;
    const textTitle = (rid) => (typeof READINGS !== "undefined" && READINGS.find((r) => r.id === rid) || {}).title || "";
    const highlight = (text, words) => words.reduce((h, w) => h.replace(new RegExp(`\\b(${w})\\b`), "<mark>$1</mark>"), esc(text));
    root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a>
        <p class="eyebrow">${T.eyebrow} · ${lesson.level}${lesson.beta ? ` <span class="gr-beta">${T.beta}</span>` : ""}</p>
        <h1>${esc(L(lesson.title))}</h1>
        <section class="gr-step"><h2>📌 ${T.rule}</h2><p class="gr-rule">${L(lesson.rule)}</p></section>
        <section class="gr-step"><h2>🔧 ${T.build}</h2>${lesson.form.map((f) => `<div class="gr-form"><h3>${esc(L(f.label))}</h3>
            <div class="gr-pairs">${f.rows.map(([a, b]) => `<button type="button" class="gr-pair" data-say="${esc(a.replace(/ ✗$/, ""))}"><span>${esc(a)}</span><b>${esc(b)}</b></button>`).join("")}</div>
            ${f.note ? `<p class="as-note">${L(f.note)}</p>` : ""}</div>`).join("")}</section>
        ${de && L(lesson.german) ? `<section class="gr-step gr-german"><h2>🇩🇪 ${T.german}</h2><p>${L(lesson.german)}</p></section>` : ""}
        <section class="gr-step"><h2>📖 ${T.examples}</h2><p class="as-note">${T.examplesHint}</p>
            <ul class="gr-examples">${lesson.examples.map((e) => `<li><button type="button" class="gr-ex" data-say="${esc(e.text)}">${highlight(e.text, e.hl)}</button>
                ${textTitle(e.from) ? `<a class="gr-from" href="${readPage}?t=${e.from}">${T.from}: ${esc(textTitle(e.from))} →</a>` : ""}</li>`).join("")}</ul></section>
        <section class="gr-step"><h2>✏️ ${T.practice}</h2><ol class="gr-practice" data-practice></ol><p class="gr-score" data-score hidden></p></section>
        <section class="gr-step gr-speak"><span class="gr-speak-icon" aria-hidden="true">🎤</span><h2>${T.speak}</h2>
            <p class="gr-speak-q">${esc(L(lesson.speak.q))}</p><p class="as-note">${T.speakHint}</p>
            <button type="button" class="button secondary" data-model>${T.showModel}</button>
            <div class="gr-model-box" data-model-box hidden><p class="gr-model">${esc(lesson.speak.model)}</p>
                <button type="button" class="button secondary gr-play" data-play>${T.play}</button></div></section>
        <p class="rd-next"><button type="button" class="button primary" data-mark></button></p>
        ${lesson.beta ? `<p class="as-note gr-betanote">🧪 ${T.betaNote}</p>` : ""}
        <p class="as-disclaimer">${T.privacy}</p>`;

    root.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => say(b.dataset.say)));
    // the example answer is longer – it gets play / pause / continue / replay (David, 2026-11-04: longer texts can always be paused)
    const playBtn = root.querySelector("[data-play]");
    let playState = "idle"; // idle | playing | paused | done
    const paintPlay = () => { playBtn.textContent = { idle: T.play, playing: T.pause, paused: T.resume, done: T.replay }[playState]; };
    const startModel = () => {
        const u = say(lesson.speak.model);
        if (!u) return;
        playState = "playing"; paintPlay();
        u.onend = () => { if (playState === "playing") { playState = "done"; paintPlay(); } };
    };
    playBtn.addEventListener("click", () => {
        if (!synth) return;
        if (playState === "playing") { synth.pause(); playState = "paused"; }
        else if (playState === "paused") { synth.resume(); playState = "playing"; }
        else { startModel(); return; }
        paintPlay();
    });
    root.querySelector("[data-model]").addEventListener("click", (e) => { root.querySelector("[data-model-box]").hidden = false; e.currentTarget.remove(); startModel(); });
    window.addEventListener("pagehide", () => synth && synth.cancel());

    // mark as completed (also set automatically when every practice item is answered)
    const markBtn = root.querySelector("[data-mark]");
    const paintMark = () => { const d = data.done[lesson.id]; markBtn.textContent = d ? T.markUndo : T.markDone; markBtn.classList.toggle("primary", !d); markBtn.classList.toggle("secondary", !!d); };
    markBtn.addEventListener("click", () => {
        if (data.done[lesson.id]) delete data.done[lesson.id]; else data.done[lesson.id] = { date: new Date().toISOString().slice(0, 10) };
        save(); paintMark();
    });
    paintMark();

    // practice: every item checked on its own, instant feedback with a short explanation
    const box = root.querySelector("[data-practice]"), scoreEl = root.querySelector("[data-score]");
    const norm = (s) => s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");
    let answered = 0, right = 0;
    const finishOne = (ok) => {
        answered += 1; if (ok) right += 1;
        if (answered < lesson.practice.length) return;
        scoreEl.hidden = false;
        setTimeout(() => sfx("complete"), 2200);  // after the last sentence has been read
        scoreEl.innerHTML = `${right === answered ? "🎉 " : ""}${T.score(right, answered)} <button type="button" class="link-button" data-again>${T.again}</button>`;
        scoreEl.querySelector("[data-again]").addEventListener("click", build);
        const prev = data.done[lesson.id];
        if (!prev || !prev.of || right >= prev.score) data.done[lesson.id] = { score: right, of: answered, date: new Date().toISOString().slice(0, 10) };
        save(); paintMark();
    };
    function build() {
        answered = 0; right = 0; scoreEl.hidden = true;
        // the base form in brackets – "(work)" – becomes a small 🔊 button; it is never read as part of the sentence
        const hintBtn = (h) => `<button type="button" class="gr-hint" data-say="${esc(h.replace(/\s*\/\s*/g, " "))}" title="${de ? "Grundform anhören" : "Hear the base form"}"><span aria-hidden="true">🔊</span> ${esc(h)}</button>`;
        box.innerHTML = lesson.practice.map((p, i) => `<li class="gr-item" data-i="${i}">${p.task ? `<p class="gr-task">${esc(L(p.task))}</p>` : ""}<p class="gr-q">${esc(p.q).replace("___", '<span class="gr-blank">___</span>').replace(/\(([^)]+)\)/, (m, h) => hintBtn(h))}</p>
            ${p.type === "gap" ? `<div class="gr-gap"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}" aria-label="${T.typeHere}"><button type="button" class="button secondary" data-check>${T.check}</button></div>`
                : `<div class="gr-options">${p.options.map((o, k) => `<button type="button" class="gr-opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`}
            <p class="gr-fb" hidden></p></li>`).join("");
        box.querySelectorAll(".gr-hint").forEach((b) => b.addEventListener("click", () => say(b.dataset.say)));
        box.querySelectorAll(".gr-item").forEach((li) => {
            const p = lesson.practice[Number(li.dataset.i)], fb = li.querySelector(".gr-fb");
            const result = (ok, shown) => {
                li.classList.add(ok ? "is-right" : "is-wrong");
                sfx(ok ? "correct" : "wrong");
                fb.hidden = false;
                fb.innerHTML = ok ? `✓ ${T.right} <span>${L(p.why)}</span>` : `✗ ${T.wrong} <strong>${esc(shown)}</strong> <span>${L(p.why)}</span>`;
                const filled = p.type === "gap" ? p.answer[0] : p.options[p.answer];
                const blank = li.querySelector(".gr-blank"); if (blank) blank.textContent = filled;
                if (blank) setTimeout(() => say(p.q.replace("___", filled).replace(/\s*\([^)]*\)/, "")), 450);  // the sentence without the hint in brackets, after the tone
                finishOne(ok);
            };
            if (p.type === "gap") {
                const input = li.querySelector("input"), btn = li.querySelector("[data-check]");
                const check = () => { if (!input.value.trim()) return; input.disabled = true; btn.remove(); result(p.answer.some((a) => norm(a) === norm(input.value)), p.answer[0]); };
                btn.addEventListener("click", check);
                input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
            } else {
                li.querySelectorAll(".gr-opt").forEach((b) => b.addEventListener("click", () => {
                    li.querySelectorAll(".gr-opt").forEach((x) => { x.disabled = true; if (Number(x.dataset.k) === p.answer) x.classList.add("is-answer"); });
                    if (Number(b.dataset.k) !== p.answer) b.classList.add("is-picked-wrong");
                    result(Number(b.dataset.k) === p.answer, p.options[p.answer]);
                }));
            }
        });
    }
    build();
})();
