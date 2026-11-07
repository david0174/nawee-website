// "English by level" (learn.html / lernen.html, account page): Khan-Academy-style map.
// Left: the levels A1 → B2–C1 with your progress; right: the themes (modules) of the chosen level with a percentage;
// click a theme to see its lessons. Reads the course data files and the progress kept in this browser
// (localStorage, synced with the account by account.js). Nothing is sent anywhere.

(() => {
    const boxes = document.querySelectorAll("[data-levels]");
    if (!boxes.length) return;
    const de = document.documentElement.lang === "de", tr = document.documentElement.lang === "tr";
    const L = (o) => (typeof o === "string" ? o : de ? o.de : (tr && o.tr) || o.en);
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const progress = (key) => { try { return (JSON.parse(localStorage.getItem(key)) || {}).completed || []; } catch { return []; } };

    // planned themes of "English from the start" that aren't written yet (approved plan, 6 modules × 4 lessons)
    const WORK_PLAN = [
        { id: 2, title: { de: "Alltag", en: "Everyday life", tr: "Günlük hayat" }, lessons: ["My day", "At the café", "Shopping & prices", "Asking the way"] },
        { id: 3, title: { de: "Menschen & Freizeit", en: "People & free time", tr: "İnsanlar ve boş zaman" }, lessons: ["Describing people", "Hobbies & likes", "Last weekend", "Invitations: yes & polite no"] },
        { id: 4, title: { de: "Unterwegs", en: "On the go", tr: "Yolda" }, lessons: ["Tickets & transport", "At the hotel", "Problems & complaints", "Telling a trip story"] },
        { id: 5, title: { de: "Termine & Telefon", en: "Appointments & phone", tr: "Randevular ve telefon" }, lessons: ["Phone calls", "Appointments", "Small talk at work", "Plans for the future"] },
        { id: 6, title: { de: "Sicher im Gespräch", en: "Confident in conversation", tr: "Sohbette kendinden emin" }, lessons: ["Asking to repeat & clarify", "Comparing & opinions", "Giving advice", "Final task: a whole day in English"] },
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
            key: "nawee-work-course-v1", course: { de: "Englisch von Anfang an", en: "English from the start", tr: "Sıfırdan İngilizce (English from the start)" },
            modules: work.filter((m) => ids.includes(m.id)),
            href: (id) => `${de ? "beruf-lektion.html" : "work-lesson.html"}?l=${id}`,
            ready: (id) => has("WORK_LESSONS") && Boolean(WORK_LESSONS[id]),
        });
        return [
            { code: "A1", name: { de: "Einstieg: die ersten Gespräche", en: "Getting started: first conversations", tr: "Başlangıç: ilk sohbetler" }, ...workIn([1, 2, 3]) },
            { code: "A2", name: { de: "Grundlagen: Alltag und unterwegs", en: "Basics: everyday life and travel", tr: "Temeller: günlük hayat ve seyahat" }, ...workIn([4, 5, 6]) },
            { code: "B1", name: { de: "Sicher sprechen im echten Gespräch", en: "Speaking with confidence in real conversations", tr: "Gerçek sohbetlerde rahat konuşmak" },
              key: "nawee-course-v1", course: { de: "Sicher sprechen", en: "Confident Conversations", tr: "Kendinden emin konuş" },
              modules: has("COURSE_MODULES") ? COURSE_MODULES : [], href: (id) => `${de ? "lektion.html" : tr ? "lesson-tr.html" : "lesson.html"}?l=${id}`,
              ready: (id) => has("COURSE_LESSONS") && Boolean(COURSE_LESSONS[id]) },
            { code: "B2–C1", name: { de: "Klar und überzeugend kommunizieren", en: "Communicate clearly and convincingly", tr: "Açık ve ikna edici iletişim" },
              key: "nawee-communication-course-v1", course: { de: "Communicate with Confidence (auf Englisch)", en: "Communicate with Confidence", tr: "Communicate with Confidence (İngilizce)" },
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

    // emojis for the levels and their themes (David, 2026-11-04: make the learning path more visual)
    const LEVEL_ICON = { A1: "🌱", A2: "🧳", B1: "💬", "B2–C1": "🎯" };
    const MODULE_ICON = {
        "nawee-work-course-v1": { 1: "👋", 2: "☕", 3: "🎨", 4: "🚆", 5: "📞", 6: "🗨️" },
        "nawee-course-v1": { 1: "🧠", 2: "❓", 3: "🔎", 4: "👂", 5: "✋", 6: "💪", 7: "🚀" },
        "nawee-communication-course-v1": { 1: "🎙️", 2: "🧱", 3: "👂", 4: "🤝", 5: "📅", 6: "📊", 7: "🌍" },
    };
    // grammar lessons of this level (grammar-data.js, if loaded) – part of the learning path (David, 2026-11-04)
    const grammarFor = (code) => {
        if (typeof GRAMMAR === "undefined") return "";
        const codes = code.split("–").length > 1 ? ["B2", "C1"] : [code];
        const list = GRAMMAR.filter((g) => codes.includes(g.level));
        if (!list.length) return "";
        let done = {};
        try { done = (JSON.parse(localStorage.getItem("nawee-grammar-v1")) || {}).done || {}; } catch { /* ignore */ }
        const page = de ? "grammatik.html" : tr ? "grammar-tr.html" : "grammar.html";
        // Turkish titles come from grammar-tr.js when the page loads it
        const title = (g) => (tr && typeof GRAMMAR_TR !== "undefined" && GRAMMAR_TR[g.id] ? GRAMMAR_TR[g.id].title : L(g.title));
        return `<div class="lv-grammar"><p class="lv-grammar-h">📐 ${de ? "Grammatik auf diesem Niveau" : tr ? "Bu seviyedeki dilbilgisi" : "Grammar at this level"}</p><ul>${list.map((g) => `<li><a href="${page}?l=${g.id}">
            <span class="lv-check${done[g.id] ? " is-done" : ""}">${done[g.id] ? "✓" : ""}</span>${esc(title(g))}${g.beta ? ` <em class="lv-beta">beta</em>` : ""}<span class="lv-go">${done[g.id] ? T.open : T.start} →</span></a></li>`).join("")}</ul></div>`;
    };
    const T = tr
        ? { soon: "Yakında", lessons: (n) => `${n} ders`, start: "Başla", open: "Aç", doneMark: "Tamamlandı", comingSoon: "yakında", allSoon: "Bu seviyenin dersleri şu anda hazırlanıyor – yakında başlıyor.", course: "Kurs" }
        : de
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
                    <span class="lv-emoji" aria-hidden="true">${LEVEL_ICON[l.code] || ""}</span><span class="lv-code">${esc(l.code)}</span><span class="lv-name">${esc(L(l.name))}</span>${badge(l.pct, l.ready)}</button></li>`).join("")}</ul>
                <div class="lv-themes" role="tabpanel">
                    <p class="lv-head"><strong>${LEVEL_ICON[lv.code] || ""} ${esc(lv.code)} · ${esc(L(lv.name))}</strong><span>${T.course}: ${esc(L(lv.course))}</span></p>
                    ${lv.ready ? "" : `<p class="lv-note">${T.allSoon}</p>`}
                    <ul class="lv-modules">${lv.modules.map((m) => `<li class="${open.has(m.id) ? "is-open" : ""}">
                        <button type="button" class="lv-module" data-module="${m.id}" aria-expanded="${open.has(m.id)}">
                            <span class="lv-mtitle"><span class="lv-micon" aria-hidden="true">${(MODULE_ICON[lv.key] || {})[m.id] || "📘"}</span>${esc(m.title)}</span><span class="lv-mmeta">${T.lessons(m.lessons.length)}</span>${badge(m.pct, m.ready)}
                            <span class="lv-bar" aria-hidden="true"><i style="width:${m.pct}%"></i></span></button>
                        ${open.has(m.id) ? `<ol class="lv-lessons">${m.lessons.map((l) => l.ready
                            ? `<li><a href="${lv.href(l.id)}"><span class="lv-check${l.done ? " is-done" : ""}" aria-label="${l.done ? T.doneMark : ""}">${l.done ? "✓" : ""}</span>${esc(l.title)}<span class="lv-go">${l.done ? T.open : T.start} →</span></a></li>`
                            : `<li class="lv-later"><span class="lv-check"></span>${esc(l.title)} <em>${T.comingSoon}</em></li>`).join("")}</ol>` : ""}
                    </li>`).join("")}</ul>
                    ${grammarFor(lv.code)}
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
    // learn page: the "free account" note only for visitors who aren't logged in (session kept by Supabase in the browser)
    try {
        const session = JSON.parse(localStorage.getItem("sb-sphhbjfyreugpuzbwird-auth-token") || "null");
        if (session && session.refresh_token) document.querySelectorAll("[data-guest-note]").forEach((n) => { n.hidden = true; });
    } catch { /* storage unavailable */ }
})();
