// Reading practice (lesen.html / reading.html): overview of all texts (news + stories), and one text with
// read-aloud (sentence highlight), tap-a-word glossary, three questions and one question to answer out loud.
// Progress ("nawee-reading-v1") is stored in this browser and, with an account, synced by account.js.

(() => {
    const root = document.querySelector("[data-reading]");
    if (!root || typeof READINGS === "undefined") return;

    const de = document.documentElement.lang === "de";
    const KEY = "nawee-reading-v1";
    const page = de ? "lesen.html" : "reading.html";
    const T = de ? {
        eyebrow: "LESEN", title: "Lesetexte", lead: "Kurze englische Texte zum Lesen und Hören: einfache Nachrichten über echte Ereignisse und Geschichten mit Tom und Ben. Tipp: Erst lesen, dann anhören – und am Ende laut antworten.",
        news: "Nachrichten", stories: "Geschichten", done: (s, n) => `✓ Gelesen · ${s}/${n} richtig`, start: "Lesen →",
        back: "← Alle Texte", listen: "▶ Vorlesen", stop: "■ Stopp", slow: "Langsamer", tapHint: "Tipp: Tippe auf ein unterstrichenes Wort für die Übersetzung.",
        questions: "Hast du es verstanden?", right: "Richtig!", wrong: "Nicht ganz – richtig ist:", speakTitle: "Sprich darüber", speakHint: "Antworte laut auf Englisch. Dann vergleich mit dem Beispiel.",
        showModel: "Beispiel zeigen", source: "Quelle", ownWords: "in unseren eigenen, einfachen Worten", result: (s, n) => `${s} von ${n} richtig – gut gemacht!`, next: "Nächster Text →",
        date: (d) => new Date(d + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
        privacy: "Dein Lesestand wird in diesem Browser gespeichert – mit einem <a href=\"konto.html\">kostenlosen Konto</a> auch in deinem Konto.",
    } : {
        eyebrow: "READING", title: "Reading practice", lead: "Short English texts to read and listen to: simple news about real events and stories with Tom and Ben. Tip: read first, then listen – and answer out loud at the end.",
        news: "News", stories: "Stories", done: (s, n) => `✓ Read · ${s}/${n} correct`, start: "Read →",
        back: "← All texts", listen: "▶ Read aloud", stop: "■ Stop", slow: "Slower", tapHint: "Tip: tap an underlined word to see what it means.",
        questions: "Did you understand?", right: "Correct!", wrong: "Not quite – the answer is:", speakTitle: "Talk about it", speakHint: "Answer out loud in English. Then compare with the example.",
        showModel: "Show example", source: "Source", ownWords: "in our own simple words", result: (s, n) => `${s} of ${n} correct – well done!`, next: "Next text →",
        date: (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        privacy: "Your reading progress is saved in this browser – and with a <a href=\"account.html\">free account</a> in your account too.",
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ done: {} }, load());
    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
    };

    const id = new URLSearchParams(location.search).get("t");
    const text = READINGS.find((r) => r.id === id);

    // ---------- overview ----------
    const card = (r) => {
        const d = data.done[r.id];
        return `<a class="rd-card${d ? " is-done" : ""}" href="${page}?t=${r.id}">
            <span class="rd-card-icon" aria-hidden="true">${r.image || "📖"}</span>
            <span class="rd-card-body">
                <span class="rd-card-meta">${r.level}${r.date ? ` · ${T.date(r.date)}` : ""}</span>
                <strong>${esc(r.title)}</strong>
                <span class="rd-card-status">${d ? T.done(d.score, d.of) : T.start}</span>
            </span>
        </a>`;
    };
    if (!text) {
        const news = READINGS.filter((r) => r.kind === "news").sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        const stories = READINGS.filter((r) => r.kind === "story");
        document.title = `${T.title} | Nawee`;
        root.innerHTML = `<p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p>
            <h2 class="rd-group">📰 ${T.news}</h2><div class="rd-list">${news.map(card).join("")}</div>
            <h2 class="rd-group">📖 ${T.stories}</h2><div class="rd-list">${stories.map(card).join("")}</div>
            <a class="rd-card rd-special" href="${de ? "geschichte-englisch.html" : "history-of-english.html"}">
                <span class="rd-card-icon" aria-hidden="true">📜</span>
                <span class="rd-card-body"><span class="rd-card-meta">${de ? "SPEZIAL" : "SPECIAL"}</span><strong>${de ? "Die Geschichte des Englischen" : "The history of English"}</strong><span class="rd-card-status">${de ? "2000 Jahre in einem Zeitstrahl →" : "2,000 years on one timeline →"}</span></span>
            </a>
            <p class="as-disclaimer">${T.privacy}</p>`;
        return;
    }

    // ---------- one text ----------
    document.title = `${text.title} – ${T.title} | Nawee`;
    const sentences = (p) => p.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [p];
    // wrap glossary words (longest first, whole words, case-insensitive) in buttons
    const keys = Object.keys(text.glossary || {}).sort((a, b) => b.length - a.length);
    const marked = (s) => {
        // placeholders first, so a shorter word can't match inside an already marked one
        const found = [];
        let html = esc(s);
        keys.forEach((k) => {
            const re = new RegExp(`(^|[^A-Za-z])(${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![A-Za-z])`, "i");
            html = html.replace(re, (m, pre, w) => { found.push([k, w]); return `${pre}\u0000${found.length - 1}\u0001`; });
        });
        return html.replace(/\u0000(\d+)\u0001/g, (m, i) => `<button type="button" class="rd-word" data-k="${esc(found[i][0])}">${found[i][1]}</button>`);
    };
    let n = 0;
    const body = text.paragraphs.map((p) => `<p>${sentences(p).map((s) => `<span class="rd-s" data-i="${n++}">${marked(s)}</span>`).join("")}</p>`).join("");
    const all = text.paragraphs.flatMap(sentences);
    const nextText = READINGS[(READINGS.indexOf(text) + 1) % READINGS.length];

    root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a>
        <p class="eyebrow">${(text.kind === "news" ? T.news : T.stories).toUpperCase()} · ${text.level}${text.date ? ` · ${T.date(text.date).toUpperCase()}` : ""}</p>
        <h1>${esc(text.title)}</h1>
        <div class="rd-controls"><button type="button" class="button primary rd-listen" data-listen>${T.listen}</button>
            <label class="rd-slow"><input type="checkbox" data-slow> ${T.slow}</label></div>
        <p class="as-note">${T.tapHint}</p>
        <div class="rd-text">${body}</div>
        <p class="rd-gloss" data-gloss hidden></p>
        ${text.source ? `<p class="rd-source">${T.source}: <a href="${text.source.url}" target="_blank" rel="noopener">${esc(text.source.name)} ↗</a> – ${T.ownWords}</p>` : ""}
        <section class="rd-section"><h2>${T.questions}</h2><div data-questions></div><p class="rd-result" data-result hidden></p></section>
        <section class="rd-section rd-speak"><h2>🗣️ ${T.speakTitle}</h2><p class="rd-speak-q">${esc(text.speak.q)}</p><p class="as-note">${T.speakHint}</p>
            <button type="button" class="link-button" data-model>${T.showModel}</button><p class="rd-model" data-model-text hidden>${esc(text.speak.model)}</p></section>
        <p class="rd-next"><a class="button secondary" href="${page}?t=${nextText.id}">${T.next}</a></p>
        <p class="as-disclaimer">${T.privacy}</p>`;

    // glossary
    const gloss = root.querySelector("[data-gloss]");
    root.querySelectorAll(".rd-word").forEach((b) => b.addEventListener("click", () => {
        const g = text.glossary[b.dataset.k];
        root.querySelectorAll(".rd-word.is-open").forEach((x) => x.classList.remove("is-open"));
        b.classList.add("is-open");
        gloss.innerHTML = `<strong>${esc(b.textContent)}</strong> – ${esc(de ? g.de : g.en)}`;
        gloss.hidden = false;
        b.after(gloss);
    }));

    // read aloud: David's recording if there is one, otherwise the browser voice sentence by sentence
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const listenBtn = root.querySelector("[data-listen]");
    let playing = false, audio = null;
    const stop = () => {
        playing = false; synth?.cancel(); if (audio) { audio.pause(); audio = null; }
        root.querySelectorAll(".rd-s.is-reading").forEach((s) => s.classList.remove("is-reading"));
        listenBtn.textContent = T.listen;
    };
    const voice = () => synth?.getVoices().find((v) => /en.US/i.test(v.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(v.name))
        || synth?.getVoices().find((v) => /^en/i.test(v.lang)) || null;
    const readFrom = (i) => {
        if (!playing || i >= all.length) { stop(); return; }
        root.querySelectorAll(".rd-s").forEach((s) => s.classList.toggle("is-reading", Number(s.dataset.i) === i));
        const u = new SpeechSynthesisUtterance(all[i]);
        u.lang = "en-US"; u.rate = root.querySelector("[data-slow]").checked ? 0.7 : 0.9;
        const v = voice(); if (v) u.voice = v;
        u.onend = () => readFrom(i + 1);
        synth.speak(u);
    };
    listenBtn.addEventListener("click", () => {
        if (playing) { stop(); return; }
        playing = true; listenBtn.textContent = T.stop;
        if (text.audio) { audio = new Audio(text.audio); audio.onended = stop; audio.play().catch(stop); return; }
        if (!synth) { stop(); return; }
        synth.cancel(); readFrom(0);
    });
    window.addEventListener("pagehide", stop);

    // questions
    const qBox = root.querySelector("[data-questions]");
    let answered = 0, score = 0;
    text.questions.forEach((q, qi) => {
        const wrap = document.createElement("div");
        wrap.className = "rd-q";
        const order = q.options.map((_, oi) => oi).sort(() => Math.random() - 0.5); // the right answer isn't always first
        wrap.innerHTML = `<p class="rd-q-text">${qi + 1}. ${esc(q.q)}</p><div class="rd-options">${order.map((oi) => `<button type="button" class="rd-option" data-o="${oi}">${esc(q.options[oi])}</button>`).join("")}</div><p class="rd-fb" hidden></p>`;
        wrap.querySelectorAll(".rd-option").forEach((b) => b.addEventListener("click", () => {
            const ok = Number(b.dataset.o) === q.answer;
            wrap.querySelectorAll(".rd-option").forEach((x) => { x.disabled = true; if (Number(x.dataset.o) === q.answer) x.classList.add("is-right"); });
            if (!ok) b.classList.add("is-wrong");
            const fb = wrap.querySelector(".rd-fb");
            fb.className = `rd-fb ${ok ? "is-right" : "is-wrong"}`;
            fb.textContent = ok ? `✓ ${T.right}` : `✗ ${T.wrong} ${q.options[q.answer]}`;
            fb.hidden = false;
            answered += 1; if (ok) score += 1;
            if (answered === text.questions.length) {
                const res = root.querySelector("[data-result]");
                res.textContent = T.result(score, text.questions.length);
                res.hidden = false;
                const prev = data.done[text.id];
                if (!prev || score >= prev.score) data.done[text.id] = { score, of: text.questions.length, date: new Date().toISOString().slice(0, 10) };
                save();
            }
        }));
        qBox.append(wrap);
    });

    root.querySelector("[data-model]").addEventListener("click", (e) => {
        root.querySelector("[data-model-text]").hidden = false;
        e.currentTarget.hidden = true;
    });
})();
