// Job interview module (interview.html / vorstellungsgespraech.html / interview-tr.html): overview of the six lessons and
// one lesson – listen to an interview scene, understand it, practice the key phrases (🎤 check via speak-check.js),
// build an answer, answer the question yourself with a timer, compare with example answers, write your own answer.
// Recordings stay in this browser tab. Progress + notebook: localStorage "nawee-interview-v1"
// ({ completed: [ids], dates: { id: day }, notes: { key: { text, t } } }), synced with the account by account.js.

(() => {
    const root = document.querySelector("[data-interview]");
    if (!root || typeof INTERVIEW_LESSONS === "undefined") return;

    const lng = { de: "de", tr: "tr" }[(document.documentElement.lang || "en").slice(0, 2)] || "en";
    const L = (v) => (v && typeof v === "object" ? v[lng] || v.en : v) || "";
    const page = { de: "vorstellungsgespraech.html", tr: "interview-tr.html" }[lng] || "interview.html";
    const KEY = "nawee-interview-v1";
    const T = {
        de: {
            eyebrow: "BUSINESS ENGLISH · VORSTELLUNGSGESPRÄCH", title: "Vorstellungsgespräch auf Englisch",
            lead: "Sechs kurze Lektionen, die dich auf ein Jobinterview auf Englisch vorbereiten: echte Szenen anhören, die wichtigsten Sätze üben – und die Fragen selbst laut beantworten, mit Timer und Beispielantworten. Die Erklärungen sind auf Deutsch, geübt wird auf Englisch.",
            level: "B1 – C1 · ca. 15–20 Min. pro Lektion", start: "Lektion starten →", open: "Öffnen →", soon: "Bald", beta: "BETA", doneMark: "✓ Geschafft",
            back: "← Alle Interview-Lektionen", lesson: "LEKTION", goal: "Dein Ziel",
            steps: ["Hören", "Verstehen", "Die wichtigsten Sätze", "Antwort bauen", "Jetzt du", "Tipp", "Deine Mission"],
            playAll: "▶ Gespräch anhören", pause: "⏸ Pause", resume: "▶ Weiter", replay: "↻ Nochmal anhören", showText: "Text anzeigen", hideText: "Text ausblenden",
            listenFirst: "Hör erst zu – den Text kannst du danach einblenden.", right: "Richtig!", wrong: "Nicht ganz.",
            play: "▶ Anhören", check: "🎤 Prüfen", listening: "Ich höre zu …", checking: "Ich prüfe …", clear: "✓ Klar verständlich!", heard: (h) => `✗ Ich habe gehört: „${h}“`, missing: (m) => `Hör dir diese Wörter nochmal an: ${m}`, nothing: "Ich habe nichts gehört – sprich etwas lauter.", loading: (p) => `Aussprache-Check wird geladen (nur beim ersten Mal) … ${p} %`,
            buildAgain: "Von vorn", buildCheck: "Prüfen", buildEdit: "Tippe auf einen Satz, um ihn zurückzulegen – mit ↑ ↓ änderst du die Reihenfolge.", moveUp: "Nach oben", moveDown: "Nach unten", buildRight: "Richtig – genau so!", buildWrong: "Fast. So ist die Reihenfolge:",
            hearQ: "▶ Frage anhören", time: "Zeit:", sec: "Sek.", rec: "● Antwort aufnehmen", stopRec: "■ Fertig", mine: "▶ Meine Antwort anhören", replayMine: "↻ Meine Antwort nochmal anhören", spoke: (s) => `Du hast ${s} Sekunden gesprochen.`, overTime: "Die Zeit ist um – im echten Interview wäre jetzt ein guter Moment zum Abschluss.",
            selfCheck: "Check dich selbst:", models: "Beispielantworten", b1: "B1 – einfach und klar", b2: "B2–C1 – natürlicher",
            notebook: "📓 Mein Notizbuch: meine eigene Antwort", notePh: "Schreib hier deine eigene Antwort auf Englisch …", saved: "Gespeichert", noteHint: "Wird in diesem Browser gespeichert – mit Konto auch in deinem Konto.",
            micNo: "Aufnehmen geht in diesem Browser nicht – antworte trotzdem laut.", micDenied: "Kein Zugriff auf das Mikrofon. Erlaube es in den Browser-Einstellungen – oder antworte einfach laut.",
            complete: "✓ Lektion abschließen", completed: "✓ Lektion abgeschlossen – stark!", next: "Nächste Lektion: bald verfügbar",
            privacy: "Deine Aufnahmen bleiben auf deinem Gerät und werden nirgendwohin gesendet.", betaNote: "Beta – die Stimmen kommen vorerst vom Browser. Bald hörst du hier echte Aufnahmen von David.",
            lessons: "Die sechs Lektionen", cta: "Bald ein echtes Interview? Üb es mit David oder Omer – im persönlichen Englischunterricht.", ctaLink: "Zum Englischunterricht ↗",
        },
        en: {
            eyebrow: "BUSINESS ENGLISH · JOB INTERVIEW", title: "Job interviews in English",
            lead: "Six short lessons that get you ready for a job interview in English: listen to real scenes, practice the key phrases – and answer the questions out loud yourself, with a timer and example answers.",
            level: "B1 – C1 · about 15–20 min per lesson", start: "Start the lesson →", open: "Open →", soon: "Soon", beta: "BETA", doneMark: "✓ Done",
            back: "← All interview lessons", lesson: "LESSON", goal: "Your goal",
            steps: ["Listen", "Understand", "Key phrases", "Build the answer", "Your turn", "Tip", "Your mission"],
            playAll: "▶ Play the conversation", pause: "⏸ Pause", resume: "▶ Continue", replay: "↻ Listen again", showText: "Show text", hideText: "Hide text",
            listenFirst: "Listen first – you can show the text afterwards.", right: "Correct!", wrong: "Not quite.",
            play: "▶ Listen", check: "🎤 Check", listening: "Listening …", checking: "Checking …", clear: "✓ Clear!", heard: (h) => `✗ I heard: “${h}”`, missing: (m) => `Listen again to these words: ${m}`, nothing: "I couldn’t hear anything – speak a little louder.", loading: (p) => `Loading the pronunciation check (only the first time) … ${p} %`,
            buildAgain: "Start over", buildCheck: "Check", buildEdit: "Tap a sentence to put it back – use ↑ ↓ to change the order.", moveUp: "Move up", moveDown: "Move down", buildRight: "Correct – that’s it!", buildWrong: "Almost. This is the order:",
            hearQ: "▶ Hear the question", time: "Time:", sec: "sec", rec: "● Record my answer", stopRec: "■ Done", mine: "▶ Play my answer", replayMine: "↻ Play my answer again", spoke: (s) => `You spoke for ${s} seconds.`, overTime: "Time’s up – in a real interview, this would be a good moment to finish.",
            selfCheck: "Check yourself:", models: "Example answers", b1: "B1 – simple and clear", b2: "B2–C1 – more natural",
            notebook: "📓 My notebook: my own answer", notePh: "Write your own answer in English here …", saved: "Saved", noteHint: "Saved in this browser – and with an account, in your account too.",
            micNo: "This browser can’t record – answer out loud anyway.", micDenied: "No access to the microphone. Allow it in your browser settings – or just answer out loud.",
            complete: "✓ Complete the lesson", completed: "✓ Lesson completed – great work!", next: "Next lesson: coming soon",
            privacy: "Your recordings stay on your device and are not sent anywhere.", betaNote: "Beta – the voices come from your browser for now. Soon you’ll hear real recordings by David.",
            lessons: "The six lessons", cta: "Real interview coming up? Practice it with David or Omer in a one-on-one English lesson.", ctaLink: "See the English lessons ↗",
        },
        tr: {
            eyebrow: "İŞ İNGİLİZCESİ · İŞ GÖRÜŞMESİ", title: "İngilizce iş görüşmesi",
            lead: "Seni İngilizce bir iş görüşmesine hazırlayan altı kısa ders: gerçek sahneleri dinle, en önemli cümleleri çalış – ve soruları zamanlayıcı ve örnek cevaplarla kendin yüksek sesle cevapla. Açıklamalar Türkçe, alıştırmalar İngilizce.",
            level: "B1 – C1 · ders başına yaklaşık 15–20 dk", start: "Derse başla →", open: "Aç →", soon: "Yakında", beta: "BETA", doneMark: "✓ Tamamlandı",
            back: "← Tüm mülakat dersleri", lesson: "DERS", goal: "Hedefin",
            steps: ["Dinle", "Anla", "En önemli cümleler", "Cevabı kur", "Sıra sende", "İpucu", "Görevin"],
            playAll: "▶ Konuşmayı dinle", pause: "⏸ Duraklat", resume: "▶ Devam et", replay: "↻ Tekrar dinle", showText: "Metni göster", hideText: "Metni gizle",
            listenFirst: "Önce dinle – metni sonra gösterebilirsin.", right: "Doğru!", wrong: "Tam değil.",
            play: "▶ Dinle", check: "🎤 Kontrol et", listening: "Dinliyorum …", checking: "Kontrol ediliyor …", clear: "✓ Net anlaşılıyor!", heard: (h) => `✗ Duyduğum: “${h}”`, missing: (m) => `Bu kelimeleri tekrar dinle: ${m}`, nothing: "Hiçbir şey duyamadım – biraz daha yüksek sesle konuş.", loading: (p) => `Telaffuz kontrolü yükleniyor (sadece ilk seferde) … %${p}`,
            buildAgain: "Baştan başla", buildCheck: "Kontrol et", buildEdit: "Geri koymak için bir cümleye dokun – ↑ ↓ ile sırayı değiştir.", moveUp: "Yukarı taşı", moveDown: "Aşağı taşı", buildRight: "Doğru – tam böyle!", buildWrong: "Neredeyse. Doğru sıra şöyle:",
            hearQ: "▶ Soruyu dinle", time: "Süre:", sec: "sn", rec: "● Cevabımı kaydet", stopRec: "■ Bitti", mine: "▶ Cevabımı dinle", replayMine: "↻ Cevabımı tekrar dinle", spoke: (s) => `${s} saniye konuştun.`, overTime: "Süre doldu – gerçek bir mülakatta bitirmek için iyi bir an olurdu.",
            selfCheck: "Kendini kontrol et:", models: "Örnek cevaplar", b1: "B1 – basit ve net", b2: "B2–C1 – daha doğal",
            notebook: "📓 Defterim: kendi cevabım", notePh: "Kendi cevabını buraya İngilizce yaz …", saved: "Kaydedildi", noteHint: "Bu tarayıcıda kaydedilir – hesapla hesabında da.",
            micNo: "Bu tarayıcı kayıt yapamıyor – yine de yüksek sesle cevap ver.", micDenied: "Mikrofona erişim yok. Tarayıcı ayarlarından izin ver – ya da sadece yüksek sesle cevap ver.",
            complete: "✓ Dersi tamamla", completed: "✓ Ders tamamlandı – harika!", next: "Sonraki ders: yakında",
            privacy: "Kayıtların cihazında kalır ve hiçbir yere gönderilmez.", betaNote: "Beta – sesler şimdilik tarayıcından geliyor. Yakında David’in gerçek kayıtlarını duyacaksın.",
            lessons: "Altı ders", cta: "Yakında gerçek bir mülakatın mı var? David ya da Omer ile birebir İngilizce dersinde çalış.", ctaLink: "İngilizce derslerine bak ↗",
        },
    }[lng];
    const LESSONS_URL = lng === "de" ? "https://nawee.net/#angebote" : "https://nawee.net/index-en.html#angebote";

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
    const button = (cls, html, fn) => { const b = el("button", `sl-btn ${cls}`, html); b.type = "button"; b.addEventListener("click", fn); return b; };
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ completed: [], dates: {}, notes: {} }, load());
    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
    };

    // ---------- voices: Mark and Ben, two different male browser voices (David's recordings later) ----------
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    let voices = [];
    const loadVoices = () => { voices = synth ? synth.getVoices().filter((v) => /^en(-|_)/i.test(v.lang)) : []; };
    if (synth) { loadVoices(); synth.addEventListener?.("voiceschanged", loadVoices); }
    const male = /alex|daniel|fred|tom|aaron|david|guy|mark|google uk english male|rishi|evan|nathan/i;
    const voiceFor = (who) => {
        const us = voices.filter((v) => /en.US/i.test(v.lang)), pool = us.length ? us : voices;
        const m = pool.filter((v) => male.test(v.name));
        return who === "Ben" ? m[1] || m[0] || pool[1] || pool[0] || null : m[0] || pool[0] || null;
    };
    let audio = null;
    const stopAll = () => { synth?.cancel(); if (audio) { audio.pause(); audio = null; } };
    const say = (text, who = "Mark", rate = 0.95) => new Promise((done) => {
        if (!synth) { done(); return; }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = rate;
        const v = voiceFor(who); if (v) u.voice = v;
        if (who === "Ben" && v && v === voiceFor("Mark")) u.pitch = 1.15;   // only one male voice: make Ben a little higher
        u.onend = done; u.onerror = done;
        synth.speak(u);
    });
    // long texts: play → pause → continue → listen again (David's rule for every longer read-aloud)
    const player = (items, label, onLine) => {
        let i = 0, state = "idle", run = 0;
        const b = button("sl-play", label, () => {
            if (state === "playing") { state = "paused"; run += 1; synth?.cancel(); b.textContent = T.resume; return; }
            if (state === "done") i = 0;
            state = "playing"; b.textContent = T.pause; const my = ++run;
            (async () => {
                for (; i < items.length; i += 1) {
                    onLine?.(i);
                    await say(items[i].text, items[i].who);
                    if (my !== run) return;   // paused or restarted
                }
                state = "done"; onLine?.(-1); b.textContent = T.replay;
            })();
        });
        return b;
    };

    // ---------- overview ----------
    const id = new URLSearchParams(location.search).get("l");
    const lesson = INTERVIEW_LESSONS.find((x) => x.id === id && x.ready);
    if (!lesson) {
        document.title = `${T.title} | Nawee`;
        root.innerHTML = `<p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p><p class="iv-level">${T.level}</p>
            <h2 class="rd-group">${T.lessons}</h2>
            <div class="rd-list">${INTERVIEW_LESSONS.map((x) => {
                const done = data.completed.includes(x.id);
                const inner = `<span class="rd-card-icon" aria-hidden="true">${x.icon}</span><span class="rd-card-body"><span class="rd-card-meta">${T.lesson} ${x.id}${x.beta ? ` · ${T.beta}` : ""}</span>
                    <strong>${esc(L(x.title))}</strong><span class="rd-card-status">${x.ready ? (done ? T.doneMark : T.start) : T.soon}</span></span>`;
                return x.ready ? `<a class="rd-card${done ? " is-done" : ""}" href="${page}?l=${x.id}">${inner}</a>` : `<div class="rd-card iv-soon">${inner}</div>`;
            }).join("")}</div>
            <div class="path-coaching-note iv-cta"><p>${T.cta}</p><a class="text-link" href="${LESSONS_URL}" target="_blank" rel="noopener">${T.ctaLink}</a></div>`;
        return;
    }

    // ---------- one lesson ----------
    document.title = `${L(lesson.title)} – ${T.title} | Nawee`;
    root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a>
        <p class="eyebrow">${T.eyebrow} · ${T.lesson} ${lesson.id}${lesson.beta ? ` · ${T.beta}` : ""}</p>
        <h1>${esc(L(lesson.title))}</h1>
        <div class="iv-goal"><strong>🎯 ${T.goal}:</strong> ${esc(L(lesson.goal))}</div>
        <p class="as-note">${T.betaNote}</p>`;
    const section = (n, title, cls = "") => { const s = el("section", `iv-step ${cls}`, `<h2><span class="iv-n">${n}</span> ${title}</h2>`); root.append(s); return s; };

    // 1 listen
    const s1 = section(1, T.steps[0]);
    s1.append(el("p", "as-note", T.listenFirst));
    const script = el("div", "iv-script"); script.hidden = true;
    const lines = lesson.scene.filter((x) => x.text);
    lesson.scene.forEach((x) => {
        if (x.part) { script.append(el("p", "iv-part", esc(L(x.part)))); return; }
        const row = button(`iv-line iv-${x.who.toLowerCase()}`, `<b>${x.who}:</b> ${esc(x.text)}`, () => { stopAll(); say(x.text, x.who); });
        row.dataset.i = lines.indexOf(x);
        script.append(row);
    });
    const mark = (i) => script.querySelectorAll(".iv-line").forEach((r) => r.classList.toggle("is-speaking", Number(r.dataset.i) === i));
    const toggle = button("", T.showText, () => { script.hidden = !script.hidden; toggle.textContent = script.hidden ? T.showText : T.hideText; });
    const row1 = el("div", "sl-row"); row1.append(player(lines, T.playAll, mark), toggle);
    s1.append(row1, script);

    // 2 understand
    const s2 = section(2, T.steps[1]);
    lesson.understand.forEach((u, k) => {
        const box = el("div", "iv-q", `<p class="iv-qtext">${k + 1}. ${esc(u.q)}</p>`);
        const opts = el("div", "iv-opts"), fb = el("p", "exercise-feedback"); fb.hidden = true;
        u.options.forEach((o, j) => opts.append(button("iv-opt", esc(o), (e) => {
            const ok = j === u.answer;
            opts.querySelectorAll("button").forEach((b, m) => { b.disabled = true; if (m === u.answer) b.classList.add("is-right"); });
            if (!ok) e.currentTarget.classList.add("is-wrong");
            fb.className = `exercise-feedback ${ok ? "is-right" : "is-wrong"}`;
            fb.innerHTML = `${ok ? "✓ " + T.right : "✗ " + T.wrong} ${esc(L(u.why))}`; fb.hidden = false;
        })));
        box.append(opts, fb); s2.append(box);
    });

    // 3 key phrases: hear + 🎤 check
    const s3 = section(3, T.steps[2]);
    const S = window.NaweeSpeak;
    lesson.phrases.forEach((p) => {
        const row = el("div", "iv-phrase", `<span class="iv-use">${esc(L(p.use))}</span><span class="iv-ptext">${esc(p.text)}</span>`);
        const btns = el("div", "sl-row"), res = el("p", "iv-pres"); res.hidden = true;
        btns.append(button("", T.play, () => { stopAll(); say(p.text, "Ben"); }));
        if (S?.supported) btns.append(button("", T.check, async (e) => {
            const b = e.currentTarget; b.disabled = true; stopAll();
            res.hidden = false; res.className = "iv-pres"; res.textContent = T.listening;
            try {
                const r = await S.record({ maxMs: 8000 });
                if (!r.loud) { res.className = "iv-pres is-wrong"; res.textContent = T.nothing; return; }
                res.textContent = S.ready() ? T.checking : T.loading(0);
                if (!S.ready()) S.load((pc) => { if (!S.ready()) res.textContent = T.loading(pc); });
                const out = await S.check(r.blob, p.text);
                res.className = `iv-pres ${out.ok ? "is-right" : "is-wrong"}`;
                res.textContent = !out.heard ? T.nothing : out.ok ? T.clear : `${T.heard(out.heard)} ${out.missing.length ? T.missing(out.missing.join(", ")) : ""}`;
            } catch { res.className = "iv-pres is-wrong"; res.textContent = T.micDenied; }
            finally { b.disabled = false; }
        }));
        row.append(btns, res); s3.append(row);
    });

    // 4 build the answer: tap the blocks in the right order
    const s4 = section(4, T.steps[3]);
    s4.append(el("p", "", esc(L(lesson.build.task))));
    const buildBox = el("div", "iv-build"); s4.append(buildBox);
    // tap a part to add it; placed parts can be moved up / down or sent back before checking (David, 2026-11-07)
    const drawBuild = () => {
        const order = [];   // indexes into lesson.build.blocks, in the learner's order
        const blocks = lesson.build.blocks.map((b, k) => ({ ...b, k })).sort(() => Math.random() - 0.5);
        const draw = (result) => {
            buildBox.innerHTML = `<ol class="iv-built" data-built></ol><div class="iv-pool" data-pool></div><div class="sl-row" data-bactions></div><div data-bfb></div>`;
            const built = buildBox.querySelector("[data-built]"), pool = buildBox.querySelector("[data-pool]"), actions = buildBox.querySelector("[data-bactions]"), bfb = buildBox.querySelector("[data-bfb]");
            order.forEach((k, pos) => {
                const li = el("li", "iv-placed");
                li.append(button("iv-ptxt", esc(lesson.build.blocks[k].text), () => { order.splice(pos, 1); draw(); }));
                const up = button("iv-move", "↑", () => { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; draw(); });
                const down = button("iv-move", "↓", () => { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; draw(); });
                up.disabled = pos === 0; down.disabled = pos === order.length - 1;
                up.setAttribute("aria-label", T.moveUp); down.setAttribute("aria-label", T.moveDown);
                li.append(up, down); built.append(li);
            });
            blocks.filter((b) => !order.includes(b.k)).forEach((b) => pool.append(button("iv-block", esc(b.text), () => { order.push(b.k); draw(); })));
            if (order.length) built.insertAdjacentHTML("afterend", `<p class="as-note iv-edit">${T.buildEdit}</p>`);
            if (order.length === blocks.length) actions.append(button("sl-play", T.buildCheck, () => draw(order.every((v, m) => v === m))));
            if (result === undefined) return;
            bfb.innerHTML = `<p class="exercise-feedback ${result ? "is-right" : "is-wrong"}">${result ? "✓ " + T.buildRight : "✗ " + T.buildWrong}</p>
                ${result ? "" : `<ol class="iv-built iv-correct">${lesson.build.blocks.map((x) => `<li><em>${esc(L(x.label))}:</em> ${esc(x.text)}</li>`).join("")}</ol>`}
                <p class="as-note">${esc(L(lesson.build.why))}</p>`;
            bfb.append(button("", T.buildAgain, drawBuild));
        };
        draw();
    };
    drawBuild();

    // 5 your turn: hear the question, answer with a timer, compare
    const s5 = section(5, T.steps[4], "iv-turn");
    const A = lesson.answer;
    s5.append(el("p", "iv-question", `<b>Mark:</b> “${esc(A.q)}”`));
    const qRow = el("div", "sl-row"); qRow.append(button("sl-play", T.hearQ, () => { stopAll(); say(A.q, "Mark"); })); s5.append(qRow);
    let secs = A.seconds;
    const timeRow = el("div", "iv-time", `<span>${T.time}</span>`);
    [60, 90, 120].forEach((n) => { const b = button(`iv-chip${n === secs ? " is-on" : ""}`, `${n} ${T.sec}`, () => { secs = n; timeRow.querySelectorAll(".iv-chip").forEach((c) => c.classList.toggle("is-on", c === b)); }); timeRow.append(b); });
    s5.append(timeRow);
    const recBox = el("div", "iv-rec"); s5.append(recBox);
    const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    if (!canRecord) recBox.append(el("p", "as-note", T.micNo));
    else {
        let rec = null, url = null, timer = null, t0 = 0;
        const clock = el("span", "iv-clock"), info = el("p", "as-note"); info.hidden = true;
        // own answer: play → pause → continue → listen again (David, 2026-11-07)
        let mineAudio = null;
        const mine = button("", T.mine, () => {
            if (!url) return;
            if (mineAudio && !mineAudio.paused) { mineAudio.pause(); mine.textContent = T.resume; return; }
            if (mineAudio && mineAudio.currentTime > 0 && !mineAudio.ended) { mineAudio.play().catch(() => {}); mine.textContent = T.pause; return; }
            stopAll();
            mineAudio = audio = new Audio(url);
            // the label follows the audio, also when something else stops it (e.g. "Hear the question")
            const a = mineAudio;
            a.onplay = () => { if (mineAudio === a) mine.textContent = T.pause; };
            a.onpause = () => { if (mineAudio === a && !a.ended) mine.textContent = T.resume; };
            a.onended = () => { if (mineAudio === a) mine.textContent = T.replayMine; };
            mineAudio.play().catch(() => {}); mine.textContent = T.pause;
        }); mine.hidden = true;
        const recBtn = button("sl-play iv-recbtn", T.rec, async () => {
            if (rec && rec.state === "recording") { rec.stop(); return; }
            stopAll(); if (mineAudio) { mineAudio.pause(); mine.textContent = T.mine; }
            let stream;
            try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { info.hidden = false; info.textContent = T.micDenied; return; }
            const chunks = [];
            rec = new MediaRecorder(stream);
            rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
            rec.onstop = () => {
                stream.getTracks().forEach((t) => t.stop()); clearInterval(timer);
                const used = Math.round((performance.now() - t0) / 1000);
                if (url) URL.revokeObjectURL(url);
                url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
                if (mineAudio) mineAudio.pause(); mineAudio = null; mine.textContent = T.mine;   // a new recording starts from the beginning
                recBtn.textContent = T.rec; recBtn.classList.remove("is-recording"); mine.hidden = false; clock.textContent = "";
                info.hidden = false; info.textContent = used >= secs ? T.overTime : T.spoke(used);
            };
            rec.start(); t0 = performance.now();
            recBtn.textContent = T.stopRec; recBtn.classList.add("is-recording"); info.hidden = true;
            const tick = () => { const left = Math.max(0, secs - Math.floor((performance.now() - t0) / 1000)); clock.textContent = `⏱ ${left} ${T.sec}`; if (left <= 0 && rec.state === "recording") rec.stop(); };
            tick(); timer = setInterval(tick, 250);
        });
        const r = el("div", "sl-row"); r.append(recBtn, clock, mine);
        recBox.append(r, info, el("p", "iv-privacy", `🔒 ${T.privacy}`));
    }
    s5.append(el("p", "iv-sub", T.selfCheck));
    const checks = el("ul", "iv-checks");
    A.checks.forEach((c, k) => checks.append(el("li", "", `<label><input type="checkbox" data-c="${k}"> ${esc(L(c))}</label>`)));
    s5.append(checks);
    s5.append(el("p", "iv-sub", T.models));
    [["b1", T.b1], ["b2", T.b2]].forEach(([k, label]) => {
        const m = el("details", "iv-model", `<summary>${label}</summary><p>${esc(A.models[k])}</p>`);
        const sentences = A.models[k].match(/[^.!?]+[.!?]+/g) || [A.models[k]];
        const r = el("div", "sl-row"); r.append(player(sentences.map((x) => ({ text: x.trim(), who: "Ben" })), T.play));
        m.append(r); s5.append(m);
    });
    const nb = el("div", "iv-notebook", `<label for="iv-note"><strong>${T.notebook}</strong></label><textarea id="iv-note" rows="6" placeholder="${esc(T.notePh)}"></textarea><p class="as-note"><span data-saved></span> ${T.noteHint}</p>`);
    s5.append(nb);
    const ta = nb.querySelector("textarea"), savedEl = nb.querySelector("[data-saved]");
    ta.value = data.notes[A.note]?.text || "";
    let noteTimer = null;
    ta.addEventListener("input", () => {
        clearTimeout(noteTimer);
        noteTimer = setTimeout(() => { data.notes[A.note] = { text: ta.value, t: Date.now() }; save(); savedEl.textContent = `✓ ${T.saved} ·`; }, 600);
    });

    // 6 tip · 7 mission + complete
    section(6, T.steps[5], "iv-tip").append(el("p", "", esc(L(lesson.tip))));
    const s7 = section(7, T.steps[6], "iv-mission");
    s7.append(el("p", "", esc(L(lesson.mission))));
    const doneP = el("p", "iv-done"); s7.append(doneP);
    const paint = () => {
        const done = data.completed.includes(lesson.id);
        doneP.innerHTML = "";
        if (done) doneP.append(el("strong", "", T.completed), el("br"), el("span", "as-note", T.next));
        else doneP.append(button("sl-play sl-big", T.complete, () => { data.completed = [...new Set([...data.completed, lesson.id])]; data.dates[lesson.id] = new Date().toISOString().slice(0, 10); save(); paint(); }));
    };
    paint();
    root.append(el("div", "path-coaching-note iv-cta", `<p>${T.cta}</p><a class="text-link" href="${LESSONS_URL}" target="_blank" rel="noopener">${T.ctaLink}</a>`));
})();
