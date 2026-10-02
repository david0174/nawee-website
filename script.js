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
document.querySelectorAll(".nl-form").forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".nl-status");
    const buttonText = button.textContent;

    const show = (message, ok) => {
        status.textContent = message;
        status.classList.toggle("nl-status--error", !ok);
        status.hidden = false;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (form.email_address_check.value) return; // spam trap filled in: ignore

        button.disabled = true;
        button.textContent = form.dataset.sending;
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new URLSearchParams(new FormData(form)),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error("not saved");
            form.reset();
            show(form.dataset.success, true);
        } catch {
            show(form.dataset.error, false);
        } finally {
            button.disabled = false;
            button.textContent = buttonText;
        }
    });
});

// Package checkout (checkout.html / checkout-en.html) and thank-you page (danke.html / thank-you.html).
// The checkout page asks for both required confirmations, then forwards to the Stripe Payment Link.
// client_reference_id marks the payment in Stripe as coming through this consent step.
const CONSENT_VERSION = "consent-v1";
const NAWEE_PACKAGES = {
    "englisch-5":       { price: 285, sessions: 5,  per: 57, cal: "englisch60min",      stripe: { de: "7sY9ATan55gwenZ1xOgjC04", en: "cNiaEXeDl10ggw76S8gjC07" },
                          de: ["5er-Paket Englisch", "Individuelles Englischtraining für Beruf, Alltag und professionelle Kommunikation."],
                          en: ["5-Session English Package", "Personalised English training for work, everyday life and professional communication."] },
    "englisch-10":      { price: 550, sessions: 10, per: 55, cal: "englisch60min",      stripe: { de: "dRm5kDcvd8sIenZ90ggjC05", en: "28EaEX52LgZe1Bd3FWgjC06" },
                          de: ["10er-Paket Englisch", "Individuelles Englischtraining für Beruf, Alltag und professionelle Kommunikation."],
                          en: ["10-Session English Package", "Personalised English training for work, everyday life and professional communication."] },
    "ki-5":             { price: 285, sessions: 5,  per: 57, cal: "ai60min",            stripe: { de: "5kQ14nan56kAbbNfoEgjC02", en: "7sY28r7aT6kA1Bd90ggjC09" },
                          de: ["5er-Paket KI", "Individuelles Training, um KI besser zu verstehen und sinnvoll in Beruf und Alltag einzusetzen."],
                          en: ["5-Session AI Package", "Individual training to understand AI better and use it effectively at work and in everyday life."] },
    "ki-10":            { price: 550, sessions: 10, per: 55, cal: "ai60min",            stripe: { de: "14A9ATfHpeR64Np1xOgjC03", en: "aFacN5gLt8sIenZ4K0gjC08" },
                          de: ["10er-Paket KI", "Individuelles Training, um KI besser zu verstehen und sinnvoll in Beruf und Alltag einzusetzen."],
                          en: ["10-Session AI Package", "Individual training to understand AI better and use it effectively at work and in everyday life."] },
    "programmieren-5":  { price: 285, sessions: 5,  per: 57, cal: "5-session-programming-training-package", stripe: { de: "6oU00jcvdbEU7ZBgsIgjC00", en: "eVqeVdbr98sIbbN4K0gjC0b" },
                          de: ["5er-Paket Programmieren mit KI", "Individuelles Training, um mit KI eigene Programme, Websites und digitale Werkzeuge zu entwickeln."],
                          en: ["5-Session Programming with AI Package", "Individual training to build your own programs, websites and digital tools with AI."] },
    "programmieren-10": { price: 550, sessions: 10, per: 55, cal: "programmieren60min", stripe: { de: "28EeVddzh4csa7Jb8ogjC01", en: "14A7sLeDleR6cfR4K0gjC0a" },
                          de: ["10er-Paket Programmieren mit KI", "Individuelles Training, um mit KI eigene Programme, Websites und digitale Werkzeuge zu entwickeln."],
                          en: ["10-Session Programming with AI Package", "Individual training to build your own programs, websites and digital tools with AI."] },
};

const packageCard = document.querySelector("[data-checkout], [data-thanks]");
if (packageCard) {
    const key = new URLSearchParams(location.search).get("paket");
    const pkg = NAWEE_PACKAGES[key];
    const lang = packageCard.dataset.lang;
    const fill = (name, text) => packageCard.querySelectorAll(`[data-ck="${name}"]`).forEach((el) => { el.textContent = text; });

    // keep the chosen package when switching language
    document.querySelectorAll('a[lang="de"], a[lang="en"]').forEach((a) => { if (key) a.search = location.search; });

    if (!pkg) {
        packageCard.hidden = true;
        const unknown = document.querySelector(".checkout-unknown");
        if (unknown) unknown.hidden = false;
    } else {
        const price = lang === "de" ? `${pkg.price} €` : `€${pkg.price}`;
        const meta = lang === "de"
            ? `${pkg.sessions} × 60 Minuten · ${pkg.per} € pro Stunde`
            : `${pkg.sessions} × 60 minutes · €${pkg.per} per session`;
        fill("name", pkg[lang][0]);
        fill("desc", pkg[lang][1]);
        fill("price", price);
        fill("price-inline", `– ${price}`);
        fill("meta", meta);
        document.title = `${pkg[lang][0]} | Nawee`;

        const calButton = packageCard.querySelector("[data-ck-cal]");
        if (calButton) calButton.href = `https://cal.com/nawee/${pkg.cal}`;

        const form = packageCard.querySelector(".checkout-form");
        if (form) {
            const missing = form.querySelector(".ck-missing");
            form.addEventListener("change", () => { missing.hidden = true; });
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!form.terms.checked || !form.earlystart.checked) {
                    missing.hidden = false;
                    (form.terms.checked ? form.earlystart : form.terms).focus();
                    return;
                }
                const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13); // e.g. 20261002T1530 (UTC)
                const ref = `${key}_${CONSENT_VERSION}_${lang}_${stamp}`;
                location.href = `https://buy.stripe.com/${pkg.stripe[lang]}?client_reference_id=${encodeURIComponent(ref)}`;
            });
        }
    }
}
