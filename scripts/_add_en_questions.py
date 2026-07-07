#!/usr/bin/env python3
# One-off: add 5 more ORIGINAL comprehension questions to each existing English
# CEFR passage (5 -> 10). New questions are authored here as data; the script
# formats + JS-escapes them and inserts before each passage's questions-array
# close, matched by unique title. Idempotency guard: aborts if any passage
# already has 10 questions.
import re

PATH = r"c:\gitrepo\udsp\data\readingcompencefr.js"

NEW = {
  "A Day at the Beach": [
    {"q":"Who goes to the beach with Maria?","options":["Her friend","Her brother","Her mother","Her teacher"],"correct":1,"hint":"Look at the second sentence.","explain":"The text says Maria and her brother go to the beach together."},
    {"q":"What do Maria and her brother do in the sea?","options":["They swim","They fish","They sail","They dive"],"correct":0,"hint":"Look at the sentence about the sea.","explain":"The text says they swim in the sea."},
    {"q":"When do they eat sandwiches?","options":["In the morning","At noon","In the evening","At night"],"correct":1,"hint":"Look at the sentence about eating.","explain":"The text says they eat sandwiches at noon."},
    {"q":"Where do they eat their sandwiches?","options":["On a boat","Under an umbrella","In a cafe","At home"],"correct":1,"hint":"Look at the sentence about eating.","explain":"The text says they eat under an umbrella."},
    {"q":"How many people go to the beach in the story?","options":["One","Two","Three","Four"],"correct":1,"hint":"Think about Maria and her brother.","explain":"The text mentions Maria and her brother, so two people go."},
  ],
  "My Favorite Animal": [
    {"q":"How big are elephants, according to the text?","options":["Very small","Very big","Medium-sized","Tiny"],"correct":1,"hint":"Look at the second sentence.","explain":"The text says elephants are very big and gray."},
    {"q":"What are an elephant's ears like?","options":["Small","Big","Pointed","Round and tiny"],"correct":1,"hint":"Look at the sentence about trunks and ears.","explain":"The text says elephants have long trunks and big ears."},
    {"q":"Do elephants eat meat, according to the text?","options":["Yes, only meat","No, they eat leaves, grass, and fruit","Yes, meat and fish","Only insects"],"correct":1,"hint":"Look at the sentence about food.","explain":"The text lists leaves, grass, and fruit, not meat."},
    {"q":"What does the text say about elephants' intelligence?","options":["They are not clever","They are very smart","They cannot learn","The text does not say"],"correct":1,"hint":"Look at the last sentence.","explain":"The text says elephants are very smart animals."},
    {"q":"What long body part do elephants have on their face?","options":["A trunk","A horn","A beak","A mane"],"correct":0,"hint":"Look at the sentence about trunks and ears.","explain":"The text says elephants have long trunks."},
  ],
  "A Letter to a Friend": [
    {"q":"Who is Laura writing this letter to?","options":["Her boss","Anna","Her sister","A stranger"],"correct":1,"hint":"Look at the greeting at the start.","explain":"The letter begins with Dear Anna."},
    {"q":"Where is Laura's new apartment located?","options":["In the countryside","In the city center","Near the beach","In another country"],"correct":1,"hint":"Look at the sentence about moving.","explain":"The text says she moved to a new apartment in the city center."},
    {"q":"Why is the new apartment better for work?","options":["It is bigger","It is closer to her office","It has a garden","It is cheaper"],"correct":1,"hint":"Look at the sentence comparing apartments.","explain":"The text says it is much closer to her office."},
    {"q":"How did Laura travel to work before she moved?","options":["By bus","By car","By train","On foot"],"correct":0,"hint":"Look at the sentence about walking to work now.","explain":"The text says she now walks instead of taking the bus, so she used the bus before."},
    {"q":"Who wrote and signed the letter?","options":["Anna","Laura","Tom","Ella"],"correct":1,"hint":"Look at the signature at the end.","explain":"The letter is signed Best wishes, Laura."},
  ],
  "Planning a Birthday Party": [
    {"q":"Who is planning the birthday party?","options":["Ella","Tom","Their parents","Anna"],"correct":1,"hint":"Look at the first sentence.","explain":"The text says Tom is planning the party."},
    {"q":"What kind of cake will Tom order?","options":["A vanilla cake","A chocolate cake","A fruit cake","A cheesecake"],"correct":1,"hint":"Look at the sentence about the cake.","explain":"The text says Tom will order a chocolate cake."},
    {"q":"What else does Tom need to buy for the party?","options":["Chairs and tables","Balloons and decorations","Plates and cups","Music and lights"],"correct":1,"hint":"Look at the sentence after the cake.","explain":"The text says he needs to buy balloons and decorations."},
    {"q":"Who will help Tom cook the food?","options":["His friends","His parents","The bakery","Ella"],"correct":1,"hint":"Look at the sentence about food.","explain":"The text says his parents will help him cook the food."},
    {"q":"What is Ella to Tom?","options":["His sister","His mother","His friend","His cousin"],"correct":0,"hint":"Look at the first sentence.","explain":"The text says Ella is Tom's sister."},
  ],
  "Learning a New Language": [
    {"q":"How do many people begin learning a new language, according to the text?","options":["By moving abroad","By learning basic vocabulary and grammar rules","By taking exams","By teaching others"],"correct":1,"hint":"Look at the second sentence.","explain":"The text says many people start with basic vocabulary and grammar rules."},
    {"q":"What do some learners keep in the new language?","options":["A dictionary","A journal","A textbook","A recording"],"correct":1,"hint":"Look at the sentence about writing daily.","explain":"The text says some learners keep a journal in the new language."},
    {"q":"How much do journal-keepers write each day, according to the text?","options":["A full page","A few sentences","Nothing","An entire story"],"correct":1,"hint":"Look at the sentence about the journal.","explain":"The text says they write a few sentences every day."},
    {"q":"How does the text describe mistakes in learning?","options":["As a sign of failure","As a normal part of the process","As something to avoid completely","As unimportant"],"correct":1,"hint":"Look at the sentence about mistakes.","explain":"The text says mistakes are a normal part of the learning process."},
    {"q":"According to the text, how can watching movies and podcasts help?","options":["They improve listening skills","They replace speaking practice","They teach grammar rules","They are not useful"],"correct":0,"hint":"Look at the sentence about movies and podcasts.","explain":"The text says they can improve listening skills significantly."},
  ],
  "The Rise of Remote Work": [
    {"q":"What is the traditional alternative to remote work mentioned in the text?","options":["Working night shifts","Commuting to an office every day","Working part-time","Freelancing"],"correct":1,"hint":"Look at the first sentence.","explain":"The text contrasts remote work with commuting to an office every day."},
    {"q":"Besides missing social interaction, what else do some workers find harder?","options":["Finishing tasks","Separating work time from personal time","Using computers","Talking to clients"],"correct":1,"hint":"Look at the sentence starting with However.","explain":"The text says some workers find it harder to separate work time from personal time."},
    {"q":"What tools do managers rely on to keep teams connected?","options":["Letters and fax","Video calls and messaging apps","In-person meetings only","Newspapers"],"correct":1,"hint":"Look at the sentence about managers.","explain":"The text says managers often rely on video calls and messaging apps."},
    {"q":"What does a hybrid model allow staff to do?","options":["Work only at night","Split their time between the office and home","Never come to the office","Work fewer days"],"correct":1,"hint":"Look at the last sentence.","explain":"The text says a hybrid model lets staff split time between office and home."},
    {"q":"According to the text, why did remote work become common?","options":["Because offices closed forever","Because businesses were forced to adapt during a global health crisis","Because employees demanded it","Because it was cheaper"],"correct":1,"hint":"Look at the second sentence.","explain":"The text says it became common after businesses adapted during a global health crisis."},
  ],
  "The Psychology of Procrastination": [
    {"q":"What is procrastination often mistaken for, according to the text?","options":["A medical illness","Simple laziness","A learning disability","A time-management skill"],"correct":1,"hint":"Look at the first sentence.","explain":"The text says procrastination is often misunderstood as simple laziness."},
    {"q":"What feelings can a task provoke that lead to procrastination?","options":["Joy and excitement","Anxiety, boredom, or self-doubt","Hunger and thirst","Pride and confidence"],"correct":1,"hint":"Look at the sentence about the brain.","explain":"The text lists anxiety, boredom, or self-doubt."},
    {"q":"Is a person usually unaware of the long-term consequences when procrastinating?","options":["Yes, completely unaware","No, they are often fully aware","The text does not say","Only sometimes"],"correct":1,"hint":"Look at the sentence about pleasant activities.","explain":"The text says people are fully aware of the negative long-term consequences."},
    {"q":"Instead of dwelling on guilt, what does the text suggest doing?","options":["Punishing yourself","Forgiving yourself","Ignoring the task","Blaming others"],"correct":1,"hint":"Look at the sentence about forgiving.","explain":"The text says forgiving oneself reduces future procrastination."},
    {"q":"The text suggests seeing procrastination as what, rather than a character flaw?","options":["An emotional coping mechanism","A sign of laziness","A permanent habit","A physical illness"],"correct":0,"hint":"Look at the last sentence.","explain":"The text calls it an emotional coping mechanism rather than a character flaw."},
  ],
  "The Impact of Social Media on Attention Spans": [
    {"q":"Name one design feature these platforms use, according to the text.","options":["Slow loading","Instant notifications","Text-only pages","Hourly reminders"],"correct":1,"hint":"Look at the second sentence.","explain":"The text mentions infinite scrolling and instant notifications."},
    {"q":"What kind of tasks may become harder to concentrate on?","options":["Short, exciting tasks","Longer, less stimulating tasks","Physical exercise","Simple games"],"correct":1,"hint":"Look at the sentence about studies.","explain":"The text says longer, less stimulating tasks like reading a book."},
    {"q":"According to critics, does blaming technology alone capture the issue?","options":["Yes, fully","No, it oversimplifies a complicated issue","The text does not say","Only for children"],"correct":1,"hint":"Look at the sentence about critics.","explain":"The text says blaming technology alone oversimplifies a complicated issue."},
    {"q":"What specific boundary do experts suggest?","options":["Turning off the internet","Disabling notifications during work hours","Never using social media","Deleting all apps"],"correct":1,"hint":"Look at the last sentence.","explain":"The text suggests disabling notifications during work hours."},
    {"q":"What is the goal of setting boundaries around screen time?","options":["To save money","To protect one's ability to focus","To use more data","To make more friends"],"correct":1,"hint":"Look at the last sentence.","explain":"The text says it is a practical way to protect one's ability to focus."},
  ],
  "The Ethics of Genetic Engineering": [
    {"q":"What do proponents argue correcting harmful mutations before birth could do?","options":["Make people taller","Eliminate suffering from conditions that have plagued families for generations","Lower the cost of medicine","Speed up evolution"],"correct":1,"hint":"Look at the sentence about proponents.","explain":"The text says it could eliminate suffering from long-standing hereditary conditions."},
    {"q":"Which traits are mentioned as possible 'designer baby' selections?","options":["Height, intelligence, or appearance","Blood type only","Language and accent","Personality and mood"],"correct":0,"hint":"Look at the sentence about designer babies.","explain":"The text lists height, intelligence, or appearance."},
    {"q":"Why might access to these technologies deepen inequality?","options":["It would be free for everyone","It would likely be limited to those who can afford it","It would be banned everywhere","It would only help poor families"],"correct":1,"hint":"Look at the sentence about inequalities.","explain":"The text says access would likely be limited to those who can afford it."},
    {"q":"Do the ethical questions stay within medical treatment, according to the text?","options":["Yes, entirely","No, they extend well beyond it","The text does not say","Only in some countries"],"correct":1,"hint":"Look at the sentence starting with Nevertheless.","explain":"The text says the questions extend well beyond medical treatment."},
    {"q":"Which two extremes do bioethicists reject in favor of regulation?","options":["Science and religion","An outright ban and unrestricted freedom","Public and private funding","Speed and safety"],"correct":1,"hint":"Look at the last sentence.","explain":"The text contrasts robust regulation with an outright ban or unrestricted freedom."},
  ],
  "The Paradox of Choice in Consumer Culture": [
    {"q":"How is contemporary consumer culture characterized, according to the text?","options":["By a lack of products","By an abundance of choice","By rising prices","By poor quality"],"correct":1,"hint":"Look at the first sentence.","explain":"The text says it is characterized by an abundance of choice."},
    {"q":"What does psychological research do to the conventional assumption about choice?","options":["Confirms it fully","Complicates it considerably","Ignores it","Proves it beyond doubt"],"correct":1,"hint":"Look at the sentence about psychological research.","explain":"The text says psychological research complicates the assumption considerably."},
    {"q":"Beyond a certain threshold, what do additional options impose?","options":["A cognitive burden","Lower prices","Better quality","More free time"],"correct":0,"hint":"Look at the sentence naming the paradox.","explain":"The text says additional options impose a cognitive burden."},
    {"q":"What kind of selections might produce greater satisfaction?","options":["Endless options","Curated selections with fewer, carefully chosen options","Random options","The cheapest options"],"correct":1,"hint":"Look at the sentence about researchers.","explain":"The text says curated selections may produce greater satisfaction."},
    {"q":"Does the cognitive burden outweigh the gain in personalization, according to the text?","options":["Yes, beyond a threshold","No, never","Only for experts","The text does not say"],"correct":0,"hint":"Look at the sentence naming the paradox.","explain":"The text says the burden outweighs any marginal gain in personalization beyond a threshold."},
  ],
  "Epistemic Humility in an Age of Information Abundance": [
    {"q":"What has made discerning reliable knowledge more difficult, according to the text?","options":["Too little information","The sheer volume of competing claims stripped of context","Slow internet","A lack of writers"],"correct":1,"hint":"Look at the first sentence.","explain":"The text blames the sheer volume of competing claims stripped of context."},
    {"q":"Epistemic humility guards against which two extremes?","options":["Wealth and poverty","Credulity and unwarranted skepticism","Speed and delay","Fame and obscurity"],"correct":1,"hint":"Look at the sentence defining epistemic humility.","explain":"The text says it guards against both credulity and unwarranted skepticism."},
    {"q":"What do algorithmically curated environments tend to reward?","options":["Accuracy over engagement","Engagement over accuracy","Silence over speech","Length over brevity"],"correct":1,"hint":"Look at the sentence about environments.","explain":"The text says they reward engagement over accuracy."},
    {"q":"What do such environments insulate users within?","options":["Ideologically congenial echo chambers","Public libraries","Neutral debates","Fact-checked feeds"],"correct":0,"hint":"Look at the sentence about environments.","explain":"The text says they insulate users within ideologically congenial echo chambers."},
    {"q":"Is improved media literacy education alone enough, according to some scholars?","options":["Yes, it solves everything","No, a broader cultural reorientation is also needed","The text does not say","Only for students"],"correct":1,"hint":"Look at the sentence about scholars.","explain":"The text says a broader cultural reorientation is also needed."},
  ],
  "The Limits of Rational Choice Theory": [
    {"q":"What has rational choice theory long been, according to the text?","options":["A minor idea","A cornerstone of economic and political analysis","A recent discovery","A rejected theory"],"correct":1,"hint":"Look at the first sentence.","explain":"The text calls it a cornerstone of economic and political analysis."},
    {"q":"What is 'present bias', as described in the text?","options":["Overvaluing immediate rewards relative to future ones","Preferring the past","Ignoring all rewards","Valuing the future more"],"correct":0,"hint":"Look at the sentence about biases.","explain":"The text defines present bias as overvaluing immediate rewards relative to future ones."},
    {"q":"Why can't these biases be dismissed as mere noise?","options":["They are rare","They recur with regularity across cultures and contexts","They only affect experts","They cannot be measured"],"correct":1,"hint":"Look at the sentence about recurring biases.","explain":"The text says they recur with such regularity that they cannot be dismissed as noise."},
    {"q":"In the nuanced models, what do proponents keep as a baseline?","options":["Randomness","Optimization","Emotion","Guesswork"],"correct":1,"hint":"Look at the sentence about proponents.","explain":"The text says they retain optimization as a baseline."},
    {"q":"What ongoing tension does the text say defines behavioral science debates?","options":["Cost versus profit","Explanatory parsimony versus empirical fidelity","Speed versus accuracy","Theory versus practice"],"correct":1,"hint":"Look at the last sentence.","explain":"The text names the tension between explanatory parsimony and empirical fidelity."},
  ],
}


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def fmt(it):
    opts = ", ".join('"%s"' % esc(o) for o in it["options"])
    return ('      { q: "%s", options: [%s], correct: %d, hint: "%s", explain: "%s" },'
            % (esc(it["q"]), opts, it["correct"], esc(it["hint"]), esc(it["explain"])))


def main():
    text = open(PATH, encoding="utf-8").read()
    # idempotency: bail if any target passage already exceeds 5 Qs (already run)
    for title, items in NEW.items():
        start = text.index('title: "%s"' % title)
        close = text.index("\n    ],", start)
        qcount = text.count("{ q: ", start, close)
        if qcount != 5:
            raise SystemExit("ABORT: '%s' has %d questions (expected 5). Already run?" % (title, qcount))
    # insert (process from end of file backward so offsets stay valid)
    inserts = []
    for title, items in NEW.items():
        start = text.index('title: "%s"' % title)
        close = text.index("\n    ],", start)
        block = "\n" + "\n".join(fmt(it) for it in items)
        inserts.append((close, block))
    for pos, block in sorted(inserts, reverse=True):
        text = text[:pos] + block + text[pos:]
    open(PATH, "w", encoding="utf-8", newline="\n").write(text)
    print("done; inserted 5 questions into each of %d passages" % len(NEW))


if __name__ == "__main__":
    main()
