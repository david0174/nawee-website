// "English from the start" (A1): listening & speaking course for complete beginners (general path).
// Explanations in German (de) and simple English (en); everything learners hear and say is English.
// Audio: each spoken line can get an `audio` file (David's recordings, e.g. "audio/work/1-1/d1.mp3");
// until then the browser voice reads `text` aloud.

const WORK_MODULES = [
    { id: 1, title: { de: "Erste Schritte", en: "First steps" }, lessons: [
        { id: "1-1", title: { de: "Sich vorstellen", en: "Introducing yourself" } },
        { id: "1-2", title: { de: "Zahlen, Uhrzeiten, Termine", en: "Numbers, times, appointments" } },
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
};
