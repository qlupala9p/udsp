// Reading Comprehension passages (Grades 1-12).
// All passages and questions below are ORIGINAL content written for this
// app -- they are NOT copied or adapted from any third-party worksheet
// site. (englishforeveryone.org/ReadTheory's Terms of Use explicitly
// prohibit automated copying/redistribution of their materials, so their
// passages were intentionally NOT used as a source here.)
// Schema: { grade, title, text, questions: [ { q, options: [4], correct } ] }
// `correct` is the 0-based index into `options` of the right answer.
// Used ONLY by the Reading Comprehension game (readingcomprehension.js).

window.READING_PASSAGES = [
  // ===================== GRADE 1 =====================
  {
    grade: 1,
    title: "Tom the Cat",
    text:
      "Tom is a small cat. Tom is black and white. Tom likes to play with a red ball. " +
      "Every day, Tom runs in the yard. At night, Tom sleeps on a soft bed. Tom is happy.",
    questions: [
      { q: "What color is Tom?", options: ["Black and white", "All black", "All white", "Brown"], correct: 0 },
      { q: "What does Tom like to play with?", options: ["A red ball", "A toy mouse", "A blue box", "A stick"], correct: 0 },
      { q: "Where does Tom run every day?", options: ["In the house", "In the yard", "In the street", "In the park"], correct: 1 },
      { q: "Where does Tom sleep?", options: ["On a chair", "On the floor", "On a soft bed", "In the yard"], correct: 2 },
      { q: "How does Tom feel?", options: ["Sad", "Angry", "Happy", "Tired"], correct: 2 },
    ],
  },
  {
    grade: 1,
    title: "Sunny Days",
    text:
      "It is summer. The sun is hot. Ben and Mia play outside. They wear hats. " +
      "They drink cold water. Ben jumps rope. Mia rides her bike. They have fun in the sun.",
    questions: [
      { q: "What season is it?", options: ["Winter", "Summer", "Fall", "Spring"], correct: 1 },
      { q: "What do Ben and Mia wear?", options: ["Coats", "Hats", "Boots", "Gloves"], correct: 1 },
      { q: "What do they drink?", options: ["Hot tea", "Milk", "Cold water", "Juice"], correct: 2 },
      { q: "What does Ben do?", options: ["He jumps rope", "He rides a bike", "He swims", "He reads"], correct: 0 },
      { q: "What does Mia do?", options: ["She jumps rope", "She rides her bike", "She naps", "She cooks"], correct: 1 },
    ],
  },

  // ===================== GRADE 2 =====================
  {
    grade: 2,
    title: "The Lost Ball",
    text:
      "Sam was playing soccer in the park with his friends. He kicked the ball very hard, and it rolled " +
      "into some bushes. Sam looked and looked, but he could not find it. Then his dog, Rusty, sniffed " +
      "around the bushes and pulled the ball out with his mouth. Sam was so happy that he gave Rusty a treat.",
    questions: [
      { q: "Where was Sam playing?", options: ["At school", "In the park", "At home", "At the beach"], correct: 1 },
      { q: "What game was Sam playing?", options: ["Baseball", "Basketball", "Soccer", "Tennis"], correct: 2 },
      { q: "Where did the ball go?", options: ["Into a lake", "Into the bushes", "Onto the roof", "Into the street"], correct: 1 },
      { q: "Who found the ball?", options: ["Sam", "A friend", "A stranger", "Rusty the dog"], correct: 3 },
      { q: "How did Sam feel at the end?", options: ["Angry", "Happy", "Bored", "Scared"], correct: 1 },
    ],
  },
  {
    grade: 2,
    title: "Busy Bees",
    text:
      "Bees are small insects that live together in large groups called hives. Worker bees fly from flower " +
      "to flower to collect a sweet liquid called nectar. Back at the hive, the bees turn the nectar into " +
      "honey. Bees also help plants grow by carrying pollen from one flower to another. Without bees, many " +
      "fruits and vegetables would not grow at all.",
    questions: [
      { q: "Where do bees live?", options: ["In trees", "In hives", "In caves", "In nests"], correct: 1 },
      { q: "What do worker bees collect from flowers?", options: ["Water", "Pollen only", "Nectar", "Leaves"], correct: 2 },
      { q: "What do bees turn nectar into?", options: ["Water", "Honey", "Wax", "Sugar"], correct: 1 },
      { q: "How do bees help plants?", options: ["By eating them", "By carrying pollen", "By watering them", "By cutting them"], correct: 1 },
      { q: "What would happen without bees, according to the passage?", options: ["Nothing would change", "Many fruits and vegetables would not grow", "Flowers would grow faster", "Animals would disappear"], correct: 1 },
    ],
  },

  // ===================== GRADE 3 =====================
  {
    grade: 3,
    title: "The New Student",
    text:
      "Maria moved to a new school in September. She did not know anyone, and she felt nervous on her first " +
      "day. During lunch, she sat alone at a table. A girl named Priya noticed Maria sitting by herself and " +
      "walked over to say hello. Priya invited Maria to sit with her group of friends. By the end of the " +
      "week, Maria had made three new friends and felt much happier at her new school.",
    questions: [
      { q: "When did Maria move to a new school?", options: ["In June", "In September", "In December", "In March"], correct: 1 },
      { q: "How did Maria feel on her first day?", options: ["Excited", "Nervous", "Angry", "Bored"], correct: 1 },
      { q: "What did Maria do during lunch at first?", options: ["She sat alone", "She went home", "She played outside", "She talked to a teacher"], correct: 0 },
      { q: "Who introduced herself to Maria?", options: ["A teacher", "Priya", "Maria's sister", "The principal"], correct: 1 },
      { q: "How did Maria feel by the end of the week?", options: ["Still nervous", "Sad", "Happier", "Angry"], correct: 2 },
    ],
  },
  {
    grade: 3,
    title: "How Plants Grow",
    text:
      "Plants need three important things to grow: sunlight, water, and soil full of nutrients. A plant's " +
      "roots grow down into the soil to soak up water and nutrients. The stem carries this water up to the " +
      "leaves. Leaves use sunlight to make food for the plant in a process called photosynthesis. If a plant " +
      "does not get enough sunlight or water, it will grow slowly or may even die.",
    questions: [
      { q: "How many important things do plants need to grow, according to the passage?", options: ["Two", "Three", "Four", "Five"], correct: 1 },
      { q: "What do roots do?", options: ["Make food", "Soak up water and nutrients", "Catch sunlight", "Grow flowers"], correct: 1 },
      { q: "What does the stem do?", options: ["Carries water to the leaves", "Grows into the soil", "Makes sunlight", "Eats nutrients"], correct: 0 },
      { q: "What is the process of leaves making food from sunlight called?", options: ["Germination", "Respiration", "Photosynthesis", "Pollination"], correct: 2 },
      { q: "What happens if a plant does not get enough water?", options: ["It grows faster", "It grows slowly or may die", "It changes color instantly", "Nothing happens"], correct: 1 },
    ],
  },

  // ===================== GRADE 4 =====================
  {
    grade: 4,
    title: "The Secret Fort",
    text:
      "Every summer, Jake and his cousin Leo built a fort out of old wooden planks behind Jake's house. This " +
      "year, they decided to add a rope ladder so they could climb up to a small platform in the tree above " +
      "the fort. It took them three days to find enough rope and figure out how to tie strong knots. When " +
      "the ladder was finally finished, they invited their little sisters to see it. The girls were amazed " +
      "and asked if they could help build the next part of the fort, a lookout tower.",
    questions: [
      { q: "What did Jake and Leo build every summer?", options: ["A treehouse", "A fort", "A boat", "A go-kart"], correct: 1 },
      { q: "What new feature did they add this year?", options: ["A slide", "A rope ladder", "A door", "A window"], correct: 1 },
      { q: "How long did it take to finish the ladder?", options: ["One day", "Two days", "Three days", "A week"], correct: 2 },
      { q: "Who did they invite to see the finished ladder?", options: ["Their parents", "Their teacher", "Their little sisters", "Their neighbors"], correct: 2 },
      { q: "What did the girls want to help build next?", options: ["A bridge", "A lookout tower", "A swing", "A garden"], correct: 1 },
    ],
  },
  {
    grade: 4,
    title: "The Water Cycle",
    text:
      "Water on Earth is always moving through a process called the water cycle. First, heat from the sun " +
      "causes water in oceans, lakes, and rivers to evaporate, turning it into water vapor that rises into " +
      "the sky. As the vapor rises, it cools and forms tiny droplets that gather together to make clouds. " +
      "This step is called condensation. When the droplets in a cloud become too heavy, they fall back to " +
      "the ground as rain, snow, or hail, a step known as precipitation. Eventually, this water flows back " +
      "into rivers, lakes, and oceans, and the entire cycle begins again.",
    questions: [
      { q: "What causes water to evaporate?", options: ["Wind", "Heat from the sun", "Cold air", "Gravity"], correct: 1 },
      { q: "What is it called when water vapor cools and forms droplets?", options: ["Evaporation", "Condensation", "Precipitation", "Collection"], correct: 1 },
      { q: "What do tiny water droplets gather together to form?", options: ["Rivers", "Clouds", "Oceans", "Ice"], correct: 1 },
      { q: "What is precipitation?", options: ["Water evaporating", "Water falling as rain, snow, or hail", "Water freezing", "Water flowing in rivers"], correct: 1 },
      { q: "What happens after precipitation, according to the passage?", options: ["The cycle stops", "Water flows back into rivers, lakes, and oceans", "Water disappears forever", "The sun stops shining"], correct: 1 },
    ],
  },

  // ===================== GRADE 5 =====================
  {
    grade: 5,
    title: "A Trip to the Museum",
    text:
      "Our class took a field trip to the Natural History Museum last Friday. The first exhibit we visited " +
      "displayed enormous dinosaur skeletons, including a towering Tyrannosaurus rex that stood nearly " +
      "twelve feet tall. Our guide explained that scientists piece together these skeletons from fossils " +
      "found buried in rock for millions of years. Next, we explored a hall filled with sparkling gems and " +
      "minerals from around the world. My favorite part was the planetarium, where we watched a show about " +
      "the planets while lying back in reclining seats. By the time we left, everyone agreed it had been " +
      "one of the best trips of the school year.",
    questions: [
      { q: "Where did the class go on their field trip?", options: ["The zoo", "The Natural History Museum", "An art gallery", "A science lab"], correct: 1 },
      { q: "What was the first exhibit the class visited?", options: ["Gems and minerals", "Dinosaur skeletons", "The planetarium", "Ancient artifacts"], correct: 1 },
      { q: "How do scientists piece together dinosaur skeletons?", options: ["From drawings", "From fossils found in rock", "From old books", "From guesses"], correct: 1 },
      { q: "What was the writer's favorite part of the trip?", options: ["The gem hall", "The gift shop", "The planetarium", "The bus ride"], correct: 2 },
      { q: "How did the class feel about the trip by the end?", options: ["Disappointed", "It was one of the best trips of the year", "Bored", "Confused"], correct: 1 },
    ],
  },
  {
    grade: 5,
    title: "Volcanoes",
    text:
      "A volcano is an opening in the Earth's surface through which melted rock, called magma, can escape. " +
      "When magma rises to the surface, it is called lava. Deep inside the Earth, extreme heat and pressure " +
      "keep rock in a liquid state. When pressure builds up enough, it forces the magma upward through cracks " +
      "in the Earth's crust, sometimes causing a powerful eruption. Not all volcanoes erupt violently; some " +
      "release lava slowly over many years. Scientists who study volcanoes, called volcanologists, monitor " +
      "changes in gas, heat, and ground movement to try to predict when an eruption might occur.",
    questions: [
      { q: "What is magma called once it reaches the surface?", options: ["Ash", "Lava", "Rock", "Steam"], correct: 1 },
      { q: "What keeps rock in a liquid state deep inside the Earth?", options: ["Cold temperatures", "Extreme heat and pressure", "Ocean water", "Wind"], correct: 1 },
      { q: "What forces magma upward through the Earth's crust?", options: ["Wind", "Built-up pressure", "Gravity alone", "Ocean currents"], correct: 1 },
      { q: "Do all volcanoes erupt violently, according to the passage?", options: ["Yes, always", "No, some release lava slowly", "Only underwater volcanoes do", "The passage does not say"], correct: 1 },
      { q: "What is a scientist who studies volcanoes called?", options: ["A geologist only", "A meteorologist", "A volcanologist", "A seismologist only"], correct: 2 },
    ],
  },

  // ===================== GRADE 6 =====================
  {
    grade: 6,
    title: "The Long Race",
    text:
      "Elena had trained for the cross-country race for three months, running every morning before school " +
      "regardless of the weather. On race day, her legs felt strong, but nerves made her stomach twist into " +
      "knots. As the starting gun fired, she settled into a steady pace, refusing to sprint too early like " +
      "some of her competitors. By the second mile, several runners who had started too fast began to slow " +
      "down, gasping for breath. Elena passed them one by one, drawing on the discipline she had built during " +
      "months of early mornings. She crossed the finish line in third place, exhausted but proud, knowing " +
      "that her patience had paid off.",
    questions: [
      { q: "How long had Elena trained for the race?", options: ["One month", "Three months", "Six months", "A year"], correct: 1 },
      { q: "How did Elena feel right before the race started?", options: ["Confident and calm", "Nervous", "Angry", "Uninterested"], correct: 1 },
      { q: "What mistake did some other runners make?", options: ["They started too slowly", "They started too fast", "They stopped to rest", "They ran the wrong way"], correct: 1 },
      { q: "What helped Elena pass the other runners?", options: ["Luck", "The discipline she built through training", "A shortcut", "Help from a teammate"], correct: 1 },
      { q: "What place did Elena finish in?", options: ["First", "Second", "Third", "Last"], correct: 2 },
    ],
  },
  {
    grade: 6,
    title: "The Solar System",
    text:
      "Our solar system consists of the sun and everything that orbits around it, including eight planets, " +
      "dozens of moons, and countless asteroids and comets. The four planets closest to the sun—Mercury, " +
      "Venus, Earth, and Mars—are called terrestrial planets because they have solid, rocky surfaces. Beyond " +
      "Mars lies the asteroid belt, a region filled with rocky debris left over from the solar system's " +
      "formation. Farther out are the gas giants, Jupiter and Saturn, followed by the ice giants, Uranus and " +
      "Neptune. Unlike the inner planets, these outer worlds are made mostly of gas and ice and do not have " +
      "solid surfaces to stand on.",
    questions: [
      { q: "What does our solar system consist of, according to the passage?", options: ["Only the sun", "The sun and everything that orbits it", "Only planets", "Only asteroids"], correct: 1 },
      { q: "Why are Mercury, Venus, Earth, and Mars called terrestrial planets?", options: ["They are far from the sun", "They have solid, rocky surfaces", "They have rings", "They are made of gas"], correct: 1 },
      { q: "What is located between Mars and Jupiter?", options: ["The Kuiper Belt", "The asteroid belt", "A second sun", "A moon cluster"], correct: 1 },
      { q: "Which planets are called the gas giants?", options: ["Mercury and Venus", "Earth and Mars", "Jupiter and Saturn", "Uranus and Neptune"], correct: 2 },
      { q: "What are Uranus and Neptune made mostly of?", options: ["Solid rock", "Gas and ice", "Metal", "Sand"], correct: 1 },
    ],
  },

  // ===================== GRADE 7 =====================
  {
    grade: 7,
    title: "Ancient Egypt",
    text:
      "Ancient Egyptian civilization flourished along the Nile River for thousands of years, largely because " +
      "the river's annual floods left behind rich, fertile soil ideal for farming. This dependable food " +
      "supply allowed Egyptian society to grow complex, supporting skilled artisans, powerful priests, and " +
      "a centralized government led by a pharaoh who was believed to be a living god. The Egyptians are " +
      "perhaps best known today for their monumental architecture, particularly the pyramids, which served " +
      "as elaborate tombs designed to help pharaohs journey safely into the afterlife. Egyptian society also " +
      "developed one of the earliest writing systems, hieroglyphics, which combined pictures and symbols to " +
      "record religious texts, historical events, and everyday transactions.",
    questions: [
      { q: "Why did Egyptian civilization flourish along the Nile River?", options: ["The river provided gold", "Annual floods created fertile farmland", "The river was easy to cross", "The river had no crocodiles"], correct: 1 },
      { q: "What role did the pharaoh play in Egyptian society?", options: ["A simple farmer", "A living god and ruler", "A foreign visitor", "A priest only"], correct: 1 },
      { q: "What was the main purpose of the pyramids?", options: ["Marketplaces", "Elaborate tombs for pharaohs", "Military forts", "Schools"], correct: 1 },
      { q: "What was hieroglyphics?", options: ["A type of pyramid", "An early writing system", "A farming tool", "A religious festival"], correct: 1 },
      { q: "According to the passage, what did hieroglyphics record?", options: ["Only religious texts", "Only historical events", "Religious texts, historical events, and everyday transactions", "Nothing important"], correct: 2 },
    ],
  },
  {
    grade: 7,
    title: "The Missing Diary",
    text:
      "When Clara discovered that her grandmother's old diary was missing from the attic, she was determined " +
      "to find it before her family's reunion the following week. She questioned her younger brother, who " +
      "swore he hadn't touched it, and searched every box in the attic twice without success. Just as she " +
      "was about to give up, Clara noticed a faint smudge of dust leading from the attic stairs down the " +
      "hallway to her father's study. Inside a drawer, she found the diary carefully wrapped in cloth. Her " +
      "father admitted he had borrowed it to read about his own mother's childhood, intending to return it " +
      "before anyone noticed it was gone.",
    questions: [
      { q: "What was missing from the attic?", options: ["A photo album", "Grandmother's diary", "A family heirloom", "A letter"], correct: 1 },
      { q: "Why did Clara want to find it quickly?", options: ["She was moving away", "The family reunion was the following week", "She needed it for school", "Her grandmother asked for it"], correct: 1 },
      { q: "Who did Clara question first?", options: ["Her father", "Her younger brother", "Her grandmother", "A neighbor"], correct: 1 },
      { q: "What clue led Clara to the diary?", options: ["A note", "A smudge of dust leading to the study", "A phone call", "A photograph"], correct: 1 },
      { q: "Why had Clara's father taken the diary?", options: ["To sell it", "To read about his own mother's childhood", "To hide it from Clara", "By accident"], correct: 1 },
    ],
  },

  // ===================== GRADE 8 =====================
  {
    grade: 8,
    title: "Photosynthesis: How Plants Make Food",
    text:
      "Photosynthesis is the remarkable process by which plants, algae, and some bacteria convert light " +
      "energy into chemical energy stored in glucose, a type of sugar. This process takes place primarily in " +
      "the leaves, within specialized structures called chloroplasts that contain a green pigment known as " +
      "chlorophyll. Chlorophyll absorbs sunlight, particularly in the red and blue wavelengths, while " +
      "reflecting green light—which is why most plants appear green to our eyes. During photosynthesis, " +
      "plants take in carbon dioxide from the air through tiny pores called stomata and absorb water through " +
      "their roots. Using energy captured from sunlight, they combine these two ingredients to produce glucose " +
      "and release oxygen as a byproduct. This oxygen is essential for nearly all life on Earth, making " +
      "photosynthesis one of the most important biological processes on the planet.",
    questions: [
      { q: "What does photosynthesis convert light energy into?", options: ["Heat energy", "Chemical energy stored in glucose", "Electrical energy", "Sound energy"], correct: 1 },
      { q: "Where does photosynthesis primarily take place?", options: ["In the roots", "In the stem", "In the leaves, within chloroplasts", "In the flowers"], correct: 2 },
      { q: "Why do most plants appear green?", options: ["Chlorophyll absorbs green light", "Chlorophyll reflects green light", "Plants contain no pigment", "Sunlight is green"], correct: 1 },
      { q: "What do stomata allow plants to take in?", options: ["Water only", "Carbon dioxide", "Glucose", "Sunlight"], correct: 1 },
      { q: "What byproduct of photosynthesis is essential for most life on Earth?", options: ["Carbon dioxide", "Water", "Oxygen", "Nitrogen"], correct: 2 },
    ],
  },
  {
    grade: 8,
    title: "The Invention of the Telephone",
    text:
      "In the 1870s, several inventors were racing to develop a device that could transmit human speech over " +
      "long distances using electrical signals. Alexander Graham Bell, a Scottish-born scientist working in " +
      "Boston, is widely credited with inventing the telephone after filing a patent in February 1876—just " +
      "hours before a rival inventor, Elisha Gray, submitted a similar idea. Bell's device worked by " +
      "converting sound waves from a person's voice into an electrical current, which traveled through a " +
      "wire and was then converted back into sound at the receiving end. Bell famously made the first " +
      "successful telephone call to his assistant, Thomas Watson, saying, \"Mr. Watson, come here, I want " +
      "to see you.\" Within decades, telephone lines connected cities across the country, transforming how " +
      "people communicated over distance forever.",
    questions: [
      { q: "What were inventors racing to develop in the 1870s?", options: ["A device to transmit speech electrically", "A new type of telegraph key", "A radio broadcasting tower", "A recording device"], correct: 0 },
      { q: "Who is widely credited with inventing the telephone?", options: ["Thomas Watson", "Elisha Gray", "Alexander Graham Bell", "Thomas Edison"], correct: 2 },
      { q: "How close was Bell's patent filing to his rival's?", options: ["A year apart", "A month apart", "Just hours apart", "A week apart"], correct: 2 },
      { q: "How did Bell's telephone convert sound?", options: ["Sound waves into electrical current, then back into sound", "Light into sound", "Sound into radio waves", "Text into sound"], correct: 0 },
      { q: "What did telephone lines eventually do, according to the passage?", options: ["Replace all mail", "Connect cities across the country", "Make travel unnecessary", "Cause the decline of radio"], correct: 1 },
    ],
  },

  // ===================== GRADE 9 =====================
  {
    grade: 9,
    title: "The Renaissance: A Time of Rebirth",
    text:
      "The Renaissance, a term meaning \"rebirth,\" refers to a cultural movement that began in Italy during " +
      "the fourteenth century and gradually spread throughout Europe over the next 300 years. Emerging after " +
      "the hardships of the medieval period, including the devastation of the Black Death, the Renaissance " +
      "was fueled by renewed interest in the art, literature, and philosophy of ancient Greece and Rome. " +
      "Wealthy patrons, particularly powerful families like the Medici of Florence, funded artists and " +
      "scholars, enabling remarkable achievements in painting, sculpture, and architecture. Figures such as " +
      "Leonardo da Vinci and Michelangelo produced works that remain celebrated for their technical mastery " +
      "and humanist perspective, which emphasized the potential and dignity of the individual. Beyond the " +
      "arts, the Renaissance also saw significant advances in science, as thinkers began questioning long-held " +
      "beliefs and relying more heavily on observation and experimentation, laying important groundwork for " +
      "the Scientific Revolution that followed.",
    questions: [
      { q: "What does the word \"Renaissance\" mean?", options: ["Revolution", "Rebirth", "Discovery", "Enlightenment"], correct: 1 },
      { q: "Where did the Renaissance begin?", options: ["France", "Germany", "Italy", "Spain"], correct: 2 },
      { q: "What renewed interest fueled the Renaissance?", options: ["Ancient Greek and Roman art, literature, and philosophy", "Modern technology", "Eastern religions", "Industrial machinery"], correct: 0 },
      { q: "Which family is mentioned as a powerful patron of the arts?", options: ["The Tudors", "The Medici", "The Habsburgs", "The Borgias"], correct: 1 },
      { q: "What did the Renaissance help lay groundwork for, according to the passage?", options: ["The medieval period", "The Black Death", "The Scientific Revolution", "The fall of Rome"], correct: 2 },
    ],
  },
  {
    grade: 9,
    title: "The Power of Persuasion",
    text:
      "Persuasive writing and speech rely on three classical modes of appeal first identified by the Greek " +
      "philosopher Aristotle: ethos, pathos, and logos. Ethos refers to an appeal based on the credibility or " +
      "character of the speaker; an audience is more likely to be persuaded by someone they perceive as " +
      "trustworthy or knowledgeable. Pathos appeals to the audience's emotions, using vivid language or " +
      "personal stories to evoke feelings such as sympathy, fear, or hope. Logos, by contrast, appeals to " +
      "logic and reason, relying on facts, statistics, and clear arguments to convince an audience through " +
      "rational thought. Effective persuaders rarely rely on just one of these appeals; instead, they weave " +
      "all three together, establishing credibility, connecting emotionally with their audience, and " +
      "supporting their claims with solid evidence. Recognizing these techniques can help readers and " +
      "listeners evaluate arguments more critically, rather than being persuaded by rhetoric alone.",
    questions: [
      { q: "Who first identified the three classical modes of persuasive appeal?", options: ["Plato", "Aristotle", "Socrates", "Cicero"], correct: 1 },
      { q: "What does ethos appeal to?", options: ["Emotion", "Logic", "The speaker's credibility or character", "Statistics"], correct: 2 },
      { q: "What does pathos appeal to?", options: ["The audience's emotions", "Facts and statistics", "The speaker's reputation", "Legal authority"], correct: 0 },
      { q: "What does logos rely on to persuade an audience?", options: ["Personal stories", "Facts, statistics, and clear arguments", "Fear alone", "The speaker's fame"], correct: 1 },
      { q: "According to the passage, how do effective persuaders typically use these appeals?", options: ["They use only logos", "They use only pathos", "They weave all three together", "They avoid all three"], correct: 2 },
    ],
  },

  // ===================== GRADE 10 =====================
  {
    grade: 10,
    title: "Climate Change and Its Effects",
    text:
      "Climate change refers to long-term shifts in temperatures and weather patterns, primarily driven since " +
      "the mid-twentieth century by human activities, especially the burning of fossil fuels such as coal, " +
      "oil, and natural gas. These activities release greenhouse gases, including carbon dioxide and methane, " +
      "into the atmosphere, where they trap heat from the sun in a phenomenon known as the greenhouse effect. " +
      "As global temperatures rise, scientists have observed a range of consequences: polar ice sheets and " +
      "glaciers are melting at accelerating rates, contributing to rising sea levels that threaten coastal " +
      "communities worldwide. Extreme weather events, including intense hurricanes, prolonged droughts, and " +
      "record-breaking heat waves, have become more frequent and severe in many regions. Ecosystems are also " +
      "affected, as shifting temperatures disrupt the delicate balance that many plant and animal species " +
      "depend on for survival, forcing some to migrate toward cooler regions while others face increased risk " +
      "of extinction. Addressing climate change requires coordinated global action, including transitioning to " +
      "renewable energy sources, improving energy efficiency, and protecting forests that absorb carbon " +
      "dioxide from the atmosphere.",
    questions: [
      { q: "What has primarily driven climate change since the mid-twentieth century?", options: ["Natural volcanic activity", "Human activities, especially burning fossil fuels", "Ocean currents alone", "Solar flares"], correct: 1 },
      { q: "What is the greenhouse effect?", options: ["Gases releasing oxygen", "Gases trapping heat from the sun in the atmosphere", "Plants absorbing sunlight", "Ice reflecting sunlight"], correct: 1 },
      { q: "What is one consequence of rising global temperatures mentioned in the passage?", options: ["Cooling oceans", "Melting polar ice sheets and rising sea levels", "Fewer hurricanes", "Increased forest growth everywhere"], correct: 1 },
      { q: "How are ecosystems affected by climate change, according to the passage?", options: ["They are unaffected", "Species may migrate or face extinction risk", "All species benefit equally", "Only ocean life is affected"], correct: 1 },
      { q: "What solution does the passage suggest for addressing climate change?", options: ["Ignoring the problem", "Transitioning to renewable energy and protecting forests", "Burning more fossil fuels", "Stopping all scientific research"], correct: 1 },
    ],
  },
  {
    grade: 10,
    title: "The Art of Negotiation",
    text:
      "Negotiation is a fundamental skill applicable to nearly every aspect of life, from business deals and " +
      "salary discussions to resolving conflicts between friends or family members. Effective negotiators " +
      "understand that successful negotiation is rarely about one side winning at the expense of the other; " +
      "rather, it involves finding solutions that satisfy the underlying interests of all parties involved. " +
      "This approach, often called \"principled negotiation,\" encourages participants to separate the people " +
      "from the problem, focusing on interests rather than rigid positions. For example, two coworkers " +
      "arguing over who gets a particular office might discover, through open discussion, that one values " +
      "natural light while the other simply wants a quieter space away from foot traffic—revealing a solution " +
      "that satisfies both without anyone \"losing.\" Skilled negotiators also prepare thoroughly beforehand, " +
      "researching the other party's likely priorities and constraints, and they remain willing to explore " +
      "creative alternatives rather than becoming fixated on a single proposed outcome.",
    questions: [
      { q: "According to the passage, what is successful negotiation rarely about?", options: ["Finding creative solutions", "One side winning at the other's expense", "Preparing in advance", "Understanding interests"], correct: 1 },
      { q: "What does \"principled negotiation\" encourage participants to do?", options: ["Focus on rigid positions", "Separate the people from the problem and focus on interests", "Avoid all discussion", "Insist on a single outcome"], correct: 1 },
      { q: "In the office example, what did the coworkers actually value?", options: ["The same exact thing", "Different things: light versus quiet", "Neither wanted the office", "Only the size of the office"], correct: 1 },
      { q: "What do skilled negotiators do before a negotiation, according to the passage?", options: ["Nothing in particular", "Research the other party's priorities and constraints", "Refuse to compromise", "Avoid preparation to stay flexible"], correct: 1 },
      { q: "What mindset helps negotiators find better outcomes, according to the passage?", options: ["Fixating on one proposed outcome", "Remaining open to creative alternatives", "Insisting on winning", "Avoiding the other party's concerns"], correct: 1 },
    ],
  },

  // ===================== GRADE 11 =====================
  {
    grade: 11,
    title: "The Rise and Fall of Ancient Rome",
    text:
      "At its height in the second century CE, the Roman Empire spanned roughly two million square miles, " +
      "encompassing territory from Britain in the north to North Africa in the south and from Spain in the " +
      "west to Mesopotamia in the east. This vast expanse was held together by an extensive network of roads, " +
      "a standardized system of law, and a professional army that projected Roman power to the empire's " +
      "farthest reaches. However, historians generally agree that no single cause explains Rome's eventual " +
      "decline in the west; rather, a combination of interrelated factors gradually eroded the empire's " +
      "stability over several centuries. Chronic political instability, marked by frequent changes in " +
      "leadership and civil wars, weakened central authority. Economic troubles, including heavy taxation and " +
      "reliance on slave labor that discouraged technological innovation, strained the empire's resources. " +
      "Meanwhile, increasing pressure from migrating and invading groups along Rome's borders, combined with " +
      "the sheer difficulty of defending such an enormous territory, further stretched military capacity. By " +
      "476 CE, when the last western Roman emperor was deposed, the empire that had once dominated the " +
      "Mediterranean world had fragmented into a patchwork of smaller kingdoms, though the eastern half, " +
      "known as the Byzantine Empire, would endure for nearly another thousand years.",
    questions: [
      { q: "How large was the Roman Empire at its height, according to the passage?", options: ["About 200,000 square miles", "About two million square miles", "About 20 million square miles", "About 500 square miles"], correct: 1 },
      { q: "What held the vast empire together, according to the passage?", options: ["A shared religion alone", "Roads, standardized law, and a professional army", "A single powerful navy", "Isolation between regions"], correct: 1 },
      { q: "Does the passage attribute Rome's decline to a single cause?", options: ["Yes, entirely to invasions", "Yes, entirely to economic collapse", "No, it describes a combination of interrelated factors", "No, it says Rome never declined"], correct: 2 },
      { q: "What economic issue is mentioned as straining the empire's resources?", options: ["Overproduction of goods", "Heavy taxation and reliance on slave labor", "Too much technological innovation", "Excess trade surplus"], correct: 1 },
      { q: "What happened to the eastern half of the empire after 476 CE?", options: ["It also collapsed immediately", "It became the Byzantine Empire and endured for centuries", "It merged with western kingdoms", "It was abandoned"], correct: 1 },
    ],
  },
  {
    grade: 11,
    title: "Artificial Intelligence: Promise and Peril",
    text:
      "Artificial intelligence, once confined to the realm of science fiction, has rapidly become integrated " +
      "into everyday life, powering everything from search engine recommendations to medical diagnostic tools " +
      "and autonomous vehicles. Proponents argue that AI holds transformative potential, capable of analyzing " +
      "vast datasets far more quickly than any human could, uncovering patterns that lead to breakthroughs in " +
      "fields such as drug discovery, climate modeling, and materials science. Yet this same capability raises " +
      "significant concerns. Critics point to the risk of algorithmic bias, in which AI systems trained on " +
      "flawed or unrepresentative data can perpetuate or even amplify existing societal inequalities, " +
      "particularly in sensitive applications like hiring decisions or criminal justice risk assessments. " +
      "Additionally, the increasing automation of tasks previously performed by humans has sparked debate " +
      "about the future of employment, with some economists predicting significant job displacement in certain " +
      "industries even as new categories of work emerge elsewhere. Perhaps most pressing is the question of " +
      "accountability: as AI systems make decisions with real consequences, determining who bears " +
      "responsibility when those systems fail or cause harm remains an unresolved legal and ethical challenge. " +
      "Navigating these tensions will likely require thoughtful regulation that encourages innovation while " +
      "safeguarding against the technology's most serious risks.",
    questions: [
      { q: "According to the passage, what capability makes AI transformative, in proponents' view?", options: ["Its ability to replace all human jobs", "Its ability to analyze vast datasets quickly and find patterns", "Its ability to feel emotions", "Its ability to operate without any data"], correct: 1 },
      { q: "What is algorithmic bias, as described in the passage?", options: ["AI refusing to make decisions", "AI systems perpetuating inequalities from flawed training data", "AI being too slow", "AI having no practical use"], correct: 1 },
      { q: "What employment-related concern does the passage raise?", options: ["AI will create no new jobs at all", "Automation may displace jobs even as new work emerges", "All jobs will disappear immediately", "AI cannot perform any tasks"], correct: 1 },
      { q: "What does the passage identify as perhaps the most pressing question about AI?", options: ["How fast AI can compute", "Who is accountable when AI systems cause harm", "How much AI costs", "Whether AI can play games"], correct: 1 },
      { q: "What does the passage suggest is needed to navigate AI's risks and benefits?", options: ["Banning AI entirely", "Thoughtful regulation balancing innovation and safety", "No regulation at all", "Ignoring the risks"], correct: 1 },
    ],
  },

  // ===================== GRADE 12 =====================
  {
    grade: 12,
    title: "The Philosophy of Utilitarianism",
    text:
      "Utilitarianism, a moral philosophy most closely associated with the eighteenth- and nineteenth-century " +
      "thinkers Jeremy Bentham and John Stuart Mill, holds that the rightness or wrongness of an action should " +
      "be judged by its consequences—specifically, by the degree to which it maximizes overall happiness or " +
      "well-being and minimizes suffering. Bentham proposed a relatively straightforward calculus, suggesting " +
      "that pleasure and pain could, in principle, be measured and compared across individuals to determine " +
      "which course of action produced the greatest net benefit. Mill, while broadly sympathetic to this " +
      "consequentialist framework, refined it considerably, arguing that not all pleasures are equal in " +
      "quality; he distinguished between \"higher\" pleasures, such as intellectual and aesthetic enjoyment, " +
      "and \"lower\" pleasures rooted in mere physical sensation, contending that a being capable of " +
      "appreciating higher pleasures would never truly trade them for an abundance of lower ones. Critics of " +
      "utilitarianism have long raised objections, most notably that a strict focus on aggregate welfare can, " +
      "in certain hypothetical scenarios, justify actions that seem intuitively unjust, such as sacrificing " +
      "the well-being of a minority to benefit a larger majority. Despite these persistent critiques, " +
      "utilitarian reasoning continues to exert considerable influence, particularly within fields such as " +
      "public policy and economics, where cost-benefit analysis often echoes its central premise that outcomes " +
      "affecting the greatest number of people should carry significant moral weight.",
    questions: [
      { q: "According to utilitarianism, how should the rightness of an action be judged?", options: ["By the intention behind it alone", "By its consequences and effect on overall happiness", "By ancient tradition", "By the actor's social status"], correct: 1 },
      { q: "What did Bentham propose regarding pleasure and pain?", options: ["That they cannot be compared at all", "That they could, in principle, be measured and compared", "That only pain matters morally", "That pleasure is always immoral"], correct: 1 },
      { q: "How did Mill refine Bentham's framework?", options: ["He rejected consequentialism entirely", "He distinguished between higher and lower quality pleasures", "He argued all pleasures are identical", "He focused only on physical pleasure"], correct: 1 },
      { q: "What is a major criticism of utilitarianism mentioned in the passage?", options: ["It is too difficult to explain", "It can justify sacrificing a minority's well-being for the majority", "It ignores happiness entirely", "It has no real-world applications"], correct: 1 },
      { q: "Where does the passage say utilitarian reasoning remains influential today?", options: ["Only in ancient philosophy courses", "In public policy and economics, such as cost-benefit analysis", "Nowhere; it has been abandoned", "Only in religious contexts"], correct: 1 },
    ],
  },
  {
    grade: 12,
    title: "Quantum Mechanics: A Brief Introduction",
    text:
      "Quantum mechanics, developed in the early twentieth century through the work of physicists such as Max " +
      "Planck, Niels Bohr, Werner Heisenberg, and Erwin Schrödinger, fundamentally transformed our " +
      "understanding of matter and energy at the smallest scales. Unlike classical physics, which describes " +
      "the predictable motion of everyday objects, quantum mechanics reveals that subatomic particles behave " +
      "in ways that defy ordinary intuition. Perhaps the most famous illustration of this strangeness is " +
      "wave-particle duality: light and matter exhibit properties of both waves and discrete particles " +
      "depending on how they are observed, a phenomenon vividly demonstrated by the classic double-slit " +
      "experiment. Equally counterintuitive is Heisenberg's uncertainty principle, which establishes a " +
      "fundamental limit on how precisely certain pairs of physical properties, such as a particle's position " +
      "and momentum, can simultaneously be known—not merely due to measurement imperfection, but as an " +
      "inherent feature of nature itself. Quantum mechanics also introduces the concept of superposition, in " +
      "which a particle can exist in multiple states at once until it is measured, at which point it appears " +
      "to \"collapse\" into a single definite state. While these ideas may seem abstract or purely " +
      "theoretical, quantum mechanics underlies numerous modern technologies, including semiconductors, " +
      "lasers, and magnetic resonance imaging, and continues to drive cutting-edge research in fields such as " +
      "quantum computing, which promises computational capabilities far beyond those of classical computers " +
      "for certain specialized problems.",
    questions: [
      { q: "In what century was quantum mechanics developed, according to the passage?", options: ["The eighteenth century", "The nineteenth century", "The early twentieth century", "The twenty-first century"], correct: 2 },
      { q: "What does wave-particle duality describe?", options: ["Light and matter behaving only as particles", "Light and matter exhibiting properties of both waves and particles", "Objects moving predictably like classical physics", "Particles that never move"], correct: 1 },
      { q: "According to the passage, what does Heisenberg's uncertainty principle establish?", options: ["A limit due only to poor measurement tools", "A fundamental limit on knowing certain properties simultaneously, inherent to nature", "That particles have no position at all", "That momentum does not exist"], correct: 1 },
      { q: "What is superposition, as described in the passage?", options: ["A particle existing in multiple states until measured", "A particle that cannot be measured", "Two particles colliding", "A wave that never moves"], correct: 0 },
      { q: "What modern technologies does the passage say rely on quantum mechanics?", options: ["Only quantum computers", "Semiconductors, lasers, and magnetic resonance imaging", "Steam engines", "Nothing practical yet"], correct: 1 },
    ],
  },
];
