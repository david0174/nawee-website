// Nawee accounts (optional): sign up / log in with Supabase (email + password, username shown),
// account page (konto.html / account.html) and syncing of course progress and trophies.
// Without an account everything keeps working in the browser as before.

(() => {
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key: safe to be public (data protected by Row Level Security)
    // Course pages are only shown with an account (see [data-requires-account] in style.css).
    // If the login service can't load, open them anyway instead of locking learners out.
    const gated = document.querySelector("[data-requires-account]");
    // The confirmation link from the sign-up email lands here with "#…type=signup" (or "#error=…" if the link
    // is expired). Read it before the Supabase client processes and removes it.
    const linkParams = new URLSearchParams(location.hash.slice(1));
    const justConfirmed = linkParams.get("type") === "signup";
    const linkError = linkParams.get("error_code") || linkParams.get("error") || "";
    const unlockGate = () => { if (gated) gated.classList.add("account-ok"); };
    if (!window.supabase) { unlockGate(); return; }

    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

    const isEnglish = document.documentElement.lang === "en";
    const ACCOUNT_PAGE = isEnglish ? "account.html" : "konto.html";
    const LIVE_ACCOUNT_URL = `https://nawee.net/${ACCOUNT_PAGE}`; // where confirmation and reset links lead
    const COURSE_KEY = "nawee-course-v1";
    const TROPHY_KEY = "nawee-trophies-v1";
    const CC_KEY = "nawee-communication-course-v1"; // free Communication Course (no account needed; synced inside `course.communication`)
    const PROFILE_KEY = "nawee-profile-v1"; // answers from the "get started" questions (start.html; synced inside `course.profile`)
    const VOCAB_KEY = "nawee-vocab-v1"; // picture cards (vocab.js; synced inside `course.vocab`)
    const READING_KEY = "nawee-reading-v1"; // reading texts (reading.js; synced inside `course.reading`)
    const GAMES_KEY = "nawee-games-v1"; // typing games (games.js; synced inside `course.games`)
    const WORK_KEY = "nawee-work-course-v1"; // "English from the start" lessons (speak-lesson.js; synced inside `course.work`)
    const RELOAD_FLAG = "nawee-synced-reload";

    const params = new URLSearchParams(location.search);
    const NEXT_KEY = "nawee-next-page";
    const validNext = (n) => /^(kurs\.html|lektion\.html\?l=\d-\d|communication-course\.html|communication-lesson\.html\?l=\d-\d)$/.test(n || "") ? n : "";
    const nextPage = (() => {
        let n = validNext(params.get("next"));
        if (!n) { try { n = validNext(sessionStorage.getItem(NEXT_KEY)); sessionStorage.removeItem(NEXT_KEY); } catch { /* ignore */ } }
        return n;
    })();

    const T = isEnglish ? {
        login: "Log in", signup: "Create account", email: "Email", password: "Password", username: "Username", firstName: "First name",
        passwordNew: "New password", passwordRepeat: "Repeat password", forgot: "Forgot your password?",
        noAccount: "No account yet?", haveAccount: "Already have an account?", sendLink: "Send reset link",
        back: "Back to login", savePassword: "Save new password", logout: "Log out", toCourse: "Go to the course",
        title: "My account", loginTitle: "Welcome back!", signupTitle: "Create your free account",
        signupLead: "Optional and free – it saves your learning progress:",
        benefits: ["21 lessons for real conversations", "A placement test with your recommended starting point", "Trophies for every milestone", "Your progress saved – on all your devices"],
        ccSignupLead: "Save your progress in the free Communication Course:",
        ccBenefits: ["Your completed lessons saved in your account", "Continue on any device – phone, laptop or tablet", "Your progress stays safe if you clear your browser data", "Also saves your progress in the course “Sicher sprechen”"],
        loginLead: "Log in to continue with your course and trophies.",
        usernameHint: "3–24 characters: letters, numbers, dot, dash or underscore. Shown on your profile.",
        passwordHint: "At least 8 characters.", pwRules: ["At least 8 characters", "Letters and numbers"], pwMatch: "Passwords match", requiredNote: "* Required",
        privacy: `By creating an account, our <a href="privacy-policy.html">Privacy Policy</a> applies.`,
        checkTitle: "Almost done!", checkText: (e) => `We sent an email to <strong>${e}</strong>. Click the link in it to confirm your account – then you can log in.`,
        forgotTitle: "Reset your password", forgotLead: "Enter your email and we'll send you a link to set a new password.",
        forgotSent: "If an account exists for this email, you'll receive a link in a few minutes.",
        newPwTitle: "Set a new password", pwSaved: "Your new password is saved.",
        hello: (n) => `Hello, ${n}!`, loggedInAs: "Logged in as", level: "Your level", progress: (d, t) => `${d} of ${t} lessons completed`,
        plan: "Your learning plan", planEdit: "Change answers", planNone: "Not set up yet.", planStart: "Answer 5 quick questions",
        planGoal: { travel: "Travel", work: "Job", school: "School or college", abroad: "Living abroad", people: "Talking with people", fun: "For fun" },
        planFocus: { listening: "Understanding", speaking: "Speaking", vocab: "Vocabulary", pronunciation: "Pronunciation", confidence: "Confidence" },
        planLevel: ["New", "A1", "A2", "B1–B2", "C1+"], planMinutes: (m) => `${m} min a day`, startPage: "get-started.html",
        noLevel: "not determined yet", trophies: "Your trophies", syncNote: "Your progress and trophies are saved in your account and synced across your devices.",
        deleteTitle: "Delete account", deleteText: "Deletes your account, username and saved progress on our servers. Progress stored in this browser stays here.",
        deleteBtn: "Delete my account", deleteConfirm: "Do you really want to delete your account? This cannot be undone.", deleted: "Your account has been deleted.",
        hint: (n) => `Logged in as <strong>${n}</strong> · <a href="account.html">My account</a>`,
        google: "Continue with Google", or: "or with your email",
        confirmedTitle: "Your email is confirmed!",
        confirmedText: "Welcome to Nawee – your account is ready. Your learning progress is now saved in your account and available on all your devices.",
        confirmedPrimary: "Start learning", confirmedSecondary: "Go to my account", learnPage: "learn.html",
        linkExpired: "This link has expired or was already used. If you've already confirmed your email, just log in. Otherwise, sign up again to get a new link.",
        hintOut: `<a href="account.html">Create a free account</a> to save your progress and trophies on all your devices.`,
        errors: {
            invalid: "Email or password is incorrect.", unconfirmed: "Please confirm your email address first – check your inbox.",
            exists: "There is already an account for this email.", usernameTaken: "This username is already taken.",
            usernameFormat: "Please choose a username with 3–24 characters (letters, numbers, . _ -).", firstName: "Please enter your first name.",
            short: "Your password needs at least 8 characters.", weak: "Your password needs at least 8 characters, with both letters and numbers.", mismatch: "The passwords don't match.",
            rate: "Too many attempts – please wait a few minutes and try again.",
            email: "We couldn't send the confirmation email right now. Please try again later – or write to david@nawee.net.", generic: "Something went wrong. Please try again.",
        },
    } : {
        login: "Anmelden", signup: "Konto erstellen", email: "E-Mail", password: "Passwort", username: "Benutzername", firstName: "Vorname",
        passwordNew: "Neues Passwort", passwordRepeat: "Passwort wiederholen", forgot: "Passwort vergessen?",
        noAccount: "Noch kein Konto?", haveAccount: "Schon ein Konto?", sendLink: "Link senden",
        back: "Zurück zur Anmeldung", savePassword: "Neues Passwort speichern", logout: "Abmelden", toCourse: "Zum Kurs",
        title: "Mein Konto", loginTitle: "Willkommen zurück!", signupTitle: "Dein kostenloses Konto",
        signupLead: "Freiwillig und kostenlos – damit speicherst du deinen Lernfortschritt:",
        benefits: ["21 Lektionen für echte Gespräche", "Einstufungstest mit deinem empfohlenen Einstieg", "Trophäen für jeden Meilenstein", "Dein Fortschritt gespeichert – auf allen deinen Geräten"],
        loginLead: "Melde dich an, um mit deinem Kurs und deinen Trophäen weiterzumachen.",
        usernameHint: "3–24 Zeichen: Buchstaben, Zahlen, Punkt, Bindestrich oder Unterstrich. Wird in deinem Profil angezeigt.",
        passwordHint: "Mindestens 8 Zeichen.", pwRules: ["Mindestens 8 Zeichen", "Buchstaben und Zahlen"], pwMatch: "Passwörter stimmen überein", requiredNote: "* Pflichtfeld",
        privacy: `Mit der Registrierung gilt unsere <a href="datenschutz.html">Datenschutzerklärung</a>.`,
        checkTitle: "Fast geschafft!", checkText: (e) => `Wir haben dir eine E-Mail an <strong>${e}</strong> geschickt. Klicke auf den Link darin, um dein Konto zu bestätigen – danach kannst du dich anmelden.`,
        forgotTitle: "Passwort zurücksetzen", forgotLead: "Gib deine E-Mail-Adresse ein – wir schicken dir einen Link, mit dem du ein neues Passwort festlegen kannst.",
        forgotSent: "Falls es ein Konto mit dieser E-Mail gibt, bekommst du in wenigen Minuten einen Link.",
        newPwTitle: "Neues Passwort festlegen", pwSaved: "Dein neues Passwort ist gespeichert.",
        hello: (n) => `Hallo, ${n}!`, loggedInAs: "Angemeldet als", level: "Dein Niveau", progress: (d, t) => `${d} von ${t} Lektionen abgeschlossen`,
        plan: "Dein Lernplan", planEdit: "Antworten ändern", planNone: "Noch nicht eingerichtet.", planStart: "5 kurze Fragen beantworten",
        planGoal: { travel: "Reisen", work: "Job", school: "Schule oder Studium", abroad: "Leben im Ausland", people: "Mit Menschen reden", fun: "Aus Spaß" },
        planFocus: { listening: "Verstehen", speaking: "Sprechen", vocab: "Wortschatz", pronunciation: "Aussprache", confidence: "Selbstvertrauen" },
        planLevel: ["Neu", "A1", "A2", "B1–B2", "C1+"], planMinutes: (m) => `${m} Min. am Tag`, startPage: "start.html",
        noLevel: "noch nicht ermittelt", trophies: "Deine Trophäen", syncNote: "Dein Fortschritt und deine Trophäen sind in deinem Konto gespeichert und auf allen Geräten verfügbar.",
        deleteTitle: "Konto löschen", deleteText: "Löscht dein Konto, deinen Benutzernamen und deinen gespeicherten Fortschritt auf unseren Servern. Der Fortschritt in diesem Browser bleibt erhalten.",
        deleteBtn: "Mein Konto löschen", deleteConfirm: "Möchtest du dein Konto wirklich löschen? Das kann nicht rückgängig gemacht werden.", deleted: "Dein Konto wurde gelöscht.",
        hint: (n) => `Angemeldet als <strong>${n}</strong> · <a href="konto.html">Mein Konto</a>`,
        google: "Weiter mit Google", or: "oder mit deiner E-Mail-Adresse",
        confirmedTitle: "Deine E-Mail ist bestätigt!",
        confirmedText: "Willkommen bei Nawee – dein Konto ist startklar. Dein Lernfortschritt wird jetzt in deinem Konto gespeichert und ist auf allen deinen Geräten verfügbar.",
        confirmedPrimary: "Jetzt lernen", confirmedSecondary: "Zu meinem Konto", learnPage: "lernen.html",
        linkExpired: "Dieser Link ist abgelaufen oder wurde schon benutzt. Wenn du deine E-Mail-Adresse schon bestätigt hast, melde dich einfach an. Sonst registriere dich noch einmal, um einen neuen Link zu bekommen.",
        hintOut: `<a href="konto.html">Kostenloses Konto erstellen</a>, um deinen Fortschritt und deine Trophäen auf allen Geräten zu speichern.`,
        errors: {
            invalid: "E-Mail oder Passwort ist falsch.", unconfirmed: "Bitte bestätige zuerst deine E-Mail-Adresse – schau in dein Postfach.",
            exists: "Für diese E-Mail gibt es schon ein Konto.", usernameTaken: "Dieser Benutzername ist leider schon vergeben.",
            usernameFormat: "Bitte wähle einen Benutzernamen mit 3–24 Zeichen (Buchstaben, Zahlen, . _ -).", firstName: "Bitte gib deinen Vornamen ein.",
            short: "Dein Passwort braucht mindestens 8 Zeichen.", weak: "Dein Passwort braucht mindestens 8 Zeichen – mit Buchstaben und Zahlen.", mismatch: "Die Passwörter stimmen nicht überein.",
            rate: "Zu viele Versuche – bitte warte ein paar Minuten und versuch es dann noch einmal.",
            email: "Die Bestätigungs-E-Mail konnte gerade nicht gesendet werden. Bitte versuch es später noch einmal – oder schreib an david@nawee.net.", generic: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
        },
    };

    const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const errorText = (error) => {
        const m = (error && (error.message || error.error_description || "")).toLowerCase();
        if (m.includes("invalid login")) return T.errors.invalid;
        if (m.includes("not confirmed")) return T.errors.unconfirmed;
        if (m.includes("already registered") || m.includes("already been registered")) return T.errors.exists;
        if (m.includes("password") && m.includes("6")) return T.errors.short;
        if (m.includes("password should") || m.includes("weak password")) return T.errors.weak;
        if (m.includes("security purposes") || m.includes("rate limit") || m.includes("too many")) return T.errors.rate;
        if (m.includes("error sending")) return T.errors.email; // e.g. "Error sending confirmation email" (email service problem)
        return T.errors.generic;
    };

    const fromCommunicationCourse = /^communication-/.test(nextPage);

    // ---------- syncing course progress and trophies ----------
    const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
    const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
    const union = (a, b) => [...new Set([...(a || []), ...(b || [])])];
    const mergeCourse = (local, remote) => ({
        ...remote, ...local,
        level: local.level || remote.level,
        levelDate: local.level ? local.levelDate : remote.levelDate,
        completed: union(local.completed, remote.completed),
        skipped: Boolean(local.skipped || remote.skipped),
    });
    const mergeTrophies = (local, remote) => {
        const unlocked = { ...(remote.unlocked || {}) };
        Object.entries(local.unlocked || {}).forEach(([id, date]) => { if (!unlocked[id] || date < unlocked[id]) unlocked[id] = date; });
        return {
            unlocked,
            days: union(local.days, remote.days),
            perfect: union(local.perfect, remote.perfect),
            compared: union(local.compared, remote.compared),
            camera: Boolean(local.camera || remote.camera),
            commCheck: Boolean(local.commCheck || remote.commCheck),
            bizTest: Boolean(local.bizTest || remote.bizTest),
        };
    };
    // picture cards: per word keep the state with more successful reviews (or the later due date); newest "last answer" wins locally
    const mergeVocab = (local, remote) => {
        const pick = (a, b) => {
            if (!a) return b;
            if (!b) return a;
            if ((a.reps || 0) !== (b.reps || 0)) return (a.reps || 0) > (b.reps || 0) ? a : b;
            return (a.due || "") >= (b.due || "") ? a : b;
        };
        const cards = {};
        new Set([...Object.keys(remote.cards || {}), ...Object.keys(local.cards || {})])
            .forEach((k) => { cards[k] = pick((local.cards || {})[k], (remote.cards || {})[k]); });
        const localDay = (local.newDay || "") >= (remote.newDay || "");
        return {
            cards,
            last: { ...(remote.last || {}), ...(local.last || {}) },
            days: union(local.days, remote.days).sort().slice(-400),
            newDay: localDay ? local.newDay || "" : remote.newDay,
            newCount: localDay ? local.newCount || 0 : remote.newCount || 0,
        };
    };
    const vocabSig = (v) => Object.entries(v.cards || {}).map(([k, c]) => `${k}:${c.reps || 0}`).sort().join(",") + "|" + Object.keys(v.last || {}).length;
    // what counts as "new progress" (to decide whether the page needs a refresh after syncing)
    const signature = (c, t, cc) => JSON.stringify([c.level || "", (c.completed || []).slice().sort(), Object.keys(t.unlocked || {}).sort(),
        (t.days || []).length, (t.perfect || []).length, (t.compared || []).length, Boolean(t.camera), Boolean(t.commCheck), Boolean(t.bizTest),
        (cc.completed || []).slice().sort()]);

    let user = null;
    let pushTimer = null;
    const push = () => {
        if (!user) return;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(() => {
            const course = { ...read(COURSE_KEY), communication: read(CC_KEY), profile: read(PROFILE_KEY), vocab: read(VOCAB_KEY), reading: read(READING_KEY), work: read(WORK_KEY), games: read(GAMES_KEY) };
            db.from("learner_progress").upsert({ user_id: user.id, course, trophies: read(TROPHY_KEY), updated_at: new Date().toISOString() })
                .then(() => {}, () => {});
        }, 700);
    };
    const pull = async () => {
        const { data, error } = await db.from("learner_progress").select("course, trophies").eq("user_id", user.id).maybeSingle();
        if (error) return false;
        const lc = read(COURSE_KEY), lt = read(TROPHY_KEY), lcc = read(CC_KEY);
        const { communication: rcc = {}, profile: rp = {}, vocab: rv = {}, reading: rr = {}, work: rw = {}, games: rg = {}, ...rc } = (data && data.course) || {};
        const mc = mergeCourse(lc, rc), mt = mergeTrophies(lt, (data && data.trophies) || {});
        const mcc = { completed: union(lcc.completed, rcc.completed) };
        write(COURSE_KEY, mc);
        write(TROPHY_KEY, mt);
        write(CC_KEY, mcc);
        const lv = read(VOCAB_KEY), mv = mergeVocab(lv, rv);
        write(VOCAB_KEY, mv);
        const lr = read(READING_KEY), mr = { done: { ...(rr.done || {}), ...(lr.done || {}) } };
        write(READING_KEY, mr);
        const lw = read(WORK_KEY), mw = { ...rw, ...lw, completed: union(lw.completed, rw.completed) };
        write(WORK_KEY, mw);
        const lg = read(GAMES_KEY), best = { ...(rg.best || {}) };
        Object.entries(lg.best || {}).forEach(([k, v]) => { best[k] = Math.max(v, best[k] || 0); });
        write(GAMES_KEY, { best, days: union(lg.days, rg.days).sort().slice(-400) });
        const lp = read(PROFILE_KEY);
        if (!lp.date && rp.date) write(PROFILE_KEY, rp); // newest answers win
        else if (lp.date && rp.date && rp.date > lp.date) write(PROFILE_KEY, rp);
        push();
        return signature(lc, lt, lcc) !== signature(mc, mt, mcc) || vocabSig(lv) !== vocabSig(mv) || Object.keys(lr.done || {}).length !== Object.keys(mr.done).length || (lw.completed || []).length !== mw.completed.length; // true = progress from another device arrived
    };
    window.addEventListener("nawee:progress", push);

    // greeting: the first name from the sign-up form or from Google; older accounts without one fall back to the username
    const firstName = () => {
        const m = (user && user.user_metadata) || {};
        const n = (m.first_name || m.given_name || String(m.full_name || m.name || "").trim().split(/\s+/)[0] || "").trim();
        return n.charAt(0).toLocaleUpperCase() + n.slice(1); // "david" → "David"
    };
    const profileName = async () => {
        const { data } = await db.from("profiles").select("username").eq("id", user.id).maybeSingle();
        return (data && data.username) || (user.user_metadata && user.user_metadata.username) || user.email;
    };

    // ---------- small account hint in the course overview ----------
    // Communication Course: [data-cc-account-slot] offers an optional account to save progress
    const ccHint = (name, compact) => name
        ? `✓ Your progress is saved in your account (<strong>${name}</strong>) · <a href="account.html">My account</a>`
        : compact
            ? `Your progress is only saved in this browser. <a href="account.html?mode=signup&amp;next=${encodeURIComponent("communication-course.html")}">Create a free account</a> to keep it safe and continue on any device – or <a href="account.html?next=${encodeURIComponent("communication-course.html")}">log in</a>.`
            : `<strong>No sign-up needed.</strong> Your progress is saved in this browser. Want to keep it safe and continue on any device? <a href="account.html?mode=signup&amp;next=${encodeURIComponent("communication-course.html")}">Create a free account</a> · <a href="account.html?next=${encodeURIComponent("communication-course.html")}">Log in</a>`;
    const fillHint = async () => {
        const slot = document.querySelector("[data-account-slot]");
        const ccSlots = document.querySelectorAll("[data-cc-account-slot]");
        if (!slot && !ccSlots.length) return;
        const name = user ? esc(await profileName()) : "";
        if (slot) slot.innerHTML = user ? T.hint(name) : T.hintOut;
        ccSlots.forEach((s) => { s.innerHTML = ccHint(name, s.dataset.ccAccountSlot === "compact"); s.hidden = false; });
    };
    window.NaweeAccount = { refresh: fillHint }; // the Communication Course calls this after drawing new slots

    // ---------- gate on course pages: sign up or log in first ----------
    const showGate = () => {
        const back = encodeURIComponent((location.pathname.split("/").pop() || "kurs.html") + location.search);
        gated.innerHTML = `<div class="assessment-card account-gate">
            <p class="eyebrow">KOSTENLOSER ONLINE-KURS</p>
            <h1>Melde dich an, um den Kurs zu starten</h1>
            <p class="as-lead">Der Kurs ist kostenlos. Mit deinem Konto speichern wir deinen Fortschritt und deine Trophäen – so kannst du jederzeit und auf jedem Gerät weitermachen.</p>
            <div class="as-actions">
                <a class="button primary" href="konto.html?mode=signup&amp;next=${back}">Kostenloses Konto erstellen <span aria-hidden="true">→</span></a>
                <a class="button secondary" href="konto.html?next=${back}">Ich habe schon ein Konto – anmelden</a>
            </div>
            <p class="as-note">Die kostenlosen Tests kannst du auch ohne Konto machen: den <a href="kommunikations-check.html">Kommunikationscheck</a> und den <a href="business-english-test.html">Business-English-Test</a>.</p>
        </div>`;
        unlockGate();
    };

    // ---------- popup after confirming the email address ----------
    let celebrated = false;
    const celebrate = () => {
        if (!justConfirmed || celebrated) return;
        celebrated = true;
        const dialog = document.createElement("dialog");
        dialog.className = "account-popup";
        dialog.setAttribute("aria-labelledby", "account-popup-title");
        dialog.innerHTML = `<p class="account-popup-icon" aria-hidden="true">✓</p>
            <h2 id="account-popup-title">${T.confirmedTitle}</h2>
            <p>${T.confirmedText}</p>
            <div class="as-actions">
                <a class="button primary" href="${T.learnPage}">${T.confirmedPrimary} <span aria-hidden="true">→</span></a>
                <button type="button" class="button secondary" data-close>${T.confirmedSecondary}</button>
            </div>`;
        dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
        dialog.addEventListener("close", () => dialog.remove());
        dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); }); // click outside closes
        document.body.append(dialog);
        if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
    };

    // ---------- account page ----------
    const root = document.querySelector("[data-account]");
    const field = (id, label, type, extra = "", star = false) => `<label class="account-label" for="${id}">${label}${star ? ' <span class="account-required" aria-hidden="true">*</span>' : ""}</label><input class="account-input" id="${id}" name="${id}" type="${type}" ${extra}>`;
    // "Continue with Google" (Supabase OAuth); Google sends the visitor back to the account page
    const GOOGLE_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.9l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/></svg>`;
    const googleBlock = () => `<button type="button" class="button account-google" data-google>${GOOGLE_ICON}<span>${T.google}</span></button>
                <p class="account-divider"><span>${T.or}</span></p>`;
    const wireGoogle = () => {
        root.querySelector("[data-google]")?.addEventListener("click", async (e) => {
            e.currentTarget.disabled = true;
            if (nextPage) { try { sessionStorage.setItem(NEXT_KEY, nextPage); } catch { /* ignore */ } }
            const { error } = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: LIVE_ACCOUNT_URL } });
            if (error) {
                e.currentTarget.disabled = false;
                root.querySelector("[data-msg]").innerHTML = message(errorText(error));
            }
        });
    };

    // passwords: at least 8 characters with letters and numbers; the checklist ticks off live while typing
    const strongPassword = (p) => p.length >= 8 && /[A-Za-z]/.test(p) && /[0-9]/.test(p);
    const passwordRules = () => `<ul class="account-pw-rules" data-pw-rules>${T.pwRules.map((r, i) => `<li data-rule="${i}">${r}</li>`).join("")}</ul>`;
    const passwordMatch = () => `<p class="account-pw-match" data-pw-match hidden>✓ ${T.pwMatch}</p>`;
    const wirePasswords = (form) => {
        const update = () => {
            const p = form.password.value, p2 = form.password2.value;
            const ok = [p.length >= 8, /[A-Za-z]/.test(p) && /[0-9]/.test(p)];
            form.querySelectorAll("[data-rule]").forEach((li) => li.classList.toggle("is-ok", ok[Number(li.dataset.rule)]));
            form.querySelector("[data-pw-match]").hidden = !(p2 && p === p2);
        };
        form.password.addEventListener("input", update);
        form.password2.addEventListener("input", update);
    };
    const message = (text, kind = "error") => `<p class="account-message is-${kind}" role="${kind === "error" ? "alert" : "status"}">${text}</p>`;
    const setBusy = (form, busy) => form.querySelectorAll("button, input").forEach((el) => { el.disabled = busy; });

    // the answers from the "get started" questions, shown on the account page
    const planBlock = () => {
        const p = read(PROFILE_KEY);
        const chips = p.level === undefined ? "" : [
            T.planGoal[p.goal], T.planLevel[p.level], T.planFocus[p.focus], p.minutes ? T.planMinutes(p.minutes) : "",
        ].filter(Boolean).map((c) => `<li>${esc(c)}</li>`).join("");
        return `<section class="account-plan">
                    <h2 class="lesson-h">${T.plan}</h2>
                    ${chips ? `<ul class="ob-summary">${chips}</ul><a href="${T.startPage}?edit">${T.planEdit} →</a>`
                        : `<p>${T.planNone} <a href="${T.startPage}?edit">${T.planStart} →</a></p>`}
                </section>`;
    };

    // ---------- account overview (dashboard): courses, level, activity, today's tasks, picture cards ----------
    const D = isEnglish ? {
        welcome: "Welcome back,", courses: "Your courses", continue: "Continue", start: "Start", lessons: (d, t) => `${d}/${t} lessons`,
        fromStart: "English from the start", safeSpeaking: "Speaking with confidence", cc: "Communication Course",
        level: "Your level", tested: (d) => `Placement test · ${d}`, fromAnswers: "From your answers", testAgain: "Take the test", noLevel: "Not determined yet",
        activity: "Activity", streak: (n) => (n === 1 ? "day in a row" : "days in a row"), totalDays: (n) => `You learned on ${n} ${n === 1 ? "day" : "days"}`,
        week: ["M", "T", "W", "T", "F", "S", "S"],
        today: "Today", repeat: "Review words", learnNew: "Learn new words", read: "Read a text", lesson: "Next lesson", nothingDue: "Nothing due",
        words: (n) => `${n} ${n === 1 ? "word" : "words"}`, texts: (n) => `${n} new ${n === 1 ? "text" : "texts"}`, min: (n) => `${n} min`, go: "Let’s go",
        cards: "Picture cards", allTopics: "All topics", practice: "Practice",
        status: { green: "mastered", yellow: "practiced", red: "wrong", grey: "new" },
        workPage: "work-lesson.html", ccPage: "communication-course.html", cardsPage: "vocabulary.html", readPage: "reading.html", startPage: "get-started.html",
    } : {
        welcome: "Willkommen zurück,", courses: "Deine Kurse", continue: "Weiter", start: "Starten", lessons: (d, t) => `${d}/${t} Lektionen`,
        fromStart: "Englisch von Anfang an", safeSpeaking: "Sicher sprechen", cc: "Communication Course",
        level: "Dein Niveau", tested: (d) => `Einstufungstest · ${d}`, fromAnswers: "Aus deinen Antworten", testAgain: "Test machen", noLevel: "Noch nicht ermittelt",
        activity: "Aktivität", streak: (n) => (n === 1 ? "Tag in Folge" : "Tage in Folge"), totalDays: (n) => `An ${n} ${n === 1 ? "Tag" : "Tagen"} gelernt`,
        week: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
        today: "Heute", repeat: "Wörter wiederholen", learnNew: "Neue Wörter lernen", read: "Einen Text lesen", lesson: "Nächste Lektion", nothingDue: "Nichts fällig",
        words: (n) => `${n} ${n === 1 ? "Wort" : "Wörter"}`, texts: (n) => `${n} neue ${n === 1 ? "Text" : "Texte"}`, min: (n) => `${n} Min.`, go: "Los geht’s",
        cards: "Bildkarten", allTopics: "Alle Themen", practice: "Üben",
        status: { green: "sicher", yellow: "geübt", red: "falsch", grey: "neu" },
        workPage: "beruf-lektion.html", ccPage: "communication-course.html", cardsPage: "vokabeln.html", readPage: "lesen.html", startPage: "start.html",
    };
    const iso = (d) => d.toISOString().slice(0, 10);
    const bar = (part, whole) => `<span class="dash-bar"><span style="width:${whole ? Math.round((part / whole) * 100) : 0}%"></span></span>`;

    const workLessons = () => (typeof WORK_MODULES === "undefined" ? [] : WORK_MODULES.flatMap((m) => m.lessons)
        .filter((l) => typeof WORK_LESSONS === "undefined" || (WORK_LESSONS[l.id] && !WORK_LESSONS[l.id].draft)));
    const nextWork = () => {
        const doneIds = read(WORK_KEY).completed || [];
        return workLessons().find((l) => !doneIds.includes(l.id)) || null;
    };
    const dashCourses = (done, total, ccDone) => {
        const lessons = workLessons(), wDone = (read(WORK_KEY).completed || []).filter((id) => lessons.some((l) => l.id === id)).length;
        const next = nextWork();
        const row = (title, d, t, href) => `<a class="dash-row" href="${href}"><span class="dash-row-title">${title}</span>${bar(d, t)}<span class="dash-row-count">${d}/${t}</span></a>`;
        return `<section class="dash-card">
            <h2 class="dash-h">${D.courses}</h2>
            <a class="dash-feature" href="${next ? `${D.workPage}?l=${next.id}` : D.workPage + "?l=1-1"}">
                <span class="dash-feature-tag">A1 → A2</span>
                <strong>${D.fromStart}</strong>
                ${bar(wDone, lessons.length)}
                <span class="dash-feature-foot"><span>${D.lessons(wDone, lessons.length)}</span><span>${next ? `${wDone ? D.continue : D.start} →` : "✓"}</span></span>
            </a>
            ${row(D.safeSpeaking, done, total, "kurs.html")}
            ${row(D.cc, ccDone, 21, D.ccPage)}
        </section>`;
    };
    const dashLevel = (level, course) => {
        const p = read(PROFILE_KEY);
        const big = course.level ? level : p.level !== undefined ? T.planLevel[p.level] : "–";
        const sub = course.level ? D.tested(esc(course.levelDate || "")) : p.level !== undefined ? D.fromAnswers : D.noLevel;
        return `<section class="dash-card dash-level">
            <h2 class="dash-h">${D.level}</h2>
            <p class="dash-big">${esc(big)}</p><p class="dash-sub">${sub}</p>
            ${planBlock()}
            <a class="dash-link" href="kurs.html">▶ ${D.testAgain}</a>
        </section>`;
    };
    // all days with any learning activity (lessons/trophies, picture cards, reading)
    const activeDays = () => {
        const days = new Set([...(read(TROPHY_KEY).days || []), ...(read(VOCAB_KEY).days || []), ...(read(GAMES_KEY).days || [])]);
        Object.values(read(READING_KEY).done || {}).forEach((r) => r.date && days.add(r.date));
        return days;
    };
    const dashActivity = () => {
        const days = activeDays();
        let streak = 0;
        const d = new Date();
        if (!days.has(iso(d))) d.setDate(d.getDate() - 1); // today not done yet: the streak from yesterday still counts
        while (days.has(iso(d))) { streak += 1; d.setDate(d.getDate() - 1); }
        const monday = new Date(); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        const todayIso = iso(new Date());
        const week = D.week.map((label, i) => {
            const day = new Date(monday); day.setDate(monday.getDate() + i);
            const key = iso(day);
            return `<span class="dash-day${days.has(key) ? " is-on" : ""}${key === todayIso ? " is-today" : ""}" title="${key}">${days.has(key) ? "⚡" : label}</span>`;
        }).join("");
        return `<section class="dash-card dash-activity">
            <h2 class="dash-h">${D.activity}</h2>
            <p class="dash-streak"><strong>${streak}</strong><span>${D.streak(streak)}</span></p>
            <div class="dash-week">${week}</div>
            <p class="dash-sub">${D.totalDays(days.size)}</p>
        </section>`;
    };
    const dashToday = () => {
        const v = read(VOCAB_KEY), cards = v.cards || {}, today = iso(new Date());
        let due = 0, unseen = 0;
        if (typeof VOCAB_DECKS !== "undefined") Object.entries(VOCAB_DECKS).forEach(([d, deck]) => deck.words.forEach((w) => {
            const c = cards[`${d}/${w.id}`];
            if (c && c.due <= today) due += 1;
            if (!c) unseen += 1;
        }));
        const fresh = Math.min(unseen, Math.max(0, 10 - (v.newDay === today ? v.newCount || 0 : 0)));
        const doneTexts = read(READING_KEY).done || {};
        const unread = typeof READINGS === "undefined" ? [] : READINGS.filter((r) => !doneTexts[r.id]);
        const next = nextWork();
        const tasks = [
            due ? { icon: "🔁", title: D.repeat, sub: D.words(due), min: Math.max(1, Math.round(due / 3)), href: D.cardsPage } : null,
            fresh ? { icon: "💡", title: D.learnNew, sub: D.words(fresh), min: 5, href: D.cardsPage } : null,
            unread.length ? { icon: "📰", title: D.read, sub: D.texts(unread.length), min: 5, href: `${D.readPage}?t=${unread[0].id}` } : null,
            next ? { icon: "🎧", title: D.lesson, sub: esc(isEnglish ? next.title.en : next.title.de), min: 10, href: `${D.workPage}?l=${next.id}` } : null,
        ].filter(Boolean);
        return `<section class="dash-card dash-today">
            <h2 class="dash-h">${D.today}</h2>
            ${tasks.length ? tasks.map((t) => `<a class="dash-task" href="${t.href}"><span class="dash-task-icon" aria-hidden="true">${t.icon}</span><span class="dash-task-text"><small>${t.sub}</small>${t.title}</span><span class="dash-task-min">${D.min(t.min)}</span></a>`).join("")
                : `<p class="dash-sub">✓ ${D.nothingDue}</p>`}
            ${tasks.length ? `<a class="button primary dash-go" href="${tasks[0].href}">${D.go} →</a>` : ""}
        </section>`;
    };
    const dashCards = () => {
        if (typeof VOCAB_DECKS === "undefined") return "";
        const v = read(VOCAB_KEY), n = { green: 0, yellow: 0, red: 0, grey: 0 };
        Object.entries(VOCAB_DECKS).forEach(([d, deck]) => deck.words.forEach((w) => {
            const k = `${d}/${w.id}`, c = (v.cards || {})[k], last = (v.last || {})[k];
            n[!c && !last ? "grey" : last === "wrong" ? "red" : (c?.reps || 0) >= 3 ? "green" : "yellow"] += 1;
        }));
        const total = n.green + n.yellow + n.red + n.grey;
        const order = ["green", "yellow", "red", "grey"];
        return `<section class="dash-card">
            <h2 class="dash-h">${D.cards}</h2>
            <div class="vc-bar">${order.map((c) => `<span class="vc-bar-${c}" style="width:${total ? (n[c] / total) * 100 : 0}%"></span>`).join("")}</div>
            <ul class="vc-legend">${order.map((c) => `<li><i class="vc-dot vc-dot-${c}"></i><strong>${n[c]}</strong> ${D.status[c]}</li>`).join("")}</ul>
            <a class="dash-link" href="${D.cardsPage}">${D.practice} →</a>
        </section>`;
    };

    const views = {
        login(note = "") {
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.loginTitle}</h1><p class="as-lead">${T.loginLead}</p>${note}
                ${googleBlock()}
                <form class="account-form" data-form novalidate>
                    ${field("email", T.email, "email", 'autocomplete="email" required')}
                    ${field("password", T.password, "password", 'autocomplete="current-password" required')}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.login} <span aria-hidden="true">→</span></button>
                </form>
                <p class="account-links"><button type="button" class="link-button" data-go="forgot">${T.forgot}</button> · ${T.noAccount} <button type="button" class="link-button" data-go="signup">${T.signup}</button></p>`;
            wireGoogle();
            const form = root.querySelector("[data-form]");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                setBusy(form, true);
                const { error } = await db.auth.signInWithPassword({ email: form.email.value.trim(), password: form.password.value });
                setBusy(form, false);
                if (error) form.querySelector("[data-msg]").innerHTML = message(errorText(error));
            });
        },
        signup() {
            const cc = fromCommunicationCourse && isEnglish;
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.signupTitle}</h1><p class="as-lead">${cc ? T.ccSignupLead : T.signupLead}</p>
                <ul class="account-benefits">${(cc ? T.ccBenefits : T.benefits).map((b) => `<li>${b}</li>`).join("")}</ul>
                ${googleBlock()}
                <form class="account-form" data-form novalidate>
                    <p class="account-hint-text account-required-note">${T.requiredNote}</p>
                    ${field("firstName", T.firstName, "text", 'autocomplete="given-name" maxlength="40" required', true)}
                    ${field("username", T.username, "text", 'autocomplete="username" maxlength="24" required', true)}
                    <p class="account-hint-text">${T.usernameHint}</p>
                    ${field("email", T.email, "email", 'autocomplete="email" required', true)}
                    ${field("password", T.password, "password", 'autocomplete="new-password" minlength="8" required', true)}
                    ${passwordRules()}
                    ${field("password2", T.passwordRepeat, "password", 'autocomplete="new-password" minlength="8" required', true)}
                    ${passwordMatch()}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.signup} <span aria-hidden="true">→</span></button>
                    <p class="as-note">${T.privacy}</p>
                </form>
                <p class="account-links">${T.haveAccount} <button type="button" class="link-button" data-go="login">${T.login}</button></p>`;
            wireGoogle();
            const form = root.querySelector("[data-form]");
            wirePasswords(form);
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = form.querySelector("[data-msg]");
                const firstName = form.firstName.value.trim().replace(/\s+/g, " ").slice(0, 40);
                const username = form.username.value.trim(), email = form.email.value.trim(), password = form.password.value;
                if (!firstName) { msg.innerHTML = message(T.errors.firstName); return; }
                if (!/^[A-Za-z0-9_.-]{3,24}$/.test(username)) { msg.innerHTML = message(T.errors.usernameFormat); return; }
                if (!strongPassword(password)) { msg.innerHTML = message(T.errors.weak); return; }
                if (password !== form.password2.value) { msg.innerHTML = message(T.errors.mismatch); return; }
                setBusy(form, true);
                const { data: free, error: checkError } = await db.rpc("username_available", { name: username });
                if (checkError) { setBusy(form, false); msg.innerHTML = message(T.errors.generic); return; }
                if (!free) { setBusy(form, false); msg.innerHTML = message(T.errors.usernameTaken); return; }
                const { error } = await db.auth.signUp({ email, password, options: { data: { username, first_name: firstName }, emailRedirectTo: LIVE_ACCOUNT_URL } });
                setBusy(form, false);
                if (error) { msg.innerHTML = message(errorText(error)); return; }
                views.check(email);
            });
        },
        check(email) {
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.checkTitle}</h1><p class="as-lead">${T.checkText(esc(email))}</p>
                <p class="account-links"><button type="button" class="link-button" data-go="login">${T.back}</button></p>`;
        },
        forgot() {
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.forgotTitle}</h1><p class="as-lead">${T.forgotLead}</p>
                <form class="account-form" data-form novalidate>
                    ${field("email", T.email, "email", 'autocomplete="email" required')}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.sendLink} <span aria-hidden="true">→</span></button>
                </form>
                <p class="account-links"><button type="button" class="link-button" data-go="login">${T.back}</button></p>`;
            const form = root.querySelector("[data-form]");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                setBusy(form, true);
                const { error } = await db.auth.resetPasswordForEmail(form.email.value.trim(), { redirectTo: LIVE_ACCOUNT_URL });
                setBusy(form, false);
                form.querySelector("[data-msg]").innerHTML = error && errorText(error) === T.errors.rate ? message(T.errors.rate) : message(T.forgotSent, "success");
            });
        },
        newPassword() {
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.newPwTitle}</h1>
                <form class="account-form" data-form novalidate>
                    <p class="account-hint-text account-required-note">${T.requiredNote}</p>
                    ${field("password", T.passwordNew, "password", 'autocomplete="new-password" minlength="8" required', true)}
                    ${passwordRules()}
                    ${field("password2", T.passwordRepeat, "password", 'autocomplete="new-password" minlength="8" required', true)}
                    ${passwordMatch()}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.savePassword} <span aria-hidden="true">→</span></button>
                </form>`;
            const form = root.querySelector("[data-form]");
            wirePasswords(form);
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = form.querySelector("[data-msg]");
                if (!strongPassword(form.password.value)) { msg.innerHTML = message(T.errors.weak); return; }
                if (form.password.value !== form.password2.value) { msg.innerHTML = message(T.errors.mismatch); return; }
                setBusy(form, true);
                const { error } = await db.auth.updateUser({ password: form.password.value });
                setBusy(form, false);
                if (error) { msg.innerHTML = message(errorText(error)); return; }
                views.profile(message(T.pwSaved, "success"));
            });
        },
        async profile(note = "") {
            const name = await profileName();
            await pull();
            const course = read(COURSE_KEY);
            const total = 21;
            const done = (course.completed || []).length;
            const levelLabels = { "below-A2": isEnglish ? "below A2" : "unter A2", C1: isEnglish ? "C1 or higher" : "C1 oder höher" };
            const level = course.level ? (levelLabels[course.level] || course.level) : T.noLevel;
            const ccDone = (read(CC_KEY).completed || []).length;
            root.innerHTML = `<div class="dash">
                <h1 class="dash-hello"><span>${D.welcome}</span> ${esc(firstName() || name)}!</h1>${note}
                <p class="account-meta">${T.loggedInAs} <strong>${esc(user.email)}</strong></p>
                <div class="dash-grid">
                    <div class="dash-main">
                        ${dashCourses(done, total, ccDone)}
                        <div class="dash-pair">${dashLevel(level, course)}${dashCards()}</div>
                    </div>
                    <div class="dash-side">${dashActivity()}${dashToday()}</div>
                </div>
                <section class="trophy-cabinet dash-card">
                    <div class="trophy-head"><h2 class="lesson-h">${T.trophies}</h2><p class="trophy-count" data-trophy-count></p></div>
                    <div class="trophy-grid" data-trophies></div>
                    <p class="as-note">${T.syncNote}</p>
                </section>
                <div class="as-actions">
                    <button type="button" class="button secondary" data-logout>${T.logout}</button>
                </div>
                <details class="account-danger">
                    <summary>${T.deleteTitle}</summary>
                    <p>${T.deleteText}</p>
                    <button type="button" class="button secondary" data-delete>${T.deleteBtn}</button>
                </details>
            </div>`;
            if (window.NaweeTrophies) {
                window.NaweeTrophies.reload?.();
                window.NaweeTrophies.renderCabinet(root.querySelector("[data-trophies]"), root.querySelector("[data-trophy-count]"));
            }
            root.querySelector("[data-logout]").addEventListener("click", async () => { await db.auth.signOut(); });
            root.querySelector("[data-delete]").addEventListener("click", async () => {
                if (!window.confirm(T.deleteConfirm)) return;
                const { error } = await db.rpc("delete_my_account");
                if (error) { window.alert(T.errors.generic); return; }
                await db.auth.signOut();
                views.login(message(T.deleted, "success"));
            });
        },
    };

    if (root) {
        root.addEventListener("click", (e) => {
            const go = e.target.closest("[data-go]")?.dataset.go;
            if (go && views[go]) views[go]();
        });
    }

    // ---------- session handling ----------
    let recovering = false;
    db.auth.onAuthStateChange((event, session) => {
        user = session ? session.user : null;
        if (event === "PASSWORD_RECOVERY") { recovering = true; if (root) views.newPassword(); return; }
        if (!root) { if (event === "SIGNED_IN" || event === "SIGNED_OUT") fillHint(); return; }
        if (recovering) return;
        if (event === "SIGNED_IN") {
            if (nextPage) { location.href = nextPage; return; } // back to the course page the visitor wanted
            setTimeout(() => views.profile().then(celebrate), 0);
        }
        if (event === "SIGNED_OUT") views.login();
    });

    db.auth.getSession().then(async ({ data }) => {
        user = data.session ? data.session.user : null;
        if (root) {
            if (recovering) return;
            if (user && nextPage) { location.href = nextPage; return; }
            if (user) views.profile().then(celebrate);
            else if (linkError) views.login(message(T.linkExpired));
            else if (params.get("mode") === "signup") views.signup(); else views.login();
            return;
        }
        if (gated) {
            if (user) unlockGate(); else showGate();
        }
        if (user) {
            const changed = await pull();
            // progress from another device arrived: refresh once so the course and trophies show it
            let reloaded = false;
            try { reloaded = sessionStorage.getItem(RELOAD_FLAG) === "1"; } catch { /* ignore */ }
            if (changed && !reloaded) {
                try { sessionStorage.setItem(RELOAD_FLAG, "1"); } catch { /* ignore */ }
                location.reload();
                return;
            }
        }
        fillHint();
        // get-started page: say whether the answers are saved in an account (synced answers may have arrived, too)
        if (document.querySelector("[data-onboarding]")) {
            const name = user ? await profileName() : "";
            window.dispatchEvent(new CustomEvent("nawee:account", { detail: { name } }));
        }
    });
})();
