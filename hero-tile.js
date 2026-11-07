// Homepage hero tile: logged out = a simple start (in the HTML); logged in = the learner's progress
// (course lessons, picture-card words, reading texts, streak) and a button to the next step.
// Reads only what is stored in this browser (synced from the account by account.js on learning pages).

(() => {
    const tile = document.querySelector("[data-hero-tile]");
    if (!tile) return;
    const de = document.documentElement.lang === "de";
    const tr = document.documentElement.lang === "tr";
    const x = (d, e, t) => (de ? d : tr ? t : e); // German / English / Turkish
    const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
    let session = null;
    try { session = JSON.parse(localStorage.getItem("sb-sphhbjfyreugpuzbwird-auth-token") || "null"); } catch { /* ignore */ }
    if (!session || !session.user || !session.refresh_token) return; // logged out: keep the simple start tile

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    let name = "";
    try { name = localStorage.getItem("nawee-username") || ""; } catch { /* ignore */ }
    const m = session.user.user_metadata || {};
    name = m.first_name || m.given_name || name || m.username || "";

    // course: published lessons of "English from the start"
    const lessons = typeof WORK_MODULES === "undefined" ? [] : WORK_MODULES.flatMap((mod) => mod.lessons)
        .filter((l) => typeof WORK_LESSONS !== "undefined" && WORK_LESSONS[l.id] && !WORK_LESSONS[l.id].draft);
    const doneIds = read("nawee-work-course-v1").completed || [];
    const lessonsDone = lessons.filter((l) => doneIds.includes(l.id)).length;
    const next = lessons.find((l) => !doneIds.includes(l.id));
    // picture cards: words practiced at least once
    const cards = read("nawee-vocab-v1").cards || {};
    const totalWords = typeof VOCAB_DECKS === "undefined" ? 0 : Object.values(VOCAB_DECKS).reduce((n, d) => n + d.words.length, 0);
    const words = Object.values(cards).filter((c) => (c.reps || 0) > 0).length;
    // reading
    const totalTexts = typeof READINGS === "undefined" ? 0 : READINGS.length;
    const texts = Object.keys(read("nawee-reading-v1").done || {}).length;
    // streak (any learning activity)
    const days = new Set([...(read("nawee-trophies-v1").days || []), ...(read("nawee-vocab-v1").days || []), ...(read("nawee-games-v1").days || []), ...Object.keys(read("nawee-time-v1").days || {})]);
    Object.values(read("nawee-reading-v1").done || {}).forEach((r) => r.date && days.add(r.date));
    const iso = (d) => d.toISOString().slice(0, 10);
    const d = new Date();
    if (!days.has(iso(d))) d.setDate(d.getDate() - 1);
    let streak = 0;
    while (days.has(iso(d))) { streak += 1; d.setDate(d.getDate() - 1); }

    const row = (icon, label, n, total, href) => `<a class="ht-row" href="${href}">
            <span class="ht-label"><span aria-hidden="true">${icon}</span> ${label}</span>
            <span class="ht-count">${n}/${total}</span>
            <span class="ht-bar"><span style="width:${total ? Math.round((n / total) * 100) : 0}%"></span></span>
        </a>`;
    const nextHref = next ? `${de ? "beruf-lektion.html" : "work-lesson.html"}?l=${next.id}` : x("vokabeln.html", "vocabulary.html", "vocabulary-tr.html");
    const nextLabel = next ? `${x("Weiter", "Continue", "Devam et")}: ${esc(de ? next.title.de : next.title.en)}` : x("Bildkarten üben", "Practice picture cards", "Resimli kartları çalış");

    tile.classList.add("is-progress");
    tile.innerHTML = `<p class="path-chooser-label">${x("Dein Fortschritt", "Your progress", "İlerlemen")}</p>
        <p class="ht-hello">${name ? `${x("Hallo", "Hi", "Merhaba")}, ${esc(name.charAt(0).toUpperCase() + name.slice(1))}!` : x("Schön, dass du da bist!", "Good to see you!", "Seni görmek güzel!")}
            ${streak ? `<span class="ht-streak">🔥 ${streak} ${x(streak === 1 ? "Tag" : "Tage", streak === 1 ? "day" : "days", "gün")}</span>` : ""}</p>
        ${row("🎧", x("Lektionen", "Lessons", "Dersler"), lessonsDone, lessons.length, de ? "fuer-mich.html" : "for-me.html")}
        ${row("🖼️", x("Bildkarten-Wörter", "Picture-card words", "Resimli kart kelimeleri"), words, totalWords, x("vokabeln.html", "vocabulary.html", "vocabulary-tr.html"))}
        ${row("📰", x("Lesetexte", "Reading texts", "Okuma metinleri"), texts, totalTexts, de ? "lesen.html" : tr ? "reading-tr.html" : "reading.html")}
        <a class="button primary path-start" href="${nextHref}">${nextLabel} <span aria-hidden="true">→</span></a>
        <a class="path-login" href="${x("konto.html", "account.html", "account-tr.html")}">${x("Zu meinem Konto", "Go to my account", "Hesabıma git")} →</a>`;
})();
