// "Get started" questions (start.html / get-started.html): David asks a few quick questions,
// one per screen, then the learner gets a personal plan with the right first step.
// The answers are the learner's profile ("nawee-profile-v1" in this browser; synced to the account by account.js).
// The first time someone finishes, the bare answers (no name, no email, no account) are counted in Supabase
// so David can see what learners want – see ../Nawee_Supabase/04-onboarding.sql and the privacy policy.

(() => {
    const root = document.querySelector("[data-onboarding]");
    if (!root) return;

    const KEY = "nawee-profile-v1";
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key (insert-only table, protected by Row Level Security)
    const de = document.documentElement.lang === "de";

    const Q = de ? [
        { id: "source", ask: "Wo bist du auf Nawee gestoßen?", options: [
            ["google", "🔍", "Bei Google"], ["instagram", "📸", "Auf Instagram oder Facebook"], ["linkedin", "💼", "Auf LinkedIn"],
            ["youtube", "▶️", "Auf YouTube"], ["friends", "👋", "Jemand hat es mir empfohlen"], ["school", "🏫", "In der Schule, Uni oder Firma"],
            ["other", "✨", "Woanders"]] },
        { id: "goal", ask: "Wofür brauchst du Englisch?", options: [
            ["travel", "✈️", "Unterwegs zurechtkommen"], ["work", "💼", "Für meinen Job"], ["school", "🎓", "Für Schule oder Studium"],
            ["abroad", "🏠", "Für ein Leben im Ausland"], ["people", "💬", "Um mit Menschen zu reden, die mir wichtig sind"], ["fun", "🎉", "Einfach, weil ich Lust darauf habe"]] },
        { id: "level", ask: "Wie gut ist dein Englisch gerade?", levels: true, options: [
            [0, "Neu", "Ich starte bei null."], [1, "A1", "Ein bisschen: Begrüßungen und einzelne Wörter."],
            [2, "A2", "Ich komme im Alltag gerade so zurecht."], [3, "B1–B2", "Ich kann mich gut unterhalten."],
            [4, "C1+", "Ich spreche fließend und will souveräner werden."]] },
        { id: "focus", ask: "Was soll als Erstes besser werden?", options: [
            ["listening", "👂", "Englisch besser verstehen"], ["speaking", "🗣️", "Freier sprechen"], ["vocab", "📚", "Mehr Wörter kennen"],
            ["pronunciation", "👄", "Meine Aussprache"], ["confidence", "💪", "Ohne Angst vor Fehlern reden"]] },
        { id: "minutes", ask: "Wie viel Zeit hast du pro Tag?", options: [
            [5, "☕", "5 Minuten", "Kurz zwischendurch"], [10, "🎧", "10 Minuten", "Eine kleine Routine"],
            [15, "📅", "15 Minuten", "Ein fester Termin"], [20, "🎯", "20 Minuten oder mehr", "Volle Konzentration"]] },
    ] : [
        { id: "source", ask: "Where did you find Nawee?", options: [
            ["google", "🔍", "On Google"], ["instagram", "📸", "On Instagram or Facebook"], ["linkedin", "💼", "On LinkedIn"],
            ["youtube", "▶️", "On YouTube"], ["friends", "👋", "Someone recommended it"], ["school", "🏫", "At school, college or work"],
            ["other", "✨", "Somewhere else"]] },
        { id: "goal", ask: "What do you need English for?", options: [
            ["travel", "✈️", "Getting around abroad"], ["work", "💼", "My job"], ["school", "🎓", "School or college"],
            ["abroad", "🏠", "Living in another country"], ["people", "💬", "Talking with people who matter to me"], ["fun", "🎉", "Simply because I enjoy it"]] },
        { id: "level", ask: "How good is your English right now?", levels: true, options: [
            [0, "New", "I’m starting from zero."], [1, "A1", "A little: greetings and a few words."],
            [2, "A2", "I can just about get by in everyday life."], [3, "B1–B2", "I can hold a good conversation."],
            [4, "C1+", "I’m fluent and want to sound more polished."]] },
        { id: "focus", ask: "What should get better first?", options: [
            ["listening", "👂", "Understanding English"], ["speaking", "🗣️", "Speaking more freely"], ["vocab", "📚", "Knowing more words"],
            ["pronunciation", "👄", "My pronunciation"], ["confidence", "💪", "Talking without fear of mistakes"]] },
        { id: "minutes", ask: "How much time do you have each day?", options: [
            [5, "☕", "5 minutes", "A quick break"], [10, "🎧", "10 minutes", "A small routine"],
            [15, "📅", "15 minutes", "A fixed time slot"], [20, "🎯", "20 minutes or more", "Full focus"]] },
    ];

    const T = de ? {
        hello: "Hi, ich bin David! Ein paar kurze Fragen, dann stelle ich deinen Lernplan zusammen.",
        go: "Los geht’s", next: "Weiter", back: "Zurück",
        ready: "Dein Lernplan ist fertig!",
        labels: { goal: "Ziel", level: "Stand", focus: "Fokus", minutes: "Pro Tag" },
        start: "Hier fängst du an",
        beginner: { title: "Lektion 1.1: Sich vorstellen", text: "Hören, nachsprechen, selbst sprechen – mit echten Aufnahmen. Danach übst du die ersten Wörter mit Bildkarten.", href: "beruf-lektion.html?l=1-1", cta: "Lektion starten" },
        middle: { title: "Bildkarten: Im Büro", text: "20 Wörter mit Bild und Aufnahme – sag das Wort laut, bevor du es hörst. Dazu Lektion 1.1 zum Warmwerden.", href: "vokabeln.html", cta: "Bildkarten üben" },
        advanced: { title: "Kurs: Sicher sprechen", text: "Kurze Lektionen für echte Gespräche: Nachfragen, Meinung sagen, Small Talk. Vorher kannst du im Check sehen, wo du stehst.", href: "kurs.html", cta: "Kurs starten" },
        check: { href: "kommunikations-check.html", text: "Erst den Kommunikations-Check machen (3 Min.)" },
        cards: { href: "vokabeln.html", text: "Bildkarten üben" },
        lesson: { href: "beruf-lektion.html?l=1-1", text: "Lektion 1.1 ansehen" },
        daily: (m) => `Dein Ziel: ${m} Minuten am Tag. Eine Lektion dauert etwa 10 Minuten, eine Runde Bildkarten etwa 5.`,
        save: "Möchtest du deinen Plan und Fortschritt auf jedem Gerät haben?",
        saveLink: "Kostenloses Konto erstellen", saveHref: "konto.html?mode=signup&next=start.html", saved: (n) => `✓ Dein Plan ist in deinem Konto gespeichert (<strong>${n}</strong>) und auf allen Geräten da.`,
        noSign: "Kein Konto nötig – dein Plan ist in diesem Browser gespeichert.",
        redo: "Fragen neu beantworten",
        path: { href: "fuer-mich.html", text: "Zu deinem Lernweg →" },
    } : {
        hello: "Hi, I’m David! A few quick questions, then I’ll put together your learning plan.",
        go: "Let’s go", next: "Continue", back: "Back",
        ready: "Your learning plan is ready!",
        labels: { goal: "Goal", level: "Level", focus: "Focus", minutes: "Per day" },
        start: "Start here",
        beginner: { title: "Lesson 1.1: Introducing yourself", text: "Listen, repeat, speak on your own – with real recordings. Then practice your first words with picture cards.", href: "work-lesson.html?l=1-1", cta: "Start the lesson" },
        middle: { title: "Picture cards: At the office", text: "20 words with pictures and recordings – say the word out loud before you hear it. Plus lesson 1.1 to warm up.", href: "vocabulary.html", cta: "Practice picture cards" },
        advanced: { title: "Communication Course", text: "Short lessons for real conversations: asking follow-up questions, giving your opinion, small talk. Check where you stand first if you like.", href: "communication-course.html", cta: "Start the course" },
        check: { href: "communication-check.html", text: "Take the Communication Check first (3 min)" },
        cards: { href: "vocabulary.html", text: "Practice picture cards" },
        lesson: { href: "work-lesson.html?l=1-1", text: "See lesson 1.1" },
        daily: (m) => `Your goal: ${m} minutes a day. A lesson takes about 10 minutes, a round of picture cards about 5.`,
        save: "Want your plan and progress on every device?",
        saveLink: "Create a free account", saveHref: "account.html?mode=signup&next=get-started.html", saved: (n) => `✓ Your plan is saved in your account (<strong>${n}</strong>) and available on all your devices.`,
        noSign: "No account needed – your plan is saved in this browser.",
        redo: "Answer the questions again",
        path: { href: "for-me.html", text: "Go to your learning path →" },
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
    const save = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ } };

    // anonymous count of the answers, only the first time in a browser (answering again would distort the numbers);
    // fire and forget – the page works the same if it fails
    const count = (a) => {
        fetch(`${SUPABASE_URL}/rest/v1/onboarding_answers`, {
            method: "POST",
            headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({ lang: de ? "de" : "en", source: a.source, goal: a.goal, level: a.level, focus: a.focus, minutes: a.minutes }),
            keepalive: true,
        }).catch(() => {});
    };

    const answers = {};
    let step = -1; // -1 = welcome

    const shell = (bubble, body, { progress = 0, canNext = false, nextLabel = T.next, back = true } = {}) => {
        root.innerHTML = `
            <div class="ob-top">
                ${back ? `<button type="button" class="ob-back" aria-label="${T.back}">←</button>` : `<span class="ob-back-space"></span>`}
                <span class="ob-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress * 100)}"><span style="width:${progress * 100}%"></span></span>
            </div>
            <div class="ob-speaker">
                <img src="assets/david-avatar.jpg" alt="" width="72" height="72">
                <p class="ob-bubble">${bubble}</p>
            </div>
            ${body}
            <div class="ob-bottom">
                <button type="button" class="button primary ob-next"${canNext ? "" : " disabled"}>${nextLabel}</button>
            </div>`;
        const b = root.querySelector(".ob-back");
        if (b) b.addEventListener("click", () => { step -= 1; render(); });
    };

    const render = () => {
        window.scrollTo({ top: 0 });
        if (step === -1) {
            shell(esc(T.hello), "", { canNext: true, nextLabel: T.go, back: false });
            root.querySelector(".ob-next").addEventListener("click", () => { step = 0; render(); });
            return;
        }
        if (step >= Q.length) return plan();
        const q = Q[step];
        const list = q.options.map(([value, icon, label, sub]) => {
            const picked = answers[q.id] === value;
            const art = q.levels
                ? `<span class="ob-level" aria-hidden="true">${esc(icon)}</span>`
                : `<span class="ob-icon" aria-hidden="true">${icon}</span>`;
            return `<button type="button" class="ob-option${picked ? " is-picked" : ""}" aria-pressed="${picked}" data-value="${esc(value)}">
                ${art}<span class="ob-label">${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ""}</span></button>`;
        }).join("");
        shell(esc(q.ask), `<div class="ob-options${q.levels || q.options.length < 6 ? " ob-options-1" : ""}">${list}</div>`,
            { progress: (step + 1) / (Q.length + 1), canNext: answers[q.id] !== undefined });
        const next = root.querySelector(".ob-next");
        root.querySelectorAll(".ob-option").forEach((btn, i) => btn.addEventListener("click", () => {
            answers[q.id] = q.options[i][0];
            root.querySelectorAll(".ob-option").forEach((x) => { x.classList.toggle("is-picked", x === btn); x.setAttribute("aria-pressed", x === btn); });
            next.disabled = false;
        }));
        next.addEventListener("click", () => {
            if (answers[q.id] === undefined) return;
            step += 1;
            if (step >= Q.length) {
                const firstTime = !load();
                save({ ...answers, date: new Date().toISOString().slice(0, 10) });
                if (firstTime) count(answers);
                window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
            }
            render();
        });
    };

    const labelOf = (id, value) => {
        const o = Q.find((q) => q.id === id).options.find((x) => x[0] === value);
        return o ? o[2].replace(/\.$/, "") : "";
    };

    // logged in (account.js tells us): the plan is saved in the account; otherwise offer one
    let accountName = "";
    const saveBox = () => accountName
        ? `<p>${T.saved(esc(accountName))}</p>`
        : `<p><strong>${T.save}</strong> <a href="${T.saveHref}">${T.saveLink} →</a></p><p class="ob-small">${T.noSign}</p>`;
    window.addEventListener("nawee:account", (e) => {
        accountName = (e.detail && e.detail.name) || "";
        const box = root.querySelector("[data-ob-save]");
        if (box) box.innerHTML = saveBox();
        // answers from another device arrived while the welcome screen is open: show the plan
        const synced = load();
        if (step === -1 && synced && synced.level !== undefined) { Object.assign(answers, synced); plan(); }
    });

    const plan = () => {
        step = Q.length;
        const p = load() || answers;
        const level = Number(p.level) || 0;
        const rec = level <= 1 ? T.beginner : level === 2 ? T.middle : T.advanced;
        const extra = level <= 1 ? T.cards : level === 2 ? T.lesson : T.check;
        const chips = ["goal", "level", "focus"].map((id) => `<li><span>${T.labels[id]}</span>${esc(labelOf(id, p[id]))}</li>`).join("")
            + (p.minutes ? `<li><span>${T.labels.minutes}</span>${esc(labelOf("minutes", p.minutes))}</li>` : "");
        root.innerHTML = `
            <div class="ob-top"><span class="ob-back-space"></span><span class="ob-progress"><span style="width:100%"></span></span></div>
            <div class="ob-speaker">
                <img src="assets/david-avatar.jpg" alt="" width="72" height="72">
                <p class="ob-bubble">${T.ready}</p>
            </div>
            <ul class="ob-summary">${chips}</ul>
            <div class="ob-rec">
                <p class="ob-rec-label">${T.start}</p>
                <h2>${rec.title}</h2>
                <p>${rec.text}</p>
                <a class="button primary" href="${rec.href}">${rec.cta} →</a>
                <a class="ob-rec-extra" href="${extra.href}">${extra.text} →</a>
            </div>
            ${p.minutes ? `<p class="ob-daily">${T.daily(p.minutes)}</p>` : ""}
            <div class="ob-save" data-ob-save>${saveBox()}</div>
            <p class="ob-links"><a href="${T.path.href}">${T.path.text}</a> · <button type="button" class="ob-redo">${T.redo}</button></p>`;
        root.querySelector(".ob-redo").addEventListener("click", () => {
            Object.keys(answers).forEach((k) => delete answers[k]);
            step = -1;
            render();
        });
    };

    // came back later: show the saved plan (with the option to answer again)
    const saved = load();
    if (saved && saved.level !== undefined) { Object.assign(answers, saved); plan(); } else render();
})();
