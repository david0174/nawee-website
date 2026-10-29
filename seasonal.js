// Seasonal look for the homepage. Fall (Sept 22 – Nov 30): warm glow in the hero and a few leaves drifting down.
// Halloween (Oct 25 – 31): friendly extras on top – small jack-o'-lanterns among the leaves, bats flying past,
// a waving skeleton and a row of Halloween words (click = spoken). Switches itself on and off by date;
// ?season=fall / ?season=halloween / ?season=off to preview. Decoration is aria-hidden, takes no clicks
// and stays still for visitors who turned off animations.

(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const forced = new URLSearchParams(location.search).get("season");
    const d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    const isFall = (m === 9 && day >= 22) || m === 10 || m === 11;
    const isHalloween = forced === "halloween" || (forced !== "fall" && m === 10 && day >= 25);
    if (forced === "off" || (!isFall && forced !== "fall" && forced !== "halloween")) return;

    document.body.classList.add("theme-fall");
    if (isHalloween) document.body.classList.add("theme-halloween");
    const colors = ["#e8892b", "#d4572a", "#f2b134", "#b8452a", "#e9a13b"];
    const leaf = (c) => `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3c6 6 14 8 15 16-6 1-9 6-15 18C14 25 11 20 5 19 6 11 14 9 20 3Z" fill="${c}"/><path d="M20 8v28M20 18l7-5M20 24l-8-5" stroke="rgba(0,0,0,.18)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;
    const pumpkin = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 13c0-4 1-7 4-9" stroke="#3d7a2a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="12.5" cy="25" rx="9" ry="11.5" fill="#d9761f"/><ellipse cx="27.5" cy="25" rx="9" ry="11.5" fill="#d9761f"/><ellipse cx="20" cy="25" rx="9.5" ry="12.5" fill="#f08c2e"/><path d="M12 22l3.5-4.5 3.5 4.5zM21 22l3.5-4.5 3.5 4.5z" fill="#5a2a0a"/><path d="M11.5 27.5q8.5 7.5 17 0q-8.5 3.5-17 0z" fill="#5a2a0a"/></svg>`;
    const layer = document.createElement("div");
    layer.className = "fall-leaves";
    layer.setAttribute("aria-hidden", "true");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = window.innerWidth < 700 ? 7 : 12;
    for (let i = 0; i < n; i += 1) {
        const s = document.createElement("span");
        s.className = "fall-leaf";
        s.innerHTML = isHalloween && i % 3 === 1 ? pumpkin : leaf(colors[i % colors.length]);
        s.style.left = `${Math.round((i / n) * 100 + Math.random() * 6)}%`;
        s.style.setProperty("--size", `${18 + Math.round(Math.random() * 16)}px`);
        s.style.setProperty("--dur", `${9 + Math.random() * 8}s`);
        s.style.setProperty("--delay", `${-Math.random() * 14}s`);
        s.style.setProperty("--sway", `${20 + Math.round(Math.random() * 40)}px`);
        s.style.setProperty("--spin", `${Math.random() < 0.5 ? -1 : 1}`);
        if (still) s.style.top = `${10 + Math.random() * 70}%`;
        layer.append(s);
    }

    if (isHalloween) {
        const bats = [];
        // bats: a body with two wings that flap; they cross the hero one after another
        const wing = "M28 14C22 6 12 4 3 9c5 1 7 4 7 7 3-2 6-2 8 1 2-3 6-3 10-2z";
        const bat = `<svg viewBox="0 0 60 30" aria-hidden="true"><g class="hw-wing"><path d="${wing}"/><path d="${wing}" transform="matrix(-1 0 0 1 60 0)"/></g><path d="M25.5 10l1-5 2.5 3.5h2l2.5-3.5 1 5c1.5 2 1.5 6-.5 8.5-1.5 2-6.5 2-8 0-2-2.5-2-6.5-.5-8.5z"/><circle cx="27.8" cy="12.5" r="1.3" fill="#fff"/><circle cx="32.2" cy="12.5" r="1.3" fill="#fff"/></svg>`;
        [[14, 0], [32, -6], [22, -12]].slice(0, window.innerWidth < 700 ? 2 : 3).forEach(([top, delay], i) => {
            const b = document.createElement("span");
            b.className = "hw-bat";
            b.innerHTML = bat;
            b.style.top = `${top}%`;
            b.style.setProperty("--delay", `${delay}s`);
            b.style.setProperty("--size", `${[58, 42, 50][i]}px`);
            if (still) b.style.left = `${[62, 78, 70][i]}%`;
            bats.push(b);
        });

        // a friendly skeleton hanging on a thread, swinging gently and waving
        const bones = "M20 27v18M13 31h14M14 35h12M15 39h10M20 29l-9 8-3-8M20 29l8 7M15 47h10M17 47l-2 14M23 47l2 14";
        const skeleton = `<svg viewBox="0 0 40 66" aria-hidden="true"><path d="M20 0v11" stroke="#8a8fa3" stroke-width="1"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${bones}" stroke="#3a3550" stroke-width="4.5"/><path d="${bones}" stroke="#fff" stroke-width="2.4"/></g><circle cx="20" cy="19" r="8.5" fill="#fff" stroke="#3a3550" stroke-width="1.6"/><circle cx="17" cy="18" r="2" fill="#3a3550"/><circle cx="23" cy="18" r="2" fill="#3a3550"/><path d="M16.5 22.5q3.5 3 7 0" stroke="#3a3550" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;
        const top = document.createElement("div");
        top.className = "hw-layer";
        top.setAttribute("aria-hidden", "true");
        const sk = document.createElement("span");
        sk.className = "hw-skeleton";
        sk.innerHTML = skeleton;
        top.append(sk, ...bats);
        hero.append(top);

        // Halloween words: tap to hear them (German page: with the German meaning; English page: emoji + meaning on hover)
        const de = document.documentElement.lang.startsWith("de");
        const words = [
            ["🎃", "pumpkin", "Kürbis", "a big orange vegetable"],
            ["🦇", "bat", "Fledermaus", "a small animal that flies at night"],
            ["💀", "skeleton", "Skelett", "all the bones of a body"],
            ["🧙", "costume", "Kostüm", "clothes to look like someone else"],
            ["🍬", "trick or treat", "Süßes oder Saures", "what children say at the door on Halloween"],
        ];
        const box = document.createElement("div");
        box.className = "hw-words";
        box.innerHTML = `<p><strong>Happy Halloween!</strong> ${de ? "Tipp ein Wort an und hör es dir an:" : "Tap a word to hear it:"}</p>`
            + words.map(([e, w, g, mean]) => `<button type="button" data-say="${w}" title="${de ? g : mean}"><span aria-hidden="true">${e}</span> ${w}${de ? ` <small>${g}</small>` : ""}</button>`).join("");
        const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
        box.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-say]");
            if (!btn || !synth) return;
            synth.cancel();
            const u = new SpeechSynthesisUtterance(btn.dataset.say);
            u.lang = "en-US";
            u.rate = 0.9;
            const v = synth.getVoices().find((x) => /en.US/i.test(x.lang)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
            if (v) u.voice = v;
            synth.speak(u);
        });
        const text = hero.querySelector(".hero-text");
        if (text) text.after(box);
    }
    hero.prepend(layer);
})();
