// Reading Comprehension passages -- English CEFR-level track (A1-C2).
// All passages and questions below are ORIGINAL content written for this
// app -- they are NOT copied or adapted from any third-party site.
// (test-english.com/reading/ was consulted only for structural inspiration
// -- their Terms of Use explicitly prohibit copying/republishing: "You may
// not copy, download, print, frame, or republish any material from this
// website in any form or on any other website... All materials, including
// test questions..., are protected by international copyright law." --
// so their actual texts/questions were intentionally NOT used as a
// source here.)
// Schema: { level, title, text, questions: [ { q, options: [4], correct,
// hint, explain } ] }. `correct` is the 0-based index into `options` of
// the right answer. This is a SEPARATE, parallel English track alongside
// the original grade-based one (data/readingcomp.js / window.
// READING_PASSAGES, grades 1-12) -- both stay available; the in-page
// "By Grade" / "By CEFR Level" toggle (English only) picks which one is
// active. Used ONLY by the Reading Comprehension game
// (readingcomprehension.js), selected when currentLang === "en" and the
// CEFR mode is active.

window.READING_PASSAGES_EN_CEFR = [
  // ===================== A1 =====================
  {
    level: "A1",
    title: "A Day at the Beach",
    text:
      "Today is a hot day. Maria and her brother go to the beach. They swim in the sea. Maria builds a " +
      "sandcastle. Her brother collects shells. At noon, they eat sandwiches under an umbrella. In the " +
      "evening, they watch the sunset.",
    questions: [
      { q: "What is the weather like today?", options: ["Cold", "Hot", "Rainy", "Snowy"], correct: 1, hint: "Look at the first sentence.", explain: "The text says: \"Today is a hot day.\"" },
      { q: "Where do Maria and her brother go?", options: ["To the park", "To the beach", "To school", "To the mountains"], correct: 1, hint: "Look at the second sentence.", explain: "The text says: \"Maria and her brother go to the beach.\"" },
      { q: "What does Maria build?", options: ["A sandcastle", "A boat", "A tower", "A house"], correct: 0, hint: "Look at the sentence about Maria.", explain: "The text says: \"Maria builds a sandcastle.\"" },
      { q: "What does her brother collect?", options: ["Rocks", "Shells", "Leaves", "Coins"], correct: 1, hint: "Look at the sentence about her brother.", explain: "The text says: \"Her brother collects shells.\"" },
      { q: "What do they do in the evening?", options: ["They go home", "They watch the sunset", "They swim again", "They eat dinner"], correct: 1, hint: "Look at the last sentence.", explain: "The text says: \"In the evening, they watch the sunset.\"" },
    ],
  },
  {
    level: "A1",
    title: "My Favorite Animal",
    text:
      "My favorite animal is the elephant. Elephants are very big and gray. They have long trunks and big " +
      "ears. Elephants eat leaves, grass, and fruit. They live in Africa and Asia. Elephants are very smart " +
      "animals.",
    questions: [
      { q: "What is the writer's favorite animal?", options: ["The lion", "The elephant", "The tiger", "The monkey"], correct: 1, hint: "Look at the first sentence.", explain: "The text says: \"My favorite animal is the elephant.\"" },
      { q: "What color are elephants?", options: ["Brown", "Gray", "Black", "White"], correct: 1, hint: "Look at the second sentence.", explain: "The text says elephants are \"very big and gray.\"" },
      { q: "What do elephants have?", options: ["Long trunks and big ears", "Short tails and small eyes", "Wings and feathers", "Sharp teeth and claws"], correct: 0, hint: "Look at the third sentence.", explain: "The text says they \"have long trunks and big ears.\"" },
      { q: "What do elephants eat?", options: ["Meat and fish", "Leaves, grass, and fruit", "Only fruit", "Insects"], correct: 1, hint: "Look at the sentence about food.", explain: "The text says elephants \"eat leaves, grass, and fruit.\"" },
      { q: "Where do elephants live?", options: ["Only in Africa", "Africa and Asia", "Only in Asia", "Europe and Africa"], correct: 1, hint: "Look at the sentence about where they live.", explain: "The text says they \"live in Africa and Asia.\"" },
    ],
  },

  // ===================== A2 =====================
  {
    level: "A2",
    title: "A Letter to a Friend",
    text:
      "Dear Anna, I hope you are doing well. Last month, I moved to a new apartment in the city center. My " +
      "new apartment is smaller than my old one, but it is much closer to my office. Now I can walk to work " +
      "instead of taking the bus. On weekends, I like to explore the local cafes and parks nearby. I hope " +
      "you can visit me soon. Best wishes, Laura",
    questions: [
      { q: "What did Laura do last month?", options: ["She got a new job", "She moved to a new apartment", "She went on vacation", "She started school"], correct: 1, hint: "Look at the second sentence.", explain: "The text says: \"Last month, I moved to a new apartment.\"" },
      { q: "How does the new apartment compare to the old one?", options: ["It is bigger", "It is smaller but closer to the office", "It is the same size", "It is farther from work"], correct: 1, hint: "Look at the sentence comparing the apartments.", explain: "The text says it is \"smaller than my old one, but...much closer to my office.\"" },
      { q: "How does Laura get to work now?", options: ["By bus", "By walking", "By car", "By bike"], correct: 1, hint: "Look at the sentence about getting to work.", explain: "The text says, \"Now I can walk to work instead of taking the bus.\"" },
      { q: "What does Laura like to do on weekends?", options: ["Stay home", "Explore cafes and parks", "Work extra hours", "Visit Anna"], correct: 1, hint: "Look at the sentence about weekends.", explain: "The text says she likes \"to explore the local cafes and parks nearby.\"" },
      { q: "What does Laura hope for at the end of the letter?", options: ["That Anna will move too", "That Anna can visit her soon", "That Anna will write back", "That Anna will find a new job"], correct: 1, hint: "Look at the last sentence before the signature.", explain: "The text says, \"I hope you can visit me soon.\"" },
    ],
  },
  {
    level: "A2",
    title: "Planning a Birthday Party",
    text:
      "Tom is planning a birthday party for his sister, Ella. The party will be next Saturday afternoon. He " +
      "wants to invite twenty guests. Tom is going to order a chocolate cake from the bakery downtown. He " +
      "also needs to buy balloons and decorations. His parents will help him cook the food. Ella does not " +
      "know about the party yet, so everyone must keep it a secret.",
    questions: [
      { q: "Who is the party for?", options: ["Tom", "Ella", "Their parents", "A friend"], correct: 1, hint: "Look at the first sentence.", explain: "The text says Tom is planning a party \"for his sister, Ella.\"" },
      { q: "When is the party?", options: ["Next Friday morning", "Next Saturday afternoon", "Next Sunday evening", "Tomorrow"], correct: 1, hint: "Look at the second sentence.", explain: "The text says, \"The party will be next Saturday afternoon.\"" },
      { q: "How many guests does Tom want to invite?", options: ["Ten", "Fifteen", "Twenty", "Thirty"], correct: 2, hint: "Look at the sentence about guests.", explain: "The text says, \"He wants to invite twenty guests.\"" },
      { q: "Where will Tom order the cake from?", options: ["A supermarket", "A bakery downtown", "A restaurant", "He will bake it himself"], correct: 1, hint: "Look at the sentence about the cake.", explain: "The text says he will order it \"from the bakery downtown.\"" },
      { q: "Does Ella know about the party?", options: ["Yes, she is helping to plan it", "No, it is a secret", "Yes, but she is pretending not to know", "The text does not say"], correct: 1, hint: "Look at the last sentence.", explain: "The text says, \"Ella does not know about the party yet, so everyone must keep it a secret.\"" },
    ],
  },

  // ===================== B1 =====================
  {
    level: "B1",
    title: "Learning a New Language",
    text:
      "Learning a new language can open many doors, both personally and professionally. Many people start by " +
      "learning basic vocabulary and grammar rules, but real fluency often comes from practicing with native " +
      "speakers. Watching movies and listening to podcasts in the target language can also improve listening " +
      "skills significantly. Some learners find it helpful to keep a journal in the new language, writing a " +
      "few sentences every day. Although mistakes are a normal part of the learning process, many beginners " +
      "feel embarrassed to speak until they are more confident. Experts agree, however, that the fastest way " +
      "to improve is to practice speaking as often as possible, even if it feels uncomfortable at first.",
    questions: [
      { q: "What can learning a new language open, according to the text?", options: ["Only professional doors", "Many doors, both personally and professionally", "Only personal doors", "No real opportunities"], correct: 1, hint: "Look at the first sentence.", explain: "The text says it \"can open many doors, both personally and professionally.\"" },
      { q: "Where does real fluency often come from, according to the text?", options: ["Reading grammar books", "Practicing with native speakers", "Watching TV only", "Taking written tests"], correct: 1, hint: "Look at the second sentence.", explain: "The text says fluency \"often comes from practicing with native speakers.\"" },
      { q: "What can improve listening skills, according to the text?", options: ["Writing essays", "Watching movies and listening to podcasts", "Doing grammar exercises", "Memorizing word lists"], correct: 1, hint: "Look at the sentence about listening skills.", explain: "The text says these activities \"can also improve listening skills significantly.\"" },
      { q: "Why do many beginners feel embarrassed to speak?", options: ["They dislike the language", "Mistakes are normal, but it still feels uncomfortable until they are confident", "They do not want to learn", "Their teachers discourage them"], correct: 1, hint: "Look at the sentence about mistakes.", explain: "The text says \"many beginners feel embarrassed to speak until they are more confident,\" even though mistakes are normal." },
      { q: "What do experts say is the fastest way to improve, according to the text?", options: ["Studying grammar alone", "Practicing speaking as often as possible", "Avoiding mistakes completely", "Only reading books"], correct: 1, hint: "Look at the last sentence.", explain: "The text says experts agree \"the fastest way to improve is to practice speaking as often as possible.\"" },
    ],
  },
  {
    level: "B1",
    title: "The Rise of Remote Work",
    text:
      "In recent years, more and more companies have allowed employees to work from home rather than " +
      "commuting to an office every day. This shift became especially common after many businesses were " +
      "forced to adapt during a global health crisis. Employees often report that remote work gives them " +
      "more flexibility and helps them balance their personal and professional lives. However, some workers " +
      "say they miss the social interaction of an office environment and find it harder to separate work " +
      "time from personal time. Managers have also had to find new ways to keep teams connected, often " +
      "relying on video calls and messaging apps. As a result, many companies now offer a hybrid model, " +
      "allowing staff to split their time between the office and home.",
    questions: [
      { q: "What have more companies allowed employees to do in recent years?", options: ["Take longer vacations", "Work from home", "Work fewer hours", "Change careers easily"], correct: 1, hint: "Look at the first sentence.", explain: "The text says companies have allowed employees \"to work from home rather than commuting to an office every day.\"" },
      { q: "When did this shift become especially common?", options: ["During a global health crisis", "Before the internet existed", "During a recession", "After a war"], correct: 0, hint: "Look at the second sentence.", explain: "The text says it became common \"after many businesses were forced to adapt during a global health crisis.\"" },
      { q: "What benefit do employees often report from remote work?", options: ["Higher salaries", "More flexibility and better work-life balance", "Faster promotions", "More vacation days"], correct: 1, hint: "Look at the sentence about employees' reports.", explain: "The text says it \"gives them more flexibility and helps them balance their personal and professional lives.\"" },
      { q: "What do some workers say they miss about the office?", options: ["The commute", "Social interaction", "Their desks", "The parking lot"], correct: 1, hint: "Look at the sentence starting with 'However'.", explain: "The text says some workers \"miss the social interaction of an office environment.\"" },
      { q: "What model do many companies now offer, according to the text?", options: ["Fully remote only", "A hybrid model splitting time between office and home", "Fully in-office only", "A four-day work week"], correct: 1, hint: "Look at the last sentence.", explain: "The text says many companies \"now offer a hybrid model, allowing staff to split their time between the office and home.\"" },
    ],
  },

  // ===================== B2 =====================
  {
    level: "B2",
    title: "The Psychology of Procrastination",
    text:
      "Procrastination is often misunderstood as simple laziness, but psychologists argue that it is actually " +
      "a much more complex issue rooted in emotional regulation rather than time management. When faced with " +
      "a task that provokes anxiety, boredom, or self-doubt, the brain seeks short-term relief by turning to " +
      "more pleasant activities, even when the person is fully aware of the negative long-term consequences. " +
      "This explains why simply telling someone to 'just do it' rarely solves the underlying problem. " +
      "Research suggests that breaking a large task into smaller, more manageable steps can reduce the " +
      "emotional burden associated with it, making it easier to begin. Additionally, forgiving oneself for " +
      "past procrastination, rather than dwelling on guilt, has been shown to reduce the likelihood of " +
      "procrastinating again in the future. Understanding procrastination as an emotional coping mechanism, " +
      "rather than a character flaw, may therefore be the first step toward overcoming it.",
    questions: [
      { q: "How do psychologists describe procrastination, according to the text?", options: ["As simple laziness", "As a complex issue rooted in emotional regulation", "As a rare personality disorder", "As something that cannot be studied"], correct: 1, hint: "Look at the first sentence.", explain: "The text says it is \"a much more complex issue rooted in emotional regulation rather than time management.\"" },
      { q: "Why does the brain turn to more pleasant activities, according to the text?", options: ["It seeks short-term relief from anxiety, boredom, or self-doubt", "It cannot process difficult tasks", "It is programmed to avoid all work", "It prefers physical activities"], correct: 0, hint: "Look at the sentence about the brain seeking relief.", explain: "The text says the brain \"seeks short-term relief by turning to more pleasant activities.\"" },
      { q: "Why does simply telling someone to 'just do it' rarely work, according to the text?", options: ["It does not address the underlying emotional problem", "People do not understand the instruction", "It is too demanding", "It works most of the time"], correct: 0, hint: "Look at the sentence about 'just do it'.", explain: "The text says it \"rarely solves the underlying problem,\" since procrastination is emotional, not just about willpower." },
      { q: "What does research suggest can reduce the emotional burden of a task?", options: ["Ignoring the task completely", "Breaking it into smaller, manageable steps", "Working longer hours", "Asking someone else to do it"], correct: 1, hint: "Look at the sentence about research.", explain: "The text says breaking tasks into smaller steps \"can reduce the emotional burden associated with it.\"" },
      { q: "What has been shown to reduce future procrastination, according to the text?", options: ["Feeling guilty about past procrastination", "Forgiving oneself for past procrastination", "Punishing oneself strictly", "Avoiding all deadlines"], correct: 1, hint: "Look at the sentence about forgiving oneself.", explain: "The text says \"forgiving oneself for past procrastination...has been shown to reduce the likelihood of procrastinating again.\"" },
    ],
  },
  {
    level: "B2",
    title: "The Impact of Social Media on Attention Spans",
    text:
      "Over the past decade, researchers have raised concerns about the effect of social media platforms on " +
      "human attention spans. These platforms are often designed with features such as infinite scrolling " +
      "and instant notifications, which are specifically engineered to capture and hold users' attention for " +
      "as long as possible. Some studies suggest that frequent use of such platforms may make it more " +
      "difficult for individuals to concentrate on longer, less stimulating tasks, such as reading a book or " +
      "completing detailed work assignments. Critics of this view, however, point out that attention spans " +
      "have always varied depending on the task and the individual's interest level, and that blaming " +
      "technology alone oversimplifies a complicated issue. Regardless of the exact cause, many experts " +
      "recommend setting specific boundaries around screen time, such as disabling notifications during work " +
      "hours, as a practical way to protect one's ability to focus.",
    questions: [
      { q: "What have researchers raised concerns about over the past decade?", options: ["The cost of smartphones", "The effect of social media on attention spans", "The speed of the internet", "The number of social media users"], correct: 1, hint: "Look at the first sentence.", explain: "The text says researchers are concerned about \"the effect of social media platforms on human attention spans.\"" },
      { q: "What are features like infinite scrolling designed to do?", options: ["Save battery life", "Capture and hold users' attention", "Reduce data usage", "Improve video quality"], correct: 1, hint: "Look at the second sentence.", explain: "The text says these features are \"specifically engineered to capture and hold users' attention.\"" },
      { q: "What do some studies suggest frequent social media use may cause?", options: ["Improved reading skills", "Difficulty concentrating on longer, less stimulating tasks", "Better memory", "Faster typing speed"], correct: 1, hint: "Look at the sentence about studies.", explain: "The text says it \"may make it more difficult for individuals to concentrate on longer, less stimulating tasks.\"" },
      { q: "What do critics argue, according to the text?", options: ["Technology is the only cause of short attention spans", "Attention spans have always varied by task and interest level", "Social media has no effect at all", "Everyone should stop using social media"], correct: 1, hint: "Look at the sentence starting with 'Critics'.", explain: "The text says critics point out \"attention spans have always varied depending on the task and the individual's interest level.\"" },
      { q: "What do many experts recommend, according to the text?", options: ["Banning social media completely", "Setting boundaries around screen time", "Ignoring the issue", "Using social media more often"], correct: 1, hint: "Look at the last sentence.", explain: "The text says experts recommend \"setting specific boundaries around screen time...to protect one's ability to focus.\"" },
    ],
  },

  // ===================== C1 =====================
  {
    level: "C1",
    title: "The Ethics of Genetic Engineering",
    text:
      "Advances in genetic engineering, particularly the development of gene-editing tools such as CRISPR, " +
      "have opened unprecedented possibilities for treating hereditary diseases at their source rather than " +
      "merely managing symptoms. Proponents argue that the ability to correct harmful mutations before birth " +
      "could eliminate suffering caused by conditions that have plagued families for generations. " +
      "Nevertheless, this same technology raises profound ethical questions that extend well beyond medical " +
      "treatment. Critics warn that once genetic modification becomes feasible for eliminating disease, the " +
      "line between therapy and enhancement may blur, potentially opening the door to so-called 'designer " +
      "babies' selected for traits such as height, intelligence, or appearance. Such possibilities raise " +
      "concerns about exacerbating existing social inequalities, as access to these technologies would " +
      "likely be limited to those who can afford them. Furthermore, questions remain about the long-term, " +
      "unintended consequences of altering the human genome in ways that could be passed down to future " +
      "generations who never consented to the change. Consequently, many bioethicists argue that robust " +
      "international regulation, rather than an outright ban or unrestricted freedom, represents the most " +
      "prudent path forward.",
    questions: [
      { q: "What has the development of gene-editing tools like CRISPR opened, according to the text?", options: ["Unprecedented possibilities for treating hereditary diseases at their source", "New ways to manage symptoms only", "No real medical benefits", "Only theoretical possibilities with no practical use"], correct: 0, hint: "Look at the first sentence.", explain: "The text says it opened \"unprecedented possibilities for treating hereditary diseases at their source rather than merely managing symptoms.\"" },
      { q: "What do critics warn could happen once genetic modification becomes feasible for disease?", options: ["Nothing would change", "The line between therapy and enhancement may blur", "All diseases would be cured immediately", "Genetic engineering would become illegal"], correct: 1, hint: "Look at the sentence about critics.", explain: "The text says critics warn \"the line between therapy and enhancement may blur,\" opening the door to 'designer babies.'" },
      { q: "What social concern is raised by the possibility of 'designer babies'?", options: ["It could exacerbate existing social inequalities", "It would have no social impact", "It would make healthcare cheaper for everyone", "It would only affect wealthy countries positively"], correct: 0, hint: "Look at the sentence about social inequalities.", explain: "The text says this \"raise[s] concerns about exacerbating existing social inequalities, as access...would likely be limited to those who can afford them.\"" },
      { q: "What long-term question does the text raise about altering the human genome?", options: ["Whether it can be done quickly", "Whether future generations who never consented could be affected", "Whether it is expensive", "Whether scientists are capable of doing it"], correct: 1, hint: "Look at the sentence about future generations.", explain: "The text raises concerns about \"unintended consequences...that could be passed down to future generations who never consented to the change.\"" },
      { q: "What do many bioethicists argue is the most prudent path forward, according to the text?", options: ["An outright ban on all genetic engineering", "Unrestricted freedom with no rules", "Robust international regulation", "Leaving the decision only to individual scientists"], correct: 2, hint: "Look at the last sentence.", explain: "The text says bioethicists argue \"robust international regulation...represents the most prudent path forward.\"" },
    ],
  },
  {
    level: "C1",
    title: "The Paradox of Choice in Consumer Culture",
    text:
      "Contemporary consumer culture is often characterized by an abundance of choice, with supermarket " +
      "shelves stocked with dozens of variations of a single product and online retailers offering seemingly " +
      "limitless options at the click of a button. Conventional economic theory has long held that greater " +
      "choice inherently benefits consumers by allowing them to select the option that best satisfies their " +
      "individual preferences. However, psychological research complicates this assumption considerably. " +
      "Studies have demonstrated that when confronted with an overwhelming number of options, individuals " +
      "frequently experience heightened anxiety, decision paralysis, and, paradoxically, diminished " +
      "satisfaction with whatever choice they ultimately make. This phenomenon, often termed the 'paradox of " +
      "choice,' suggests that beyond a certain threshold, additional options cease to be beneficial and " +
      "instead impose a cognitive burden that outweighs any marginal gain in personalization. Some " +
      "researchers propose that curated selections, in which a smaller number of carefully chosen options " +
      "are presented, may in fact produce greater consumer satisfaction than an exhaustive array of " +
      "alternatives. This insight has significant implications for retailers, policymakers, and designers of " +
      "any system in which humans must make decisions among multiple alternatives.",
    questions: [
      { q: "What has conventional economic theory long held about choice?", options: ["Greater choice inherently benefits consumers", "Choice has no effect on consumers", "Fewer choices are always better", "Consumers dislike having options"], correct: 0, hint: "Look at the second sentence.", explain: "The text says conventional theory held \"that greater choice inherently benefits consumers by allowing them to select the option that best satisfies their individual preferences.\"" },
      { q: "What have psychological studies demonstrated about too many options?", options: ["They always increase satisfaction", "They can cause anxiety, decision paralysis, and diminished satisfaction", "They have no psychological effect", "They only affect wealthy consumers"], correct: 1, hint: "Look at the sentence about studies.", explain: "The text says people \"frequently experience heightened anxiety, decision paralysis, and...diminished satisfaction with whatever choice they ultimately make.\"" },
      { q: "What is the 'paradox of choice', according to the text?", options: ["The idea that more choice always helps", "The idea that beyond a threshold, more options impose a burden rather than a benefit", "A marketing strategy used by retailers", "A term for having no choices at all"], correct: 1, hint: "Look at the sentence naming the paradox.", explain: "The text says beyond a threshold, \"additional options cease to be beneficial and instead impose a cognitive burden.\"" },
      { q: "What do some researchers propose as an alternative to an exhaustive array of choices?", options: ["Removing all choices entirely", "Curated selections with fewer, carefully chosen options", "Randomly assigning products to consumers", "Doubling the number of available options"], correct: 1, hint: "Look at the sentence about curated selections.", explain: "The text says curated selections \"may in fact produce greater consumer satisfaction than an exhaustive array of alternatives.\"" },
      { q: "Who does this insight have significant implications for, according to the last sentence?", options: ["Only supermarket owners", "Retailers, policymakers, and designers of decision-making systems", "Only online shoppers", "Only psychologists"], correct: 1, hint: "Look at the last sentence.", explain: "The text says it has implications for \"retailers, policymakers, and designers of any system in which humans must make decisions among multiple alternatives.\"" },
    ],
  },

  // ===================== C2 =====================
  {
    level: "C2",
    title: "Epistemic Humility in an Age of Information Abundance",
    text:
      "Paradoxically, the unprecedented accessibility of information in the digital age has not necessarily " +
      "translated into a correspondingly well-informed populace; if anything, the sheer volume of competing " +
      "claims, often stripped of the contextual scaffolding that once accompanied traditional gatekept " +
      "media, has rendered the task of discerning reliable knowledge from misinformation considerably more " +
      "fraught. Philosophers of knowledge have long emphasized the virtue of epistemic humility -- the " +
      "disposition to recognize the limits of one's own understanding and to remain appropriately tentative " +
      "in the face of uncertainty -- as a crucial safeguard against both credulity and unwarranted " +
      "skepticism. Yet cultivating this disposition proves markedly more difficult within algorithmically " +
      "curated information environments, which tend to reward engagement over accuracy and often insulate " +
      "users within ideologically congenial echo chambers. Some scholars contend that addressing this " +
      "predicament requires not merely improved media literacy education, but a broader cultural " +
      "reorientation that valorizes intellectual humility and productive uncertainty over the confident " +
      "assertion that so often garners social capital in public discourse. Absent such a shift, they argue, " +
      "the abundance of information may continue to coexist uneasily with a genuine impoverishment of " +
      "collective understanding.",
    questions: [
      { q: "What paradox does the text identify regarding the digital age?", options: ["More information has led to a better-informed populace", "Unprecedented access to information has not necessarily led to a well-informed populace", "Information is now scarce", "Traditional media provided no context at all"], correct: 1, hint: "Look at the first sentence.", explain: "The text says accessibility of information \"has not necessarily translated into a correspondingly well-informed populace.\"" },
      { q: "What is 'epistemic humility', as described in the text?", options: ["Recognizing the limits of one's own understanding and remaining tentative amid uncertainty", "Refusing to ever change one's mind", "Complete confidence in one's own knowledge", "A term for ignoring all information"], correct: 0, hint: "Look at the sentence defining epistemic humility.", explain: "The text defines it as \"the disposition to recognize the limits of one's own understanding and to remain appropriately tentative in the face of uncertainty.\"" },
      { q: "Why is cultivating epistemic humility harder in algorithmically curated environments, according to the text?", options: ["These environments reward engagement over accuracy and create echo chambers", "These environments have no algorithms at all", "These environments always promote accurate information", "These environments require no user engagement"], correct: 0, hint: "Look at the sentence about algorithmically curated environments.", explain: "The text says such environments \"tend to reward engagement over accuracy and often insulate users within ideologically congenial echo chambers.\"" },
      { q: "What do some scholars argue is needed beyond improved media literacy education?", options: ["Nothing more is needed", "A broader cultural reorientation valuing intellectual humility over confident assertion", "Banning algorithmic curation entirely", "More confident public discourse"], correct: 1, hint: "Look at the sentence about scholars' proposals.", explain: "The text says they argue for \"a broader cultural reorientation that valorizes intellectual humility and productive uncertainty over...confident assertion.\"" },
      { q: "What do scholars argue may continue without such a cultural shift, according to the last sentence?", options: ["A perfect balance of information and understanding", "Information abundance coexisting with an impoverishment of collective understanding", "A complete end to misinformation", "Universal epistemic humility"], correct: 1, hint: "Look at the last sentence.", explain: "The text says information abundance \"may continue to coexist uneasily with a genuine impoverishment of collective understanding.\"" },
    ],
  },
  {
    level: "C2",
    title: "The Limits of Rational Choice Theory",
    text:
      "Rational choice theory, long a cornerstone of economic and political analysis, posits that individuals " +
      "act to maximize their own utility based on a coherent and stable set of preferences, weighing costs " +
      "and benefits with something approaching computational precision. Behavioral economists, however, " +
      "have amassed a substantial body of empirical evidence suggesting that human decision-making deviates " +
      "systematically -- rather than randomly -- from this idealized model. Cognitive biases such as loss " +
      "aversion, wherein the pain of losing something is felt more acutely than the pleasure of an " +
      "equivalent gain, and present bias, which inclines individuals to overvalue immediate rewards relative " +
      "to future ones, recur with such regularity across cultures and contexts that they can scarcely be " +
      "dismissed as mere noise or measurement error. Proponents of rational choice theory have responded not " +
      "by abandoning the framework wholesale, but by incorporating these behavioral insights into more " +
      "nuanced models that retain optimization as a baseline while accounting for predictable deviations " +
      "from it. Critics, meanwhile, contend that such amendments risk rendering the theory unfalsifiable, " +
      "capable of explaining any observed behavior after the fact by simply invoking an appropriately " +
      "tailored bias. This ongoing tension between explanatory parsimony and empirical fidelity remains a " +
      "defining feature of contemporary debates in behavioral science.",
    questions: [
      { q: "What does rational choice theory posit, according to the text?", options: ["Individuals act randomly with no clear preferences", "Individuals act to maximize utility based on coherent, stable preferences", "Individuals never weigh costs and benefits", "Preferences constantly change with no pattern"], correct: 1, hint: "Look at the first sentence.", explain: "The text says it posits individuals \"act to maximize their own utility based on a coherent and stable set of preferences.\"" },
      { q: "How do behavioral economists say human decision-making deviates from the idealized model?", options: ["Randomly and unpredictably", "Systematically rather than randomly", "It does not deviate at all", "Only in rare, isolated cases"], correct: 1, hint: "Look at the second sentence.", explain: "The text says decision-making \"deviates systematically -- rather than randomly -- from this idealized model.\"" },
      { q: "What is 'loss aversion', as described in the text?", options: ["Feeling the pain of a loss more acutely than the pleasure of an equivalent gain", "Preferring losses over gains", "Being indifferent to both losses and gains", "Only caring about future rewards"], correct: 0, hint: "Look at the sentence defining loss aversion.", explain: "The text defines it as when \"the pain of losing something is felt more acutely than the pleasure of an equivalent gain.\"" },
      { q: "How have proponents of rational choice theory responded to behavioral evidence, according to the text?", options: ["By abandoning the framework entirely", "By incorporating behavioral insights into more nuanced models", "By ignoring all criticism", "By rejecting the idea of optimization completely"], correct: 1, hint: "Look at the sentence about proponents' response.", explain: "The text says they responded \"by incorporating these behavioral insights into more nuanced models that retain optimization as a baseline.\"" },
      { q: "What do critics argue such amendments risk, according to the text?", options: ["Making the theory more falsifiable", "Rendering the theory unfalsifiable", "Making the theory simpler", "Eliminating all bias from human behavior"], correct: 1, hint: "Look at the sentence about critics.", explain: "The text says critics argue the amendments \"risk rendering the theory unfalsifiable, capable of explaining any observed behavior after the fact.\"" },
    ],
  },
];
