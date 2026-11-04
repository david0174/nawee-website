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
        score: (s, n) => `${s} von ${n} richtig`, again: "Nochmal üben", speak: "Selbst sprechen", showModel: "Beispiel zeigen", markDone: "✓ Als abgeschlossen markieren", markUndo: "↩ Doch nicht abgeschlossen",
        betaNote: "Beta: Diese Lektion ist neu. Sag uns unten, was dir geholfen hat und was fehlt.", privacy: "Dein Fortschritt wird in diesem Browser gespeichert.",
    } : {
        eyebrow: "GRAMMAR", title: "Grammar", beta: "BETA",
        lead: "For everyone who wants to understand the rules behind English: short lessons with examples from our reading texts and practice with instant feedback.",
        soon: "Coming soon: present continuous, comparatives, going to / will, some & any …", start: "Start the lesson →", done: (s, n) => `✓ Completed · ${s}/${n} correct`, completedOnly: "✓ Completed",
        back: "← All grammar lessons", rule: "The rule", build: "How to build it", german: "", examples: "In our texts",
        examplesHint: "Tap a sentence to hear it.", from: "from", practice: "Practice", check: "Check", right: "Correct!", wrong: "Not quite – the answer is:", typeHere: "Type your answer",
        score: (s, n) => `${s} of ${n} correct`, again: "Practice again", speak: "Say it yourself", showModel: "Show example", markDone: "✓ Mark as completed", markUndo: "↩ Mark as not completed",
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
        <section class="gr-step"><h2>🗣️ ${T.speak}</h2><p>${esc(L(lesson.speak.q))}</p>
            <button type="button" class="link-button" data-model>${T.showModel}</button><p class="gr-model" data-model-text hidden>${esc(lesson.speak.model)}</p></section>
        <p class="rd-next"><button type="button" class="button primary" data-mark></button></p>
        ${lesson.beta ? `<p class="as-note gr-betanote">🧪 ${T.betaNote}</p>` : ""}
        <p class="as-disclaimer">${T.privacy}</p>`;

    root.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => say(b.dataset.say)));
    root.querySelector("[data-model]").addEventListener("click", (e) => { root.querySelector("[data-model-text]").hidden = false; e.currentTarget.remove(); say(lesson.speak.model); });

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
        box.innerHTML = lesson.practice.map((p, i) => `<li class="gr-item" data-i="${i}"><p class="gr-q">${esc(p.q).replace("___", '<span class="gr-blank">___</span>').replace(/\(([^)]+)\)/, (m, h) => hintBtn(h))}</p>
            ${p.type === "gap" ? `<div class="gr-gap"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}" aria-label="${T.typeHere}"><button type="button" class="button secondary" data-check>${T.check}</button></div>`
                : `<div class="gr-options">${p.options.map((o, k) => `<button type="button" class="gr-opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`}
            <p class="gr-fb" hidden></p></li>`).join("");
        box.querySelectorAll(".gr-hint").forEach((b) => b.addEventListener("click", () => say(b.dataset.say)));
        box.querySelectorAll(".gr-item").forEach((li) => {
            const p = lesson.practice[Number(li.dataset.i)], fb = li.querySelector(".gr-fb");
            const result = (ok, shown) => {
                li.classList.add(ok ? "is-right" : "is-wrong");
                fb.hidden = false;
                fb.innerHTML = ok ? `✓ ${T.right} <span>${L(p.why)}</span>` : `✗ ${T.wrong} <strong>${esc(shown)}</strong> <span>${L(p.why)}</span>`;
                const filled = p.type === "gap" ? p.answer[0] : p.options[p.answer];
                const blank = li.querySelector(".gr-blank"); if (blank) blank.textContent = filled;
                if (blank) say(p.q.replace("___", filled).replace(/\s*\([^)]*\)/, ""));  // the sentence without the hint in brackets
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
