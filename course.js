// Nawee course – placement test, course overview (kurs.html) and lessons (lektion.html).
// Progress is stored in the browser (localStorage). The only thing sent anywhere is the
// anonymous placement level (level + page language) of the first test in a browser, to Supabase.

(() => {
    // ---------- configuration ----------
    const SUPABASE = {
        url: "https://sphhbjfyreugpuzbwird.supabase.co",
        key: "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF", // publishable key: safe to be public (insert-only table)
    };
    const STORAGE_KEY = "nawee-course-v1";

    const LEVEL_INFO = {
        "below-A2": { label: "unter A2", name: "Einstieg",
            text: "Du stehst mit Englisch noch am Anfang. Der Kurs setzt etwa B1 voraus – du kannst trotzdem reinschauen, aber ein Grundlagenkurs oder Einzelcoaching bringt dich gerade schneller voran.",
            start: 1 },
        A2: { label: "A2", name: "Grundlegende Kenntnisse",
            text: "Du verstehst einfache Sätze und kommst in vertrauten Alltagssituationen zurecht. Der Kurs ist eine kleine Herausforderung für dich – nimm dir Zeit für die Erklärungen und nutze die deutschen Bedeutungen der Phrasen.",
            start: 1 },
        B1: { label: "B1", name: "Selbstständige Sprachverwendung",
            text: "Du kommst in den meisten Alltagssituationen zurecht und kannst über vertraute Themen sprechen – oft noch mit Zögern. Genau dafür ist dieser Kurs gemacht.",
            start: 1 },
        B2: { label: "B2", name: "Fortgeschrittene Sprachverwendung",
            text: "Du verständigst dich spontan und fließend, auch bei komplexeren Themen. Der Kurs hilft dir, in schwierigen Gesprächssituationen souveräner zu werden.",
            start: 2 },
        C1: { label: "C1 oder höher", name: "Kompetente Sprachverwendung",
            text: "Du drückst dich fließend und präzise aus. Für dich geht es um Feinheiten, Wirkung und Souveränität – vor allem die Module 5 und 6 sind spannend für dich.",
            start: 5 },
    };

    // ---------- storage ----------
    const load = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
    };
    const save = (data) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
    };
    let data = load();
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
    const allLessons = () => COURSE_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.id })));
    const isAvailable = (id) => Boolean(COURSE_LESSONS[id]);

    // ======================================================================
    // COURSE PAGE: placement test + overview
    // ======================================================================
    const courseRoot = document.querySelector("[data-course]");
    if (courseRoot) {
        const $ = (sel) => courseRoot.querySelector(sel);
        const screens = courseRoot.querySelectorAll("[data-screen]");
        const show = (name) => {
            screens.forEach((s) => { s.hidden = s.dataset.screen !== name; });
            courseRoot.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        // ----- placement test -----
        // Starts at B1, 3 questions per step. 2–3 correct: one level up; 0–1 correct: one level down.
        // Stops as soon as the level is clear (max. 3 steps = 9 questions).
        const MAX_QUESTIONS = 9;
        let test = null;

        const startStep = (levelIndex) => {
            const level = PLACEMENT_LEVELS[levelIndex];
            const picked = shuffle(PLACEMENT_QUESTIONS[level].map((q, i) => i)).slice(0, 3);
            test.step = { levelIndex, items: picked.map((i) => ({ q: PLACEMENT_QUESTIONS[level][i], order: shuffle([0, 1, 2, 3]) })), pos: 0, correct: 0 };
        };

        const renderQuestion = () => {
            const item = test.step.items[test.step.pos];
            test.asked += 1;
            $("[data-counter]").textContent = `Frage ${test.asked} von max. ${MAX_QUESTIONS}`;
            $("[data-progress-bar]").style.width = `${(test.asked / MAX_QUESTIONS) * 100}%`;
            $("[data-question-text]").textContent = item.q.question;
            const box = $("[data-options]");
            box.replaceChildren();
            item.order.forEach((optIndex, pos) => {
                const id = `pq${test.asked}-o${optIndex}`;
                const label = el("label", "as-option");
                label.htmlFor = id;
                const input = el("input");
                input.type = "radio";
                input.name = `pq${test.asked}`;
                input.id = id;
                input.addEventListener("change", () => { test.choice = optIndex; $('[data-action="next"]').disabled = false; });
                label.append(input, el("span", "as-option-letter", "ABCD"[pos]), el("span", "as-option-text"));
                label.lastChild.textContent = item.q.options[optIndex];
                box.append(label);
            });
            test.choice = undefined;
            $('[data-action="next"]').disabled = true;
        };

        const decide = () => {
            const { levelIndex, correct } = test.step;
            const passed = correct >= 2;
            const prev = test.history[test.history.length - 1];
            test.history.push({ levelIndex, passed });
            if (passed) {
                if (levelIndex === PLACEMENT_LEVELS.length - 1) return PLACEMENT_LEVELS[levelIndex];
                if (prev && prev.levelIndex > levelIndex) return PLACEMENT_LEVELS[levelIndex]; // came down and passed
                return { next: levelIndex + 1 };
            }
            if (prev && prev.levelIndex < levelIndex && prev.passed) return PLACEMENT_LEVELS[prev.levelIndex]; // came up and failed
            if (levelIndex === 0) return "below-A2";
            return { next: levelIndex - 1 };
        };

        // only the first result in a browser is counted (retakes would distort the statistics)
        const sendLevel = (level) => {
            fetch(`${SUPABASE.url}/rest/v1/placement_results`, {
                method: "POST",
                headers: { apikey: SUPABASE.key, "Content-Type": "application/json", Prefer: "return=minimal" },
                body: JSON.stringify({ level, lang: document.documentElement.lang === "en" ? "en" : "de" }),
                keepalive: true,
            }).catch(() => { /* counting is optional – ignore network errors */ });
        };

        const finishTest = (level) => {
            const firstResult = !data.level;
            data.level = level;
            data.levelDate = new Date().toISOString().slice(0, 10);
            save(data);
            if (firstResult) sendLevel(level);
            renderResult();
            show("result");
        };

        const renderResult = () => {
            const info = LEVEL_INFO[data.level];
            $("[data-level-label]").textContent = info.label;
            $("[data-level-name]").textContent = info.name;
            $("[data-level-text]").textContent = info.text;
            $("[data-level-start]").textContent = `Empfohlener Einstieg: Modul ${info.start} – ${COURSE_MODULES[info.start - 1].title}`;
        };

        // ----- overview -----
        const renderOverview = () => {
            const info = data.level ? LEVEL_INFO[data.level] : null;
            const badge = $("[data-overview-level]");
            badge.innerHTML = info
                ? `Dein Niveau: <strong>${esc(info.label)}</strong> · <button type="button" class="link-button" data-action="retest">Test wiederholen</button>`
                : `Noch kein Niveau ermittelt · <button type="button" class="link-button" data-action="retest">Einstufungstest machen</button>`;

            const lessons = allLessons();
            const available = lessons.filter((l) => isAvailable(l.id));
            const done = available.filter((l) => data.completed.includes(l.id)).length;
            $("[data-overview-progress]").textContent = `${done} von ${available.length} verfügbaren Lektionen abgeschlossen`;
            $("[data-overview-bar]").style.width = available.length ? `${(done / available.length) * 100}%` : "0";

            const next = available.find((l) => !data.completed.includes(l.id));
            const cont = $("[data-continue]");
            if (next) {
                cont.href = `lektion.html?l=${next.id}`;
                cont.innerHTML = `${data.completed.length ? "Weiterlernen" : "Erste Lektion starten"}: ${esc(next.title)} <span aria-hidden="true">→</span>`;
                cont.hidden = false;
            } else {
                cont.hidden = true;
            }

            const list = $("[data-modules]");
            list.replaceChildren();
            COURSE_MODULES.forEach((m) => {
                const box = el("section", `course-module${info && info.start === m.id ? " is-recommended" : ""}`);
                const head = el("div", "course-module-head");
                head.append(el("span", "course-module-number", `Modul ${m.id}`));
                if (info && info.start === m.id) head.append(el("span", "course-badge", "Für dich empfohlen"));
                box.append(head, el("h3", "", esc(m.title)));
                const ul = el("ul", "course-lessons");
                m.lessons.forEach((l) => {
                    const li = el("li");
                    if (isAvailable(l.id)) {
                        const doneMark = data.completed.includes(l.id);
                        li.className = doneMark ? "is-done" : "is-open";
                        li.innerHTML = `<a href="lektion.html?l=${l.id}"><span class="course-status" aria-hidden="true">${doneMark ? "✓" : "→"}</span>${l.id.replace("-", ".")} ${esc(l.title)}</a>`;
                    } else {
                        li.className = "is-soon";
                        li.innerHTML = `<span class="course-status" aria-hidden="true">·</span>${l.id.replace("-", ".")} ${esc(l.title)} <em>bald verfügbar</em>`;
                    }
                    ul.append(li);
                });
                box.append(ul);
                list.append(box);
            });
        };

        // ----- actions -----
        courseRoot.addEventListener("click", (event) => {
            const action = event.target.closest("[data-action]")?.dataset.action;
            if (!action) return;
            if (action === "start-test" || action === "retest") {
                test = { history: [], asked: 0 };
                startStep(1); // B1
                renderQuestion();
                show("question");
            }
            if (action === "skip") { renderOverview(); show("overview"); }
            if (action === "next" && test && test.choice !== undefined) {
                const item = test.step.items[test.step.pos];
                if (test.choice === item.q.correctAnswer) test.step.correct += 1;
                test.step.pos += 1;
                if (test.step.pos < test.step.items.length) { renderQuestion(); return; }
                const outcome = decide();
                if (typeof outcome === "string") { finishTest(outcome); return; }
                startStep(outcome.next);
                renderQuestion();
            }
            if (action === "to-overview") { renderOverview(); show("overview"); }
        });

        courseRoot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && event.target.matches(".as-option input")) {
                const next = $('[data-action="next"]');
                if (!next.disabled) next.click();
            }
        });

        // returning learners go straight to the overview
        if (data.level || data.completed.length || data.skipped) { renderOverview(); show("overview"); }
        $('[data-action="skip"]')?.addEventListener("click", () => { data.skipped = true; save(data); });
    }

    // ======================================================================
    // LESSON PAGE
    // ======================================================================
    const lessonRoot = document.querySelector("[data-lesson]");
    if (lessonRoot) {
        const id = new URLSearchParams(location.search).get("l");
        const meta = allLessons().find((l) => l.id === id);
        const lesson = COURSE_LESSONS[id];

        if (!meta || !lesson) {
            lessonRoot.innerHTML = `<p class="eyebrow">KURS</p><h1>Diese Lektion gibt es (noch) nicht.</h1><p><a class="button primary" href="kurs.html">Zur Kursübersicht <span aria-hidden="true">→</span></a></p>`;
            return;
        }

        const module = COURSE_MODULES.find((m) => m.id === meta.module);
        document.title = `${meta.title} | Nawee Kurs`;
        data.last = id;
        save(data);

        const parts = [];
        parts.push(`<a class="lesson-back" href="kurs.html">← Kursübersicht</a>`);
        parts.push(`<p class="eyebrow">MODUL ${module.id} · LEKTION ${id.replace("-", ".")}</p>`);
        parts.push(`<h1>${esc(meta.title)}</h1>`);
        parts.push(`<p class="lesson-goal"><strong>Ziel:</strong> ${esc(lesson.goal)}</p>`);
        parts.push(`<h2 class="lesson-h">Kurz erklärt</h2>${lesson.explanation.map((p) => `<p>${p}</p>`).join("")}`);
        parts.push(`<h2 class="lesson-h">Phrases</h2><ul class="lesson-phrases">${lesson.phrases.map((p) => `<li><span lang="en">${esc(p.en)}</span><small>${esc(p.de)}</small></li>`).join("")}</ul>`);
        parts.push(`<h2 class="lesson-h">Übungen</h2><div class="lesson-exercises" data-exercises></div>`);
        parts.push(`<div class="lesson-mistake"><p class="lesson-mistake-label">Typischer Fehler</p><p><s lang="en">${esc(lesson.mistake.wrong)}</s> → <strong lang="en">${esc(lesson.mistake.right)}</strong></p><p>${esc(lesson.mistake.explain)}</p></div>`);
        parts.push(`<div class="lesson-mission"><p class="lesson-mistake-label">Deine Mission</p><p>${esc(lesson.mission)}</p></div>`);
        parts.push(`<div class="lesson-finish" data-finish></div>`);
        lessonRoot.innerHTML = parts.join("");

        // ----- exercises -----
        const box = lessonRoot.querySelector("[data-exercises]");
        lesson.exercises.forEach((ex, n) => {
            const card = el("div", "exercise");
            card.append(el("p", "exercise-number", `Übung ${n + 1}`));
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
                        feedback.innerHTML = `${ok ? "✓ Richtig! " : "✗ Nicht ganz – versuch es noch einmal. "}${ok ? esc(ex.explain) : ""}`;
                        feedback.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                        feedback.hidden = false;
                    });
                    opts.append(btn);
                });
                card.append(opts);
            }

            if (ex.type === "gap") {
                const [before, after] = ex.prompt.split("___");
                card.querySelector(".exercise-prompt").textContent = "Ergänze das fehlende Wort:";
                const line = el("p", "exercise-gap");
                line.lang = "en";
                const input = el("input");
                input.type = "text";
                input.autocomplete = "off";
                input.setAttribute("aria-label", "Fehlendes Wort");
                line.append(document.createTextNode(before), input, document.createTextNode(after));
                const check = el("button", "button secondary exercise-check", "Prüfen");
                check.type = "button";
                const run = () => {
                    const val = input.value.trim().toLowerCase();
                    const ok = ex.answers.includes(val);
                    feedback.innerHTML = ok ? `✓ Richtig! ${esc(ex.explain)}` : `✗ Noch nicht. Tipp: Lösung ist „${esc(ex.answers[0])}“. ${esc(ex.explain)}`;
                    feedback.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                    feedback.hidden = false;
                    input.classList.toggle("is-right", ok);
                };
                check.addEventListener("click", run);
                input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
                card.append(line, check);
            }

            if (ex.type === "order") {
                const target = el("p", "exercise-order-target");
                target.lang = "en";
                const pool = el("div", "exercise-order-pool");
                const picked = [];
                const reset = el("button", "link-button", "Zurücksetzen");
                reset.type = "button";
                const draw = () => {
                    target.textContent = picked.length ? picked.join(" ") : "Tippe die Wörter in der richtigen Reihenfolge an …";
                    target.classList.toggle("is-empty", !picked.length);
                };
                shuffle(ex.words).forEach((w) => {
                    const chip = el("button", "exercise-chip");
                    chip.type = "button";
                    chip.textContent = w;
                    chip.addEventListener("click", () => {
                        picked.push(w);
                        chip.disabled = true;
                        draw();
                        if (picked.length === ex.words.length) {
                            const ok = picked.join(" ") === ex.words.join(" ");
                            feedback.innerHTML = ok ? `✓ Richtig! ${esc(ex.explain)}` : `✗ Nicht ganz. Richtig ist: „${esc(ex.words.join(" "))}“`;
                            feedback.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                            feedback.hidden = false;
                        }
                    });
                    pool.append(chip);
                });
                reset.addEventListener("click", () => {
                    picked.length = 0;
                    pool.querySelectorAll("button").forEach((b) => { b.disabled = false; });
                    feedback.hidden = true;
                    draw();
                });
                draw();
                card.append(target, pool, reset);
            }

            if (ex.type === "write") {
                const area = el("textarea", "exercise-write");
                area.rows = 3;
                area.lang = "en";
                area.placeholder = "Schreib deine Antwort auf Englisch …";
                area.setAttribute("aria-label", "Deine Antwort");
                const compare = el("button", "button secondary exercise-check", "Mit Musterantworten vergleichen");
                compare.type = "button";
                compare.addEventListener("click", () => {
                    feedback.innerHTML = `<strong>So könntest du es sagen:</strong><br>${ex.models.map((m) => `„<span lang="en">${esc(m)}</span>“`).join("<br>")}<br><em>${esc(ex.tip)}</em>`;
                    feedback.className = "exercise-feedback is-model";
                    feedback.hidden = false;
                });
                card.append(area, compare);
            }

            card.append(feedback);
            box.append(card);
        });

        // ----- finish -----
        const finish = lessonRoot.querySelector("[data-finish]");
        const lessons = allLessons();
        const nextAvailable = lessons.slice(lessons.findIndex((l) => l.id === id) + 1).find((l) => isAvailable(l.id));
        const drawFinish = () => {
            const done = data.completed.includes(id);
            finish.innerHTML = done
                ? `<p class="lesson-done">✓ Lektion abgeschlossen – stark!</p>
                   <div class="as-actions">${nextAvailable ? `<a class="button primary" href="lektion.html?l=${nextAvailable.id}">Nächste Lektion <span aria-hidden="true">→</span></a>` : ""}
                   <a class="button secondary" href="kurs.html">Zur Kursübersicht</a></div>
                   ${nextAvailable ? "" : "<p class=\"as-note\">Weitere Lektionen folgen bald.</p>"}`
                : `<button type="button" class="button primary" data-complete>Lektion abschließen <span aria-hidden="true">✓</span></button>`;
            finish.querySelector("[data-complete]")?.addEventListener("click", () => {
                if (!data.completed.includes(id)) data.completed.push(id);
                save(data);
                drawFinish();
            });
        };
        drawFinish();
    }
})();
