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

    // de / en / tr (2026-11-07): explanations in the page language – course-en.js / course-tr.js hold the texts by path
    const lng = { en: "en", tr: "tr" }[(document.documentElement.lang || "de").slice(0, 2)] || "de";
    const PAGES = { de: ["kurs.html", "lektion.html", "lernen.html"], en: ["course.html", "lesson.html", "learn.html"], tr: ["course-tr.html", "lesson-tr.html", "learn-tr.html"] }[lng];
    const [COURSE_PAGE, LESSON_PAGE, LEARN_PAGE] = PAGES;
    if (lng !== "de" && typeof COURSE_I18N !== "undefined") {
        const X = COURSE_I18N, put = (obj, key, path) => { if (X[path] !== undefined) obj[key] = X[path]; };
        COURSE_MODULES.forEach((m) => { put(m, "title", `m${m.id}`); m.lessons.forEach((l) => put(l, "title", `${l.id}.title`)); });
        Object.entries(COURSE_LESSONS).forEach(([id, l]) => {
            put(l, "goal", `${id}.goal`); put(l, "mission", `${id}.mission`); put(l.mistake, "explain", `${id}.mistake.explain`);
            l.explanation.forEach((_, i) => put(l.explanation, i, `${id}.explanation.${i}`));
            l.phrases.forEach((p, i) => put(p, "de", `${id}.phrases.${i}.de`));
            l.exercises.forEach((ex, j) => {
                ["prompt", "explain", "tip"].forEach((k) => put(ex, k, `${id}.exercises.${j}.${k}`));
                ["options", "items"].forEach((k) => (ex[k] || []).forEach((_, i) => put(ex[k], i, `${id}.exercises.${j}.${k}.${i}`)));
            });
        });
    }
    const T = {
        de: { counter: (a, n) => `Frage ${a} von max. ${n}`, start: (n, t) => `Empfohlener Einstieg: Modul ${n} – ${t}`, levelIs: "Dein Niveau:", retest: "Test wiederholen", noLevel: "Noch kein Niveau ermittelt", doTest: "Einstufungstest machen",
            progress: (d, n) => `${d} von ${n} verfügbaren Lektionen abgeschlossen`, cont: "Weiterlernen", first: "Erste Lektion starten", module: "Modul", recommended: "Für dich empfohlen", soon: "bald verfügbar",
            missing: "Diese Lektion gibt es (noch) nicht.", toCourse: "Zur Kursübersicht", back: "← Kursübersicht", eyebrow: (m, l) => `MODUL ${m} · LEKTION ${l}`, course: "KURS", titleSuffix: "Nawee Kurs", goal: "Ziel:", explained: "Kurz erklärt", exercises: "Übungen", mistake: "Typischer Fehler", mission: "Deine Mission",
            listen: "Anhören", againOne: "Wieder einzeln üben", phraseOf: (i, n) => `Phrase ${i} von ${n}`, prev: "← Zurück", seeAll: "Alle Phrasen ansehen ✓", nextPhrase: "Nächste Phrase →", tip: "Tipp: Hör sie dir an und sag sie zweimal laut nach.",
            exercise: "Übung", right: "✓ Richtig! ", tryAgain: "✗ Nicht ganz – versuch es noch einmal. ", fillGap: "Ergänze das fehlende Wort:", missingWord: "Fehlendes Wort", check: "Prüfen", notYet: (a) => `✗ Noch nicht. Tipp: Lösung ist „${a}“. `,
            reset: "Zurücksetzen", tapWords: "Tippe die Wörter in der richtigen Reihenfolge an …", notQuite: (a) => `✗ Nicht ganz. Richtig ist: „${a}“`, writePh: "Schreib deine Antwort auf Englisch …", yourAnswer: "Deine Antwort", compare: "Mit Musterantworten vergleichen", sayIt: "So könntest du es sagen:",
            evaluate: "Auswerten", points: (d, n) => `${d} von ${n} Punkten klappen schon.`, doneTitle: "Glückwunsch – du hast den Kurs abgeschlossen!",
            doneText: "Du kennst jetzt die wichtigsten Strategien für echte Gespräche. Übe weiter mit den Bildkarten und den anderen kostenlosen Kursen. Wenn du gezielt an deinen Situationen arbeiten willst: <a href=\"/lessons/#angebote\">Unterricht &amp; Preise bei David und Omer</a>",
            keepLearning: "Weiter lernen", lessonDone: "✓ Lektion abgeschlossen – stark!", nextLesson: "Nächste Lektion", moreSoon: "Weitere Lektionen folgen bald.", complete: "Lektion abschließen" },
        en: { counter: (a, n) => `Question ${a} of max. ${n}`, start: (n, t) => `Recommended start: module ${n} – ${t}`, levelIs: "Your level:", retest: "Retake the test", noLevel: "No level yet", doTest: "Take the placement test",
            progress: (d, n) => `${d} of ${n} available lessons completed`, cont: "Continue", first: "Start the first lesson", module: "Module", recommended: "Recommended for you", soon: "coming soon",
            missing: "This lesson doesn’t exist (yet).", toCourse: "Course overview", back: "← Course overview", eyebrow: (m, l) => `MODULE ${m} · LESSON ${l}`, course: "COURSE", titleSuffix: "Nawee course", goal: "Goal:", explained: "In short", exercises: "Exercises", mistake: "Common mistake", mission: "Your mission",
            listen: "Listen", againOne: "Practice one by one again", phraseOf: (i, n) => `Phrase ${i} of ${n}`, prev: "← Back", seeAll: "See all phrases ✓", nextPhrase: "Next phrase →", tip: "Tip: listen and say it out loud twice.",
            exercise: "Exercise", right: "✓ Correct! ", tryAgain: "✗ Not quite – try again. ", fillGap: "Fill in the missing word:", missingWord: "Missing word", check: "Check", notYet: (a) => `✗ Not yet. Tip: the answer is “${a}”. `,
            reset: "Reset", tapWords: "Tap the words in the right order …", notQuite: (a) => `✗ Not quite. Correct: “${a}”`, writePh: "Write your answer in English …", yourAnswer: "Your answer", compare: "Compare with example answers", sayIt: "You could say it like this:",
            evaluate: "Check", points: (d, n) => `${d} of ${n} points already work.`, doneTitle: "Congratulations – you’ve finished the course!",
            doneText: "You now know the most important strategies for real conversations. Keep practicing with the picture cards and the other free courses. If you want to work on your own situations: <a href=\"/lessons/index-en.html#angebote\">lessons &amp; prices with David and Omer</a>",
            keepLearning: "Keep learning", lessonDone: "✓ Lesson completed – great work!", nextLesson: "Next lesson", moreSoon: "More lessons coming soon.", complete: "Complete the lesson" },
        tr: { counter: (a, n) => `Soru ${a} / en fazla ${n}`, start: (n, t) => `Önerilen başlangıç: Modül ${n} – ${t}`, levelIs: "Seviyen:", retest: "Testi tekrarla", noLevel: "Henüz seviye belirlenmedi", doTest: "Seviye testine gir",
            progress: (d, n) => `${n} mevcut dersten ${d} tanesi tamamlandı`, cont: "Devam et", first: "İlk derse başla", module: "Modül", recommended: "Sana önerilen", soon: "yakında",
            missing: "Bu ders (henüz) yok.", toCourse: "Kurs genel bakışı", back: "← Kurs genel bakışı", eyebrow: (m, l) => `MODÜL ${m} · DERS ${l}`, course: "KURS", titleSuffix: "Nawee kursu", goal: "Hedef:", explained: "Kısaca", exercises: "Alıştırmalar", mistake: "Sık yapılan hata", mission: "Görevin",
            listen: "Dinle", againOne: "Tek tek tekrar çalış", phraseOf: (i, n) => `İfade ${i} / ${n}`, prev: "← Geri", seeAll: "Tüm ifadeleri gör ✓", nextPhrase: "Sonraki ifade →", tip: "İpucu: dinle ve iki kez yüksek sesle tekrarla.",
            exercise: "Alıştırma", right: "✓ Doğru! ", tryAgain: "✗ Tam değil – tekrar dene. ", fillGap: "Eksik kelimeyi tamamla:", missingWord: "Eksik kelime", check: "Kontrol et", notYet: (a) => `✗ Henüz değil. İpucu: cevap “${a}”. `,
            reset: "Sıfırla", tapWords: "Kelimelere doğru sırayla dokun …", notQuite: (a) => `✗ Tam değil. Doğrusu: “${a}”`, writePh: "Cevabını İngilizce yaz …", yourAnswer: "Cevabın", compare: "Örnek cevaplarla karşılaştır", sayIt: "Şöyle söyleyebilirsin:",
            evaluate: "Değerlendir", points: (d, n) => `${n} maddeden ${d} tanesi şimdiden işe yarıyor.`, doneTitle: "Tebrikler – kursu bitirdin!",
            doneText: "Artık gerçek konuşmalar için en önemli stratejileri biliyorsun. Resimli kartlar ve diğer ücretsiz kurslarla çalışmaya devam et. Kendi durumların üzerinde çalışmak istersen: <a href=\"/lessons/index-en.html#angebote\">David ve Omer ile dersler ve fiyatlar</a>",
            keepLearning: "Öğrenmeye devam et", lessonDone: "✓ Ders tamamlandı – harika!", nextLesson: "Sonraki ders", moreSoon: "Yeni dersler yakında.", complete: "Dersi tamamla" },
    }[lng];

    const LEVEL_INFO_I18N = {
        en: { "below-A2": ["below A2", "Getting started", "You’re at the very beginning with English. The course expects about B1 – you can still take a look, but a beginners’ course or one-on-one lessons will help you more right now."],
              A2: ["A2", "Basic user", "You understand simple sentences and manage in familiar everyday situations. The course is a small challenge for you – take your time with the explanations."],
              B1: ["B1", "Independent user", "You manage most everyday situations and can talk about familiar topics – often still with hesitation. That’s exactly what this course is made for."],
              B2: ["B2", "Upper intermediate", "You communicate spontaneously and fluently, even on more complex topics. The course helps you stay confident in difficult conversations."],
              C1: ["C1 or higher", "Proficient user", "You express yourself fluently and precisely. For you, it’s about nuance, impact and confidence – modules 5 and 6 are especially interesting."] },
        tr: { "below-A2": ["A2’nin altı", "Başlangıç", "İngilizcede henüz en baştasın. Kurs yaklaşık B1 seviyesi bekliyor – yine de göz atabilirsin, ama şu an bir başlangıç kursu ya da birebir ders seni daha hızlı ilerletir."],
              A2: ["A2", "Temel kullanıcı", "Basit cümleleri anlıyorsun ve tanıdık günlük durumlarda idare edebiliyorsun. Kurs senin için küçük bir meydan okuma – açıklamalara zaman ayır."],
              B1: ["B1", "Bağımsız kullanıcı", "Çoğu günlük durumda idare ediyorsun ve tanıdık konularda konuşabiliyorsun – çoğu zaman hâlâ duraksayarak. Bu kurs tam olarak bunun için yapıldı."],
              B2: ["B2", "İleri orta", "Daha karmaşık konularda bile kendiliğinden ve akıcı iletişim kuruyorsun. Kurs zor konuşmalarda daha kendinden emin olmana yardımcı olur."],
              C1: ["C1 ya da üstü", "Yetkin kullanıcı", "Kendini akıcı ve kesin ifade ediyorsun. Senin için incelikler, etki ve özgüven önemli – özellikle 5. ve 6. modüller ilgini çekecek."] },
    }[lng];

    const LEVEL_INFO = {
        "below-A2": { label: "unter A2", name: "Einstieg",
            text: "Du stehst mit Englisch noch am Anfang. Der Kurs setzt etwa B1 voraus – du kannst trotzdem reinschauen, aber ein Grundlagenkurs oder Einzelunterricht bringt dich gerade schneller voran.",
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
    if (LEVEL_INFO_I18N) Object.entries(LEVEL_INFO_I18N).forEach(([k, [label, name, text]]) => Object.assign(LEVEL_INFO[k], { label, name, text }));

    // ---------- storage ----------
    const load = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
    };
    const save = (data) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // lets account.js sync to the account (if logged in)
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
            $("[data-counter]").textContent = T.counter(test.asked, MAX_QUESTIONS);
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
                body: JSON.stringify({ level, lang: lng === "de" ? "de" : "en" }), // Turkish counted as "en" (table allows de/en)
                keepalive: true,
            }).catch(() => { /* counting is optional – ignore network errors */ });
        };

        const finishTest = (level) => {
            const firstResult = !data.level;
            data.level = level;
            data.levelDate = new Date().toISOString().slice(0, 10);
            save(data);
            if (firstResult) sendLevel(level);
            window.NaweeTrophies?.check();
            renderResult();
            show("result");
        };

        const renderResult = () => {
            const info = LEVEL_INFO[data.level];
            $("[data-level-label]").textContent = info.label;
            $("[data-level-name]").textContent = info.name;
            $("[data-level-text]").textContent = info.text;
            $("[data-level-start]").textContent = T.start(info.start, COURSE_MODULES[info.start - 1].title);
        };

        // ----- overview -----
        const renderOverview = () => {
            const info = data.level ? LEVEL_INFO[data.level] : null;
            const badge = $("[data-overview-level]");
            badge.innerHTML = info
                ? `${T.levelIs} <strong>${esc(info.label)}</strong> · <button type="button" class="link-button" data-action="retest">${T.retest}</button>`
                : `${T.noLevel} · <button type="button" class="link-button" data-action="retest">${T.doTest}</button>`;

            const lessons = allLessons();
            const available = lessons.filter((l) => isAvailable(l.id));
            const done = available.filter((l) => data.completed.includes(l.id)).length;
            $("[data-overview-progress]").textContent = T.progress(done, available.length);
            $("[data-overview-bar]").style.width = available.length ? `${(done / available.length) * 100}%` : "0";

            const next = available.find((l) => !data.completed.includes(l.id));
            const cont = $("[data-continue]");
            if (next) {
                cont.href = `${LESSON_PAGE}?l=${next.id}`;
                cont.innerHTML = `${data.completed.length ? T.cont : T.first}: ${esc(next.title)} <span aria-hidden="true">→</span>`;
                cont.hidden = false;
            } else {
                cont.hidden = true;
            }

            if (window.NaweeTrophies) {
                window.NaweeTrophies.renderCabinet($("[data-trophies]"), $("[data-trophy-count]"));
                const slot = $("[data-sound-slot]");
                if (slot && !slot.firstChild) slot.append(window.NaweeTrophies.soundToggle());
            }

            const list = $("[data-modules]");
            list.replaceChildren();
            COURSE_MODULES.forEach((m) => {
                const box = el("section", `course-module${info && info.start === m.id ? " is-recommended" : ""}`);
                const head = el("div", "course-module-head");
                head.append(el("span", "course-module-number", `${T.module} ${m.id}`));
                if (info && info.start === m.id) head.append(el("span", "course-badge", T.recommended));
                box.append(head, el("h3", "", esc(m.title)));
                const ul = el("ul", "course-lessons");
                m.lessons.forEach((l) => {
                    const li = el("li");
                    if (isAvailable(l.id)) {
                        const doneMark = data.completed.includes(l.id);
                        li.className = doneMark ? "is-done" : "is-open";
                        li.innerHTML = `<a href="${LESSON_PAGE}?l=${l.id}"><span class="course-status" aria-hidden="true">${doneMark ? "✓" : "→"}</span>${l.id.replace("-", ".")} ${esc(l.title)}</a>`;
                    } else {
                        li.className = "is-soon";
                        li.innerHTML = `<span class="course-status" aria-hidden="true">·</span>${l.id.replace("-", ".")} ${esc(l.title)} <em>${T.soon}</em>`;
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
            lessonRoot.innerHTML = `<p class="eyebrow">${T.course}</p><h1>${T.missing}</h1><p><a class="button primary" href="${COURSE_PAGE}">${T.toCourse} <span aria-hidden="true">→</span></a></p>`;
            return;
        }

        const module = COURSE_MODULES.find((m) => m.id === meta.module);
        document.title = `${meta.title} | ${T.titleSuffix}`;
        data.last = id;
        save(data);

        const parts = [];
        parts.push(`<a class="lesson-back" href="${COURSE_PAGE}">${T.back}</a>`);
        parts.push(`<p class="eyebrow">${T.eyebrow(module.id, id.replace("-", "."))}</p>`);
        parts.push(`<h1>${esc(meta.title)}</h1>`);
        parts.push(`<p class="lesson-goal"><strong>${T.goal}</strong> ${esc(lesson.goal)}</p>`);
        parts.push(`<h2 class="lesson-h">${T.explained}</h2>${lesson.explanation.map((p) => `<p>${p}</p>`).join("")}`);
        parts.push(`<h2 class="lesson-h">Phrases</h2><div class="phrase-card" data-phrases></div>`);
        parts.push(`<h2 class="lesson-h">${T.exercises}</h2><div class="lesson-exercises" data-exercises></div>`);
        parts.push(`<div class="lesson-mistake"><p class="lesson-mistake-label">${T.mistake}</p><p><s lang="en">${esc(lesson.mistake.wrong)}</s> → <strong lang="en">${esc(lesson.mistake.right)}</strong></p><p>${esc(lesson.mistake.explain)}</p></div>`);
        parts.push(`<div class="lesson-mission"><p class="lesson-mistake-label">${T.mission}</p><p>${esc(lesson.mission)}</p></div>`);
        parts.push(`<div class="lesson-finish" data-finish></div>`);
        lessonRoot.innerHTML = parts.join("");
        if (window.NaweeTrophies) { // sound switch floats at the bottom left, so it stays visible while scrolling
            const toggle = window.NaweeTrophies.soundToggle();
            toggle.classList.add("is-floating");
            document.body.append(toggle);
        }

        // ----- phrases: one at a time (David, 2026-11-04: eight at once was too many) -----
        // big phrase + German meaning + 🔊 (browser voice), Back / Next, "Phrase 3 of 8"; after the last one all can be shown for review
        {
            const pbox = lessonRoot.querySelector("[data-phrases]"), list = lesson.phrases;
            const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
            const sayPhrase = (t) => {
                if (!synth) return;
                synth.cancel();
                const u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; u.rate = 0.9;
                const v = synth.getVoices().find((x) => /en.US/i.test(x.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(x.name)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
                if (v) u.voice = v;
                synth.speak(u);
            };
            let pi = 0;
            const showAll = () => {
                pbox.innerHTML = `<ul class="lesson-phrases">${list.map((p) => `<li><button type="button" class="pc-say" data-say="${esc(p.en)}" aria-label="${T.listen}">🔊</button><span lang="en">${esc(p.en)}</span>${p.de ? `<small>${esc(p.de)}</small>` : ""}</li>`).join("")}</ul>
                    <button type="button" class="link-button" data-one>${T.againOne}</button>`;
                pbox.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => sayPhrase(b.dataset.say)));
                pbox.querySelector("[data-one]").addEventListener("click", () => { pi = 0; draw(); });
            };
            const draw = () => {
                const p = list[pi], last = pi === list.length - 1;
                pbox.innerHTML = `<p class="pc-count">${T.phraseOf(pi + 1, list.length)}</p>
                    <div class="pc-dots" aria-hidden="true">${list.map((_, k) => `<i class="${k < pi ? "is-done" : k === pi ? "is-now" : ""}"></i>`).join("")}</div>
                    <p class="pc-en" lang="en">${esc(p.en)}</p>
                    ${p.de ? `<p class="pc-de">${esc(p.de)}</p>` : ""}
                    <div class="pc-actions">
                        <button type="button" class="button secondary" data-prev ${pi === 0 ? "disabled" : ""}>${T.prev}</button>
                        <button type="button" class="button secondary pc-listen" data-listen>🔊 ${T.listen}</button>
                        <button type="button" class="button primary" data-next>${last ? T.seeAll : T.nextPhrase}</button>
                    </div>
                    <p class="as-note pc-tip">${T.tip}</p>`;
                pbox.querySelector("[data-listen]").addEventListener("click", () => sayPhrase(p.en));
                pbox.querySelector("[data-prev]").addEventListener("click", () => { pi = Math.max(0, pi - 1); draw(); });
                pbox.querySelector("[data-next]").addEventListener("click", () => { if (last) showAll(); else { pi += 1; draw(); sayPhrase(list[pi].en); } });
            };
            draw();
        }

        // ----- exercises -----
        // trophies: count today as a learning day, and remember whether each exercise was right on the first try
        window.NaweeTrophies?.record("day");
        const firstTry = {};
        const noteFirst = (n, ok) => { if (firstTry[n] === undefined) firstTry[n] = ok; };

        const box = lessonRoot.querySelector("[data-exercises]");
        lesson.exercises.forEach((ex, n) => {
            const card = el("div", "exercise");
            card.append(el("p", "exercise-number", `${T.exercise} ${n + 1}`));
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
                        noteFirst(n, ok);
                        window.NaweeTrophies?.play(ok ? "correct" : "wrong");
                        btn.classList.add(ok ? "is-right" : "is-wrong");
                        if (ok) opts.querySelectorAll("button").forEach((b) => { b.disabled = true; });
                        feedback.innerHTML = `${ok ? T.right : T.tryAgain}${ok ? esc(ex.explain) : ""}`;
                        feedback.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                        feedback.hidden = false;
                    });
                    opts.append(btn);
                });
                card.append(opts);
            }

            if (ex.type === "gap") {
                const [before, after] = ex.prompt.split("___");
                card.querySelector(".exercise-prompt").textContent = T.fillGap;
                const line = el("p", "exercise-gap");
                line.lang = "en";
                const input = el("input");
                input.type = "text";
                input.autocomplete = "off";
                input.setAttribute("aria-label", T.missingWord);
                line.append(document.createTextNode(before), input, document.createTextNode(after));
                const check = el("button", "button secondary exercise-check", T.check);
                check.type = "button";
                const run = () => {
                    const val = input.value.trim().toLowerCase();
                    const ok = ex.answers.includes(val);
                    noteFirst(n, ok);
                    window.NaweeTrophies?.play(ok ? "correct" : "wrong");
                    feedback.innerHTML = ok ? `${T.right}${esc(ex.explain)}` : `${T.notYet(esc(ex.answers[0]))}${esc(ex.explain)}`;
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
                const reset = el("button", "link-button", T.reset);
                reset.type = "button";
                const draw = () => {
                    target.textContent = picked.length ? picked.join(" ") : T.tapWords;
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
                            noteFirst(n, ok);
                            window.NaweeTrophies?.play(ok ? "correct" : "wrong");
                            feedback.innerHTML = ok ? `${T.right}${esc(ex.explain)}` : T.notQuite(esc(ex.words.join(" ")));
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
                area.placeholder = T.writePh;
                area.setAttribute("aria-label", T.yourAnswer);
                const compare = el("button", "button secondary exercise-check", T.compare);
                compare.type = "button";
                compare.addEventListener("click", () => {
                    if (area.value.trim()) window.NaweeTrophies?.record("compare", `${id}-${n}`); // only counts with an own answer
                    feedback.innerHTML = `<strong>${T.sayIt}</strong><br>${ex.models.map((m) => `„<span lang="en">${esc(m)}</span>“`).join("<br>")}<br><em>${esc(ex.tip)}</em>`;
                    feedback.className = "exercise-feedback is-model";
                    feedback.hidden = false;
                });
                card.append(area, compare);
            }

            if (ex.type === "checklist") {
                const list = el("ul", "exercise-checklist");
                ex.items.forEach((item, i) => {
                    const li = el("li");
                    const label = el("label");
                    const input = el("input");
                    input.type = "checkbox";
                    input.id = `cl${n}-${i}`;
                    label.htmlFor = input.id;
                    label.textContent = item;
                    li.append(input, label);
                    list.append(li);
                });
                const evaluate = el("button", "button secondary exercise-check", T.evaluate);
                evaluate.type = "button";
                evaluate.addEventListener("click", () => {
                    window.NaweeTrophies?.record("camera");
                    const done = list.querySelectorAll("input:checked").length;
                    feedback.innerHTML = `<strong>${T.points(done, ex.items.length)}</strong> ${esc(ex.explain)}`;
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
        const lessons = allLessons();
        const nextAvailable = lessons.slice(lessons.findIndex((l) => l.id === id) + 1).find((l) => isAvailable(l.id));
        const courseComplete = lessons.every((l) => isAvailable(l.id));
        const drawFinish = () => {
            const done = data.completed.includes(id);
            if (done && !nextAvailable && courseComplete) {
                finish.innerHTML = `<div class="as-cta lesson-complete">
                    <h2>${T.doneTitle}</h2>
                    <p>${T.doneText}</p>
                    <div class="as-actions"><a class="button primary" href="${LEARN_PAGE}">${T.keepLearning} <span aria-hidden="true">→</span></a>
                    <a class="button mission-outline" href="${COURSE_PAGE}">${T.toCourse}</a></div></div>`;
                return;
            }
            finish.innerHTML = done
                ? `<p class="lesson-done">${T.lessonDone}</p>
                   <div class="as-actions">${nextAvailable ? `<a class="button primary" href="${LESSON_PAGE}?l=${nextAvailable.id}">${T.nextLesson} <span aria-hidden="true">→</span></a>` : ""}
                   <a class="button secondary" href="${COURSE_PAGE}">${T.toCourse}</a></div>
                   ${nextAvailable ? "" : `<p class="as-note">${T.moreSoon}</p>`}`
                : `<button type="button" class="button primary" data-complete>${T.complete} <span aria-hidden="true">✓</span></button>`;
            finish.querySelector("[data-complete]")?.addEventListener("click", () => {
                if (!data.completed.includes(id)) data.completed.push(id);
                save(data);
                // "perfect" lesson: every graded exercise (choice, gap, order) right on the first try
                const graded = lesson.exercises.map((ex, n) => n).filter((n) => ["choice", "gap", "order"].includes(lesson.exercises[n].type));
                const fresh = graded.every((n) => firstTry[n] === true) ? window.NaweeTrophies?.record("perfect", id) : window.NaweeTrophies?.check();
                if (!fresh || !fresh.length) window.NaweeTrophies?.play("complete"); // a trophy brings its own fanfare
                drawFinish();
            });
        };
        drawFinish();
    }
})();
