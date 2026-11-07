// Grammar track (grammatik.html / grammar.html): overview of the lessons, ?l=<id> opens one lesson.
// A lesson: rule → how to build it → German comparison (German page) → examples from Nawee's texts (tap to hear,
// link to the text) → practice with instant feedback → speaking task → mark as completed.
// Progress in localStorage "nawee-grammar-v1" ({ done: { id: { score, of, date } }, weak: { id: { t, pairs: { "go|went": { miss, ok, last } } } }, weakDay }). Content: grammar-data.js.

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
        soon: "Bald dabei: some & any, much & many, Objektpronomen, Häufigkeitsadverbien – und danach B1: present perfect …", start: "Lektion starten →", done: (s, n) => `✓ Abgeschlossen · ${s}/${n} richtig`, completedOnly: "✓ Abgeschlossen",
        back: "← Alle Grammatik-Lektionen", rule: "Die Regel", build: "So bildest du es", german: "Anders als im Deutschen", examples: "In unseren Texten",
        examplesHint: "Tippe auf einen Satz, um ihn zu hören.", from: "aus", practice: "Üben", check: "Prüfen", right: "Richtig!", wrong: "Nicht ganz – richtig ist:", typeHere: "Antwort eintippen",
        score: (s, n) => `${s} von ${n} richtig`, again: "Nochmal üben", puzzle: "Puzzle: Finde die Paare", puzzleHint: "Tippe ein Teil an, dann das passende Gegenstück. Tipp: Die Form der Kanten verrät, was zusammengehört.", puzzleNew: "Neues Puzzle", trickyNow: "⚠️ Diesmal knifflig:", trickyOld: "🔁 Deine kniffligen Wörter:", trickyBtn: "Jetzt üben", trickyNote: "Sie verschwinden, sobald du sie zweimal richtig hast – auch in deinem Profil.", puzzleDone: (m) => `🎉 Alle Paare gefunden${m ? ` – mit ${m} Fehlversuch${m === 1 ? "" : "en"}` : " – ohne Fehler!"}`, speak: "Jetzt du: sag es selbst", speakHint: "Antworte laut auf Englisch – erst dann das Beispiel ansehen.", showModel: "Beispiel zeigen", play: "▶ Beispiel anhören", pause: "⏸ Pause", resume: "▶ Weiter", replay: "↻ Nochmal anhören", markDone: "✓ Als abgeschlossen markieren", markUndo: "↩ Doch nicht abgeschlossen",
        betaNote: "Beta: Diese Lektion ist neu. Sag uns unten, was dir geholfen hat und was fehlt.", privacy: "Dein Fortschritt wird in diesem Browser gespeichert.",
    } : {
        eyebrow: "GRAMMAR", title: "Grammar", beta: "BETA",
        lead: "For everyone who wants to understand the rules behind English: short lessons with examples from our reading texts and practice with instant feedback.",
        soon: "Coming soon: some & any, much & many, object pronouns, adverbs of frequency – then B1: present perfect …", start: "Start the lesson →", done: (s, n) => `✓ Completed · ${s}/${n} correct`, completedOnly: "✓ Completed",
        back: "← All grammar lessons", rule: "The rule", build: "How to build it", german: "", examples: "In our texts",
        examplesHint: "Tap a sentence to hear it.", from: "from", practice: "Practice", check: "Check", right: "Correct!", wrong: "Not quite – the answer is:", typeHere: "Type your answer",
        score: (s, n) => `${s} of ${n} correct`, again: "Practice again", puzzle: "Puzzle: match the pairs", puzzleHint: "Tap a piece, then its partner. Tip: the shape of the edges shows which pieces fit together.", puzzleNew: "New puzzle", trickyNow: "⚠️ Tricky this time:", trickyOld: "🔁 Your tricky words:", trickyBtn: "Practice them", trickyNote: "They disappear once you get them right twice – they’re also in your profile.", puzzleDone: (m) => `🎉 All pairs matched${m ? ` – with ${m} wrong ${m === 1 ? "try" : "tries"}` : " – no mistakes!"}`, speak: "Your turn: say it yourself", speakHint: "Answer out loud in English – then look at the example.", showModel: "Show example", play: "▶ Listen to the example", pause: "⏸ Pause", resume: "▶ Continue", replay: "↻ Listen again", markDone: "✓ Mark as completed", markUndo: "↩ Mark as not completed",
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
    if (lesson) document.documentElement.classList.add("read-progress");  // gold progress bar during a lesson (style.css)

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
            <div class="gr-pairs">${f.rows.map(([a0, b]) => { const a = L(a0); return `<button type="button" class="gr-pair" data-say="${esc(b === "✓" ? a : b.replace(/^→\s*/, ""))}"><span>${esc(a)}</span><b>${esc(b)}</b></button>`; }).join("")}</div>
            ${f.note ? `<p class="as-note">${L(f.note)}</p>` : ""}</div>`).join("")}</section>
        ${de && L(lesson.german) ? `<section class="gr-step gr-german"><h2>🇩🇪 ${T.german}</h2><p>${L(lesson.german)}</p></section>` : ""}
        <section class="gr-step"><h2>📖 ${T.examples}</h2><p class="as-note">${T.examplesHint}</p>
            <ul class="gr-examples">${lesson.examples.map((e) => `<li><button type="button" class="gr-ex" data-say="${esc(e.text)}">${highlight(e.text, e.hl)}</button>
                ${textTitle(e.from) ? `<a class="gr-from" href="${readPage}?t=${e.from}">${T.from}: ${esc(textTitle(e.from))} →</a>` : ""}</li>`).join("")}</ul></section>
        ${lesson.puzzle ? `<section class="gr-step gr-puzzle"><h2>🧩 ${T.puzzle}</h2><p class="as-note">${T.puzzleHint}</p>
            <div class="pz-done" data-pz-done></div><div class="pz-board${lesson.puzzle.wide ? " pz-wide" : ""}" data-pz-board></div>
            <div class="pz-tricky" data-pz-tricky hidden></div>
            <p class="pz-status" data-pz-status hidden></p></section>` : ""}
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
        if (answered < round.length) return;
        scoreEl.hidden = false;
        setTimeout(() => sfx("complete"), 2200);  // after the last sentence has been read
        scoreEl.innerHTML = `${right === answered ? "🎉 " : ""}${T.score(right, answered)} <button type="button" class="link-button" data-again>${T.again}</button>`;
        scoreEl.querySelector("[data-again]").addEventListener("click", build);
        const prev = data.done[lesson.id];
        if (!prev || !prev.of || right >= prev.score) data.done[lesson.id] = { score: right, of: answered, date: new Date().toISOString().slice(0, 10) };
        save(); paintMark();
    };
    // each round: `perRound` items drawn at random from the lesson's pool (David, 2026-11-04: more exercises over time)
    let round = [];
    const drawRound = () => {
        const pool = lesson.practice.map((p, i) => i);
        for (let i = pool.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
        return pool.slice(0, lesson.perRound || 10);
    };
    function build() {
        answered = 0; right = 0; scoreEl.hidden = true;
        round = drawRound();
        // the base form in brackets – "(work)" – becomes a small 🔊 button; it is never read as part of the sentence
        const hintBtn = (h) => `<button type="button" class="gr-hint" data-say="${esc(h.replace(/\s*\/\s*/g, " "))}" title="${de ? "Grundform anhören" : "Hear the base form"}"><span aria-hidden="true">🔊</span> ${esc(h)}</button>`;
        box.innerHTML = round.map((i) => [lesson.practice[i], i]).map(([p, i]) => `<li class="gr-item" data-i="${i}">${p.task ? `<p class="gr-task">${esc(L(p.task))}</p>` : ""}<p class="gr-q">${esc(p.q).replace("___", '<span class="gr-blank">___</span>').replace(/\(([^)]+)\)/, (m, h) => hintBtn(h))}</p>
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

    // ---------- puzzle (2026-11-05, David's idea): pairs fit together like puzzle pieces; the edge shape is the hint ----------
    // Left pieces (blue) have a tab on the right edge, right pieces (gold) the matching notch on the left edge.
    // Tap one piece, then its partner: right → they click together (tone + spoken), wrong → buzzer and a shake.
    if (lesson.puzzle) {
        const P = lesson.puzzle, board = root.querySelector("[data-pz-board]"), doneBox = root.querySelector("[data-pz-done]"), status = root.querySelector("[data-pz-status]");
        // six edge shapes in a 22 × 56 box; the piece edge sits at x = 4
        const SHAPES = [
            '<rect x="0" y="23" width="6" height="10"/><circle cx="13" cy="28" r="9"/>',
            '<polygon points="0,16 21,28 0,40"/>',
            '<rect x="0" y="19" width="18" height="18" rx="2"/>',
            '<rect x="0" y="14" width="7" height="28"/><circle cx="12" cy="19" r="6.5"/><circle cx="12" cy="37" r="6.5"/>',
            '<polygon points="0,22 19,14 19,42 0,34"/>',
            '<rect x="0" y="22" width="6" height="12"/><ellipse cx="12" cy="28" rx="8" ry="13"/>',
        ];
        const edge = (k, cls) => `<svg class="${cls}" viewBox="0 0 22 56" width="22" height="56" aria-hidden="true">${SHAPES[k]}</svg>`;
        const shuffle = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
        let pairs = [], picked = null, misses = 0, left = 0, weakRound = false;
        // tricky words (David, 2026-11-05): a pair you mixed up is remembered (also in the account) until you match it right twice
        const today = new Date().toISOString().slice(0, 10);
        const keyOf = (pr) => `${pr.a}|${pr.b}`;
        const weakOf = () => ((data.weak || {})[lesson.id] || {}).pairs || {};
        const setWeak = (pairsObj) => {
            data.weak = data.weak || {};
            if (Object.keys(pairsObj).length) data.weak[lesson.id] = { t: Date.now(), pairs: pairsObj }; else delete data.weak[lesson.id];
            save();
        };
        const roundMiss = new Set();
        const trickyBox = root.querySelector("[data-pz-tricky]");
        const chip = (a, b) => `<button type="button" class="pz-chip" data-say="${esc(P.wide ? `${a} ${b}` : `${a}, ${b}`)}">${esc(a)} → ${esc(b)}</button>`;
        const paintTricky = () => {
            const now = [...roundMiss].map((i) => pairs[i]);
            const before = Object.keys(weakOf()).filter((k) => !now.some((pr) => keyOf(pr) === k)).map((k) => k.split("|"));
            trickyBox.hidden = !now.length && !before.length;
            trickyBox.innerHTML = (now.length ? `<p><strong>${T.trickyNow}</strong> ${now.map((pr) => chip(pr.a, pr.b)).join(" ")}</p>` : "")
                + (before.length ? `<p><strong>${T.trickyOld}</strong> ${before.map(([a, b]) => chip(a, b)).join(" ")} <button type="button" class="link-button" data-pz-weak>${T.trickyBtn} →</button></p>` : "")
                + `<p class="as-note">${T.trickyNote}</p>`;
            trickyBox.querySelectorAll(".pz-chip").forEach((c) => c.addEventListener("click", () => say(c.dataset.say)));
            const wb = trickyBox.querySelector("[data-pz-weak]"); if (wb) wb.addEventListener("click", () => newRound(true));
        };
        const piece = (side, i) => `<button type="button" class="pz-piece pz-${side}" data-side="${side}" data-i="${i}">
            ${side === "a" ? edge(pairs[i].k, "pz-tab") : edge(pairs[i].k, "pz-notch")}<span>${esc(side === "a" ? pairs[i].a : pairs[i].b)}</span></button>`;
        const newRound = (weakFirst) => {
            const n = P.wide ? 5 : 6, ks = shuffle([0, 1, 2, 3, 4, 5]), W = weakOf();
            const isWeak = ([a, b]) => !!W[`${a}|${b}`];
            weakRound = !!weakFirst && P.pairs.some(isWeak);
            // "practice them": your tricky pairs first, the rest filled up at random
            const pool = weakRound ? [...shuffle(P.pairs.filter(isWeak)), ...shuffle(P.pairs.filter((x) => !isWeak(x)))] : shuffle(P.pairs.slice());
            pairs = shuffle(pool.slice(0, n)).map(([a, b], i) => ({ a, b, k: ks[i] }));
            roundMiss.clear();
            picked = null; misses = 0; left = n; status.hidden = true;
            // column header above the matched pairs (David, 2026-11-05: so you remember which side is which) – shown after the first match
            doneBox.innerHTML = `<div class="pz-head${P.wide ? " pz-wide" : ""}" hidden><span>${esc(L(P.a))}</span><span>${esc(L(P.b))}</span></div>`;
            const order = shuffle(pairs.map((_, i) => i));
            board.innerHTML = `<div class="pz-col"><p class="pz-label">${esc(L(P.a))}</p>${pairs.map((_, i) => piece("a", i)).join("")}</div>
                <div class="pz-col"><p class="pz-label">${esc(L(P.b))}</p>${order.map((i) => piece("b", i)).join("")}</div>`;
            paintTricky();
        };
        board.addEventListener("click", (e) => {
            const b = e.target.closest(".pz-piece");
            if (!b) return;
            if (!picked || picked.dataset.side === b.dataset.side) {  // first pick (or change your mind on the same side)
                if (picked) picked.classList.remove("is-picked");
                picked = picked === b ? null : b;
                if (picked) picked.classList.add("is-picked");
                return;
            }
            const x = picked, y = b; picked = null; x.classList.remove("is-picked");
            if (x.dataset.i === y.dataset.i) {
                const i = Number(x.dataset.i), pr = pairs[i];
                sfx("correct");
                setTimeout(() => say(P.wide ? `${pr.a} ${pr.b}` : `${pr.a}, ${pr.b}`), 300);
                board.querySelectorAll(`.pz-piece[data-i="${i}"]`).forEach((el) => el.remove());
                const W = { ...weakOf() }, wk = W[keyOf(pr)];  // matched right first time → one step towards "learned"
                if (wk && !roundMiss.has(i)) { wk.ok = (wk.ok || 0) + 1; if (wk.ok >= 2) delete W[keyOf(pr)]; setWeak(W); }
                doneBox.querySelector(".pz-head").hidden = false;
                doneBox.insertAdjacentHTML("beforeend", `<div class="pz-joined${P.wide ? " pz-wide" : ""}" data-say="${esc(P.wide ? `${pr.a} ${pr.b}` : `${pr.a}, ${pr.b}`)}">${piece("a", i)}${piece("b", i)}</div>`);
                const j = doneBox.lastElementChild; j.querySelectorAll("button").forEach((el) => { el.disabled = true; });
                j.addEventListener("click", () => say(j.dataset.say));
                left -= 1;
                if (!left) {
                    if (weakRound) { data.weakDay = today; save(); }
                    paintTricky();
                    setTimeout(() => sfx("complete"), 900);
                    status.hidden = false;
                    status.innerHTML = `${T.puzzleDone(misses)} <button type="button" class="link-button" data-pz-new>${T.puzzleNew}</button>`;
                    status.querySelector("[data-pz-new]").addEventListener("click", () => newRound(false));
                }
            } else {
                misses += 1; sfx("wrong");
                // the piece you picked first is the one you were trying to place → that pair counts as tricky
                const i = Number(x.dataset.i), pr = pairs[i], W = { ...weakOf() };
                roundMiss.add(i);
                W[keyOf(pr)] = { miss: ((W[keyOf(pr)] || {}).miss || 0) + 1, ok: 0, last: today };
                setWeak(W); paintTricky();
                [x, y].forEach((el) => { el.classList.remove("is-shake"); void el.offsetWidth; el.classList.add("is-shake"); });
            }
        });
        // from the profile: ?l=…&weak=1 starts with your tricky pairs and scrolls to the puzzle
        const fromProfile = new URLSearchParams(location.search).get("weak") === "1";
        newRound(fromProfile);
        if (fromProfile) setTimeout(() => root.querySelector(".gr-puzzle").scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
})();
