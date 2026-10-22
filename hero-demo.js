// Homepage hero: a tiny picture-card demo inside the phone. Visitors pick the word for the picture
// and hear David's recording of the answer. Uses the "office" deck from vocab-data.js. Nothing is saved.

(() => {
    const root = document.querySelector("[data-hero-demo]");
    if (!root || typeof VOCAB_DECKS === "undefined") return;

    const de = document.documentElement.lang === "de";
    const T = de ? {
        ask: "Was ist das?", count: (i, n) => `Karte ${i} / ${n}`, right: "Richtig!", wrong: (w) => `Das ist „${w}“.`,
        next: "Weiter", example: "Beispiel", again: "Nochmal hören",
        done: (r, n) => `${r} von ${n} richtig!`, doneText: "Das war ein kleiner Vorgeschmack.", more: "Weiter üben", moreHref: "vokabeln.html",
    } : {
        ask: "What is this?", count: (i, n) => `Card ${i} / ${n}`, right: "Correct!", wrong: (w) => `It’s “${w}”.`,
        next: "Next", example: "Example", again: "Hear it again",
        done: (r, n) => `${r} of ${n} correct!`, doneText: "That was a little taste.", more: "Keep practicing", moreHref: "vocabulary.html",
    };

    const deck = VOCAB_DECKS.office;
    const pick = ["mug", "desk", "printer", "clock"].map((id) => deck.words.find((w) => w.id === id)).filter(Boolean);
    const others = deck.words.filter((w) => !pick.includes(w));
    const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    let audio = null;
    const play = (file, text) => {
        if (audio) audio.pause();
        if (file) { audio = new Audio(file); audio.play().catch(() => {}); return; }
        if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; speechSynthesis.speak(u); }
    };

    let i = 0, right = 0;
    const card = () => {
        if (i >= pick.length) {
            root.innerHTML = `<div class="hd-done">
                <p class="hd-done-icon" aria-hidden="true">✓</p>
                <p class="hd-done-title">${T.done(right, pick.length)}</p>
                <p class="hd-done-text">${T.doneText}</p>
                <a class="hd-more" href="${T.moreHref}">${T.more} →</a>
            </div>`;
            return;
        }
        const w = pick[i];
        const options = shuffle([w, ...shuffle(others).slice(0, 2)]);
        root.innerHTML = `<div class="hs-top"><span class="hs-progress"><span style="width:${(i / pick.length) * 100}%"></span></span><span class="hs-count">${T.count(i + 1, pick.length)}</span></div>
            <p class="hd-ask">${T.ask}</p>
            <img src="assets/vocab/office/${w.id}.svg" alt="">
            <div class="hd-options">${options.map((o) => `<button type="button" class="hd-option" data-id="${o.id}">${esc(o.word)}</button>`).join("")}</div>
            <div class="hd-result" hidden></div>`;
        root.querySelectorAll(".hd-option").forEach((b) => b.addEventListener("click", () => {
            const ok = b.dataset.id === w.id;
            if (ok) right += 1;
            root.querySelectorAll(".hd-option").forEach((x) => {
                x.disabled = true;
                if (x.dataset.id === w.id) x.classList.add("is-right");
            });
            if (!ok) b.classList.add("is-wrong");
            play(w.audio, w.word); // hear the answer right away
            const res = root.querySelector(".hd-result");
            res.innerHTML = `<p class="hd-feedback ${ok ? "is-right" : "is-wrong"}">${ok ? "✓ " + T.right : "✗ " + esc(T.wrong(w.word))}</p>
                <div class="hd-row">
                    <button type="button" class="hd-play" aria-label="${T.again}">▶</button>
                    <button type="button" class="hd-example">▶ ${T.example}</button>
                    <button type="button" class="hd-next">${T.next} →</button>
                </div>`;
            res.hidden = false;
            res.querySelector(".hd-play").addEventListener("click", () => play(w.audio, w.word));
            res.querySelector(".hd-example").addEventListener("click", () => play(w.exAudio, w.example));
            res.querySelector(".hd-next").addEventListener("click", () => { i += 1; card(); });
        }));
    };
    card();
})();
