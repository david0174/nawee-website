// Nawee course – placement test question bank (A2–C1, 8 questions per level)
// correctAnswer is zero-based. Answer order is shuffled for each visitor.

const PLACEMENT_LEVELS = ["A2", "B1", "B2", "C1"];

const PLACEMENT_QUESTIONS = {
    A2: [
        { question: "She ___ to work by bus every day.", options: ["go", "goes", "going", "is go"], correctAnswer: 1 },
        { question: "I ___ my keys yesterday.", options: ["lose", "lost", "losed", "have lose"], correctAnswer: 1 },
        { question: "There aren't ___ apples left.", options: ["some", "any", "much", "a"], correctAnswer: 1 },
        { question: "I'm hungry. Let's have ___.", options: ["lunch", "a sleep", "a shower", "homework"], correctAnswer: 0 },
        { question: "The opposite of \"cheap\" is ___.", options: ["expensive", "small", "easy", "slow"], correctAnswer: 0 },
        { question: "I usually ___ my emails in the morning.", options: ["check", "look", "see", "watch"], correctAnswer: 0 },
        { question: "Someone says \"Thank you!\" What do you answer?", options: ["\"You're welcome.\"", "\"Yes, please.\"", "\"Me too.\"", "\"I'm fine.\""], correctAnswer: 0 },
        { question: "You didn't hear what someone said. What do you say?", options: ["\"Sorry, could you say that again?\"", "\"What you say?\"", "\"Again!\"", "\"I don't hear.\""], correctAnswer: 0 },
    ],
    B1: [
        { question: "I ___ in Hannover for two years now.", options: ["live", "am living", "have lived", "lived"], correctAnswer: 2 },
        { question: "If it rains tomorrow, we ___ at home.", options: ["stay", "will stay", "would stay", "stayed"], correctAnswer: 1 },
        { question: "This is the man ___ helped me.", options: ["which", "who", "whose", "what"], correctAnswer: 1 },
        { question: "Could you ___ me a favor?", options: ["do", "make", "give", "take"], correctAnswer: 0 },
        { question: "I'm looking ___ to the weekend.", options: ["forward", "ahead", "up", "out"], correctAnswer: 0 },
        { question: "Can you ___ me up from the station?", options: ["pick", "take", "bring", "get"], correctAnswer: 0 },
        { question: "You want to suggest going to a café. What's most natural?", options: ["\"How about going to a café?\"", "\"We go to a café, yes?\"", "\"I propose café.\"", "\"Café is good for going.\""], correctAnswer: 0 },
        { question: "A colleague asks \"How was your weekend?\" What's the best reply?", options: ["\"Pretty relaxing, thanks! How about yours?\"", "\"My weekend was.\"", "\"Yes, good weekend.\"", "\"I had weekend.\""], correctAnswer: 0 },
    ],
    B2: [
        { question: "By the time we arrived, the movie ___.", options: ["already started", "had already started", "has already started", "was already starting"], correctAnswer: 1 },
        { question: "I wish I ___ more time to travel.", options: ["have", "had", "would have", "will have"], correctAnswer: 1 },
        { question: "She's used to ___ early.", options: ["get up", "getting up", "got up", "gets up"], correctAnswer: 1 },
        { question: "We had to ___ the meeting because the manager was sick.", options: ["put off", "put on", "put up", "put out"], correctAnswer: 0 },
        { question: "The German word \"eventuell\" means ___ in English.", options: ["possibly", "eventually", "finally", "actually"], correctAnswer: 0 },
        { question: "It's ___ – I can't decide which job offer to take.", options: ["a tough call", "a piece of cake", "on the house", "out of order"], correctAnswer: 0 },
        { question: "You disagree with a friend's opinion. What's most natural?", options: ["\"I see your point, but I'm not sure I agree.\"", "\"I don't agree with you at all.\"", "\"Maybe you are right, maybe not.\"", "\"That's wrong, in my opinion.\""], correctAnswer: 0 },
        { question: "You want to end a phone call politely. What do you say?", options: ["\"Well, I'd better let you go – talk soon!\"", "\"Okay, I have to finish now.\"", "\"So, the call is over now.\"", "\"Okay, bye bye now.\""], correctAnswer: 0 },
    ],
    C1: [
        { question: "Hardly ___ the house when it started to rain.", options: ["I had left", "had I left", "I left", "did I leave"], correctAnswer: 1 },
        { question: "Should you ___ any questions, please contact me.", options: ["have", "had", "having", "to have"], correctAnswer: 0 },
        { question: "I'd rather you ___ tell anyone about this yet.", options: ["don't", "didn't", "won't", "not"], correctAnswer: 1 },
        { question: "Her explanation was so ___ that everyone understood it immediately.", options: ["lucid", "lurid", "livid", "lavish"], correctAnswer: 0 },
        { question: "Let's not ___ around the bush – what's the real problem?", options: ["beat", "hit", "walk", "run"], correctAnswer: 0 },
        { question: "The project was a success, ___ the tight budget.", options: ["despite", "although", "however", "even though"], correctAnswer: 0 },
        { question: "In a meeting, you want to add to a colleague's point. What's most natural?", options: ["\"Building on what Sarah said, I'd also add that…\"", "\"Sarah is right, but more important is…\"", "\"Like Sarah said already, …\"", "\"Okay, now my point: …\""], correctAnswer: 0 },
        { question: "Which is the most tactful way to give critical feedback?", options: ["\"There are a few areas where I think we could make this even stronger.\"", "\"Honestly, this needs a lot of work.\"", "\"It's okay, but not really good.\"", "\"You should have done this differently.\""], correctAnswer: 0 },
    ],
};
