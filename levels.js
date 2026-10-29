// "English by level" (learn.html / lernen.html, account page): Khan-Academy-style map.
// Left: the levels A1 → B2–C1 with your progress; right: the themes (modules) of the chosen level with a percentage;
// click a theme to see its lessons. Reads the course data files and the progress kept in this browser
// (localStorage, synced with the account by account.js). Nothing is sent anywhere.

(() => {
    const boxes = document.querySelectorAll("[data-levels]");
    if (!boxes.length) return;
    const de = document.documentElement.lang === "de";
    const L = (o) => (typeof o === "string" ? o : de ? o.de : o.en);
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const progress = (key) => { try { return (JSON.parse(localStorage.getItem(key)) || {}).completed || []; } catch { return []; } };

    // planned themes of "English from the start" that aren't written yet (approved plan, 6 modules × 4 lessons)
    const WORK_PLAN = [
        { id: 2, title: { de: "Alltag", en: "Everyday life" }, lessons: ["My day", "At the café", "Shopping & prices", "Asking the way"] },
        { id: 3, title: { de: "Menschen & Freizeit", en: "People & free time" }, lessons: ["Describing people", "Hobbies & likes", "Last weekend", "Invitations: yes & polite no"] },
        { id: 4, title: { de: "Unterwegs", en: "On the go" }, lessons: ["Tickets & transport", "At the hotel", "Problems & complaints", "Telling a trip story"] },
        { id: 5, title: { de: "Termine & Telefon", en: "Appointments & phone" }, lessons: ["Phone calls", "Appointments", "Small talk at work", "Plans for the future"] },
        { id: 6, title: { de: "Sicher im Gespräch", en: "Confident in conversation" }, lessons: ["Asking to repeat & clarify", "Comparing & opinions", "Giving advice", "Final task: a whole day in English"] },
    ];
    const workModules = () => {
        const real = typeof WORK_MODULES !== "undefined" ? WORK_MODULES : [];
        const all = [...real, ...WORK_PLAN.filter((p) => !real.some((m) => m.id === p.id))
            .map((p) => ({ id: p.id, title: p.title, lessons: p.lessons.map((t, i) => ({ id: `${p.id}-${i + 1}`, title: { de: t, en: t } })) }))];
        return all.sort((a, b) => a.id - b.id);
    };
    // which course data files are loaded on this page (top-level consts of the data scripts)
    const LOADED = {
        WORK_MODULES: typeof WORK_MODULES !== "undefined", WORK_LESSONS: typeof WORK_LESSONS !== "undefined",
        COURSE_MODULES: typeof COURSE_MODULES !== "undefined", COURSE_LESSONS: typeof COURSE_LESSONS !== "undefined",
        CC_MODULES: typeof CC_MODULES !== "undefined", CC_LESSONS: typeof CC_LESSONS !== "undefined",
    };
    const has = (name) => LOADED[name];

    // one entry per level: which course, which of its modules, where lessons live, which lessons exist
    const levels = () => {
        const work = has("WORK_MODULES") ? workModules() : [];
        const workIn = (ids) => ({
            key: "nawee-work-course-v1", course: { de: "Englisch von Anfang an", en: "English from the start" },
            modules: work.filter((m) => ids.includes(m.id)),
            href: (id) => `${de ? "beruf-lektion.html" : "work-lesson.html"}?l=${id}`,
            ready: (id) => has("WORK_LESSONS") && Boolean(WORK_LESSONS[id]),
        });
        return [
            { code: "A1", name: { de: "Einstieg: die ersten Gespräche", en: "Getting started: first conversations" }, ...workIn([1, 2, 3]) },
            { code: "A2", name: { de: "Grundlagen: Alltag und unterwegs", en: "Basics: everyday life and travel" }, ...workIn([4, 5, 6]) },
            { code: "B1", name: { de: "Sicher sprechen im echten Gespräch", en: "Speaking with confidence in real conversations" },
              key: "nawee-course-v1", course: { de: "Sicher sprechen (Erklärungen auf Deutsch)", en: "Sicher sprechen (explanations in German)" },
              modules: has("COURSE_MODULES") ? COURSE_MODULES : [], href: (id) => `lektion.html?l=${id}`,
              ready: (id) => has("COURSE_LESSONS") && Boolean(COURSE_LESSONS[id]) },
            { code: "B2–C1", name: { de: "Klar und überzeugend kommunizieren", en: "Communicate clearly and convincingly" },
              key: "nawee-communication-course-v1", course: { de: "Communicate with Confidence (auf Englisch)", en: "Communicate with Confidence" },
              modules: has("CC_MODULES") ? CC_MODULES : [], href: (id) => `communication-lesson.html?l=${id}`,
              ready: (id) => has("CC_LESSONS") && Boolean(CC_LESSONS[id]) },
        ].map((lv) => {
            const done = new Set(progress(lv.key));
            const modules = lv.modules.map((m) => {
                const lessons = m.lessons.map((l) => ({ id: l.id, title: L(l.title), ready: lv.ready(l.id), done: done.has(l.id) }));
                const ready = lessons.filter((l) => l.ready).length, n = lessons.filter((l) => l.done).length;
                return { id: m.id, title: L(m.title), lessons, ready, done: n, pct: lessons.length ? Math.round((n / lessons.length) * 100) : 0 };
            });
            const total = modules.reduce((a, m) => a + m.lessons.length, 0), n = modules.reduce((a, m) => a + m.done, 0);
            return { ...lv, modules, total, done: n, ready: modules.reduce((a, m) => a + m.ready, 0), pct: total ? Math.round((n / total) * 100) : 0 };
        });
    };

    const T = de
        ? { soon: "Bald", lessons: (n) => `${n} Lektion${n === 1 ? "" : "en"}`, start: "Starten", open: "Öffnen", doneMark: "Geschafft", comingSoon: "bald verfügbar", allSoon: "Die Lektionen für dieses Niveau entstehen gerade – bald geht’s los.", course: "Kurs" }
        : { soon: "Soon", lessons: (n) => `${n} lesson${n === 1 ? "" : "s"}`, start: "Start", open: "Open", doneMark: "Done", comingSoon: "coming soon", allSoon: "The lessons for this level are being written – coming soon.", course: "Course" };
    const badge = (pct, ready) => (!ready ? `<span class="lv-pct lv-soon">${T.soon}</span>` : pct > 0 ? `<span class="lv-pct${pct === 100 ? " lv-full" : ""}">${pct} %</span>` : "");

    const pref = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
    const setPref = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

    const render = (box) => {
        let data = levels();
        // default: the level you last worked on (some progress, not finished), else the first one with lessons
        const started = data.find((l) => l.done > 0 && l.pct < 100);
        let cur = pref("nawee-level", "") || (started || data.find((l) => l.ready) || data[0]).code;
        if (!data.some((l) => l.code === cur)) cur = data[0].code;
        const open = new Set();
        const draw = () => {
            data = levels();  // fresh progress every time (e.g. after the account synced it)
            const lv = data.find((l) => l.code === cur);
            box.innerHTML = `<div class="lv-map">
                <ul class="lv-levels" role="tablist">${data.map((l) => `<li><button type="button" role="tab" aria-selected="${l.code === cur}" class="${l.code === cur ? "on" : ""}" data-level="${esc(l.code)}">
                    <span class="lv-code">${esc(l.code)}</span><span class="lv-name">${esc(L(l.name))}</span>${badge(l.pct, l.ready)}</button></li>`).join("")}</ul>
                <div class="lv-themes" role="tabpanel">
                    <p class="lv-head"><strong>${esc(lv.code)} · ${esc(L(lv.name))}</strong><span>${T.course}: ${esc(L(lv.course))}</span></p>
                    ${lv.ready ? "" : `<p class="lv-note">${T.allSoon}</p>`}
                    <ul class="lv-modules">${lv.modules.map((m) => `<li class="${open.has(m.id) ? "is-open" : ""}">
                        <button type="button" class="lv-module" data-module="${m.id}" aria-expanded="${open.has(m.id)}">
                            <span class="lv-mtitle">${esc(m.title)}</span><span class="lv-mmeta">${T.lessons(m.lessons.length)}</span>${badge(m.pct, m.ready)}
                            <span class="lv-bar" aria-hidden="true"><i style="width:${m.pct}%"></i></span></button>
                        ${open.has(m.id) ? `<ol class="lv-lessons">${m.lessons.map((l) => l.ready
                            ? `<li><a href="${lv.href(l.id)}"><span class="lv-check${l.done ? " is-done" : ""}" aria-label="${l.done ? T.doneMark : ""}">${l.done ? "✓" : ""}</span>${esc(l.title)}<span class="lv-go">${l.done ? T.open : T.start} →</span></a></li>`
                            : `<li class="lv-later"><span class="lv-check"></span>${esc(l.title)} <em>${T.comingSoon}</em></li>`).join("")}</ol>` : ""}
                    </li>`).join("")}</ul>
                </div></div>`;
        };
        box.addEventListener("click", (e) => {
            const lb = e.target.closest("[data-level]"), mb = e.target.closest("[data-module]");
            if (lb) { cur = lb.dataset.level; setPref("nawee-level", cur); open.clear(); draw(); }
            if (mb) { const id = Number(mb.dataset.module); open.has(id) ? open.delete(id) : open.add(id); draw(); }
        });
        draw();
        // account page: only for logged-in learners, redrawn when the session (and synced progress) arrives
        const wrap = box.closest("[data-levels-account]");
        if (wrap) {
            const update = () => {
                wrap.hidden = !window.NaweeUser;
                if (!window.NaweeUser) return;
                draw();
                // the word-by-word heading animation (script.js) waits for scrolling – make sure the heading shows anyway
                setTimeout(() => wrap.querySelectorAll(".reveal-words").forEach((h) => h.classList.add("is-revealed")), 1200);
            };
            window.addEventListener("nawee:session", update);
            update();
        }
    };
    boxes.forEach(render);
})();
