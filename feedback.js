// "Did you like this?" box at the end of content pages: yes / partly / no, then an optional comment.
// Anonymous: only the page (incl. lesson/game id from the URL), the language, the vote and the comment go to
// Supabase (table feedback, insert-only – see Nawee_Supabase/09-feedback-and-reviews.sql). One vote per page
// and browser (localStorage). After a "yes" the box invites a review (bewertungen.html / reviews.html).

(() => {
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key: safe to be public (insert-only table)
    const KEY = "nawee-feedback-v1";
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
        q: { lesson: "Hat dir diese Lektion gefallen?", course: "Gefällt dir dieser Kurs?", site: "Gefällt dir Nawee?", page: "Hat dir diese Seite geholfen?" }[kind],
        yes: "Ja", maybe: "Teils", no: "Nein",
        thanks: "Danke für dein Feedback! 💛",
        ask: { yes: "Was hat dir besonders gefallen? (optional)", maybe: "Was können wir besser machen? (optional)", no: "Was hat dir gefehlt? (optional)" },
        hint: "Anonym – bitte keine persönlichen Daten.",
        send: "Senden", sent: "Danke – das hilft uns, Nawee besser zu machen!",
        done: "Du hast diese Seite schon bewertet – danke! 💛",
        review: "Magst du Nawee? <a href=\"bewertungen.html#schreiben\">Schreib eine kurze Bewertung →</a>",
        error: "Das hat gerade nicht geklappt. Versuch es bitte später noch einmal.",
    } : {
        q: { lesson: "Did you like this lesson?", course: "Do you like this course?", site: "Do you like Nawee?", page: "Was this page helpful?" }[kind],
        yes: "Yes", maybe: "Partly", no: "No",
        thanks: "Thank you for your feedback! 💛",
        ask: { yes: "What did you like most? (optional)", maybe: "What can we do better? (optional)", no: "What was missing? (optional)" },
        hint: "Anonymous – please don’t add personal details.",
        send: "Send", sent: "Thank you – this helps us make Nawee better!",
        done: "You already rated this page – thank you! 💛",
        review: "Do you like Nawee? <a href=\"reviews.html#write\">Write a short review →</a>",
        error: "That didn’t work right now. Please try again later.",
    };

    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const remember = (vote) => { try { const all = load(); all[page] = vote; localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage unavailable */ } };
    const send = (row) => fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ lang: de ? "de" : "en", page, ...row }),
        keepalive: true,
    }).then((r) => { if (!r.ok) throw new Error(r.status); });

    const box = document.createElement("section");
    box.className = "fb";
    box.setAttribute("aria-label", "Feedback");
    const reviewLine = `<p class="fb-review">${T.review}</p>`;

    const showDone = () => { box.innerHTML = `<p class="fb-q">${T.done}</p>${reviewLine}`; };
    const showVote = () => {
        box.innerHTML = `<p class="fb-q">${T.q}</p><div class="fb-votes">`
            + [["yes", "👍"], ["maybe", "🤔"], ["no", "👎"]].map(([v, e]) => `<button type="button" data-vote="${v}"><span aria-hidden="true">${e}</span> ${T[v]}</button>`).join("")
            + "</div>";
    };
    const showComment = (vote) => {
        box.innerHTML = `<p class="fb-q" role="status">${T.thanks}</p>
            <form class="fb-form">
                <label for="fb-comment">${T.ask[vote]}</label>
                <textarea id="fb-comment" maxlength="500" rows="3"></textarea>
                <p class="fb-hint">${T.hint}</p>
                <button type="submit" class="button primary">${T.send}</button>
            </form>${vote === "yes" ? reviewLine : ""}`;
    };

    box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-vote]");
        if (!b) return;
        const vote = b.dataset.vote;
        remember(vote);
        send({ vote }).catch(() => {}); // fire and forget – the box thanks either way
        showComment(vote);
        box.querySelector("textarea").focus({ preventScroll: true });
    });
    box.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target;
        const comment = form.querySelector("textarea").value.trim().slice(0, 500);
        if (!comment) { form.remove(); return; }
        const btn = form.querySelector("button");
        btn.disabled = true;
        send({ comment })
            .then(() => { form.outerHTML = `<p class="fb-sent" role="status">${T.sent}</p>`; })
            .catch(() => { btn.disabled = false; if (!form.querySelector(".fb-error")) form.insertAdjacentHTML("beforeend", `<p class="fb-error" role="alert">${T.error}</p>`); });
    });

    if (load()[page]) showDone(); else showVote();
    main.append(box);
})();
