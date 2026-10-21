// Nawee English Communication Check – a self-assessment, not a language test.
// Used by communication-check.html (English) and kommunikations-check.html (German);
// the language is taken from <html lang="…">.
// Each answer scores 2 / 1 / 0 (options are listed from strongest to weakest).
// Nothing is stored or sent anywhere; the result is calculated in the browser.

(() => {
    const root = document.querySelector("[data-check]");
    if (!root) return;

    // ---------- content ----------
    const CONTENT = {
        en: {
            areas: {
                expression: {
                    name: "Expressing yourself",
                    profileStrong: "Clear and articulate",
                    profileWeak: "still searching for the right words",
                    strength: "You can usually put your thoughts into words and explain what you mean – even when you don't know every word.",
                    focus: "Your answers suggest that finding the right words and structuring your thoughts on the spot could be easier. This improves quickly with regular, guided speaking practice.",
                    tips: ["Explaining ideas in simple, clear steps", "Paraphrasing when you don't know a word", "Useful phrases to structure what you say"],
                },
                conversation: {
                    name: "Conversation",
                    profileStrong: "Natural in conversation",
                    profileWeak: "conversations still take effort",
                    strength: "You follow conversations well and can react naturally – a big advantage in meetings, calls and everyday situations.",
                    focus: "Your answers suggest that following fast speech, reacting spontaneously and keeping small talk going could feel more natural with practice.",
                    tips: ["Small talk and networking phrases", "Reacting to unexpected questions", "Listening to natural, everyday English"],
                },
                professional: {
                    name: "Professional English",
                    profileStrong: "Solid in professional situations",
                    profileWeak: "work situations feel challenging",
                    strength: "You handle workplace situations such as updates, calls and discussions with confidence.",
                    focus: "Your answers suggest that typical work situations – updates, calls and disagreeing politely – could become much easier with targeted practice.",
                    tips: ["Giving short, structured updates", "Disagreeing diplomatically", "Phone and video calls in English"],
                },
                confidence: {
                    name: "Speaking confidence",
                    profileStrong: "Confident speaker",
                    profileWeak: "holding back more than you need to",
                    strength: "You speak up without overthinking every sentence – mistakes don't stop you from getting your message across.",
                    focus: "Your answers suggest that you may know more English than you show. Building confidence in a safe setting can help you speak up more often.",
                    tips: ["Speaking practice in a relaxed setting", "Focusing on your message, not on mistakes", "Preparing for meetings and presentations"],
                },
            },
            questions: [
                { area: "expression", question: "How easily can you express an idea when you already know what you want to say?", options: ["Very easily", "Usually, with some pauses", "I often struggle to find the words"] },
                { area: "expression", question: "What happens when you don't know the exact word you need?", options: ["I explain it another way", "I hesitate, but usually manage", "I often lose my train of thought"] },
                { area: "expression", question: "How well can you organize your thoughts when speaking?", options: ["Clearly and concisely", "People understand me, but I sometimes ramble", "I struggle to explain things clearly"] },
                { area: "conversation", question: "How well can you follow native speakers talking at normal speed?", options: ["I follow almost everything", "I get the main points", "I often lose track"] },
                { area: "conversation", question: "How do you handle small talk, for example before a meeting or at an event?", options: ["I enjoy it and keep it going", "I manage the basics, then run out of things to say", "I try to avoid it"] },
                { area: "conversation", question: "When someone asks you an unexpected question, how do you respond?", options: ["Naturally and without much thinking", "I need a moment, but I get there", "I often freeze or keep my answer very short"] },
                { area: "professional", question: "How comfortable are you giving a short project update in English?", options: ["Very comfortable", "Okay, if I can prepare", "Uncomfortable, even with preparation"] },
                { area: "professional", question: "How do you disagree with someone in English at work?", options: ["Politely and clearly", "I try, but it may sound too direct or too vague", "I usually keep quiet"] },
                { area: "professional", question: "How do you feel about phone or video calls in English?", options: ["Comfortable", "Fine, but harder than face-to-face", "I avoid them when I can"] },
                { area: "confidence", question: "How do you feel when speaking English in a meeting or group?", options: ["Comfortable contributing", "I speak, but sometimes hold back", "I often avoid speaking"] },
                { area: "confidence", question: "How much do you worry about making mistakes while speaking?", options: ["Hardly at all", "Sometimes – it slows me down", "A lot – it stops me from speaking"] },
                { area: "confidence", question: "After speaking English, how do you usually feel?", options: ["Fine – I got my message across", "Okay, but I replay what I could have said better", "Relieved that it's over"] },
            ],
            ui: {
                counter: (i, n) => `Question ${i} of ${n}`,
                next: "Next",
                last: "See my profile",
                levels: ["Strong", "Solid", "Room to grow"],
                mixedTitle: (strong, weak) => `${strong} – but ${weak}`,
                mixedText: (strong, weak) => `Your strongest area is ${strong.toLowerCase()}, while ${weak.toLowerCase()} is where practice could make the biggest difference.`,
                confident: {
                    title: "Confident communicator",
                    text: "You feel comfortable using English in most situations. The next step is fine-tuning: more precise, more natural and more persuasive English for the situations that matter most to you.",
                },
                building: {
                    title: "Ready to build your confidence",
                    text: "Speaking English still takes a lot of effort for you – that is very common and a great starting point. With regular, practical speaking practice, most people notice progress quickly.",
                },
                balanced: {
                    title: "Solid foundation, ready for the next step",
                    text: "Your answers are well balanced across all areas. Practicing real situations from your daily life is the best way to make your English feel more natural and effortless.",
                },
                even: {
                    strengthTitle: "A balanced profile",
                    strengthText: "Your answers are very even across all four areas – there is no single area holding you back.",
                    focusTitle: "Practicing your real situations",
                    focusText: "The best next step is practicing the situations that matter most to you – at work or in everyday life.",
                    tips: ["Role plays based on your own work situations", "Natural phrases for meetings, calls and small talk", "Feedback on how you come across"],
                },
            },
        },
        de: {
            areas: {
                expression: {
                    name: "Sich ausdrücken",
                    profileStrong: "Klar im Ausdruck",
                    profileWeak: "die richtigen Worte fehlen dir noch manchmal",
                    strength: "Du kannst deine Gedanken meist gut in Worte fassen und erklären, was du meinst – auch wenn dir nicht jedes Wort einfällt.",
                    focus: "Deine Antworten zeigen, dass es dir leichter fallen könnte, spontan die richtigen Worte zu finden und deine Gedanken zu ordnen. Mit regelmäßiger, angeleiteter Sprechpraxis geht das schnell.",
                    tips: ["Ideen einfach und klar erklären", "Umschreiben, wenn dir ein Wort fehlt", "Nützliche Wendungen, um deine Gedanken zu strukturieren"],
                },
                conversation: {
                    name: "Gespräche führen",
                    profileStrong: "Natürlich im Gespräch",
                    profileWeak: "Gespräche kosten dich noch Mühe",
                    strength: "Du kannst Gesprächen gut folgen und natürlich reagieren – ein großer Vorteil in Meetings, Calls und im Alltag.",
                    focus: "Deine Antworten zeigen, dass schnelles Englisch verstehen, spontan reagieren und Small Talk mit etwas Übung natürlicher werden könnten.",
                    tips: ["Small Talk und Networking", "Auf unerwartete Fragen reagieren", "Natürliches Alltagsenglisch verstehen"],
                },
                professional: {
                    name: "Englisch im Beruf",
                    profileStrong: "Sicher im Beruf",
                    profileWeak: "berufliche Situationen fallen dir noch schwer",
                    strength: "Du bewegst dich sicher in beruflichen Situationen wie Updates, Calls und Diskussionen.",
                    focus: "Deine Antworten zeigen, dass typische Situationen im Job – Updates, Calls und höflich widersprechen – mit gezielter Übung deutlich leichter werden könnten.",
                    tips: ["Kurze, strukturierte Updates geben", "Diplomatisch widersprechen", "Telefonate und Videocalls auf Englisch"],
                },
                confidence: {
                    name: "Sprechsicherheit",
                    profileStrong: "Selbstbewusst beim Sprechen",
                    profileWeak: "du hältst dich mehr zurück als nötig",
                    strength: "Du sprichst, ohne jeden Satz zu zerdenken – Fehler halten dich nicht davon ab, deine Botschaft rüberzubringen.",
                    focus: "Deine Antworten zeigen, dass du vielleicht mehr Englisch kannst, als du zeigst. In einem geschützten Rahmen Sicherheit aufzubauen, kann dir helfen, öfter das Wort zu ergreifen.",
                    tips: ["Sprechpraxis in entspannter Atmosphäre", "Auf deine Botschaft achten statt auf Fehler", "Vorbereitung auf Meetings und Präsentationen"],
                },
            },
            questions: [
                { area: "expression", question: "Wie leicht fällt es dir, eine Idee auszudrücken, wenn du schon weißt, was du sagen willst?", options: ["Sehr leicht", "Meistens, mit ein paar Pausen", "Mir fehlen oft die Worte"] },
                { area: "expression", question: "Was passiert, wenn dir das genaue Wort fehlt?", options: ["Ich umschreibe es", "Ich zögere, komme aber meistens zurecht", "Ich verliere oft den Faden"] },
                { area: "expression", question: "Wie gut kannst du deine Gedanken beim Sprechen ordnen?", options: ["Klar und auf den Punkt", "Man versteht mich, aber ich schweife manchmal ab", "Es fällt mir schwer, Dinge klar zu erklären"] },
                { area: "conversation", question: "Wie gut verstehst du Muttersprachler, wenn sie in normalem Tempo sprechen?", options: ["Ich verstehe fast alles", "Ich verstehe das Wichtigste", "Ich komme oft nicht mit"] },
                { area: "conversation", question: "Wie gehst du mit Small Talk um, zum Beispiel vor einem Meeting oder auf einer Veranstaltung?", options: ["Ich mag es und halte das Gespräch am Laufen", "Die Basics klappen, dann gehen mir die Themen aus", "Ich versuche, ihn zu vermeiden"] },
                { area: "conversation", question: "Wie reagierst du, wenn dir jemand eine unerwartete Frage stellt?", options: ["Natürlich und ohne lange nachzudenken", "Ich brauche einen Moment, aber dann klappt es", "Ich bin oft blockiert oder antworte sehr knapp"] },
                { area: "professional", question: "Wie wohl fühlst du dich dabei, ein kurzes Projekt-Update auf Englisch zu geben?", options: ["Sehr wohl", "Okay, wenn ich mich vorbereiten kann", "Unwohl, selbst mit Vorbereitung"] },
                { area: "professional", question: "Wie widersprichst du jemandem im Job auf Englisch?", options: ["Höflich und klar", "Ich versuche es, aber es klingt vielleicht zu direkt oder zu vage", "Meistens sage ich lieber nichts"] },
                { area: "professional", question: "Wie geht es dir mit Telefonaten oder Videocalls auf Englisch?", options: ["Gut", "Okay, aber schwerer als im persönlichen Gespräch", "Ich vermeide sie, wenn ich kann"] },
                { area: "confidence", question: "Wie fühlst du dich, wenn du in einem Meeting oder einer Gruppe Englisch sprichst?", options: ["Ich bringe mich gern ein", "Ich spreche, halte mich aber manchmal zurück", "Ich vermeide es oft zu sprechen"] },
                { area: "confidence", question: "Wie sehr machst du dir beim Sprechen Sorgen, Fehler zu machen?", options: ["Kaum", "Manchmal – es bremst mich", "Sehr – es hält mich vom Sprechen ab"] },
                { area: "confidence", question: "Wie fühlst du dich normalerweise, nachdem du Englisch gesprochen hast?", options: ["Gut – meine Botschaft ist angekommen", "Okay, aber ich denke darüber nach, was ich besser hätte sagen können", "Erleichtert, dass es vorbei ist"] },
            ],
            ui: {
                counter: (i, n) => `Frage ${i} von ${n}`,
                next: "Weiter",
                last: "Zu meinem Profil",
                levels: ["Stark", "Solide", "Ausbaufähig"],
                mixedTitle: (strong, weak) => `${strong} – aber ${weak}`,
                mixedText: (strong, weak) => `Deine größte Stärke liegt im Bereich „${strong}“. Im Bereich „${weak}“ könnte Übung den größten Unterschied machen.`,
                confident: {
                    title: "Selbstbewusst auf Englisch",
                    text: "Du fühlst dich in den meisten Situationen sicher auf Englisch. Der nächste Schritt ist der Feinschliff: präziseres, natürlicheres und überzeugenderes Englisch für die Situationen, die dir am wichtigsten sind.",
                },
                building: {
                    title: "Bereit, Sicherheit aufzubauen",
                    text: "Englisch zu sprechen kostet dich noch viel Kraft – das geht vielen so und ist ein guter Ausgangspunkt. Mit regelmäßiger, praxisnaher Sprechpraxis merken die meisten schnell Fortschritte.",
                },
                balanced: {
                    title: "Solide Basis, bereit für den nächsten Schritt",
                    text: "Deine Antworten sind in allen Bereichen ausgeglichen. Am besten übst du echte Situationen aus deinem Alltag – so fühlt sich dein Englisch natürlicher und leichter an.",
                },
                even: {
                    strengthTitle: "Ein ausgeglichenes Profil",
                    strengthText: "Deine Antworten sind in allen vier Bereichen sehr ähnlich – es gibt keinen einzelnen Bereich, der dich bremst.",
                    focusTitle: "Deine echten Situationen üben",
                    focusText: "Der beste nächste Schritt: die Situationen üben, die dir am wichtigsten sind – im Job oder im Alltag.",
                    tips: ["Rollenspiele zu deinen eigenen Arbeitssituationen", "Natürliche Wendungen für Meetings, Calls und Small Talk", "Feedback dazu, wie du wirkst"],
                },
            },
        },
    };

    const { areas: AREAS, questions: QUESTIONS, ui: UI } = CONTENT[document.documentElement.lang === "de" ? "de" : "en"];

    const total = QUESTIONS.length;
    let index = 0;
    let answers = []; // answers[i] = chosen option index (0 = strongest)

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
        const q = QUESTIONS[index];
        $("[data-counter]").textContent = UI.counter(index + 1, total);
        $("[data-category]").textContent = AREAS[q.area].name;
        root.querySelector(".as-progress").setAttribute("aria-valuenow", String(index + 1));
        $("[data-progress-bar]").style.width = `${((index + 1) / total) * 100}%`;
        $("[data-question-text]").textContent = q.question;

        const box = $("[data-options]");
        box.replaceChildren();
        q.options.forEach((text, i) => {
            const id = `cc${index}-o${i}`;
            const label = el("label", "as-option");
            label.htmlFor = id;
            const input = el("input");
            input.type = "radio";
            input.name = `cc${index}`;
            input.id = id;
            input.checked = answers[index] === i;
            input.addEventListener("change", () => { answers[index] = i; updateNav(); });
            label.append(input, el("span", "as-option-letter", "ABC"[i]), el("span", "as-option-text", text));
            box.append(label);
        });
        updateNav();
    };

    const updateNav = () => {
        $('[data-action="prev"]').disabled = index === 0;
        const next = $('[data-action="next"]');
        next.disabled = answers[index] === undefined;
        next.innerHTML = `${index === total - 1 ? UI.last : UI.next} <span aria-hidden="true">→</span>`;
    };

    // ---------- scoring ----------
    const score = () => {
        const per = {};
        Object.keys(AREAS).forEach((a) => { per[a] = { got: 0, max: 0 }; });
        QUESTIONS.forEach((q, i) => {
            per[q.area].max += 2;
            per[q.area].got += 2 - answers[i];
        });
        const percents = Object.fromEntries(Object.entries(per).map(([a, v]) => [a, Math.round((v.got / v.max) * 100)]));
        const order = Object.keys(AREAS); // tie-break: area order
        const strength = order.reduce((a, b) => (percents[b] > percents[a] ? b : a));
        const focus = order.reduce((a, b) => (percents[b] < percents[a] ? b : a));
        const values = Object.values(percents);
        return { percents, strength, focus, min: Math.min(...values), max: Math.max(...values) };
    };

    const label = (p) => UI.levels[p >= 80 ? 0 : p >= 50 ? 1 : 2];

    const profile = (r) => {
        if (r.min >= 80) return UI.confident;
        if (r.max < 50) return UI.building;
        if (r.max - r.min < 20) return UI.balanced;
        return {
            title: UI.mixedTitle(AREAS[r.strength].profileStrong, AREAS[r.focus].profileWeak),
            text: UI.mixedText(AREAS[r.strength].name, AREAS[r.focus].name),
        };
    };

    // ---------- result screen ----------
    const renderResult = () => {
        window.NaweeTrophies?.record("commCheck");
        const r = score();
        const p = profile(r);
        $("[data-profile-title]").textContent = p.title;
        $("[data-profile-text]").textContent = p.text;

        const bars = $("[data-bars]");
        bars.replaceChildren();
        Object.entries(AREAS).forEach(([a, info]) => {
            const row = el("div", "as-bar");
            const head = el("div", "as-bar-head");
            head.append(el("span", "", info.name), el("strong", "", label(r.percents[a])));
            const track = el("div", "as-bar-track");
            track.setAttribute("role", "img");
            track.setAttribute("aria-label", `${info.name}: ${label(r.percents[a])}`);
            const fill = el("span");
            fill.style.width = `${Math.max(r.percents[a], 4)}%`;
            track.append(fill);
            row.append(head, track);
            bars.append(row);
        });

        // all areas equal: no single strength or focus area to name
        const even = r.strength === r.focus;
        $("[data-strength-title]").textContent = even ? UI.even.strengthTitle : AREAS[r.strength].name;
        $("[data-strength-text]").textContent = even ? UI.even.strengthText : AREAS[r.strength].strength;
        $("[data-focus-title]").textContent = even ? UI.even.focusTitle : AREAS[r.focus].name;
        $("[data-focus-text]").textContent = even ? UI.even.focusText : AREAS[r.focus].focus;
        const tips = even ? UI.even.tips : AREAS[r.focus].tips;
        $("[data-focus-list]").replaceChildren(...tips.map((t) => el("li", "", t)));
    };

    // ---------- actions ----------
    root.addEventListener("click", (event) => {
        const action = event.target.closest("[data-action]")?.dataset.action;
        if (!action) return;
        if (action === "start") { index = 0; answers = []; renderQuestion(); show("question"); }
        if (action === "prev" && index > 0) { index--; renderQuestion(); }
        if (action === "next") {
            if (index < total - 1) { index++; renderQuestion(); }
            else { renderResult(); show("result"); }
        }
        if (action === "restart") show("start");
    });

    // keyboard: Enter on a chosen answer moves on
    root.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.matches(".as-option input")) {
            const next = $('[data-action="next"]');
            if (!next.disabled) next.click();
        }
    });
})();
