// Homepage carousel under the hero: events (e.g. the web seminar, until it has taken place) and Nawee's features.
// Auto-rotates every 6 s, pauses on hover/focus and in background tabs, dots + arrows + swipe;
// no auto-rotation for visitors who turned off animations.

(() => {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const de = document.documentElement.lang === "de";
    const tr = document.documentElement.lang === "tr";
    const TR_PAGE = { "vocabulary.html": "vocabulary-tr.html", "grammar.html": "grammar-tr.html", "learn.html": "learn-tr.html", "reading.html": "reading-tr.html", "about.html": "about-tr.html", "games.html": "games-tr.html" };
    // Turkish twin of an English page, keeping ?query and #hash
    const P = (dePage, enPage) => (de ? dePage : tr ? enPage.replace(/^[^?#]+/, (f) => TR_PAGE[f] || f) : enPage);
    // Turkish (2026-11-07): the English text is looked up in this list; anything missing stays English
    const TRX = {"🎙️ LIVE EVENT · FREE": "🎙️ CANLI ETKİNLİK · ÜCRETSİZ", "How to Teach Yourself English": "Kendi Kendine İngilizce Öğrenmek", "Using the tools you already have. Monday, November 23, 7:00–7:30 pm (German time) on Google Meet – live with David. Sign up with a free account.": "Zaten sahip olduğun araçlarla. 23 Kasım Pazartesi, 19:00–19:30 (Almanya saati, İngilizce) Google Meet’te – David ile canlı. Ücretsiz bir hesapla kayıt ol.", "Save your seat": "Yerini ayırt", "NOV": "KAS", "Live & free": "Canlı ve ücretsiz", "📅 WEEKLY READ · NEW EVERY MONDAY": "📅 HAFTANIN OKUMA METNİ · HER PAZARTESİ YENİ", "Five new texts – from A1 to C1": "Beş yeni metin – A1’den C1’e", "New this week at your level – read and listen, with translations on tap, questions and a speaking task.": "Bu hafta senin seviyende yeni – oku ve dinle, dokununca çeviri, sorular ve bir konuşma görevi.", "Every week one text for every level: read and listen, with translations on tap, questions and a speaking task. Pick your level – or try one higher.": "Her hafta her seviye için bir metin: oku ve dinle, dokununca çeviri, sorular ve bir konuşma görevi. Seviyeni seç – ya da bir üstünü dene.", "Read it now": "Hemen oku", "Read this week’s texts": "Bu haftanın metinlerini oku", "📲 NEW · NAWEE AS AN APP": "📲 YENİ · UYGULAMA OLARAK NAWEE", "Nawee as an app – on your computer too": "Uygulama olarak Nawee – bilgisayarında da", "One click in your browser and Nawee opens like its own program – with its own icon, full screen and also offline. Free, no app store.": "Tarayıcında tek tıkla Nawee ayrı bir program gibi açılır – kendi simgesiyle, tam ekran ve çevrimdışı da. Ücretsiz, uygulama mağazası gerekmez.", "How it works": "Nasıl çalışır?", "💼 COMING SOON": "💼 YAKINDA", "Business English for real situations": "Gerçek durumlar için İş İngilizcesi", "Job interviews, small talk, trade fairs, meetings and presentations: practice the moments that matter at work – with role-plays and feedback on your progress.": "İş görüşmeleri, sohbet, fuarlar, toplantılar ve sunumlar: iş hayatında önemli anları çalış – rol oyunları ve ilerlemen hakkında geri bildirimle.", "Learn more": "Daha fazla bilgi", "🎧 LESSONS": "🎧 DERSLER", "Listen, repeat, speak": "Dinle, tekrar et, konuş", "Short lessons with real conversations between Tom and Ben – from your first word to A2, with background sounds like in real life.": "Tom ve Ben arasındaki gerçek sohbetlerle kısa dersler – ilk kelimenden A2’ye, gerçek hayattaki gibi arka plan sesleriyle.", "Start the first lesson": "İlk derse başla", "👋 LEARN WITH DAVID": "👋 DAVID İLE ÖĞREN", "Go further, faster, with lessons": "Derslerle daha hızlı, daha ileri", "English lessons for every level – one-on-one with David, online or in Hannover. General English and Professional English, with a free intro call.": "Her seviye için İngilizce dersleri – David ile birebir, online ya da Hannover’da. Genel İngilizce ve Mesleki İngilizce, ücretsiz bir tanışma görüşmesiyle.", "Lessons & prices": "Dersler ve fiyatlar", "English teacher · native speaker from the US": "İngilizce öğretmeni · ABD’den, anadili İngilizce", "Free intro call": "Ücretsiz tanışma görüşmesi", "🖼️ PICTURE CARDS": "🖼️ RESİMLİ KARTLAR", "100 words with pictures and sound": "Resimli ve sesli 200 kelime", "Look at the picture, say the word, listen – with spaced repetition. The traffic light shows how well you know each word.": "Resme bak, kelimeyi söyle, dinle – aralıklı tekrarla. Trafik ışığı her kelimeyi ne kadar iyi bildiğini gösterir. Anlamları Türkçe.", "Practice picture cards": "Resimli kartları çalış", "📰 READING": "📰 OKUMA", "Simple news in English": "Basit İngilizceyle haberler", "Real events in simple English – read aloud for you, with translations on tap and questions to check your understanding.": "Gerçek olaylar basit İngilizceyle – senin için sesli okunur, dokununca çeviri ve anladığını kontrol eden sorularla.", "Go to reading": "Okumaya git", "🎮 GAMES": "🎮 OYUNLAR", "Type, rhyme, win": "Yaz, kafiye yap, kazan", "Typing Race against Tom and Ben, Word Rain, Word & Meaning and Rhyme Time with our own beats.": "Tom ve Ben’e karşı Yazma Yarışı, Kelime Yağmuru, Kelime ve Anlam ve kendi ritimlerimizle Kafiye Zamanı.", "Play now": "Hemen oyna", "You": "Sen", "🧭 LEARN ON YOUR OWN": "🧭 KENDİ BAŞINA ÖĞREN", "English is everywhere": "İngilizce her yerde", "At home, in your city, on your phone and with AI: how to collect a little English every day.": "Evde, şehrinde, telefonunda ve yapay zekâyla: her gün biraz İngilizce toplamanın yolları.", "Read the guide": "Rehberi oku", "slide": "slayt", "Previous slide": "Önceki slayt", "Slide": "Slayt", "Next slide": "Sonraki slayt"};
    const tx = (d, e) => (de ? d : tr ? (TRX[e] !== undefined ? TRX[e] : e) : e);

    // the learner's level (placement test → "get started" answers → level map choice) – set for logged-in learners
    // and for guests who did the test; "" = unknown, then the carousel stays general
    const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
    const learnerLevel = (() => {
        try {
            const c = JSON.parse(localStorage.getItem("nawee-course-v1") || "{}");
            if (c.level) return c.level === "below-A2" ? "A1" : LEVELS.includes(c.level) ? c.level : "";
            const p = JSON.parse(localStorage.getItem("nawee-profile-v1") || "{}");
            if (p.level !== undefined && p.level !== null) return ["A1", "A1", "A2", "B1", "C1"][p.level] || "";
            const m = localStorage.getItem("nawee-level") || "";
            return m.startsWith("B2") ? "B2" : LEVELS.includes(m) ? m : "";
        } catch { return ""; }
    })();
    // this week's weekly read at the learner's level (reading-data.js is loaded before this script)
    const myRead = (() => {
        if (!learnerLevel || typeof READINGS === "undefined") return null;
        const today = new Date().toISOString().slice(0, 10);
        const week = READINGS.filter((r) => r.kind === "weekly" && r.week <= today).map((r) => r.week).sort().pop();
        return READINGS.find((r) => r.kind === "weekly" && r.week === week && r.level === learnerLevel) || null;
    })();

    const slides = [
        {
            until: "2026-11-23T19:30:00+01:00",
            tag: tx("🎙️ LIVE-EVENT · KOSTENLOS", "🎙️ LIVE EVENT · FREE"),
            title: tx("Wie du dir selbst Englisch beibringst", "How to Teach Yourself English"),
            text: tx("Mit den Werkzeugen, die du schon hast. Montag, 23. November, 19:00–19:30 Uhr auf Google Meet – live mit David. Anmeldung mit kostenlosem Konto.", "Using the tools you already have. Monday, November 23, 7:00–7:30 pm (German time) on Google Meet – live with David. Sign up with a free account."),
            cta: tx("Platz sichern", "Save your seat"), href: P("webseminar.html", "web-seminar.html"),
            visual: `<div class="cs-date"><span>${tx("NOV", "NOV")}</span><strong>23</strong><em>19:00</em></div><div class="cs-seats">🎙️<small>${tx("Live & kostenlos", "Live & free")}</small></div>`,
        },
        {
            weekly: true,
            tag: myRead ? (de ? `📅 DEIN LESETEXT DER WOCHE · ${myRead.level}` : (tr ? `📅 HAFTANIN OKUMA METNİN · ${myRead.level}` : `📅 YOUR WEEKLY READ · ${myRead.level}`)) : tx("📅 LESETEXT DER WOCHE · JEDEN MONTAG NEU", "📅 WEEKLY READ · NEW EVERY MONDAY"),
            title: myRead ? myRead.title : tx("Fünf neue Texte – von A1 bis C1", "Five new texts – from A1 to C1"),
            text: myRead ? (tx("Neu diese Woche, passend zu deinem Niveau – zum Lesen und Anhören, mit Übersetzung per Tipp, Fragen und einer Sprechaufgabe.", "New this week at your level – read and listen, with translations on tap, questions and a speaking task."))
                : tx("Jede Woche ein Text für jedes Niveau: zum Lesen und Anhören, mit Übersetzung per Tipp, Fragen und einer Sprechaufgabe. Such dir dein Niveau aus – oder probier eins höher.", "Every week one text for every level: read and listen, with translations on tap, questions and a speaking task. Pick your level – or try one higher."),
            cta: myRead ? (tx("Jetzt lesen", "Read it now")) : tx("Zum Lesetext der Woche", "Read this week’s texts"),
            href: myRead ? P(`lesen.html?t=${myRead.id}`, `reading.html?t=${myRead.id}`) : P("lesen.html#weekly", "reading.html#weekly"),
            visual: `<div class="cs-levels">${LEVELS.map((l) => `<span${l === learnerLevel ? ' class="is-mine"' : ""}>${l}</span>`).join("")}</div>`,
        },
        {
            desktopOnly: true, // on phones the app link sits in the burger menu instead
            tag: tx("📲 NEU · NAWEE ALS APP", "📲 NEW · NAWEE AS AN APP"),
            title: tx("Nawee als App – auch auf dem Computer", "Nawee as an app – on your computer too"),
            text: tx("Ein Klick im Browser, und Nawee öffnet sich wie ein eigenes Programm – mit eigenem Symbol, im Vollbild und auch offline. Kostenlos, ohne App Store.", "One click in your browser and Nawee opens like its own program – with its own icon, full screen and also offline. Free, no app store."),
            cta: tx("So geht’s", "How it works"), href: P("app.html", "app-en.html"),
            visual: `<div class="cs-icons"><span>💻</span><span>📲</span><span>✈️</span><span>🎧</span><span>🖼️</span><span>🆓</span></div>`,
        },
        {
            levels: ["B1", "B2", "C1"],
            tag: tx("💼 BALD VERFÜGBAR", "💼 COMING SOON"),
            title: tx("Business English für echte Situationen", "Business English for real situations"),
            text: tx("Vorstellungsgespräch, Small Talk, Messen, Meetings und Präsentationen: Du übst die Momente, in denen es im Beruf zählt – mit Rollenspielen und Feedback zu deinem Fortschritt.", "Job interviews, small talk, trade fairs, meetings and presentations: practice the moments that matter at work – with role-plays and feedback on your progress."),
            cta: tx("Mehr erfahren", "Learn more"), href: P("lernen.html#business-english", "learn.html#business-english"),
            visual: `<div class="cs-icons"><span>🤝</span><span>☕</span><span>🏛️</span><span>📋</span><span>🎤</span><span>⭐</span></div>`,
        },
        {
            levels: ["A1", "A2"],
            tag: tx("🎧 LEKTIONEN", "🎧 LESSONS"),
            title: tx("Hören, nachsprechen, selbst sprechen", "Listen, repeat, speak"),
            text: tx("Kurze Lektionen mit echten Gesprächen zwischen Tom und Ben – vom ersten Wort bis A2, mit Hintergrundgeräuschen wie im echten Leben.", "Short lessons with real conversations between Tom and Ben – from your first word to A2, with background sounds like in real life."),
            cta: tx("Erste Lektion starten", "Start the first lesson"), href: P("beruf-lektion.html?l=1-1", "work-lesson.html?l=1-1"),
            visual: `<div class="cs-chat"><p class="b">Hi Tom! Are you free this weekend?</p><p class="t">I’m free on Saturday. Why?</p><span class="cs-play">▶</span></div>`,
        },
        {
            tag: tx("👋 PERSÖNLICH MIT DAVID", "👋 LEARN WITH DAVID"),
            title: tx("Schneller weiter mit Englischunterricht", "Go further, faster, with lessons"),
            text: tx("Englischunterricht für jedes Niveau – eins zu eins mit David, online oder in Hannover. Allgemeines Englisch und Berufsenglisch, mit kostenlosem Kennenlerngespräch.", "English lessons for every level – one-on-one with David, online or in Hannover. General English and Professional English, with a free intro call."),
            cta: tx("Unterricht & Preise", "Lessons & prices"), href: tx("/lessons/", "/lessons/index-en.html"), external: true,
            visual: `<div class="cs-coach"><img src="assets/david-avatar.jpg" alt=""><strong>David Nawee</strong><small>${tx("Englischlehrer · Muttersprachler aus den USA", "English teacher · native speaker from the US")}</small><span>${tx("Erstgespräch kostenlos", "Free intro call")}</span></div>`,
        },
        {
            levels: ["A1", "A2"],
            tag: tx("🖼️ BILDKARTEN", "🖼️ PICTURE CARDS"),
            title: tx("100 Wörter mit Bild und Ton", "100 words with pictures and sound"),
            text: tx("Bild ansehen, Wort laut sagen, anhören – mit Wiederholung im richtigen Abstand. Die Ampel zeigt dir, wie sicher du schon bist.", "Look at the picture, say the word, listen – with spaced repetition. The traffic light shows how well you know each word."),
            cta: tx("Bildkarten üben", "Practice picture cards"), href: P("vokabeln.html", "vocabulary.html"),
            visual: `<div class="cs-card"><img src="assets/vocab/home/key.svg" alt=""><strong>key</strong><span class="cs-bar"><i style="width:35%;background:#1e9e5a"></i><i style="width:25%;background:#f5c542"></i><i style="width:10%;background:#d64545"></i></span></div>`,
        },
        {
            tag: tx("📰 LESEN", "📰 READING"),
            title: tx("Einfache Nachrichten auf Englisch", "Simple news in English"),
            text: tx("Echte Ereignisse in einfachem Englisch – zum Vorlesen lassen, mit Übersetzung per Tipp und Fragen zum Verständnis.", "Real events in simple English – read aloud for you, with translations on tap and questions to check your understanding."),
            cta: tx("Zu den Lesetexten", "Go to reading"), href: P("lesen.html", "reading.html"),
            visual: `<div class="cs-news"><small>A2 · NEWS</small><strong>A Mars rover breaks a record</strong><p>NASA’s Perseverance <u>rover</u> is on Mars…</p></div>`,
        },
        {
            tag: tx("🎮 SPIELE", "🎮 GAMES"),
            title: tx("Tippen, reimen, gewinnen", "Type, rhyme, win"),
            text: tx("Typing Race gegen Tom und Ben, Word Rain, Wort & Bedeutung und Reim-Zeit mit eigenen Beats.", "Typing Race against Tom and Ben, Word Rain, Word & Meaning and Rhyme Time with our own beats."),
            cta: tx("Jetzt spielen", "Play now"), href: P("spiele.html", "games.html"),
            visual: `<div class="cs-race"><p><span>${tx("Du", "You")}</span><i style="left:62%">🚗</i></p><p><span>Tom</span><i style="left:40%">🚙</i></p><p><span>Ben</span><i style="left:52%">🏎️</i></p></div>`,
        },
        {
            tag: tx("🧭 SELBST LERNEN", "🧭 LEARN ON YOUR OWN"),
            title: tx("Englisch ist überall", "English is everywhere"),
            text: tx("Zuhause, in der Stadt, auf dem Handy und mit KI: So sammelst du jeden Tag ein bisschen Englisch ein.", "At home, in your city, on your phone and with AI: how to collect a little English every day."),
            cta: tx("Zum Guide", "Read the guide"), href: P("selbst-lernen.html", "learn-on-your-own.html"),
            visual: `<div class="cs-icons"><span>🏠</span><span>📝</span><span>🏙️</span><span>📱</span><span>🤖</span><span>⏱️</span></div>`,
        },
    ].filter((s) => (!s.until || new Date() < new Date(s.until))
        && (!s.desktopOnly || (window.matchMedia("(min-width: 1001px) and (hover: hover)").matches && !window.matchMedia("(display-mode: standalone)").matches)));
    // known level: "your weekly read" first, then slides that fit the level, then the rest (nothing is hidden)
    if (learnerLevel) {
        const rank = (s) => (s.weekly && myRead ? 0 : s.until ? 1 : !s.levels || s.levels.includes(learnerLevel) ? 2 : 3);
        slides.sort((a, b) => rank(a) - rank(b));
    }

    root.innerHTML = `<div class="cs-viewport"><div class="cs-track" aria-live="off">${slides.map((s, i) => `
            <article class="cs-slide" role="group" aria-roledescription="${tx("Folie", "slide")}" aria-label="${i + 1} / ${slides.length}" ${i ? 'aria-hidden="true"' : ""}>
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
            <button type="button" class="cs-arrow" data-prev aria-label="${tx("Vorherige Folie", "Previous slide")}">‹</button>
            <div class="cs-dots">${slides.map((_, i) => `<button type="button" aria-label="${tx("Folie", "Slide")} ${i + 1}"></button>`).join("")}</div>
            <button type="button" class="cs-arrow" data-next aria-label="${tx("Nächste Folie", "Next slide")}">›</button>
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
