// Seasonal look for the homepage. Fall (Sept 22 – Nov 30): warm glow in the hero and a few leaves drifting down.
// Halloween (Oct 25 – 31): friendly extras on top – small jack-o'-lanterns among the leaves, bats flying past,
// a waving skeleton and a row of Halloween words (click = spoken).
// Harvest (Nov 1 – 30): a cornucopia full of fruit and vegetables, acorns among the leaves and harvest words;
// in Thanksgiving week (Thanksgiving = 4th Thursday of November) the words say "Happy Thanksgiving!".
// Switches itself on and off by date; ?season=fall / halloween / harvest / thanksgiving / off to preview. Decoration is aria-hidden, takes no clicks
// and stays still for visitors who turned off animations.

(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const forced = new URLSearchParams(location.search).get("season");
    const d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    const isFall = (m === 9 && day >= 22) || m === 10 || m === 11;
    const auto = !forced; // no preview parameter → the date decides
    const isHalloween = forced === "halloween" || (auto && m === 10 && day >= 25);
    const isHarvest = forced === "harvest" || forced === "thanksgiving" || (auto && m === 11);
    // Thanksgiving: 4th Thursday of November; its week = Monday before until the Sunday after
    const nov1 = new Date(d.getFullYear(), 10, 1).getDay();
    const thanksgiving = 1 + ((4 - nov1 + 7) % 7) + 21;
    const isThanksgivingWeek = forced === "thanksgiving" || (auto && m === 11 && day >= thanksgiving - 3 && day <= thanksgiving + 3);
    if (forced === "off" || (!isFall && !["fall", "halloween", "harvest", "thanksgiving"].includes(forced))) return;

    document.body.classList.add("theme-fall");
    if (isHalloween) document.body.classList.add("theme-halloween");
    if (isHarvest) document.body.classList.add("theme-harvest");
    const colors = ["#e8892b", "#d4572a", "#f2b134", "#b8452a", "#e9a13b"];
    const leaf = (c) => `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3c6 6 14 8 15 16-6 1-9 6-15 18C14 25 11 20 5 19 6 11 14 9 20 3Z" fill="${c}"/><path d="M20 8v28M20 18l7-5M20 24l-8-5" stroke="rgba(0,0,0,.18)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;
    const pumpkin = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 13c0-4 1-7 4-9" stroke="#3d7a2a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="12.5" cy="25" rx="9" ry="11.5" fill="#d9761f"/><ellipse cx="27.5" cy="25" rx="9" ry="11.5" fill="#d9761f"/><ellipse cx="20" cy="25" rx="9.5" ry="12.5" fill="#f08c2e"/><path d="M12 22l3.5-4.5 3.5 4.5zM21 22l3.5-4.5 3.5 4.5z" fill="#5a2a0a"/><path d="M11.5 27.5q8.5 7.5 17 0q-8.5 3.5-17 0z" fill="#5a2a0a"/></svg>`;
    const acorn = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4v6" stroke="#6b4423" stroke-width="2.5" stroke-linecap="round"/><path d="M9 16c0-5 5-7 11-7s11 2 11 7c0 2-1 3-3 3H12c-2 0-3-1-3-3z" fill="#7a5230"/><path d="M12 13h16M11 16h18" stroke="#5c3b1f" stroke-width="1.2"/><path d="M11 19h18c0 9-5 16-9 17-4-1-9-8-9-17z" fill="#c98b45"/><path d="M15 22c0 5 2 9 4 11" stroke="#e8b06e" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
    const layer = document.createElement("div");
    layer.className = "fall-leaves";
    layer.setAttribute("aria-hidden", "true");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = window.innerWidth < 700 ? 7 : 12;
    for (let i = 0; i < n; i += 1) {
        const s = document.createElement("span");
        s.className = "fall-leaf";
        s.innerHTML = isHalloween && i % 3 === 1 ? pumpkin : isHarvest && i % 3 === 1 ? acorn : leaf(colors[i % colors.length]);
        s.style.left = `${Math.round((i / n) * 100 + Math.random() * 6)}%`;
        s.style.setProperty("--size", `${18 + Math.round(Math.random() * 16)}px`);
        s.style.setProperty("--dur", `${9 + Math.random() * 8}s`);
        s.style.setProperty("--delay", `${-Math.random() * 14}s`);
        s.style.setProperty("--sway", `${20 + Math.round(Math.random() * 40)}px`);
        s.style.setProperty("--spin", `${Math.random() < 0.5 ? -1 : 1}`);
        if (still) s.style.top = `${10 + Math.random() * 70}%`;
        layer.append(s);
    }

    // tap-to-hear word chips under the hero text (German page: German meaning; English page: meaning on hover)
    const de = document.documentElement.lang.startsWith("de");
    const wordChips = (title, words) => {
        const box = document.createElement("div");
        box.className = "hw-words";
        box.innerHTML = `<p><strong>${title}</strong> ${de ? "Tipp ein Wort an und hör es dir an:" : "Tap a word to hear it:"}</p>`
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
    };

    if (isHarvest) {
        // a woven cornucopia (horn of plenty) spilling pumpkin, apples, grapes, a pear, corn and wheat
        const cornucopia = `<svg viewBox="0 0 320 230" aria-hidden="true">
            <defs><linearGradient id="hv-horn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2b06a"/><stop offset="1" stop-color="#a86b2d"/></linearGradient>
            <clipPath id="hv-clip"><path d="M205 62C160 56 110 74 78 104C60 121 50 140 48 158C62 156 78 162 96 170C130 186 170 198 205 194Z"/></clipPath></defs>
            <ellipse cx="190" cy="212" rx="125" ry="12" fill="rgba(90,50,20,.18)"/>
            <path d="M50 157C34 160 24 147 31 137C38 127 54 132 51 143" fill="none" stroke="#7a4a1c" stroke-width="12" stroke-linecap="round"/><path d="M50 157C34 160 24 147 31 137C38 127 54 132 51 143" fill="none" stroke="#c48a45" stroke-width="7" stroke-linecap="round"/><path d="M205 62C160 56 110 74 78 104C60 121 50 140 48 158C62 156 78 162 96 170C130 186 170 198 205 194Z" fill="url(#hv-horn)" stroke="#7a4a1c" stroke-width="2.5" stroke-linejoin="round"/>
            <g clip-path="url(#hv-clip)" fill="none" stroke="#8a5523" stroke-width="2.2" opacity=".7">
                <path d="M72 112q4 30 22 56M100 88q-4 50 18 92M130 72q-8 60 12 116M160 62q-8 66 8 130M190 60q-4 70 4 134"/>
                <path d="M70 118q70-34 140-30M58 140q76-30 150-22M80 160q66-22 128-14M110 178q50-12 96-8"/>
            </g>
            <ellipse cx="205" cy="128" rx="20" ry="66" fill="#6e4219" stroke="#7a4a1c" stroke-width="2.5"/>
            <ellipse cx="208" cy="128" rx="12" ry="58" fill="#4a2a0e"/>
            <g stroke="#c9a24a" stroke-width="2.2" fill="#e3c06a"><path d="M214 92q16-40 40-58" fill="none"/><ellipse cx="246" cy="40" rx="4" ry="8" transform="rotate(40 246 40)"/><ellipse cx="238" cy="50" rx="4" ry="8" transform="rotate(40 238 50)"/><ellipse cx="254" cy="33" rx="4" ry="8" transform="rotate(40 254 33)"/><ellipse cx="231" cy="61" rx="4" ry="8" transform="rotate(40 231 61)"/></g>
            <g fill="#6b3fa0"><circle cx="228" cy="84" r="8"/><circle cx="242" cy="82" r="8"/><circle cx="235" cy="96" r="8"/><circle cx="249" cy="95" r="8"/><circle cx="242" cy="108" r="8"/><circle cx="256" cy="108" r="7"/><circle cx="249" cy="120" r="7"/></g>
            <g fill="#8e5bc4"><circle cx="226" cy="81" r="2.5"/><circle cx="240" cy="79" r="2.5"/><circle cx="233" cy="93" r="2.5"/></g>
            <path d="M232 74q-4-10 6-14" stroke="#4d7a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M268 112c10-4 22 2 24 14 2 14-6 28-18 30-12 2-20-10-18-22 1-8 4-18 12-22z" fill="#b8c447"/><path d="M276 112q2-8 6-10" stroke="#6b4423" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <g transform="rotate(-25 222 168)"><ellipse cx="222" cy="168" rx="12" ry="30" fill="#f2c33a"/><g fill="#e0a92a"><circle cx="218" cy="150" r="2"/><circle cx="226" cy="150" r="2"/><circle cx="218" cy="160" r="2"/><circle cx="226" cy="160" r="2"/><circle cx="218" cy="170" r="2"/><circle cx="226" cy="170" r="2"/><circle cx="218" cy="180" r="2"/><circle cx="226" cy="180" r="2"/></g><path d="M222 198c-14-8-20-24-16-42 4 14 10 26 16 42zM222 198c14-8 20-24 16-42-4 14-10 26-16 42z" fill="#6f9a3a"/></g>
            <g><ellipse cx="252" cy="182" rx="15" ry="20" fill="#d9761f"/><ellipse cx="282" cy="182" rx="15" ry="20" fill="#d9761f"/><ellipse cx="267" cy="182" rx="17" ry="22" fill="#f08c2e"/><path d="M267 160q2-10 8-12" stroke="#3d7a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M258 168q-3 14 0 28M276 168q3 14 0 28" stroke="#d06a17" stroke-width="2" fill="none"/></g>
            <g><circle cx="300" cy="200" r="13" fill="#c8312b"/><path d="M300 187q1-6 4-8" stroke="#6b4423" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M304 184q8-6 12 0-6 4-12 0z" fill="#4d8a2e"/><circle cx="295" cy="196" r="3" fill="#e86a5f"/></g>
            <g><circle cx="232" cy="200" r="12" fill="#d8402f"/><path d="M232 188q1-5 3-7" stroke="#6b4423" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="228" cy="196" r="3" fill="#f07a6a"/></g>
            <path d="M160 214c6-10 18-12 26-6-8 2-14 6-26 6zM312 212c-4-9-14-12-22-7 8 2 13 5 22 7z" fill="#d4572a"/>
        </svg>`;
        const top = document.createElement("div");
        top.className = "hw-layer";
        top.setAttribute("aria-hidden", "true");
        const c = document.createElement("span");
        c.className = "hv-cornucopia";
        c.innerHTML = cornucopia;
        top.append(c);
        hero.append(top);

        wordChips(isThanksgivingWeek ? "Happy Thanksgiving! 🦃" : (de ? "Erntezeit! 🍂" : "Harvest time! 🍂"), [
            ["🌾", "harvest", "Ernte", "when farmers collect fruit and vegetables"],
            ["🌽", "corn", "Mais", "a tall plant with yellow seeds"],
            ["🍎", "apple", "Apfel", "a round red or green fruit"],
            ["🥧", "pumpkin pie", "Kürbiskuchen", "a sweet pie for Thanksgiving"],
            ["🦃", "turkey", "Truthahn", "a big bird – the Thanksgiving dinner"],
            ["🙏", "thankful", "dankbar", "happy about what you have"],
        ]);
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

        wordChips("Happy Halloween!", [
            ["🎃", "pumpkin", "Kürbis", "a big orange vegetable"],
            ["🦇", "bat", "Fledermaus", "a small animal that flies at night"],
            ["💀", "skeleton", "Skelett", "all the bones of a body"],
            ["🧙", "costume", "Kostüm", "clothes to look like someone else"],
            ["🍬", "trick or treat", "Süßes oder Saures", "what children say at the door on Halloween"],
        ]);
    }
    hero.prepend(layer);
})();
