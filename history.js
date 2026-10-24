// History of English: turns the vertical timeline into a horizontal one – a year bar on top, one stage at a
// time below, previous/next buttons, swipe and arrow keys. Without JavaScript the plain list stays.

(() => {
    const list = document.querySelector(".hx-timeline");
    if (!list) return;
    const de = document.documentElement.lang === "de";
    const eras = [...list.querySelectorAll(".hx-era")];
    const years = eras.map((li) => li.querySelector(".hx-year").textContent.trim());

    const wrap = document.createElement("div");
    wrap.className = "hx-slider";
    wrap.innerHTML = `<div class="hx-years" role="tablist" aria-label="${de ? "Zeitstrahl" : "Timeline"}">
            ${years.map((y, i) => `<button type="button" role="tab" class="hx-dot" data-i="${i}"><span>${y}</span></button>`).join("")}
        </div>
        <div class="hx-stage"></div>
        <div class="hx-nav">
            <button type="button" class="hx-arrow" data-prev></button>
            <span class="hx-count" aria-live="polite"></span>
            <button type="button" class="hx-arrow" data-next></button>
        </div>`;
    list.before(wrap);
    const stage = wrap.querySelector(".hx-stage");
    stage.append(list);
    list.classList.add("is-slider");

    const dots = [...wrap.querySelectorAll(".hx-dot")], prev = wrap.querySelector("[data-prev]"), next = wrap.querySelector("[data-next]");
    let i = 0;
    const show = (n, focusDot = false) => {
        i = Math.max(0, Math.min(eras.length - 1, n));
        eras.forEach((li, k) => { li.hidden = k !== i; });
        dots.forEach((d, k) => { d.setAttribute("aria-selected", String(k === i)); d.classList.toggle("is-past", k < i); });
        dots[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (focusDot) dots[i].focus({ preventScroll: true });
        prev.disabled = i === 0;
        next.disabled = i === eras.length - 1;
        prev.innerHTML = i > 0 ? `← ${years[i - 1]}` : "←";
        next.innerHTML = i < eras.length - 1 ? `${years[i + 1]} →` : "→";
        wrap.querySelector(".hx-count").textContent = `${i + 1} / ${eras.length}`;
        eras[i].querySelector(".hx-card").classList.remove("is-in");
        void eras[i].offsetWidth;
        eras[i].querySelector(".hx-card").classList.add("is-in");
    };
    dots.forEach((d) => d.addEventListener("click", () => show(Number(d.dataset.i))));
    prev.addEventListener("click", () => show(i - 1));
    next.addEventListener("click", () => show(i + 1));
    wrap.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1, true); }
    });
    let x0 = null;
    stage.addEventListener("pointerdown", (e) => { if (!e.target.closest("button")) x0 = e.clientX; });
    stage.addEventListener("pointerup", (e) => {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    });
    show(0);
})();
