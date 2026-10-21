// Learning hub (learn.html / lernen.html): shows the visitor's progress on the course cards.
// Reads the progress the courses keep in this browser (localStorage); nothing is sent anywhere.

(() => {
    const de = document.documentElement.lang === "de";
    const text = (done, total) => de ? `${done} von ${total} Lektionen geschafft` : `${done} of ${total} lessons done`;

    document.querySelectorAll("[data-progress-key]").forEach((card) => {
        let completed = [];
        try { completed = (JSON.parse(localStorage.getItem(card.dataset.progressKey)) || {}).completed || []; } catch { /* storage unavailable */ }
        const done = completed.length;
        if (!done) return;
        const total = Number(card.dataset.total) || done;
        card.querySelector("[data-progress]").hidden = false;
        card.querySelector("[data-progress-bar]").style.width = `${Math.min(100, (done / total) * 100)}%`;
        card.querySelector("[data-progress-text]").textContent = text(done, total);
        const button = card.querySelector("[data-progress-button]");
        button.innerHTML = `${button.dataset.continueLabel} <span aria-hidden="true">→</span>`;
    });
})();
