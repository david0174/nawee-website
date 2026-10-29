// Typing games (spiele.html / games.html): overview, "Typing Race" (?g=race: type a short English text and race
// against Tom and Ben) and "Word Rain" (?g=rain: type the falling words before they land; optional German → English).
// Also "Word & Meaning" (?g=define), "Rhyme Time" (?g=rhyme) and "Sentence Detective" (?g=parts: mark the word classes).
// Texts come from reading-data.js, words from vocab-data.js. Best scores: "nawee-games-v1" (browser + account via account.js).

(() => {
    const root = document.querySelector("[data-games]");
    if (!root) return;

    const de = document.documentElement.lang === "de";
    const KEY = "nawee-games-v1";
    const page = de ? "spiele.html" : "games.html";
    const T = de ? {
        eyebrow: "SPIELE", title: "Spiele", lead: "Englisch tippen, schneller werden, Wörter festigen – mit Texten und Wörtern aus deinem Kurs.",
        best: "Bestwert", none: "Noch nicht gespielt", play: "Spielen →", back: "← Alle Spiele",
        race: "Typing Race", raceText: "Tippe einen kurzen englischen Text so schnell und genau wie möglich – und fahr gegen Tom und Ben um die Wette.",
        rain: "Word Rain", rainText: "Englische Wörter fallen vom Himmel. Tipp sie ab, bevor sie unten ankommen. Es wird immer schneller!",
        level: "Gegner", levels: ["Gemütlich", "Normal", "Schnell"], track: "Strecke", tracks: { random: "Zufall", mountains: "Berge", park: "Park", underwater: "Unter Wasser" }, start: "Start", you: "Du", countdown: "Los in",
        typeHere: "Hier tippen …", from: "Text aus", wpm: "WPM", wpmLong: "Wörter pro Minute", acc: "Genauigkeit", place: ["1. Platz! 🏆", "2. Platz 🥈", "3. Platz 🥉"],
        again: "Nochmal", newBest: "Neuer Bestwert!", tipRace: "Tipp: Fehler musst du korrigieren, bevor es weitergeht. Genau ist schneller als hektisch.",
        mode: "Modus", modes: ["Abtippen", "Übersetzen (DE → EN)"], score: "Punkte", lives: "Leben", over: "Spiel vorbei!", rainTip: "Wort eintippen – Enter oder Leertaste ist nicht nötig.",
        parts: "Satz-Detektiv", partsText: "Klick in einem Satz alle Nomen, Verben, Adjektive … an – so siehst du, wie ein englischer Satz gebaut ist.", partsLead: "Ein Satz, mehrere Aufgaben: Markiere jedes Mal die gesuchte Wortart und prüf deine Antwort. Am Ende siehst du den ganzen Satz in Farben zerlegt. Tipp ein Wort an, um es zu hören.", partsMark: "Markiere", partsCheck: "Prüfen", partsNext: "Weiter", partsDone: "Ergebnis", partsRight: "Richtig!", partsAlmost: "Fast! <span class=\"gm-pt-key is-right\">grün</span> = richtig, <span class=\"gm-pt-key is-wrong\">rot</span> = falsch markiert, <span class=\"gm-pt-key is-missed\">gestrichelt</span> = vergessen.", partsBreakdown: "So ist der Satz gebaut:", partsScore: (p, n) => `${p} von ${n} Aufgaben ohne Fehler ${p === n ? "– perfekt! 🏆" : ""}`, partsAnother: "Nächster Satz", partsStep: (i, n) => `Aufgabe ${i} von ${n}`, sentences: (n) => `${n} ${n === 1 ? "Satz" : "Sätze"} zerlegt`, rhyme: "Reim-Zeit", rhymeText: "Ein Wort, ein paar Reime – und du sprichst: Bau laut einen Satz oder rap ein paar Zeilen. Mit Timer, wenn du willst.", timer: "Timer pro Wort", off: "Aus", beat: "Beat", volume: "Lautstärke", beatNote: "Die Beats werden live in deinem Browser erzeugt – eigene Beats, frei von Lizenzen.", ytTitle: "Lieber andere Beats? Instrumentals auf YouTube:", ytNote: "Öffnet YouTube in einem neuen Tab – starte den Beat dort, wähl hier beim Beat „Aus“ und leg los.", nextWord: "Nächstes Wort", rhymesWith: "Reimt sich auf – fahr mit der Maus über ein Wort für die Bedeutung", rhymeTask: "Sag laut einen Satz mit dem Wort und einem Reim – oder rap ein paar Zeilen!", rhymeLine: "Merksatz", words2: (n) => `${n} ${n === 1 ? "Wort" : "Wörter"} geschafft`, stop: "Beenden",
        typeWord: "Wort tippen …", missed: "Verpasst:", define: "Wort & Bedeutung", defineText: "Tippe ein Wort und seine kurze englische Bedeutung, z. B. „key it opens a lock“ – den Strich setzt das Spiel für dich. 10 schnelle Runden – so lernst du Wörter auf Englisch zu erklären.", item: (i, n) => `${i} / ${n}`, round: "Runde geschafft!", time: "Zeit", sec: "Sek.", typed: "Getippt", german: "Deutsch", words: "Wörter aus diesem Text", wordsLive: "Wörter in diesem Text", wordsTap: "Tipp auf ein Wort, um es zu hören.", readAll: "Ganzen Text lesen →", readPage: "lesen.html",
        privacy: "Deine Bestwerte werden in diesem Browser gespeichert – mit einem <a href=\"konto.html\">kostenlosen Konto</a> auch in deinem Konto.",
    } : {
        eyebrow: "GAMES", title: "Games", lead: "Type English, get faster, remember words – with texts and words from your course.",
        best: "Best", none: "Not played yet", play: "Play →", back: "← All games",
        race: "Typing Race", raceText: "Type a short English text as fast and accurately as you can – and race against Tom and Ben.",
        rain: "Word Rain", rainText: "English words fall from the sky. Type them before they reach the bottom. It keeps getting faster!",
        level: "Opponents", levels: ["Relaxed", "Normal", "Fast"], track: "Track", tracks: { random: "Random", mountains: "Mountains", park: "Park", underwater: "Underwater" }, start: "Start", you: "You", countdown: "Starting in",
        typeHere: "Type here …", from: "Text from", wpm: "WPM", wpmLong: "words per minute", acc: "Accuracy", place: ["1st place! 🏆", "2nd place 🥈", "3rd place 🥉"],
        again: "Play again", newBest: "New best!", tipRace: "Tip: fix a mistake before you can go on. Accurate is faster than rushed.",
        mode: "Mode", modes: ["Copy", "Translate (DE → EN)"], score: "Score", lives: "Lives", over: "Game over!", rainTip: "Type the word – no need to press Enter or space.",
        parts: "Sentence Detective", partsText: "Click all the nouns, verbs, adjectives … in a sentence – and see how an English sentence is built.", partsLead: "One sentence, several tasks: each time, mark the words of one word class and check your answer. At the end, you see the whole sentence broken down in colors. Tap a word to hear it.", partsMark: "Mark", partsCheck: "Check", partsNext: "Next", partsDone: "Result", partsRight: "Correct!", partsAlmost: "Almost! <span class=\"gm-pt-key is-right\">green</span> = correct, <span class=\"gm-pt-key is-wrong\">red</span> = marked by mistake, <span class=\"gm-pt-key is-missed\">dashed</span> = missed.", partsBreakdown: "This is how the sentence is built:", partsScore: (p, n) => `${p} of ${n} tasks without a mistake ${p === n ? "– perfect! 🏆" : ""}`, partsAnother: "Next sentence", partsStep: (i, n) => `Task ${i} of ${n}`, sentences: (n) => `${n} ${n === 1 ? "sentence" : "sentences"} broken down`, rhyme: "Rhyme Time", rhymeText: "One word, a few rhymes – and you speak: make a sentence out loud or rap a few lines. With a timer if you like.", timer: "Timer per word", off: "Off", beat: "Beat", volume: "Volume", beatNote: "The beats are generated live in your browser – our own beats, free of any licenses.", ytTitle: "Prefer other beats? Instrumentals on YouTube:", ytNote: "Opens YouTube in a new tab – start the beat there, choose “Off” for the beat here and go.", nextWord: "Next word", rhymesWith: "Rhymes with – hover over a word to see its meaning", rhymeTask: "Say a sentence out loud with the word and a rhyme – or rap a few lines!", rhymeLine: "Memory line", words2: (n) => `${n} ${n === 1 ? "word" : "words"} done`, stop: "Stop",
        typeWord: "Type the word …", missed: "Missed:", define: "Word & Meaning", defineText: "Type a word and its short English meaning, e.g. “key it opens a lock” – the game adds the dash for you. 10 quick rounds – learn to explain words in English.", item: (i, n) => `${i} / ${n}`, round: "Round complete!", time: "Time", sec: "sec", typed: "Typed", german: "German", words: "Words from this text", wordsLive: "Words in this text", wordsTap: "Tap a word to hear it.", readAll: "Read the whole text →", readPage: "reading.html",
        privacy: "Your best scores are saved in this browser – and with a <a href=\"account.html\">free account</a> in your account too.",
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ best: {}, days: [] }, load());
    const save = () => {
        const today = new Date().toISOString().slice(0, 10);
        if (!data.days.includes(today)) data.days = [...data.days, today].slice(-400);
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
    };
    // typing-friendly text: straight quotes and plain dashes
    // say a word: David's recording if there is one, otherwise the browser voice
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    let clip = null;
    const say = (text, file) => {
        synth?.cancel(); if (clip) { clip.pause(); clip = null; }
        if (file) { clip = new Audio(file); clip.play().catch(() => {}); return; }
        if (!synth) return;
        const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9;
        const v = synth.getVoices().find((x) => /en.US/i.test(x.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(x.name)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
        if (v) u.voice = v;
        synth.speak(u);
    };
    // short sounds for right / wrong / done – the same tones and the same on/off setting as the lessons (trophies.js)
    let tones = null;
    const sfx = (kind) => {
        try { if (localStorage.getItem("nawee-sound") === "off") return; } catch { /* ignore */ }
        try {
            tones = tones || new (window.AudioContext || window.webkitAudioContext)();
            if (tones.state === "suspended") tones.resume();
            const tone = (freq, start, length, type = "sine", volume = 0.22) => {
                const t0 = tones.currentTime + start, osc = tones.createOscillator(), gain = tones.createGain();
                osc.type = type; osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.0001, t0);
                gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
                gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
                osc.connect(gain).connect(tones.destination);
                osc.start(t0); osc.stop(t0 + length + 0.05);
            };
            if (kind === "correct") { tone(880, 0, 0.12); tone(1318.5, 0.09, 0.2); }
            if (kind === "wrong") { tone(330, 0, 0.14, "triangle", 0.16); tone(262, 0.1, 0.2, "triangle", 0.14); }
            if (kind === "complete") { tone(659.3, 0, 0.16); tone(784, 0.12, 0.16); tone(1046.5, 0.24, 0.32); }
        } catch { /* audio not available – stay silent */ }
    };
    const plain = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...");

    const game = new URLSearchParams(location.search).get("g");

    // ---------- overview ----------
    if (!["race", "rain", "define", "rhyme", "parts"].includes(game)) {
        document.title = `${T.title} | Nawee`;
        const tile = (g, icon, title, text, best) => `<a class="gm-tile" href="${page}?g=${g}">
            <span class="gm-tile-icon" aria-hidden="true">${icon}</span>
            <span class="gm-tile-body"><strong>${title}</strong><span>${text}</span>
            <span class="gm-tile-best">${best ? `🏅 ${T.best}: ${best}` : T.none}</span></span>
            <span class="gm-tile-go">${T.play}</span>
        </a>`;
        root.innerHTML = `<p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p>
            <div class="gm-tiles">
                <a class="gm-tile gm-tile-course" href="${de ? "tippen.html" : "typing.html"}">
                    <span class="gm-tile-icon" aria-hidden="true">⌨️</span>
                    <span class="gm-tile-body"><strong>${de ? "Tippen lernen – mit Englisch" : "Learn to type – with English"}</strong><span>${de ? "Das Zehnfingersystem Schritt für Schritt – und dabei englische Wörter hören und verstehen. QWERTZ oder QWERTY." : "Touch typing step by step – and hear and understand English words along the way. QWERTY or QWERTZ."}</span>
                    <span class="gm-tile-best">${de ? "Neu · Kurs" : "New · course"}</span></span>
                    <span class="gm-tile-go">${de ? "Starten" : "Start"}</span>
                </a>
                ${tile("race", "🏁", T.race, T.raceText, data.best.race ? `${data.best.race} ${T.wpm}` : "")}
                ${tile("rain", "🌧️", T.rain, T.rainText, data.best.rain ? `${data.best.rain} ${T.score}` : "")}
                ${tile("define", "📝", T.define, T.defineText, data.best.define ? `${data.best.define} ${T.wpm}` : "")}
                ${tile("rhyme", "🎤", T.rhyme, T.rhymeText, data.best.rhyme ? T.words2(data.best.rhyme) : "")}
                ${tile("parts", "🔍", T.parts, T.partsText, data.best.parts ? T.sentences(data.best.parts) : "")}
            </div>
            <p class="as-disclaimer">${T.privacy}</p>`;
        return;
    }

    // ---------- Sentence Detective: mark the word classes in a sentence ----------
    if (game === "parts") {
        document.title = `${T.parts} – ${T.title} | Nawee`;
        // word classes, in the order they are asked; main class after ":", "d|pr" = determiner, pronoun also accepted
        const CLS = {
            n: { de: "Nomen", en: "noun", task: de ? "alle <strong>Nomen</strong> (nouns)" : "all the <strong>nouns</strong>", hint: de ? "Dinge, Personen, Orte und Namen – z. B. shop, friend, Tom" : "things, people, places and names – e.g. shop, friend, Tom" },
            v: { de: "Verb", en: "verb", task: de ? "alle <strong>Verben</strong> (verbs)" : "all the <strong>verbs</strong>", hint: de ? "was jemand tut oder ist – z. B. went, plays, is" : "what someone does or is – e.g. went, plays, is" },
            adj: { de: "Adjektiv", en: "adjective", task: de ? "alle <strong>Adjektive</strong> (adjectives)" : "all the <strong>adjectives</strong>", hint: de ? "beschreiben ein Nomen – z. B. a <em>new</em> coat, the <em>old</em> dog, he is <em>tired</em>" : "describe a noun – e.g. a <em>new</em> coat, the <em>old</em> dog, he is <em>tired</em>" },
            adv: { de: "Adverb", en: "adverb", task: de ? "alle <strong>Adverbien</strong> (adverbs)" : "all the <strong>adverbs</strong>", hint: de ? "sagen, wie, wann oder wie oft – z. B. quickly, often, very" : "say how, when or how often – e.g. quickly, often, very" },
            pr: { de: "Pronomen", en: "pronoun", task: de ? "alle <strong>Pronomen</strong> (pronouns)" : "all the <strong>pronouns</strong>", hint: de ? "stehen für ein Nomen – z. B. I, she, it, they" : "stand for a noun – e.g. I, she, it, they" },
            d: { de: "Begleiter", en: "determiner", task: de ? "alle <strong>Begleiter</strong> (determiners)" : "all the <strong>determiners</strong>", hint: de ? "stehen vor einem Nomen – z. B. the, a, my, his. (my, his, their nennt man auch Possessivpronomen – beides zählt.)" : "come before a noun – e.g. the, a, my, his. (my, his, their are also called possessive pronouns – both count.)" },
            prep: { de: "Präposition", en: "preposition", task: de ? "alle <strong>Präpositionen</strong> (prepositions)" : "all the <strong>prepositions</strong>", hint: de ? "zeigen Ort, Richtung oder Zeit – z. B. to, in, under, after" : "show place, direction or time – e.g. to, in, under, after" },
            conj: { de: "Konjunktion", en: "conjunction", task: de ? "alle <strong>Konjunktionen</strong> (conjunctions)" : "all the <strong>conjunctions</strong>", hint: de ? "verbinden Wörter oder Satzteile – z. B. and, but, because" : "join words or parts of a sentence – e.g. and, but, because" },
        };
        const SENTENCES = [
            "I:pr quickly:adv went:v to:prep the:d shop:n and:conj bought:v a:d new:adj coat:n for:prep my:d|pr friend:n .",
            "She:pr drinks:v hot:adj tea:n in:prep the:d morning:n .",
            "We:pr often:adv eat:v lunch:n at:prep a:d small:adj café:n near:prep the:d station:n .",
            "Tom:n is:v tired:adj , but:conj he:pr works:v very:adv hard:adv .",
            "My:d|pr little:adj brother:n plays:v football:n with:prep his:d|pr friends:n after:prep school:n .",
            "The:d old:adj dog:n sleeps:v quietly:adv under:prep the:d big:adj table:n .",
            "They:pr usually:adv take:v the:d bus:n because:conj it:pr is:v cheap:adj .",
            "Ben:n and:conj Sarah:n carefully:adv read:v the:d long:adj letter:n from:prep their:d|pr bank:n .",
        ];
        const parse = (s) => s.split(" ").reduce((out, t) => {
            if (!t.includes(":")) { out[out.length - 1].punct += t; return out; }
            const [w, tag] = t.split(":"), [main, alt = ""] = tag.split("|");
            out.push({ w, main, alt, punct: "" });
            return out;
        }, []);
        let si = Math.floor(Math.random() * SENTENCES.length);

        const play = () => {
            const words = parse(SENTENCES[si % SENTENCES.length]);
            const steps = Object.keys(CLS).filter((c) => words.some((x) => x.main === c));
            let step = 0, perfect = 0, checked = false;
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><p class="eyebrow">${T.eyebrow}</p><h1>🔍 ${T.parts}</h1>
                <p class="as-lead">${T.partsLead}</p>
                <div class="gm-parts" data-box></div>
                <p class="as-disclaimer">${T.privacy}</p>`;
            const box = root.querySelector("[data-box]");
            const sentence = (cls) => `<p class="gm-pt-sentence">${words.map((x, k) => `<button type="button" class="gm-pt-word${cls ? ` is-${x.main}` : ""}" data-k="${k}" aria-pressed="false">${esc(x.w)}${cls ? `<small>${de ? CLS[x.main].de : CLS[x.main].en}</small>` : ""}</button>${x.punct ? `<span class="gm-pt-punct">${esc(x.punct)}</span>` : ""}`).join(" ")}</p>`;

            const show = () => {
                checked = false;
                const c = steps[step];
                box.innerHTML = `<div class="gm-pt-steps" aria-label="${T.partsStep(step + 1, steps.length)}">${steps.map((s, k) => `<span class="${k < step ? "is-done" : k === step ? "is-on" : ""}"></span>`).join("")}</div>
                    <p class="gm-pt-task">${T.partsMark} ${CLS[c].task}</p>
                    <p class="gm-pt-hint">💡 ${CLS[c].hint}</p>
                    ${sentence(false)}
                    <div class="gm-pt-actions"><button type="button" class="button primary" data-check>✓ ${T.partsCheck}</button></div>
                    <p class="gm-pt-feedback" data-fb aria-live="polite"></p>`;
                box.querySelectorAll(".gm-pt-word").forEach((b) => b.addEventListener("click", () => {
                    say(words[b.dataset.k].w);
                    if (checked) return;
                    b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
                }));
                box.querySelector("[data-check]").addEventListener("click", (e) => {
                    if (checked) { step += 1; return step < steps.length ? show() : finish(); }
                    checked = true;
                    let ok = true;
                    box.querySelectorAll(".gm-pt-word").forEach((b) => {
                        const x = words[b.dataset.k], on = b.getAttribute("aria-pressed") === "true";
                        if (x.main === c) { b.classList.add(on ? "is-right" : "is-missed"); if (!on) ok = false; }
                        else if (on && x.alt === c) b.classList.add("is-right");
                        else if (on) { b.classList.add("is-wrong"); ok = false; }
                    });
                    if (ok) perfect += 1;
                    sfx(ok ? "correct" : "wrong");
                    box.querySelector("[data-fb]").innerHTML = ok ? `🎉 ${T.partsRight}` : T.partsAlmost;
                    box.querySelector("[data-fb]").className = `gm-pt-feedback ${ok ? "is-ok" : "is-no"}`;
                    e.currentTarget.textContent = step + 1 < steps.length ? `${T.partsNext} →` : `${T.partsDone} →`;
                });
            };

            const finish = () => {
                data.best.parts = (data.best.parts || 0) + 1; // number of sentences broken down so far
                sfx("complete"); // the whole sentence is done
                save();
                const used = Object.keys(CLS).filter((c) => words.some((x) => x.main === c));
                box.innerHTML = `<p class="gm-pt-task">${T.partsBreakdown}</p>
                    ${sentence(true)}
                    <ul class="gm-pt-legend">${used.map((c) => `<li class="is-${c}">${de ? `${CLS[c].de} <em>(${CLS[c].en})</em>` : CLS[c].en}</li>`).join("")}</ul>
                    <p class="gm-pt-score">${T.partsScore(perfect, steps.length)}</p>
                    <div class="gm-pt-actions"><button type="button" class="button primary" data-again>${T.partsAnother} →</button></div>`;
                box.querySelectorAll(".gm-pt-word").forEach((b) => b.addEventListener("click", () => say(words[b.dataset.k].w)));
                box.querySelector("[data-again]").addEventListener("click", () => { si += 1; play(); });
            };
            show();
        };
        play();
        return;
    }

    // ---------- Typing Race ----------
    if (game === "race") {
        document.title = `${T.race} – ${T.title} | Nawee`;
        const sentences = (typeof READINGS === "undefined" ? [] : READINGS).flatMap((r) =>
            r.paragraphs.map((p) => ({ text: plain(p), from: r.title, reading: r })).filter((x) => x.text.length >= 90 && x.text.length <= 260));
        const BOTS = [[14, 24], [22, 36], [34, 55]]; // WPM of Tom and Ben per level
        let level = 1;
        // race tracks: scenery along the road; under water everyone wears a diving mask
        const TRACKS = {
            mountains: { icon: "🏔️", deco: ["🌲", "⛰️", "🌲", "🌲"] },
            park: { icon: "🌳", deco: ["🌳", "🌷", "🌼", "🌳"] },
            underwater: { icon: "🌊", deco: ["🫧", "🐟", "🐠", "🫧"], mask: true },
        };
        let track = "random";
        try { track = localStorage.getItem("nawee-race-track") || "random"; } catch { /* ignore */ }
        const setup = () => {
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><p class="eyebrow">${T.eyebrow}</p><h1>🏁 ${T.race}</h1>
                <p class="as-lead">${T.raceText}</p>
                <p class="gm-label">${T.level}</p>
                <div class="gm-choices">${T.levels.map((l, i) => `<button type="button" class="gm-choice${i === level ? " is-on" : ""}" data-level="${i}">${l}<small>${BOTS[i][0]}–${BOTS[i][1]} ${T.wpm}</small></button>`).join("")}</div>
                <p class="gm-label">${T.track}</p>
                <div class="gm-choices gm-tracks">${["random", ...Object.keys(TRACKS)].map((k) => `<button type="button" class="gm-choice${k === track ? " is-on" : ""}" data-track="${k}">${k === "random" ? "🎲" : TRACKS[k].icon} ${T.tracks[k]}</button>`).join("")}</div>
                <button type="button" class="button primary gm-start" data-start>${T.start} →</button>
                <p class="as-note">${T.tipRace}</p>
                ${data.best.race ? `<p class="gm-best">🏅 ${T.best}: <strong>${data.best.race} ${T.wpm}</strong></p>` : ""}
                <p class="as-disclaimer">${T.privacy}</p>`;
            root.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => {
                level = Number(b.dataset.level);
                root.querySelectorAll("[data-level]").forEach((x) => x.classList.toggle("is-on", x === b));
            }));
            root.querySelectorAll("[data-track]").forEach((b) => b.addEventListener("click", () => {
                track = b.dataset.track;
                try { localStorage.setItem("nawee-race-track", track); } catch { /* ignore */ }
                root.querySelectorAll("[data-track]").forEach((x) => x.classList.toggle("is-on", x === b));
            }));
            root.querySelector("[data-start]").addEventListener("click", race);
        };
        const race = () => {
            const pick = sentences[Math.floor(Math.random() * sentences.length)] || { text: "The quick brown fox jumps over the lazy dog.", from: "" };
            const text = pick.text;
            const racers = [{ name: T.you, car: "🚴", you: true }, { name: "Tom", car: "🚴🏻‍♂️", wpm: BOTS[level][0] }, { name: "Ben", car: "🚴🏽‍♂️", wpm: BOTS[level][1] }]; // plain bikers (no 🚵 – it has a background)
            const trackIds = Object.keys(TRACKS), tk = track === "random" ? trackIds[Math.floor(Math.random() * trackIds.length)] : track, TK = TRACKS[tk];
            const deco = (lane) => [12, 34, 58, 80].map((x, j) => `<span class="gm-deco" style="left:${x + ((lane * 7 + j * 3) % 9)}%">${TK.deco[(lane + j) % TK.deco.length]}</span>`).join("");
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><h1>🏁 ${T.race}</h1>
                <div class="gm-track trk-${tk}" aria-label="${T.tracks[tk]}">${racers.map((r, i) => `<div class="gm-lane"><span class="gm-name">${r.name}</span><span class="gm-road">${deco(i)}<span class="gm-car" data-car="${i}">${r.car}${TK.mask ? '<i class="gm-mask" aria-hidden="true">🤿</i>' : ""}</span><span class="gm-flag" aria-hidden="true">🏁</span></span></div>`).join("")}</div>
                <p class="gm-count" data-count>${T.countdown} 3</p>
                <div class="gm-text" data-text aria-live="off"></div>
                <p class="gm-from">${T.from}: ${esc(pick.from)}</p>
                <input class="gm-input" data-input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}" disabled>
                <div class="gm-stats" data-stats></div>
                <div data-live-words>${glossary(true)}</div>`;
            const box = root.querySelector("[data-text]"), input = root.querySelector("[data-input]");
            // tap a word in the list to hear it – then straight back to typing
            root.querySelector("[data-live-words]").addEventListener("click", (e) => {
                const w = e.target.closest("[data-say]");
                if (!w) return;
                say(w.dataset.say);
                if (!youDone) input.focus();
            });
            let pos = 0, wrong = "", keys = 0, mistakes = 0, t0 = 0, timer = null, finishedBots = [], youDone = false;
            const draw = () => {
                box.innerHTML = `<span class="gm-done">${esc(text.slice(0, pos))}</span>${wrong ? `<span class="gm-wrong">${esc(text.slice(pos, pos + wrong.length) || " ")}</span>` : ""}<span class="gm-cur">${esc(text.charAt(pos + wrong.length) || "")}</span>${esc(text.slice(pos + wrong.length + 1))}`;
            };
            const move = (i, share) => { root.querySelector(`[data-car="${i}"]`).style.left = `calc(${Math.min(1, share) * 100}% * 0.92)`; };
            const minutes = () => (performance.now() - t0) / 60000;
            const tick = () => {
                racers.forEach((r, i) => {
                    if (r.you) return;
                    const share = (r.wpm * 5 * minutes()) / text.length;
                    move(i, share);
                    if (share >= 1 && !finishedBots.includes(i)) finishedBots.push(i);
                });
                const wpm = Math.round((pos / 5) / Math.max(minutes(), 0.01));
                root.querySelector("[data-stats]").innerHTML = `<span><strong>${pos ? wpm : 0}</strong> ${T.wpm}</span><span><strong>${keys ? Math.round(((keys - mistakes) / keys) * 100) : 100}%</strong> ${T.acc}</span>`;
            };
            // after the race: the meanings of the words from this text (the ones in the typed part first)
            function glossary(live) {
                const r = pick.reading;
                if (!r || !r.glossary) return "";
                const lower = text.toLowerCase();
                if (live) {  // while racing: only the words that are in this text, tap to hear
                    const inText = Object.entries(r.glossary).filter(([w]) => lower.includes(w.toLowerCase()));
                    if (!inText.length) return "";
                    return `<div class="gm-words gm-words-live"><h2>${T.wordsLive}</h2><p class="gm-words-tap">🔊 ${T.wordsTap}</p>
                        <dl>${inText.map(([w, g]) => `<div><dt><button type="button" data-say="${esc(w)}">${esc(w)}</button></dt><dd>${esc(de ? g.de : g.en)}</dd></div>`).join("")}</dl></div>`;
                }
                const entries = Object.entries(r.glossary).sort(([a], [b]) => lower.includes(b.toLowerCase()) - lower.includes(a.toLowerCase()));
                return `<div class="gm-words"><h2>${T.words}</h2>
                    <dl>${entries.map(([w, g]) => `<div${lower.includes(w.toLowerCase()) ? ' class="is-typed"' : ""}><dt>${esc(w)}</dt><dd>${esc(de ? g.de : g.en)}</dd></div>`).join("")}</dl>
                    <a class="gm-read" href="${T.readPage}?t=${r.id}">${T.readAll}</a></div>`;
            }
            const end = () => {
                clearInterval(timer);
                move(0, 1);
                youDone = true; input.disabled = true;
                const wpm = Math.round((text.length / 5) / minutes());
                const acc = keys ? Math.round(((keys - mistakes) / keys) * 100) : 100;
                const place = finishedBots.length;
                const newBest = wpm > (data.best.race || 0);
                if (newBest) data.best.race = wpm;
                save();
                root.querySelector("[data-stats]").innerHTML = `<div class="gm-result">
                    <p class="gm-place">${T.place[place]}</p>
                    <p><strong>${wpm}</strong> ${T.wpmLong} · <strong>${acc}%</strong> ${T.acc}${newBest ? ` · <span class="gm-new">${T.newBest}</span>` : ""}</p>
                    <button type="button" class="button primary" data-again>${T.again}</button>
                </div>${glossary()}`;
                root.querySelector("[data-live-words]").innerHTML = "";  // the full list (above) replaces the live one
                root.querySelector("[data-again]").addEventListener("click", race);
            };
            input.addEventListener("input", () => {
                if (youDone) return;
                const v = input.value;
                // compare what was typed after the last correct position
                keys += 1;
                const expected = text.slice(pos, pos + v.length);
                if (v === expected) {
                    wrong = "";
                    if (v.endsWith(" ") || pos + v.length === text.length) { pos += v.length; input.value = ""; }
                } else {
                    let ok = 0; while (ok < v.length && v[ok] === expected[ok]) ok += 1;
                    if (!wrong) mistakes += 1;
                    wrong = v.slice(ok);
                }
                const typedOk = pos + (wrong ? 0 : input.value.length);
                move(0, typedOk / text.length);
                draw();
                if (pos >= text.length) end();
            });
            draw();
            let n = 3;
            const count = root.querySelector("[data-count]");
            const cd = setInterval(() => {
                n -= 1;
                if (n > 0) { count.textContent = `${T.countdown} ${n}`; return; }
                clearInterval(cd);
                count.textContent = "Go!";
                input.disabled = false; input.focus();
                t0 = performance.now();
                timer = setInterval(tick, 100);
            }, 800);
        };
        setup();
        return;
    }

    // ---------- Word & Meaning: type "word - short definition", 10 items ----------
    if (game === "define") {
        document.title = `${T.define} – ${T.title} | Nawee`;
        const pool = typeof VOCAB_DECKS === "undefined" ? [] : Object.entries(VOCAB_DECKS).flatMap(([d, deck]) =>
            deck.words.filter((w) => w.def).map((w) => ({ ...w, img: `assets/vocab/${d}/${w.id}.svg`, line: plain(`${w.word} - ${w.def}`) })));
        const play = () => {
            const items = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
            let i = 0, chars = 0, keys = 0, mistakes = 0, t0 = 0;
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><h1>📝 ${T.define}</h1>
                <div class="gm-def">
                    <p class="gm-def-count" data-count></p>
                    <span class="dash-bar gm-def-bar"><span data-bar style="width:0%"></span></span>
                    <img class="gm-def-img" data-img alt="">
                    <button type="button" class="gm-say" data-say aria-label="${de ? "Wort anhören" : "Hear the word"}">🔊 <span data-word></span></button>
                    <div class="gm-text gm-def-line" data-text title="${de ? "Auf ein Wort tippen, um es zu hören" : "Tap a word to hear it"}"></div>
                    <p class="gm-def-hint">🔊 ${de ? "Tipp auf ein Wort, um es zu hören." : "Tap any word to hear it."}</p>
                    <input class="gm-input" data-input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}">
                    <p class="gm-def-de" data-de></p>
                </div>
                <div class="gm-stats" data-stats></div>`;
            const box = root.querySelector("[data-text]"), input = root.querySelector("[data-input]");
            let text = "", typed = "";
            const draw = () => {
                let ok = 0; while (ok < typed.length && typed[ok] === text[ok]) ok += 1;
                const bad = typed.slice(ok);
                box.innerHTML = `<span class="gm-done">${esc(text.slice(0, ok))}</span>${bad ? `<span class="gm-wrong">${esc(text.slice(ok, ok + bad.length) || " ")}</span>` : ""}<span class="gm-cur">${esc(text.charAt(ok + bad.length))}</span>${esc(text.slice(ok + bad.length + 1))}`;
            };
            const show = () => {
                const w = items[i];
                text = w.line; typed = ""; input.value = "";
                root.querySelector("[data-count]").textContent = T.item(i + 1, items.length);
                root.querySelector("[data-bar]").style.width = `${(i / items.length) * 100}%`;
                root.querySelector("[data-img]").src = w.img;
                root.querySelector("[data-de]").innerHTML = "&nbsp;";
                root.querySelector("[data-word]").textContent = w.word;
                draw();
                input.focus();
                say(w.word, w.audio); // hear the word when it appears
            };
            const finish = () => {
                const secs = (performance.now() - t0) / 1000;
                const wpm = Math.round((chars / 5) / (secs / 60));
                const acc = keys ? Math.round(((keys - mistakes) / keys) * 100) : 100;
                const newBest = wpm > (data.best.define || 0);
                if (newBest) data.best.define = wpm;
                save();
                root.querySelector("[data-bar]").style.width = "100%";
                input.disabled = true;
                root.querySelector("[data-stats]").innerHTML = `<div class="gm-result">
                    <p class="gm-place">${T.round} ✓</p>
                    <p><strong>${wpm}</strong> ${T.wpmLong} · <strong>${acc}%</strong> ${T.acc} · <strong>${Math.round(secs)}</strong> ${T.sec}${newBest ? ` · <span class="gm-new">${T.newBest}</span>` : ""}</p>
                    <button type="button" class="button primary" data-again>${T.again}</button>
                </div>
                <div class="gm-words"><h2>${T.typed}</h2><dl>${items.map((w, k) => `<div><dt><button type="button" class="gm-say-word" data-sayw="${k}">🔊 ${esc(w.word)}</button></dt><dd><button type="button" class="gm-say-def" data-sayd="${k}">${esc(w.def)}</button>${de ? ` · <em>${esc(w.de)}</em>` : ""}</dd></div>`).join("")}</dl></div>`;
                root.querySelectorAll("[data-sayw]").forEach((b) => b.addEventListener("click", () => { const w = items[Number(b.dataset.sayw)]; say(w.word, w.audio); }));
                root.querySelectorAll("[data-sayd]").forEach((b) => b.addEventListener("click", () => say(items[Number(b.dataset.sayd)].def)));
                root.querySelector("[data-again]").addEventListener("click", play);
            };
            input.addEventListener("input", () => {
                if (!t0) t0 = performance.now();
                const before = typed;
                // the dash fills itself in: after the word, a space (or a dash) becomes " - "
                const word = items[i].word, sep = `${word} - `;
                const v = input.value;
                if (v === `${word} ` || v === `${word}-` || v === `${word} -`) input.value = sep;
                else if (v === `${sep}-` || v === `${sep} `) input.value = sep; // typed the dash or a space anyway
                typed = input.value;
                if (typed.length > before.length) {
                    keys += 1;
                    if (text.slice(0, typed.length) !== typed && text.slice(0, before.length) === before) mistakes += 1;
                }
                draw();
                if (typed === text) {
                    chars += text.length + 1;
                    root.querySelector("[data-de]").textContent = de ? `${T.german}: ${items[i].de}` : "✓";
                    i += 1;
                    input.disabled = true;
                    setTimeout(() => { input.disabled = false; if (i >= items.length) finish(); else show(); }, de ? 700 : 300);
                }
            });
            root.querySelector("[data-say]").addEventListener("click", () => { const w = items[Math.min(i, items.length - 1)]; say(w.word, w.audio); input.focus(); });
            // tap any word of the line to hear it (find the word under the click in the plain text)
            box.addEventListener("click", (e) => {
                const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
                const pos = document.caretPositionFromPoint ? document.caretPositionFromPoint(e.clientX, e.clientY) : null;
                const node = r ? r.startContainer : pos?.offsetNode, offset = r ? r.startOffset : pos?.offset;
                if (!node || !box.contains(node)) return;
                let at = offset;
                const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
                for (let n = walk.nextNode(); n && n !== node; n = walk.nextNode()) at += n.textContent.length;
                let a = at, b = at;
                while (a > 0 && /[A-Za-z’']/.test(text[a - 1])) a -= 1;
                while (b < text.length && /[A-Za-z’']/.test(text[b])) b += 1;
                const word = text.slice(a, b);
                const w = items[Math.min(i, items.length - 1)];
                if (word) say(word, word.toLowerCase() === w.word.toLowerCase() ? w.audio : null);
                input.focus();
            });
            show();
        };
        play();
        return;
    }

    // ---------- Rhyme Time: a word + rhymes for exposure; speak or rap; optional timer ----------
    if (game === "rhyme") {
        document.title = `${T.rhyme} – ${T.title} | Nawee`;
        const RHYMES = [
            ["cat", "hat", "bat", "mat", "sat", "that", "flat"], ["day", "say", "play", "way", "stay", "pay"], ["night", "light", "right", "bright", "white", "write"],
            ["time", "rhyme", "lime", "climb", "dime"], ["car", "star", "far", "bar", "jar"], ["cake", "make", "take", "lake", "bake", "wake"],
            ["rain", "train", "brain", "main", "plain", "chain"], ["blue", "you", "new", "true", "two", "shoe"], ["sun", "fun", "run", "one", "done", "won"],
            ["bed", "red", "said", "head", "bread"], ["book", "look", "cook", "took", "hook"], ["go", "no", "so", "show", "know", "slow"],
            ["tree", "me", "see", "free", "three", "tea"], ["ring", "sing", "king", "thing", "spring", "bring"], ["cold", "old", "gold", "told", "hold", "sold"],
            ["door", "four", "more", "floor", "store"], ["boat", "coat", "note", "goat", "wrote"], ["feet", "meet", "street", "eat", "sweet", "seat"],
            ["cool", "school", "pool", "rule", "tool"], ["sleep", "keep", "deep", "sheep", "cheap"], ["friend", "end", "send", "spend", "bend"],
            ["phone", "alone", "own", "bone", "stone", "known"], ["dog", "frog", "log", "fog", "jog"], ["hand", "land", "stand", "band", "sand"],
            ["name", "game", "same", "came", "frame"], ["bike", "like", "hike", "Mike"], ["ball", "all", "call", "tall", "wall", "small"],
            ["green", "seen", "clean", "mean", "queen"], ["fast", "last", "past", "cast"], ["best", "rest", "test", "west", "guest", "nest"],
            ["moon", "soon", "spoon", "noon", "June"], ["hot", "not", "lot", "got", "spot"], ["heart", "start", "part", "art", "smart"],
            ["fish", "dish", "wish"], ["love", "above", "glove"], ["house", "mouse"],
        ];
        // a memorable little rhyme for every word family (heard with the browser voice)
        const LINES = {
            cat: "The cat in the hat sat on a mat.", day: "Every day I like to play.", night: "Turn on the light – it’s dark at night.",
            time: "It’s time to climb and make a rhyme.", car: "I drive my car – it isn’t far.", cake: "I bake a cake down by the lake.",
            rain: "I take the train when there’s rain.", blue: "I have one blue shoe – and you have two.", sun: "We run in the sun and have some fun.",
            bed: "I go to bed with a sleepy head.", book: "Come and look at my new book.", go: "When we go, it starts to snow.",
            tree: "Come and see the big green tree.", ring: "The king can sing and wear a ring.", cold: "The night is cold – my hand you hold.",
            door: "Close the door, then clean the floor.", boat: "Wear a coat on the boat.", feet: "Wash your feet before you eat.",
            cool: "School is cool, and so is the pool.", sleep: "Count the sheep and go to sleep.", friend: "A good friend is there till the end.",
            phone: "I’m all alone with my phone.", dog: "The dog in the fog sat on a log.", hand: "Give me a hand – let’s start a band.",
            name: "What’s your name? Let’s play a game.", bike: "I like to ride my bike.", ball: "The tall boy threw the ball at the wall.",
            green: "The grass is green and clean.", fast: "He ran so fast – he wasn’t last.", best: "You did your best – now take a rest.",
            moon: "See you soon under the moon.", hot: "It’s hot – I like it a lot!", heart: "Follow your heart and make a start.",
            fish: "I make a wish for a fish on a dish.", love: "The stars above are full of love.", house: "There’s a mouse in my house!",
        };
        let secs = 20, beatId = "boombap", volume = 0.6;

        // ---- own beats, synthesized live with the Web Audio API (no audio files, no licenses) ----
        const BEATS = {
            boombap: { name: "Boom Bap", bpm: 90, kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 41], [7, 41], [10, 44]], chords: null },
            lofi: { name: "Lo-fi", bpm: 75, kick: [0, 8, 11], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 45], [8, 41]], chords: [[57, 60, 64, 67], [53, 57, 60, 64]] },
            trap: { name: "Trap", bpm: 140, kick: [0, 3, 10], snare: [8], hat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], bass: [[0, 36], [3, 36], [10, 39]], chords: null, halfTime: true },
            jazzhop: { name: "Jazz Hop", bpm: 85, kick: [0, 6, 10], snare: [4, 12], hat: [0, 3, 4, 7, 8, 11, 12, 15], bass: [[0, 43], [6, 46], [10, 41]], chords: [[55, 59, 62, 65], [53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60]] },
        };
        let ctx = null, master = null, beatTimer = null, nextTime = 0, stepNo = 0;
        const noiseBuffer = () => {
            const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
            const d = b.getChannelData(0);
            for (let k = 0; k < d.length; k += 1) d[k] = Math.random() * 2 - 1;
            return b;
        };
        let noise = null;
        const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);
        const kick = (t) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
            g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            o.connect(g).connect(master); o.start(t); o.stop(t + 0.36);
        };
        const snare = (t) => {
            const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
            n.buffer = noise; f.type = "highpass"; f.frequency.value = 1500;
            g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            n.connect(f).connect(g).connect(master); n.start(t); n.stop(t + 0.2);
            const o = ctx.createOscillator(), g2 = ctx.createGain();
            o.frequency.value = 190; g2.gain.setValueAtTime(0.3, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            o.connect(g2).connect(master); o.start(t); o.stop(t + 0.12);
        };
        const hat = (t, loud) => {
            const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
            n.buffer = noise; f.type = "highpass"; f.frequency.value = 7000;
            g.gain.setValueAtTime(loud ? 0.22 : 0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            n.connect(f).connect(g).connect(master); n.start(t); n.stop(t + 0.06);
        };
        const bass = (t, midi, len) => {
            const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
            o.type = "sawtooth"; o.frequency.value = freq(midi); f.type = "lowpass"; f.frequency.value = 320;
            g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + len);
            o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + len + 0.05);
        };
        const chord = (t, notes, len) => notes.forEach((m) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = "triangle"; o.frequency.value = freq(m);
            g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + len);
            o.connect(g).connect(master); o.start(t); o.stop(t + len + 0.1);
        });
        const schedule = () => {
            const b = BEATS[beatId];
            const step = 60 / b.bpm / 4 * (b.halfTime ? 1 : 1);
            while (nextTime < ctx.currentTime + 0.15) {
                const i16 = stepNo % 16, bar = Math.floor(stepNo / 16);
                if (b.kick.includes(i16)) kick(nextTime);
                if (b.snare.includes(i16)) snare(nextTime);
                if (b.hat.includes(i16)) hat(nextTime, i16 % 4 === 0);
                b.bass.forEach(([at, m]) => { if (at === i16) bass(nextTime, m, step * 3); });
                if (b.chords && i16 === 0) chord(nextTime, b.chords[bar % b.chords.length], step * 15);
                nextTime += step; stepNo += 1;
            }
        };
        const startBeat = () => {
            stopBeat();
            if (beatId === "off") return;
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            ctx = ctx || new AC();
            ctx.resume();
            noise = noise || noiseBuffer();
            master = ctx.createGain(); master.gain.value = volume * 0.7; master.connect(ctx.destination);
            nextTime = ctx.currentTime + 0.05; stepNo = 0;
            beatTimer = setInterval(schedule, 40);
        };
        const stopBeat = () => {
            clearInterval(beatTimer); beatTimer = null;
            if (master) { try { master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); } catch { /* ignore */ } master = null; }
        };
        window.addEventListener("pagehide", stopBeat);

        const setup = () => {
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><p class="eyebrow">${T.eyebrow}</p><h1>🎤 ${T.rhyme}</h1>
                <p class="as-lead">${T.rhymeText}</p>
                <p class="gm-label">${T.timer}</p>
                <div class="gm-choices">${[0, 10, 20, 30].map((t) => `<button type="button" class="gm-choice${t === secs ? " is-on" : ""}" data-secs="${t}">${t ? `${t} s` : T.off}</button>`).join("")}</div>
                <p class="gm-label">${T.beat}</p>
                <div class="gm-choices">${[["off", T.off], ...Object.entries(BEATS).map(([id, b]) => [id, `${b.name} <small>${b.bpm} BPM</small>`])].map(([id, label]) => `<button type="button" class="gm-choice${id === beatId ? " is-on" : ""}" data-beat="${id}">${label}</button>`).join("")}</div>
                <p class="as-note">🎧 ${T.beatNote}</p>
                <div class="gm-yt">
                    <p><strong>${T.ytTitle}</strong></p>
                    <p class="gm-yt-links">${[["Boom Bap", "boom bap instrumental"], ["Lo-fi", "lofi hip hop instrumental"], ["Trap", "trap instrumental"], ["Old School", "old school hip hop instrumental"], ["Jazz Rap", "jazz rap instrumental"]]
                        .map(([label, q]) => `<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(q)}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`).join("")}</p>
                    <p class="gm-yt-note">${T.ytNote}</p>
                </div>
                <button type="button" class="button primary gm-start" data-start>${T.start} →</button>
                <p class="as-disclaimer">${T.privacy}</p>`;
            root.querySelectorAll("[data-beat]").forEach((b) => b.addEventListener("click", () => {
                beatId = b.dataset.beat;
                root.querySelectorAll("[data-beat]").forEach((x) => x.classList.toggle("is-on", x === b));
            }));
            root.querySelectorAll("[data-secs]").forEach((b) => b.addEventListener("click", () => {
                secs = Number(b.dataset.secs);
                root.querySelectorAll("[data-secs]").forEach((x) => x.classList.toggle("is-on", x === b));
            }));
            root.querySelector("[data-start]").addEventListener("click", play);
        };
        const play = () => {
            const order = [...RHYMES].sort(() => Math.random() - 0.5);
            let i = 0, done = 0, timer = null, left = 0;
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><h1>🎤 ${T.rhyme}</h1>
                <div class="gm-rhyme">
                    <span class="dash-bar gm-rhyme-bar" ${secs ? "" : "hidden"}><span data-time style="width:100%"></span></span>
                    <button type="button" class="gm-rhyme-word" data-word></button>
                    <p class="gm-rhyme-label">${T.rhymesWith}</p>
                    <div class="gm-rhyme-list" data-list></div>
                    <button type="button" class="gm-rhyme-line" data-line hidden></button>
                    <p class="gm-rhyme-task">🗣️ ${T.rhymeTask}</p>
                    <div class="gm-rhyme-actions"><button type="button" class="button primary" data-next>${T.nextWord} →</button><button type="button" class="button secondary" data-stop>${T.stop}</button></div>
                    <div class="gm-player" data-player>
                        <button type="button" class="gm-pl-btn" data-pl-prev aria-label="${de ? "Vorheriger Beat" : "Previous beat"}">⏮</button>
                        <button type="button" class="gm-pl-play" data-pl-play aria-label="Play/Pause"></button>
                        <button type="button" class="gm-pl-btn" data-pl-next aria-label="${de ? "Nächster Beat" : "Next beat"}">⏭</button>
                        <span class="gm-pl-info"><span class="gm-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong data-pl-name></strong><small data-pl-bpm></small></span>
                        <label class="gm-pl-vol">🔊 <input type="range" min="0" max="1" step="0.05" value="${volume}" data-volume aria-label="${T.volume}"></label>
                    </div>
                    <p class="gm-rhyme-count" data-count></p>
                </div>`;
            const show = () => {
                const [word, ...rhymes] = order[i % order.length];
                const wordBtn = root.querySelector("[data-word]");
                wordBtn.innerHTML = `🔊 ${esc(word)}`;
                wordBtn.onclick = () => say(word);
                const list = root.querySelector("[data-list]");
                const meaning = (w) => (typeof RHYME_MEANINGS !== "undefined" && RHYME_MEANINGS[w] ? RHYME_MEANINGS[w][de ? 0 : 1] : "");
                list.innerHTML = [...rhymes].sort(() => Math.random() - 0.5).map((r) => `<button type="button" class="gm-rhyme-chip" data-w="${esc(r)}"><span>${esc(r)}</span>${meaning(r) ? `<small>${esc(meaning(r))}</small>` : ""}</button>`).join("");
                list.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { b.classList.add("is-shown"); say(b.dataset.w); }));
                const lineBtn = root.querySelector("[data-line]"), line = LINES[word];
                lineBtn.hidden = !line;
                if (line) { lineBtn.innerHTML = `<small>💡 ${T.rhymeLine}</small>🔊 ${esc(line)}`; lineBtn.onclick = () => say(line); }
                root.querySelector("[data-count]").textContent = done ? T.words2(done) : "";
                say(word); // hear the word when it appears
                clearInterval(timer);
                if (secs) {
                    left = secs * 10;
                    const bar = root.querySelector("[data-time]");
                    bar.style.width = "100%";
                    timer = setInterval(() => {
                        left -= 1;
                        bar.style.width = `${(left / (secs * 10)) * 100}%`;
                        if (left <= 0) next();
                    }, 100);
                }
            };
            const next = () => { done += 1; i += 1; show(); };
            const stop = () => {
                clearInterval(timer);
                stopBeat();
                if (done > (data.best.rhyme || 0)) data.best.rhyme = done;
                save();
                root.querySelector(".gm-rhyme").innerHTML = `<div class="gm-result"><p class="gm-place">${T.words2(done)} 🎤</p><button type="button" class="button primary" data-again>${T.again}</button></div>`;
                root.querySelector("[data-again]").addEventListener("click", play);
            };
            root.querySelector("[data-next]").addEventListener("click", next);
            root.querySelector("[data-stop]").addEventListener("click", stop);
            root.querySelector("[data-volume]")?.addEventListener("input", (e) => { volume = Number(e.target.value); if (master) master.gain.value = volume * 0.7; });
            // player bar: play/pause, previous/next beat
            const ids = Object.keys(BEATS);
            let current = beatId === "off" ? ids[0] : beatId, playingBeat = beatId !== "off";
            const player = root.querySelector("[data-player]");
            const drawPlayer = () => {
                player.querySelector("[data-pl-play]").textContent = playingBeat ? "⏸" : "▶";
                player.querySelector("[data-pl-name]").textContent = BEATS[current].name;
                player.querySelector("[data-pl-bpm]").textContent = `${BEATS[current].bpm} BPM`;
                player.classList.toggle("is-playing", playingBeat);
            };
            const go = () => { beatId = playingBeat ? current : "off"; if (playingBeat) startBeat(); else stopBeat(); drawPlayer(); };
            player.querySelector("[data-pl-play]").addEventListener("click", () => { playingBeat = !playingBeat; go(); });
            player.querySelector("[data-pl-next]").addEventListener("click", () => { current = ids[(ids.indexOf(current) + 1) % ids.length]; playingBeat = true; go(); });
            player.querySelector("[data-pl-prev]").addEventListener("click", () => { current = ids[(ids.indexOf(current) - 1 + ids.length) % ids.length]; playingBeat = true; go(); });
            drawPlayer();
            startBeat();
            window.addEventListener("pagehide", () => clearInterval(timer));
            show();
        };
        setup();
        return;
    }

    // ---------- Word Rain ----------
    document.title = `${T.rain} – ${T.title} | Nawee`;
    const words = typeof VOCAB_DECKS === "undefined" ? [] : Object.values(VOCAB_DECKS).flatMap((d) => d.words.map((w) => ({ en: w.word, de: w.de.split(",")[0].trim() })));
    let mode = 0;
    const setup = () => {
        root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><p class="eyebrow">${T.eyebrow}</p><h1>🌧️ ${T.rain}</h1>
            <p class="as-lead">${T.rainText}</p>
            <p class="gm-label">${T.mode}</p>
            <div class="gm-choices">${T.modes.map((m, i) => `<button type="button" class="gm-choice${i === mode ? " is-on" : ""}" data-mode="${i}">${m}</button>`).join("")}</div>
            <button type="button" class="button primary gm-start" data-start>${T.start} →</button>
            <p class="as-note">${T.rainTip}</p>
            ${data.best.rain ? `<p class="gm-best">🏅 ${T.best}: <strong>${data.best.rain} ${T.score}</strong></p>` : ""}
            <p class="as-disclaimer">${T.privacy}</p>`;
        root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
            mode = Number(b.dataset.mode);
            root.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("is-on", x === b));
        }));
        root.querySelector("[data-start]").addEventListener("click", play);
    };
    const play = () => {
        root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a>
            <div class="gm-hud"><span>${T.score}: <strong data-score>0</strong></span><span data-lives>❤️❤️❤️</span></div>
            <div class="gm-sky" data-sky><div class="gm-ground"></div></div>
            <input class="gm-input" data-input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeWord}">
            <p class="gm-missed" data-missed></p>`;
        const sky = root.querySelector("[data-sky]"), input = root.querySelector("[data-input]");
        let drops = [], score = 0, lives = 3, last = performance.now(), spawnIn = 0, speed = 38, running = true, missed = [];
        const H = () => sky.clientHeight - 40;
        const spawn = () => {
            const w = words[Math.floor(Math.random() * words.length)];
            if (!w || drops.some((d) => d.w.en === w.en)) return;
            const el = document.createElement("span");
            el.className = "gm-drop";
            el.innerHTML = mode ? `${esc(w.de)}` : `${esc(w.en)}`;
            el.style.left = `${8 + Math.random() * 70}%`;
            sky.append(el);
            drops.push({ w, el, y: -10 });
        };
        const hearts = () => { root.querySelector("[data-lives]").textContent = "❤️".repeat(lives) + "🤍".repeat(3 - lives); };
        const over = () => {
            running = false;
            input.disabled = true;
            const newBest = score > (data.best.rain || 0);
            if (newBest) data.best.rain = score;
            save();
            const box = document.createElement("div");
            box.className = "gm-over";
            box.innerHTML = `<p class="gm-place">${T.over}</p><p><strong>${score}</strong> ${T.score}${newBest ? ` · <span class="gm-new">${T.newBest}</span>` : ""}</p><button type="button" class="button primary" data-again>${T.again}</button>`;
            sky.append(box);
            box.querySelector("[data-again]").addEventListener("click", play);
            if (missed.length) root.querySelector("[data-missed]").innerHTML = `${T.missed} ${missed.map((m) => `<strong>${esc(m.en)}</strong> (${esc(m.de)})`).join(", ")}`;
        };
        const frame = (now) => {
            if (!running) return;
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            spawnIn -= dt;
            if (spawnIn <= 0) { spawn(); spawnIn = Math.max(1.1, 2.6 - score / 120); }
            speed = 38 + score / 4;
            drops.forEach((d) => { d.y += speed * dt; d.el.style.top = `${d.y}px`; });
            const landed = drops.filter((d) => d.y >= H());
            landed.forEach((d) => { d.el.remove(); lives -= 1; missed.push(d.w); });
            if (landed.length) { drops = drops.filter((d) => d.y < H()); hearts(); sky.classList.add("is-hit"); setTimeout(() => sky.classList.remove("is-hit"), 250); }
            if (lives <= 0) { over(); return; }
            requestAnimationFrame(frame);
        };
        input.addEventListener("input", () => {
            const v = input.value.trim().toLowerCase();
            const hit = drops.find((d) => d.w.en.toLowerCase() === v);
            drops.forEach((d) => d.el.classList.toggle("is-match", Boolean(v) && d.w.en.toLowerCase().startsWith(v)));
            if (!hit) return;
            score += 10 + hit.w.en.length;
            root.querySelector("[data-score]").textContent = score;
            hit.el.classList.add("is-pop");
            if (mode) hit.el.textContent = hit.w.en;
            setTimeout(() => hit.el.remove(), 300);
            drops = drops.filter((d) => d !== hit);
            input.value = "";
        });
        input.focus();
        requestAnimationFrame((t) => { last = t; frame(t); });
    };
    setup();
})();
