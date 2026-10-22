// "Did you know?" strip on the homepage: short English facts that change every few seconds.
// Pauses while hovered or focused, and stays still for visitors who turned off animations.

(() => {
    const root = document.querySelector("[data-facts]");
    if (!root) return;

    const de = document.documentElement.lang === "de";
    const FACTS = de ? [
        "Das häufigste Wort im Englischen ist „the“.",
        "„Goodbye“ kommt von „God be with ye“ – Gott sei mit euch.",
        "Das Verb „run“ hat im Oxford English Dictionary über 600 Bedeutungen.",
        "„The quick brown fox jumps over the lazy dog“ enthält jeden Buchstaben des Alphabets.",
        "„Queue“ klingt genauso, wenn man die letzten vier Buchstaben weglässt: „Q“.",
        "Rund 1,5 Milliarden Menschen sprechen Englisch – nur etwa jeder Vierte davon als Muttersprache.",
        "Englisch und Deutsch sind verwandt: house – Haus, hand – Hand, water – Wasser.",
        "„Kindergarten“, „angst“ und „wanderlust“ sind deutsche Wörter, die im Englischen ganz normal sind.",
        "„ough“ klingt in though, through, tough und cough jedes Mal anders.",
        "„Bookkeeper“ hat drei Doppelbuchstaben direkt hintereinander: oo, kk, ee.",
        "„Color“ oder „colour“? Die amerikanische Schreibweise geht auf Noah Websters Wörterbuch von 1828 zurück.",
        "„E“ ist der häufigste Buchstabe im Englischen.",
    ] : [
        "The most common word in English is “the”.",
        "“Goodbye” comes from “God be with ye”.",
        "The verb “run” has more than 600 meanings in the Oxford English Dictionary.",
        "“The quick brown fox jumps over the lazy dog” uses every letter of the alphabet.",
        "“Queue” sounds the same if you remove the last four letters: “Q”.",
        "About 1.5 billion people speak English – only about one in four as their first language.",
        "English and German are related: house – Haus, hand – Hand, water – Wasser.",
        "“Kindergarten”, “angst” and “wanderlust” are German words that are everyday English.",
        "“ough” sounds different in though, through, tough and cough.",
        "“Bookkeeper” has three double letters in a row: oo, kk, ee.",
        "“Color” or “colour”? The American spelling goes back to Noah Webster’s dictionary of 1828.",
        "“E” is the most common letter in English.",
    ];

    const text = root.querySelector("[data-fact-text]");
    const dots = root.querySelector("[data-fact-dots]");
    dots.innerHTML = FACTS.map((_, n) => `<button type="button" aria-label="${de ? "Fakt" : "Fact"} ${n + 1}"></button>`).join("");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let i = 0, timer = null, paused = false;
    const show = (n, byUser) => {
        i = (n + FACTS.length) % FACTS.length;
        text.setAttribute("aria-live", byUser ? "polite" : "off"); // read aloud only when the visitor switches
        text.classList.remove("is-in");
        void text.offsetWidth; // restart the fade
        text.textContent = FACTS[i];
        text.classList.add("is-in");
        dots.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
    };
    const start = () => {
        clearInterval(timer);
        if (!still) timer = setInterval(() => { if (!paused && !document.hidden) show(i + 1); }, 7000);
    };

    root.querySelector("[data-fact-prev]").addEventListener("click", () => { show(i - 1, true); start(); });
    root.querySelector("[data-fact-next]").addEventListener("click", () => { show(i + 1, true); start(); });
    dots.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b) { show([...dots.children].indexOf(b), true); start(); }
    });
    root.addEventListener("mouseenter", () => { paused = true; });
    root.addEventListener("mouseleave", () => { paused = false; });
    root.addEventListener("focusin", () => { paused = true; });
    root.addEventListener("focusout", () => { paused = false; });

    show(Math.floor(Math.random() * FACTS.length));
    start();
})();
