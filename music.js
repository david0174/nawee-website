// English through music (musik.html / music.html): song lessons built around real songs.
// COPYRIGHT: no lyrics, recordings or lyric videos on Nawee – the song is opened on YouTube (official video),
// everything here is Nawee's own: short phrases to listen for, meanings, our own example sentences, a quiz
// and speaking tasks. ?s=<id> opens a song; progress in localStorage "nawee-music-v1".

(() => {
    const root = document.querySelector("[data-music]");
    if (!root) return;
    const de = document.documentElement.lang.startsWith("de");
    const KEY = "nawee-music-v1";
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } };

    const SONGS = [
        {
            id: "count-on-me", title: "Count on Me", artist: "Bruno Mars", year: 2010, level: "A2", emoji: "🤝",
            topic: de ? "Freundschaft" : "Friendship",
            search: "Bruno Mars Count on Me official video",
            intro: de ? "Ein fröhlicher Song über Freundschaft: Egal, was passiert – ein guter Freund ist für dich da. Langsames Tempo und klare Aussprache, ideal zum Mithören."
                : "A happy song about friendship: whatever happens, a good friend is there for you. Slow and clear – great for listening.",
            phrases: [
                { en: "count on me", de: "dich auf mich verlassen", mean: "trust me to help you",
                  ex: "You can always count on me – just call." },
                { en: "I'll be there", de: "ich bin da (für dich)", mean: "I will come and help you",
                  ex: "Don’t worry, I’ll be there at eight." },
                { en: "stuck in the middle", de: "mittendrin festsitzen", mean: "you can’t move or get out",
                  ex: "I was stuck in the middle of a traffic jam." },
                { en: "tossing and turning", de: "sich (im Bett) hin und her wälzen", mean: "moving a lot in bed because you can’t sleep",
                  ex: "I was tossing and turning all night before the exam." },
                { en: "fall asleep", de: "einschlafen", mean: "start to sleep",
                  ex: "I usually fall asleep at eleven." },
                { en: "that’s what friends are supposed to do", de: "dafür sind Freunde da", mean: "friends should help each other",
                  ex: "“Thanks for helping me move!” – “No problem, that’s what friends are supposed to do.”" },
            ],
            quiz: [
                { q: de ? "„You can count on me“ bedeutet …" : "“You can count on me” means …",
                  a: [de ? "Du kannst dich auf mich verlassen." : "You can trust me to help.", de ? "Du kannst mit mir Zahlen zählen." : "You can count numbers with me.", de ? "Du schuldest mir Geld." : "You owe me money."], ok: 0 },
                { q: de ? "„I was tossing and turning“ bedeutet …" : "“I was tossing and turning” means …",
                  a: [de ? "Ich habe getanzt." : "I was dancing.", de ? "Ich konnte nicht gut schlafen." : "I couldn’t sleep well.", de ? "Ich habe gekocht." : "I was cooking."], ok: 1 },
                { q: de ? "Ergänze: „Thanks for your help!“ – „No problem, that’s what friends are ___ to do.“" : "Complete: “Thanks for your help!” – “No problem, that’s what friends are ___ to do.”",
                  a: ["supposed", "suppose", "supposing"], ok: 0 },
            ],
            speak: [
                { en: "Who can you count on? Say 2–3 sentences.", start: "I can always count on … When I …, he/she …" },
                { en: "Describe a night when you were tossing and turning.", start: "Once I was tossing and turning because …" },
            ],
        },
        {
            id: "dont-worry-be-happy", title: "Don’t Worry, Be Happy", artist: "Bobby McFerrin", year: 1988, level: "A2", emoji: "😊",
            topic: de ? "Positiv bleiben" : "Staying positive",
            search: "Bobby McFerrin Don't Worry Be Happy official video",
            intro: de ? "Der Gute-Laune-Klassiker: Bobby McFerrin singt fast nur mit seiner Stimme – langsam und deutlich. Du hörst viel Alltagsenglisch und auch etwas Umgangssprache, die du im Film und in Serien ständig hörst."
                : "The feel-good classic: Bobby McFerrin sings almost only with his voice – slowly and clearly. You hear a lot of everyday English and some informal language you hear all the time in films and series.",
            phrases: [
                { en: "don’t worry", de: "mach dir keine Sorgen", mean: "don’t feel nervous about it",
                  ex: "Don’t worry – we still have time." },
                { en: "have some trouble", de: "Probleme haben", mean: "have problems",
                  ex: "I had some trouble with my phone yesterday." },
                { en: "make it double", de: "es verdoppeln (schlimmer machen)", mean: "make it two times bigger",
                  ex: "If you shout at him, you’ll only make the problem double." },
                { en: "your rent is late", de: "deine Miete ist überfällig", mean: "you didn’t pay for your flat on time",
                  ex: "Sorry, my rent is late this month – I’ll pay on Friday." },
                { en: "ain’t got no …", de: "hab kein … (sehr umgangssprachlich)", mean: "don’t have any … (very informal)",
                  ex: "Song English: “I ain’t got no time.” – Normal English: “I don’t have any time.”" },
                { en: "bring everybody down", de: "alle runterziehen (traurig machen)", mean: "make other people feel sad",
                  ex: "Stop complaining – you’re bringing everybody down." },
                { en: "put a smile on your face", de: "lächle mal / setz ein Lächeln auf", mean: "smile",
                  ex: "This song always puts a smile on my face." },
            ],
            quiz: [
                { q: de ? "„When you worry, you make it double“ bedeutet …" : "“When you worry, you make it double” means …",
                  a: [de ? "Sorgen machen Probleme gefühlt größer." : "Worrying makes problems feel bigger.", de ? "Sorgen machen dich reich." : "Worrying makes you rich.", de ? "Du solltest zweimal singen." : "You should sing twice."], ok: 0 },
                { q: de ? "„I ain’t got no cash“ in normalem Englisch ist …" : "“I ain’t got no cash” in normal English is …",
                  a: ["I don’t have any money.", "I have a lot of money.", "I lost my card."], ok: 0 },
                { q: de ? "Ergänze: „Don’t be so negative – you’ll bring everybody ___.“" : "Complete: “Don’t be so negative – you’ll bring everybody ___.”",
                  a: ["up", "down", "over"], ok: 1 },
            ],
            speak: [
                { en: "What do you do when you worry? Say 2–3 sentences.", start: "When I worry, I usually … Then I try to …" },
                { en: "A friend is stressed. Give them some advice.", start: "Don’t worry! Why don’t you … ? Everything will be fine." },
            ],
        },
        {
            id: "abc", title: "ABC", artist: "The Jackson 5 (Michael Jackson)", year: 1970, level: "A2", emoji: "🔤",
            topic: de ? "Schule & Lernen" : "School & learning",
            search: "The Jackson 5 ABC official",
            intro: de ? "Der Klassiker der Jackson 5 – mit dem jungen Michael Jackson als Sänger. Passt perfekt zum Englischlernen: Es geht um Schule, Buchstaben und Zahlen. Das Tempo ist schnell – hör beim ersten Mal nur zu und achte auf den Refrain."
                : "The Jackson 5 classic – with young Michael Jackson singing lead. A perfect song for learners: it’s about school, letters and numbers. It’s fast – the first time, just listen and focus on the chorus.",
            phrases: [
                { en: "easy as one, two, three", de: "kinderleicht", mean: "very easy",
                  ex: "Setting up the app is easy as one, two, three." },
                { en: "take a seat", de: "nimm Platz / setz dich", mean: "please sit down (polite)",
                  ex: "Hello, Mr. Brown – please take a seat." },
                { en: "sit yourself down", de: "setz dich hin (locker)", mean: "sit down (friendly, informal)",
                  ex: "Sit yourself down – dinner is ready!" },
                { en: "repeat after me", de: "sprich mir nach", mean: "say the same words after I say them",
                  ex: "Repeat after me: “Could you say that again, please?”" },
                { en: "all you gotta do", de: "alles, was du tun musst (umgangssprachlich)", mean: "the only thing you have to do (informal)",
                  ex: "Song English: “All you gotta do is click here.” – Normal English: “All you have to do is click here.”" },
                { en: "get an A", de: "eine Eins bekommen", mean: "get the best grade at school",
                  ex: "She studied every day and got an A in math." },
                { en: "I before E, except after C", de: "Rechtschreibregel: i vor e, außer nach c", mean: "a spelling rule: “friend”, but “receive”",
                  ex: "I before E: “believe”, “friend” – except after C: “receive”, “ceiling”." },
            ],
            quiz: [
                { q: de ? "„Easy as one, two, three“ bedeutet …" : "“Easy as one, two, three” means …",
                  a: [de ? "sehr einfach" : "very easy", de ? "Es geht um Zahlen." : "It’s about numbers.", de ? "Es dauert drei Stunden." : "It takes three hours."], ok: 0 },
                { q: de ? "„All you gotta do is …“ in normalem Englisch ist …" : "“All you gotta do is …” in normal English is …",
                  a: ["All you have to do is …", "All you got is …", "You did all …"], ok: 0 },
                { q: de ? "In amerikanischen Schulen bedeutet „get an A“ …" : "In American schools, “get an A” means …",
                  a: [de ? "die schlechteste Note bekommen" : "get the worst grade", de ? "die beste Note bekommen" : "get the best grade", de ? "einen Brief vom Lehrer bekommen" : "get a letter from the teacher"], ok: 1 },
            ],
            speak: [
                { en: "Explain something easy to a friend – a recipe, an app or a game.", start: "It’s easy as one, two, three! First you … then you … All you have to do is …" },
                { en: "Talk about a subject you were good at in school.", start: "At school I always got an A in … because …" },
            ],
        },
    ];

    const T = de ? {
        back: "← Alle Songs", listen: "1. Hören", listenTxt: "Öffne den Song und hör ihn einmal ganz – ohne Text. Worum geht es? Wie ist die Stimmung?",
        open: "Song auf YouTube öffnen", hunt: "2. Satz-Jagd", huntTxt: "Hör den Song noch einmal. Tippe einen Ausdruck an, sobald du ihn hörst.",
        heard: "gehört", learn: "3. Verstehen & nachsprechen", learnTxt: "Tippe auf 🔊 und sprich jeden Ausdruck zweimal nach – dann das Beispiel.",
        quiz: "4. Kurz-Quiz", check: "Richtig! ✓", wrong: "Nicht ganz – versuch es noch einmal.",
        speak: "5. Selbst sprechen", speakTxt: "Sprich laut – auch wenn du allein bist. Diese Satzanfänge helfen dir:",
        done: "Song abschließen ✓", doneMsg: "Super! 🎵 Dieser Song ist abgeschlossen.", isDone: "✓ abgeschlossen",
        start: "Song-Lektion starten", note: "Songtext und Musik gehören den Rechteinhabern. Nawee verlinkt nur auf das offizielle Video und zeigt eigene Übungen.",
        sayIt: "Anhören", level: "Niveau",
    } : {
        back: "← All songs", listen: "1. Listen", listenTxt: "Open the song and listen to it once – without the lyrics. What is it about? How does it feel?",
        open: "Open the song on YouTube", hunt: "2. Phrase hunt", huntTxt: "Listen again. Tap a phrase as soon as you hear it.",
        heard: "heard", learn: "3. Understand & repeat", learnTxt: "Tap 🔊 and repeat each phrase twice – then the example.",
        quiz: "4. Quick quiz", check: "Correct! ✓", wrong: "Not quite – try again.",
        speak: "5. Speak yourself", speakTxt: "Say it out loud – even if you’re alone. These sentence starters help you:",
        done: "Finish this song ✓", doneMsg: "Great! 🎵 You finished this song.", isDone: "✓ finished",
        start: "Start the song lesson", note: "Lyrics and music belong to their owners. Nawee only links to the official video and shows its own exercises.",
        sayIt: "Listen", level: "Level",
    };

    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const say = (text) => {
        if (!synth) return;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, ""));
        u.lang = "en-US";
        u.rate = 0.85;
        const v = synth.getVoices().find((x) => /en.US/i.test(x.lang)) || synth.getVoices().find((x) => /^en/i.test(x.lang));
        if (v) u.voice = v;
        synth.speak(u);
    };
    const speakBtn = (text) => `<button type="button" class="mu-say" data-say="${esc(text)}" aria-label="${T.sayIt}: ${esc(text)}">🔊</button>`;

    const list = () => {
        const done = load();
        root.innerHTML = `<div class="mu-list">${SONGS.map((s) => `
            <a class="mu-card" href="?s=${s.id}">
                <span class="mu-emoji" aria-hidden="true">${s.emoji}</span>
                <span class="mu-card-text"><strong>${esc(s.title)}</strong><span>${esc(s.artist)} · ${esc(s.topic)}</span></span>
                <span class="mu-badge">${s.level}</span>
                ${done[s.id] ? `<span class="mu-done">${T.isDone}</span>` : ""}
            </a>`).join("")}</div>`;
    };

    const lesson = (s) => {
        const done = load();
        const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(s.search)}`;
        root.innerHTML = `
            <a class="page-back" href="?">${T.back}</a>
            <div class="mu-head">
                <span class="mu-emoji mu-emoji--big" aria-hidden="true">${s.emoji}</span>
                <div><h2>${esc(s.title)}</h2><p class="mu-meta">${esc(s.artist)} (${s.year}) · ${esc(s.topic)} · ${T.level} ${s.level}</p></div>
            </div>
            <p class="mu-intro">${esc(s.intro)}</p>

            <section class="mu-step"><h3>🎧 ${T.listen}</h3><p>${T.listenTxt}</p>
                <a class="button primary" href="${yt}" target="_blank" rel="noopener noreferrer">▶ ${T.open} <span aria-hidden="true">↗</span></a></section>

            <section class="mu-step"><h3>🔎 ${T.hunt}</h3><p>${T.huntTxt}</p>
                <div class="mu-hunt">${s.phrases.map((p, i) => `<button type="button" class="mu-chip" data-hunt="${i}" aria-pressed="false">${esc(p.en)}</button>`).join("")}</div>
                <p class="mu-count" data-hunt-count></p></section>

            <section class="mu-step"><h3>💡 ${T.learn}</h3><p>${T.learnTxt}</p>
                <ul class="mu-phrases">${s.phrases.map((p) => `<li>
                    <p class="mu-phrase">${speakBtn(p.en)} <strong>${esc(p.en)}</strong> <span>– ${esc(de ? p.de : p.mean)}</span></p>
                    <p class="mu-example">${speakBtn(p.ex)} <em>${esc(p.ex)}</em></p></li>`).join("")}</ul></section>

            <section class="mu-step"><h3>✅ ${T.quiz}</h3>
                ${s.quiz.map((q, i) => `<div class="mu-q" data-q="${i}"><p>${esc(q.q)}</p><div class="mu-answers">${q.a.map((a, j) => `<button type="button" data-a="${j}">${esc(a)}</button>`).join("")}</div><p class="mu-feedback" role="status"></p></div>`).join("")}</section>

            <section class="mu-step"><h3>🗣️ ${T.speak}</h3><p>${T.speakTxt}</p>
                <ul class="mu-speak">${s.speak.map((k) => `<li><strong>${esc(k.en)}</strong><br><span>${speakBtn(k.start)} <em>${esc(k.start)}</em></span></li>`).join("")}</ul></section>

            <div class="mu-finish">${done[s.id] ? `<p class="mu-done-msg">${T.doneMsg}</p>` : `<button type="button" class="button primary" data-finish>${T.done}</button>`}</div>
            <p class="mu-note">${T.note}</p>`;

        const heard = new Set();
        const count = root.querySelector("[data-hunt-count]");
        root.addEventListener("click", (e) => {
            const sayB = e.target.closest("[data-say]");
            if (sayB) { say(sayB.dataset.say); return; }
            const chip = e.target.closest("[data-hunt]");
            if (chip) {
                const i = chip.dataset.hunt;
                if (heard.has(i)) heard.delete(i); else heard.add(i);
                chip.setAttribute("aria-pressed", String(heard.has(i)));
                count.textContent = `${heard.size} / ${s.phrases.length} ${T.heard}${heard.size === s.phrases.length ? " 🎉" : ""}`;
                return;
            }
            const ans = e.target.closest("[data-a]");
            if (ans) {
                const box = ans.closest("[data-q]"), q = s.quiz[Number(box.dataset.q)], right = Number(ans.dataset.a) === q.ok;
                ans.classList.add(right ? "is-right" : "is-wrong");
                box.querySelector(".mu-feedback").textContent = right ? T.check : T.wrong;
                if (right) box.querySelectorAll("[data-a]").forEach((b) => { b.disabled = true; });
                return;
            }
            if (e.target.closest("[data-finish]")) {
                const d = load(); d[s.id] = new Date().toISOString().slice(0, 10); save(d);
                root.querySelector(".mu-finish").innerHTML = `<p class="mu-done-msg">${T.doneMsg}</p>`;
            }
        });
    };

    const id = new URLSearchParams(location.search).get("s");
    const song = SONGS.find((s) => s.id === id);
    if (song) { lesson(song); document.querySelectorAll("[data-music-intro], .music-page > h1").forEach((el) => { el.hidden = true; }); document.title = `${song.title} – ${document.title}`; } else list();
})();
