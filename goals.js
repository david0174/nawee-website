// Learning goals (David, 2026-11-07): WHY someone learns English, the exact situation, short- or long-term, an optional date –
// and from that a personal plan with a short-term part (concrete steps for the next weeks) and a long-term part (level target
// + daily routine). Used by onboarding.js (start pages) and account.js (dashboard). Languages: de / en / tr.

window.NaweeGoals = (() => {
    const lang = { de: "de", tr: "tr" }[(document.documentElement.lang || "en").slice(0, 2)] || "en";
    const t = (o) => (o && typeof o === "object" ? o[lang] || o.en : o) || "";
    const PAGES = {
        de: { lesson: "beruf-lektion.html", cards: "vokabeln.html", grammar: "grammatik.html", read: "lesen.html", games: "spiele.html", music: "musik.html", check: "kommunikations-check.html", interview: "vorstellungsgespraech.html" },
        en: { lesson: "work-lesson.html", cards: "vocabulary.html", grammar: "grammar.html", read: "reading.html", games: "games.html", music: "music.html", check: "communication-check.html", interview: "interview.html" },
        tr: { lesson: "work-lesson.html", cards: "vocabulary-tr.html", grammar: "grammar-tr.html", read: "reading-tr.html", games: "games-tr.html", music: "music.html", check: "communication-check.html", interview: "interview-tr.html" },
    }[lang];

    // ---------- questions ----------
    const GOAL_Q = { de: "Warum lernst du Englisch?", en: "Why are you learning English?", tr: "Neden İngilizce öğreniyorsun?" };
    const GOALS = [
        ["work", "💼", { de: "Für meinen Job", en: "For my job", tr: "İşim için" }],
        ["school", "🎓", { de: "Für Schule oder Uni", en: "For school or university", tr: "Okul ya da üniversite için" }],
        ["exam", "📝", { de: "Für eine Prüfung (z. B. IELTS, Cambridge, Abitur)", en: "For an exam (e.g. IELTS, Cambridge, TOEFL)", tr: "Bir sınav için (örn. IELTS, TOEFL, YDS)" }],
        ["partner", "❤️", { de: "Für meinen Partner oder meine Familie", en: "For my partner or family", tr: "Partnerim ya da ailem için" }],
        ["abroad", "🏠", { de: "Für einen Umzug ins Ausland", en: "To move abroad", tr: "Yurt dışına taşınmak için" }],
        ["travel", "✈️", { de: "Zum Reisen", en: "For travel", tr: "Seyahat için" }],
        ["friends", "👋", { de: "Für Freunde und Kontakte", en: "For friends and contacts", tr: "Arkadaşlar ve tanıdıklar için" }],
        ["fun", "🎉", { de: "Einfach, weil ich Lust darauf habe", en: "Just because I enjoy it", tr: "Sadece hoşuma gittiği için" }],
    ];
    const DETAIL_Q = { de: "Wofür genau?", en: "What exactly?", tr: "Tam olarak ne için?" };
    const DETAILS = {
        work: [
            ["meeting", "🗓️", { de: "Ein Meeting", en: "A meeting", tr: "Bir toplantı" }],
            ["presentation", "📊", { de: "Eine Präsentation", en: "A presentation", tr: "Bir sunum" }],
            ["interview", "🤝", { de: "Ein Vorstellungsgespräch", en: "A job interview", tr: "Bir iş görüşmesi" }],
            ["emails", "✉️", { de: "E-Mails und Nachrichten", en: "Emails and messages", tr: "E-postalar ve mesajlar" }],
            ["phone", "📞", { de: "Telefonate und Videocalls", en: "Phone and video calls", tr: "Telefon ve görüntülü görüşmeler" }],
            ["smalltalk", "☕", { de: "Small Talk mit Kollegen", en: "Small talk with colleagues", tr: "İş arkadaşlarıyla sohbet" }],
        ],
        school: [
            ["oral", "🎤", { de: "Mündliche Prüfung oder Referat", en: "An oral exam or a talk in class", tr: "Sözlü sınav ya da sınıfta sunum" }],
            ["written", "📝", { de: "Klassenarbeiten und Tests", en: "Written tests", tr: "Yazılı sınavlar" }],
            ["homework", "📚", { de: "Hausaufgaben", en: "Homework", tr: "Ödevler" }],
            ["discussions", "💬", { de: "Im Unterricht mitreden", en: "Joining class discussions", tr: "Derste konuşmalara katılmak" }],
        ],
        exam: [
            ["ielts", "🌍", { de: "IELTS", en: "IELTS", tr: "IELTS" }],
            ["toefl", "🇺🇸", { de: "TOEFL", en: "TOEFL", tr: "TOEFL" }],
            ["cambridge", "🎓", { de: "Cambridge (B2 First, C1 Advanced)", en: "Cambridge (B2 First, C1 Advanced)", tr: "Cambridge (B2 First, C1 Advanced)" }],
            ["school-exam", "🏫", { de: "Abitur oder Schulabschluss", en: "A school-leaving exam", tr: "Okul ya da üniversite sınavı (örn. YDS, YKS)" }],
            ["other", "✨", { de: "Eine andere Prüfung", en: "Another exam", tr: "Başka bir sınav" }],
        ],
        partner: [
            ["partner", "💑", { de: "Mit meinem Partner sprechen", en: "Talking with my partner", tr: "Partnerimle konuşmak" }],
            ["family", "👨‍👩‍👧", { de: "Die Familie kennenlernen", en: "Meeting the family", tr: "Aileyle tanışmak" }],
            ["everyday", "🏡", { de: "Den Alltag zusammen", en: "Everyday life together", tr: "Birlikte günlük hayat" }],
        ],
        abroad: [
            ["job", "💼", { de: "Im Ausland arbeiten", en: "Working abroad", tr: "Yurt dışında çalışmak" }],
            ["studies", "🎓", { de: "Im Ausland studieren", en: "Studying abroad", tr: "Yurt dışında okumak" }],
            ["everyday", "🏙️", { de: "Alltag: Ämter, Wohnung, Einkaufen", en: "Everyday life: offices, apartment, shopping", tr: "Günlük hayat: resmi işler, ev, alışveriş" }],
            ["people", "👋", { de: "Neue Leute kennenlernen", en: "Meeting new people", tr: "Yeni insanlarla tanışmak" }],
        ],
        travel: [
            ["airport", "🛫", { de: "Flughafen und Hotel", en: "Airport and hotel", tr: "Havalimanı ve otel" }],
            ["restaurant", "🍽️", { de: "Restaurant und Einkaufen", en: "Restaurants and shopping", tr: "Restoran ve alışveriş" }],
            ["directions", "🗺️", { de: "Nach dem Weg fragen", en: "Asking for directions", tr: "Yol sormak" }],
            ["locals", "🗣️", { de: "Mit Einheimischen reden", en: "Talking with locals", tr: "Yerel insanlarla konuşmak" }],
        ],
        friends: [
            ["online", "🎮", { de: "Online: Games, Chats, Social Media", en: "Online: games, chats, social media", tr: "Online: oyunlar, sohbetler, sosyal medya" }],
            ["visitors", "🧳", { de: "Besuch aus dem Ausland", en: "Friends visiting from abroad", tr: "Yurt dışından gelen arkadaşlar" }],
            ["events", "🎉", { de: "Internationale Treffen und Events", en: "International meetups and events", tr: "Uluslararası buluşmalar ve etkinlikler" }],
            ["smalltalk", "☕", { de: "Einfach ins Gespräch kommen", en: "Just starting conversations", tr: "Sohbete başlamak" }],
        ],
        fun: [
            ["series", "🎬", { de: "Filme und Serien", en: "Films and series", tr: "Film ve diziler" }],
            ["music", "🎵", { de: "Musik", en: "Music", tr: "Müzik" }],
            ["books", "📖", { de: "Bücher und Artikel", en: "Books and articles", tr: "Kitaplar ve makaleler" }],
            ["games", "🕹️", { de: "Spiele", en: "Games", tr: "Oyunlar" }],
        ],
    };
    const HORIZON_Q = { de: "Ist es ein kurzfristiges oder ein langfristiges Ziel?", en: "Is it a short-term or a long-term goal?", tr: "Kısa vadeli mi, uzun vadeli bir hedef mi?" };
    const HORIZONS = [
        ["soon", "⏰", { de: "Bald – in den nächsten Wochen steht etwas an", en: "Soon – something is coming up in the next weeks", tr: "Yakında – önümüzdeki haftalarda bir şey var" }],
        ["months", "📆", { de: "In ein paar Monaten", en: "In a few months", tr: "Birkaç ay içinde" }],
        ["long", "🌱", { de: "Langfristig, ohne festen Termin", en: "Long-term, no fixed date", tr: "Uzun vadeli, belirli bir tarih yok" }],
    ];
    const DUE_Q = { de: "Gibt es schon ein Datum?", en: "Is there a date already?", tr: "Belli bir tarih var mı?" };
    const NO_DATE = { de: "Noch kein Datum", en: "No date yet", tr: "Henüz tarih yok" };
    const opts = (list) => list.map(([v, i, l]) => [v, i, t(l)]);
    const questions = (answers) => [
        { id: "goal", ask: t(GOAL_Q), options: opts(GOALS) },
        { id: "detail", ask: t(DETAIL_Q), options: opts(DETAILS[answers.goal] || DETAILS.fun) },
        { id: "horizon", ask: t(HORIZON_Q), options: opts(HORIZONS) },
        ...(answers.horizon === "soon" ? [{ id: "due", ask: t(DUE_Q), date: true, noDate: t(NO_DATE) }] : []),
    ];
    const label = (id, value, goal) => {
        const list = id === "goal" ? GOALS : id === "detail" ? DETAILS[goal] || [] : id === "horizon" ? HORIZONS : [];
        const o = list.find((x) => x[0] === value);
        return o ? t(o[2]) : "";
    };
    // older answers ("people" = talking with people who matter) → friends
    const normalize = (p) => ({ ...p, goal: p.goal === "people" ? "friends" : p.goal });

    // ---------- plan building blocks ----------
    const CC = { "1-1": "Drop the hedges", "1-2": "Own your ideas", "1-3": "Stay calm under pressure", "2-1": "Lead with your point", "2-2": "Structure answers on the spot",
        "2-3": "Explain complex ideas simply", "3-1": "Listen to understand", "3-2": "Ask better questions", "3-3": "Check understanding", "4-2": "Disagree respectfully",
        "5-1": "Get heard in meetings", "5-2": "Lead a focused meeting", "6-1": "Structure that sticks", "6-2": "Voice, pace and presence", "6-3": "Nerves and tough questions",
        "7-1": "Plain English without talking down", "7-2": "Idioms, irony and indirectness" };
    const DECK = { office: { de: "Im Büro", en: "At the office", tr: "Ofiste" }, home: { de: "Zuhause", en: "At home", tr: "Evde" }, food: { de: "Essen & Trinken", en: "Food & drinks", tr: "Yiyecek ve içecek" },
        town: { de: "In der Stadt", en: "In town", tr: "Şehirde" }, travel: { de: "Reisen", en: "Travel", tr: "Seyahat" }, health: { de: "Körper & Gesundheit", en: "Body & health", tr: "Vücut ve sağlık" },
        freetime: { de: "Freizeit & Hobbys", en: "Free time & hobbies", tr: "Boş zaman ve hobiler" } };
    const GRAM = { "past-simple": { de: "Past simple", en: "Past simple", tr: "Past simple – geçmiş zaman" }, "present-continuous": { de: "Present continuous", en: "Present continuous", tr: "Present continuous – şimdiki zaman" },
        comparatives: { de: "Vergleiche (bigger, the biggest)", en: "Comparatives & superlatives", tr: "Karşılaştırma (bigger, the biggest)" }, future: { de: "going to & will (Zukunft)", en: "Going to & will", tr: "going to & will (gelecek zaman)" } };
    const W = { cc: { de: "Kommunikationskurs", en: "Communication Course", tr: "İletişim Kursu" }, l11: { de: "Lektion 1.1: Dich vorstellen", en: "Lesson 1.1: Introducing yourself", tr: "Ders 1.1: Kendini tanıtmak" },
        cards: { de: "Bildkarten", en: "Picture cards", tr: "Resimli kartlar" }, gram: { de: "Grammatik", en: "Grammar", tr: "Dilbilgisi" },
        read: { de: "Lesetext der Woche auf deinem Niveau", en: "This week’s reading text at your level", tr: "Bu haftanın okuma metni – senin seviyende" },
        betest: { de: "Business-English-Test (5 Min.)", en: "Business English Test (5 min)", tr: "İş İngilizcesi Testi (5 dk, İngilizce)" },
        iv1: { de: "Vorstellungsgespräch, Lektion 1: Erzählen Sie etwas über sich", en: "Job interview, lesson 1: Tell me about yourself", tr: "İş görüşmesi, ders 1: Bize biraz kendinizden bahsedin" },
        check: { de: "Kommunikations-Check (3 Min.)", en: "Communication Check (3 min)", tr: "İletişim Testi (3 dk, İngilizce)" },
        games: { de: "Spiele: Tippen, Reimen, Wörter", en: "Games: typing, rhymes, words", tr: "Oyunlar: yazma, kafiye, kelimeler" },
        music: { de: "Songs mit Lyrics", en: "Songs with lyrics", tr: "Şarkı sözleriyle şarkılar" } };
    const step = {
        cc: (id) => ({ text: `${t(W.cc)}: ${CC[id]}`, href: `communication-lesson.html?l=${id}` }),
        l11: () => ({ text: t(W.l11), href: `${PAGES.lesson}?l=1-1` }),
        cards: (d) => ({ text: `${t(W.cards)}: ${t(DECK[d])}`, href: `${PAGES.cards}?deck=${d}` }),
        gram: (id) => ({ text: `${t(W.gram)}: ${t(GRAM[id])}`, href: `${PAGES.grammar}?l=${id}` }),
        read: () => ({ text: t(W.read), href: `${PAGES.read}#weekly` }),
        betest: () => ({ text: t(W.betest), href: "business-english-test.html" }),
        iv: (n) => ({ text: t(W[`iv${n}`]), href: `${PAGES.interview}?l=${n}` }),
        check: () => ({ text: t(W.check), href: PAGES.check }),
        games: () => ({ text: t(W.games), href: PAGES.games }),
        music: () => ({ text: t(W.music), href: PAGES.music }),
        say: (o) => ({ text: t(o), speak: true }),
    };
    const SAY = {
        meeting: { de: "Schreib 3 Sätze auf, die du im Meeting sagen willst, und sprich sie laut.", en: "Write down 3 sentences you want to say in the meeting and say them out loud.", tr: "Toplantıda söylemek istediğin 3 cümleyi yaz ve yüksek sesle söyle." },
        presentation: { de: "Übe die ersten 3 Sätze deiner Präsentation laut – langsam und deutlich.", en: "Practice the first 3 sentences of your presentation out loud – slowly and clearly.", tr: "Sunumunun ilk 3 cümlesini yüksek sesle çalış – yavaş ve net." },
        interview: { de: "Beantworte „Tell me about yourself“ in 4 Sätzen – laut.", en: "Answer “Tell me about yourself” in 4 sentences – out loud.", tr: "“Tell me about yourself” sorusunu 4 cümleyle yüksek sesle cevapla." },
        emails: { de: "Schreib eine kurze E-Mail: zuerst das Wichtigste, dann die Details.", en: "Write a short email: the main point first, then the details.", tr: "Kısa bir e-posta yaz: önce asıl mesaj, sonra ayrıntılar." },
        phone: { de: "Übe laut: „Could you say that again, please?“ und „Let me check that.“", en: "Practice out loud: “Could you say that again, please?” and “Let me check that.”", tr: "Yüksek sesle çalış: “Could you say that again, please?” ve “Let me check that.”" },
        smalltalk: { de: "Bereite 3 Fragen vor, die du jemandem stellen kannst – z. B. über das Wochenende.", en: "Prepare 3 questions you could ask someone – e.g. about their weekend.", tr: "Birine sorabileceğin 3 soru hazırla – örn. hafta sonu hakkında." },
        opinion: { de: "Sag deine Meinung zu einem Thema in 3 Sätzen: „I think … because …“", en: "Give your opinion on a topic in 3 sentences: “I think … because …”", tr: "Bir konu hakkındaki fikrini 3 cümleyle söyle: “I think … because …”" },
        exam: { de: "Mach einmal pro Woche eine Übungsaufgabe unter Prüfungsbedingungen – mit Uhr.", en: "Once a week, do a practice task under exam conditions – with a timer.", tr: "Haftada bir kez sınav koşullarında, süre tutarak bir alıştırma yap." },
        partner: { de: "Erzähl deinem Partner in 3 Sätzen von deinem Tag – auf Englisch.", en: "Tell your partner about your day in 3 sentences – in English.", tr: "Partnerine gününü 3 cümleyle anlat – İngilizce." },
        family: { de: "Bereite 3 Fragen für die Familie vor – z. B. über ihre Stadt oder ihre Hobbys.", en: "Prepare 3 questions for the family – e.g. about their city or hobbies.", tr: "Aile için 3 soru hazırla – örn. şehirleri ya da hobileri hakkında." },
        travel: { de: "Übe laut: „Excuse me, where is …?“ und „Can I have …, please?“", en: "Practice out loud: “Excuse me, where is …?” and “Can I have …, please?”", tr: "Yüksek sesle çalış: “Excuse me, where is …?” ve “Can I have …, please?”" },
        online: { de: "Schreib heute eine kurze Nachricht auf Englisch – in einem Chat oder Kommentar.", en: "Write one short message in English today – in a chat or a comment.", tr: "Bugün İngilizce kısa bir mesaj yaz – bir sohbette ya da yorumda." },
        fun: { de: "Schau eine Folge mit englischen Untertiteln und schreib 3 neue Wörter auf.", en: "Watch an episode with English subtitles and write down 3 new words.", tr: "İngilizce altyazıyla bir bölüm izle ve 3 yeni kelime yaz." },
    };
    // short-term steps: [for beginners (A1–A2), for learners from B1]
    const S = step;
    const PLAN = {
        "work/meeting": [[S.l11(), S.cards("office"), S.gram("future"), S.say(SAY.meeting)], [S.cc("5-1"), S.cc("2-1"), S.cc("3-3"), S.say(SAY.meeting)]],
        "work/presentation": [[S.l11(), S.cards("office"), S.gram("comparatives"), S.say(SAY.presentation)], [S.cc("6-1"), S.cc("6-2"), S.cc("6-3"), S.say(SAY.presentation)]],
        "work/interview": [[S.l11(), S.iv(1), S.gram("past-simple"), S.say(SAY.interview)], [S.iv(1), S.cc("2-2"), S.cc("1-3"), S.say(SAY.interview)]],
        "work/emails": [[S.cards("office"), S.gram("present-continuous"), S.read(), S.say(SAY.emails)], [S.cc("2-1"), S.cc("1-1"), S.cc("7-1"), S.betest()]],
        "work/phone": [[S.l11(), S.cards("office"), S.say(SAY.phone)], [S.cc("3-1"), S.cc("3-3"), S.say(SAY.phone)]],
        "work/smalltalk": [[S.l11(), S.cards("food"), S.gram("present-continuous"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("7-2"), S.say(SAY.smalltalk)]],
        "school/oral": [[S.l11(), S.gram("past-simple"), S.say(SAY.opinion)], [S.cc("6-1"), S.cc("6-3"), S.say(SAY.opinion)]],
        "school/written": [[S.gram("past-simple"), S.gram("present-continuous"), S.gram("comparatives"), S.read()], [S.gram("future"), S.read(), S.cc("2-1")]],
        "school/homework": [[S.gram("past-simple"), S.cards("home"), S.read()], [S.read(), S.gram("comparatives"), S.cc("2-3")]],
        "school/discussions": [[S.gram("comparatives"), S.say(SAY.opinion), S.l11()], [S.cc("4-2"), S.cc("1-2"), S.say(SAY.opinion)]],
        exam: [[S.gram("past-simple"), S.gram("present-continuous"), S.read(), S.say(SAY.exam)], [S.read(), S.cc("2-2"), S.betest(), S.say(SAY.exam)]],
        "partner/partner": [[S.l11(), S.cards("home"), S.gram("present-continuous"), S.say(SAY.partner)], [S.cc("3-1"), S.cc("7-2"), S.say(SAY.partner)]],
        "partner/family": [[S.l11(), S.cards("food"), S.gram("past-simple"), S.say(SAY.family)], [S.cc("3-2"), S.cc("7-2"), S.say(SAY.family)]],
        "partner/everyday": [[S.cards("home"), S.cards("food"), S.cards("town"), S.gram("future")], [S.cc("3-3"), S.cc("4-2"), S.read()]],
        "abroad/job": [[S.l11(), S.cards("office"), S.gram("past-simple"), S.say(SAY.interview)], [S.cc("2-2"), S.cc("5-1"), S.cc("7-2")]],
        "abroad/studies": [[S.gram("past-simple"), S.read(), S.say(SAY.opinion)], [S.cc("4-2"), S.cc("6-1"), S.read()]],
        "abroad/everyday": [[S.cards("town"), S.cards("health"), S.cards("home"), S.say(SAY.travel)], [S.cc("3-3"), S.cc("7-1"), S.read()]],
        "abroad/people": [[S.l11(), S.cards("freetime"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("7-2"), S.say(SAY.smalltalk)]],
        "travel/airport": [[S.cards("travel"), S.gram("future"), S.say(SAY.travel)], [S.cards("travel"), S.cc("3-3"), S.say(SAY.travel)]],
        "travel/restaurant": [[S.cards("food"), S.cards("town"), S.say(SAY.travel)], [S.cards("food"), S.cc("3-2"), S.say(SAY.travel)]],
        "travel/directions": [[S.cards("town"), S.say(SAY.travel), S.l11()], [S.cards("town"), S.cc("3-1"), S.say(SAY.travel)]],
        "travel/locals": [[S.l11(), S.cards("travel"), S.gram("present-continuous"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("7-2"), S.say(SAY.smalltalk)]],
        "friends/online": [[S.cards("freetime"), S.games(), S.say(SAY.online)], [S.cc("7-2"), S.games(), S.say(SAY.online)]],
        "friends/visitors": [[S.l11(), S.cards("town"), S.cards("food"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("7-2"), S.say(SAY.smalltalk)]],
        "friends/events": [[S.l11(), S.cards("freetime"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("1-3"), S.say(SAY.smalltalk)]],
        "friends/smalltalk": [[S.l11(), S.cards("freetime"), S.gram("present-continuous"), S.say(SAY.smalltalk)], [S.cc("3-2"), S.cc("3-1"), S.say(SAY.smalltalk)]],
        "fun/series": [[S.read(), S.gram("present-continuous"), S.say(SAY.fun)], [S.read(), S.cc("7-2"), S.say(SAY.fun)]],
        "fun/music": [[S.music(), S.cards("freetime"), S.games()], [S.music(), S.cc("7-2"), S.read()]],
        "fun/books": [[S.read(), S.gram("past-simple"), S.cards("home")], [S.read(), S.cc("7-2")]],
        "fun/games": [[S.games(), S.cards("freetime"), S.read()], [S.games(), S.read(), S.cc("7-2")]],
    };
    const HOURS = [100, 120, 180, 200, 250]; // rough hours from one level to the next (New→A1, A1→A2, A2→B1, B1→B2, B2→C1)
    const LEVEL_NAMES = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const TXT = {
        short: { de: "🎯 Dein kurzfristiges Ziel", en: "🎯 Your short-term goal", tr: "🎯 Kısa vadeli hedefin" },
        long: { de: "🌱 Dein langfristiges Ziel", en: "🌱 Your long-term goal", tr: "🌱 Uzun vadeli hedefin" },
        days: { de: (n) => (n === 0 ? "Heute!" : n === 1 ? "Morgen!" : `Noch ${n} Tage`), en: (n) => (n === 0 ? "Today!" : n === 1 ? "Tomorrow!" : `${n} days to go`), tr: (n) => (n === 0 ? "Bugün!" : n === 1 ? "Yarın!" : `${n} gün kaldı`) },
        past: { de: "Das Datum ist vorbei – wie lief es? Stell dir ein neues Ziel.", en: "The date has passed – how did it go? Set a new goal.", tr: "Tarih geçti – nasıl geçti? Yeni bir hedef belirle." },
        pace: { de: (k) => `Etwa ${k} ${k === 1 ? "Schritt" : "Schritte"} pro Woche – dann bist du rechtzeitig vorbereitet.`, en: (k) => `About ${k} ${k === 1 ? "step" : "steps"} a week – then you’re ready in time.`, tr: (k) => `Haftada yaklaşık ${k} adım – böylece zamanında hazır olursun.` },
        soonNoDate: { de: "In den nächsten Wochen – fang heute mit Schritt 1 an.", en: "In the next few weeks – start with step 1 today.", tr: "Önümüzdeki haftalarda – bugün 1. adımla başla." },
        months: { de: "In den nächsten Monaten – ein Schritt pro Woche reicht.", en: "Over the next few months – one step a week is enough.", tr: "Önümüzdeki aylarda – haftada bir adım yeterli." },
        longSoft: { de: "Ohne Zeitdruck – diese Schritte bringen dich in deiner Situation am schnellsten weiter.", en: "No time pressure – these steps help most in your situation.", tr: "Zaman baskısı yok – bu adımlar senin durumunda en çok işe yarar." },
        target: { de: (a, b, m, min) => `Von ${a} zu ${b} – in etwa ${m} Monaten mit ${min} Minuten am Tag.`, en: (a, b, m, min) => `From ${a} to ${b} – in about ${m} months at ${min} minutes a day.`, tr: (a, b, m, min) => `${a} seviyesinden ${b} seviyesine – günde ${min} dakikayla yaklaşık ${m} ayda.` },
        top: { de: "Du bist schon sehr weit – jetzt geht es um Feinschliff und Sicherheit in echten Situationen.", en: "You’re already very advanced – now it’s about polish and confidence in real situations.", tr: "Zaten çok ilerisin – şimdi gerçek durumlarda incelik ve özgüven zamanı." },
        routine: { de: "Deine Tagesroutine", en: "Your daily routine", tr: "Günlük rutinin" },
        r: { cards: { de: "Bildkarten", en: "picture cards", tr: "resimli kartlar" }, lesson: { de: "Lektion, Kurs oder Grammatik", en: "lesson, course or grammar", tr: "ders, kurs ya da dilbilgisi" },
            read: { de: "Lesen und Hören", en: "reading and listening", tr: "okuma ve dinleme" }, speak: { de: "laut sprechen", en: "speaking out loud", tr: "yüksek sesle konuşma" } },
        min: { de: "Min.", en: "min", tr: "dk" },
        weekly: { de: "📅 Jeden Montag: ein neuer Lesetext auf deinem Niveau.", en: "📅 Every Monday: a new reading text at your level.", tr: "📅 Her pazartesi: senin seviyende yeni bir okuma metni." },
        help: { de: "Mit persönlicher Hilfe geht’s schneller:", en: "Faster with personal help:", tr: "Kişisel yardımla daha hızlı:" },
        call: { de: "Kostenloses 15-Minuten-Gespräch mit David", en: "Free 15-minute call with David", tr: "David ile ücretsiz 15 dakikalık görüşme" },
        callOmer: { tr: "Omer ile ücretsiz görüşme (Türkçe de konuşuyor)" },
        say: { de: "🎤 Sprechaufgabe", en: "🎤 Speaking task", tr: "🎤 Konuşma görevi" },
    };
    const routine = (min) => (min >= 60 ? [["cards", 15], ["lesson", 20], ["read", 15], ["speak", 10]] : min >= 30 ? [["cards", 10], ["lesson", 10], ["read", 10]] : [["cards", 5], ["lesson", 10]]);

    // the plan for a profile: { short: {title, sub, due, steps}, long: {target, routine} } – null if the new questions weren't answered
    const plan = (profile) => {
        const p = normalize(profile || {});
        if (!p.goal || !p.detail) return null;
        const level = Number(p.level) || 0;
        const key = PLAN[`${p.goal}/${p.detail}`] ? `${p.goal}/${p.detail}` : PLAN[p.goal] ? p.goal : null;
        const steps = key ? PLAN[key][level >= 3 ? 1 : 0] : [S.l11(), S.cards("office"), S.read()];
        let sub = "", due = null;
        if (p.horizon === "soon") {
            if (p.due) {
                const n = Math.round((new Date(`${p.due}T12:00`) - new Date(new Date().toISOString().slice(0, 10) + "T12:00")) / 864e5);
                if (n < 0) sub = t(TXT.past);
                else { due = TXT.days[lang](n); sub = TXT.pace[lang](Math.max(1, Math.ceil(steps.length / Math.max(1, Math.ceil(n / 7))))); }
            } else sub = t(TXT.soonNoDate);
        } else sub = p.horizon === "months" ? t(TXT.months) : t(TXT.longSoft);
        const minutes = Number(p.minutes) || 15;
        const target = level >= 5 ? t(TXT.top) : TXT.target[lang](level === 0 ? "0" : LEVEL_NAMES[level - 1], LEVEL_NAMES[level] || "C1",
            Math.max(1, Math.round(HOURS[Math.min(level, 4)] / ((minutes / 60) * 30))), minutes);
        return {
            short: { title: label("detail", p.detail, p.goal) || label("goal", p.goal), why: label("goal", p.goal), due, sub, steps },
            long: { target, routine: routine(minutes).map(([k, m]) => `${m} ${t(TXT.min)} ${t(TXT.r[k])}`) },
        };
    };

    // ready-made HTML (start page + account dashboard)
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const html = (profile, { compact = false } = {}) => {
        const pl = plan(profile);
        if (!pl) return "";
        const st = pl.short.steps.slice(0, compact ? 3 : 5).map((s, i) => s.speak
            ? `<li class="gp-step gp-say"><span class="gp-n">${i + 1}</span><span><strong>${t(TXT.say)}:</strong> ${esc(s.text)}</span></li>`
            : `<li class="gp-step"><span class="gp-n">${i + 1}</span><a href="${s.href}">${esc(s.text)} →</a></li>`).join("");
        const help = `<p class="gp-help">${t(TXT.help)} <a href="https://cal.com/nawee/15min" target="_blank" rel="noopener">${t(TXT.call)} ↗</a>${lang === "tr" ? ` · <a href="https://cal.com/nawee/kostenloses-erstgesprach-omer" target="_blank" rel="noopener">${TXT.callOmer.tr} ↗</a>` : ""}</p>`;
        return `<div class="gp${compact ? " gp-compact" : ""}">
            <section class="gp-card gp-short"><p class="gp-label">${t(TXT.short)}</p>
                <h3>${esc(pl.short.title)}${pl.short.due ? ` <span class="gp-due">${esc(pl.short.due)}</span>` : ""}</h3>
                <p class="gp-sub">${esc(pl.short.sub)}</p><ol class="gp-steps">${st}</ol>${compact ? "" : help}</section>
            <section class="gp-card gp-long"><p class="gp-label">${t(TXT.long)}</p>
                <p class="gp-target">${esc(pl.long.target)}</p>
                <p class="gp-routine-h">${t(TXT.routine)}</p><ul class="gp-routine">${pl.long.routine.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
                ${compact ? "" : `<p class="gp-weekly">${t(TXT.weekly)}</p>`}</section>
        </div>`;
    };
    return { questions, label, plan, html, normalize };
})();
