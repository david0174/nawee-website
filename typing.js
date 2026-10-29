// Typing course (tippen.html / typing.html): learn to touch-type – and learn English words while you do it.
// Our own course (not based on any other site). On-screen keyboard (QWERTZ or QWERTY) lights up the next key in
// the colour of the finger to use; every English word is spoken and shows its meaning. Progress stays in this
// browser (localStorage "nawee-typing-v1"); nothing is sent anywhere.

(() => {
    const root = document.querySelector("[data-typing]");
    if (!root) return;
    const de = document.documentElement.lang === "de";
    const L = (o) => (typeof o === "string" ? o : de ? o.de : o.en);
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const KEY = "nawee-typing-v1";
    const load = () => { try { return Object.assign({ completed: [], stars: {} }, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return { completed: [], stars: {} }; } };
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ } };
    const pref = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
    const setPref = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
    let data = load();
    let layout = pref("nawee-kb", de ? "qwertz" : "qwerty");

    // ---------- speech: English words and sentences ----------
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const say = (text) => {
        if (!synth) return;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.85;
        const v = synth.getVoices().find((x) => /en.US/i.test(x.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(x.name)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
        if (v) u.voice = v;
        synth.speak(u);
    };

    // ---------- keyboards and fingers ----------
    const LAYOUTS = {
        qwertz: ["qwertzuiopü", "asdfghjklöä", "yxcvbnm,.-"],
        qwerty: ["qwertyuiop[", "asdfghjkl;'", "zxcvbnm,./"],
    };
    // column → finger (standard touch typing): pinky, ring, middle, index (2 columns) | index (2), middle, ring, pinky
    const FINGERS = ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp"];
    const FINGER_NAME = {
        lp: { de: "linker kleiner Finger", en: "left little finger" }, lr: { de: "linker Ringfinger", en: "left ring finger" },
        lm: { de: "linker Mittelfinger", en: "left middle finger" }, li: { de: "linker Zeigefinger", en: "left index finger" },
        ri: { de: "rechter Zeigefinger", en: "right index finger" }, rm: { de: "rechter Mittelfinger", en: "right middle finger" },
        rr: { de: "rechter Ringfinger", en: "right ring finger" }, rp: { de: "rechter kleiner Finger", en: "right little finger" },
        th: { de: "Daumen", en: "thumb" },
    };
    const fingerOf = (ch) => {
        if (ch === " ") return "th";
        for (const row of LAYOUTS[layout]) { const i = row.indexOf(ch); if (i >= 0) return FINGERS[i]; }
        return "";
    };

    // ---------- the course ----------
    const WORDS = { // meanings shown while typing (German on German pages, simple English on English pages)
        as: { de: "als, wie", en: "like; while" }, ask: { de: "fragen", en: "to want an answer" }, add: { de: "hinzufügen", en: "to put more in" },
        all: { de: "alle, alles", en: "every one" }, sad: { de: "traurig", en: "not happy" }, dad: { de: "Papa", en: "father" },
        fall: { de: "fallen; Herbst (US)", en: "to go down; autumn (US)" }, salad: { de: "Salat", en: "a cold dish with vegetables" },
        glad: { de: "froh", en: "happy" }, half: { de: "halb, Hälfte", en: "one of two equal parts" }, hall: { de: "Flur, Halle", en: "a corridor; a big room" },
        flag: { de: "Flagge", en: "a piece of cloth for a country" }, gas: { de: "Gas; Benzin (US)", en: "air-like matter; fuel for a car (US)" },
        has: { de: "hat", en: "owns (he/she/it)" }, dash: { de: "Strich; sausen", en: "a short line; to run fast" }, flash: { de: "Blitz", en: "a quick bright light" },
        glass: { de: "Glas", en: "a cup made of glass" }, flask: { de: "(Thermos-)Flasche", en: "a bottle for drinks" }, had: { de: "hatte", en: "owned (past)" },
    };
    const SENTENCES = {
        "dad has a salad": { de: "Papa hat einen Salat.", en: "Father has a salad." },
        "half a glass": { de: "ein halbes Glas", en: "a glass that is half full" },
        "all flags fall": { de: "Alle Flaggen fallen.", en: "Every flag goes down." },
        "dad had a flask": { de: "Papa hatte eine Thermosflasche.", en: "Father had a bottle for drinks." },
        "a glad dad has a flag": { de: "Ein froher Papa hat eine Flagge.", en: "A happy father has a flag." },
        "ask dad": { de: "Frag Papa.", en: "Ask your father." },
    };
    const MODULES = [
        { id: 1, title: { de: "Grundreihe", en: "Home row" }, lessons: [
            { id: "1-1", keys: "fj", title: { de: "F und J – deine Startposition", en: "F and J – your home position" },
              intro: { de: "Leg deine Zeigefinger auf F und J – die Tasten mit den kleinen Huckeln. Die anderen Finger liegen daneben: links auf A S D, rechts auf K L Ö. Von hier aus startet jeder Tastendruck – und hierhin kehren deine Finger zurück.",
                       en: "Put your index fingers on F and J – the keys with the little bumps. The other fingers rest next to them: left on A S D, right on K L ;. Every key press starts here – and your fingers come back here." },
              ex: [{ text: "fff jjj fff jjj" }, { text: "fj jf fj jf ff jj" }, { text: "fjf jfj ffj jjf fj" }] },
            { id: "1-2", keys: "dk", title: { de: "D und K – die Mittelfinger", en: "D and K – your middle fingers" },
              intro: { de: "Jetzt kommen die Mittelfinger dazu: links D, rechts K. Schau möglichst nicht auf die Tastatur – schau auf den Bildschirm.", en: "Now add your middle fingers: D on the left, K on the right. Try not to look at the keyboard – look at the screen." },
              ex: [{ text: "ddd kkk dkd kdk" }, { text: "fd jk df kj fd jk" }, { text: "fdk jkd dfj kfd" }] },
            { id: "1-3", keys: "sl", title: { de: "S und L – die Ringfinger", en: "S and L – your ring fingers" },
              intro: { de: "Die Ringfinger: links S, rechts L. Tipp gleichmäßig – lieber langsam und richtig als schnell mit Fehlern.", en: "Your ring fingers: S on the left, L on the right. Type evenly – slow and right is better than fast with mistakes." },
              ex: [{ text: "sss lll sls lsl" }, { text: "sd lk ds kl sd lk" }, { text: "fds jkl sdf lkj" }] },
            { id: "1-4", keys: "a", title: { de: "A – deine ersten englischen Wörter", en: "A – your first English words" },
              intro: { de: "Der linke kleine Finger tippt das A. Damit kannst du schon echte englische Wörter schreiben – du hörst jedes Wort und siehst, was es bedeutet.", en: "Your left little finger types A. Now you can already write real English words – you hear every word and see what it means." },
              ex: [{ text: "aaa sss aaa lll" }, { words: ["as", "ask", "add", "all"] }, { words: ["sad", "dad", "fall", "salad"] }] },
            { id: "1-5", keys: "gh", title: { de: "G und H – die Zeigefinger strecken sich", en: "G and H – reach with your index fingers" },
              intro: { de: "G und H liegen in der Mitte. Der linke Zeigefinger rutscht von F nach rechts zum G, der rechte von J nach links zum H – und danach gleich zurück.", en: "G and H are in the middle. Your left index finger moves from F to G, your right one from J to H – and then straight back." },
              ex: [{ text: "ggg hhh fgf jhj" }, { words: ["glad", "half", "hall", "flag"] }, { words: ["gas", "has", "dash", "flash"] }] },
            { id: "1-6", keys: "", title: { de: "Die ganze Grundreihe – erste Sätze", en: "The whole home row – first sentences" },
              intro: { de: "Jetzt tippst du ganze Sätze nur mit der Grundreihe. Die Leertaste drückst du mit dem Daumen.", en: "Now you type whole sentences with the home row only. Press the space bar with your thumb." },
              ex: [{ sentence: "dad has a salad" }, { sentence: "half a glass" }, { sentence: "all flags fall" }, { sentence: "a glad dad has a flag" }] },
        ] },
        { id: 2, title: { de: "Obere Reihe", en: "Top row" }, soon: { de: ["E und I", "R und U", "T und Z / Y", "W und O", "Q und P"], en: ["E and I", "R and U", "T and Y / Z", "W and O", "Q and P"] } },
        { id: 3, title: { de: "Untere Reihe", en: "Bottom row" }, soon: { de: ["C und M", "V und N", "X, Komma, Punkt", "B"], en: ["C and M", "V and N", "X, comma, period", "B"] } },
        { id: 4, title: { de: "Großbuchstaben & Satzzeichen", en: "Capitals & punctuation" }, soon: { de: ["Großbuchstaben (Shift)", "Punkt und Komma", "Fragezeichen"], en: ["Capitals (Shift)", "Period and comma", "Question mark"] } },
        { id: 5, title: { de: "Sätze aus den Lektionen", en: "Sentences from the lessons" }, soon: { de: ["Sich vorstellen", "Sich verabreden", "Zahlen & Telefonnummern"], en: ["Introducing yourself", "Making plans", "Numbers & phone numbers"] } },
    ];
    const T = de ? {
        title: "Tippen lernen – mit Englisch", lead: "Lern das Zehnfingersystem – und dabei englische Wörter. Jedes Wort hörst du, und du siehst, was es bedeutet.",
        keyboard: "Tastatur", soon: "Bald", start: "Starten", again: "Nochmal", done: "Geschafft", lessons: (n) => `${n} Lektionen`,
        exercise: (i, n) => `Übung ${i} von ${n}`, typeHere: "Hier tippen – der Cursor muss im Feld sein", next: "Weiter →", back: "← Zur Übersicht",
        finger: "Finger", wpm: "Wörter/Min.", acc: "Genauigkeit", lessonDone: "Lektion geschafft!", nextLesson: "Nächste Lektion →",
        mobile: "Am besten mit einer echten Tastatur (Computer oder Laptop).", hear: "🔊 anhören", privacy: "Dein Fortschritt bleibt in diesem Browser.",
        games: "← Alle Spiele", gamesHref: "spiele.html",
    } : {
        title: "Learn to type – with English", lead: "Learn touch typing – and English words along the way. You hear every word and see what it means.",
        keyboard: "Keyboard", soon: "Soon", start: "Start", again: "Again", done: "Done", lessons: (n) => `${n} lessons`,
        exercise: (i, n) => `Exercise ${i} of ${n}`, typeHere: "Type here – the cursor must be in this field", next: "Next →", back: "← Back to overview",
        finger: "Finger", wpm: "WPM", acc: "Accuracy", lessonDone: "Lesson done!", nextLesson: "Next lesson →",
        mobile: "Works best with a real keyboard (computer or laptop).", hear: "🔊 listen", privacy: "Your progress stays in this browser.",
        games: "← All games", gamesHref: "games.html",
    };
    const allLessons = MODULES.flatMap((m) => m.lessons || []);
    const stars = (n) => "★".repeat(n) + "☆".repeat(3 - n);

    // ---------- on-screen keyboard ----------
    const keyboard = (next) => `<div class="tk-kb" aria-hidden="true">${LAYOUTS[layout].map((row, r) =>
        `<div class="tk-row tk-row-${r}">${[...row].map((k, c) => `<span class="tk-key f-${FINGERS[c]}${k === next ? " is-next" : ""}${"fj".includes(k) ? " has-bump" : ""}">${esc(k.toUpperCase())}</span>`).join("")}</div>`).join("")}
        <div class="tk-row"><span class="tk-key tk-space f-th${next === " " ? " is-next" : ""}">space</span></div></div>`;
    const layoutSwitch = () => `<div class="tk-layout" role="group" aria-label="${T.keyboard}"><span>${T.keyboard}:</span>
        <button type="button" data-kb="qwertz" class="${layout === "qwertz" ? "on" : ""}">QWERTZ</button><button type="button" data-kb="qwerty" class="${layout === "qwerty" ? "on" : ""}">QWERTY</button></div>`;

    // ---------- overview: modules with %, lessons with stars ----------
    const overview = () => {
        root.innerHTML = `<a class="lesson-back" href="${T.gamesHref}">${T.games}</a><p class="eyebrow">⌨️ ${de ? "TIPPKURS" : "TYPING COURSE"}</p><h1>${T.title}</h1>
            <p class="as-lead">${T.lead}</p>${layoutSwitch()}
            <ul class="tk-modules">${MODULES.map((m) => {
                const ls = m.lessons || [];
                const doneN = ls.filter((l) => data.completed.includes(l.id)).length;
                const pct = ls.length ? Math.round((doneN / ls.length) * 100) : 0;
                return `<li class="tk-module${ls.length ? "" : " is-soon"}">
                    <div class="tk-mhead"><strong>${esc(L(m.title))}</strong><span class="lv-mmeta">${T.lessons(ls.length || L(m.soon).length)}</span>
                        ${ls.length ? (pct ? `<span class="lv-pct${pct === 100 ? " lv-full" : ""}">${pct} %</span>` : "") : `<span class="lv-pct lv-soon">${T.soon}</span>`}</div>
                    <span class="lv-bar" aria-hidden="true"><i style="width:${pct}%"></i></span>
                    ${ls.length ? `<ol class="lv-lessons">${ls.map((l) => {
                        const ok = data.completed.includes(l.id);
                        return `<li><a href="#${l.id}" data-lesson="${l.id}"><span class="lv-check${ok ? " is-done" : ""}">${ok ? "✓" : ""}</span>${esc(L(l.title))}
                            ${data.stars[l.id] ? `<span class="tk-stars" aria-label="${data.stars[l.id]} / 3">${stars(data.stars[l.id])}</span>` : ""}<span class="lv-go">${ok ? T.again : T.start} →</span></a></li>`;
                    }).join("")}</ol>` : `<p class="tk-soon-list">${L(m.soon).map(esc).join(" · ")}</p>`}
                </li>`;
            }).join("")}</ul>
            <p class="as-note">${T.mobile} ${T.privacy}</p>`;
    };

    // ---------- a lesson: exercises one after another ----------
    const lesson = (l) => {
        let ei = 0;
        const results = [];
        const run = () => {
            const ex = l.ex[ei];
            const words = ex.words || null, sentence = ex.sentence || null;
            const text = words ? words.join(" ") : sentence || ex.text;
            let pos = 0, errors = 0, typed = 0, t0 = 0, lastWord = -1, flash = false;
            const wordAt = (p) => (words ? text.slice(0, p).split(" ").length - 1 : -1);
            const draw = () => {
                const next = text.charAt(pos);
                const f = fingerOf(next);
                const wi = wordAt(pos);
                root.innerHTML = `<a class="lesson-back" href="#" data-overview>${T.back}</a><p class="eyebrow">⌨️ ${esc(L(MODULES[0].title))} · ${T.exercise(ei + 1, l.ex.length)}</p>
                    <h1 class="tk-h1">${esc(L(l.title))}</h1>
                    ${ei === 0 && pos === 0 ? `<p class="as-lead tk-intro">${esc(L(l.intro))}</p>` : ""}
                    <div class="tk-line${flash ? " is-wrong" : ""}" aria-live="off"><span class="tk-done">${esc(text.slice(0, pos))}</span><span class="tk-cur">${esc(next === " " ? "␣" : next)}</span><span class="tk-rest">${esc(text.slice(pos + 1))}</span></div>
                    ${words ? `<div class="tk-words">${words.map((w, i) => `<button type="button" class="tk-word${i === wi ? " is-now" : ""}${i < wi ? " is-done" : ""}" data-say="${esc(w)}"><strong>${esc(w)}</strong><span>${esc(L(WORDS[w] || { de: "", en: "" }))}</span></button>`).join("")}</div>` : ""}
                    ${sentence ? `<p class="tk-meaning"><button type="button" class="tk-hear" data-say="${esc(sentence)}">${T.hear}</button> ${esc(L(SENTENCES[sentence] || { de: "", en: "" }))}</p>` : ""}
                    <p class="tk-finger">${next ? `${T.finger}: <strong class="f-text-${f}">${esc(L(FINGER_NAME[f] || { de: "", en: "" }))}</strong>` : ""}</p>
                    ${keyboard(next)}
                    <input class="gm-input tk-input" data-input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}">
                    ${layoutSwitch()}`;
                const input = root.querySelector("[data-input]");
                input.focus();
                input.addEventListener("input", onInput);
            };
            const finish = () => {
                const min = Math.max((performance.now() - t0) / 60000, 1 / 600);
                const wpm = Math.round((text.length / 5) / min);
                const acc = typed ? Math.round(((typed - errors) / typed) * 100) : 100;
                results.push({ wpm, acc });
                const s = acc >= 97 ? 3 : acc >= 90 ? 2 : 1;
                const last = ei === l.ex.length - 1;
                if (last) {
                    if (!data.completed.includes(l.id)) data.completed.push(l.id);
                    const avg = Math.round(results.reduce((a, r) => a + r.acc, 0) / results.length);
                    data.stars[l.id] = Math.max(data.stars[l.id] || 0, avg >= 97 ? 3 : avg >= 90 ? 2 : 1);
                    save();
                }
                const nextL = allLessons[allLessons.findIndex((x) => x.id === l.id) + 1];
                root.querySelector(".tk-finger").innerHTML = "";
                root.querySelector("[data-input]").remove();
                root.querySelector(".tk-kb").insertAdjacentHTML("beforebegin", `<div class="gm-result tk-result">
                    <p class="gm-place">${last ? "🎉 " + T.lessonDone : `<span class="tk-stars">${stars(s)}</span>`}</p>
                    <p><strong>${wpm}</strong> ${T.wpm} · <strong>${acc} %</strong> ${T.acc}</p>
                    <div class="wb-actions"><button type="button" class="button primary" data-next>${last ? (nextL ? T.nextLesson : T.back) : T.next}</button>
                    <button type="button" class="button secondary" data-again>${T.again}</button></div></div>`);
                root.querySelector("[data-again]").addEventListener("click", () => run());
                root.querySelector("[data-next]").addEventListener("click", () => {
                    if (!last) { ei += 1; run(); return; }
                    if (nextL) { location.hash = nextL.id; } else { location.hash = ""; }
                });
                root.querySelector("[data-next]").focus();
            };
            const onInput = (e) => {
                const input = e.target;
                const chars = [...input.value];
                input.value = "";
                for (const raw of chars) {
                    const ch = raw.toLowerCase();
                    if (!t0) t0 = performance.now();
                    typed += 1;
                    if (ch === text.charAt(pos)) {
                        pos += 1; flash = false;
                        const wi = wordAt(pos);
                        if (words && wi !== lastWord && pos < text.length && text.charAt(pos - 1) === " ") { lastWord = wi; say(words[wi]); }
                        if (pos >= text.length) { if (sentence) say(sentence); draw(); finish(); return; }
                    } else { errors += 1; flash = true; }
                }
                draw();
            };
            draw();
            if (words) { lastWord = 0; say(words[0]); }
            if (sentence) say(sentence);
        };
        run();
    };

    // ---------- clicks: layout switch, hear words, overview link ----------
    root.addEventListener("click", (e) => {
        const kb = e.target.closest("[data-kb]");
        if (kb) { layout = kb.dataset.kb; setPref("nawee-kb", layout); route(); return; }
        const s = e.target.closest("[data-say]");
        if (s) { say(s.dataset.say); const i = root.querySelector("[data-input]"); if (i) i.focus(); return; }
        if (e.target.closest("[data-overview]")) { e.preventDefault(); location.hash = ""; }
    });
    const route = () => {
        if (synth) synth.cancel();
        const l = allLessons.find((x) => x.id === location.hash.slice(1));
        if (l) lesson(l); else overview();
        window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", route);
    route();
})();
