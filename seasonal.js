// Seasonal look for the homepage. Fall (Sept 22 – Nov 30): warm glow in the hero and a few leaves drifting down.
// Switches itself on and off by date; ?season=fall / ?season=off to preview. Leaves are decoration only
// (aria-hidden, no clicks) and stay still for visitors who turned off animations.

(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const forced = new URLSearchParams(location.search).get("season");
    const d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    const isFall = (m === 9 && day >= 22) || m === 10 || m === 11;
    if (forced === "off" || (!isFall && forced !== "fall")) return;

    document.body.classList.add("theme-fall");
    const colors = ["#e8892b", "#d4572a", "#f2b134", "#b8452a", "#e9a13b"];
    const leaf = (c) => `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3c6 6 14 8 15 16-6 1-9 6-15 18C14 25 11 20 5 19 6 11 14 9 20 3Z" fill="${c}"/><path d="M20 8v28M20 18l7-5M20 24l-8-5" stroke="rgba(0,0,0,.18)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;
    const layer = document.createElement("div");
    layer.className = "fall-leaves";
    layer.setAttribute("aria-hidden", "true");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = window.innerWidth < 700 ? 7 : 12;
    for (let i = 0; i < n; i += 1) {
        const s = document.createElement("span");
        s.className = "fall-leaf";
        s.innerHTML = leaf(colors[i % colors.length]);
        s.style.left = `${Math.round((i / n) * 100 + Math.random() * 6)}%`;
        s.style.setProperty("--size", `${18 + Math.round(Math.random() * 16)}px`);
        s.style.setProperty("--dur", `${9 + Math.random() * 8}s`);
        s.style.setProperty("--delay", `${-Math.random() * 14}s`);
        s.style.setProperty("--sway", `${20 + Math.round(Math.random() * 40)}px`);
        s.style.setProperty("--spin", `${Math.random() < 0.5 ? -1 : 1}`);
        if (still) s.style.top = `${10 + Math.random() * 70}%`;
        layer.append(s);
    }
    hero.prepend(layer);
})();
