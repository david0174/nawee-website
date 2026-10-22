// Picture flashcards (spaced repetition, like Anki): picture → say the word → flip → hear it.
// Each word can get `audio` / `exAudio` (David's recordings, e.g. "audio/vocab/office/desk.m4a");
// until then the browser voice reads it aloud. Pictures: own illustrations in assets/vocab/<deck>/.

const VOCAB_DECKS = {
    office: {
        title: { de: "Im Büro", en: "At the office" },
        path: "career",
        level: "A1",
        intro: {
            de: "20 Dinge, die du im Büro jeden Tag siehst. Sag das Wort laut, bevor du die Karte umdrehst.",
            en: "20 things you see at the office every day. Say the word out loud before you flip the card.",
        },
        words: [
            { id: "desk", word: "desk", de: "Schreibtisch", example: "My desk is by the window." },
            { id: "chair", word: "chair", de: "Stuhl", example: "Please take a chair." },
            { id: "computer", word: "computer", de: "Computer", example: "My computer is very slow today." },
            { id: "keyboard", word: "keyboard", de: "Tastatur", example: "The keyboard is new." },
            { id: "screen", word: "screen", de: "Bildschirm", example: "Can you see my screen?" },
            { id: "printer", word: "printer", de: "Drucker", example: "The printer is out of paper." },
            { id: "phone", word: "phone", de: "Telefon", example: "Your phone is ringing." },
            { id: "mug", word: "mug", de: "Becher, Tasse", example: "Would you like a mug of coffee?" },
            { id: "notebook", word: "notebook", de: "Notizbuch", example: "I write my notes in a notebook." },
            { id: "pen", word: "pen", de: "Stift", example: "Can I borrow your pen?" },
            { id: "folder", word: "folder", de: "Mappe, Ordner", example: "The documents are in the blue folder." },
            { id: "calendar", word: "calendar", de: "Kalender", example: "Let me check my calendar." },
            { id: "whiteboard", word: "whiteboard", de: "Whiteboard", example: "Let’s write it on the whiteboard." },
            { id: "meeting-room", word: "meeting room", de: "Besprechungsraum", example: "The meeting is in meeting room two." },
            { id: "coffee-machine", word: "coffee machine", de: "Kaffeemaschine", example: "The coffee machine is in the kitchen." },
            { id: "stapler", word: "stapler", de: "Tacker", example: "Where is the stapler?" },
            { id: "envelope", word: "envelope", de: "Briefumschlag", example: "Please put the letter in an envelope." },
            { id: "headset", word: "headset", de: "Headset", example: "I use a headset for video calls." },
            { id: "badge", word: "badge", de: "Ausweis", example: "Don’t forget your badge." },
            { id: "clock", word: "clock", de: "Uhr", example: "The clock says nine." },
        ],
    },
};
