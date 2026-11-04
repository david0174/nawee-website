// Grammar track (grammatik.html / grammar.html) – short lessons: the rule in one sentence, how to build it, a comparison
// with German (German page only), examples from Nawee's own reading texts, practice with instant feedback, one speaking task.
// Plan: Business-documents/Grammar-Track-Plan.md (approved 2026-11-04: start with A2, German comparisons, beta).
// Text fields are { de, en } – the German page explains in German, the English page in simple English.
// Practice items: type "gap" (type the answer; `answer` = list of accepted answers) or "choice" (`options`, `answer` = index).

const GRAMMAR = [
    {
        id: "past-simple", level: "A2", beta: true, icon: "⏪",
        title: { de: "Past simple – Vergangenheit", en: "Past simple" },
        teaser: { de: "Was du gestern, letzte Woche oder 2019 gemacht hast.", en: "What you did yesterday, last week or in 2019." },
        rule: {
            de: "Mit dem <strong>past simple</strong> erzählst du von <strong>abgeschlossenen Handlungen zu einer bestimmten Zeit</strong> in der Vergangenheit: yesterday, last week, in 2019, two days ago.",
            en: "We use the <strong>past simple</strong> for <strong>finished actions at a specific time</strong> in the past: yesterday, last week, in 2019, two days ago.",
        },
        form: [
            { label: { de: "Regelmäßige Verben: + -ed", en: "Regular verbs: + -ed" }, rows: [["work", "worked"], ["visit", "visited"], ["live", "lived"], ["study", "studied"], ["stop", "stopped"]],
              note: { de: "Achtung Schreibung: study → stud<strong>ied</strong> (y wird ie), stop → sto<strong>pp</strong>ed (Konsonant verdoppelt).", en: "Watch the spelling: study → stud<strong>ied</strong> (y becomes ie), stop → sto<strong>pp</strong>ed (double consonant)." } },
            { label: { de: "Unregelmäßige Verben: lernen!", en: "Irregular verbs: learn them!" }, rows: [["go", "went"], ["have", "had"], ["see", "saw"], ["come", "came"], ["get", "got"], ["make", "made"], ["take", "took"], ["say", "said"], ["buy", "bought"], ["eat", "ate"]],
              note: { de: "Die 10 häufigsten – sie kommen in fast jedem Gespräch vor.", en: "The 10 most common ones – you need them in almost every conversation." } },
            { label: { de: "Frage und Verneinung: did / didn’t + Grundform", en: "Questions and negatives: did / didn’t + base form" }, rows: [["Did you work yesterday?", "✓"], ["I didn’t work yesterday.", "✓"], ["Did you worked? ✗", "→ Did you work?"]],
              note: { de: "Nach did / didn’t steht immer die Grundform – das „Vergangene“ steckt schon in did.", en: "After did / didn’t, always use the base form – the past is already in “did”." } },
        ],
        german: {
            de: "Im Deutschen erzählen wir mündlich meist im <strong>Perfekt</strong>: „Ich <em>habe</em> gestern <em>gearbeitet</em>.“ Im Englischen geht das mit einer Zeitangabe wie <em>yesterday</em> nicht – da steht das past simple: „I <strong>worked</strong> yesterday.“<br>❌ <em>I have seen him yesterday.</em> → ✅ <em>I saw him yesterday.</em>",
            en: "",
        },
        examples: [
            { text: "In October 2026, Perseverance broke a record.", hl: ["broke"], from: "mars-rover-record" },
            { text: "Opportunity drove 45.16 kilometers between 2004 and 2018.", hl: ["drove"], from: "mars-rover-record" },
            { text: "East Germany built the wall almost overnight in August 1961.", hl: ["built"], from: "w2026-11-02-b2-berlin-wall" },
            { text: "The feast lasted three days.", hl: ["lasted"], from: "w2026-11-02-b1-thanksgiving" },
            { text: "In 1863, President Abraham Lincoln made Thanksgiving a national holiday.", hl: ["made"], from: "w2026-11-02-b1-thanksgiving" },
        ],
        practice: [
            { type: "gap", q: "Yesterday I ___ (work) until 8 pm.", answer: ["worked"], why: { de: "Regelmäßig: work + -ed.", en: "Regular: work + -ed." } },
            { type: "gap", q: "We ___ (visit) my grandma last Sunday.", answer: ["visited"], why: { de: "Regelmäßig: visit + -ed.", en: "Regular: visit + -ed." } },
            { type: "gap", q: "She ___ (study) in Berlin in 2019.", answer: ["studied"], why: { de: "y wird zu ie: study → studied.", en: "y becomes ie: study → studied." } },
            { type: "gap", q: "The bus ___ (stop) in front of the hotel.", answer: ["stopped"], why: { de: "Kurzer Vokal + Konsonant: verdoppeln – stop → stopped.", en: "Short vowel + consonant: double it – stop → stopped." } },
            { type: "choice", q: "Last summer we ___ to Spain.", options: ["went", "goed", "gone"], answer: 0, why: { de: "go ist unregelmäßig: go → went.", en: "go is irregular: go → went." } },
            { type: "choice", q: "I ___ a great film yesterday.", options: ["saw", "seed", "seen"], answer: 0, why: { de: "see → saw („seen“ brauchst du erst beim present perfect).", en: "see → saw (“seen” is for the present perfect)." } },
            { type: "choice", q: "He ___ a bad cold last week.", options: ["had", "haved", "has"], answer: 0, why: { de: "have → had.", en: "have → had." } },
            { type: "choice", q: "Which sentence is correct?", options: ["I saw him yesterday.", "I have seen him yesterday."], answer: 0, why: { de: "Mit „yesterday“ (fester Zeitpunkt) immer past simple – nicht wie im Deutschen das Perfekt.", en: "With “yesterday” (a specific time), always use the past simple." } },
            { type: "choice", q: "Which question is correct?", options: ["Did you go to the party?", "Did you went to the party?"], answer: 0, why: { de: "Nach did kommt die Grundform: did … go.", en: "After did, use the base form: did … go." } },
            { type: "gap", q: "She ___ (not / come) to work on Monday.", answer: ["didn't come", "didn’t come", "did not come"], why: { de: "Verneinung: didn’t + Grundform – didn’t come.", en: "Negative: didn’t + base form – didn’t come." } },
        ],
        speak: {
            q: { de: "Was hast du letztes Wochenende gemacht? Sag drei Sätze auf Englisch – laut.", en: "What did you do last weekend? Say three sentences out loud." },
            model: "I visited my parents. We went for a walk by the river. In the evening, I watched a film.",
        },
    },
];
