// Job interview module (interview.html / vorstellungsgespraech.html / interview-tr.html) – first part of Business English.
// Plan: Business-documents/Interview-Module-Plan.md (approved by David 2026-11-07: two answer levels, one video-interview
// scene, lesson 1 as a beta first). Practice content is English; explanations, tips and checklists come in de / en / tr.
// Characters: Mark (interviewer, voice "b") and Ben (candidate, voice "c") – browser voices until David's recordings exist.
// Lesson parts: scene (listen) → understand (3 questions) → phrases (hear + 🎤 check) → build (put blocks in order)
// → answer (question out loud, timer, own recording, self-check, example answers B1 / B2–C1, notebook) → tip → mission.

const INTERVIEW_LESSONS = [
    {
        id: "1", icon: "👋", ready: true, beta: true,
        title: { de: "Erzählen Sie etwas über sich", en: "Tell me about yourself", tr: "Bize biraz kendinizden bahsedin" },
        goal: {
            de: "Du stellst dich in 60–90 Sekunden klar und sicher vor: was du jetzt machst, was du vorher gemacht hast – und warum du diesen Job willst.",
            en: "You introduce yourself clearly and confidently in 60–90 seconds: what you do now, what you did before – and why you want this job.",
            tr: "60–90 saniyede kendini net ve özgüvenle tanıtırsın: şu an ne yapıyorsun, önce ne yaptın – ve bu işi neden istiyorsun.",
        },
        scene: [
            { part: { de: "Versuch 1", en: "Take 1", tr: "1. deneme" } },
            { who: "Mark", text: "Hi Ben, thanks for coming in today. Please, have a seat." },
            { who: "Ben", text: "Thank you for having me." },
            { who: "Mark", text: "So, let’s get started. Tell me a little about yourself." },
            { who: "Ben", text: "Um, okay. I was born in Leeds in 1996. I went to school there, and then I studied business. Then I did an internship, and then I worked at a bank for a year, and now I’m in sales … yeah, that’s it." },
            { who: "Mark", text: "Okay … thank you." },
            { part: { de: "Versuch 2", en: "Take 2", tr: "2. deneme" } },
            { who: "Mark", text: "Tell me a little about yourself." },
            { who: "Ben", text: "Sure. Currently, I work as a sales assistant at a sports shop in Hannover, where I look after our biggest customers." },
            { who: "Ben", text: "Before that, I studied business administration. That’s where I discovered how much I enjoy working with people." },
            { who: "Ben", text: "Last year, I was our top seller in the region. Now I’m looking for a role with more responsibility – that’s why I’m excited about this position." },
            { who: "Mark", text: "That sounds great. Tell me more about your work with customers." },
        ],
        understand: [
            { q: "What was the problem with Ben’s first answer?", options: ["He told his whole life story and ended weakly.", "He spoke too quietly.", "He asked Mark too many questions."], answer: 0,
              why: { de: "Er hat seinen Lebenslauf von der Geburt an nacherzählt und mit „yeah, that’s it“ aufgehört – Mark weiß danach nicht, warum Ben gut für den Job ist.", en: "He retold his CV from birth and stopped with “yeah, that’s it” – Mark still doesn’t know why Ben is good for the job.", tr: "Doğumundan itibaren özgeçmişini anlattı ve “yeah, that’s it” diyerek bitirdi – Mark hâlâ Ben’in bu iş için neden iyi olduğunu bilmiyor." } },
            { q: "What does Ben talk about first in his second answer?", options: ["His current job", "His school", "His hobbies"], answer: 0,
              why: { de: "Er beginnt mit der Gegenwart: „Currently, I work as …“ – das interessiert den Interviewer am meisten.", en: "He starts with the present: “Currently, I work as …” – that’s what the interviewer cares about most.", tr: "Şimdiki zamanla başlıyor: “Currently, I work as …” – mülakatçıyı en çok ilgilendiren de bu." } },
            { q: "How does Ben end his second answer?", options: ["With why he wants this job", "With “yeah, that’s it”", "With a question about the salary"], answer: 0,
              why: { de: "Er endet mit der Brücke zum Job: „… that’s why I’m excited about this position.“ So landet die Antwort.", en: "He ends with a bridge to the job: “… that’s why I’m excited about this position.” That’s how the answer lands.", tr: "Cevabını işe bağlayarak bitiriyor: “… that’s why I’m excited about this position.” Cevap böyle tam oturuyor." } },
        ],
        phrases: [
            { text: "Currently, I work as a sales assistant.", use: { de: "Mit der Gegenwart beginnen", en: "Start with the present", tr: "Şimdiki zamanla başla" } },
            { text: "I’m responsible for our biggest customers.", use: { de: "Deine Aufgabe nennen", en: "Say what you do", tr: "Görevini söyle" } },
            { text: "Before that, I studied business administration.", use: { de: "Zur Vergangenheit überleiten", en: "Move to the past", tr: "Geçmişe geç" } },
            { text: "That’s where I discovered how much I enjoy working with people.", use: { de: "Zeigen, was dich antreibt", en: "Show what drives you", tr: "Seni neyin motive ettiğini göster" } },
            { text: "Last year, I was our top seller in the region.", use: { de: "Einen Erfolg nennen", en: "Mention one success", tr: "Bir başarını söyle" } },
            { text: "Now I’m looking for a role with more responsibility.", use: { de: "Nach vorn schauen", en: "Look ahead", tr: "İleriye bak" } },
            { text: "That’s why I’m excited about this position.", use: { de: "Die Brücke zum Job schlagen", en: "Bridge to the job", tr: "İşe köprü kur" } },
        ],
        build: {
            task: { de: "Bring die Antwort in die richtige Reihenfolge: Tippe die Teile nacheinander an.", en: "Put the answer in the right order: tap the parts one after the other.", tr: "Cevabı doğru sıraya koy: parçalara sırayla dokun." },
            blocks: [
                { text: "Currently, I work as a nurse at a hospital in Ankara.", label: { de: "Gegenwart", en: "Present", tr: "Şimdi" } },
                { text: "Before that, I trained for three years and worked in a small clinic.", label: { de: "Vergangenheit", en: "Past", tr: "Geçmiş" } },
                { text: "Last year, I helped set up a new team for night shifts.", label: { de: "Erfolg", en: "Success", tr: "Başarı" } },
                { text: "That’s why I’d love to bring this experience to your hospital.", label: { de: "Warum dieser Job", en: "Why this job", tr: "Neden bu iş" } },
            ],
            why: { de: "Gegenwart → Vergangenheit → ein Erfolg → warum dieser Job. So bleibt die Antwort kurz und endet mit dem, was der Interviewer hören will.", en: "Present → past → one success → why this job. That keeps the answer short and ends with what the interviewer wants to hear.", tr: "Şimdi → geçmiş → bir başarı → neden bu iş. Böylece cevap kısa kalır ve mülakatçının duymak istediği şeyle biter." },
        },
        answer: {
            q: "So, tell me a little about yourself.", seconds: 90, note: "about-yourself",
            checks: [
                { de: "Ich habe mit meiner jetzigen Arbeit (oder meinem Studium) begonnen.", en: "I started with what I do now (job or studies).", tr: "Şu anki işimle (ya da okulumla) başladım." },
                { de: "Ich habe kurz erzählt, was ich vorher gemacht habe – nicht mein ganzes Leben.", en: "I briefly said what I did before – not my whole life.", tr: "Önce ne yaptığımı kısaca anlattım – tüm hayatımı değil." },
                { de: "Ich habe einen konkreten Erfolg genannt.", en: "I mentioned one concrete success.", tr: "Somut bir başarımı söyledim." },
                { de: "Ich habe damit geendet, warum ich diesen Job will.", en: "I ended with why I want this job.", tr: "Bu işi neden istediğimle bitirdim." },
                { de: "Ich war unter 90 Sekunden.", en: "I stayed under 90 seconds.", tr: "90 saniyenin altında kaldım." },
            ],
            models: {
                b1: "Currently, I work as a sales assistant at a sports shop in Hannover. Before that, I studied business for three years. What I enjoy most is helping customers find the right product. Last year, I was the best seller in our shop. That’s why I’m excited about this role in your team.",
                b2: "I’m a sales assistant with three years of experience in retail, currently at a sports shop in Hannover, where I look after our biggest customers. Before that, I studied business administration, which is where I discovered how much I enjoy working with people. Last year, I was our top seller in the region, and now I’m looking for a role where I can take on more responsibility – which is exactly what attracted me to this position.",
            },
        },
        tip: {
            de: "Erzähl nicht deine ganze Lebensgeschichte. 60 bis 90 Sekunden sind ideal, zwei Minuten das Maximum. Und keine Angst vor dem Eigenlob: In englischsprachigen Interviews ist es normal, über die eigenen Erfolge zu sprechen – sag „I“, nicht nur „we“.",
            en: "Don’t tell your whole life story. 60 to 90 seconds is ideal, two minutes is the maximum. And don’t be shy about your successes: in English-speaking interviews it’s normal to talk about what you achieved – say “I”, not only “we”.",
            tr: "Tüm hayat hikâyeni anlatma. 60–90 saniye ideal, iki dakika en fazlası. Başarılarını anlatmaktan da çekinme: İngilizce mülakatlarda kendi başarılarından bahsetmek normaldir – sadece “we” değil, “I” de.",
        },
        mission: {
            de: "Schreib deine eigene Antwort auf „Tell me about yourself“ unten ins Notizbuch. Sag sie dann dreimal laut – beim dritten Mal, ohne hinzuschauen.",
            en: "Write your own answer to “Tell me about yourself” in the notebook below. Then say it out loud three times – the third time without looking.",
            tr: "“Tell me about yourself” sorusuna kendi cevabını aşağıdaki deftere yaz. Sonra üç kez yüksek sesle söyle – üçüncüsünde bakmadan.",
        },
    },
    { id: "2", icon: "💪", title: { de: "Stärken, Schwächen & Motivation", en: "Strengths, weaknesses & motivation", tr: "Güçlü yönler, zayıf yönler ve motivasyon" } },
    { id: "3", icon: "📖", title: { de: "Erzählen Sie von einer Situation, als … (STAR)", en: "Tell me about a time when … (STAR)", tr: "Bize … bir durumu anlatın (STAR)" } },
    { id: "4", icon: "🧭", title: { de: "Knifflige Momente", en: "Tricky moments", tr: "Zor anlar" } },
    { id: "5", icon: "🤝", title: { de: "Deine Fragen & der Abschluss", en: "Your questions & the close", tr: "Senin soruların ve kapanış" } },
    { id: "6", icon: "🎬", title: { de: "Das Probe-Interview (auch per Zoom/Teams)", en: "The mock interview (also on Zoom/Teams)", tr: "Deneme mülakatı (Zoom/Teams’te de)" } },
];
