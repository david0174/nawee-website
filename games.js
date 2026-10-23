// Typing games (spiele.html / games.html): overview, "Typing Race" (?g=race: type a short English text and race
// against Tom and Ben) and "Word Rain" (?g=rain: type the falling words before they land; optional German → English).
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
        level: "Gegner", levels: ["Gemütlich", "Normal", "Schnell"], start: "Start", you: "Du", countdown: "Los in",
        typeHere: "Hier tippen …", from: "Text aus", wpm: "WPM", wpmLong: "Wörter pro Minute", acc: "Genauigkeit", place: ["1. Platz! 🏆", "2. Platz 🥈", "3. Platz 🥉"],
        again: "Nochmal", newBest: "Neuer Bestwert!", tipRace: "Tipp: Fehler musst du korrigieren, bevor es weitergeht. Genau ist schneller als hektisch.",
        mode: "Modus", modes: ["Abtippen", "Übersetzen (DE → EN)"], score: "Punkte", lives: "Leben", over: "Spiel vorbei!", rainTip: "Wort eintippen – Enter oder Leertaste ist nicht nötig.",
        rhyme: "Reim-Zeit", rhymeText: "Ein Wort, ein paar Reime – und du sprichst: Bau laut einen Satz oder rap ein paar Zeilen. Mit Timer, wenn du willst.", timer: "Timer pro Wort", off: "Aus", beat: "Beat", volume: "Lautstärke", beatNote: "Die Beats werden live in deinem Browser erzeugt – eigene Beats, frei von Lizenzen.", nextWord: "Nächstes Wort", rhymesWith: "Reimt sich auf", rhymeTask: "Sag laut einen Satz mit dem Wort und einem Reim – oder rap ein paar Zeilen!", words2: (n) => `${n} ${n === 1 ? "Wort" : "Wörter"} geschafft`, stop: "Beenden",
        typeWord: "Wort tippen …", missed: "Verpasst:", define: "Wort & Bedeutung", defineText: "Tippe ein Wort und seine kurze englische Bedeutung, z. B. „key it opens a lock“ – den Strich setzt das Spiel für dich. 10 schnelle Runden – so lernst du Wörter auf Englisch zu erklären.", item: (i, n) => `${i} / ${n}`, round: "Runde geschafft!", time: "Zeit", sec: "Sek.", typed: "Getippt", german: "Deutsch", words: "Wörter aus diesem Text", readAll: "Ganzen Text lesen →", readPage: "lesen.html",
        privacy: "Deine Bestwerte werden in diesem Browser gespeichert – mit einem <a href=\"konto.html\">kostenlosen Konto</a> auch in deinem Konto.",
    } : {
        eyebrow: "GAMES", title: "Games", lead: "Type English, get faster, remember words – with texts and words from your course.",
        best: "Best", none: "Not played yet", play: "Play →", back: "← All games",
        race: "Typing Race", raceText: "Type a short English text as fast and accurately as you can – and race against Tom and Ben.",
        rain: "Word Rain", rainText: "English words fall from the sky. Type them before they reach the bottom. It keeps getting faster!",
        level: "Opponents", levels: ["Relaxed", "Normal", "Fast"], start: "Start", you: "You", countdown: "Starting in",
        typeHere: "Type here …", from: "Text from", wpm: "WPM", wpmLong: "words per minute", acc: "Accuracy", place: ["1st place! 🏆", "2nd place 🥈", "3rd place 🥉"],
        again: "Play again", newBest: "New best!", tipRace: "Tip: fix a mistake before you can go on. Accurate is faster than rushed.",
        mode: "Mode", modes: ["Copy", "Translate (DE → EN)"], score: "Score", lives: "Lives", over: "Game over!", rainTip: "Type the word – no need to press Enter or space.",
        rhyme: "Rhyme Time", rhymeText: "One word, a few rhymes – and you speak: make a sentence out loud or rap a few lines. With a timer if you like.", timer: "Timer per word", off: "Off", beat: "Beat", volume: "Volume", beatNote: "The beats are generated live in your browser – our own beats, free of any licenses.", nextWord: "Next word", rhymesWith: "Rhymes with", rhymeTask: "Say a sentence out loud with the word and a rhyme – or rap a few lines!", words2: (n) => `${n} ${n === 1 ? "word" : "words"} done`, stop: "Stop",
        typeWord: "Type the word …", missed: "Missed:", define: "Word & Meaning", defineText: "Type a word and its short English meaning, e.g. “key it opens a lock” – the game adds the dash for you. 10 quick rounds – learn to explain words in English.", item: (i, n) => `${i} / ${n}`, round: "Round complete!", time: "Time", sec: "sec", typed: "Typed", german: "German", words: "Words from this text", readAll: "Read the whole text →", readPage: "reading.html",
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
    const plain = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...");

    const game = new URLSearchParams(location.search).get("g");

    // ---------- overview ----------
    if (!["race", "rain", "define", "rhyme"].includes(game)) {
        document.title = `${T.title} | Nawee`;
        const tile = (g, icon, title, text, best) => `<a class="gm-tile" href="${page}?g=${g}">
            <span class="gm-tile-icon" aria-hidden="true">${icon}</span>
            <span class="gm-tile-body"><strong>${title}</strong><span>${text}</span>
            <span class="gm-tile-best">${best ? `🏅 ${T.best}: ${best}` : T.none}</span></span>
            <span class="gm-tile-go">${T.play}</span>
        </a>`;
        root.innerHTML = `<p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p>
            <div class="gm-tiles">
                ${tile("race", "🏁", T.race, T.raceText, data.best.race ? `${data.best.race} ${T.wpm}` : "")}
                ${tile("rain", "🌧️", T.rain, T.rainText, data.best.rain ? `${data.best.rain} ${T.score}` : "")}
                ${tile("define", "📝", T.define, T.defineText, data.best.define ? `${data.best.define} ${T.wpm}` : "")}
                ${tile("rhyme", "🎤", T.rhyme, T.rhymeText, data.best.rhyme ? T.words2(data.best.rhyme) : "")}
            </div>
            <p class="as-disclaimer">${T.privacy}</p>`;
        return;
    }

    // ---------- Typing Race ----------
    if (game === "race") {
        document.title = `${T.race} – ${T.title} | Nawee`;
        const sentences = (typeof READINGS === "undefined" ? [] : READINGS).flatMap((r) =>
            r.paragraphs.map((p) => ({ text: plain(p), from: r.title, reading: r })).filter((x) => x.text.length >= 90 && x.text.length <= 260));
        const BOTS = [[14, 24], [22, 36], [34, 55]]; // WPM of Tom and Ben per level
        let level = 1;
        const setup = () => {
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><p class="eyebrow">${T.eyebrow}</p><h1>🏁 ${T.race}</h1>
                <p class="as-lead">${T.raceText}</p>
                <p class="gm-label">${T.level}</p>
                <div class="gm-choices">${T.levels.map((l, i) => `<button type="button" class="gm-choice${i === level ? " is-on" : ""}" data-level="${i}">${l}<small>${BOTS[i][0]}–${BOTS[i][1]} ${T.wpm}</small></button>`).join("")}</div>
                <button type="button" class="button primary gm-start" data-start>${T.start} →</button>
                <p class="as-note">${T.tipRace}</p>
                ${data.best.race ? `<p class="gm-best">🏅 ${T.best}: <strong>${data.best.race} ${T.wpm}</strong></p>` : ""}
                <p class="as-disclaimer">${T.privacy}</p>`;
            root.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => {
                level = Number(b.dataset.level);
                root.querySelectorAll("[data-level]").forEach((x) => x.classList.toggle("is-on", x === b));
            }));
            root.querySelector("[data-start]").addEventListener("click", race);
        };
        const race = () => {
            const pick = sentences[Math.floor(Math.random() * sentences.length)] || { text: "The quick brown fox jumps over the lazy dog.", from: "" };
            const text = pick.text;
            const racers = [{ name: T.you, car: "🚗", you: true }, { name: "Tom", car: "🚙", wpm: BOTS[level][0] }, { name: "Ben", car: "🏎️", wpm: BOTS[level][1] }];
            root.innerHTML = `<a class="lesson-back" href="${page}">${T.back}</a><h1>🏁 ${T.race}</h1>
                <div class="gm-track">${racers.map((r, i) => `<div class="gm-lane"><span class="gm-name">${r.name}</span><span class="gm-road"><span class="gm-car" data-car="${i}">${r.car}</span><span class="gm-flag" aria-hidden="true">🏁</span></span></div>`).join("")}</div>
                <p class="gm-count" data-count>${T.countdown} 3</p>
                <div class="gm-text" data-text aria-live="off"></div>
                <p class="gm-from">${T.from}: ${esc(pick.from)}</p>
                <input class="gm-input" data-input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${T.typeHere}" disabled>
                <div class="gm-stats" data-stats></div>`;
            const box = root.querySelector("[data-text]"), input = root.querySelector("[data-input]");
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
            const glossary = () => {
                const r = pick.reading;
                if (!r || !r.glossary) return "";
                const lower = text.toLowerCase();
                const entries = Object.entries(r.glossary).sort(([a], [b]) => lower.includes(b.toLowerCase()) - lower.includes(a.toLowerCase()));
                return `<div class="gm-words"><h2>${T.words}</h2>
                    <dl>${entries.map(([w, g]) => `<div${lower.includes(w.toLowerCase()) ? ' class="is-typed"' : ""}><dt>${esc(w)}</dt><dd>${esc(de ? g.de : g.en)}</dd></div>`).join("")}</dl>
                    <a class="gm-read" href="${T.readPage}?t=${r.id}">${T.readAll}</a></div>`;
            };
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
        let secs = 20, beatId = "boombap", volume = 0.6;

        // ---- own beats, synthesized live with the Web Audio API (no audio files, no licenses) ----
        const BEATS = {
            boombap: { name: "Boom Bap", bpm: 90, kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 41], [7, 41], [10, 44]], chords: null },
            lofi: { name: "Lo-fi", bpm: 75, kick: [0, 8, 11], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 45], [8, 41]], chords: [[57, 60, 64, 67], [53, 57, 60, 64]] },
            trap: { name: "Trap", bpm: 140, kick: [0, 3, 10], snare: [8], hat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], bass: [[0, 36], [3, 36], [10, 39]], chords: null, halfTime: true },
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
                    <p class="gm-rhyme-task">🗣️ ${T.rhymeTask}</p>
                    <div class="gm-rhyme-actions"><button type="button" class="button primary" data-next>${T.nextWord} →</button><button type="button" class="button secondary" data-stop>${T.stop}</button></div>
                    ${beatId !== "off" ? `<label class="gm-volume">🎧 ${BEATS[beatId].name} · ${T.volume} <input type="range" min="0" max="1" step="0.05" value="${volume}" data-volume></label>` : ""}
                    <p class="gm-rhyme-count" data-count></p>
                </div>`;
            const show = () => {
                const [word, ...rhymes] = order[i % order.length];
                const wordBtn = root.querySelector("[data-word]");
                wordBtn.innerHTML = `🔊 ${esc(word)}`;
                wordBtn.onclick = () => say(word);
                const list = root.querySelector("[data-list]");
                list.innerHTML = [...rhymes].sort(() => Math.random() - 0.5).map((r) => `<button type="button" class="gm-rhyme-chip">${esc(r)}</button>`).join("");
                list.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => say(b.textContent)));
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
