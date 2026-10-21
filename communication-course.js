// Nawee Communication Course – overview (communication-course.html) and lessons (communication-lesson.html).
// Free, no account needed. Progress is stored in the visitor's browser (localStorage). Visitors who choose to
// create a free account get it synced to their account by account.js (inside `course.communication`).
// The path is progressive: each lesson unlocks once the lesson before it is completed.

(() => {
    const STORAGE_KEY = "nawee-communication-course-v1";

    // ---------- storage ----------
    const load = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
    };
    const save = (data) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // lets account.js sync to the account (if logged in)
    };
    const data = load();
    data.completed = data.completed || [];

    // ---------- helpers ----------
    const el = (tag, cls, html) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    };
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    const lessons = CC_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.id })));
    const isDone = (id) => data.completed.includes(id);
    // a lesson is unlocked if it's the first one or the one before it is completed
    const isUnlocked = (id) => {
        const i = lessons.findIndex((l) => l.id === id);
        return i === 0 || (i > 0 && isDone(lessons[i - 1].id));
    };
    const nextLesson = () => lessons.find((l) => !isDone(l.id) && isUnlocked(l.id));
    const label = (id) => id.replace("-", ".");

    // ======================================================================
    // OVERVIEW PAGE
    // ======================================================================
    const courseRoot = document.querySelector("[data-cc-course]");
    if (courseRoot) {
        const $ = (sel) => courseRoot.querySelector(sel);
        const done = lessons.filter((l) => isDone(l.id)).length;
        $("[data-cc-progress]").textContent = `${done} of ${lessons.length} lessons completed`;
        $("[data-cc-bar]").style.width = `${(done / lessons.length) * 100}%`;

        const next = nextLesson();
        const cont = $("[data-cc-continue]");
        if (next) {
            cont.href = `communication-lesson.html?l=${next.id}`;
            cont.innerHTML = `${done ? "Continue" : "Start the first lesson"}: ${esc(next.title)} <span aria-hidden="true">→</span>`;
        } else {
            cont.hidden = true;
            $("[data-cc-complete]").hidden = false;
        }

        const list = $("[data-cc-modules]");
        CC_MODULES.forEach((m) => {
            const current = next && next.module === m.id;
            const box = el("section", `course-module${current ? " is-recommended" : ""}`);
            const head = el("div", "course-module-head");
            head.append(el("span", "course-module-number", `Module ${m.id}`));
            if (current) head.append(el("span", "course-badge", "You are here"));
            if (m.lessons.every((l) => isDone(l.id))) head.append(el("span", "course-badge is-done", "Completed"));
            box.append(head, el("h3", "", esc(m.title)));
            const ul = el("ul", "course-lessons");
            m.lessons.forEach((l) => {
                const li = el("li");
                if (isDone(l.id) || isUnlocked(l.id)) {
                    li.className = isDone(l.id) ? "is-done" : "is-open";
                    li.innerHTML = `<a href="communication-lesson.html?l=${l.id}"><span class="course-status" aria-hidden="true">${isDone(l.id) ? "✓" : "→"}</span>${label(l.id)} ${esc(l.title)}</a>`;
                } else {
                    li.className = "is-locked";
                    li.innerHTML = `<span class="course-status" aria-hidden="true">🔒</span>${label(l.id)} ${esc(l.title)} <span class="visually-hidden">(locked)</span>`;
                }
                ul.append(li);
            });
            box.append(ul);
            list.append(box);
        });

        $("[data-cc-reset]")?.addEventListener("click", () => {
            if (!confirm("Reset your progress in this browser and start the course from the beginning?")) return;
            data.completed = [];
            save(data);
            location.reload();
        });
    }

    // ======================================================================
    // LESSON PAGE
    // ======================================================================
    const lessonRoot = document.querySelector("[data-cc-lesson]");
    if (!lessonRoot) return;

    const id = new URLSearchParams(location.search).get("l");
    const meta = lessons.find((l) => l.id === id);
    const lesson = CC_LESSONS[id];

    if (!meta || !lesson) {
        lessonRoot.innerHTML = `<p class="eyebrow">COURSE</p><h1>This lesson doesn't exist.</h1><p><a class="button primary" href="communication-course.html">Back to the course <span aria-hidden="true">→</span></a></p>`;
        return;
    }
    if (!isDone(id) && !isUnlocked(id)) {
        const next = nextLesson();
        lessonRoot.innerHTML = `<p class="eyebrow">MODULE ${meta.module} · LESSON ${label(id)}</p>
            <h1>🔒 ${esc(meta.title)}</h1>
            <p>This course builds step by step, so this lesson unlocks once you've completed the one before it.</p>
            <div class="as-actions">${next ? `<a class="button primary" href="communication-lesson.html?l=${next.id}">Go to your next lesson: ${esc(next.title)} <span aria-hidden="true">→</span></a>` : ""}
            <a class="button secondary" href="communication-course.html">Course overview</a></div>`;
        return;
    }

    const module = CC_MODULES.find((m) => m.id === meta.module);
    document.title = `${meta.title} | Nawee Communication Course`;

    const parts = [];
    parts.push(`<a class="lesson-back" href="communication-course.html">← Course overview</a>`);
    parts.push(`<p class="eyebrow">MODULE ${module.id} · ${esc(module.title.toUpperCase())} · LESSON ${label(id)}</p>`);
    parts.push(`<h1>${esc(meta.title)}</h1>`);
    parts.push(`<p class="lesson-goal"><strong>Goal:</strong> ${esc(lesson.goal)}</p>`);
    parts.push(`<h2 class="lesson-h">The idea</h2>${lesson.explanation.map((p) => `<p>${p}</p>`).join("")}`);
    parts.push(`<h2 class="lesson-h">Your toolkit</h2><ul class="lesson-phrases cc-toolkit">${lesson.toolkit.map((t) => `<li><span>${esc(t.title)}</span><small>${esc(t.text)}</small></li>`).join("")}</ul>`);
    parts.push(`<h2 class="lesson-h">Exercises</h2><div class="lesson-exercises" data-exercises></div>`);
    parts.push(`<div class="lesson-mistake"><p class="lesson-mistake-label">Common trap</p><p><s>${esc(lesson.trap.wrong)}</s> → <strong>${esc(lesson.trap.right)}</strong></p><p>${esc(lesson.trap.explain)}</p></div>`);
    parts.push(`<div class="lesson-mission"><p class="lesson-mistake-label">Your mission</p><p>${esc(lesson.mission)}</p></div>`);
    parts.push(`<div class="lesson-finish" data-finish></div>`);
    lessonRoot.innerHTML = parts.join("");

    // ----- exercises -----
    const box = lessonRoot.querySelector("[data-exercises]");
    lesson.exercises.forEach((ex, n) => {
        const card = el("div", "exercise");
        card.append(el("p", "exercise-number", `Exercise ${n + 1}`));
        card.append(el("p", "exercise-prompt", esc(ex.prompt)));
        const feedback = el("p", "exercise-feedback");
        feedback.hidden = true;

        if (ex.type === "choice") {
            const opts = el("div", "as-options");
            shuffle(ex.options.map((o, i) => i)).forEach((i, pos) => {
                const btn = el("button", "as-option exercise-choice");
                btn.type = "button";
                btn.append(el("span", "as-option-letter", "ABCD"[pos]), el("span", "as-option-text"));
                btn.lastChild.textContent = ex.options[i];
                btn.addEventListener("click", () => {
                    const ok = i === ex.answer;
                    btn.classList.add(ok ? "is-right" : "is-wrong");
                    if (ok) opts.querySelectorAll("button").forEach((b) => { b.disabled = true; });
                    feedback.innerHTML = ok ? `✓ Exactly. ${esc(ex.explain)}` : "✗ Not quite – try again.";
                    feedback.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                    feedback.hidden = false;
                });
                opts.append(btn);
            });
            card.append(opts);
        }

        if (ex.type === "write") {
            const area = el("textarea", "exercise-write");
            area.rows = 4;
            area.placeholder = "Write your answer …";
            area.setAttribute("aria-label", "Your answer");
            const compare = el("button", "button secondary exercise-check", "Compare with sample answers");
            compare.type = "button";
            compare.addEventListener("click", () => {
                feedback.innerHTML = `<strong>${ex.models.length > 1 ? "Sample answers" : "Sample answer"}:</strong><br>${ex.models.map((m) => `“${esc(m)}”`).join("<br>")}<br><em>${esc(ex.tip)}</em>`;
                feedback.className = "exercise-feedback is-model";
                feedback.hidden = false;
            });
            card.append(area, compare);
        }

        if (ex.type === "checklist") {
            const list = el("ul", "exercise-checklist");
            ex.items.forEach((item, i) => {
                const li = el("li");
                const input = el("input");
                input.type = "checkbox";
                input.id = `cl${n}-${i}`;
                const lab = el("label");
                lab.htmlFor = input.id;
                lab.textContent = item;
                li.append(input, lab);
                list.append(li);
            });
            const evaluate = el("button", "button secondary exercise-check", "Show insight");
            evaluate.type = "button";
            evaluate.addEventListener("click", () => {
                const ticked = list.querySelectorAll("input:checked").length;
                feedback.innerHTML = `<strong>${ticked} of ${ex.items.length} ticked.</strong> ${esc(ex.explain)}`;
                feedback.className = "exercise-feedback is-model";
                feedback.hidden = false;
            });
            card.append(list, evaluate);
        }

        card.append(feedback);
        box.append(card);
    });

    // ----- finish -----
    const finish = lessonRoot.querySelector("[data-finish]");
    const following = lessons[lessons.findIndex((l) => l.id === id) + 1];
    const drawFinish = () => {
        if (!isDone(id)) {
            finish.innerHTML = `<button type="button" class="button primary" data-complete>Complete lesson <span aria-hidden="true">✓</span></button>
                <p class="as-note">Completing this lesson unlocks the next one.</p>`;
            finish.querySelector("[data-complete]").addEventListener("click", () => {
                data.completed.push(id);
                save(data);
                drawFinish();
            });
            return;
        }
        const accountNote = `<p class="as-note cc-account-note" data-cc-account-slot="compact" hidden></p>`;
        if (!following) {
            finish.innerHTML = `<div class="as-cta lesson-complete">
                <h2>Congratulations – you've completed the course!</h2>
                <p>You now have a toolkit for confident, clear communication. If you'd like to work on your own situations – a presentation, a difficult conversation, your next big meeting – I'd be glad to coach you personally.</p>
                <div class="as-actions"><a class="button primary" href="https://cal.com/nawee/15min" target="_blank" rel="noopener">Book a free consultation <span aria-hidden="true">→</span></a>
                <a class="button mission-outline" href="communication-course.html">Course overview</a></div></div>${accountNote}`;
            window.NaweeAccount?.refresh();
            return;
        }
        const moduleDone = following.module !== meta.module;
        finish.innerHTML = `<p class="lesson-done">✓ ${moduleDone ? `Module ${meta.module} completed – well done!` : "Lesson completed – nice work!"}</p>
            <div class="as-actions"><a class="button primary" href="communication-lesson.html?l=${following.id}">Next: ${esc(following.title)} <span aria-hidden="true">→</span></a>
            <a class="button secondary" href="communication-course.html">Course overview</a></div>${accountNote}`;
        window.NaweeAccount?.refresh();
    };
    drawFinish();
})();
