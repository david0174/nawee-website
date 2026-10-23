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
        typeWord: "Wort tippen …", missed: "Verpasst:", words: "Wörter aus diesem Text", readAll: "Ganzen Text lesen →", readPage: "lesen.html",
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
        typeWord: "Type the word …", missed: "Missed:", words: "Words from this text", readAll: "Read the whole text →", readPage: "reading.html",
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
    const plain = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...");

    const game = new URLSearchParams(location.search).get("g");

    // ---------- overview ----------
    if (game !== "race" && game !== "rain") {
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
