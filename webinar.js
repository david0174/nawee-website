// Free live web seminar (webseminar.html / web-seminar.html): reserve a seat with a Nawee account.
// Seats are limited in the database (05-webinar.sql); the Meet link is only shown on the account page to
// people who signed up. Uses the Supabase client from account.js (window.NaweeDB).

(() => {
    const box = document.querySelector("[data-webinar]");
    if (!box) return;

    const de = document.documentElement.lang === "de";
    const WEBINAR = "2026-11-23";
    const SEATS = 100; // same number as in 06-webinar-100-seats.sql – not shown on the page, only "few seats left" / "fully booked"
    const START = new Date("2026-11-23T19:00:00+01:00"), END = new Date("2026-11-23T19:30:00+01:00");
    const page = de ? "webseminar.html" : "web-seminar.html";
    const account = de ? "konto.html" : "account.html";
    const T = de ? {
        left: (n) => (n === 1 ? "Nur noch 1 Platz frei" : `Nur noch ${n} Plätze frei`), full: "Leider ausgebucht – alle Plätze sind vergeben.",
        needAccount: "Für die Anmeldung brauchst du ein kostenloses Nawee-Konto.", signup: "Konto erstellen und Platz sichern", login: "Ich habe schon ein Konto",
        reserve: "Platz reservieren", reserving: "Einen Moment …", inTitle: "✓ Du bist dabei!",
        inText: "Den Meet-Link findest du in „Mein Konto“ – spätestens am Tag vorher.", toAccount: "Zu meinem Konto", gcal: "Zu Google Kalender hinzufügen", calendar: "Apple / Outlook (.ics)",
        cancel: "Anmeldung zurückziehen", cancelQ: "Möchtest du deinen Platz wirklich freigeben?", error: "Das hat leider nicht geklappt. Bitte versuch es noch einmal.",
        past: "Dieses Web-Seminar hat schon stattgefunden. Danke an alle, die dabei waren!",
    } : {
        left: (n) => (n === 1 ? "Only 1 seat left" : `Only ${n} seats left`), full: "Fully booked – all seats are taken.",
        needAccount: "To sign up, you need a free Nawee account.", signup: "Create an account and save your seat", login: "I already have an account",
        reserve: "Reserve my seat", reserving: "One moment …", inTitle: "✓ You’re in!",
        inText: "You’ll find the Meet link on “My account” – at the latest the day before.", toAccount: "Go to my account", gcal: "Add to Google Calendar", calendar: "Apple / Outlook (.ics)",
        cancel: "Cancel my sign-up", cancelQ: "Do you really want to give up your seat?", error: "That didn’t work. Please try again.",
        past: "This web seminar has already taken place. Thanks to everyone who joined!",
    };

    const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = de ? "Nawee Live-Web-Seminar: Englisch selbst lernen" : "Nawee live web seminar: Learn English on your own";
    // the Meet link goes into the calendar entry once it exists (only signed-up people can read it), otherwise the account page
    const details = (meet) => meet || (de ? "Meet-Link: https://nawee.net/konto.html" : "Meet link: https://nawee.net/account.html");

    // Google Calendar: opens a prefilled "new event" page, the person saves it themselves
    const gcal = (meet) => `https://calendar.google.com/calendar/render?dates=${WEBINAR.replace(/-/g, "")}T190000/${WEBINAR.replace(/-/g, "")}T193000&` + new URLSearchParams({
        action: "TEMPLATE", text: title, ctz: "Europe/Berlin",
        details: details(meet), location: meet || "Google Meet",
    });

    // calendar file (.ics) for Apple / Outlook – created in the browser, nothing is sent anywhere
    const ics = (meet) => {
        const f = stamp;
        const text = [
            "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nawee//Web Seminar//EN", "BEGIN:VEVENT",
            `UID:${WEBINAR}@nawee.net`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(START)}`, `DTEND:${f(END)}`,
            `SUMMARY:${title}`, `DESCRIPTION:${details(meet)}`, `LOCATION:${meet || "Google Meet"}`,
            "END:VEVENT", "END:VCALENDAR"].join("\r\n");
        return URL.createObjectURL(new Blob([text], { type: "text/calendar" }));
    };

    const seatsLeft = async (db) => {
        const timeout = new Promise((r) => setTimeout(() => r({ error: true }), 5000)); // never leave the box hanging
        const { data, error } = await Promise.race([db.rpc("webinar_seats_taken", { w: WEBINAR }), timeout]);
        return error ? null : Math.max(0, SEATS - data);
    };

    const render = async () => {
        if (new Date() > END) { box.innerHTML = `<p class="wb-note">${T.past}</p>`; return; }
        const db = window.NaweeDB, user = window.NaweeUser;
        if (!db) return;
        const left = await seatsLeft(db);
        const seatsLine = left === null || left > 10 ? "" : `<p class="wb-seats${left === 0 ? " is-full" : ""}">${left === 0 ? T.full : `🪑 ${T.left(left)}`}</p>`; // only when it gets tight
        let mine = false;
        if (user) {
            const { data } = await db.from("webinar_registrations").select("webinar").eq("webinar", WEBINAR).eq("user_id", user.id).maybeSingle();
            mine = Boolean(data);
        }
        if (mine) {
            const { data: link } = await db.from("webinar_links").select("zoom_url").eq("webinar", WEBINAR).maybeSingle();
            const meet = link && /^https:\/\/meet\.google\.com\/[a-z0-9-]+(\?[^\s"<>]*)?$/i.test(link.zoom_url) ? link.zoom_url : "";
            box.innerHTML = `<p class="wb-in">${T.inTitle}</p><p>${T.inText}</p>
                <div class="wb-actions"><a class="button primary" href="${account}">${T.toAccount} →</a>
                <a class="button secondary" href="${gcal(meet).replace(/&/g, "&amp;")}" target="_blank" rel="noopener">📅 ${T.gcal}</a>
                <a class="button secondary" href="${ics(meet)}" download="nawee-web-seminar.ics">${T.calendar}</a></div>
                <button type="button" class="link-button wb-cancel" data-cancel>${T.cancel}</button>`;
            box.querySelector("[data-cancel]").addEventListener("click", async () => {
                if (!confirm(T.cancelQ)) return;
                await db.from("webinar_registrations").delete().eq("webinar", WEBINAR).eq("user_id", user.id);
                render();
            });
            return;
        }
        if (left === 0) { box.innerHTML = seatsLine; return; }
        if (!user) {
            const next = encodeURIComponent(page);
            box.innerHTML = `${seatsLine}<p>${T.needAccount}</p>
                <div class="wb-actions"><a class="button primary" href="${account}?mode=signup&next=${next}">${T.signup} →</a>
                <a class="button secondary" href="${account}?next=${next}">${T.login}</a></div>`;
            return;
        }
        box.innerHTML = `${seatsLine}<button type="button" class="button primary" data-reserve>${T.reserve} →</button><p class="wb-msg" data-msg></p>`;
        const btn = box.querySelector("[data-reserve]");
        btn.addEventListener("click", async () => {
            btn.disabled = true; btn.textContent = T.reserving;
            const { error } = await db.from("webinar_registrations").insert({ webinar: WEBINAR });
            if (error) { btn.disabled = false; btn.textContent = `${T.reserve} →`; box.querySelector("[data-msg]").textContent = T.error; render(); return; }
            render();
        });
    };

    window.addEventListener("nawee:session", render);
    if (window.NaweeUser !== undefined) render();
})();
