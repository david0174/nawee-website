// Learner reviews (bewertungen.html / reviews.html, plus a short strip on the homepage).
// [data-reviews] lists approved reviews from Supabase (data-limit = how many; a section marked
// data-reviews-section stays hidden while there are none). [data-review-form] sends a new review – it is
// hidden until David approves it (table reviews, see Nawee_Supabase/09-feedback-and-reviews.sql).

(() => {
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key: only approved reviews are readable
    const SENT_KEY = "nawee-review-sent";
    const de = document.documentElement.lang.startsWith("de");
    const headers = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
    const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const T = de ? {
        empty: "Noch keine Bewertungen – schreib gern die erste!",
        sent: "Danke! 💛 David liest deine Bewertung und schaltet sie dann frei. Das kann ein paar Tage dauern.",
        already: "Du hast vor Kurzem schon eine Bewertung geschickt – danke! Wenn du etwas ändern möchtest, schreib an david@nawee.net.",
        error: "Das hat gerade nicht geklappt. Versuch es bitte später noch einmal.",
        short: "Bitte schreib mindestens 20 Zeichen.",
        date: { day: "numeric", month: "long", year: "numeric" },
    } : {
        empty: "No reviews yet – be the first to write one!",
        sent: "Thank you! 💛 David reads your review and then publishes it. This can take a few days.",
        already: "You sent a review recently – thank you! If you want to change something, write to david@nawee.net.",
        error: "That didn’t work right now. Please try again later.",
        short: "Please write at least 20 characters.",
        date: { month: "long", day: "numeric", year: "numeric" },
    };

    const card = (r) => `<figure class="review-card">
            <blockquote>“${esc(r.text)}”</blockquote>
            <figcaption><strong>${esc(r.name)}</strong>${r.about ? ` · ${esc(r.about)}` : ""}
                <span>${new Date(r.created_at).toLocaleDateString(de ? "de-DE" : "en-US", T.date)}</span></figcaption>
        </figure>`;

    document.querySelectorAll("[data-reviews]").forEach((list) => {
        const limit = Math.min(Number(list.dataset.limit) || 50, 50);
        const section = list.closest("[data-reviews-section]");
        fetch(`${SUPABASE_URL}/rest/v1/reviews?select=name,about,text,lang,created_at&approved=eq.true&order=created_at.desc&limit=${limit}`, { headers })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
            .then((rows) => {
                if (!rows.length) {
                    if (section) section.hidden = true; else list.innerHTML = `<p class="review-empty">${T.empty}</p>`;
                    return;
                }
                list.innerHTML = rows.map(card).join("");
                if (section) section.hidden = false;
            });
    });

    const form = document.querySelector("[data-review-form]");
    if (!form) return;
    const status = form.querySelector("[data-review-status]");
    const say = (msg, bad) => { status.textContent = msg; status.classList.toggle("is-error", !!bad); };
    try {
        const last = Number(localStorage.getItem(SENT_KEY));
        if (last && Date.now() - last < 24 * 3600 * 1000) { form.querySelector("fieldset").disabled = true; say(T.already); }
    } catch { /* storage unavailable */ }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(form);
        if (f.get("website")) return; // spam trap, people never see this field
        const text = String(f.get("text") || "").trim();
        if (text.length < 20) { say(T.short, true); return; }
        const row = {
            lang: de ? "de" : "en",
            name: String(f.get("name") || "").trim().slice(0, 40),
            about: String(f.get("about") || "").trim().slice(0, 60) || null,
            text: text.slice(0, 600),
            consent: f.get("consent") === "on",
        };
        if (!row.name || !row.consent) return; // the browser already asks for both (required)
        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        fetch(`${SUPABASE_URL}/rest/v1/reviews`, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify(row) })
            .then((r) => { if (!r.ok) throw new Error(r.status); })
            .then(() => {
                try { localStorage.setItem(SENT_KEY, String(Date.now())); } catch { /* storage unavailable */ }
                form.querySelector("fieldset").disabled = true;
                say(T.sent);
            })
            .catch(() => { btn.disabled = false; say(T.error, true); });
    });
})();
