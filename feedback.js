// Feedback box at the end of content pages: "What could be better on this page?" – a text field and a send button.
// Anonymous: only the page (incl. lesson/game id from the URL), the language and the comment go to Supabase
// (table feedback, insert-only – see Nawee_Supabase/09-feedback-and-reviews.sql). After sending, the box invites a review.

(() => {
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key: safe to be public (insert-only table)
    const main = document.querySelector("main");
    if (!main) return;

    const de = document.documentElement.lang.startsWith("de");
    const file = (location.pathname.split("/").pop() || "index.html").replace(/[^a-z0-9.-]/gi, "").slice(0, 60) || "index.html";
    // keep ids that name a lesson, game or deck (?l=1-1, ?g=race …), drop tracking and preview parameters
    const params = [...new URLSearchParams(location.search)]
        .filter(([k]) => !/^(utm_|fbclid|gclid|season|mode|danke)/i.test(k))
        .slice(0, 2)
        .map(([k, v]) => `${k}=${v}`.replace(/[^a-z0-9=_-]/gi, "").slice(0, 24));
    const page = (params.length ? `${file}?${params.join("&")}` : file).slice(0, 120);

    const kind = /^(lektion|communication-lesson|beruf-lektion|work-lesson)\.html$/.test(file) ? "lesson"
        : /^(tippen|typing)\.html$/.test(file) ? "course"
        : /^(index|index-en)\.html$/.test(file) ? "site" : "page";
    const T = de ? {
        q: { lesson: "Was können wir an dieser Lektion besser machen?", course: "Was können wir an diesem Kurs besser machen?", site: "Was können wir an Nawee besser machen?", page: "Was können wir an dieser Seite besser machen?" }[kind],
        lead: "Hat etwas gefehlt, war etwas unklar – oder hat dir etwas besonders gut gefallen? Schreib es uns. Wir lesen jede Nachricht.",
        ph: "z. B. „Die Übung war mir zu schnell“ oder „Die Bildkarten haben mir sehr geholfen“",
        label: "Dein Feedback",
        hint: "Anonym – bitte keine persönlichen Daten.",
        send: "Feedback senden", sent: "Danke! 💛 Dein Feedback hilft uns, Nawee besser zu machen.",
        more: "Noch etwas?",
        review: "Magst du Nawee? <a href=\"bewertungen.html#schreiben\">Schreib eine kurze Bewertung →</a>",
        error: "Das hat gerade nicht geklappt. Versuch es bitte später noch einmal.",
    } : {
        q: { lesson: "What could be better in this lesson?", course: "What could be better in this course?", site: "What could be better on Nawee?", page: "What could be better on this page?" }[kind],
        lead: "Was something missing or unclear – or did you really like something? Tell us. We read every message.",
        ph: "e.g. “The exercise was too fast for me” or “The picture cards helped me a lot”",
        label: "Your feedback",
        hint: "Anonymous – please don’t add personal details.",
        send: "Send feedback", sent: "Thank you! 💛 Your feedback helps us make Nawee better.",
        more: "Anything else?",
        review: "Do you like Nawee? <a href=\"reviews.html#write\">Write a short review →</a>",
        error: "That didn’t work right now. Please try again later.",
    };

    const send = (row) => fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ lang: de ? "de" : "en", page, ...row }),
        keepalive: true,
    }).then((r) => { if (!r.ok) throw new Error(r.status); });

    const box = document.createElement("section");
    box.className = "fb";
    box.setAttribute("aria-label", "Feedback");
    const showForm = () => {
        box.innerHTML = `<p class="fb-q">💬 ${T.q}</p>
            <p class="fb-lead">${T.lead}</p>
            <form class="fb-form">
                <label class="visually-hidden" for="fb-comment">${T.label}</label>
                <textarea id="fb-comment" maxlength="500" rows="3" placeholder="${T.ph}" required></textarea>
                <div class="fb-actions"><button type="submit" class="button primary">${T.send}</button><span class="fb-hint">${T.hint}</span></div>
            </form>`;
    };
    const showThanks = () => {
        box.innerHTML = `<p class="fb-sent" role="status">${T.sent}</p><p class="fb-review"><button type="button" class="link fb-more" data-fb-more>${T.more}</button> · ${T.review}</p>`;
    };

    box.addEventListener("click", (e) => { if (e.target.closest("[data-fb-more]")) { showForm(); box.querySelector("textarea").focus(); } });
    box.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target;
        const comment = form.querySelector("textarea").value.trim().slice(0, 500);
        if (!comment) return;
        const btn = form.querySelector("button");
        btn.disabled = true;
        send({ comment })
            .then(showThanks)
            .catch(() => { btn.disabled = false; if (!form.querySelector(".fb-error")) form.insertAdjacentHTML("beforeend", `<p class="fb-error" role="alert">${T.error}</p>`); });
    });

    showForm();
    main.append(box);
})();
