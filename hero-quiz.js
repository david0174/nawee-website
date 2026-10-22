// Homepage hero: three quick questions visitors can answer right away – no sign-up, nothing is sent anywhere.
// Two tracks: "Improve my English" (learners) and "Communicate better" (communication skills).
// Only the chosen track is remembered in the browser. Replaces the hero illustration with an interactive card
// (the illustration stays as fallback without JavaScript).

(() => {
    const root = document.querySelector("[data-hero-quiz]");
    if (!root) return;

    const TRACK_KEY = "nawee-hero-track";
    const de = document.documentElement.lang === "de";

    const T = de ? {
        label: "Jetzt ausprobieren – ohne Anmeldung", question: (n, t) => `Frage ${n} von ${t}`, listen: "Anhören",
        right: "Richtig!", wrong: "Nicht ganz – versuch es noch einmal.", next: "Weiter", finish: "Ergebnis ansehen",
        doneTitle: (s, t) => s === t ? "Stark – alles richtig!" : `${s} von ${t} beim ersten Versuch`,
        again: "Nochmal", switchLabel: "Was möchtest du üben?",
    } : {
        label: "Try it now – no sign-up", question: (n, t) => `Question ${n} of ${t}`, listen: "Listen",
        right: "Correct!", wrong: "Not quite – try again.", next: "Next", finish: "See my result",
        doneTitle: (s, t) => s === t ? "Great – all correct!" : `${s} of ${t} on the first try`,
        again: "Play again", switchLabel: "What would you like to practice?",
    };

    // say: an English phrase that can be read aloud; answer: index of the correct option;
    // optionsLang: set when the options are in English on the German page
    const TRACKS = de ? {
        english: {
            tab: "Englisch verbessern",
            questions: [
                { prompt: "Deine Kollegin sagt:", say: "Let's touch base next week.", ask: "Was meint sie?",
                  options: ["Lass uns nächste Woche wieder sprechen.", "Lass uns nächste Woche Baseball spielen.", "Lass uns nächste Woche im Büro treffen.", "Lass uns das Projekt nächste Woche beenden."],
                  answer: 0, explain: "„Touch base“ heißt: kurz Kontakt aufnehmen, sich abstimmen." },
                { prompt: "Du willst sagen: „Ich bekomme den Bericht morgen.“ Was ist richtig?",
                  options: ["I'll get the report tomorrow.", "I'll become the report tomorrow.", "I'll take me the report tomorrow.", "I'll be the report tomorrow."],
                  answer: 0, optionsLang: "en", explain: "Vorsicht, falscher Freund: „become“ heißt „werden“. „Bekommen“ ist „get“ oder „receive“." },
                { prompt: "Du hast etwas nicht verstanden. Was sagst du am natürlichsten?",
                  options: ["Sorry, could you say that again?", "What?", "Repeat, please.", "I don't understand English."],
                  answer: 0, optionsLang: "en", explain: "Höflich und ganz normal – das sagen auch Muttersprachler ständig." },
            ],
            doneText: "Das war ein kleiner Vorgeschmack. Im Kommunikations-Check findest du in 3 Minuten heraus, wo dein Englisch steht.",
            primary: { href: "kommunikations-check.html", text: "Kommunikations-Check starten" },
            secondary: { href: "business-english-test.html", text: "oder den Business-English-Test machen →" },
            footer: { href: "kommunikations-check.html", text: "oder direkt zum Kommunikations-Check →" },
        },
        communication: {
            tab: "Besser kommunizieren", tabNote: "auf Englisch",
            questions: [
                { prompt: "Im Meeting fragt dich jemand nach deiner Meinung. Was klingt am selbstbewusstesten?",
                  options: ["I'd suggest we move the launch to May.", "Sorry, maybe I'm wrong, but…", "I just think possibly…", "This might be a dumb idea, but…"],
                  answer: 0, optionsLang: "en", explain: "Klar, freundlich – und ohne dich kleinzumachen." },
                { prompt: "Dein Chef fragt: „How did the client meeting go?“ Welche Antwort kommt direkt auf den Punkt?",
                  options: ["They're signing – with one small change to the contract.", "So we got there at ten, and first they showed us their office…", "It was interesting, lots of people.", "Hard to say, there were good and bad parts."],
                  answer: 0, optionsLang: "en", explain: "Das Ergebnis zuerst, dann das Wichtigste. Die Geschichte kann warten." },
                { prompt: "Eine Kollegin bittet dich, morgen ihre Präsentation zu übernehmen – du bist komplett ausgebucht. Was antwortest du?",
                  options: ["I can't tomorrow, but I could help with your slides today.", "Sure! (und dann bis Mitternacht arbeiten)", "Maybe, let me see…", "Sorry, sorry, I have so much, and my boss, and…"],
                  answer: 0, optionsLang: "en", explain: "Ein klares Nein mit einer echten Alternative – kurz und freundlich." },
            ],
            doneText: "Das war ein kleiner Vorgeschmack. Der kostenlose Communication Course geht weiter – 21 kurze Lektionen auf Englisch, ohne Anmeldung.",
            primary: { href: "communication-lesson.html?l=1-1", text: "Gratis-Lektion starten" },
            secondary: { href: "https://davidnawee.com/communication-coaching.html", text: "oder Communication Coaching ansehen →" },
            footer: { href: "communication-lesson.html?l=1-1", text: "oder direkt zur Gratis-Lektion (auf Englisch) →" },
        },
    } : {
        english: {
            tab: "Improve my English",
            questions: [
                { prompt: "Your colleague says:", say: "Let's touch base next week.", ask: "What do they mean?",
                  options: ["Let's talk again next week.", "Let's play baseball next week.", "Let's meet at headquarters next week.", "Let's finish the project next week."],
                  answer: 0, explain: "“Touch base” means to check in briefly with someone." },
                { prompt: "Which sentence is correct?",
                  options: ["I'll get the report tomorrow.", "I'll become the report tomorrow.", "I'll take me the report tomorrow.", "I'll be getting me the report tomorrow."],
                  answer: 0, explain: "Careful with false friends: German “bekommen” means “get”, while “become” means “werden”." },
                { prompt: "You didn't catch what someone said. What's the most natural reply?",
                  options: ["Sorry, could you say that again?", "What?", "Repeat, please.", "I don't understand English."],
                  answer: 0, explain: "Polite and natural – native speakers say this all the time." },
            ],
            doneText: "That was a small taste. The free Communication Check shows where your English stands – in about 3 minutes.",
            primary: { href: "communication-check.html", text: "Take the Communication Check" },
            secondary: { href: "business-english-test.html", text: "or take the Business English Test →" },
            footer: { href: "communication-check.html", text: "or go straight to the Communication Check →" },
        },
        communication: {
            tab: "Communicate better",
            questions: [
                { prompt: "Someone asks for your opinion in a meeting. Which answer sounds most confident?",
                  options: ["I'd suggest we move the launch to May.", "Sorry, maybe I'm wrong, but…", "I just think possibly…", "This might be a dumb idea, but…"],
                  answer: 0, explain: "Clear and polite – without putting yourself down." },
                { prompt: "Your boss asks: “How did the client meeting go?” Which answer leads with the point?",
                  options: ["They're signing – with one small change to the contract.", "So we got there at ten, and first they showed us their office…", "It was interesting, lots of people.", "Hard to say, there were good and bad parts."],
                  answer: 0, explain: "Outcome first, then the key detail. The story can wait." },
                { prompt: "A colleague asks you to take over their presentation tomorrow. You're fully booked. What do you say?",
                  options: ["I can't tomorrow, but I could help with your slides today.", "Sure! (and then work until midnight)", "Maybe, let me see…", "Sorry, sorry, I have so much, and my boss, and…"],
                  answer: 0, explain: "A clear no with a real alternative – short and kind." },
            ],
            doneText: "That was a small taste. The free Communication Course goes further – 21 short lessons, no sign-up.",
            primary: { href: "communication-lesson.html?l=1-1", text: "Start the free lesson" },
            secondary: { href: "https://davidnawee.com/communication-coaching.html", text: "or see Communication Coaching →" },
            footer: { href: "communication-lesson.html?l=1-1", text: "or start the full free lesson →" },
        },
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    const canSpeak = "speechSynthesis" in window;
    const speak = (text) => {
        if (!canSpeak) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = .9;
        speechSynthesis.speak(u);
    };
    const SPEAKER = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;

    let track = "english";
    try { if (TRACKS[localStorage.getItem(TRACK_KEY)]) track = localStorage.getItem(TRACK_KEY); } catch { /* storage unavailable */ }
    let pos = 0, xp = 0, firstTry = 0;
    const current = () => TRACKS[track];

    const setTrack = (name, remember = true) => {
        if (!TRACKS[name] || name === track) return;
        track = name;
        if (remember) { try { localStorage.setItem(TRACK_KEY, name); } catch { /* storage unavailable */ } }
        pos = 0; xp = 0; firstTry = 0;
        renderQuestion();
    };

    const head = () => {
        const qs = current().questions;
        return `<div class="hq-switch" role="group" aria-label="${T.switchLabel}">
                ${Object.entries(TRACKS).map(([name, t]) => `<button type="button" class="hq-switch-option" data-track="${name}" aria-pressed="${name === track}">${esc(t.tab)}${t.tabNote ? `<small>${esc(t.tabNote)}</small>` : ""}</button>`).join("")}
            </div>
            <div class="hq-head">
                <div class="hq-dots" aria-hidden="true">${qs.map((q, i) => `<span class="${i < pos ? "is-done" : i === pos ? "is-current" : ""}"></span>`).join("")}</div>
                <span class="hq-xp" aria-label="${xp} XP"><span aria-hidden="true">★</span> <span data-xp>${xp}</span> XP</span>
            </div>`;
    };

    const renderQuestion = () => {
        const t = current();
        const q = t.questions[pos];
        const order = shuffle(q.options.map((o, i) => i));
        root.innerHTML = `${head()}
            <div class="hq-body">
                <p class="hq-label">${T.label}</p>
                <p class="hq-count">${T.question(pos + 1, t.questions.length)}</p>
                <p class="hq-prompt">${esc(q.prompt)}</p>
                ${q.say ? `<button type="button" class="hq-say" data-say ${canSpeak ? "" : "disabled"}><span class="hq-say-icon" aria-hidden="true">${SPEAKER}</span><em lang="en">${esc(q.say)}</em><span class="visually-hidden">${T.listen}</span></button>` : ""}
                ${q.ask ? `<p class="hq-prompt">${esc(q.ask)}</p>` : ""}
                <div class="hq-options">${order.map((i) => `<button type="button" class="hq-option" data-i="${i}"${q.optionsLang ? ` lang="${q.optionsLang}"` : ""}>${esc(q.options[i])}</button>`).join("")}</div>
                <p class="hq-feedback" data-feedback role="status"></p>
                <div class="hq-actions" data-actions></div>
            </div>
            <a class="hq-footer" href="${t.footer.href}">${t.footer.text}</a>`;

        let missed = false;
        root.querySelector("[data-say]")?.addEventListener("click", () => speak(q.say));
        root.querySelectorAll(".hq-option").forEach((btn) => {
            btn.addEventListener("click", () => {
                const ok = Number(btn.dataset.i) === q.answer;
                const fb = root.querySelector("[data-feedback]");
                if (!ok) {
                    missed = true;
                    btn.classList.add("is-wrong");
                    btn.disabled = true;
                    fb.textContent = T.wrong;
                    fb.className = "hq-feedback is-wrong";
                    return;
                }
                btn.classList.add("is-right");
                root.querySelectorAll(".hq-option").forEach((b) => { b.disabled = true; });
                if (!missed) { firstTry += 1; xp += 10; }
                const xpEl = root.querySelector("[data-xp]");
                xpEl.textContent = xp;
                xpEl.parentElement.classList.add("is-bump");
                fb.innerHTML = `<strong>✓ ${T.right}</strong> ${esc(q.explain)}`;
                fb.className = "hq-feedback is-right";
                const last = pos === t.questions.length - 1;
                const actions = root.querySelector("[data-actions]");
                actions.innerHTML = `<button type="button" class="button primary hq-next">${last ? T.finish : T.next} <span aria-hidden="true">→</span></button>`;
                const next = actions.querySelector("button");
                next.addEventListener("click", () => { pos += 1; last ? renderDone() : renderQuestion(); });
                next.focus({ preventScroll: true });
            });
        });
    };

    const renderDone = () => {
        const t = current();
        root.innerHTML = `${head()}
            <div class="hq-body hq-done">
                <p class="hq-trophy" aria-hidden="true">🏆</p>
                <p class="hq-label">+${xp} XP</p>
                <h2 class="hq-title">${T.doneTitle(firstTry, t.questions.length)}</h2>
                <p class="hq-text">${t.doneText}</p>
                <a class="button primary" href="${t.primary.href}">${t.primary.text} <span aria-hidden="true">→</span></a>
                <a class="hq-secondary" href="${t.secondary.href}">${t.secondary.text}</a>
                <button type="button" class="link-button hq-again" data-again>${T.again}</button>
            </div>`;
        root.querySelector("[data-again]").addEventListener("click", () => { pos = 0; xp = 0; firstTry = 0; renderQuestion(); });
    };

    // track switch (event delegation, since the card is redrawn)
    root.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-track]");
        if (btn) setTrack(btn.dataset.track);
    });

    // hero tabs above the headline: "English Coaching" / "Communication Coaching" also pick the matching track
    document.querySelectorAll('.hero-audience[href="#angebote"], .hero-audience[href="#communication"]').forEach((tab) => {
        tab.addEventListener("click", () => setTrack(tab.getAttribute("href") === "#communication" ? "communication" : "english"));
    });

    root.classList.add("is-live");
    renderQuestion();
})();
