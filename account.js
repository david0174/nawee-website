// Nawee accounts (optional): sign up / log in with Supabase (email + password, username shown),
// account page (konto.html / account.html) and syncing of course progress and trophies.
// Without an account everything keeps working in the browser as before.

(() => {
    const SUPABASE_URL = "https://sphhbjfyreugpuzbwird.supabase.co";
    const SUPABASE_KEY = "sb_publishable_jhaV37RIZUZph1S5bikzYQ_RKtDrHvF"; // publishable key: safe to be public (data protected by Row Level Security)
    if (!window.supabase) return;

    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

    const isEnglish = document.documentElement.lang === "en";
    const ACCOUNT_PAGE = isEnglish ? "account.html" : "konto.html";
    const LIVE_ACCOUNT_URL = `https://nawee.net/${ACCOUNT_PAGE}`; // where confirmation and reset links lead
    const COURSE_KEY = "nawee-course-v1";
    const TROPHY_KEY = "nawee-trophies-v1";
    const RELOAD_FLAG = "nawee-synced-reload";

    const T = isEnglish ? {
        login: "Log in", signup: "Create account", email: "Email", password: "Password", username: "Username",
        passwordNew: "New password", passwordRepeat: "Repeat password", forgot: "Forgot your password?",
        noAccount: "No account yet?", haveAccount: "Already have an account?", sendLink: "Send reset link",
        back: "Back to login", savePassword: "Save new password", logout: "Log out", toCourse: "Go to the course",
        title: "My account", loginTitle: "Welcome back!", signupTitle: "Create your free account",
        signupLead: "Save your course progress and trophies – on all your devices.",
        loginLead: "Log in to continue with your course and trophies.",
        usernameHint: "3–24 characters: letters, numbers, dot, dash or underscore. Shown on your profile.",
        passwordHint: "At least 8 characters.",
        privacy: `By creating an account, our <a href="privacy-policy.html">Privacy Policy</a> applies.`,
        checkTitle: "Almost done!", checkText: (e) => `We sent an email to <strong>${e}</strong>. Click the link in it to confirm your account – then you can log in.`,
        forgotTitle: "Reset your password", forgotLead: "Enter your email and we'll send you a link to set a new password.",
        forgotSent: "If an account exists for this email, you'll receive a link in a few minutes.",
        newPwTitle: "Set a new password", pwSaved: "Your new password is saved.",
        hello: (n) => `Hello, ${n}!`, loggedInAs: "Logged in as", level: "Your level", progress: (d, t) => `${d} of ${t} lessons completed`,
        noLevel: "not determined yet", trophies: "Your trophies", syncNote: "Your progress and trophies are saved in your account and synced across your devices.",
        deleteTitle: "Delete account", deleteText: "Deletes your account, username and saved progress on our servers. Progress stored in this browser stays here.",
        deleteBtn: "Delete my account", deleteConfirm: "Do you really want to delete your account? This cannot be undone.", deleted: "Your account has been deleted.",
        hint: (n) => `Logged in as <strong>${n}</strong> · <a href="account.html">My account</a>`,
        hintOut: `<a href="account.html">Create a free account</a> to save your progress and trophies on all your devices.`,
        errors: {
            invalid: "Email or password is incorrect.", unconfirmed: "Please confirm your email address first – check your inbox.",
            exists: "There is already an account for this email.", usernameTaken: "This username is already taken.",
            usernameFormat: "Please choose a username with 3–24 characters (letters, numbers, . _ -).",
            short: "Your password needs at least 8 characters.", mismatch: "The passwords don't match.",
            rate: "Too many attempts – please wait a few minutes and try again.", generic: "Something went wrong. Please try again.",
        },
    } : {
        login: "Anmelden", signup: "Konto erstellen", email: "E-Mail", password: "Passwort", username: "Benutzername",
        passwordNew: "Neues Passwort", passwordRepeat: "Passwort wiederholen", forgot: "Passwort vergessen?",
        noAccount: "Noch kein Konto?", haveAccount: "Schon ein Konto?", sendLink: "Link senden",
        back: "Zurück zur Anmeldung", savePassword: "Neues Passwort speichern", logout: "Abmelden", toCourse: "Zum Kurs",
        title: "Mein Konto", loginTitle: "Willkommen zurück!", signupTitle: "Dein kostenloses Konto",
        signupLead: "Speichere deinen Kursfortschritt und deine Trophäen – auf allen deinen Geräten.",
        loginLead: "Melde dich an, um mit deinem Kurs und deinen Trophäen weiterzumachen.",
        usernameHint: "3–24 Zeichen: Buchstaben, Zahlen, Punkt, Bindestrich oder Unterstrich. Wird in deinem Profil angezeigt.",
        passwordHint: "Mindestens 8 Zeichen.",
        privacy: `Mit der Registrierung gilt unsere <a href="datenschutz.html">Datenschutzerklärung</a>.`,
        checkTitle: "Fast geschafft!", checkText: (e) => `Wir haben dir eine E-Mail an <strong>${e}</strong> geschickt. Klicke auf den Link darin, um dein Konto zu bestätigen – danach kannst du dich anmelden.`,
        forgotTitle: "Passwort zurücksetzen", forgotLead: "Gib deine E-Mail-Adresse ein – wir schicken dir einen Link, mit dem du ein neues Passwort festlegen kannst.",
        forgotSent: "Falls es ein Konto mit dieser E-Mail gibt, bekommst du in wenigen Minuten einen Link.",
        newPwTitle: "Neues Passwort festlegen", pwSaved: "Dein neues Passwort ist gespeichert.",
        hello: (n) => `Hallo, ${n}!`, loggedInAs: "Angemeldet als", level: "Dein Niveau", progress: (d, t) => `${d} von ${t} Lektionen abgeschlossen`,
        noLevel: "noch nicht ermittelt", trophies: "Deine Trophäen", syncNote: "Dein Fortschritt und deine Trophäen sind in deinem Konto gespeichert und auf allen Geräten verfügbar.",
        deleteTitle: "Konto löschen", deleteText: "Löscht dein Konto, deinen Benutzernamen und deinen gespeicherten Fortschritt auf unseren Servern. Der Fortschritt in diesem Browser bleibt erhalten.",
        deleteBtn: "Mein Konto löschen", deleteConfirm: "Möchtest du dein Konto wirklich löschen? Das kann nicht rückgängig gemacht werden.", deleted: "Dein Konto wurde gelöscht.",
        hint: (n) => `Angemeldet als <strong>${n}</strong> · <a href="konto.html">Mein Konto</a>`,
        hintOut: `<a href="konto.html">Kostenloses Konto erstellen</a>, um deinen Fortschritt und deine Trophäen auf allen Geräten zu speichern.`,
        errors: {
            invalid: "E-Mail oder Passwort ist falsch.", unconfirmed: "Bitte bestätige zuerst deine E-Mail-Adresse – schau in dein Postfach.",
            exists: "Für diese E-Mail gibt es schon ein Konto.", usernameTaken: "Dieser Benutzername ist leider schon vergeben.",
            usernameFormat: "Bitte wähle einen Benutzernamen mit 3–24 Zeichen (Buchstaben, Zahlen, . _ -).",
            short: "Dein Passwort braucht mindestens 8 Zeichen.", mismatch: "Die Passwörter stimmen nicht überein.",
            rate: "Zu viele Versuche – bitte warte ein paar Minuten und versuch es dann noch einmal.", generic: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
        },
    };

    const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const errorText = (error) => {
        const m = (error && (error.message || error.error_description || "")).toLowerCase();
        if (m.includes("invalid login")) return T.errors.invalid;
        if (m.includes("not confirmed")) return T.errors.unconfirmed;
        if (m.includes("already registered") || m.includes("already been registered")) return T.errors.exists;
        if (m.includes("password") && m.includes("6")) return T.errors.short;
        if (m.includes("security purposes") || m.includes("rate limit") || m.includes("too many")) return T.errors.rate;
        return T.errors.generic;
    };

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
    // what counts as "new progress" (to decide whether the page needs a refresh after syncing)
    const signature = (c, t) => JSON.stringify([c.level || "", (c.completed || []).slice().sort(), Object.keys(t.unlocked || {}).sort(),
        (t.days || []).length, (t.perfect || []).length, (t.compared || []).length, Boolean(t.camera), Boolean(t.commCheck), Boolean(t.bizTest)]);

    let user = null;
    let pushTimer = null;
    const push = () => {
        if (!user) return;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(() => {
            db.from("learner_progress").upsert({ user_id: user.id, course: read(COURSE_KEY), trophies: read(TROPHY_KEY), updated_at: new Date().toISOString() })
                .then(() => {}, () => {});
        }, 700);
    };
    const pull = async () => {
        const { data, error } = await db.from("learner_progress").select("course, trophies").eq("user_id", user.id).maybeSingle();
        if (error) return false;
        const lc = read(COURSE_KEY), lt = read(TROPHY_KEY);
        const mc = mergeCourse(lc, (data && data.course) || {}), mt = mergeTrophies(lt, (data && data.trophies) || {});
        write(COURSE_KEY, mc);
        write(TROPHY_KEY, mt);
        push();
        return signature(lc, lt) !== signature(mc, mt); // true = progress from another device arrived
    };
    window.addEventListener("nawee:progress", push);

    const profileName = async () => {
        const { data } = await db.from("profiles").select("username").eq("id", user.id).maybeSingle();
        return (data && data.username) || (user.user_metadata && user.user_metadata.username) || user.email;
    };

    // ---------- small account hint in the course overview ----------
    const fillHint = async () => {
        const slot = document.querySelector("[data-account-slot]");
        if (!slot) return;
        slot.innerHTML = user ? T.hint(esc(await profileName())) : T.hintOut;
    };

    // ---------- account page ----------
    const root = document.querySelector("[data-account]");
    const field = (id, label, type, extra = "") => `<label class="account-label" for="${id}">${label}</label><input class="account-input" id="${id}" name="${id}" type="${type}" ${extra}>`;
    const message = (text, kind = "error") => `<p class="account-message is-${kind}" role="${kind === "error" ? "alert" : "status"}">${text}</p>`;
    const setBusy = (form, busy) => form.querySelectorAll("button, input").forEach((el) => { el.disabled = busy; });

    const views = {
        login(note = "") {
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.loginTitle}</h1><p class="as-lead">${T.loginLead}</p>${note}
                <form class="account-form" data-form novalidate>
                    ${field("email", T.email, "email", 'autocomplete="email" required')}
                    ${field("password", T.password, "password", 'autocomplete="current-password" required')}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.login} <span aria-hidden="true">→</span></button>
                </form>
                <p class="account-links"><button type="button" class="link-button" data-go="forgot">${T.forgot}</button> · ${T.noAccount} <button type="button" class="link-button" data-go="signup">${T.signup}</button></p>`;
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
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.signupTitle}</h1><p class="as-lead">${T.signupLead}</p>
                <form class="account-form" data-form novalidate>
                    ${field("username", T.username, "text", 'autocomplete="username" maxlength="24" required')}
                    <p class="account-hint-text">${T.usernameHint}</p>
                    ${field("email", T.email, "email", 'autocomplete="email" required')}
                    ${field("password", T.password, "password", 'autocomplete="new-password" minlength="8" required')}
                    <p class="account-hint-text">${T.passwordHint}</p>
                    ${field("password2", T.passwordRepeat, "password", 'autocomplete="new-password" minlength="8" required')}
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.signup} <span aria-hidden="true">→</span></button>
                    <p class="as-note">${T.privacy}</p>
                </form>
                <p class="account-links">${T.haveAccount} <button type="button" class="link-button" data-go="login">${T.login}</button></p>`;
            const form = root.querySelector("[data-form]");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = form.querySelector("[data-msg]");
                const username = form.username.value.trim(), email = form.email.value.trim(), password = form.password.value;
                if (!/^[A-Za-z0-9_.-]{3,24}$/.test(username)) { msg.innerHTML = message(T.errors.usernameFormat); return; }
                if (password.length < 8) { msg.innerHTML = message(T.errors.short); return; }
                if (password !== form.password2.value) { msg.innerHTML = message(T.errors.mismatch); return; }
                setBusy(form, true);
                const { data: free, error: checkError } = await db.rpc("username_available", { name: username });
                if (checkError) { setBusy(form, false); msg.innerHTML = message(T.errors.generic); return; }
                if (!free) { setBusy(form, false); msg.innerHTML = message(T.errors.usernameTaken); return; }
                const { error } = await db.auth.signUp({ email, password, options: { data: { username }, emailRedirectTo: LIVE_ACCOUNT_URL } });
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
                    ${field("password", T.passwordNew, "password", 'autocomplete="new-password" minlength="8" required')}
                    ${field("password2", T.passwordRepeat, "password", 'autocomplete="new-password" minlength="8" required')}
                    <p class="account-hint-text">${T.passwordHint}</p>
                    <div data-msg></div>
                    <button type="submit" class="button primary">${T.savePassword} <span aria-hidden="true">→</span></button>
                </form>`;
            const form = root.querySelector("[data-form]");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = form.querySelector("[data-msg]");
                if (form.password.value.length < 8) { msg.innerHTML = message(T.errors.short); return; }
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
            root.innerHTML = `<p class="eyebrow">${T.title.toUpperCase()}</p><h1>${T.hello(esc(name))}</h1>${note}
                <p class="account-meta">${T.loggedInAs} <strong>${esc(user.email)}</strong></p>
                <div class="account-stats">
                    <div><span>${T.level}</span><strong>${esc(level)}</strong></div>
                    <div><span>${isEnglish ? "Course" : "Kurs"}</span><strong>${T.progress(done, total)}</strong></div>
                </div>
                <div class="as-progress" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>
                <section class="trophy-cabinet">
                    <div class="trophy-head"><h2 class="lesson-h">${T.trophies}</h2><p class="trophy-count" data-trophy-count></p></div>
                    <div class="trophy-grid" data-trophies></div>
                    <p class="as-note">${T.syncNote}</p>
                </section>
                <div class="as-actions">
                    <a class="button primary" href="kurs.html">${T.toCourse} <span aria-hidden="true">→</span></a>
                    <button type="button" class="button secondary" data-logout>${T.logout}</button>
                </div>
                <details class="account-danger">
                    <summary>${T.deleteTitle}</summary>
                    <p>${T.deleteText}</p>
                    <button type="button" class="button secondary" data-delete>${T.deleteBtn}</button>
                </details>`;
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
        if (event === "SIGNED_IN") setTimeout(() => views.profile(), 0);
        if (event === "SIGNED_OUT") views.login();
    });

    db.auth.getSession().then(async ({ data }) => {
        user = data.session ? data.session.user : null;
        if (root) {
            if (recovering) return;
            if (user) views.profile(); else views.login();
            return;
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
    });
})();
