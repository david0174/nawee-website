// Picture flashcards with spaced repetition (vokabeln.html / vocabulary.html?deck=office).
// Learn: picture → say the word out loud → flip → hear it → rate (Again / Hard / Good / Easy); the rating
// decides when the card comes back (like Anki). Listen: hear a word, pick the picture.
// Progress is stored in this browser (localStorage) and, with an account, synced by account.js.

(() => {
    const root = document.querySelector("[data-vocab]");
    if (!root) return;

    const lang = document.documentElement.lang === "en" ? "en" : "de";
    const L = (v) => (v && typeof v === "object" ? v[lang] : v) || "";
    const KEY = "nawee-vocab-v1";
    const NEW_PER_DAY = 10;
    const T = lang === "de" ? {
        back: "← Dein Lernweg", backHref: "fuer-mich.html", eyebrow: "BILDKARTEN", modes: ["Lernen", "Hören", "Alle Wörter"],
        due: (d, n) => `Heute: ${d} zum Wiederholen · ${n} neu`, learned: (a, b) => `${a} von ${b} Wörtern gelernt`,
        streak: (n) => `🔥 ${n} ${n === 1 ? "Tag" : "Tage"} in Folge`,
        ask: "Wie heißt das auf Englisch? Sag es laut.", flip: "Umdrehen", play: "Anhören", example: "Beispiel",
        rate: ["Nochmal", "Schwer", "Gut", "Leicht"], days: (n) => (n === 0 ? "gleich" : n === 1 ? "1 Tag" : `${n} Tage`),
        doneTitle: "Für heute geschafft!", doneText: "Komm morgen wieder – dann sind die nächsten Karten dran.",
        listenAsk: "Hör zu: Welches Bild passt?", right: "Richtig!", wrong: "Nicht ganz.", nextQ: "Weiter",
        score: (r, t) => `${r} von ${t} richtig`, again: "Nochmal", privacy: "Dein Lernstand wird in diesem Browser gespeichert – mit einem <a href=\"konto.html\">kostenlosen Konto</a> auch in deinem Konto, auf allen Geräten.",
        reset: "Fortschritt zurücksetzen", resetQ: "Lernstand für diese Karten löschen?", tip: "Tipp: Erst laut sagen, dann umdrehen – so bleibt das Wort hängen.",
        status: { green: "sicher", yellow: "geübt", red: "zuletzt falsch", grey: "neu" }, barLabel: "Dein Stand bei diesem Thema",
        allTitle: "Bildkarten", allLead: "Vokabeln üben, unabhängig von den Lektionen: Bild ansehen, Wort laut sagen, anhören. Jedes Thema zeigt dir, wie sicher du schon bist.",
        overall: "Alle Themen zusammen", words: (n) => `${n} Wörter`, practice: "Üben", start: "Starten", topics: "← Alle Themen",
    } : {
        back: "← Your learning path", backHref: "for-me.html", eyebrow: "PICTURE CARDS", modes: ["Learn", "Listen", "All words"],
        due: (d, n) => `Today: ${d} to review · ${n} new`, learned: (a, b) => `${a} of ${b} words learned`,
        streak: (n) => `🔥 ${n}-day streak`,
        ask: "What is this in English? Say it out loud.", flip: "Flip", play: "Listen", example: "Example",
        rate: ["Again", "Hard", "Good", "Easy"], days: (n) => (n === 0 ? "soon" : n === 1 ? "1 day" : `${n} days`),
        doneTitle: "Done for today!", doneText: "Come back tomorrow – the next cards will be waiting.",
        listenAsk: "Listen: which picture fits?", right: "Correct!", wrong: "Not quite.", nextQ: "Next",
        score: (r, t) => `${r} of ${t} correct`, again: "Again", privacy: "Your progress is saved in this browser – and with a <a href=\"account.html\">free account</a> in your account too, on all your devices.",
        reset: "Reset progress", resetQ: "Delete your progress for these cards?", tip: "Tip: say it out loud first, then flip – that’s what makes the word stick.",
        status: { green: "mastered", yellow: "practiced", red: "last answer wrong", grey: "new" }, barLabel: "Your progress in this topic",
        allTitle: "Picture cards", allLead: "Practice vocabulary on its own, apart from the lessons: look at the picture, say the word, listen. Each topic shows how well you know it.",
        overall: "All topics together", words: (n) => `${n} words`, practice: "Practice", start: "Start", topics: "← All topics",
    };

    const deckParam = new URLSearchParams(location.search).get("deck");
    const deckId = deckParam || "office";
    const deck = VOCAB_DECKS[deckId];
    if (!deck) { root.innerHTML = `<p><a href="${T.backHref}">${T.back}</a></p>`; return; }
    const page = lang === "de" ? "vokabeln.html" : "vocabulary.html";
    document.title = `${L(deck.title)} – ${lang === "de" ? "Bildkarten" : "Picture cards"} | Nawee`;
    const img = (w) => `assets/vocab/${deckId}/${w.id}.svg`;

    // ---------- storage ----------
    const today = () => new Date().toISOString().slice(0, 10);
    const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ cards: {}, last: {}, days: [], newDay: "", newCount: 0 }, load());
    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
    };
    const cid = (w) => `${deckId}/${w.id}`;
    if (data.newDay !== today()) { data.newDay = today(); data.newCount = 0; }

    // ---------- scheduling (simplified SM-2, as used by Anki) ----------
    const next = (state, grade) => {
        const s = Object.assign({ reps: 0, interval: 0, ease: 2.5 }, state);
        if (grade === 0) return { ...s, reps: 0, interval: 0, ease: Math.max(1.3, s.ease - 0.2), due: today() };
        let interval;
        if (grade === 1) interval = s.reps === 0 ? 1 : Math.max(1, Math.round(s.interval * 1.2));
        if (grade === 2) interval = s.reps === 0 ? 1 : s.reps === 1 ? 3 : Math.round(s.interval * s.ease);
        if (grade === 3) interval = s.reps === 0 ? 3 : Math.round(Math.max(1, s.interval) * s.ease * 1.3);
        const ease = Math.max(1.3, s.ease + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0));
        return { reps: s.reps + 1, interval, ease, due: addDays(interval) };
    };

    // ---------- audio: David's recording or the browser voice ----------
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const voice = () => synth?.getVoices().find((v) => /en.US/i.test(v.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(v.name))
        || synth?.getVoices().find((v) => /^en/i.test(v.lang)) || null;
    let current = null;
    const speak = (text, file) => {
        synth?.cancel(); if (current) { current.pause(); current = null; }
        if (file) { current = new Audio(file); current.play().catch(() => {}); return; }
        if (!synth) return;
        const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9;
        const v = voice(); if (v) u.voice = v;
        synth.speak(u);
    };
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const btn = (cls, html, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = `sl-btn ${cls}`; b.innerHTML = html; b.addEventListener("click", fn); return b; };

    // ---------- page frame ----------
    const markDay = () => { if (!data.days.includes(today())) { data.days.push(today()); data.days = data.days.slice(-400); save(); } };
    const streak = () => { let n = 0; const d = new Date(); while (data.days.includes(d.toISOString().slice(0, 10))) { n += 1; d.setDate(d.getDate() - 1); } return n; };
    const learnedCount = () => deck.words.filter((w) => (data.cards[cid(w)]?.reps || 0) > 0).length;

    // traffic light per word: red = last answer wrong, green = right 3 reviews in a row, yellow = practiced, grey = new
    const status = (w, d = deckId) => {
        const key = `${d}/${w.id}`;
        const last = data.last[key], card = data.cards[key];
        if (!last && !card) return "grey";
        if (last === "wrong") return "red";
        return (card?.reps || 0) >= 3 ? "green" : "yellow";
    };
    const ORDER = ["green", "yellow", "red", "grey"];
    const bar = (list = deck.words.map((w) => [w, deckId])) => {
        const n = { green: 0, yellow: 0, red: 0, grey: 0 };
        list.forEach(([w, d]) => { n[status(w, d)] += 1; });
        const total = list.length;
        return `<div class="vc-bar" role="img" aria-label="${T.barLabel}: ${ORDER.map((c) => `${n[c]} ${T.status[c]}`).join(", ")}">
                ${ORDER.map((c) => `<span class="vc-bar-${c}" style="width:${(n[c] / total) * 100}%"></span>`).join("")}
            </div>
            <ul class="vc-legend">${ORDER.map((c) => `<li><i class="vc-dot vc-dot-${c}"></i><strong>${n[c]}</strong> ${T.status[c]}</li>`).join("")}</ul>`;
    };
    // ---------- overview: all topics, each with its traffic-light bar ----------
    if (!deckParam && Object.keys(VOCAB_DECKS).length > 1) {
        const ids = Object.keys(VOCAB_DECKS);
        const all = ids.flatMap((d) => VOCAB_DECKS[d].words.map((w) => [w, d]));
        document.title = `${T.allTitle} | Nawee`;
        root.innerHTML = `<a class="lesson-back" href="${T.backHref}">${T.back}</a>
            <p class="eyebrow">${T.eyebrow}</p>
            <h1>${T.allTitle}</h1>
            <p class="as-lead">${T.allLead}</p>
            <div class="vc-progress vc-overall"><p class="vc-overall-label">${T.overall}</p>${bar(all)}</div>
            <div class="vc-topics">${ids.map((d) => {
                const k = VOCAB_DECKS[d];
                const begun = k.words.some((w) => status(w, d) !== "grey");
                return `<a class="vc-topic" href="${page}?deck=${d}">
                    <img src="assets/vocab/${d}/${k.words[0].id}.svg" alt="">
                    <div class="vc-topic-body">
                        <p class="vc-topic-meta">${esc(k.level)} · ${T.words(k.words.length)}</p>
                        <h2>${esc(L(k.title))}</h2>
                        ${bar(k.words.map((w) => [w, d]))}
                        <span class="vc-topic-go">${begun ? T.practice : T.start} →</span>
                    </div>
                </a>`;
            }).join("")}</div>
            <p class="as-disclaimer">${T.privacy}</p>`;
        return;
    }

    root.innerHTML = `<a class="lesson-back" href="${Object.keys(VOCAB_DECKS).length > 1 ? page : T.backHref}">${Object.keys(VOCAB_DECKS).length > 1 ? T.topics : T.back}</a>
        <p class="eyebrow">${T.eyebrow} · ${deck.level}</p>
        <h1>${esc(L(deck.title))}</h1>
        <p class="as-lead">${esc(L(deck.intro))}</p>
        <div class="vc-progress" data-bar></div>
        <div class="vc-stats" data-stats></div>
        <div class="vc-tabs" role="tablist">${T.modes.map((m, i) => `<button type="button" role="tab" class="vc-tab" data-mode="${i}">${m}</button>`).join("")}</div>
        <div class="vc-stage" data-stage></div>
        <p class="as-disclaimer">${T.privacy} <button type="button" class="link-button" data-reset>${T.reset}</button></p>`;
    const stage = root.querySelector("[data-stage]");
    const drawStats = () => {
        const due = deck.words.filter((w) => data.cards[cid(w)] && data.cards[cid(w)].due <= today()).length;
        const fresh = Math.min(NEW_PER_DAY - data.newCount, deck.words.filter((w) => !data.cards[cid(w)]).length);
        root.querySelector("[data-bar]").innerHTML = bar();
        root.querySelector("[data-stats]").innerHTML = `<span>${T.due(due, Math.max(0, fresh))}</span><span>${T.learned(learnedCount(), deck.words.length)}</span>${streak() ? `<span>${T.streak(streak())}</span>` : ""}`;
    };

    // ---------- mode 1: learn (spaced repetition) ----------
    let queue = [];
    const buildQueue = () => {
        const due = deck.words.filter((w) => data.cards[cid(w)] && data.cards[cid(w)].due <= today());
        const fresh = deck.words.filter((w) => !data.cards[cid(w)]).slice(0, Math.max(0, NEW_PER_DAY - data.newCount));
        queue = [...due, ...fresh];
    };
    const learn = () => {
        drawStats();
        if (!queue.length) {
            stage.innerHTML = `<div class="vc-done"><p class="vc-done-icon" aria-hidden="true">✓</p><h2>${T.doneTitle}</h2><p>${T.doneText}</p></div>`;
            return;
        }
        const w = queue[0];
        const state = data.cards[cid(w)];
        stage.innerHTML = `<div class="vc-card">
                <img class="vc-img" src="${img(w)}" alt="">
                <div class="vc-front"><p class="vc-ask">${T.ask}</p><p class="as-note">${T.tip}</p></div>
                <div class="vc-back" hidden>
                    <p class="vc-word">${esc(w.word)}</p>
                    ${lang === "de" ? `<p class="vc-de">${esc(w.de)}</p>` : ""}
                    <div class="sl-row vc-row" data-plays></div>
                    <p class="vc-example"><span>${T.example}:</span> “${esc(w.example)}”</p>
                    <div class="vc-rate" data-rate></div>
                </div>
            </div>`;
        const front = stage.querySelector(".vc-front"), back = stage.querySelector(".vc-back");
        const flip = btn("sl-play sl-big", T.flip, () => {
            front.hidden = true; flip.remove(); back.hidden = false;
            speak(w.word, w.audio);
        });
        front.append(flip);
        back.querySelector("[data-plays]").append(
            btn("sl-play", `<span aria-hidden="true">▶</span> ${esc(w.word)}`, () => speak(w.word, w.audio)),
            btn("", `<span aria-hidden="true">▶</span> ${T.example}`, () => speak(w.example, w.exAudio)));
        const rate = back.querySelector("[data-rate]");
        T.rate.forEach((label, grade) => {
            const n = next(state, grade);
            rate.append(btn(`vc-grade vc-grade-${grade}`, `<strong>${label}</strong><small>${T.days(n.interval)}</small>`, () => {
                if (!state) data.newCount += 1;
                else data.reviewDay = today(); // reviewed a known card today (account page: "today" tasks)
                data.cards[cid(w)] = n;
                data.last[cid(w)] = grade === 0 ? "wrong" : "right";
                queue.shift();
                if (grade === 0) queue.splice(Math.min(3, queue.length), 0, w); // comes back in this session
                markDay(); save(); learn();
            }));
        });
    };

    // ---------- mode 2: listen & pick the picture ----------
    const listen = () => {
        const rounds = [...deck.words].sort(() => Math.random() - 0.5).slice(0, 8);
        let i = 0, right = 0;
        const round = () => {
            if (i >= rounds.length) {
                stage.innerHTML = `<div class="vc-done"><h2>${T.score(right, rounds.length)}</h2></div>`;
                stage.querySelector(".vc-done").append(btn("sl-play sl-big", T.again, listen));
                markDay(); drawStats();
                return;
            }
            const w = rounds[i];
            const options = [w, ...deck.words.filter((x) => x !== w).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
            stage.innerHTML = `<div class="vc-listen"><p class="exercise-number">${i + 1} / ${rounds.length}</p><p class="vc-ask">${T.listenAsk}</p><div class="sl-row" data-play></div><div class="vc-grid" data-grid></div><p class="exercise-feedback" data-fb hidden></p></div>`;
            stage.querySelector("[data-play]").append(btn("sl-play sl-big", `<span aria-hidden="true">▶</span> ${T.play}`, () => speak(w.word, w.audio)));
            const grid = stage.querySelector("[data-grid]"), fb = stage.querySelector("[data-fb]");
            options.forEach((o) => {
                const b = btn("vc-pick", `<img src="${img(o)}" alt="${esc(o.word)}">`, () => {
                    const ok = o === w;
                    if (ok) right += 1;
                    data.last[cid(w)] = ok ? "right" : "wrong";
                    save(); drawStats();
                    b.classList.add(ok ? "is-right" : "is-wrong");
                    grid.querySelectorAll("button").forEach((x) => { x.disabled = true; });
                    grid.querySelector(`[data-word="${w.id}"]`)?.classList.add("is-right");
                    fb.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                    fb.innerHTML = `${ok ? "✓ " + T.right : "✗ " + T.wrong} <strong>${esc(w.word)}</strong>`;
                    fb.hidden = false;
                    fb.after(btn("sl-play", `${T.nextQ} →`, () => { i += 1; round(); }));
                });
                b.dataset.word = o.id;
                grid.append(b);
            });
            speak(w.word, w.audio);
        };
        round();
    };

    // ---------- mode 3: all words ----------
    const all = () => {
        stage.innerHTML = `<div class="vc-all" data-all></div>`;
        const box = stage.querySelector("[data-all]");
        deck.words.forEach((w) => {
            const b = btn("vc-item", `<i class="vc-dot vc-dot-${status(w)}" title="${T.status[status(w)]}"></i><img src="${img(w)}" alt=""><strong>${esc(w.word)}</strong>${lang === "de" ? `<small>${esc(w.de)}</small>` : ""}`, () => speak(w.word, w.audio));
            box.append(b);
        });
    };

    const modes = [() => { buildQueue(); learn(); }, listen, all];
    const select = (m) => {
        root.querySelectorAll(".vc-tab").forEach((t) => t.setAttribute("aria-selected", String(Number(t.dataset.mode) === m)));
        modes[m]();
    };
    root.querySelectorAll(".vc-tab").forEach((t) => t.addEventListener("click", () => select(Number(t.dataset.mode))));
    root.querySelector("[data-reset]").addEventListener("click", () => {
        if (!confirm(T.resetQ)) return;
        deck.words.forEach((w) => { delete data.cards[cid(w)]; delete data.last[cid(w)]; });
        data.newCount = 0; save(); select(0);
    });
    select(0);
})();
