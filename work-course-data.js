// "English from the start" (A1): listening & speaking course for complete beginners (general path).
// Explanations in German (de) and simple English (en); everything learners hear and say is English.
// Audio: each spoken line can get an `audio` file (David's recordings, e.g. "audio/work/1-1/d1.mp3");
// until then the browser voice reads `text` aloud.

const WORK_MODULES = [
    { id: 1, title: { de: "Erste Schritte", en: "First steps" }, lessons: [
        { id: "1-1", title: { de: "Sich vorstellen", en: "Introducing yourself" } },
        { id: "1-2", title: { de: "Sich verabreden", en: "Making plans" } },
        { id: "1-3", title: { de: "Buchstabieren, Zahlen, Telefonnummern", en: "Spelling, numbers & phone numbers" } },
        { id: "1-4", title: { de: "Wo du wohnst und deine Familie", en: "Where you live & your family" } },
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
    "1-3": {
        draft: true, // written, no recordings yet (browser voice); preview: ?l=1-3&preview
        goal: {
            de: "Du kannst deinen Namen buchstabieren und deine Telefonnummer und E-Mail-Adresse auf Englisch sagen – und nachfragen, wenn du etwas nicht verstanden hast.",
            en: "You can spell your name and say your phone number and email address in English – and ask again when you didn’t catch something.",
        },
        intro: {
            de: "Hör dir das Gespräch an, ohne mitzulesen. Achte auf die Buchstaben und Zahlen – schreib sie ruhig mit.",
            en: "Listen to the conversation without reading along. Listen for the letters and numbers – feel free to write them down.",
        },
        dialogue: {
            situation: { de: "Tom macht bei Bens Fußballteam mit. Ben schreibt seine Daten für die Teamliste auf.", en: "Tom is joining Ben’s soccer team. Ben writes down his details for the team list." },
            lines: [
                { who: "Ben", voice: "c", text: "Tom, I need your details for the team list. What’s your last name?" },
                { who: "Tom", voice: "b", text: "It’s Becker." },
                { who: "Ben", voice: "c", text: "How do you spell that?" },
                { who: "Tom", voice: "b", text: "B, E, C, K, E, R." },
                { who: "Ben", voice: "c", text: "Thanks. And what’s your phone number?" },
                { who: "Tom", voice: "b", text: "It’s three one two, five five five, oh one four eight." },
                { who: "Ben", voice: "c", text: "Sorry, can you say that again, please?" },
                { who: "Tom", voice: "b", text: "Sure. Three one two, five five five, oh one four eight." },
                { who: "Ben", voice: "c", text: "Got it. And your email address?" },
                { who: "Tom", voice: "b", text: "It’s tom dot becker at example dot com." },
                { who: "Ben", voice: "c", text: "Perfect. See you at practice on Monday!" },
                { who: "Tom", voice: "b", text: "See you!" },
            ],
        },
        listen: [
            { say: "How do you spell Tom’s last name?", options: ["B-E-C-K-E-R", "B-A-K-E-R", "B-E-K-K-E-R"], answer: 0,
              explain: { de: "Tom buchstabiert: B, E, C, K, E, R.", en: "Tom spells it: B, E, C, K, E, R." } },
            { say: "What is Tom’s phone number?", options: ["312-555-0148", "312-555-0184", "213-555-0148"], answer: 0,
              explain: { de: "„three one two, five five five, oh one four eight“ – die Null sagt man oft „oh“.", en: "“three one two, five five five, oh one four eight” – zero is often said “oh”." } },
            { say: "When is soccer practice?", options: ["On Monday", "On Sunday", "On Friday"], answer: 0,
              explain: { de: "Ben sagt: „See you at practice on Monday!“", en: "Ben says: “See you at practice on Monday!”" } },
        ],
        phrases: [
            { text: "What’s your last name?", de: "Wie ist dein Nachname?", tip: { de: "last name = Nachname, first name = Vorname.", en: "last name = family name, first name = given name." } },
            { text: "How do you spell that?", de: "Wie schreibt man das?", tip: { de: "Die wichtigste Frage bei Namen und Adressen.", en: "The key question for names and addresses." } },
            { text: "It’s B, E, C, K, E, R.", de: "Das schreibt man B, E, C, K, E, R.", tip: { de: "Achtung: Das englische E klingt wie das deutsche I, das englische I wie „ei“.", en: "Careful: the English letter E sounds like the German I, and I sounds like “eye”." } },
            { text: "What’s your phone number?", de: "Wie ist deine Telefonnummer?", tip: { de: "Telefonnummern sagt man Ziffer für Ziffer, in kleinen Gruppen.", en: "Say phone numbers digit by digit, in small groups." } },
            { text: "Oh one four eight.", de: "Null eins vier acht.", tip: { de: "Die Null heißt in Nummern oft „oh“, manchmal „zero“.", en: "In numbers, zero is often “oh”, sometimes “zero”." } },
            { text: "Can you say that again, please?", de: "Kannst du das bitte noch mal sagen?", tip: { de: "Ganz normal und höflich – Muttersprachler fragen das auch.", en: "Normal and polite – native speakers ask this too." } },
            { text: "What’s your email address?", de: "Wie ist deine E-Mail-Adresse?", tip: { de: "@ = „at“, . = „dot“.", en: "@ = “at”, . = “dot”." } },
            { text: "Got it.", de: "Verstanden. / Hab’s.", tip: { de: "Kurz und locker: Ich habe es notiert.", en: "Short and casual: I’ve written it down." } },
        ],
        sounds: {
            title: { de: "Englische Buchstaben: E, I, A", en: "English letters: E, I, A" },
            explain: {
                de: "Diese Buchstaben klingen anders als im Deutschen: E klingt wie „i“, I wie „ei“, A wie „ej“. Welchen Buchstaben hörst du?",
                en: "These letters sound different from German: E sounds like German “i”, I like “ei”, A like “ay”. Which letter do you hear?",
            },
            pairs: [["E", "I"], ["A", "E"], ["G", "J"]],
        },
        respond: [
            { say: "What’s your last name? How do you spell that?", model: "It’s … – and spell it letter by letter." },
            { say: "What’s your phone number?", model: "It’s … – digit by digit, zero as “oh”." },
            { say: "And your email address?", model: "It’s … at … dot com." },
        ],
        roleplay: {
            partner: "Ben",
            situation: { de: "Du machst bei Bens Team mit. Er braucht deine Daten – antworte laut mit deinen echten Daten oder erfundenen.", en: "You’re joining Ben’s team. He needs your details – answer out loud with your real details or made-up ones." },
            turns: [
                { voice: "c", text: "Hi! I need your details for the team list. What’s your last name?" },
                { you: { de: "Sag deinen Nachnamen", en: "Say your last name" }, model: "It’s …" },
                { voice: "c", text: "How do you spell that?" },
                { you: { de: "Buchstabiere ihn", en: "Spell it" }, model: "… letter by letter" },
                { voice: "c", text: "Thanks. What’s your phone number?" },
                { you: { de: "Sag deine Nummer, Ziffer für Ziffer", en: "Say your number, digit by digit" }, model: "It’s …" },
                { voice: "c", text: "Sorry, can you say that again, please?" },
                { you: { de: "Sag sie noch einmal, langsam", en: "Say it again, slowly" }, model: "Sure. …" },
                { voice: "c", text: "Got it. See you on Monday!" },
                { you: { de: "Verabschiede dich", en: "Say goodbye" }, model: "See you!" },
            ],
        },
        mission: {
            de: "Buchstabiere deinen Vor- und Nachnamen und sag deine Telefonnummer dreimal laut auf Englisch – einmal davon mit dem Handy aufnehmen und anhören.",
            en: "Spell your first and last name and say your phone number out loud in English three times – record one of them on your phone and listen back.",
        },
    },
    "1-4": {
        draft: true, // written, no recordings yet (browser voice); preview: ?l=1-4&preview
        goal: {
            de: "Du kannst sagen, wo du wohnst und wer zu deiner Familie gehört – und andere danach fragen.",
            en: "You can say where you live and who is in your family – and ask others about it.",
        },
        intro: {
            de: "Hör dir das Gespräch an, ohne mitzulesen. Achte darauf: Wo wohnen die Familien? Wie viele Geschwister haben Tom und Ben?",
            en: "Listen to the conversation without reading along. Listen for: Where do the families live? How many brothers and sisters do Tom and Ben have?",
        },
        dialogue: {
            situation: { de: "Ben besucht Tom zum ersten Mal in seiner neuen Wohnung in Chicago.", en: "Ben visits Tom in his new apartment in Chicago for the first time." },
            lines: [
                { who: "Ben", voice: "c", text: "Nice apartment! Do you live here alone?" },
                { who: "Tom", voice: "b", text: "Yes, I do. My family is in Germany." },
                { who: "Ben", voice: "c", text: "Oh, where do they live?" },
                { who: "Tom", voice: "b", text: "In Hamburg. My parents have a small house there." },
                { who: "Ben", voice: "c", text: "Do you have any brothers or sisters?" },
                { who: "Tom", voice: "b", text: "I have one sister. Her name is Anna. What about you?" },
                { who: "Ben", voice: "c", text: "I have two brothers. They live in New York." },
                { who: "Tom", voice: "b", text: "And your parents?" },
                { who: "Ben", voice: "c", text: "They live here in Chicago, near the lake." },
                { who: "Tom", voice: "b", text: "That’s nice. You can see them every week!" },
            ],
        },
        listen: [
            { say: "Where does Tom’s family live?", options: ["In Hamburg", "In Chicago", "In New York"], answer: 0,
              explain: { de: "Tom sagt: „In Hamburg. My parents have a small house there.“", en: "Tom says: “In Hamburg. My parents have a small house there.”" } },
            { say: "How many sisters does Tom have?", options: ["One", "Two", "None"], answer: 0,
              explain: { de: "„I have one sister. Her name is Anna.“", en: "“I have one sister. Her name is Anna.”" } },
            { say: "Where do Ben’s brothers live?", options: ["In New York", "In Chicago", "In Germany"], answer: 0,
              explain: { de: "„I have two brothers. They live in New York.“", en: "“I have two brothers. They live in New York.”" } },
        ],
        phrases: [
            { text: "Where do you live?", de: "Wo wohnst du?", tip: { de: "„live“ = wohnen und leben.", en: "“Live” is for both your home and your life." } },
            { text: "I live in Hamburg.", de: "Ich wohne in Hamburg.", tip: { de: "Städte und Länder mit „in“: in Hamburg, in Germany.", en: "Cities and countries take “in”: in Hamburg, in Germany." } },
            { text: "I live alone.", de: "Ich wohne allein.", tip: { de: "Oder: „I live with my partner / my family.“", en: "Or: “I live with my partner / my family.”" } },
            { text: "Do you have any brothers or sisters?", de: "Hast du Geschwister?", tip: { de: "Für „Geschwister“ sagt man im Gespräch meist „brothers or sisters“.", en: "In conversation, people say “brothers or sisters”." } },
            { text: "I have one sister.", de: "Ich habe eine Schwester.", tip: { de: "I have – he/she has: „She has two kids.“", en: "I have – he/she has: “She has two kids.”" } },
            { text: "I don’t have any brothers.", de: "Ich habe keine Brüder.", tip: { de: "Verneinen mit „don’t have any“.", en: "Say no with “don’t have any”." } },
            { text: "My parents live in Hamburg.", de: "Meine Eltern wohnen in Hamburg.", tip: { de: "parents = Eltern (nicht „Verwandte“ – das ist relatives).", en: "parents = mother and father (relatives = the wider family)." } },
            { text: "What about you?", de: "Und du? / Wie ist es bei dir?", tip: { de: "Gibt die Frage zurück – wie „And you?“.", en: "Asks back – like “And you?”." } },
        ],
        sounds: {
            title: { de: "Kurzes i oder langes ii?", en: "Short i or long ee?" },
            explain: {
                de: "„live“ (wohnen) hat ein kurzes i, „leave“ (gehen) ein langes. Der Unterschied verändert das Wort! Welches hörst du?",
                en: "“Live” has a short i, “leave” a long ee. The difference changes the word! Which one do you hear?",
            },
            pairs: [["live", "leave"], ["it", "eat"], ["ship", "sheep"]],
        },
        respond: [
            { say: "Where do you live?", model: "I live in … " },
            { say: "Do you have any brothers or sisters?", model: "I have … / I don’t have any brothers or sisters." },
            { say: "Where does your family live?", model: "My family lives in … " },
        ],
        roleplay: {
            partner: "Ben",
            situation: { de: "Ben besucht dich zu Hause und fragt nach deiner Familie – antworte laut.", en: "Ben visits you at home and asks about your family – answer out loud." },
            turns: [
                { voice: "c", text: "Nice place! Do you live here alone?" },
                { you: { de: "Sag, ob du allein wohnst oder mit wem", en: "Say if you live alone or who with" }, model: "Yes, I do. / No, I live with …" },
                { voice: "c", text: "Where does your family live?" },
                { you: { de: "Sag, wo deine Familie wohnt", en: "Say where your family lives" }, model: "My family lives in …" },
                { voice: "c", text: "Do you have any brothers or sisters?" },
                { you: { de: "Antworte und frag zurück", en: "Answer and ask back" }, model: "I have … What about you?" },
                { voice: "c", text: "I have two brothers. They live in New York." },
                { you: { de: "Reagiere freundlich", en: "React in a friendly way" }, model: "That’s nice!" },
            ],
        },
        mission: {
            de: "Erzähl jemandem auf Englisch in vier Sätzen, wo du wohnst und wer zu deiner Familie gehört – oder nimm es mit dem Handy auf.",
            en: "Tell someone in four English sentences where you live and who is in your family – or record it on your phone.",
        },
    },
};
