// Nawee course – structure and lesson content.
// Explanations in German (du), all phrases and exercises in English.
// A lesson without `content` is shown as "bald verfügbar" (coming soon).

const COURSE_MODULES = [
    { id: 1, title: "Mindset: Warum wir blockieren", lessons: [
        { id: "1-1", title: "Der Moment, in dem du still bleibst" },
        { id: "1-2", title: "Fehler als Werkzeug" },
        { id: "1-3", title: "Dein Plan" },
    ] },
    { id: 2, title: "Die richtigen Fragen stellen", lessons: [
        { id: "2-1", title: "Fragen an dich selbst" },
        { id: "2-2", title: "Nachfragen im Gespräch" },
        { id: "2-3", title: "Verständnis prüfen" },
    ] },
    { id: 3, title: "Wörter finden, die dir fehlen", lessons: [
        { id: "3-1", title: "Umschreiben" },
        { id: "3-2", title: "Nach dem Wort fragen" },
        { id: "3-3", title: "Werkzeuge klug nutzen" },
    ] },
    { id: 4, title: "Wörter aus Gesprächen herausholen", lessons: [
        { id: "4-1", title: "Aktiv zuhören" },
        { id: "4-2", title: "Notieren und sammeln" },
        { id: "4-3", title: "Wiederholen und anwenden" },
    ] },
    { id: 5, title: "Unterbrechen und klären", lessons: [
        { id: "5-1", title: "Höflich unterbrechen" },
        { id: "5-2", title: "Wenn du nicht mehr folgen kannst" },
        { id: "5-3", title: "Das Gespräch zurückholen" },
    ] },
    { id: 6, title: "Selbstbewusst wirken", lessons: [
        { id: "6-1", title: "Stimme, Tempo, Pausen" },
        { id: "6-2", title: "Körpersprache" },
        { id: "6-3", title: "Kleine Erfolge" },
    ] },
    { id: 7, title: "Alles zusammen: Missionen im echten Leben", lessons: [
        { id: "7-1", title: "Mission Meeting" },
        { id: "7-2", title: "Mission Telefonat" },
        { id: "7-3", title: "Abschluss" },
    ] },
];

// Lesson content, keyed by lesson id.
// Exercise types: choice (multiple choice), gap (type the missing word), order (build the sentence),
// write (free answer, compared with model answers – no automatic grading).
const COURSE_LESSONS = {
    "2-2": {
        goal: "Du kannst im Gespräch höflich nachfragen, wenn du etwas nicht verstanden hast – statt zu nicken und zu hoffen.",
        explanation: [
            "Viele nicken lieber, als nachzufragen – aus Angst, unhöflich oder schlecht vorbereitet zu wirken. Dabei ist Nachfragen im Englischen völlig normal, auch unter Muttersprachlern.",
            "Wichtig ist, genau zu sagen, was du brauchst: Soll die Person etwas <strong>wiederholen</strong>, <strong>langsamer sprechen</strong>, ein <strong>Wort erklären</strong> oder ein <strong>Beispiel geben</strong>?",
            "Ein kurzes <em>„Sorry, …“</em> am Anfang macht jede Nachfrage freundlich. Englisch klingt mit solchen Weichmachern natürlicher als die direkte deutsche Variante.",
            "Je genauer deine Frage, desto besser die Antwort – und desto kompetenter wirkst du.",
        ],
        phrases: [
            { en: "Sorry, could you repeat that?", de: "Entschuldigung, könntest du das wiederholen?" },
            { en: "Could you say that again, please?", de: "Könntest du das bitte noch mal sagen?" },
            { en: "Could you speak a bit more slowly, please?", de: "Könntest du bitte etwas langsamer sprechen?" },
            { en: "Sorry, I didn't catch that.", de: "Sorry, das habe ich nicht mitbekommen." },
            { en: "What do you mean by “…”?", de: "Was meinst du mit „…“?" },
            { en: "What does “…” mean?", de: "Was bedeutet „…“?" },
            { en: "Could you give me an example?", de: "Könntest du mir ein Beispiel geben?" },
            { en: "Sorry, did you say fifteen or fifty?", de: "Hast du fünfzehn oder fünfzig gesagt? (gezielt nachfragen)" },
        ],
        exercises: [
            { type: "choice",
              prompt: "In einem Call hast du eine Zahl nicht richtig verstanden. Was sagst du?",
              options: ["Sorry, did you say 15 or 50?", "What?", "Repeat.", "I don't understand nothing."],
              answer: 0,
              explain: "Gezielt nachfragen: Du zeigst, was du verstanden hast – und die andere Person muss nur das Unklare wiederholen." },
            { type: "choice",
              prompt: "Ein Kollege sagt „ballpark figure“. Du kennst den Ausdruck nicht. Was sagst du?",
              options: ["What do you mean by “ballpark figure”?", "Ballpark? I don't know this.", "Please speak normal English.", "Okay, sure."],
              answer: 0,
              explain: "„Okay, sure“ wäre Nicken und Hoffen. Mit „What do you mean by …?“ fragst du höflich und konkret nach. (Übrigens: a ballpark figure = eine grobe Schätzung.)" },
            { type: "gap",
              prompt: "Sorry, I didn't ___ that.",
              answers: ["catch", "get", "hear"],
              explain: "„I didn't catch that“ ist die natürlichste Form. „get“ und „hear“ gehen auch." },
            { type: "gap",
              prompt: "Could you speak a bit more ___, please?",
              answers: ["slowly"],
              explain: "Hier brauchst du das Adverb „slowly“ – nicht „slow“." },
            { type: "order",
              prompt: "Bring die Wörter in die richtige Reihenfolge:",
              words: ["Could", "you", "give", "me", "an", "example?"],
              explain: "„Could you …?“ ist die höfliche Standardform für Bitten." },
            { type: "write",
              prompt: "Deine Chefin erklärt im Meeting einen neuen Prozess sehr schnell. Den zweiten Schritt hast du nicht verstanden. Was sagst du?",
              models: [
                  "Sorry, could you go over the second step again?",
                  "Sorry, I didn't quite catch the second step – could you explain it again?",
              ],
              tip: "Nenne genau, was du nicht verstanden hast – hier: den zweiten Schritt. Dann muss niemand alles wiederholen." },
        ],
        mistake: {
            wrong: "Can you repeat?",
            right: "Could you repeat that?",
            explain: "„repeat“ braucht im Englischen ein Objekt (that oder it). Und „could“ klingt höflicher als „can“.",
        },
        mission: "Frag in den nächsten Tagen mindestens einmal bewusst nach – in einem Meeting, einem Call oder sogar bei einer englischen Serie: Stoppe, sag laut „Sorry, could you repeat that?“ und spiel die Stelle noch einmal ab. Ziel: Die Phrase soll sich ganz normal anfühlen.",
    },
};
