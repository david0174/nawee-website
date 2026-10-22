// "English from the start" (A1): listening & speaking course for complete beginners (general path).
// Explanations in German (de) and simple English (en); everything learners hear and say is English.
// Audio: each spoken line can get an `audio` file (David's recordings, e.g. "audio/work/1-1/d1.mp3");
// until then the browser voice reads `text` aloud.

const WORK_MODULES = [
    { id: 1, title: { de: "Erste Schritte", en: "First steps" }, lessons: [
        { id: "1-1", title: { de: "Sich vorstellen", en: "Introducing yourself" } },
        { id: "1-2", title: { de: "Sich verabreden", en: "Making plans" } },
        { id: "1-3", title: { de: "Am Telefon: die ersten Sätze", en: "On the phone: the first sentences" } },
    ] },
];

const WORK_LESSONS = {
    "1-1": {
        recorded: true, // all lines spoken by David (audio/work/1-1)
        goal: {
            de: "Du kannst dich auf Englisch vorstellen: Name, Herkunft, Beruf – und die Frage zurückgeben.",
            en: "You can introduce yourself in English: your name, where you’re from, your job – and ask back.",
        },
        intro: {
            de: "Erst hören, dann sprechen: Hör dir das Gespräch an, ohne mitzulesen. Du musst nicht jedes Wort verstehen – achte darauf, wer was sagt.",
            en: "Listen first, then speak: play the conversation without reading along. You don’t need every word – just notice who says what.",
        },
        // 1. Listen: a short dialogue (speaker A / B get different voices)
        dialogue: {
            situation: { de: "Erster Tag im neuen Job. Sarah begrüßt Tom in der Küche im Büro.", en: "First day at a new job. Sarah greets Tom in the office kitchen." },
            lines: [
                { who: "Sarah", voice: "a", text: "Hi! I’m Sarah. I work in marketing.", audio: "audio/work/1-1/d1.m4a" },
                { who: "Tom", voice: "b", text: "Hello, Sarah. Nice to meet you. I’m Tom.", audio: "audio/work/1-1/d2.m4a" },
                { who: "Sarah", voice: "a", text: "Nice to meet you too, Tom. Where are you from?", audio: "audio/work/1-1/d3.m4a" },
                { who: "Tom", voice: "b", text: "I’m from Germany. I’m the new engineer.", audio: "audio/work/1-1/d4.m4a" },
                { who: "Sarah", voice: "a", text: "Welcome to the team!", audio: "audio/work/1-1/d5.m4a" },
                { who: "Tom", voice: "b", text: "Thank you!", audio: "audio/work/1-1/d6.m4a" },
            ],
        },
        // 2. Understand: listening questions (the question is read aloud, answers are short)
        listen: [
            { say: "What does Sarah do?", audio: "audio/work/1-1/q1.m4a", options: ["She works in marketing.", "She is an engineer.", "She works in sales."], answer: 0,
              explain: { de: "Sarah sagt: „I work in marketing.“", en: "Sarah says: “I work in marketing.”" } },
            { say: "Where is Tom from?", audio: "audio/work/1-1/q2.m4a", options: ["Germany", "England", "Spain"], answer: 0,
              explain: { de: "Tom sagt: „I’m from Germany.“", en: "Tom says: “I’m from Germany.”" } },
            { say: "What is Tom’s job?", audio: "audio/work/1-1/q3.m4a", options: ["Engineer", "Teacher", "Manager"], answer: 0,
              explain: { de: "„I’m the new engineer.“ – engineer heißt Ingenieur.", en: "“I’m the new engineer.”" } },
        ],
        // 3. Repeat: key phrases – listen, say it out loud, record and compare
        phrases: [
            { text: "Hi, I’m Sarah.", audio: "audio/work/1-1/p1.m4a", de: "Hallo, ich bin Sarah.", tip: { de: "Setz deinen Namen ein: „Hi, I’m …“", en: "Use your own name: “Hi, I’m …”" } },
            { text: "Nice to meet you.", audio: "audio/work/1-1/p2.m4a", de: "Schön, dich kennenzulernen.", tip: { de: "Die Wörter fließen zusammen: „nice-to-MEET-you“.", en: "The words flow together: “nice-to-MEET-you”." } },
            { text: "Nice to meet you too.", audio: "audio/work/1-1/p3.m4a", de: "Freut mich auch.", tip: { de: "Die Antwort auf „Nice to meet you“.", en: "Your answer to “Nice to meet you”." } },
            { text: "Where are you from?", audio: "audio/work/1-1/p4.m4a", de: "Woher kommst du?", tip: { de: "Die Stimme geht am Ende nach unten.", en: "Your voice goes down at the end." } },
            { text: "I’m from Germany.", audio: "audio/work/1-1/p5.m4a", de: "Ich komme aus Deutschland.", tip: { de: "„I’m“ = „I am“ – im Gespräch fast immer kurz.", en: "“I’m” = “I am” – almost always short when speaking." } },
            { text: "I work in sales.", audio: "audio/work/1-1/p6.m4a", de: "Ich arbeite im Vertrieb.", tip: { de: "Bereich: „I work in sales / IT / marketing.“", en: "Your area: “I work in sales / IT / marketing.”" } },
            { text: "I’m an engineer.", audio: "audio/work/1-1/p7.m4a", de: "Ich bin Ingenieur/in.", tip: { de: "Beruf mit „a/an“: „I’m a nurse.“ „I’m an engineer.“", en: "Job with “a/an”: “I’m a nurse.” “I’m an engineer.”" } },
            { text: "And you?", audio: "audio/work/1-1/p8.m4a", de: "Und du? / Und Sie?", tip: { de: "So gibst du die Frage einfach zurück.", en: "The easy way to ask back." } },
        ],
        // 4. Sound focus: pairs that are hard for German speakers
        sounds: {
            title: { de: "Der „th“-Laut", en: "The “th” sound" },
            explain: {
                de: "Für „th“ legst du die Zungenspitze leicht zwischen die Zähne und pustest. Hör genau hin: Welches Wort hörst du?",
                en: "For “th”, put the tip of your tongue lightly between your teeth and blow. Listen closely: which word do you hear?",
            },
            pairs: [["three", "tree"], ["thank", "tank"], ["think", "sink"]],
            audio: { three: "audio/work/1-1/s1.m4a", tree: "audio/work/1-1/s2.m4a", thank: "audio/work/1-1/s3.m4a",
                     tank: "audio/work/1-1/s4.m4a", think: "audio/work/1-1/s5.m4a", sink: "audio/work/1-1/s6.m4a" },
        },
        // 5. Respond: hear a question, answer out loud, then compare with the model
        respond: [
            { say: "Hi! What’s your name?", audio: "audio/work/1-1/r1.m4a", model: "Hi, I’m … Nice to meet you.", modelAudio: "audio/work/1-1/m1.m4a" },
            { say: "Where are you from?", audio: "audio/work/1-1/p4.m4a", model: "I’m from … And you?", modelAudio: "audio/work/1-1/m2.m4a" },
            { say: "What do you do?", audio: "audio/work/1-1/r2.m4a", model: "I work in … / I’m a …", modelAudio: "audio/work/1-1/m3.m4a" },
        ],
        // 6. Role-play: you are the new colleague
        roleplay: {
            situation: { de: "Du bist neu im Team. Sarah spricht dich an – antworte laut.", en: "You’re new on the team. Sarah talks to you – answer out loud." },
            turns: [
                { voice: "a", text: "Hi! I’m Sarah. I work in marketing.", audio: "audio/work/1-1/d1.m4a" },
                { you: { de: "Stell dich vor + „Nice to meet you“", en: "Introduce yourself + “Nice to meet you”" }, model: "Hi, Sarah. I’m … Nice to meet you." },
                { voice: "a", text: "Nice to meet you too! Where are you from?", audio: "audio/work/1-1/rp1.m4a" },
                { you: { de: "Sag, woher du kommst", en: "Say where you’re from" }, model: "I’m from … And you?" },
                { voice: "a", text: "I’m from London. What do you do?", audio: "audio/work/1-1/rp2.m4a" },
                { you: { de: "Sag, was du beruflich machst", en: "Say what you do" }, model: "I’m a … / I work in …" },
                { voice: "a", text: "Great! Welcome to the team!", audio: "audio/work/1-1/rp3.m4a" },
                { you: { de: "Bedank dich", en: "Say thank you" }, model: "Thank you!" },
            ],
        },
        mission: {
            de: "Stell dich diese Woche einer Person auf Englisch vor – einer Kollegin, einem Nachbarn oder vor dem Spiegel. Nimm dich danach einmal mit dem Handy auf: Name, Herkunft, Beruf.",
            en: "This week, introduce yourself in English to one person – a colleague, a neighbor, or the mirror. Then record yourself once on your phone: name, where you’re from, your job.",
        },
    },
    "1-2": {
        draft: true, // not published yet (waiting for the recordings); preview: ?l=1-2&preview
        goal: {
            de: "Du kannst dich auf Englisch verabreden: fragen, ob jemand Zeit hat, einen Tag, eine Uhrzeit und einen Ort vorschlagen.",
            en: "You can make plans in English: ask if someone is free and suggest a day, a time and a place.",
        },
        intro: {
            de: "Hör dir zuerst das Gespräch an, ohne mitzulesen. Achte auf drei Dinge: Wann? Um wie viel Uhr? Wo?",
            en: "Listen to the conversation first, without reading along. Listen for three things: When? What time? Where?",
        },
        dialogue: {
            situation: { de: "Ben ruft am Donnerstagabend seinen Freund Tom an.", en: "Ben calls his friend Tom on Thursday evening." },
            lines: [
                { who: "Ben", voice: "c", text: "Hi Tom! Are you free this weekend?" },
                { who: "Tom", voice: "b", text: "Hi Ben! I’m free on Saturday. Why?" },
                { who: "Ben", voice: "c", text: "Let’s go for coffee. What time is good for you?" },
                { who: "Tom", voice: "b", text: "How about three o’clock?" },
                { who: "Ben", voice: "c", text: "Three is perfect. Where do you want to meet?" },
                { who: "Tom", voice: "b", text: "At the café next to the station." },
                { who: "Ben", voice: "c", text: "Great. See you on Saturday at three!" },
                { who: "Tom", voice: "b", text: "See you then!" },
            ],
        },
        listen: [
            { say: "When is Tom free?", options: ["On Saturday", "On Sunday", "On Friday"], answer: 0,
              explain: { de: "Tom sagt: „I’m free on Saturday.“", en: "Tom says: “I’m free on Saturday.”" } },
            { say: "What time do they meet?", options: ["At three o’clock", "At two o’clock", "At four o’clock"], answer: 0,
              explain: { de: "„How about three o’clock?“ – „Three is perfect.“", en: "“How about three o’clock?” – “Three is perfect.”" } },
            { say: "Where do they meet?", options: ["At the café next to the station", "At the office", "At the park"], answer: 0,
              explain: { de: "„At the café next to the station“ – im Café neben dem Bahnhof.", en: "“At the café next to the station.”" } },
        ],
        phrases: [
            { text: "Are you free this weekend?", de: "Hast du am Wochenende Zeit?", tip: { de: "„free“ heißt hier: Zeit haben – nicht „kostenlos“.", en: "“Free” here means having time – not “costing nothing”." } },
            { text: "I’m free on Saturday.", de: "Ich habe am Samstag Zeit.", tip: { de: "Tage mit „on“: on Saturday, on Monday.", en: "Days take “on”: on Saturday, on Monday." } },
            { text: "What time is good for you?", de: "Welche Uhrzeit passt dir?", tip: { de: "Höflich nach einer Uhrzeit fragen.", en: "A polite way to ask for a time." } },
            { text: "How about three o’clock?", de: "Wie wäre es mit drei Uhr?", tip: { de: "Uhrzeiten mit „at“: at three o’clock.", en: "Times take “at”: at three o’clock." } },
            { text: "That’s perfect.", de: "Das passt perfekt.", tip: { de: "Zusage – kurz und freundlich.", en: "A short, friendly yes." } },
            { text: "Where do you want to meet?", de: "Wo wollen wir uns treffen?", tip: { de: "Die Stimme geht am Ende nach unten.", en: "Your voice goes down at the end." } },
            { text: "See you on Saturday!", de: "Bis Samstag!", tip: { de: "„See you“ + Tag = Bis …", en: "“See you” + a day." } },
            { text: "See you then!", de: "Bis dann!", tip: { de: "Der klassische Abschied, wenn ihr verabredet seid.", en: "The classic goodbye once you have a plan." } },
        ],
        sounds: {
            title: { de: "thirteen oder thirty?", en: "thirteen or thirty?" },
            explain: {
                de: "Diese Zahlen klingen ähnlich. Die Betonung hilft: bei -teen liegt sie am Ende (thir-TEEN), bei -ty am Anfang (THIR-ty). Welche Zahl hörst du?",
                en: "These numbers sound alike. The stress tells them apart: -teen is stressed at the end (thir-TEEN), -ty at the start (THIR-ty). Which number do you hear?",
            },
            pairs: [["thirteen", "thirty"], ["fourteen", "forty"], ["fifteen", "fifty"]],
        },
        respond: [
            { say: "Are you free on Saturday?", model: "Yes, I’m free on Saturday." },
            { say: "What time is good for you?", model: "How about four o’clock?" },
            { say: "Where do you want to meet?", model: "At the café next to the station." },
        ],
        roleplay: {
            partner: "Ben",
            situation: { de: "Du bist Tom. Ben ruft dich an – antworte laut.", en: "You’re Tom. Ben calls you – answer out loud." },
            turns: [
                { voice: "c", text: "Hi! Are you free this weekend?" },
                { you: { de: "Sag, an welchem Tag du Zeit hast", en: "Say which day you’re free" }, model: "I’m free on Saturday." },
                { voice: "c", text: "Let’s go for coffee. What time is good for you?" },
                { you: { de: "Schlag eine Uhrzeit vor", en: "Suggest a time" }, model: "How about three o’clock?" },
                { voice: "c", text: "Perfect. Where do you want to meet?" },
                { you: { de: "Schlag einen Ort vor", en: "Suggest a place" }, model: "At the café next to the station." },
                { voice: "c", text: "Great. See you then!" },
                { you: { de: "Verabschiede dich", en: "Say goodbye" }, model: "See you then!" },
            ],
        },
        mission: {
            de: "Mach diese Woche eine echte Verabredung auf Englisch – mit einem Freund, einer Kollegin oder per Nachricht: Tag, Uhrzeit und Ort.",
            en: "This week, make one real plan in English – with a friend, a colleague or in a message: day, time and place.",
        },
    },
};
