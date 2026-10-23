// Listening & speaking lessons ("English from the start", A1): work-lesson.html / beruf-lektion.html.
// Audio: a recorded file if the line has one, otherwise the browser voice. Recordings of the learner's
// voice stay in this browser tab (nothing is uploaded or saved). Progress: localStorage only.

(() => {
    const root = document.querySelector("[data-speak-lesson]");
    if (!root) return;

    const lang = document.documentElement.lang === "en" ? "en" : "de";
    const L = (v) => (v && typeof v === "object" ? v[lang] : v) || "";
    const KEY = "nawee-work-course-v1";
    const T = lang === "de" ? {
        back: "← Dein Lernweg", backHref: "fuer-mich.html", course: "ENGLISCH VON ANFANG AN · A1", lesson: "LEKTION",
        goal: "Ziel", steps: ["Hören", "Verstehen", "Nachsprechen", "Laute", "Antworten", "Rollenspiel"],
        playAll: "Gespräch anhören", stop: "Stopp", showText: "Text anzeigen", hideText: "Text ausblenden",
        play: "Anhören", slow: "Langsam", record: "Aufnehmen", stopRec: "Stopp", mine: "Meine Aufnahme",
        right: "Richtig!", wrong: "Nicht ganz – hör noch einmal hin.", question: "Frage", listenQ: "Frage anhören",
        which: "Welches Wort hörst du?", again: "Nochmal", soundScore: (r, t) => `${r} von ${t} richtig`,
        model: "Musterantwort zeigen", yourTurn: "Du bist dran", next: "Weiter", start: "Rollenspiel starten",
        restart: "Nochmal von vorn", mission: "Deine Mission", complete: "Lektion abschließen", done: "✓ Lektion abgeschlossen – stark!",
        micNo: "Aufnehmen ist in diesem Browser nicht möglich – sprich trotzdem laut mit.",
        micDenied: "Kein Zugriff auf das Mikrofon. Du kannst es in den Browser-Einstellungen erlauben – oder einfach laut mitsprechen.",
        privacy: "Deine Aufnahmen bleiben auf deinem Gerät und werden nirgendwohin gesendet. Beim Schließen der Seite sind sie weg.",
        beta: "Beta – die Stimmen kommen vorerst vom Browser. Bald hörst du hier echte Aufnahmen.",
        recorded: "Alle Sätze gesprochen von David Nawee, Muttersprachler aus den USA.",
        nextLesson: "Nächste Lektion: in Arbeit", sayIt: "Sag es laut:",
    } : {
        back: "← Your learning path", backHref: "for-me.html", course: "ENGLISH FROM THE START · A1", lesson: "LESSON",
        goal: "Goal", steps: ["Listen", "Understand", "Repeat", "Sounds", "Respond", "Role-play"],
        playAll: "Play the conversation", stop: "Stop", showText: "Show text", hideText: "Hide text",
        play: "Listen", slow: "Slowly", record: "Record", stopRec: "Stop", mine: "My recording",
        right: "Correct!", wrong: "Not quite – listen again.", question: "Question", listenQ: "Play the question",
        which: "Which word do you hear?", again: "Again", soundScore: (r, t) => `${r} of ${t} correct`,
        model: "Show model answer", yourTurn: "Your turn", next: "Next", start: "Start the role-play",
        restart: "Start again", mission: "Your mission", complete: "Complete lesson", done: "✓ Lesson complete – great job!",
        micNo: "Recording isn’t possible in this browser – just speak out loud anyway.",
        micDenied: "No access to the microphone. You can allow it in your browser settings – or just speak out loud.",
        privacy: "Your recordings stay on your device and are never sent anywhere. They’re gone when you close the page.",
        beta: "Beta – the voices come from your browser for now. Real recordings are coming soon.",
        recorded: "All lines spoken by David Nawee, a native speaker from the US.",
        nextLesson: "Next lesson: in progress", sayIt: "Say it out loud:",
    };

    const id = new URLSearchParams(location.search).get("l") || "1-1";
    const preview = new URLSearchParams(location.search).has("preview");
    const lesson = WORK_LESSONS[id] && (!WORK_LESSONS[id].draft || preview) ? WORK_LESSONS[id] : null;
    const meta = WORK_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m }))).find((l) => l.id === id);
    if (!lesson || !meta) { root.innerHTML = `<h1>—</h1><p><a href="${T.backHref}">${T.back}</a></p>`; return; }
    document.title = `${L(meta.title)} | ${lang === "de" ? "Englisch von Anfang an" : "English from the start"} | Nawee`;

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
    const button = (cls, html, onClick) => { const b = el("button", `sl-btn ${cls}`, html); b.type = "button"; b.addEventListener("click", onClick); return b; };
    const ICON = { play: "▶", rec: "●", stop: "■", mine: "↺", slow: "🐢" };

    // ---------- audio: recorded file or browser voice ----------
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    let voices = [];
    const loadVoices = () => { voices = synth ? synth.getVoices().filter((v) => /^en(-|_)/i.test(v.lang)) : []; };
    if (synth) { loadVoices(); synth.addEventListener?.("voiceschanged", loadVoices); }
    const pickVoice = (key) => {
        const us = voices.filter((v) => /en.US/i.test(v.lang));
        const pool = us.length ? us : voices;
        const female = /samantha|allison|ava|susan|victoria|zira|jenny|aria|google us english|karen|moira|tessa/i;
        const male = /alex|daniel|fred|tom|aaron|david|guy|mark|google uk english male|rishi/i;
        const want = key === "a" ? female : male;
        const matches = pool.filter((v) => want.test(v.name));
        if (key === "c") return matches[1] || matches[0] || pool[2] || pool[0] || null; // a second male voice
        return matches[0] || pool[key === "b" ? 1 : 0] || pool[0] || null;
    };
    let currentAudio = null;
    const stopAudio = () => { synth?.cancel(); if (currentAudio) { currentAudio.pause(); currentAudio = null; } };
    const speak = (item, { voice = "a", rate = 0.95 } = {}) => new Promise((resolve) => {
        stopAudio();
        if (item.audio) {
            currentAudio = new Audio(item.audio);
            currentAudio.playbackRate = rate <= 0.75 ? 0.8 : 1; // recordings: only the "slowly" button slows down
            currentAudio.onended = resolve; currentAudio.onerror = resolve;
            currentAudio.play().catch(resolve);
            return;
        }
        if (!synth) { resolve(); return; }
        const u = new SpeechSynthesisUtterance(item.text || item.say || item);
        u.lang = "en-US";
        const v = pickVoice(voice);
        if (v) u.voice = v;
        u.rate = rate;
        u.pitch = voice === "c" && v === pickVoice("b") ? 1.15 : voice === "b" && v === pickVoice("a") ? 0.8 : 1; // same voice for both: make B a little deeper
        u.onend = resolve; u.onerror = resolve;
        synth.speak(u);
    });
    const playButton = (item, opts = {}, label = T.play) => button("sl-play", `<span aria-hidden="true">${ICON.play}</span> ${label}`, () => speak(item, opts));
    const slowButton = (item, opts = {}) => button("sl-slow", `<span aria-hidden="true">${ICON.slow}</span> ${T.slow}`, () => speak(item, { ...opts, rate: 0.7 }));

    // ---------- recording: stays in this tab ----------
    const canRecord = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    const recorderWidget = () => {
        const box = el("div", "sl-rec");
        if (!canRecord) { box.append(el("p", "sl-note", T.micNo)); return box; }
        let rec = null, chunks = [], url = null, stream = null;
        const mine = button("sl-mine", `<span aria-hidden="true">${ICON.mine}</span> ${T.mine}`, () => { stopAudio(); if (url) new Audio(url).play(); });
        mine.hidden = true;
        const recBtn = button("sl-record", `<span aria-hidden="true">${ICON.rec}</span> ${T.record}`, async () => {
            if (rec && rec.state === "recording") { rec.stop(); return; }
            stopAudio();
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch {
                box.querySelector(".sl-note")?.remove();
                box.append(el("p", "sl-note", T.micDenied));
                return;
            }
            chunks = [];
            rec = new MediaRecorder(stream);
            rec.ondataavailable = (e) => chunks.push(e.data);
            rec.onstop = () => {
                stream.getTracks().forEach((t) => t.stop());
                if (url) URL.revokeObjectURL(url);
                url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType }));
                recBtn.classList.remove("is-recording");
                recBtn.innerHTML = `<span aria-hidden="true">${ICON.rec}</span> ${T.record}`;
                mine.hidden = false;
            };
            rec.start();
            recBtn.classList.add("is-recording");
            recBtn.innerHTML = `<span aria-hidden="true">${ICON.stop}</span> ${T.stopRec}`;
        });
        box.append(recBtn, mine);
        return box;
    };

    // ---------- page ----------
    const progress = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || { completed: [] }; } catch { return { completed: [] }; } })();
    const section = (n, title) => {
        const s = el("section", "sl-section");
        s.append(el("h2", "sl-h", `<span class="sl-step">${n}</span> ${esc(title)}`));
        root.append(s);
        return s;
    };

    root.innerHTML = `<a class="lesson-back" href="${T.backHref}">${T.back}</a>
        <p class="eyebrow">${T.course} · ${T.lesson} ${id.replace("-", ".")}</p>
        <h1>${esc(L(meta.title))}</h1>
        <p class="lesson-goal"><strong>${T.goal}:</strong> ${esc(L(lesson.goal))}</p>
        <ol class="sl-steps">${T.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
        <p class="sl-note sl-beta">${lesson.recorded ? T.recorded : T.beta}</p>`;

    // 1. Listen
    {
        const s = section(1, T.steps[0]);
        s.append(el("p", "", esc(L(lesson.intro))));
        s.append(el("p", "sl-situation", esc(L(lesson.dialogue.situation))));
        const lines = el("ol", "sl-dialogue is-hidden-text");
        lesson.dialogue.lines.forEach((line) => {
            const li = el("li", `sl-line sl-voice-${line.voice}`);
            li.append(el("span", "sl-who", esc(line.who)), el("span", "sl-text", esc(line.text)), playButton(line, { voice: line.voice }, ""));
            lines.append(li);
        });
        let playing = false;
        const all = button("sl-play sl-big", `<span aria-hidden="true">${ICON.play}</span> ${T.playAll}`, async () => {
            if (playing) { playing = false; stopAudio(); return; }
            playing = true;
            all.innerHTML = `<span aria-hidden="true">${ICON.stop}</span> ${T.stop}`;
            for (const [i, line] of lesson.dialogue.lines.entries()) {
                if (!playing) break;
                lines.children[i].classList.add("is-playing");
                await speak(line, { voice: line.voice });
                lines.children[i].classList.remove("is-playing");
                await new Promise((r) => setTimeout(r, 350));
            }
            playing = false;
            all.innerHTML = `<span aria-hidden="true">${ICON.play}</span> ${T.playAll}`;
        });
        const toggle = button("sl-link", T.showText, () => {
            const hidden = lines.classList.toggle("is-hidden-text");
            toggle.textContent = hidden ? T.showText : T.hideText;
        });
        s.append(el("div", "sl-row"), lines);
        s.querySelector(".sl-row").append(all, toggle);
    }

    // 2. Understand
    {
        const s = section(2, T.steps[1]);
        lesson.listen.forEach((q, n) => {
            const card = el("div", "sl-card");
            card.append(el("p", "exercise-number", `${T.question} ${n + 1}`), playButton({ text: q.say, audio: q.audio }, {}, T.listenQ));
            const opts = el("div", "sl-options");
            const fb = el("p", "exercise-feedback"); fb.hidden = true;
            q.options.forEach((o, i) => {
                opts.append(button("sl-option", esc(o), (e) => {
                    const ok = i === q.answer;
                    e.currentTarget.classList.add(ok ? "is-right" : "is-wrong");
                    if (ok) opts.querySelectorAll("button").forEach((b) => { b.disabled = true; });
                    fb.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                    fb.innerHTML = ok ? `✓ ${T.right} ${esc(L(q.explain))}` : T.wrong;
                    fb.hidden = false;
                }));
            });
            card.append(opts, fb);
            s.append(card);
        });
    }

    // 3. Repeat
    {
        const s = section(3, T.steps[2]);
        s.append(el("p", "sl-note", T.privacy));
        const grid = el("div", "sl-phrases");
        lesson.phrases.forEach((p) => {
            const card = el("div", "sl-card sl-phrase");
            card.append(el("p", "sl-phrase-en", esc(p.text)));
            if (lang === "de") card.append(el("p", "sl-phrase-de", esc(p.de)));
            card.append(el("p", "sl-tip", esc(L(p.tip))));
            const row = el("div", "sl-row");
            row.append(playButton(p), slowButton(p), recorderWidget());
            card.append(row);
            grid.append(card);
        });
        s.append(grid);
    }

    // 4. Sounds
    {
        const s = section(4, `${T.steps[3]}: ${L(lesson.sounds.title)}`);
        s.append(el("p", "", esc(L(lesson.sounds.explain))));
        const pairs = el("div", "sl-pairs");
        lesson.sounds.pairs.forEach((pair) => {
            const row = el("div", "sl-pair");
            pair.forEach((w) => row.append(playButton({ text: w, audio: lesson.sounds.audio?.[w] }, { rate: 0.8 }, esc(w))));
            pairs.append(row);
        });
        s.append(pairs);
        // quick test: a random word from each pair
        const quiz = el("div", "sl-card");
        let round = 0, right = 0, target = null;
        const order = lesson.sounds.pairs.map((p) => p[Math.random() < 0.5 ? 0 : 1]);
        const status = el("p", "exercise-number");
        const opts = el("div", "sl-options");
        const fb = el("p", "exercise-feedback"); fb.hidden = true;
        const draw = () => {
            opts.replaceChildren(); fb.hidden = true;
            if (round >= order.length) {
                status.textContent = T.soundScore(right, order.length);
                opts.append(button("sl-play", T.again, () => { round = 0; right = 0; draw(); }));
                return;
            }
            target = order[round];
            status.textContent = `${T.which} (${round + 1}/${order.length})`;
            opts.append(playButton({ text: target, audio: lesson.sounds.audio?.[target] }, { rate: 0.8 }));
            lesson.sounds.pairs[round].forEach((w) => opts.append(button("sl-option", esc(w), () => {
                const ok = w === target;
                if (ok) right += 1;
                fb.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
                fb.textContent = ok ? `✓ ${T.right}` : `✗ „${target}“`;
                fb.hidden = false;
                opts.querySelectorAll(".sl-option").forEach((b) => { b.disabled = true; });
                setTimeout(() => { round += 1; draw(); }, 1100);
            })));
        };
        quiz.append(status, opts, fb);
        s.append(quiz);
        draw();
    }

    // 5. Respond
    {
        const s = section(5, T.steps[4]);
        lesson.respond.forEach((r, n) => {
            const card = el("div", "sl-card");
            card.append(el("p", "exercise-number", `${T.question} ${n + 1}`));
            const row = el("div", "sl-row");
            row.append(playButton({ text: r.say, audio: r.audio }, {}, T.listenQ), recorderWidget());
            const model = el("p", "exercise-feedback is-model"); model.hidden = true;
            model.innerHTML = `<em>„${esc(r.say)}“</em><br><strong>${esc(r.model)}</strong>`;
            const show = button("sl-link", T.model, () => { model.hidden = false; show.remove(); speak({ text: r.model.replace(/…/g, ""), audio: r.modelAudio }, { voice: "b" }); });
            card.append(row, show, model);
            s.append(card);
        });
    }

    // 6. Role-play
    {
        const s = section(6, T.steps[5]);
        s.append(el("p", "sl-situation", esc(L(lesson.roleplay.situation))));
        const stage = el("ol", "sl-roleplay");
        const ctrl = el("div", "sl-row");
        let step = -1;
        const advance = async () => {
            step += 1;
            if (step >= lesson.roleplay.turns.length) {
                ctrl.replaceChildren(button("sl-play", T.restart, () => { stage.replaceChildren(); step = -1; advance(); }));
                return;
            }
            const t = lesson.roleplay.turns[step];
            const li = el("li", t.you ? "sl-turn sl-turn-you" : `sl-turn sl-voice-${t.voice}`);
            if (t.you) {
                li.append(el("p", "sl-who", T.yourTurn), el("p", "", `${T.sayIt} <strong>${esc(L(t.you))}</strong>`), recorderWidget());
                const model = el("p", "sl-model", `→ ${esc(t.model)}`); model.hidden = true;
                li.append(button("sl-link", T.model, (e) => { model.hidden = false; e.currentTarget.remove(); }), model);
                stage.append(li);
                ctrl.replaceChildren(button("sl-play", `${T.next} →`, advance));
            } else {
                li.append(el("p", "sl-who", esc(lesson.roleplay.partner || "Sarah")), el("p", "sl-text-visible", esc(t.text)), playButton(t, { voice: t.voice }, ""));
                stage.append(li);
                ctrl.replaceChildren();
                await speak(t, { voice: t.voice });
                advance();
            }
        };
        ctrl.append(button("sl-play sl-big", `<span aria-hidden="true">${ICON.play}</span> ${T.start}`, advance));
        s.append(stage, ctrl);
    }

    // Mission + finish
    {
        const m = el("div", "lesson-mission");
        m.append(el("p", "lesson-mistake-label", T.mission), el("p", "", esc(L(lesson.mission))));
        root.append(m);
        const finish = el("div", "lesson-finish");
        const draw = () => {
            if (progress.completed.includes(id)) {
                const all = WORK_MODULES.flatMap((m) => m.lessons);
                const next = all[all.findIndex((l) => l.id === id) + 1];
                const nextLink = next && WORK_LESSONS[next.id] && !WORK_LESSONS[next.id].draft ? `<a class="button primary" href="?l=${next.id}">${T.next}: ${esc(L(next.title))} <span aria-hidden="true">→</span></a>` : "";
                finish.innerHTML = `<p class="lesson-done">${T.done}</p>${nextLink ? "" : `<p class="as-note">${T.nextLesson}</p>`}<div class="as-actions">${nextLink}<a class="button secondary" href="${T.backHref}">${T.back}</a></div>`;
                return;
            }
            finish.replaceChildren(button("button primary", `${T.complete} ✓`, () => {
                progress.completed.push(id);
                progress.dates = { ...(progress.dates || {}), [id]: new Date().toISOString().slice(0, 10) }; // for "today" on the account page
                try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* storage unavailable */ }
                draw();
            }));
        };
        draw();
        root.append(finish);
    }
})();
