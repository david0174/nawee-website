// Homepage carousel under the hero: events (e.g. the web seminar, until it has taken place) and Nawee's features.
// Auto-rotates every 6 s, pauses on hover/focus and in background tabs, dots + arrows + swipe;
// no auto-rotation for visitors who turned off animations.

(() => {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const de = document.documentElement.lang === "de";
    const P = (dePage, enPage) => (de ? dePage : enPage);

    const slides = [
        {
            until: "2026-11-23T19:30:00+01:00",
            tag: de ? "🎙️ LIVE-EVENT · KOSTENLOS" : "🎙️ LIVE EVENT · FREE",
            title: de ? "Wie du dir selbst Englisch beibringst" : "How to Teach Yourself English",
            text: de ? "Mit den Werkzeugen, die du schon hast. Montag, 23. November, 19:00–19:30 Uhr auf Google Meet – live mit David. Anmeldung mit kostenlosem Konto." : "Using the tools you already have. Monday, November 23, 7:00–7:30 pm (German time) on Google Meet – live with David. Sign up with a free account.",
            cta: de ? "Platz sichern" : "Save your seat", href: P("webseminar.html", "web-seminar.html"),
            visual: `<div class="cs-date"><span>${de ? "NOV" : "NOV"}</span><strong>23</strong><em>19:00</em></div><div class="cs-seats">🎙️<small>${de ? "Live & kostenlos" : "Live & free"}</small></div>`,
        },
        {
            desktopOnly: true, // on phones the app link sits in the burger menu instead
            tag: de ? "📲 NEU · NAWEE ALS APP" : "📲 NEW · NAWEE AS AN APP",
            title: de ? "Nawee als App – auch auf dem Computer" : "Nawee as an app – on your computer too",
            text: de ? "Ein Klick im Browser, und Nawee öffnet sich wie ein eigenes Programm – mit eigenem Symbol, im Vollbild und auch offline. Kostenlos, ohne App Store." : "One click in your browser and Nawee opens like its own program – with its own icon, full screen and also offline. Free, no app store.",
            cta: de ? "So geht’s" : "How it works", href: P("app.html", "app-en.html"),
            visual: `<div class="cs-icons"><span>💻</span><span>📲</span><span>✈️</span><span>🎧</span><span>🖼️</span><span>🆓</span></div>`,
        },
        {
            tag: de ? "💼 BALD VERFÜGBAR" : "💼 COMING SOON",
            title: de ? "Business English für echte Situationen" : "Business English for real situations",
            text: de ? "Vorstellungsgespräch, Small Talk, Messen, Meetings und Präsentationen: Du übst die Momente, in denen es im Beruf zählt – mit Rollenspielen und Feedback zu deinem Fortschritt." : "Job interviews, small talk, trade fairs, meetings and presentations: practice the moments that matter at work – with role-plays and feedback on your progress.",
            cta: de ? "Mehr erfahren" : "Learn more", href: P("lernen.html#business-english", "learn.html#business-english"),
            visual: `<div class="cs-icons"><span>🤝</span><span>☕</span><span>🏛️</span><span>📋</span><span>🎤</span><span>⭐</span></div>`,
        },
        {
            tag: de ? "🎧 LEKTIONEN" : "🎧 LESSONS",
            title: de ? "Hören, nachsprechen, selbst sprechen" : "Listen, repeat, speak",
            text: de ? "Kurze Lektionen mit echten Gesprächen zwischen Tom und Ben – vom ersten Wort bis A2, mit Hintergrundgeräuschen wie im echten Leben." : "Short lessons with real conversations between Tom and Ben – from your first word to A2, with background sounds like in real life.",
            cta: de ? "Erste Lektion starten" : "Start the first lesson", href: P("beruf-lektion.html?l=1-1", "work-lesson.html?l=1-1"),
            visual: `<div class="cs-chat"><p class="b">Hi Tom! Are you free this weekend?</p><p class="t">I’m free on Saturday. Why?</p><span class="cs-play">▶</span></div>`,
        },
        {
            tag: de ? "👋 PERSÖNLICH MIT DAVID" : "👋 LEARN WITH DAVID",
            title: de ? "Schneller weiter mit einem Coach" : "Go further, faster, with a coach",
            text: de ? "Englisch-Coaching, Englischunterricht und Workshops – eins zu eins mit David, online oder in Hannover. Bald auch kostenlose Kurse zu Selbstvertrauen, Kommunikation und Stress." : "English coaching, English lessons and workshops – one-on-one with David, online or in Hannover. Coming soon: free courses on confidence, communication and stress.",
            cta: de ? "Zu davidnawee.com" : "Visit davidnawee.com", href: de ? "https://davidnawee.com/" : "https://davidnawee.com/index-en.html", external: true,
            visual: `<div class="cs-coach"><img src="assets/david-avatar.jpg" alt=""><strong>David Nawee</strong><small>${de ? "Coach · Muttersprachler aus den USA" : "Coach · native speaker from the US"}</small><span>${de ? "Erstgespräch kostenlos" : "Free intro call"}</span></div>`,
        },
        {
            tag: de ? "🖼️ BILDKARTEN" : "🖼️ PICTURE CARDS",
            title: de ? "100 Wörter mit Bild und Ton" : "100 words with pictures and sound",
            text: de ? "Bild ansehen, Wort laut sagen, anhören – mit Wiederholung im richtigen Abstand. Die Ampel zeigt dir, wie sicher du schon bist." : "Look at the picture, say the word, listen – with spaced repetition. The traffic light shows how well you know each word.",
            cta: de ? "Bildkarten üben" : "Practice picture cards", href: P("vokabeln.html", "vocabulary.html"),
            visual: `<div class="cs-card"><img src="assets/vocab/home/key.svg" alt=""><strong>key</strong><span class="cs-bar"><i style="width:35%;background:#1e9e5a"></i><i style="width:25%;background:#f5c542"></i><i style="width:10%;background:#d64545"></i></span></div>`,
        },
        {
            tag: de ? "📰 LESEN" : "📰 READING",
            title: de ? "Einfache Nachrichten auf Englisch" : "Simple news in English",
            text: de ? "Echte Ereignisse in einfachem Englisch – zum Vorlesen lassen, mit Übersetzung per Tipp und Fragen zum Verständnis." : "Real events in simple English – read aloud for you, with translations on tap and questions to check your understanding.",
            cta: de ? "Zu den Lesetexten" : "Go to reading", href: P("lesen.html", "reading.html"),
            visual: `<div class="cs-news"><small>A2 · NEWS</small><strong>A Mars rover breaks a record</strong><p>NASA’s Perseverance <u>rover</u> is on Mars…</p></div>`,
        },
        {
            tag: de ? "🎮 SPIELE" : "🎮 GAMES",
            title: de ? "Tippen, reimen, gewinnen" : "Type, rhyme, win",
            text: de ? "Typing Race gegen Tom und Ben, Word Rain, Wort & Bedeutung und Reim-Zeit mit eigenen Beats." : "Typing Race against Tom and Ben, Word Rain, Word & Meaning and Rhyme Time with our own beats.",
            cta: de ? "Jetzt spielen" : "Play now", href: P("spiele.html", "games.html"),
            visual: `<div class="cs-race"><p><span>${de ? "Du" : "You"}</span><i style="left:62%">🚗</i></p><p><span>Tom</span><i style="left:40%">🚙</i></p><p><span>Ben</span><i style="left:52%">🏎️</i></p></div>`,
        },
        {
            tag: de ? "🧭 SELBST LERNEN" : "🧭 LEARN ON YOUR OWN",
            title: de ? "Englisch ist überall" : "English is everywhere",
            text: de ? "Zuhause, in der Stadt, auf dem Handy und mit KI: So sammelst du jeden Tag ein bisschen Englisch ein." : "At home, in your city, on your phone and with AI: how to collect a little English every day.",
            cta: de ? "Zum Guide" : "Read the guide", href: P("selbst-lernen.html", "learn-on-your-own.html"),
            visual: `<div class="cs-icons"><span>🏠</span><span>📝</span><span>🏙️</span><span>📱</span><span>🤖</span><span>⏱️</span></div>`,
        },
    ].filter((s) => (!s.until || new Date() < new Date(s.until))
        && (!s.desktopOnly || (window.matchMedia("(min-width: 1001px) and (hover: hover)").matches && !window.matchMedia("(display-mode: standalone)").matches)));

    root.innerHTML = `<div class="cs-viewport"><div class="cs-track" aria-live="off">${slides.map((s, i) => `
            <article class="cs-slide" role="group" aria-roledescription="${de ? "Folie" : "slide"}" aria-label="${i + 1} / ${slides.length}" ${i ? 'aria-hidden="true"' : ""}>
                <div class="cs-copy">
                    <p class="cs-tag">${s.tag}</p>
                    <h2>${s.title}</h2>
                    <p>${s.text}</p>
                    <div class="cs-actions">
                        <a class="button primary" href="${s.href}" ${s.external ? 'target="_blank" rel="noopener"' : ""} ${i ? 'tabindex="-1"' : ""}>${s.cta} <span aria-hidden="true">${s.external ? "↗" : "→"}</span></a>
                        ${s.cta2 ? `<a class="cs-link2" href="${s.href2}" target="_blank" rel="noopener" ${i ? 'tabindex="-1"' : ""}>${s.cta2} <span aria-hidden="true">↗</span></a>` : ""}
                    </div>
                </div>
                <div class="cs-visual" aria-hidden="true">${s.visual}</div>
            </article>`).join("")}</div></div>
        <div class="cs-controls">
            <button type="button" class="cs-arrow" data-prev aria-label="${de ? "Vorherige Folie" : "Previous slide"}">‹</button>
            <div class="cs-dots">${slides.map((_, i) => `<button type="button" aria-label="${de ? "Folie" : "Slide"} ${i + 1}"></button>`).join("")}</div>
            <button type="button" class="cs-arrow" data-next aria-label="${de ? "Nächste Folie" : "Next slide"}">›</button>
        </div>`;

    const track = root.querySelector(".cs-track"), items = [...root.querySelectorAll(".cs-slide")], dots = [...root.querySelectorAll(".cs-dots button")];
    let i = 0, timer = null, paused = false;
    const show = (n) => {
        i = (n + items.length) % items.length;
        track.style.transform = `translateX(-${i * 100}%)`;
        items.forEach((el, k) => {
            el.setAttribute("aria-hidden", String(k !== i));
            el.querySelectorAll("a").forEach((a) => (k === i ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1")));
        });
        dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => { clearInterval(timer); if (!still && items.length > 1) timer = setInterval(() => { if (!paused && !document.hidden) show(i + 1); }, 6000); };
    root.querySelector("[data-prev]").addEventListener("click", () => { show(i - 1); start(); });
    root.querySelector("[data-next]").addEventListener("click", () => { show(i + 1); start(); });
    dots.forEach((d, k) => d.addEventListener("click", () => { show(k); start(); }));
    root.addEventListener("mouseenter", () => { paused = true; });
    root.addEventListener("mouseleave", () => { paused = false; });
    root.addEventListener("focusin", () => { paused = true; });
    root.addEventListener("focusout", () => { paused = false; });
    // swipe on phones
    let x0 = null;
    track.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    track.addEventListener("pointerup", (e) => {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) { show(i + (dx < 0 ? 1 : -1)); start(); }
    });
    if (items.length < 2) root.querySelector(".cs-controls").hidden = true;
    show(0);
    start();
})();
