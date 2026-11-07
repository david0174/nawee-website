// Reading practice (lesen.html / reading.html): overview of all texts (news + stories), and one text with
// read-aloud (sentence highlight), tap-a-word glossary, three questions and one question to answer out loud.
// Progress ("nawee-reading-v1") is stored in this browser and, with an account, synced by account.js.

(() => {
    const root = document.querySelector("[data-reading]");
    if (!root || typeof READINGS === "undefined") return;

    const de = document.documentElement.lang === "de", tr = document.documentElement.lang === "tr";
    const KEY = "nawee-reading-v1";
    const page = de ? "lesen.html" : tr ? "reading-tr.html" : "reading.html";
    const grammarPage = de ? "grammatik.html" : tr ? "grammar-tr.html" : "grammar.html";
    // grammar title in the page language (Turkish titles come from grammar-tr.js when it's loaded)
    const gTitle = (x) => (tr && typeof GRAMMAR_TR !== "undefined" && GRAMMAR_TR[x.id] ? GRAMMAR_TR[x.id].title : de ? x.title.de : x.title.en);
    const T = tr ? {
        eyebrow: "OKUMA", title: "Okuma metinleri", lead: "Okuyup dinleyebileceğin kısa İngilizce metinler: gerçek olaylar hakkında basit haberler ve Tom ile Ben’in hikâyeleri. İpucu: önce oku, sonra dinle – ve sonunda yüksek sesle cevap ver.",
        news: "Haberler", stories: "Hikâyeler", weekly: "Haftanın metni", weeklyLead: "Her pazartesi yeni – A1’den C1’e her seviye için bir metin. Seviyeni seç (ya da bir üstünü dene).", weeklyOld: "Önceki haftaların metinleri", filterLabel: "Seviyem:", all: "Hepsi", noneAtLevel: "Bu seviyede burada henüz bir şey yok – başka bir seviyeye bak ya da yakında tekrar gel.", newReads: "Yeni metinler", newStories: "Yeni hikâyeler", doneReads: "Okunan metinler", doneStories: "Okunan hikâyeler", allDone: "Hepsini okudun 🎉 – yeni metinler yolda.", completed: "✓ Okundu", grammarIn: "Bu metindeki dilbilgisi:", markDone: "✓ Okundu olarak işaretle", markUndo: "↩ Okunmadı olarak işaretle", markedNote: "Okundu olarak işaretlendi – bu metni artık “Okunan” bölümünde bulursun.", weekOf: (d) => new Date(d + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " haftası", done: (s, n) => `✓ Okundu · ${n} sorudan ${s} doğru`, start: "Oku →",
        back: "← Tüm metinler", listen: "▶ Sesli oku", stop: "■ Durdur", slow: "Daha yavaş", tapHint: "İpucu: altı çizili bir kelimeye dokun – kelimeyi duyarsın ve Türkçe anlamını görürsün.", soundOn: "Kelime telaffuzunu kapat", soundOff: "Kelime telaffuzunu aç",
        questions: "Anladın mı?", right: "Doğru!", wrong: "Tam değil – doğru cevap:", speakTitle: "Bunun hakkında konuş", speakHint: "Yüksek sesle İngilizce cevap ver. Sonra örnekle karşılaştır.",
        showModel: "Örneği göster", source: "Kaynak", ownWords: "kendi basit kelimelerimizle", result: (s, n) => `${n} sorudan ${s} doğru – aferin!`, next: "Sonraki metin →",
        date: (d) => new Date(d + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
        privacy: "Okuma ilerlemen bu tarayıcıda kaydedilir – <a href=\"account-tr.html\">ücretsiz bir hesapla</a> hesabında da.",
        special: ["YENİ · BETA", "Dilbilgisi", "İngilizcenin kuralları, basitçe anlatılmış →", "ÖZEL", "İngilizcenin tarihi", "Tek bir zaman çizelgesinde 2000 yıl →"],
    } : de ? {
        eyebrow: "LESEN", title: "Lesetexte", lead: "Kurze englische Texte zum Lesen und Hören: einfache Nachrichten über echte Ereignisse und Geschichten mit Tom und Ben. Tipp: Erst lesen, dann anhören – und am Ende laut antworten.",
        news: "Nachrichten", stories: "Geschichten", weekly: "Lesetext der Woche", weeklyLead: "Jeden Montag neu – ein Text für jedes Niveau von A1 bis C1. Such dir dein Niveau aus (oder probier eins höher).", weeklyOld: "Frühere Wochentexte", filterLabel: "Mein Niveau:", all: "Alle", noneAtLevel: "Auf diesem Niveau gibt es hier noch nichts – schau bei einem anderen Niveau oder bald wieder vorbei.", newReads: "Neue Lesetexte", newStories: "Neue Geschichten", doneReads: "Gelesene Texte", doneStories: "Gelesene Geschichten", allDone: "Alles gelesen 🎉 – bald kommt Neues.", completed: "✓ Gelesen", grammarIn: "Grammatik in diesem Text:", markDone: "✓ Als gelesen markieren", markUndo: "↩ Doch nicht gelesen", markedNote: "Als gelesen markiert – du findest den Text jetzt unter „Gelesen“.", weekOf: (d) => "Woche vom " + new Date(d + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long" }), done: (s, n) => `✓ Gelesen · ${s}/${n} richtig`, start: "Lesen →",
        back: "← Alle Texte", listen: "▶ Vorlesen", stop: "■ Stopp", slow: "Langsamer", tapHint: "Tipp: Tippe auf ein unterstrichenes Wort – du hörst es und siehst die Übersetzung.", soundOn: "Aussprache der Wörter ausschalten", soundOff: "Aussprache der Wörter einschalten",
        questions: "Hast du es verstanden?", right: "Richtig!", wrong: "Nicht ganz – richtig ist:", speakTitle: "Sprich darüber", speakHint: "Antworte laut auf Englisch. Dann vergleich mit dem Beispiel.",
        showModel: "Beispiel zeigen", source: "Quelle", ownWords: "in unseren eigenen, einfachen Worten", result: (s, n) => `${s} von ${n} richtig – gut gemacht!`, next: "Nächster Text →",
        date: (d) => new Date(d + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
        privacy: "Dein Lesestand wird in diesem Browser gespeichert – mit einem <a href=\"konto.html\">kostenlosen Konto</a> auch in deinem Konto.",
    } : {
        eyebrow: "READING", title: "Reading practice", lead: "Short English texts to read and listen to: simple news about real events and stories with Tom and Ben. Tip: read first, then listen – and answer out loud at the end.",
        news: "News", stories: "Stories", weekly: "Weekly read", weeklyLead: "New every Monday – one text for every level from A1 to C1. Pick your level (or try one higher).", weeklyOld: "Earlier weekly reads", filterLabel: "My level:", all: "All", noneAtLevel: "Nothing at this level here yet – try another level or check back soon.", newReads: "New reads", newStories: "New stories", doneReads: "Completed reads", doneStories: "Completed stories", allDone: "All read 🎉 – new texts are on the way.", completed: "✓ Completed", grammarIn: "Grammar in this text:", markDone: "✓ Mark as completed", markUndo: "↩ Mark as not completed", markedNote: "Marked as completed – you’ll find this text under “Completed” now.", weekOf: (d) => "Week of " + new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" }), done: (s, n) => `✓ Read · ${s}/${n} correct`, start: "Read →",
        back: "← All texts", listen: "▶ Read aloud", stop: "■ Stop", slow: "Slower", tapHint: "Tip: tap an underlined word to hear it and see what it means.", soundOn: "Turn word pronunciation off", soundOff: "Turn word pronunciation on",
        questions: "Did you understand?", right: "Correct!", wrong: "Not quite – the answer is:", speakTitle: "Talk about it", speakHint: "Answer out loud in English. Then compare with the example.",
        showModel: "Show example", source: "Source", ownWords: "in our own simple words", result: (s, n) => `${s} of ${n} correct – well done!`, next: "Next text →",
        date: (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        privacy: "Your reading progress is saved in this browser – and with a <a href=\"account.html\">free account</a> in your account too.",
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const data = Object.assign({ done: {} }, load());
    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
        window.dispatchEvent(new Event("nawee:progress")); // account.js saves it to the account (if logged in)
    };

    const id = new URLSearchParams(location.search).get("t");
    const text = READINGS.find((r) => r.id === id);
    if (text) document.documentElement.classList.add("read-progress");  // gold progress bar while reading (style.css)

    // ---------- overview ----------
    const card = (r) => {
        const d = data.done[r.id];
        return `<a class="rd-card${d ? " is-done" : ""}" href="${page}?t=${r.id}">
            <span class="rd-card-icon" aria-hidden="true">${r.image || "📖"}</span>
            <span class="rd-card-body">
                <span class="rd-card-meta">${r.level}${r.date ? ` · ${T.date(r.date)}` : ""}</span>
                <strong>${esc(r.title)}</strong>
                <span class="rd-card-status">${d ? (d.of ? T.done(d.score, d.of) : T.completed) : T.start}</span>
            </span>
        </a>`;
    };
    if (!text) {
        // level filter (David, 2026-11-05): show only one reading level if the learner wants – remembered in this browser
        const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
        const LVL_KEY = "nawee-reading-level";
        let lvl = "";
        try { lvl = localStorage.getItem(LVL_KEY) || ""; } catch { /* storage unavailable */ }
        const pick = (r) => !lvl || r.level === lvl;
        const draw = () => {
            const news = READINGS.filter((r) => r.kind === "news" && pick(r)).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            const stories = READINGS.filter((r) => r.kind === "story" && pick(r));
            // weekly read: the newest week that has started (a set can be prepared ahead and appears on its Monday)
        
            const today = new Date().toISOString().slice(0, 10);
            const weeks = [...new Set(READINGS.filter((r) => r.kind === "weekly" && r.week <= today).map((r) => r.week))].sort().reverse();
            const byLevel = (a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);
            const thisWeek = weeks[0] ? READINGS.filter((r) => r.kind === "weekly" && r.week === weeks[0] && pick(r)).sort(byLevel) : [];
            const older = READINGS.filter((r) => r.kind === "weekly" && weeks.slice(1).includes(r.week) && pick(r)).sort((a, b) => b.week.localeCompare(a.week) || byLevel(a, b));
            // "reads" = news + earlier weekly texts (this week's set stays in its own block on top)
            const reads = [...news, ...older];
            const list = (items, all) => (items.length ? `<div class="rd-list">${items.map(card).join("")}</div>` : `<p class="rd-alldone">${lvl && !all.length ? T.noneAtLevel : T.allDone}</p>`);
            document.title = `${T.title} | Nawee`;
            root.innerHTML = `<p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="as-lead">${T.lead}</p>
                <div class="rd-filter" role="group" aria-label="${T.filterLabel}"><span>${T.filterLabel}</span>${["", "A1", "A2", "B1", "B2", "C1"].map((l) => `<button type="button" class="rd-chip${l === lvl ? " is-on" : ""}" data-lvl="${l}" aria-pressed="${l === lvl}">${l || T.all}</button>`).join("")}</div>
                ${thisWeek.length ? `<section class="rd-weekly" id="weekly"><h2 class="rd-group">📅 ${T.weekly} <span class="rd-week">${T.weekOf(weeks[0])}</span></h2><p class="rd-weekly-lead">${T.weeklyLead}</p><div class="rd-list">${thisWeek.map(card).join("")}</div></section>` : ""}
                <h2 class="rd-group">📰 ${T.newReads}</h2>${list(reads.filter((r) => !data.done[r.id]), reads)}
                <h2 class="rd-group">📖 ${T.newStories}</h2>${list(stories.filter((r) => !data.done[r.id]), stories)}
                ${reads.some((r) => data.done[r.id]) ? `<h2 class="rd-group rd-group--done">✓ ${T.doneReads}</h2><div class="rd-list rd-list--done">${reads.filter((r) => data.done[r.id]).map(card).join("")}</div>` : ""}
                ${stories.some((r) => data.done[r.id]) ? `<h2 class="rd-group rd-group--done">✓ ${T.doneStories}</h2><div class="rd-list rd-list--done">${stories.filter((r) => data.done[r.id]).map(card).join("")}</div>` : ""}
                <a class="rd-card rd-special" href="${grammarPage}">
                <span class="rd-card-icon" aria-hidden="true">📐</span>
                <span class="rd-card-body"><span class="rd-card-meta">${tr ? T.special[0] : de ? "NEU · BETA" : "NEW · BETA"}</span><strong>${tr ? T.special[1] : de ? "Grammatik" : "Grammar"}</strong><span class="rd-card-status">${tr ? T.special[2] : de ? "Die Regeln hinter dem Englischen, kurz erklärt →" : "The rules behind English, explained simply →"}</span></span>
            </a>
            <a class="rd-card rd-special" href="${de ? "geschichte-englisch.html" : "history-of-english.html"}">
                    <span class="rd-card-icon" aria-hidden="true">📜</span>
                    <span class="rd-card-body"><span class="rd-card-meta">${tr ? T.special[3] : de ? "SPEZIAL" : "SPECIAL"}</span><strong>${tr ? T.special[4] : de ? "Die Geschichte des Englischen" : "The history of English"}</strong><span class="rd-card-status">${tr ? T.special[5] : de ? "2000 Jahre in einem Zeitstrahl →" : "2,000 years on one timeline →"}</span></span>
                </a>
                <p class="as-disclaimer">${T.privacy}</p>`;
            root.querySelectorAll("[data-lvl]").forEach((b) => b.addEventListener("click", () => {
                lvl = b.dataset.lvl;
                try { if (lvl) localStorage.setItem(LVL_KEY, lvl); else localStorage.removeItem(LVL_KEY); } catch { /* ignore */ }
                draw();
            }));
        };
        draw();
        return;
    }

    // ---------- one text ----------
    document.title = `${text.title} – ${T.title} | Nawee`;
    const sentences = (p) => p.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [p];
    // wrap glossary words (longest first, whole words, case-insensitive) in buttons
    const keys = Object.keys(text.glossary || {}).sort((a, b) => b.length - a.length);
    const marked = (s) => {
        // placeholders first, so a shorter word can't match inside an already marked one
        const found = [];
        let html = esc(s);
        keys.forEach((k) => {
            const re = new RegExp(`(^|[^A-Za-z])(${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![A-Za-z])`, "i");
            html = html.replace(re, (m, pre, w) => { found.push([k, w]); return `${pre}\u0000${found.length - 1}\u0001`; });
        });
        return html.replace(/\u0000(\d+)\u0001/g, (m, i) => `<button type="button" class="rd-word" data-k="${esc(found[i][0])}">${found[i][1]}</button>`);
    };
    let n = 0;
    const body = text.paragraphs.map((p) => `<p>${sentences(p).map((s) => `<span class="rd-s" data-i="${n++}">${marked(s)}</span>`).join("")}</p>`).join("");
    const all = text.paragraphs.flatMap(sentences);
    const nextText = READINGS[(READINGS.indexOf(text) + 1) % READINGS.length];

    root.innerHTML = `<button type="button" class="rd-sound" data-word-sound></button>
        <a class="lesson-back" href="${page}">${T.back}</a>
        <p class="eyebrow">${(text.kind === "news" ? T.news : text.kind === "weekly" ? T.weekly : T.stories).toUpperCase()} · ${text.level}${text.date ? ` · ${T.date(text.date).toUpperCase()}` : ""}</p>
        <h1>${esc(text.title)}</h1>
        <div class="rd-controls"><button type="button" class="button primary rd-listen" data-listen>${T.listen}</button>
            <label class="rd-slow"><input type="checkbox" data-slow> ${T.slow}</label></div>
        <p class="as-note">${T.tapHint}</p>
        <div class="rd-text">${body}</div>
        <p class="rd-gloss" data-gloss hidden></p>
        ${text.source ? `<p class="rd-source">${T.source}: <a href="${text.source.url}" target="_blank" rel="noopener">${esc(text.source.name)} ↗</a> – ${T.ownWords}</p>` : ""}
        <section class="rd-section"><h2>${T.questions}</h2><div data-questions></div><p class="rd-result" data-result hidden></p></section>
        <section class="rd-section rd-speak"><h2>🗣️ ${T.speakTitle}</h2><p class="rd-speak-q">${esc(text.speak.q)}</p><p class="as-note">${T.speakHint}</p>
            <button type="button" class="link-button" data-model>${T.showModel}</button><p class="rd-model" data-model-text hidden>${esc(text.speak.model)}</p></section>
        ${(text.grammar || []).filter((g) => typeof GRAMMAR !== "undefined" && GRAMMAR.some((x) => x.id === g)).map((g) => { const x = GRAMMAR.find((y) => y.id === g); return `<p class="rd-grammar">📐 ${T.grammarIn} <a href="${grammarPage}?l=${g}">${esc(gTitle(x))} →</a></p>`; }).join("")}
        <p class="rd-next"><button type="button" class="button primary" data-mark></button> <a class="button secondary" href="${page}?t=${nextText.id}">${T.next}</a></p>
        <p class="rd-marked" data-marked hidden>${T.markedNote}</p>
        <p class="as-disclaimer">${T.privacy}</p>`;

    // mark as completed (or undo) – also set automatically after answering all questions
    const markBtn = root.querySelector("[data-mark]");
    const paintMark = () => { markBtn.textContent = data.done[text.id] ? T.markUndo : T.markDone; markBtn.classList.toggle("primary", !data.done[text.id]); markBtn.classList.toggle("secondary", !!data.done[text.id]); };
    markBtn.addEventListener("click", () => {
        const was = !!data.done[text.id];
        if (was) delete data.done[text.id]; else data.done[text.id] = { date: new Date().toISOString().slice(0, 10) };
        save(); paintMark();
        root.querySelector("[data-marked]").hidden = was;
    });
    paintMark();

    // glossary
    const gloss = root.querySelector("[data-gloss]");
    root.querySelectorAll(".rd-word").forEach((b) => b.addEventListener("click", () => {
        const g = text.glossary[b.dataset.k];
        root.querySelectorAll(".rd-word.is-open").forEach((x) => x.classList.remove("is-open"));
        b.classList.add("is-open");
        const gt = tr && typeof READING_TR !== "undefined" && READING_TR[text.id] ? READING_TR[text.id][b.dataset.k] : "";
        gloss.textContent = de ? g.de : gt || g.en;  // only the meaning – the word itself is right next to it (David, 2026-11-05)
        speakWord(b.textContent);
        gloss.hidden = false;
        b.after(gloss);
    }));

    // read aloud: David's recording if there is one, otherwise the browser voice sentence by sentence
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const listenBtn = root.querySelector("[data-listen]");
    let playing = false, audio = null;
    const stop = () => {
        playing = false; synth?.cancel(); if (audio) { audio.pause(); audio = null; }
        root.querySelectorAll(".rd-s.is-reading").forEach((s) => s.classList.remove("is-reading"));
        listenBtn.textContent = T.listen;
    };
    const voice = () => synth?.getVoices().find((v) => /en.US/i.test(v.lang) && /samantha|alex|google us english|aaron|allison|ava/i.test(v.name))
        || synth?.getVoices().find((v) => /^en/i.test(v.lang)) || null;
    const readFrom = (i) => {
        if (!playing || i >= all.length) { stop(); return; }
        root.querySelectorAll(".rd-s").forEach((s) => s.classList.toggle("is-reading", Number(s.dataset.i) === i));
        const u = new SpeechSynthesisUtterance(all[i]);
        u.lang = "en-US"; u.rate = root.querySelector("[data-slow]").checked ? 0.7 : 0.9;
        const v = voice(); if (v) u.voice = v;
        u.onend = () => readFrom(i + 1);
        synth.speak(u);
    };
    listenBtn.addEventListener("click", () => {
        if (playing) { stop(); return; }
        playing = true; listenBtn.textContent = T.stop;
        if (text.audio) { audio = new Audio(text.audio); audio.onended = stop; audio.play().catch(stop); return; }
        if (!synth) { stop(); return; }
        synth.cancel(); readFrom(0);
    });
    window.addEventListener("pagehide", stop);

    // tapping a word also speaks it (browser voice); 🔊 at the top right of the article turns that off (remembered)
    const SOUND_KEY = "nawee-word-sound";
    let wordSound = true;
    try { wordSound = localStorage.getItem(SOUND_KEY) !== "off"; } catch (e) { /* private mode */ }
    const soundBtn = root.querySelector("[data-word-sound]");
    const paintSound = () => {
        soundBtn.textContent = wordSound ? "🔊" : "🔇";
        soundBtn.setAttribute("aria-pressed", String(wordSound));
        soundBtn.setAttribute("aria-label", wordSound ? T.soundOn : T.soundOff);
        soundBtn.title = soundBtn.getAttribute("aria-label");
    };
    soundBtn.addEventListener("click", () => {
        wordSound = !wordSound;
        try { localStorage.setItem(SOUND_KEY, wordSound ? "on" : "off"); } catch (e) { /* ignore */ }
        paintSound();
    });
    paintSound();
    function speakWord(word) {
        if (!wordSound || !synth || playing) return;  // never interrupt "Read aloud"
        synth.cancel();
        const u = new SpeechSynthesisUtterance(word.trim());
        u.lang = "en-US"; u.rate = 0.85;
        const v = voice(); if (v) u.voice = v;
        synth.speak(u);
    }

    // questions
    const qBox = root.querySelector("[data-questions]");
    let answered = 0, score = 0;
    text.questions.forEach((q, qi) => {
        const wrap = document.createElement("div");
        wrap.className = "rd-q";
        const order = q.options.map((_, oi) => oi).sort(() => Math.random() - 0.5); // the right answer isn't always first
        wrap.innerHTML = `<p class="rd-q-text">${qi + 1}. ${esc(q.q)}</p><div class="rd-options">${order.map((oi) => `<button type="button" class="rd-option" data-o="${oi}">${esc(q.options[oi])}</button>`).join("")}</div><p class="rd-fb" hidden></p>`;
        wrap.querySelectorAll(".rd-option").forEach((b) => b.addEventListener("click", () => {
            const ok = Number(b.dataset.o) === q.answer;
            wrap.querySelectorAll(".rd-option").forEach((x) => { x.disabled = true; if (Number(x.dataset.o) === q.answer) x.classList.add("is-right"); });
            if (!ok) b.classList.add("is-wrong");
            const fb = wrap.querySelector(".rd-fb");
            fb.className = `rd-fb ${ok ? "is-right" : "is-wrong"}`;
            fb.textContent = ok ? `✓ ${T.right}` : `✗ ${T.wrong} ${q.options[q.answer]}`;
            fb.hidden = false;
            answered += 1; if (ok) score += 1;
            if (answered === text.questions.length) {
                const res = root.querySelector("[data-result]");
                res.textContent = T.result(score, text.questions.length);
                res.hidden = false;
                const prev = data.done[text.id];
                if (!prev || !prev.of || score >= prev.score) data.done[text.id] = { score, of: text.questions.length, date: new Date().toISOString().slice(0, 10) };
                save(); paintMark();
            }
        }));
        qBox.append(wrap);
    });

    root.querySelector("[data-model]").addEventListener("click", (e) => {
        root.querySelector("[data-model-text]").hidden = false;
        e.currentTarget.hidden = true;
    });
})();
