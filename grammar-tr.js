// Turkish texts for the grammar lessons (grammar-tr.html, 2026-11-07): explanations in simple Turkish and a comparison with
// Turkish instead of German. Loaded only on the Turkish page; grammar.js merges it into GRAMMAR (practice by index).
// English example sentences and exercises stay English. Reviewed by Omer before going live.

const GRAMMAR_TR = {
    "past-simple": {
        title: "Past simple – geçmiş zaman", teaser: "Dün, geçen hafta ya da 2019’da yaptıkların.",
        rule: "<strong>Past simple</strong> ile geçmişte <strong>belirli bir zamanda bitmiş eylemleri</strong> anlatırız: yesterday, last week, in 2019, two days ago.",
        form: [
            ["Düzenli fiiller: + -ed", "Yazılışa dikkat: study → stud<strong>ied</strong> (y, ie olur), stop → sto<strong>pp</strong>ed (ünsüz harf ikilenir)."],
            ["Düzensiz fiiller: ezberle!", "En sık kullanılan 10 tanesi – neredeyse her konuşmada lazım olur."],
            ["Soru ve olumsuz: did / didn’t + yalın hâl", "did / didn’t’ten sonra her zaman fiilin yalın hâli gelir – geçmiş zaman zaten “did”in içinde."],
        ],
        turkish: "Türkçede geçmiş zaman için “-di” ekini kullanırız: “Dün çalış<strong>tım</strong>.” İngilizcede belirli bir zamanda bitmiş eylemler için <strong>past simple</strong> var: “I <strong>worked</strong> yesterday.” Türkçeden farklı olarak kişiye göre ek değişmez: I worked, you worked, she worked – hepsi aynı.<br>❌ <em>I have seen him yesterday.</em> → ✅ <em>I saw him yesterday.</em>",
        puzzle: ["Şimdiki (yalın hâl)", "Geçmiş"],
        practice: [
            "Düzenli: work + -ed.", "Düzenli: visit + -ed.", "y, ie olur: study → studied.", "Kısa ünlü + ünsüz: ikile – stop → stopped.",
            "go düzensizdir: go → went.", "see → saw (“seen” present perfect için).", "have → had.",
            "“yesterday” (belirli bir zaman) ile her zaman past simple kullanılır.", "did’den sonra yalın hâl gelir: did … go.",
            ["Olumsuz yap:", "Olumsuz: didn’t + yalın hâl – didn’t come."], "Ünsüz + y, ie olur: try → tried.", "Kısa ünlü + ünsüz: ikile – plan → planned.",
            "-e ile bitiyor: sadece -d ekle – live → lived.", "Düzensiz: buy → bought.", "Düzensiz: eat → ate.", "Düzensiz: take → took.", "Düzensiz: come → came.",
            "say → said (“sed” diye okunur).", "make → made; “ago” geçmişi gösterir.", "Bir yılla (in 2019) past simple kullanılır.",
            "Soru kelimesi + did + özne + yalın hâl.", "didn’t + yalın hâl: didn’t see.", ["Soru sor:", "Past simple soruları Did ile başlar."],
            ["Olumsuz yap:", "didn’t + yalın hâl: didn’t go."], "break → broke – tıpkı Mars aracıyla ilgili okuma metnindeki gibi.",
        ],
        speak: "Geçen hafta sonu ne yaptın? Yüksek sesle üç cümle söyle.",
    },
    "present-continuous": {
        title: "Present continuous – şimdiki zaman", teaser: "Şu anda olanlar.",
        rule: "<strong>Present continuous</strong>’ı <strong>şu anda olan</strong> şeyler için – ya da <strong>sadece şimdilik</strong> geçerli olan şeyler için kullanırız: now, right now, at the moment, this week.",
        form: [
            ["am / is / are + fiil + -ing", "Konuşurken neredeyse her zaman kısaltılır: I’m, you’re, she’s, we’re, they’re."],
            ["-ing hâlinin yazılışı", "Okunmayan -e düşer (make → making); kısa ünlü + ünsüz: ikile (run → running); -ie, -y olur (lie → lying)."],
            ["Soru ve olumsuz", "Soru için özne ile am/is/are yer değiştirir – “do” gerekmez."],
        ],
        turkish: "Türkçedeki “-iyor” eki, İngilizcedeki <strong>-ing</strong> hâline çok benzer: “Okuyorum.” → “I’m reading.” Ama dikkat: Türkçede “-iyor”u alışkanlıklar için de kullanırız (“Her akşam kitap okuyorum.”). İngilizcede alışkanlıklar için present simple kullanılır: “I read every evening.”<br>❌ <em>I am reading every evening.</em> → ✅ <em>I read every evening.</em>",
        puzzle: ["Yalın hâl", "-ing hâli"],
        practice: [
            "Şu anda oluyor: is + raining.", "at the moment → am cooking.", "they + are + watching.", "Tam şu an: is sleeping.",
            "have → having (okunmayan e düşer).", "run → running (n ikilenir).", "write → writing (e düşer).", "sit → sitting (t ikilenir).",
            "Tam şu an → I’m waiting.", "“now” → present continuous.", "Bir alışkanlık (every morning) → present simple.",
            "Soru: are + özne + -ing.", "Olumsuz: isn’t + -ing.", "Sadece şimdilik (this week) → present continuous.",
            ["Olumsuz yap:", "am not + feeling."], ["Soru sor:", "you ile soru → Are you …?"], "shine → shining (e düşer).",
            "Soru kelimesi + are + özne + -ing.", "“Listen!” – şu anda oluyor.", "children (çoğul) → are flying.",
        ],
        speak: "Etrafına bak: şu anda neler oluyor? Yüksek sesle üç cümle söyle.",
    },
    comparatives: {
        title: "Karşılaştırma: comparatives & superlatives", teaser: "Şeyleri karşılaştırmak: bigger than, the biggest.",
        rule: "<strong>Karşılaştırmak</strong> için sıfat değişir: <strong>bigger than</strong> (daha büyük) ve <strong>the biggest</strong> (en büyük). Kısa sıfatlar <strong>-er / -est</strong> alır, uzun sıfatlar <strong>more / most</strong>.",
        form: [
            ["Kısa sıfatlar: -er / -est", "big → bigger (g ikilenir), nice → nicer (sadece -r), easy → easier (y, i olur)."],
            ["Uzun sıfatlar: more / most", "Üç heceden itibaren (ve iki heceli birçok sıfatta): more / most – asla “more bigger” denmez."],
            ["Düzensiz: ezberle!", "En önemli üç istisna."],
        ],
        turkish: "Türkçede sıfat değişmez, önüne “daha” ve “en” gelir: daha büyük, en büyük. İngilizcede kısa sıfatların kendisi değişir: <strong>bigger</strong>, <strong>the biggest</strong>. “-den daha” karşılaştırması <strong>than</strong> ile yapılır: “Benim arabam seninkinden daha büyük.” → “My car is bigger <strong>than</strong> yours.”<br>“… kadar” = <strong>as … as</strong>: “She is as tall as her brother.” (O, erkek kardeşi kadar uzun.)",
        puzzle: ["Sıfat", "Karşılaştırma"],
        practice: [
            "Kısa: tall → taller.", "cheap → cheaper.", "big → bigger (g ikilenir).", "hot → hotter (t ikilenir).", "easy → easier (y, i olur).",
            "Uzun: more expensive.", "En üstünlük: the + -est.", "Düzensiz: good → the best.", "Düzensiz: bad → worse.", "Uzun + en üstünlük: the most interesting.",
            "Karşılaştırmak için “than” kullanılır.", "Kısa sıfat → -er, asla “more” ile değil.", "funny → the funniest (y, i olur).", "good → better.",
            "fast → faster.", "Eşitlik: as … as.", "bright → brighter – tıpkı yapraklarla ilgili okuma metnindeki gibi.", "Uzun + en üstünlük: the most important.",
            "small → smaller.", "Düzensiz: far → farther (ya da: further).",
        ],
        speak: "Bildiğin iki şehri karşılaştır. Yüksek sesle üç cümle söyle.",
    },
    future: {
        title: "Gelecek: going to & will", teaser: "Planlar, tahminler ve anlık kararlar.",
        rule: "<strong>going to</strong>: önceden yapılmış <strong>planlar</strong> ve geleceğini gördüğün şeyler için. <strong>will</strong>: <strong>anlık kararlar</strong>, sözler ve tahminler için.",
        form: [
            ["going to: am / is / are going to + yalın hâl", "Plan önceden yapıldı – ya da olacağını görüyorsun."],
            ["will: will / ’ll + yalın hâl", "Konuşurken neredeyse her zaman kısaltılır: I’ll, you’ll, she’ll … Olumsuzu: won’t."],
        ],
        rowLabels: { "Spontan im Restaurant": "Restoranda anlık karar", "Versprechen": "Söz", "Vermutung": "Tahmin", "I visit Anna on Saturday (Plan)": "I visit Anna on Saturday (plan)" },
        turkish: "Türkçede gelecek için genellikle “-ecek / -acak” kullanırız: “Yarın sinemaya gideceğim.” İngilizcede iki yol var: önceden yapılmış <strong>planlar</strong> için <strong>going to</strong> (“I’m going to see a film tomorrow.”), anlık kararlar ve sözler için <strong>will</strong> (“I’ll call you.”).<br>İpucu: “Ben bakarım!” gibi anlık kararlar → will: “The phone is ringing – I’ll get it.”",
        puzzle: ["Durum", "Sonra ne gelir?"],
        practice: [
            "Kesin bir plan (çoktan rezervasyon yapıldı) → going to.", "Anlık bir karar → will.", "Olacağını görüyorsun → going to.", "Bir söz → won’t.",
            "Yerinde sipariş → I’ll have …", "“will” gelecek demek, “want” (istemek) değil.", "Kesin bir plan → going to.", "Plan kesin → am going to learn.",
            "Bir tahmin → will win.", "Olacağını görüyorsun → is going to have.", "Anlık bir karar → I’ll close.", ["Olumsuz yap:", "Olumsuz bir söz → won’t be."],
            ["Soru sor:", "What are you going to …?"], "Kesin bir plan → are going to move.", "Anlık bir teklif → I’ll help.",
            "Emin olmayan bir tahmin (maybe) → will.", "Tıpkı “umbrella” resimli kartındaki gibi: it’s going to rain.", "Yarın için bir söz → I’ll call.",
        ],
        speak: "Gelecek hafta için planların neler? going to ile iki plan, will ile bir tahmin söyle.",
    },
};
