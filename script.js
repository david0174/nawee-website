document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(
    ".card, .benefit, .approach-copy, .about-copy, .future, .consultation-inner"
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((element) => {
        element.classList.add("reveal");
        observer.observe(element);
    });
} else {
    revealItems.forEach((element) => element.classList.add("visible"));
}

// LinkedIn posts shown in the grid, newest first.
// To add a post: on LinkedIn open the post, click "…" → "Embed this post",
// then copy the address inside src="…" from the embed code and paste it below.
const linkedinPosts = [
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7517964795745083393",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7513548537536806912",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7509928475101642753",
];

const linkedinButton = document.getElementById("linkedin-load");
const linkedinGrid = document.getElementById("linkedin-grid");

if (linkedinButton && linkedinGrid) {
    linkedinButton.addEventListener("click", () => {
        linkedinPosts.forEach((src) => {
            const iframe = document.createElement("iframe");
            // collapsed=1: only the first lines of text, so the image shows sooner
            const url = new URL(src);
            url.searchParams.set("collapsed", "1");
            iframe.src = url.href;
            iframe.title = document.documentElement.lang === "de" ? "LinkedIn-Beitrag" : "LinkedIn post";
            iframe.loading = "lazy";
            iframe.setAttribute("allowfullscreen", "");
            linkedinGrid.appendChild(iframe);
        });

        document.getElementById("linkedin-consent").hidden = true;
    });
}

// Dropdowns in the header: the language icon and the burger menu (small screens)
const dropdowns = [
    [document.querySelector(".language-toggle"), document.getElementById("language-menu")],
    [document.querySelector(".menu-toggle"), document.getElementById("mobile-menu")],
].filter(([toggle, menu]) => toggle && menu);

const closeDropdown = ([toggle, menu]) => {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
};

dropdowns.forEach(([toggle, menu]) => {
    toggle.addEventListener("click", () => {
        const opening = menu.hidden;
        dropdowns.forEach(closeDropdown);
        menu.hidden = !opening;
        toggle.setAttribute("aria-expanded", String(opening));
    });

    // Close after choosing a link, e.g. jumping to a section
    menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeDropdown([toggle, menu]);
    });
});

// Close when clicking anywhere outside a menu
document.addEventListener("click", (event) => {
    if (!event.target.closest(".language-switch, .menu-switch")) dropdowns.forEach(closeDropdown);
});

// Close with the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dropdowns.forEach(closeDropdown);
});

// Newsletter: send the form to Brevo in the background and show the result in place.
// Nothing is loaded from Brevo until someone actually clicks "Abonnieren".
// addresses signed up from this browser – only a scrambled fingerprint is kept, never the address itself
const fingerprint = (email) => {
    let h = 5381;
    for (const c of String(email).trim().toLowerCase()) h = ((h * 33) ^ c.codePointAt(0)) >>> 0;
    return h.toString(36);
};
const subscribed = () => { try { return JSON.parse(localStorage.getItem("nawee-nl-done")) || []; } catch { return []; } };
const remember = (email) => { try { localStorage.setItem("nawee-nl-done", JSON.stringify([...new Set([...subscribed(), fingerprint(email)])].slice(-5))); } catch { /* ignore */ } };

document.querySelectorAll(".nl-form").forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".nl-status");
    const buttonHTML = button.innerHTML; // keeps the animated arrow

    const show = (message, ok) => {
        status.textContent = message;
        status.classList.toggle("nl-status--error", !ok);
        status.hidden = false;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        // spam trap (a field humans never see; its name is chosen so browsers don't autofill it)
        if (form.nl_zx_hp && form.nl_zx_hp.value) { show(form.dataset.error, false); return; }
        if (form.email_address_check) form.email_address_check.value = ""; // Brevo's own check field: always empty
        // already signed up from this browser? (Brevo itself answers "success" again and resends the confirmation email)
        if (subscribed().includes(fingerprint(form.EMAIL.value))) { show(form.dataset.already, false); return; }

        button.disabled = true;
        button.textContent = form.dataset.sending;
        try {
            const send = (data) => fetch(form.action, { method: "POST", body: new URLSearchParams(data) })
                .then(async (r) => ({ ok: r.ok, result: await r.json().catch(() => ({})) }));
            const fields = new FormData(form); fields.delete("nl_zx_hp");
            let { ok, result } = await send(fields);
            if ((!ok || !result.success) && form.VORNAME && form.VORNAME.value) {
                // safety net: if Brevo rejects the optional first name, sign up with the email address only
                const data = new FormData(form); data.delete("VORNAME"); data.delete("nl_zx_hp");
                ({ ok, result } = await send(data));
            }
            if (!ok || !result.success) {
                // Brevo says the address is already on the list → short red note instead of the general error
                const text = JSON.stringify(result || {}).toLowerCase();
                if (/already|bereits|exist|déjà/.test(text)) { show(form.dataset.already, false); return; }
                throw new Error("not saved");
            }
            remember(form.EMAIL.value);
            form.reset();
            show(form.dataset.success, true);
        } catch {
            show(form.dataset.error, false);
        } finally {
            button.disabled = false;
            button.innerHTML = buttonHTML;
        }
    });
});

// "Back to top" button: appears after scrolling down, scrolls smoothly back up
const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", document.documentElement.lang === "de" ? "Nach oben scrollen" : "Back to top");
backToTop.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
document.body.appendChild(backToTop);

const toggleBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 600);
window.addEventListener("scroll", toggleBackToTop, { passive: true });
toggleBackToTop();

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const skip = document.querySelector(".skip-link");
    if (skip) skip.focus({ preventScroll: true });
});

// Language: remember the language a visitor picks in the menu and open that version on later visits
// (no popup; search engines still see every page in both languages)
(() => {
    const PREF_KEY = "nawee-lang";
    const lang = document.documentElement.lang.startsWith("de") ? "de" : "en";
    const other = lang === "de" ? "en" : "de";
    const getPref = () => { try { return localStorage.getItem(PREF_KEY); } catch { return null; } };
    const setPref = (value) => { try { localStorage.setItem(PREF_KEY, value); } catch { /* storage unavailable */ } };

    // choosing a language in the menu counts as an explicit choice
    document.querySelectorAll(".language-menu a[lang], .mobile-menu-languages a[lang]").forEach((a) => {
        a.addEventListener("click", () => setPref(a.lang));
    });

    // language switch in the footer (the header stays clean; on phones it is also in the burger menu)
    const menuLinks = [...document.querySelectorAll(".language-menu a[lang]")];
    const copy = document.querySelector(".footer-copy");
    if (copy && menuLinks.length) {
        const sw = document.createElement("p");
        sw.className = "footer-lang";
        sw.innerHTML = `<span aria-hidden="true">🌐</span> ${menuLinks.map((a) => `<a href="${a.getAttribute("href")}" lang="${a.lang}"${a.lang === lang ? ' aria-current="true"' : ""}>${a.lang === "de" ? "Deutsch" : "English"}</a>`).join(" · ")}`;
        sw.querySelectorAll("a[lang]").forEach((a) => a.addEventListener("click", () => setPref(a.lang)));
        copy.prepend(sw);
    }

    // header dropdown: "🌐 DE ▾" – lists all languages (more can be added to the menu later)
    const toggle = document.querySelector(".site-header .language-toggle");
    if (toggle) {
        toggle.innerHTML = `<span aria-hidden="true">🌐</span> ${lang.toUpperCase()} <span class="lang-caret" aria-hidden="true">▾</span>`;
        toggle.setAttribute("aria-label", lang === "de" ? "Sprache wählen" : "Choose language");
    }

    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${other}"]`);
    if (!alternate) return; // page exists in one language only
    const go = () => location.replace((new URL(alternate.href).pathname.split("/").pop() || "index.html") + location.search + location.hash);
    if (getPref() === other) { go(); return; }
    // first visit without a choice: browsers not set to German get the English page (not for search engine bots)
    const bot = /bot|crawl|spider|slurp|google|bing|yandex|duckduck|baidu|facebookexternalhit|preview/i.test(navigator.userAgent);
    const wantsGerman = (navigator.languages || [navigator.language || ""]).some((l) => /^de/i.test(l));
    if (!getPref() && lang === "de" && !wantsGerman && !bot && !navigator.webdriver) go();
})();

// Homepage: underline "Über mich" / "About Me" in the menu while the About Me section is on screen
(() => {
    const section = document.getElementById("ueber-mich");
    const links = document.querySelectorAll('.site-header nav > a[href*="#ueber-mich"], .mobile-menu > a[href*="#ueber-mich"]');
    if (!section || !links.length) return;
    // active while the section covers the middle of the screen
    const update = () => {
        const rect = section.getBoundingClientRect();
        const middle = window.innerHeight / 2;
        const active = rect.top <= middle && rect.bottom >= middle;
        links.forEach((a) => a.classList.toggle("is-current", active));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
})();

// "Wie ich arbeite": clicking a tile opens its panel below the row (one at a time); clicking it again closes it
const methodTabs = document.querySelectorAll(".method-tab");
methodTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const opening = tab.getAttribute("aria-expanded") !== "true";
        methodTabs.forEach((other) => {
            other.setAttribute("aria-expanded", "false");
            document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        });
        if (opening) {
            tab.setAttribute("aria-expanded", "true");
            document.getElementById(tab.getAttribute("aria-controls")).hidden = false;
        }
    });
});

// Hero tabs: jump to the main offers on the homepage (English coaching, Communication Coaching, free tests);
// the Communication Coaching box lights up briefly so it's clear where to look
document.querySelectorAll(".hero-audience").forEach((tab) => {
    tab.addEventListener("click", (event) => {
        const target = document.querySelector(tab.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        document.querySelectorAll(".hero-audience").forEach((t) => t.classList.toggle("active", t === tab));
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const box = target.querySelector(".pillar-inner");
        if (!box) return;
        box.classList.remove("is-highlight");
        void box.offsetWidth; // restart the animation
        box.classList.add("is-highlight");
        setTimeout(() => box.classList.remove("is-highlight"), 2300);
    });
});

// Newsletter: forward-moving entrance (heading, momentum line, form) once the section scrolls into view;
// "News from Nawee" (#linkedin): heading, posts and follow buttons pop forward the same way;
// "Let's find out what you need" (#kontakt): intro rises, benefits slide in from the left, contact panel from the right
["newsletter", "linkedin", "kontakt"].forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    if (!("IntersectionObserver" in window)) { section.classList.add("in-view"); return; }
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { section.classList.add("in-view"); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(section);
});

// Section headlines: words rise in one after another when the headline scrolls into view, then the
// highlighted word (<mark class="hl">) gets its yellow marker stroke. Skipped for "reduce motion".
(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const headlines = document.querySelectorAll("main h2:not(.about-heading):not(.ss-block > h2):not(.hire-box h2):not(.hx h2)");
    let index;
    const split = (node) => {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const parts = child.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.append(part); return; }
                    const word = document.createElement("span");
                    word.className = "hw";
                    word.style.setProperty("--i", index++);
                    word.textContent = part;
                    frag.append(word);
                });
                child.replaceWith(frag);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                split(child);
            }
        });
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-revealed");
            observer.unobserve(e.target);
        });
    }, { threshold: 0.6 });
    headlines.forEach((h) => {
        index = 0;
        h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim()); // read as one sentence
        split(h);
        h.style.setProperty("--words", index);
        h.classList.add("reveal-words");
        observer.observe(h);
    });
})();

// Free consultation boxes ("Not sure what you need? Let's find out together."): pop in once they scroll into view
(() => {
    const cards = document.querySelectorAll(".consult-card");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) { cards.forEach((c) => c.classList.add("in-view")); return; }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in-view");
            observer.unobserve(e.target);
        });
    }, { threshold: 0.4 });
    cards.forEach((c) => observer.observe(c));
})();

// Learning paths (für mich / Beruf / Schule): a path page remembers the choice in this browser;
// the path choosers on the homepage and the Learn page then mark it as "Dein Weg" / "Your path"
(() => {
    const KEY = "nawee-path";
    const page = document.querySelector("[data-path-page]");
    if (page) { try { localStorage.setItem(KEY, page.dataset.pathPage); } catch { /* storage unavailable */ } }
    let chosen = null;
    try { chosen = localStorage.getItem(KEY); } catch { /* storage unavailable */ }
    if (!chosen) return;
    const badge = document.documentElement.lang === "en" ? "Your path" : "Dein Weg";
    document.querySelectorAll(`[data-path-card="${chosen}"]`).forEach((card) => {
        card.classList.add("is-chosen");
        card.querySelector("strong")?.insertAdjacentHTML("afterend", `<span class="path-card-badge">${badge}</span>`);
    });
})();

// In-page links (menu, hero tabs, buttons) stop exactly below the sticky header,
// so a section starts right where its background color begins
(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const setOffset = () => { document.documentElement.style.scrollPaddingTop = `${header.offsetHeight}px`; };
    setOffset();
    window.addEventListener("resize", setOffset);
})();

// Avatars a learner can choose on the account page (saved in profiles.avatar, cached as "nawee-avatar").
window.NaweeAvatars = [
    { id: "fox", e: "🦊", bg: "#ffe1c7" }, { id: "panda", e: "🐼", bg: "#e6ebf2" }, { id: "owl", e: "🦉", bg: "#f0e3cf" },
    { id: "turtle", e: "🐢", bg: "#dcf2e2" }, { id: "dolphin", e: "🐬", bg: "#d8ecff" }, { id: "lion", e: "🦁", bg: "#ffefc0" },
    { id: "penguin", e: "🐧", bg: "#e1e7f6" }, { id: "koala", e: "🐨", bg: "#e8e8ee" }, { id: "bee", e: "🐝", bg: "#fff5bf" },
    { id: "butterfly", e: "🦋", bg: "#e4ddff" }, { id: "octopus", e: "🐙", bg: "#ffdfe9" }, { id: "frog", e: "🐸", bg: "#e0f5d2" },
    { id: "sunflower", e: "🌻", bg: "#fff2c2" }, { id: "rocket", e: "🚀", bg: "#dfe6ff" }, { id: "headphones", e: "🎧", bg: "#dbf3f3" },
    { id: "books", e: "📚", bg: "#f3e5da" },
];
window.NaweeAvatar = (id) => window.NaweeAvatars.find((a) => a.id === id) || null;

// Header: "Anmelden" / "Mein Konto" on every page, and a course announcement bar at the top.
// The login state is read from the session Supabase keeps in the browser (no extra library needed here).
(() => {
    const en = document.documentElement.lang === "en";
    const accountPage = en ? "account.html" : "konto.html";
    let loggedIn = false, session = null;
    try {
        session = JSON.parse(localStorage.getItem("sb-sphhbjfyreugpuzbwird-auth-token") || "null");
        loggedIn = Boolean(session && session.user && session.refresh_token);
    } catch { /* storage unavailable */ }
    // username: cached by account.js, otherwise from the sign-up data
    let username = "";
    if (loggedIn) {
        try { username = localStorage.getItem("nawee-username") || ""; } catch { /* ignore */ }
        const m = session.user.user_metadata || {};
        username = username || m.username || m.first_name || m.given_name || String(session.user.email || "").split("@")[0];
    }
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>';

    // header, right side – logged out: "Log in" + button "Create account"; logged in: the username (→ account page)
    const cta = document.querySelector(".site-header nav > .nav-cta");
    if (cta && loggedIn) {
        const wrap = document.createElement("div");
        wrap.className = "nav-user-wrap";
        wrap.innerHTML = `<button type="button" class="nav-user" aria-expanded="false" aria-haspopup="true">
                <span class="nav-user-badge" aria-hidden="true">${esc(username.charAt(0).toUpperCase() || "?")}</span><span class="nav-user-name">${esc(username)}</span><span class="nav-user-caret" aria-hidden="true">▾</span>
            </button>
            <div class="nav-user-menu" hidden></div>`;
        const btn = wrap.querySelector(".nav-user"), menu = wrap.querySelector(".nav-user-menu");
        // chosen avatar instead of the initial letter (updates live when it's changed on the account page)
        const badge = wrap.querySelector(".nav-user-badge");
        const showAvatar = () => {
            let id = ""; try { id = localStorage.getItem("nawee-avatar") || ""; } catch { /* ignore */ }
            const av = window.NaweeAvatar(id);
            badge.classList.toggle("has-avatar", Boolean(av));
            badge.style.background = av ? av.bg : "";
            badge.textContent = av ? av.e : (username.charAt(0).toUpperCase() || "?");
        };
        showAvatar();
        window.addEventListener("nawee:avatar", showAvatar);
        const fill = () => {
            const st = learnerStats();
            menu.innerHTML = `<p class="num-name">${esc(username)}</p>
                <ul class="num-stats">
                    <li><strong>🔥 ${st.streak}</strong>${en ? "day streak" : "Tage in Folge"}</li>
                    <li><strong>📚 ${st.words}</strong>${en ? "words" : "Wörter"}</li>
                    <li><strong>🎧 ${st.lessons}</strong>${en ? "lessons" : "Lektionen"}</li>
                    <li><strong>⏱️ ${st.timeText}</strong>${en ? "learned" : "gelernt"}</li>
                </ul>
                <a class="num-link" href="${accountPage}">${en ? "My account & progress" : "Mein Konto & Fortschritt"} →</a>
                <a class="num-logout" href="${accountPage}?logout=1">${en ? "Log out" : "Abmelden"}</a>`;
        };
        const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (menu.hidden) { fill(); menu.hidden = false; btn.setAttribute("aria-expanded", "true"); } else close();
        });
        document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) close(); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
        if (location.pathname.endsWith(accountPage)) btn.classList.add("is-current");
        cta.replaceWith(wrap);
    } else if (cta) {
        const login = document.createElement("a");
        login.className = "nav-account";
        login.href = accountPage;
        login.innerHTML = `${icon}<span>${en ? "Log in" : "Anmelden"}</span>`;
        if (location.pathname.endsWith(accountPage)) login.setAttribute("aria-current", "page");
        cta.before(login);
    }
    const mobileLanguages = document.querySelector(".mobile-menu .mobile-menu-languages");
    if (mobileLanguages) {
        const link = document.createElement("a");
        link.href = accountPage;
        link.textContent = loggedIn ? `${en ? "My account" : "Mein Konto"} (${username})` : (en ? "Log in" : "Anmelden");
        mobileLanguages.before(link);
    }

    // logged in: no "start your journey / get your plan" offers anymore – point to the learner's own progress
    if (loggedIn) {
        const startLink = (el) => /(^|\/)(start|get-started)\.html(?!\?edit)|#wege$/.test(el.getAttribute("href") || "");
        document.querySelectorAll(".as-cta").forEach((box) => {
            if (![...box.querySelectorAll("a")].some(startLink)) return;
            box.innerHTML = `<h2>${en ? "Let’s keep going!" : "Weiter geht’s!"}</h2>
                <p>${en ? "Pick up where you left off – your progress is saved in your account." : "Mach da weiter, wo du aufgehört hast – dein Fortschritt ist in deinem Konto gespeichert."}</p>
                <a class="button primary" href="${accountPage}">${en ? "Go to my progress" : "Zu meinem Fortschritt"} <span aria-hidden="true">→</span></a>`;
        });
        document.querySelectorAll("a[href]").forEach((a) => {
            if (!startLink(a) || a.closest(".site-header nav > .nav-user-wrap")) return;
            if (a.closest(".mobile-menu")) { a.remove(); return; }
            a.href = accountPage;
            if (a.classList.contains("button")) a.innerHTML = `${en ? "Continue learning" : "Weiter lernen"} <span aria-hidden="true">→</span>`;
        });
    }

    // logged in: a small stats line instead of the announcement – streak, learning time, words
    function learnerStats() {
        const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
        const vocab = read("nawee-vocab-v1"), time = read("nawee-time-v1");
        const days = new Set([...(read("nawee-trophies-v1").days || []), ...(vocab.days || []), ...(read("nawee-games-v1").days || []), ...Object.keys(time.days || {})]);
        Object.values(read("nawee-reading-v1").done || {}).forEach((r) => r.date && days.add(r.date));
        const iso = (d) => d.toISOString().slice(0, 10);
        const d = new Date();
        if (!days.has(iso(d))) d.setDate(d.getDate() - 1);
        let streak = 0;
        while (days.has(iso(d))) { streak += 1; d.setDate(d.getDate() - 1); }
        const minutes = Math.round((time.total || 0) / 60);
        const timeText = minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} ${en ? "min" : "Min."}` : `${minutes} ${en ? "min" : "Min."}`;
        const words = Object.values(vocab.cards || {}).filter((c) => (c.reps || 0) > 0).length;
        const lessons = (read("nawee-work-course-v1").completed || []).length + (read("nawee-course-v1").completed || []).length + (read("nawee-communication-course-v1").completed || []).length;
        return { streak, timeText, words, lessons };
    }
    function statsBar() {
        const { streak, timeText, words } = learnerStats();
        return `<span class="cb-stats">
                <span>🔥 <strong>${streak}</strong> ${en ? (streak === 1 ? "day in a row" : "days in a row") : (streak === 1 ? "Tag in Folge" : "Tage in Folge")}</span>
                <span>⏱️ <strong>${timeText}</strong> ${en ? "learned" : "gelernt"}</span>
                <span>📚 <strong>${words}</strong> ${en ? "words" : "Wörter"}</span>
            </span> <a href="${en ? "account.html" : "konto.html"}">${en ? "Continue learning →" : "Weiter lernen →"}</a>`;
    }

    // announcement bar (not on the account, learning hub and course pages themselves)
    if (document.querySelector("[data-account], [data-requires-account], [data-learn], [data-course], [data-lesson], [data-cc-course], [data-cc-lesson]")) return;
    const CLOSED_KEY = new Date() < new Date("2026-11-23T19:30:00+01:00") ? "nawee-webinar-bar-closed" : "nawee-course-bar-closed";
    let closed = false;
    try { closed = localStorage.getItem(CLOSED_KEY) === "1"; } catch { /* ignore */ }
    if (closed && !loggedIn) return;
    const bar = document.createElement("div");
    bar.className = "course-bar";
    bar.innerHTML = loggedIn
        ? statsBar()
        : new Date() < new Date("2026-11-23T19:30:00+01:00") // web seminar announcement until it has taken place
            ? (en
                ? `<span aria-hidden="true">🎙️</span> <strong>Free live web seminar</strong> on Nov 23 – learn English on your own, with David. <a href="web-seminar.html">Save your seat →</a>`
                : `<span aria-hidden="true">🎙️</span> <strong>Kostenloses Live-Web-Seminar</strong> am 23.11. – Englisch selbst lernen, mit David. <a href="webseminar.html">Platz sichern →</a>`)
            : (en
                ? `<span aria-hidden="true">🎓</span> <strong>New:</strong> free English lessons, courses &amp; practice – no sign-up needed. <a href="learn.html">Start learning →</a>`
                : `<span aria-hidden="true">🎓</span> <strong>Neu:</strong> kostenlose Englisch-Lektionen, Kurse &amp; Übungen – ohne Anmeldung. <a href="lernen.html">Jetzt lernen →</a>`);
    if (!loggedIn) {
        const close = document.createElement("button");
        close.type = "button";
        close.setAttribute("aria-label", en ? "Close" : "Schließen");
        close.textContent = "×";
        close.addEventListener("click", () => {
            bar.remove();
            try { localStorage.setItem(CLOSED_KEY, "1"); } catch { /* ignore */ }
        });
        bar.append(close);
    }
    document.body.prepend(bar);
})();

// Learning time ("nawee-time-v1"): counted only on learning pages, while the tab is visible and the learner was
// active in the last 2 minutes. Shown in the stats line and synced to the account by account.js.
(() => {
    if (!document.querySelector("[data-learn], [data-lesson], [data-course], [data-cc-course], [data-cc-lesson], [data-vocab], [data-games], [data-reading], [data-hero-quiz]")) return;
    const KEY = "nawee-time-v1";
    let last = Date.now(), pending = 0;
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach((e) => window.addEventListener(e, () => { last = Date.now(); }, { passive: true }));
    const flush = () => {
        if (!pending) return;
        try {
            const t = JSON.parse(localStorage.getItem(KEY) || "{}");
            const day = new Date().toISOString().slice(0, 10);
            t.total = (t.total || 0) + pending;
            t.days = { ...(t.days || {}), [day]: ((t.days || {})[day] || 0) + pending };
            const keep = Object.keys(t.days).sort().slice(-400); // keep about a year
            t.days = Object.fromEntries(keep.map((k) => [k, t.days[k]]));
            localStorage.setItem(KEY, JSON.stringify(t));
        } catch { /* storage unavailable */ }
        pending = 0;
    };
    setInterval(() => {
        if (document.visibilityState === "visible" && Date.now() - last < 120000) pending += 5;
        if (pending >= 30) flush();
    }, 5000);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
})();

// THEME BUTTON – light/dark. Without a choice the site follows the device (dark.css); the choice is remembered
// in localStorage ("nawee-theme") and set on <html data-theme> by a tiny script in <head> before the page paints.
(function () {
    const root = document.documentElement;
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : !!(media && media.matches);
    const de = (root.lang || "").startsWith("de");
    const MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.7 14.6A8.5 8.5 0 0 1 9.4 3.3a.7.7 0 0 0-.9-.9A10 10 0 1 0 21.6 15.5a.7.7 0 0 0-.9-.9z"/></svg>';
    const SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"/></g></svg>';

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    function render() {
        const dark = isDark();
        button.innerHTML = dark ? SUN : MOON;
        const label = dark ? (de ? "Helles Design" : "Light mode") : (de ? "Dunkles Design" : "Dark mode");
        button.setAttribute("aria-label", label);
        button.title = label;
        // the light logo (blue) is swapped for the dark one (cream + gold)
        document.querySelectorAll("img.logo, img.footer-logo").forEach((img) => {
            img.src = img.src.replace(/logo_notext(-dark)?\.png/, dark ? "logo_notext-dark.png" : "logo_notext.png");
        });
    }

    button.addEventListener("click", () => {
        const next = isDark() ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("nawee-theme", next); } catch (e) { /* private mode: works until reload */ }
        render();
    });
    if (media && media.addEventListener) media.addEventListener("change", render);

    const header = document.querySelector(".site-header");
    if (header) {
        const spot = header.querySelector(".language-switch, .menu-switch");
        if (spot) spot.before(button); else header.appendChild(button);
    }
    render();
})();

// Newsletter box: "Satz der Woche" changes every Monday (same order as the newsletter issues – week 1 = issue #1)
(() => {
    const box = document.querySelector(".newsletter-form .nl-preview:not(.nl-preview-flat)");
    if (!box) return;
    const PHRASES = [
        ["Let me get back to you on that.", "Ich melde mich dazu noch mal bei dir."],
        ["Could you say that again, please?", "Könntest du das bitte noch einmal sagen?"],
        ["What do you mean by that?", "Was meinst du damit?"],
        ["I see what you mean.", "Ich verstehe, was du meinst."],
        ["Sorry to interrupt, but …", "Entschuldige, dass ich unterbreche, aber …"],
        ["Could you speak a bit more slowly?", "Könntest du etwas langsamer sprechen?"],
        ["How do you say … in English?", "Wie sagt man … auf Englisch?"],
        ["Just to be clear …", "Nur damit es klar ist …"],
        ["That's a good point.", "Das ist ein guter Punkt."],
        ["Let me think about it.", "Lass mich darüber nachdenken."],
        ["Can you give me an example?", "Kannst du mir ein Beispiel geben?"],
        ["I'll keep you posted.", "Ich halte dich auf dem Laufenden."],
        ["That makes sense.", "Das ergibt Sinn."],
        ["I'm not sure I follow.", "Ich bin nicht sicher, ob ich folgen kann."],
        ["What's the best way to reach you?", "Wie erreiche ich dich am besten?"],
        ["I'm looking forward to it.", "Ich freue mich darauf."],
        ["No worries.", "Kein Problem."],
        ["That sounds great!", "Das klingt super!"],
        ["Nice to meet you.", "Schön, dich kennenzulernen."],
        ["Let's keep in touch.", "Lass uns in Kontakt bleiben."],
    ];
    const start = new Date(2026, 9, 26); // Monday of week 1 (Oct 26, 2026)
    const week = Math.max(0, Math.floor((Date.now() - start) / (7 * 864e5)));
    const [en, de] = PHRASES[week % PHRASES.length];
    box.querySelector(".nl-preview-phrase").textContent = `“${en}”`;
    box.querySelector(".nl-preview-de").textContent = `🇩🇪 „${de}“`;
})();
