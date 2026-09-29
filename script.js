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

const linkedinButton = document.getElementById("linkedin-load");

if (linkedinButton) {
    linkedinButton.addEventListener("click", () => {
        const box = document.getElementById("linkedin-consent");
        const iframe = document.createElement("iframe");

        iframe.src = "PASTE-YOUR-EMBED-SRC-HERE";
        iframe.title = "Eingebetteter LinkedIn-Beitrag";
        iframe.width = "504";
        iframe.height = "632";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");

        box.replaceChildren(iframe);
    });
}

    const langToggle = document.querySelector(".language-toggle");
const langMenu = document.getElementById("language-menu");

if (langToggle && langMenu) {
    const closeMenu = () => {
        langMenu.hidden = true;
        langToggle.setAttribute("aria-expanded", "false");
    };

    langToggle.addEventListener("click", () => {
        const opening = langMenu.hidden;
        langMenu.hidden = !opening;
        langToggle.setAttribute("aria-expanded", String(opening));
    });

    // Close when clicking anywhere outside the menu
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".language-switch")) closeMenu();
    });

    // Close with the Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}

