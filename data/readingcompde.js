// Reading Comprehension passages -- German track (CEFR levels A1-C2).
// All passages and questions below are ORIGINAL content written for this
// app -- they are NOT copied or adapted from any third-party site.
// (lingua.com / german.net, both operated by Weblayout s.r.o., were
// consulted only for structural inspiration -- their Terms & Conditions
// explicitly prohibit copying, redistributing, or publishing their
// content: "Digital distribution or dissemination is not permitted.
// Publication is not permitted." -- so their actual texts were
// intentionally NOT used as a source here.)
// Schema: { level, title, text, questions: [ { q, options: [4], correct,
// hint, explain } ] }. `correct` is the 0-based index into `options` of
// the right answer. `hint`/`explain` are shown via the Hint/Explain
// buttons in the game UI. All text (passage, questions, hint, explain) is
// in German, matching the passage's own language.
// Used ONLY by the Reading Comprehension game (readingcomprehension.js),
// selected automatically when currentLang === "de".

window.READING_PASSAGES_DE = [
  // ===================== A1 =====================
  {
    level: "A1",
    title: "Meine Familie",
    text:
      "Ich heiße Lena. Ich bin zehn Jahre alt. Ich habe eine Mutter, einen Vater und einen Bruder. " +
      "Mein Bruder heißt Max. Wir wohnen in Berlin. Ich habe auch einen Hund. Der Hund heißt Bello.",
    questions: [
      { q: "Wie heißt das Mädchen?", options: ["Lena", "Max", "Bello", "Mutter"], correct: 0, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Ich heiße Lena.\"" },
      { q: "Wie alt ist Lena?", options: ["Acht", "Neun", "Zehn", "Elf"], correct: 2, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt: \"Ich bin zehn Jahre alt.\"" },
      { q: "Wie heißt der Bruder?", options: ["Bello", "Max", "Lena", "Vater"], correct: 1, hint: "Schau auf den Satz über den Bruder.", explain: "Der Text sagt: \"Mein Bruder heißt Max.\"" },
      { q: "Wo wohnt die Familie?", options: ["In München", "In Berlin", "In Hamburg", "In Köln"], correct: 1, hint: "Schau auf den Satz mit dem Stadtnamen.", explain: "Der Text sagt: \"Wir wohnen in Berlin.\"" },
      { q: "Was für ein Tier hat Lena?", options: ["Eine Katze", "Einen Vogel", "Einen Hund", "Ein Pferd"], correct: 2, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt: \"Ich habe auch einen Hund.\"" },
    ],
  },
  {
    level: "A1",
    title: "Mein Tag",
    text:
      "Ich stehe um sieben Uhr auf. Ich esse Brot zum Frühstück. Dann gehe ich zur Schule. " +
      "Die Schule beginnt um acht Uhr. Nach der Schule spiele ich Fußball. Am Abend lese ich ein Buch.",
    questions: [
      { q: "Um wie viel Uhr steht die Person auf?", options: ["Sechs Uhr", "Sieben Uhr", "Acht Uhr", "Neun Uhr"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Ich stehe um sieben Uhr auf.\"" },
      { q: "Was isst die Person zum Frühstück?", options: ["Brot", "Ei", "Obst", "Käse"], correct: 0, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt: \"Ich esse Brot zum Frühstück.\"" },
      { q: "Um wie viel Uhr beginnt die Schule?", options: ["Sieben Uhr", "Acht Uhr", "Neun Uhr", "Zehn Uhr"], correct: 1, hint: "Schau auf den Satz über die Schule.", explain: "Der Text sagt: \"Die Schule beginnt um acht Uhr.\"" },
      { q: "Was macht die Person nach der Schule?", options: ["Sie schläft", "Sie spielt Fußball", "Sie kocht", "Sie schwimmt"], correct: 1, hint: "Schau auf den Satz nach der Schule.", explain: "Der Text sagt: \"Nach der Schule spiele ich Fußball.\"" },
      { q: "Was macht die Person am Abend?", options: ["Sie liest ein Buch", "Sie sieht fern", "Sie geht aus", "Sie ruft an"], correct: 0, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt: \"Am Abend lese ich ein Buch.\"" },
    ],
  },

  // ===================== A2 =====================
  {
    level: "A2",
    title: "Einkaufen im Supermarkt",
    text:
      "Am Samstag gehe ich mit meiner Mutter einkaufen. Wir brauchen Brot, Milch und Äpfel. Der Supermarkt " +
      "ist nicht weit von unserem Haus. Zuerst suchen wir das Brot. Dann finden wir die Milch im Kühlregal. " +
      "Zum Schluss kaufen wir frische Äpfel. An der Kasse bezahlen wir mit Karte.",
    questions: [
      { q: "Wann geht die Person einkaufen?", options: ["Am Montag", "Am Samstag", "Am Sonntag", "Am Freitag"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Am Samstag gehe ich mit meiner Mutter einkaufen.\"" },
      { q: "Was brauchen sie nicht?", options: ["Brot", "Milch", "Äpfel", "Käse"], correct: 3, hint: "Schau auf die Liste im zweiten Satz.", explain: "Der Text nennt nur \"Brot, Milch und Äpfel\" -- Käse wird nicht erwähnt." },
      { q: "Wie weit ist der Supermarkt?", options: ["Sehr weit", "Nicht weit", "In einer anderen Stadt", "Unbekannt"], correct: 1, hint: "Schau auf den Satz über den Supermarkt.", explain: "Der Text sagt: \"Der Supermarkt ist nicht weit von unserem Haus.\"" },
      { q: "Wo finden sie die Milch?", options: ["Im Kühlregal", "Neben dem Brot", "An der Kasse", "Draußen"], correct: 0, hint: "Schau auf den Satz über die Milch.", explain: "Der Text sagt: \"Dann finden wir die Milch im Kühlregal.\"" },
      { q: "Wie bezahlen sie?", options: ["Mit Bargeld", "Mit Karte", "Mit einem Gutschein", "Sie bezahlen nicht"], correct: 1, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt: \"An der Kasse bezahlen wir mit Karte.\"" },
    ],
  },
  {
    level: "A2",
    title: "Ein Wochenende am See",
    text:
      "Letztes Wochenende bin ich mit meinen Freunden an einen See gefahren. Das Wetter war sonnig und warm. " +
      "Wir haben ein Picknick gemacht und viel gelacht. Am Nachmittag sind wir geschwommen. Ein Freund hat " +
      "sogar Fische gefangen. Am Abend haben wir ein Lagerfeuer gemacht. Es war ein wunderschöner Tag.",
    questions: [
      { q: "Wann ist die Person zum See gefahren?", options: ["Letzten Sommer", "Letztes Wochenende", "Gestern", "Letztes Jahr"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Letztes Wochenende bin ich mit meinen Freunden an einen See gefahren.\"" },
      { q: "Wie war das Wetter?", options: ["Kalt und regnerisch", "Sonnig und warm", "Windig", "Neblig"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt: \"Das Wetter war sonnig und warm.\"" },
      { q: "Was haben sie gemacht, bevor sie geschwommen sind?", options: ["Ein Picknick", "Ein Lagerfeuer", "Eine Wanderung", "Ein Spiel"], correct: 0, hint: "Schau auf den Satz vor dem Schwimmen.", explain: "Der Text sagt, sie \"haben ein Picknick gemacht und viel gelacht\", bevor sie schwimmen gingen." },
      { q: "Was hat ein Freund gefangen?", options: ["Einen Vogel", "Fische", "Ein Kaninchen", "Nichts"], correct: 1, hint: "Schau auf den Satz über den Freund.", explain: "Der Text sagt: \"Ein Freund hat sogar Fische gefangen.\"" },
      { q: "Was haben sie am Abend gemacht?", options: ["Sie sind nach Hause gefahren", "Ein Lagerfeuer gemacht", "Wieder geschwommen", "Im Zelt geschlafen"], correct: 1, hint: "Schau auf den Satz über den Abend.", explain: "Der Text sagt: \"Am Abend haben wir ein Lagerfeuer gemacht.\"" },
    ],
  },

  // ===================== B1 =====================
  {
    level: "B1",
    title: "Meine Stadt",
    text:
      "Ich wohne seit fünf Jahren in Leipzig. Die Stadt ist bekannt für ihre Musik und ihre Universität. " +
      "Es gibt viele Parks, in denen man spazieren gehen kann. Im Stadtzentrum gibt es zahlreiche Cafés und " +
      "Restaurants. Am Wochenende besuche ich oft den Markt, wo man frisches Obst und Gemüse kaufen kann. " +
      "Was mir am besten gefällt, ist die freundliche Atmosphäre der Stadt.",
    questions: [
      { q: "Wie lange wohnt die Person schon in Leipzig?", options: ["Zwei Jahre", "Drei Jahre", "Fünf Jahre", "Zehn Jahre"], correct: 2, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Ich wohne seit fünf Jahren in Leipzig.\"" },
      { q: "Wofür ist Leipzig bekannt?", options: ["Für seinen Strand", "Für seine Musik und Universität", "Für seine Berge", "Für seine Industrie"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt, die Stadt sei \"bekannt für ihre Musik und ihre Universität.\"" },
      { q: "Was kann man in den Parks machen?", options: ["Schwimmen", "Einkaufen", "Spazieren gehen", "Autofahren"], correct: 2, hint: "Schau auf den Satz über die Parks.", explain: "Der Text sagt, es gebe Parks, \"in denen man spazieren gehen kann.\"" },
      { q: "Was kauft die Person auf dem Markt?", options: ["Kleidung", "Frisches Obst und Gemüse", "Bücher", "Möbel"], correct: 1, hint: "Schau auf den Satz über das Wochenende.", explain: "Der Text sagt, man könne dort \"frisches Obst und Gemüse kaufen.\"" },
      { q: "Was gefällt der Person am besten an der Stadt?", options: ["Die Cafés", "Der Markt", "Die freundliche Atmosphäre", "Die Universität"], correct: 2, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt: \"Was mir am besten gefällt, ist die freundliche Atmosphäre der Stadt.\"" },
    ],
  },
  {
    level: "B1",
    title: "Gesunde Ernährung",
    text:
      "Immer mehr Menschen achten heutzutage auf eine gesunde Ernährung. Obst und Gemüse sollten täglich auf " +
      "dem Speiseplan stehen, da sie wichtige Vitamine liefern. Auch ausreichend Wasser zu trinken ist wichtig " +
      "für den Körper. Viele Experten empfehlen, weniger Zucker und Fett zu essen. Regelmäßige Mahlzeiten " +
      "helfen außerdem, Heißhunger zu vermeiden. Wer sich gesund ernährt, fühlt sich oft energiegeladener und " +
      "konzentrierter.",
    questions: [
      { q: "Worauf achten immer mehr Menschen?", options: ["Auf ihre Kleidung", "Auf eine gesunde Ernährung", "Auf ihr Geld", "Auf ihre Freizeit"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Immer mehr Menschen achten heutzutage auf eine gesunde Ernährung.\"" },
      { q: "Warum sollten Obst und Gemüse täglich gegessen werden?", options: ["Sie sind billig", "Sie liefern wichtige Vitamine", "Sie schmecken süß", "Sie sind leicht zu kochen"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt, sie \"liefern wichtige Vitamine.\"" },
      { q: "Was ist laut Text auch wichtig für den Körper?", options: ["Genug schlafen", "Ausreichend Wasser trinken", "Viel Sport treiben", "Wenig arbeiten"], correct: 1, hint: "Schau auf den Satz über Wasser.", explain: "Der Text sagt: \"Auch ausreichend Wasser zu trinken ist wichtig für den Körper.\"" },
      { q: "Was empfehlen viele Experten?", options: ["Mehr Zucker zu essen", "Weniger Zucker und Fett zu essen", "Nur einmal am Tag zu essen", "Kein Gemüse zu essen"], correct: 1, hint: "Schau auf den Satz über Experten.", explain: "Der Text sagt, Experten empfehlen, \"weniger Zucker und Fett zu essen.\"" },
      { q: "Wie fühlen sich Menschen, die sich gesund ernähren, laut Text?", options: ["Müde und schwach", "Energiegeladener und konzentrierter", "Gestresster", "Hungriger"], correct: 1, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt, man \"fühlt sich oft energiegeladener und konzentrierter.\"" },
    ],
  },

  // ===================== B2 =====================
  {
    level: "B2",
    title: "Die Digitalisierung der Arbeitswelt",
    text:
      "Die Digitalisierung verändert die Arbeitswelt in den letzten Jahren grundlegend. Immer mehr Unternehmen " +
      "setzen auf digitale Werkzeuge, um Arbeitsprozesse effizienter zu gestalten. Homeoffice ist für viele " +
      "Angestellte mittlerweile zur Normalität geworden, was mehr Flexibilität, aber auch neue Herausforderungen " +
      "mit sich bringt. Kritiker weisen darauf hin, dass die ständige Erreichbarkeit über digitale Geräte die " +
      "Grenze zwischen Arbeit und Freizeit verschwimmen lässt. Dennoch sehen viele Experten in der " +
      "Digitalisierung eine große Chance, um Innovation und Produktivität zu fördern. Wie sich die Arbeitswelt " +
      "langfristig entwickeln wird, bleibt jedoch abzuwarten.",
    questions: [
      { q: "Was verändert die Arbeitswelt laut Text grundlegend?", options: ["Der Klimawandel", "Die Digitalisierung", "Die Globalisierung", "Die Inflation"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt: \"Die Digitalisierung verändert die Arbeitswelt...grundlegend.\"" },
      { q: "Wozu setzen Unternehmen digitale Werkzeuge ein?", options: ["Um Kosten zu verstecken", "Um Arbeitsprozesse effizienter zu gestalten", "Um weniger Mitarbeiter einzustellen", "Um Steuern zu sparen"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt, sie nutzen digitale Werkzeuge, \"um Arbeitsprozesse effizienter zu gestalten.\"" },
      { q: "Was bringt Homeoffice laut Text mit sich?", options: ["Nur Vorteile", "Mehr Flexibilität, aber auch neue Herausforderungen", "Nur Nachteile", "Weniger Arbeit"], correct: 1, hint: "Schau auf den Satz über Homeoffice.", explain: "Der Text sagt, es bringe \"mehr Flexibilität, aber auch neue Herausforderungen mit sich.\"" },
      { q: "Worauf weisen Kritiker hin?", options: ["Dass digitale Geräte zu teuer sind", "Dass die Grenze zwischen Arbeit und Freizeit verschwimmt", "Dass Homeoffice verboten werden sollte", "Dass Unternehmen zu langsam digitalisieren"], correct: 1, hint: "Schau auf den Satz über Kritiker.", explain: "Der Text sagt, ständige Erreichbarkeit \"lässt die Grenze zwischen Arbeit und Freizeit verschwimmen.\"" },
      { q: "Wie bewerten viele Experten die Digitalisierung laut Text?", options: ["Als Bedrohung", "Als große Chance für Innovation und Produktivität", "Als unwichtig", "Als vorübergehenden Trend"], correct: 1, hint: "Schau auf den Satz vor dem letzten Satz.", explain: "Der Text sagt, Experten sehen darin \"eine große Chance, um Innovation und Produktivität zu fördern.\"" },
    ],
  },
  {
    level: "B2",
    title: "Erneuerbare Energien in Deutschland",
    text:
      "Deutschland hat sich zum Ziel gesetzt, seinen Energieverbrauch zunehmend aus erneuerbaren Quellen zu " +
      "decken. Wind- und Solarenergie spielen dabei eine zentrale Rolle, da sie im Gegensatz zu fossilen " +
      "Brennstoffen keine schädlichen Treibhausgase ausstoßen. Der Ausbau von Windparks stößt jedoch nicht " +
      "überall auf Zustimmung, da manche Anwohner den Anblick der Anlagen sowie die Geräuschentwicklung als " +
      "störend empfinden. Zusätzlich stellt die Speicherung von überschüssiger Energie weiterhin eine " +
      "technische Herausforderung dar. Trotz dieser Hürden gilt die Energiewende als notwendiger Schritt, um " +
      "die Klimaziele des Landes zu erreichen.",
    questions: [
      { q: "Was hat sich Deutschland laut Text zum Ziel gesetzt?", options: ["Weniger Energie zu verbrauchen", "Den Energieverbrauch zunehmend aus erneuerbaren Quellen zu decken", "Mehr Kohle zu nutzen", "Energie zu exportieren"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt, Deutschland wolle den Verbrauch \"zunehmend aus erneuerbaren Quellen zu decken.\"" },
      { q: "Warum spielen Wind- und Solarenergie eine zentrale Rolle?", options: ["Sie sind billiger als Kohle", "Sie stoßen keine schädlichen Treibhausgase aus", "Sie brauchen keine Technik", "Sie sind einfacher zu bauen"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt, sie \"stoßen keine schädlichen Treibhausgase aus.\"" },
      { q: "Warum stößt der Ausbau von Windparks nicht überall auf Zustimmung?", options: ["Er ist zu teuer", "Manche Anwohner stört der Anblick und die Geräusche", "Er ist gesetzlich verboten", "Es gibt zu wenig Wind"], correct: 1, hint: "Schau auf den Satz über Windparks.", explain: "Der Text sagt, manche Anwohner empfinden \"den Anblick der Anlagen sowie die Geräuschentwicklung als störend.\"" },
      { q: "Welche technische Herausforderung wird im Text genannt?", options: ["Der Transport von Kohle", "Die Speicherung von überschüssiger Energie", "Der Bau neuer Straßen", "Die Ausbildung von Fachkräften"], correct: 1, hint: "Schau auf den Satz über Speicherung.", explain: "Der Text sagt, \"die Speicherung von überschüssiger Energie\" stelle eine Herausforderung dar." },
      { q: "Wie wird die Energiewende im letzten Satz beschrieben?", options: ["Als unnötig", "Als notwendiger Schritt für die Klimaziele", "Als gescheitert", "Als zu teuer"], correct: 1, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt, sie gelte \"als notwendiger Schritt, um die Klimaziele des Landes zu erreichen.\"" },
    ],
  },

  // ===================== C1 =====================
  {
    level: "C1",
    title: "Die Bedeutung der Pressefreiheit",
    text:
      "Die Pressefreiheit gilt als eines der fundamentalen Prinzipien einer demokratischen Gesellschaft, da " +
      "sie es Journalisten ermöglicht, Missstände aufzudecken und die Öffentlichkeit unabhängig zu " +
      "informieren. In vielen Ländern wird dieses Recht jedoch zunehmend eingeschränkt, sei es durch " +
      "staatliche Zensur, wirtschaftlichen Druck auf Medienunternehmen oder gezielte Einschüchterung " +
      "einzelner Journalisten. Organisationen wie Reporter ohne Grenzen dokumentieren solche Verstöße und " +
      "setzen sich weltweit für den Schutz von Medienschaffenden ein. Kritiker warnen zudem davor, dass die " +
      "zunehmende Konzentration von Medienbesitz in den Händen weniger Konzerne die Meinungsvielfalt " +
      "gefährden könnte. Eine freie und pluralistische Presse bleibt daher unverzichtbar, um Machtmissbrauch " +
      "zu verhindern und den öffentlichen Diskurs lebendig zu halten.",
    questions: [
      { q: "Warum gilt die Pressefreiheit als fundamentales Prinzip?", options: ["Weil sie Journalisten reich macht", "Weil sie es ermöglicht, Missstände aufzudecken und unabhängig zu informieren", "Weil sie von der Regierung kontrolliert wird", "Weil sie Werbeeinnahmen sichert"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt, sie ermögliche es, \"Missstände aufzudecken und die Öffentlichkeit unabhängig zu informieren.\"" },
      { q: "Wodurch wird die Pressefreiheit laut Text eingeschränkt?", options: ["Nur durch Zensur", "Durch Zensur, wirtschaftlichen Druck und Einschüchterung", "Nur durch wirtschaftlichen Druck", "Durch fehlende Leser"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text nennt \"staatliche Zensur, wirtschaftlichen Druck...oder gezielte Einschüchterung.\"" },
      { q: "Was macht die Organisation Reporter ohne Grenzen?", options: ["Sie zensiert Medien", "Sie dokumentiert Verstöße und schützt Medienschaffende", "Sie besitzt Zeitungen", "Sie bildet Journalisten aus"], correct: 1, hint: "Schau auf den Satz über Reporter ohne Grenzen.", explain: "Der Text sagt, sie \"dokumentieren solche Verstöße und setzen sich...für den Schutz von Medienschaffenden ein.\"" },
      { q: "Wovor warnen Kritiker laut Text?", options: ["Vor zu vielen Zeitungen", "Vor der Konzentration von Medienbesitz in wenigen Händen", "Vor zu freier Presse", "Vor zu billigen Nachrichten"], correct: 1, hint: "Schau auf den Satz über Kritiker.", explain: "Der Text sagt, die Konzentration von Medienbesitz \"in den Händen weniger Konzerne die Meinungsvielfalt gefährden könnte.\"" },
      { q: "Was bleibt laut dem letzten Satz unverzichtbar?", options: ["Staatliche Kontrolle der Presse", "Eine freie und pluralistische Presse", "Werbung in Zeitungen", "Zensur im Internet"], correct: 1, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt: \"Eine freie und pluralistische Presse bleibt daher unverzichtbar.\"" },
    ],
  },
  {
    level: "C1",
    title: "Künstliche Intelligenz und Arbeitsmarkt",
    text:
      "Die rasante Entwicklung künstlicher Intelligenz wirft grundlegende Fragen über die Zukunft des " +
      "Arbeitsmarktes auf. Befürworter argumentieren, dass KI-Systeme repetitive und gefährliche Tätigkeiten " +
      "übernehmen können, wodurch Menschen mehr Zeit für kreative und zwischenmenschliche Aufgaben gewinnen. " +
      "Gleichzeitig befürchten Kritiker, dass ganze Berufsfelder, insbesondere in der Verwaltung und " +
      "Produktion, in absehbarer Zeit überflüssig werden könnten. Ökonomen betonen, dass historische " +
      "Erfahrungen mit technologischem Wandel zwar häufig zu Verschiebungen, aber selten zu dauerhaft " +
      "höherer Arbeitslosigkeit geführt haben. Dennoch erfordert der Übergang erhebliche Investitionen in " +
      "Weiterbildung, damit Arbeitnehmer neue Kompetenzen erwerben können. Wie sich diese Entwicklung " +
      "letztlich auf die Gesellschaft auswirken wird, hängt maßgeblich von politischen und wirtschaftlichen " +
      "Weichenstellungen ab.",
    questions: [
      { q: "Welche Fragen wirft die Entwicklung künstlicher Intelligenz laut Text auf?", options: ["Fragen über die Zukunft des Arbeitsmarktes", "Fragen über das Wetter", "Fragen über die Raumfahrt", "Fragen über die Landwirtschaft"], correct: 0, hint: "Schau auf den ersten Satz.", explain: "Der Text sagt, die Entwicklung \"wirft grundlegende Fragen über die Zukunft des Arbeitsmarktes auf.\"" },
      { q: "Was argumentieren Befürworter der KI laut Text?", options: ["Dass KI Menschen ersetzen sollte", "Dass KI repetitive und gefährliche Tätigkeiten übernehmen kann", "Dass KI Arbeitsplätze vernichtet", "Dass KI zu teuer ist"], correct: 1, hint: "Schau auf den Satz über Befürworter.", explain: "Der Text sagt, KI könne \"repetitive und gefährliche Tätigkeiten übernehmen.\"" },
      { q: "Was befürchten Kritiker laut Text?", options: ["Dass KI zu langsam ist", "Dass ganze Berufsfelder überflüssig werden könnten", "Dass KI nie richtig funktionieren wird", "Dass Löhne steigen werden"], correct: 1, hint: "Schau auf den Satz über Kritiker.", explain: "Der Text sagt, Kritiker befürchten, Berufsfelder \"könnten...überflüssig werden.\"" },
      { q: "Was zeigen historische Erfahrungen laut den Ökonomen im Text?", options: ["Technologischer Wandel führt selten zu dauerhaft höherer Arbeitslosigkeit", "Technologischer Wandel führt immer zu Massenarbeitslosigkeit", "Technologie hat noch nie den Arbeitsmarkt verändert", "Ökonomen sind sich nicht einig"], correct: 0, hint: "Schau auf den Satz über Ökonomen.", explain: "Der Text sagt, Wandel habe \"selten zu dauerhaft höherer Arbeitslosigkeit geführt.\"" },
      { q: "Was erfordert der Übergang laut Text?", options: ["Weniger Regulierung", "Erhebliche Investitionen in Weiterbildung", "Höhere Steuern", "Weniger Technologie"], correct: 1, hint: "Schau auf den vorletzten Satz.", explain: "Der Text sagt, der Übergang erfordere \"erhebliche Investitionen in Weiterbildung.\"" },
    ],
  },

  // ===================== C2 =====================
  {
    level: "C2",
    title: "Die Krise der repräsentativen Demokratie",
    text:
      "In zahlreichen westlichen Demokratien lässt sich seit geraumer Zeit ein wachsendes Misstrauen " +
      "gegenüber etablierten politischen Institutionen beobachten, das sich unter anderem in sinkender " +
      "Wahlbeteiligung und dem Erstarken populistischer Bewegungen manifestiert. Politikwissenschaftler " +
      "führen dieses Phänomen auf ein Bündel miteinander verwobener Ursachen zurück: die wachsende Kluft " +
      "zwischen wirtschaftlichen Gewinnern und Verlierern der Globalisierung, das Gefühl mangelnder " +
      "politischer Teilhabe sowie eine zunehmend fragmentierte mediale Öffentlichkeit, in der gemeinsame " +
      "Faktengrundlagen zu erodieren scheinen. Einige Theoretiker plädieren daher für eine Erweiterung " +
      "repräsentativer Verfahren um deliberative Elemente, etwa Bürgerräte, um das Vertrauen in " +
      "demokratische Prozesse wiederherzustellen. Andere hingegen warnen davor, dass eine Überfrachtung des " +
      "politischen Systems mit immer neuen Partizipationsformen zu Entscheidungslähmung führen könnte, ohne " +
      "die zugrunde liegenden Legitimationsprobleme tatsächlich zu lösen. Die Frage, wie sich " +
      "Reaktionsfähigkeit und Stabilität demokratischer Systeme miteinander vereinbaren lassen, bleibt " +
      "folglich eine der zentralen Herausforderungen der Gegenwart.",
    questions: [
      { q: "Was lässt sich laut Text in zahlreichen westlichen Demokratien beobachten?", options: ["Steigendes Vertrauen in Institutionen", "Wachsendes Misstrauen gegenüber etablierten politischen Institutionen", "Ein Rückgang populistischer Bewegungen", "Eine Zunahme der Wahlbeteiligung"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text spricht von einem \"wachsenden Misstrauen gegenüber etablierten politischen Institutionen.\"" },
      { q: "Welche Ursache nennen Politikwissenschaftler NICHT für dieses Phänomen?", options: ["Die Kluft zwischen Globalisierungsgewinnern und -verlierern", "Das Gefühl mangelnder politischer Teilhabe", "Eine fragmentierte mediale Öffentlichkeit", "Ein Mangel an politischen Parteien"], correct: 3, hint: "Schau auf die Liste der Ursachen im zweiten Satz.", explain: "Der Text nennt drei Ursachen, aber \"ein Mangel an politischen Parteien\" wird nicht erwähnt." },
      { q: "Wofür plädieren manche Theoretiker laut Text?", options: ["Für die Abschaffung von Wahlen", "Für eine Erweiterung repräsentativer Verfahren um deliberative Elemente", "Für weniger Bürgerbeteiligung", "Für mehr Zensur der Medien"], correct: 1, hint: "Schau auf den Satz über Theoretiker.", explain: "Der Text sagt, sie plädieren für \"eine Erweiterung repräsentativer Verfahren um deliberative Elemente, etwa Bürgerräte.\"" },
      { q: "Wovor warnen andere Theoretiker laut Text?", options: ["Vor zu wenig Partizipation", "Vor Entscheidungslähmung durch zu viele neue Partizipationsformen", "Vor zu stabilen Regierungen", "Vor sinkenden Wahlkosten"], correct: 1, hint: "Schau auf den Satz, der mit 'Andere hingegen' beginnt.", explain: "Der Text sagt, eine Überfrachtung könnte \"zu Entscheidungslähmung führen.\"" },
      { q: "Was bleibt laut dem letzten Satz eine zentrale Herausforderung?", options: ["Die Vereinbarkeit von Reaktionsfähigkeit und Stabilität demokratischer Systeme", "Die Abschaffung der Demokratie", "Die Finanzierung von Wahlkämpfen", "Die Digitalisierung der Verwaltung"], correct: 0, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt, dies bleibe \"eine der zentralen Herausforderungen der Gegenwart.\"" },
    ],
  },
  {
    level: "C2",
    title: "Sprachwandel und Sprachpurismus",
    text:
      "Sprachen befinden sich in einem fortwährenden Wandel, der sich in Lautverschiebungen, semantischen " +
      "Bedeutungsverschiebungen sowie der kontinuierlichen Aufnahme von Lehnwörtern aus anderen Sprachen " +
      "manifestiert. Sprachpuristische Strömungen, die eine vermeintlich reine oder ursprüngliche Form einer " +
      "Sprache bewahren wollen, existieren in nahezu jeder Sprachgemeinschaft und richten sich häufig gegen " +
      "Anglizismen oder andere als fremd empfundene Einflüsse. Linguisten weisen jedoch darauf hin, dass " +
      "dieser Wandel keineswegs ein Zeichen von Verfall darstellt, sondern vielmehr ein universelles, seit " +
      "Jahrtausenden zu beobachtendes Merkmal lebendiger Sprachsysteme ist. Tatsächlich lässt sich kaum eine " +
      "historische Sprachstufe identifizieren, die nicht selbst das Ergebnis vorangegangener Entlehnungs- " +
      "und Wandelprozesse gewesen wäre. Die Ablehnung von Sprachwandel beruht daher häufiger auf " +
      "soziokulturellen Ängsten vor Identitätsverlust als auf tatsächlich nachweisbaren sprachlichen " +
      "Qualitätsverlusten. Sprachwissenschaftler plädieren folglich meist für eine deskriptive statt einer " +
      "präskriptiven Herangehensweise an sprachliche Normen.",
    questions: [
      { q: "Worin manifestiert sich der fortwährende Sprachwandel laut Text?", options: ["Nur in neuen Wörtern", "In Lautverschiebungen, Bedeutungsverschiebungen und Lehnwörtern", "Nur in der Grammatik", "Nur in der Aussprache"], correct: 1, hint: "Schau auf den ersten Satz.", explain: "Der Text nennt \"Lautverschiebungen, semantische Bedeutungsverschiebungen sowie...Lehnwörter.\"" },
      { q: "Wogegen richten sich sprachpuristische Strömungen häufig?", options: ["Gegen alte Wörter", "Gegen Anglizismen oder andere fremde Einflüsse", "Gegen die Grammatik", "Gegen Dialekte"], correct: 1, hint: "Schau auf den zweiten Satz.", explain: "Der Text sagt, sie richten sich \"häufig gegen Anglizismen oder andere als fremd empfundene Einflüsse.\"" },
      { q: "Wie bewerten Linguisten den Sprachwandel laut Text?", options: ["Als Zeichen von Verfall", "Als universelles Merkmal lebendiger Sprachsysteme", "Als Fehler der jüngeren Generation", "Als vermeidbares Problem"], correct: 1, hint: "Schau auf den Satz, der mit 'Linguisten' beginnt.", explain: "Der Text sagt, es sei \"ein universelles...Merkmal lebendiger Sprachsysteme.\"" },
      { q: "Worauf beruht die Ablehnung von Sprachwandel laut Text meistens?", options: ["Auf nachweisbaren Qualitätsverlusten", "Auf soziokulturellen Ängsten vor Identitätsverlust", "Auf wissenschaftlichen Studien", "Auf wirtschaftlichen Gründen"], correct: 1, hint: "Schau auf den vorletzten Satz.", explain: "Der Text sagt, sie beruhe \"häufiger auf soziokulturellen Ängsten vor Identitätsverlust.\"" },
      { q: "Wofür plädieren Sprachwissenschaftler laut dem letzten Satz?", options: ["Für eine präskriptive Herangehensweise", "Für eine deskriptive statt präskriptive Herangehensweise", "Für die Abschaffung von Sprachregeln", "Für mehr Anglizismen"], correct: 1, hint: "Schau auf den letzten Satz.", explain: "Der Text sagt, sie plädieren \"für eine deskriptive statt einer präskriptiven Herangehensweise.\"" },
    ],
  },
];
