// Nawee trophies – a fixed set of bronze, silver, gold and platinum trophies, like on a game console.
// Everything is stored in the visitor's browser (localStorage); nothing is sent anywhere.
// Pages report events with NaweeTrophies.record(...); newly unlocked trophies slide in as a small message.
// It also provides short sounds for correct/wrong answers (NaweeTrophies.play) with an on/off switch.

(() => {
    const KEY = "nawee-trophies-v1";
    const COURSE_KEY = "nawee-course-v1";
    const isEnglish = document.documentElement.lang === "en";

    const load = (key) => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } };
    const save = (data) => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ } };

    const state = Object.assign({ unlocked: {}, days: [], perfect: [], compared: [], camera: false, commCheck: false, bizTest: false }, load(KEY));
    const course = () => { const c = load(COURSE_KEY); return { level: c.level, completed: c.completed || [] }; };

    const moduleLessons = (m) => [`${m}-1`, `${m}-2`, `${m}-3`];
    const moduleDone = (c, m) => moduleLessons(m).every((id) => c.completed.includes(id));
    const allLessons = [1, 2, 3, 4, 5, 6, 7].flatMap(moduleLessons);

    // [id, level, German name, German hint, English name, English hint, condition]
    const LIST = [
        ["erster-schritt", "bronze", "Erster Schritt", "Mach den Einstufungstest.", "First Step", "Complete the placement test.", (s, c) => Boolean(c.level)],
        ["los-gehts", "bronze", "Los geht's", "Schließ deine erste Lektion ab.", "Here We Go", "Complete your first lesson.", (s, c) => c.completed.length >= 1],
        ["volltreffer", "bronze", "Volltreffer", "Löse alle Übungen einer Lektion beim ersten Versuch richtig.", "Bullseye", "Get every exercise in a lesson right on the first try.", (s) => s.perfect.length >= 1],
        ["selbstkenntnis", "bronze", "Selbstkenntnis", "Mach den Kommunikationscheck.", "Self-Awareness", "Complete the Communication Check.", (s) => s.commCheck],
        ["business-profi", "bronze", "Business-Profi", "Mach den Business-English-Test.", "Business Pro", "Complete the Business English Test.", (s) => s.bizTest],
        ["spiegelbild", "bronze", "Spiegelbild", "Werte die Kamera-Checkliste in Lektion 6.2 aus.", "Mirror Image", "Evaluate the camera checklist in lesson 6.2.", (s) => s.camera],
        ["vergleichen", "bronze", "Vergleichen lohnt sich", "Vergleiche 5 eigene Antworten mit den Musterantworten.", "Worth Comparing", "Compare 5 of your answers with the model answers.", (s) => s.compared.length >= 5],
        ...[1, 2, 3, 4, 5, 6, 7].map((m) => [`modul-${m}`, "silver", `Modul ${m} gemeistert`, `Schließ alle Lektionen von Modul ${m} ab.`, `Module ${m} Mastered`, `Complete all lessons of module ${m}.`, (s, c) => moduleDone(c, m)]),
        ["dranbleiben", "silver", "Dranbleiben", "Lerne an 3 verschiedenen Tagen.", "Keep Going", "Learn on 3 different days.", (s) => s.days.length >= 3],
        ["treffsicher", "silver", "Treffsicher", "Schaffe 5 Lektionen mit allen Übungen beim ersten Versuch richtig.", "Sharpshooter", "Complete 5 lessons with every exercise right on the first try.", (s) => s.perfect.length >= 5],
        ["halbzeit", "gold", "Halbzeit", "Schließ die Module 1–4 ab.", "Halfway There", "Complete modules 1–4.", (s, c) => [1, 2, 3, 4].every((m) => moduleDone(c, m))],
        ["wochenrhythmus", "gold", "Wochenrhythmus", "Lerne an 7 verschiedenen Tagen.", "Weekly Rhythm", "Learn on 7 different days.", (s) => s.days.length >= 7],
        ["makellos", "gold", "Makellos", "Schaffe 15 Lektionen mit allen Übungen beim ersten Versuch richtig.", "Flawless", "Complete 15 lessons with every exercise right on the first try.", (s) => s.perfect.length >= 15],
        ["sicher-sprechen", "gold", "Sicher sprechen", "Schließ alle 21 Lektionen ab.", "Speaking with Confidence", "Complete all 21 lessons.", (s, c) => allLessons.every((id) => c.completed.includes(id))],
        ["nawee-meister", "platinum", "Nawee-Meister", "Schalte alle anderen Trophäen frei.", "Nawee Master", "Unlock all other trophies.", (s) => LIST.filter((t) => t[0] !== "nawee-meister").every((t) => s.unlocked[t[0]])],
    ];
    const TROPHIES = LIST.map(([id, level, deName, deHint, enName, enHint, test]) => ({
        id, level, test,
        name: isEnglish ? enName : deName,
        hint: isEnglish ? enHint : deHint,
    }));
    const LEVEL_NAMES = isEnglish
        ? { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" }
        : { bronze: "Bronze", silver: "Silber", gold: "Gold", platinum: "Platin" };

    const trophyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"></path><path d="M17 5h3v2a3 3 0 0 1-3 3"></path><path d="M7 5H4v2a3 3 0 0 0 3 3"></path><path d="M12 14v4"></path><path d="M8 21h8"></path><path d="M9 18h6v3H9z"></path></svg>';

    // ---------- sounds (generated in the browser, no audio files; can be switched off) ----------
    const SOUND_KEY = "nawee-sound";
    let audio = null;
    const soundOn = () => { try { return localStorage.getItem(SOUND_KEY) !== "off"; } catch { return true; } };
    const tone = (freq, start, length, type = "sine", volume = 0.26) => {
        const t0 = audio.currentTime + start;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
        osc.connect(gain).connect(audio.destination);
        osc.start(t0);
        osc.stop(t0 + length + 0.05);
    };
    const play = (kind) => {
        if (!soundOn()) return;
        try {
            audio = audio || new (window.AudioContext || window.webkitAudioContext)();
            if (audio.state === "suspended") audio.resume();
            if (kind === "correct") { tone(880, 0, 0.12); tone(1318.5, 0.09, 0.2); }
            if (kind === "wrong") { tone(330, 0, 0.14, "triangle", 0.16); tone(262, 0.1, 0.2, "triangle", 0.14); }
            if (kind === "complete") { tone(659.3, 0, 0.16); tone(784, 0.12, 0.16); tone(1046.5, 0.24, 0.32); }
            if (kind === "trophy") { [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.28, "triangle", 0.24)); tone(1318.5, 0.42, 0.45, "sine", 0.18); }
        } catch { /* audio not available – stay silent */ }
    };
    const setSound = (on) => { try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch { /* ignore */ } };

    // a small "sound on/off" switch that pages can place where they like
    const soundToggle = () => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "sound-toggle";
        const draw = () => {
            const on = soundOn();
            button.setAttribute("aria-pressed", String(on));
            button.innerHTML = on
                ? `<span aria-hidden="true">🔊</span> ${isEnglish ? "Sound on" : "Ton an"}`
                : `<span aria-hidden="true">🔇</span> ${isEnglish ? "Sound off" : "Ton aus"}`;
        };
        button.addEventListener("click", () => { setSound(!soundOn()); draw(); if (soundOn()) play("correct"); });
        draw();
        return button;
    };

    // ---------- unlock messages (one after another) ----------
    const queue = [];
    let showing = false;
    const showNext = () => {
        if (showing || !queue.length) return;
        showing = true;
        const t = queue.shift();
        const toast = document.createElement("div");
        toast.className = `trophy-toast is-${t.level}`;
        toast.setAttribute("role", "status");
        toast.innerHTML = `<span class="trophy-medal">${trophyIcon}</span>
            <span><small>${isEnglish ? "Trophy unlocked" : "Trophäe freigeschaltet"} · ${LEVEL_NAMES[t.level]}</small><strong>${t.name}</strong></span>`;
        document.body.append(toast);
        play("trophy");
        requestAnimationFrame(() => toast.classList.add("is-visible"));
        setTimeout(() => {
            toast.classList.remove("is-visible");
            setTimeout(() => { toast.remove(); showing = false; showNext(); }, 400);
        }, 3800);
    };

    // ---------- checking ----------
    const check = ({ silent = false } = {}) => {
        const c = course();
        const today = new Date().toISOString().slice(0, 10);
        const fresh = [];
        for (let round = 0; round < 2; round++) { // second round lets the platinum trophy unlock right away
            TROPHIES.forEach((t) => {
                if (!state.unlocked[t.id] && t.test(state, c)) { state.unlocked[t.id] = today; fresh.push(t); }
            });
        }
        if (fresh.length) {
            save(state);
            if (!silent) { queue.push(...fresh); showNext(); }
        }
        return fresh;
    };

    const record = (type, value) => {
        const today = new Date().toISOString().slice(0, 10);
        if (type === "day" && !state.days.includes(today)) state.days.push(today);
        if (type === "perfect" && value && !state.perfect.includes(value)) state.perfect.push(value);
        if (type === "compare" && value && !state.compared.includes(value)) state.compared.push(value);
        if (type === "camera") state.camera = true;
        if (type === "commCheck") state.commCheck = true;
        if (type === "bizTest") state.bizTest = true;
        save(state);
        return check();
    };

    // ---------- trophy cabinet (course overview) ----------
    const renderCabinet = (grid, counter) => {
        const done = TROPHIES.filter((t) => state.unlocked[t.id]).length;
        if (counter) counter.textContent = isEnglish ? `${done} of ${TROPHIES.length} trophies` : `${done} von ${TROPHIES.length} Trophäen`;
        grid.replaceChildren(...TROPHIES.map((t) => {
            const date = state.unlocked[t.id];
            const item = document.createElement("div");
            item.className = `trophy is-${t.level}${date ? " is-unlocked" : ""}`;
            const when = date ? new Date(date).toLocaleDateString(isEnglish ? "en-US" : "de-DE") : "";
            item.innerHTML = `<span class="trophy-medal">${trophyIcon}</span>
                <span class="trophy-text"><strong>${t.name}</strong>
                <small>${date ? `${LEVEL_NAMES[t.level]} · ${when}` : `${LEVEL_NAMES[t.level]} · ${t.hint}`}</small></span>`;
            return item;
        }));
    };

    window.NaweeTrophies = { record, check, renderCabinet, total: TROPHIES.length, play, soundToggle };

    // credit progress made before a trophy existed (e.g. lessons completed earlier)
    check();
})();
