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
            { id: "desk", audio: "audio/vocab/office/desk.m4a", exAudio: "audio/vocab/office/desk-ex.m4a", word: "desk", de: "Schreibtisch", example: "My desk is by the window." },
            { id: "chair", audio: "audio/vocab/office/chair.m4a", exAudio: "audio/vocab/office/chair-ex.m4a", word: "chair", de: "Stuhl", example: "Please take a chair." },
            { id: "computer", audio: "audio/vocab/office/computer.m4a", exAudio: "audio/vocab/office/computer-ex.m4a", word: "computer", de: "Computer", example: "My computer is very slow today." },
            { id: "keyboard", audio: "audio/vocab/office/keyboard.m4a", exAudio: "audio/vocab/office/keyboard-ex.m4a", word: "keyboard", de: "Tastatur", example: "The keyboard is new." },
            { id: "screen", audio: "audio/vocab/office/screen.m4a", exAudio: "audio/vocab/office/screen-ex.m4a", word: "screen", de: "Bildschirm", example: "Can you see my screen?" },
            { id: "printer", audio: "audio/vocab/office/printer.m4a", exAudio: "audio/vocab/office/printer-ex.m4a", word: "printer", de: "Drucker", example: "The printer is out of paper." },
            { id: "phone", audio: "audio/vocab/office/phone.m4a", exAudio: "audio/vocab/office/phone-ex.m4a", word: "phone", de: "Telefon", example: "Your phone is ringing." },
            { id: "mug", audio: "audio/vocab/office/mug.m4a", exAudio: "audio/vocab/office/mug-ex.m4a", word: "mug", de: "Becher, Tasse", example: "Would you like a mug of coffee?" },
            { id: "notebook", audio: "audio/vocab/office/notebook.m4a", exAudio: "audio/vocab/office/notebook-ex.m4a", word: "notebook", de: "Notizbuch", example: "I write my notes in a notebook." },
            { id: "pen", audio: "audio/vocab/office/pen.m4a", exAudio: "audio/vocab/office/pen-ex.m4a", word: "pen", de: "Stift", example: "Can I borrow your pen?" },
            { id: "folder", audio: "audio/vocab/office/folder.m4a", exAudio: "audio/vocab/office/folder-ex.m4a", word: "folder", de: "Mappe, Ordner", example: "The documents are in the blue folder." },
            { id: "calendar", audio: "audio/vocab/office/calendar.m4a", exAudio: "audio/vocab/office/calendar-ex.m4a", word: "calendar", de: "Kalender", example: "Let me check my calendar." },
            { id: "whiteboard", audio: "audio/vocab/office/whiteboard.m4a", exAudio: "audio/vocab/office/whiteboard-ex.m4a", word: "whiteboard", de: "Whiteboard", example: "Let’s write it on the whiteboard." },
            { id: "meeting-room", audio: "audio/vocab/office/meeting-room.m4a", exAudio: "audio/vocab/office/meeting-room-ex.m4a", word: "meeting room", de: "Besprechungsraum", example: "The meeting is in meeting room two." },
            { id: "coffee-machine", audio: "audio/vocab/office/coffee-machine.m4a", exAudio: "audio/vocab/office/coffee-machine-ex.m4a", word: "coffee machine", de: "Kaffeemaschine", example: "The coffee machine is in the kitchen." },
            { id: "stapler", audio: "audio/vocab/office/stapler.m4a", exAudio: "audio/vocab/office/stapler-ex.m4a", word: "stapler", de: "Tacker", example: "Where is the stapler?" },
            { id: "envelope", audio: "audio/vocab/office/envelope.m4a", exAudio: "audio/vocab/office/envelope-ex.m4a", word: "envelope", de: "Briefumschlag", example: "Please put the letter in an envelope." },
            { id: "headset", audio: "audio/vocab/office/headset.m4a", exAudio: "audio/vocab/office/headset-ex.m4a", word: "headset", de: "Headset", example: "I use a headset for video calls." },
            { id: "badge", audio: "audio/vocab/office/badge.m4a", exAudio: "audio/vocab/office/badge-ex.m4a", word: "badge", de: "Ausweis", example: "Don’t forget your badge." },
            { id: "clock", audio: "audio/vocab/office/clock.m4a", exAudio: "audio/vocab/office/clock-ex.m4a", word: "clock", de: "Uhr", example: "The clock says nine." },
        ],
    },
};
