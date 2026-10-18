// Nawee Business English Assessment – version 1
// Deterministic scoring with predefined feedback. Question data lives in assessment-questions.js.
// Progress is kept in sessionStorage only (nothing is sent to a server).

(() => {
    const root = document.querySelector("[data-assessment]");
    if (!root || typeof ASSESSMENT_QUESTIONS === "undefined") return;

    // ---------- configuration ----------
    // Zoho form for the detailed email report. Leave url empty to hide the email box.
    // params maps result values to the Zoho field link names used for prefilling.
    // Zoho prefills by the fields' internal names (SingleLine…), not by their aliases.
    // Visitors whose browser language is German get the German form (same field names).
    const prefersGerman = (navigator.languages || [navigator.language || ""]).some((l) => /^de\b/i.test(l));
    const EMAIL_FORM = {
        url: prefersGerman
            ? "https://forms.zohopublic.eu/davidna1/form/QuizresultsGerman/formperma/r6E414Mt8Ub4vmJCR9xdy2hqGNnJ7_NuILZX6ld3OVA"
            : "https://forms.zohopublic.eu/davidna1/form/Quizresults/formperma/BjFdOjMu20aMhjntPxX6RI-D7pXHJGSwF6WOy8BK5qs",
        // area names and the "all areas equal" texts as they appear in the email
        labels: prefersGerman
            ? { grammar: "Grammatik", vocabulary: "Wortschatz", communication: "Kommunikation", reading: "Leseverstehen",
                balancedStrength: "Ausgeglichen in allen Bereichen", balancedFocus: "Üben in echten beruflichen Situationen" }
            : { grammar: "Grammar", vocabulary: "Business Vocabulary", communication: "Business Communication", reading: "Reading",
                balancedStrength: "Balanced across all areas", balancedFocus: "Practice in real workplace situations" },
        params: {
            score: "SingleLine",
            level: "SingleLine1",
            grammar: "SingleLine2",
            vocabulary: "SingleLine3",
            communication: "SingleLine4",
            reading: "SingleLine5",
            strength: "SingleLine6",
            focus: "SingleLine7",
        },
    };

    const CATEGORIES = {
        grammar: {
            name: "Grammar",
            strength: "You demonstrated a solid understanding of the grammatical structures used in professional communication.",
            focus: "Targeted practice of key structures – such as tenses, conditionals and reported speech – could help you express yourself more precisely and confidently.",
            topics: ["Tenses in professional contexts (e.g. present perfect)", "Conditionals for plans and scenarios", "Prepositions in deadlines and schedules"],
        },
        vocabulary: {
            name: "Business Vocabulary",
            strength: "You know a wide range of business vocabulary and can use it correctly in context.",
            focus: "Building your business vocabulary step by step could help you follow discussions more easily and express ideas more precisely.",
            topics: ["Core business terms (budget, revenue, stakeholders)", "Meeting vocabulary (agenda, minutes, follow-up)", "Avoiding German false friends"],
        },
        communication: {
            name: "Business Communication",
            strength: "You choose natural, polite phrasing in professional situations – an important skill in international teams.",
            focus: "Your answers suggest that practicing natural and diplomatic ways of expressing opinions, disagreeing and making suggestions could help you communicate more confidently.",
            topics: ["Expressing opinions", "Disagreeing professionally", "Making suggestions and requests", "Natural workplace expressions"],
        },
        reading: {
            name: "Reading",
            strength: "You understand professional emails and messages well, including their tone and what is implied.",
            focus: "Practicing with real workplace emails and messages could help you understand key information, tone and implied meaning more quickly.",
            topics: ["Understanding emails quickly", "Recognising tone and intention", "Idiomatic workplace expressions"],
        },
    };

    // Indicative thresholds – not a validated CEFR conversion.
    const LEVELS = [
        { min: 90, code: "C1+", name: "Advanced" },
        { min: 70, code: "C1", name: "Advanced" },
        { min: 45, code: "B2", name: "Upper-Intermediate" },
        { min: 25, code: "B1", name: "Intermediate" },
        { min: 0, code: "A2", name: "Elementary or below" },
    ];

    // Each attempt draws 12 questions: per area one B2, one B2+ and one C1 question, so every attempt
    // is equally hard. Reading is drawn as a whole set (texts + their 3 questions).
    const POOLS = {
        grammar: [[4, 5, 6], [7, 31, 32], [8, 33, 34]],
        vocabulary: [[11, 12, 13], [14, 35, 36], [15, 37, 38]],
        communication: [[19, 20, 21], [22, 39, 40], [23, 41, 42]],
    };
    const READING_SETS = [[28, 29, 30], [43, 44, 45], [46, 47, 48]];

    const STORAGE_KEY = "nawee-assessment-v4";
    const LAST_KEY = "nawee-assessment-last"; // question ids of the previous attempt (avoided on a retake)
    const byId = (id) => ASSESSMENT_QUESTIONS.find((q) => q.id === id);
    const total = 12;
    let questions = [];

    // ---------- state ----------
    let state = null; // { index, answers: {questionId: optionIndex}, order: {questionId: [optionIndexes]}, finished }

    const store = {
        load() {
            try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch { return null; }
        },
        save() {
            try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable: ignore */ }
        },
        clear() {
            try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        },
    };

    const shuffled = (n) => {
        const a = [...Array(n).keys()];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    // random pick that prefers items not used in the previous attempt
    const pick = (items, avoid) => {
        const fresh = items.filter((x) => !avoid(x));
        const from = fresh.length ? fresh : items;
        return from[Math.floor(Math.random() * from.length)];
    };

    const drawQuestionIds = () => {
        let last = [];
        try { last = JSON.parse(sessionStorage.getItem(LAST_KEY)) || []; } catch { /* ignore */ }
        const ids = [];
        Object.values(POOLS).forEach((levels) => levels.forEach((pool) => ids.push(pick(pool, (id) => last.includes(id)))));
        ids.push(...pick(READING_SETS, (set) => set.some((id) => last.includes(id))));
        return ids;
    };

    const newState = () => {
        const ids = drawQuestionIds();
        questions = ids.map(byId);
        return {
            index: 0,
            ids,
            answers: {},
            order: Object.fromEntries(questions.map((q) => [q.id, shuffled(q.options.length)])),
            finished: false,
        };
    };

    // ---------- DOM helpers ----------
    const $ = (sel) => root.querySelector(sel);
    const screens = root.querySelectorAll("[data-screen]");
    const show = (name) => {
        screens.forEach((s) => { s.hidden = s.dataset.screen !== name; });
        root.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const el = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    };

    // ---------- question screen ----------
    const renderQuestion = () => {
        const q = questions[state.index];
        $("[data-counter]").textContent = `Question ${state.index + 1} of ${total}`;
        $("[data-category]").textContent = CATEGORIES[q.category].name;
        const bar = root.querySelector(".as-progress");
        bar.setAttribute("aria-valuenow", String(state.index + 1));
        $("[data-progress-bar]").style.width = `${((state.index + 1) / total) * 100}%`;

        const passage = $("[data-passage]");
        if (q.passage) {
            passage.textContent = ASSESSMENT_PASSAGES[q.passage];
            passage.hidden = false;
        } else {
            passage.hidden = true;
        }

        $("[data-question-text]").textContent = q.question;
        const box = $("[data-options]");
        box.replaceChildren();
        state.order[q.id].forEach((optIndex, pos) => {
            const id = `q${q.id}-o${optIndex}`;
            const label = el("label", "as-option");
            label.htmlFor = id;
            const input = el("input");
            input.type = "radio";
            input.name = `q${q.id}`;
            input.id = id;
            input.value = String(optIndex);
            input.checked = state.answers[q.id] === optIndex;
            input.addEventListener("change", () => {
                state.answers[q.id] = optIndex;
                store.save();
                updateNav();
            });
            label.append(input, el("span", "as-option-letter", "ABCD"[pos]), el("span", "as-option-text", q.options[optIndex]));
            box.append(label);
        });
        updateNav();
    };

    const updateNav = () => {
        const q = questions[state.index];
        const prev = $('[data-action="prev"]');
        const next = $('[data-action="next"]');
        prev.disabled = state.index === 0;
        next.disabled = state.answers[q.id] === undefined;
        next.innerHTML = state.index === total - 1 ? "See my result <span aria-hidden=\"true\">→</span>" : "Next <span aria-hidden=\"true\">→</span>";
    };

    // ---------- scoring ----------
    const score = () => {
        const per = {};
        Object.keys(CATEGORIES).forEach((c) => { per[c] = { got: 0, max: 0 }; });
        let got = 0, max = 0;
        questions.forEach((q) => {
            const pts = q.points || 1;
            per[q.category].max += pts;
            max += pts;
            if (state.answers[q.id] === q.correctAnswer) {
                per[q.category].got += pts;
                got += pts;
            }
        });
        const overall = Math.round((got / max) * 100);
        const percents = Object.fromEntries(Object.entries(per).map(([c, v]) => [c, Math.round((v.got / v.max) * 100)]));
        const level = LEVELS.find((l) => overall >= l.min);
        const order = Object.keys(CATEGORIES); // tie-break: category order
        const strength = order.reduce((a, b) => (percents[b] > percents[a] ? b : a));
        const focus = order.reduce((a, b) => (percents[b] < percents[a] ? b : a));
        return { overall, percents, level, strength, focus };
    };

    // ---------- result screen ----------
    const renderResult = () => {
        const r = score();
        $("[data-score]").textContent = String(r.overall);
        $("[data-level]").textContent = `${r.level.code} — ${r.level.name}`;

        const bars = $("[data-bars]");
        bars.replaceChildren();
        Object.entries(CATEGORIES).forEach(([c, info]) => {
            const row = el("div", "as-bar");
            const head = el("div", "as-bar-head");
            head.append(el("span", "", info.name), el("strong", "", `${r.percents[c]}%`));
            const track = el("div", "as-bar-track");
            track.setAttribute("role", "img");
            track.setAttribute("aria-label", `${info.name}: ${r.percents[c]} percent`);
            const fill = el("span");
            fill.style.width = `${r.percents[c]}%`;
            track.append(fill);
            row.append(head, track);
            bars.append(row);
        });

        $("[data-strength-title]").textContent = CATEGORIES[r.strength].name;
        $("[data-strength-text]").textContent = CATEGORIES[r.strength].strength;
        $("[data-focus-title]").textContent = CATEGORIES[r.focus].name;
        $("[data-focus-text]").textContent = r.strength === r.focus
            ? "Your results are very balanced across all areas. Targeted practice in real workplace situations is the best next step."
            : CATEGORIES[r.focus].focus;
        const list = $("[data-focus-list]");
        list.replaceChildren(...CATEGORIES[r.focus].topics.map((t) => el("li", "", t)));

        // email report (Zoho prefill)
        const emailBox = $("[data-email-box]");
        if (EMAIL_FORM.url) {
            const values = {
                score: `${r.overall}/100`, level: r.level.code,
                grammar: `${r.percents.grammar}%`, vocabulary: `${r.percents.vocabulary}%`,
                communication: `${r.percents.communication}%`, reading: `${r.percents.reading}%`,
                strength: EMAIL_FORM.labels[r.strength], focus: EMAIL_FORM.labels[r.focus],
            };
            if (r.strength === r.focus) { // all areas equal
                values.strength = EMAIL_FORM.labels.balancedStrength;
                values.focus = EMAIL_FORM.labels.balancedFocus;
            }
            const url = new URL(EMAIL_FORM.url);
            Object.entries(EMAIL_FORM.params).forEach(([k, field]) => url.searchParams.set(field, values[k]));
            $("[data-email-link]").href = url.href;
            emailBox.hidden = false;
        } else {
            emailBox.hidden = true;
        }

        // answer review
        const review = $("[data-review]");
        review.replaceChildren();
        questions.forEach((q, i) => {
            const given = state.answers[q.id];
            const ok = given === q.correctAnswer;
            const item = el("div", `as-review-item ${ok ? "is-correct" : "is-wrong"}`);
            item.append(el("p", "as-review-q", `${i + 1}. ${q.question}`));
            item.append(el("p", "as-review-a", `${ok ? "✓" : "✗"} Your answer: ${given === undefined ? "—" : q.options[given]}`));
            if (!ok) item.append(el("p", "as-review-a", `Best answer: ${q.options[q.correctAnswer]}`));
            item.append(el("p", "as-review-exp", q.explanation));
            review.append(item);
        });
    };

    // ---------- actions ----------
    const start = (fresh) => {
        if (fresh || !state) state = newState();
        store.save();
        if (state.finished) { renderResult(); show("result"); return; }
        renderQuestion();
        show("question");
    };

    root.addEventListener("click", (event) => {
        const action = event.target.closest("[data-action]")?.dataset.action;
        if (!action) return;
        if (action === "start") start(true);
        if (action === "resume") start(false);
        if (action === "prev" && state.index > 0) { state.index--; store.save(); renderQuestion(); }
        if (action === "next") {
            if (state.index < total - 1) { state.index++; store.save(); renderQuestion(); }
            else {
                state.finished = true;
                store.save();
                try { sessionStorage.setItem(LAST_KEY, JSON.stringify(state.ids)); } catch { /* ignore */ }
                renderResult();
                show("result");
            }
        }
        if (action === "restart") { store.clear(); state = null; show("start"); $('[data-action="resume"]').hidden = true; }
    });

    // keyboard: Enter on a chosen answer moves on
    root.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.matches(".as-option input")) {
            const next = $('[data-action="next"]');
            if (!next.disabled) next.click();
        }
    });

    // warn before leaving in the middle of the test
    window.addEventListener("beforeunload", (event) => {
        if (state && !state.finished && Object.keys(state.answers).length > 0) {
            event.preventDefault();
            event.returnValue = "";
        }
    });

    // resume an unfinished assessment (e.g. after reloading the page)
    const saved = store.load();
    if (saved && saved.ids && Object.keys(saved.answers || {}).length > 0) {
        state = saved;
        questions = saved.ids.map(byId);
        $('[data-action="resume"]').hidden = false;
    }
})();
