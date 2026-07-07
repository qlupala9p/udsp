# -*- coding: utf-8 -*-
#!/usr/bin/env python3
# One-off: add 5 more ORIGINAL German comprehension questions to each existing
# German CEFR passage (5 -> 10). Same insertion approach as _add_en_questions.py.
import re

PATH = r"c:\gitrepo\udsp\data\readingcompde.js"

NEW = {
  "Meine Familie": [
    {"q":"Wie viele Brüder hat Lena?","options":["Keinen","Einen","Zwei","Drei"],"correct":1,"hint":"Schau auf den dritten Satz.","explain":"Der Text sagt, Lena hat einen Bruder namens Max."},
    {"q":"Wie heißt der Hund?","options":["Max","Bello","Lena","Rex"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Der Text sagt, der Hund heißt Bello."},
    {"q":"Wer ist Max?","options":["Lenas Vater","Lenas Bruder","Lenas Hund","Lenas Freund"],"correct":1,"hint":"Schau auf den Satz über den Bruder.","explain":"Der Text sagt, Max ist Lenas Bruder."},
    {"q":"Hat Lena ein Haustier?","options":["Nein","Ja, einen Hund","Ja, eine Katze","Ja, einen Vogel"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Der Text sagt, Lena hat auch einen Hund."},
    {"q":"Wen erwähnt Lena in ihrer Familie?","options":["Nur die Mutter","Mutter, Vater und Bruder","Zwei Schwestern","Die Großeltern"],"correct":1,"hint":"Schau auf den dritten Satz.","explain":"Der Text nennt eine Mutter, einen Vater und einen Bruder."},
  ],
  "Mein Tag": [
    {"q":"Was macht die Person nach dem Aufstehen zuerst?","options":["Sie geht zur Schule","Sie isst Frühstück","Sie spielt Fußball","Sie liest"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Nach dem Aufstehen isst die Person Brot zum Frühstück."},
    {"q":"Wohin geht die Person nach dem Frühstück?","options":["Zur Arbeit","Zur Schule","Zum Park","Nach Hause"],"correct":1,"hint":"Schau auf den dritten Satz.","explain":"Der Text sagt: Dann gehe ich zur Schule."},
    {"q":"Welchen Sport spielt die Person?","options":["Tennis","Fußball","Basketball","Schwimmen"],"correct":1,"hint":"Schau auf den Satz nach der Schule.","explain":"Der Text sagt, sie spielt Fußball."},
    {"q":"Wann liest die Person ein Buch?","options":["Am Morgen","Am Mittag","Am Abend","In der Schule"],"correct":2,"hint":"Schau auf den letzten Satz.","explain":"Der Text sagt: Am Abend lese ich ein Buch."},
    {"q":"Um wie viel Uhr beginnt der Unterricht?","options":["Um sieben Uhr","Um acht Uhr","Um neun Uhr","Um zehn Uhr"],"correct":1,"hint":"Schau auf den Satz über die Schule.","explain":"Die Schule beginnt um acht Uhr."},
  ],
  "Einkaufen im Supermarkt": [
    {"q":"Mit wem geht die Person einkaufen?","options":["Mit dem Vater","Mit der Mutter","Mit einem Freund","Allein"],"correct":1,"hint":"Schau auf den ersten Satz.","explain":"Der Text sagt, die Person geht mit ihrer Mutter einkaufen."},
    {"q":"Was suchen sie zuerst?","options":["Die Milch","Das Brot","Die Äpfel","Den Käse"],"correct":1,"hint":"Schau auf den Satz mit 'Zuerst'.","explain":"Der Text sagt: Zuerst suchen wir das Brot."},
    {"q":"Was kaufen sie zum Schluss?","options":["Brot","Milch","Frische Äpfel","Käse"],"correct":2,"hint":"Schau auf den Satz mit 'Zum Schluss'.","explain":"Der Text sagt: Zum Schluss kaufen wir frische Äpfel."},
    {"q":"Wie viele Dinge stehen auf der Einkaufsliste?","options":["Zwei","Drei","Vier","Fünf"],"correct":1,"hint":"Schau auf den zweiten Satz: Brot, Milch und Äpfel.","explain":"Der Text nennt drei Dinge: Brot, Milch und Äpfel."},
    {"q":"Warum ist der Einkauf einfach?","options":["Der Supermarkt ist nicht weit","Sie haben viel Geld","Die Mutter kennt den Weg","Es gibt keine anderen Kunden"],"correct":0,"hint":"Schau auf den Satz über den Supermarkt.","explain":"Der Supermarkt ist nicht weit von ihrem Haus."},
  ],
  "Ein Wochenende am See": [
    {"q":"Mit wem ist die Person zum See gefahren?","options":["Mit der Familie","Mit ihren Freunden","Allein","Mit Kollegen"],"correct":1,"hint":"Schau auf den ersten Satz.","explain":"Der Text sagt, die Person fuhr mit ihren Freunden."},
    {"q":"Wann sind sie geschwommen?","options":["Am Morgen","Am Nachmittag","Am Abend","In der Nacht"],"correct":1,"hint":"Schau auf den Satz über das Schwimmen.","explain":"Der Text sagt: Am Nachmittag sind wir geschwommen."},
    {"q":"Was haben sie beim Picknick gemacht?","options":["Viel gelacht","Gestritten","Geschlafen","Gearbeitet"],"correct":0,"hint":"Schau auf den Satz über das Picknick.","explain":"Der Text sagt, sie haben ein Picknick gemacht und viel gelacht."},
    {"q":"Wie beschreibt die Person den Tag am Ende?","options":["Als langweilig","Als wunderschön","Als anstrengend","Als kalt"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Der Text sagt: Es war ein wunderschöner Tag."},
    {"q":"Was hat ein Freund am See getan?","options":["Ein Buch gelesen","Fische gefangen","Ein Zelt gebaut","Musik gemacht"],"correct":1,"hint":"Schau auf den Satz über den Freund.","explain":"Der Text sagt, ein Freund hat Fische gefangen."},
  ],
  "Meine Stadt": [
    {"q":"In welcher Stadt wohnt die Person?","options":["Leipzig","Berlin","Dresden","München"],"correct":0,"hint":"Schau auf den ersten Satz.","explain":"Der Text sagt, die Person wohnt in Leipzig."},
    {"q":"Was gibt es im Stadtzentrum?","options":["Nur Parks","Zahlreiche Cafés und Restaurants","Einen Flughafen","Große Fabriken"],"correct":1,"hint":"Schau auf den Satz über das Stadtzentrum.","explain":"Der Text sagt, im Stadtzentrum gibt es zahlreiche Cafés und Restaurants."},
    {"q":"Wann besucht die Person den Markt?","options":["Am Wochenende","Jeden Morgen","Nie","Am Montag"],"correct":0,"hint":"Schau auf den Satz über den Markt.","explain":"Der Text sagt: Am Wochenende besuche ich oft den Markt."},
    {"q":"Was kann man in den Parks von Leipzig tun?","options":["Nur arbeiten","Spazieren gehen","Ski fahren","Am Strand liegen"],"correct":1,"hint":"Schau auf den Satz über die Parks.","explain":"Der Text sagt, man kann in den Parks spazieren gehen."},
    {"q":"Wie ist die Atmosphäre der Stadt laut Text?","options":["Unfreundlich","Freundlich","Laut","Kalt"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Der Text nennt die freundliche Atmosphäre der Stadt."},
  ],
  "Gesunde Ernährung": [
    {"q":"Wie oft sollten Obst und Gemüse gegessen werden?","options":["Einmal pro Woche","Täglich","Nur im Sommer","Selten"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Der Text sagt, Obst und Gemüse sollten täglich auf dem Speiseplan stehen."},
    {"q":"Wogegen helfen regelmäßige Mahlzeiten?","options":["Gegen Müdigkeit","Gegen Heißhunger","Gegen Stress","Gegen Krankheit"],"correct":1,"hint":"Schau auf den Satz über Mahlzeiten.","explain":"Der Text sagt, regelmäßige Mahlzeiten helfen, Heißhunger zu vermeiden."},
    {"q":"Was liefern Obst und Gemüse laut Text?","options":["Fett","Wichtige Vitamine","Zucker","Salz"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Der Text sagt, sie liefern wichtige Vitamine."},
    {"q":"Was sollte man laut Experten weniger essen?","options":["Obst und Gemüse","Zucker und Fett","Brot und Reis","Fisch und Fleisch"],"correct":1,"hint":"Schau auf den Satz über Experten.","explain":"Experten empfehlen, weniger Zucker und Fett zu essen."},
    {"q":"Was ist neben dem Essen noch wichtig für den Körper?","options":["Genug Wasser trinken","Viel schlafen","Wenig reden","Schnell essen"],"correct":0,"hint":"Schau auf den Satz über Wasser.","explain":"Der Text sagt, ausreichend Wasser zu trinken ist wichtig."},
  ],
  "Die Digitalisierung der Arbeitswelt": [
    {"q":"Was ist für viele Angestellte zur Normalität geworden?","options":["Nachtarbeit","Homeoffice","Geschäftsreisen","Überstunden"],"correct":1,"hint":"Schau auf den Satz über Angestellte.","explain":"Der Text sagt, Homeoffice ist für viele zur Normalität geworden."},
    {"q":"Was lässt die ständige Erreichbarkeit laut Kritikern verschwimmen?","options":["Die Grenze zwischen Arbeit und Freizeit","Die Löhne","Die Arbeitszeiten der Firma","Die Technik"],"correct":0,"hint":"Schau auf den Satz über Kritiker.","explain":"Der Text sagt, die Grenze zwischen Arbeit und Freizeit verschwimmt."},
    {"q":"Was möchten Unternehmen mit digitalen Werkzeugen erreichen?","options":["Weniger Gewinn","Effizientere Arbeitsprozesse","Mehr Papier","Längere Pausen"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Sie wollen Arbeitsprozesse effizienter gestalten."},
    {"q":"Wie sicher ist die langfristige Entwicklung der Arbeitswelt laut Text?","options":["Ganz sicher","Sie bleibt abzuwarten","Sie ist bereits abgeschlossen","Sie wird sich nicht ändern"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Der Text sagt, wie sich die Arbeitswelt entwickelt, bleibt abzuwarten."},
    {"q":"Welche Chance sehen Experten in der Digitalisierung?","options":["Weniger Arbeit","Innovation und Produktivität zu fördern","Höhere Steuern","Weniger Technik"],"correct":1,"hint":"Schau auf den vorletzten Satz.","explain":"Experten sehen eine Chance, Innovation und Produktivität zu fördern."},
  ],
  "Erneuerbare Energien in Deutschland": [
    {"q":"Welche zwei Energiearten spielen eine zentrale Rolle?","options":["Kohle und Öl","Wind- und Solarenergie","Gas und Atomkraft","Holz und Torf"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Der Text nennt Wind- und Solarenergie."},
    {"q":"Was empfinden manche Anwohner als störend?","options":["Die niedrigen Preise","Den Anblick und die Geräusche der Anlagen","Die saubere Luft","Die neuen Arbeitsplätze"],"correct":1,"hint":"Schau auf den Satz über Windparks.","explain":"Manche Anwohner empfinden Anblick und Geräusche als störend."},
    {"q":"Womit werden erneuerbare Energien im Text verglichen?","options":["Mit fossilen Brennstoffen","Mit Wasserkraft","Mit Kernkraft","Mit Biogas"],"correct":0,"hint":"Schau auf den zweiten Satz.","explain":"Der Text vergleicht sie mit fossilen Brennstoffen."},
    {"q":"Was ist weiterhin technisch schwierig?","options":["Der Bau von Straßen","Die Speicherung überschüssiger Energie","Die Ausbildung von Ärzten","Der Transport von Wasser"],"correct":1,"hint":"Schau auf den Satz über Speicherung.","explain":"Die Speicherung überschüssiger Energie ist eine technische Herausforderung."},
    {"q":"Wofür gilt die Energiewende als notwendig?","options":["Um die Klimaziele zu erreichen","Um Energie zu exportieren","Um Kohle zu fördern","Um Steuern zu senken"],"correct":0,"hint":"Schau auf den letzten Satz.","explain":"Die Energiewende gilt als notwendiger Schritt für die Klimaziele."},
  ],
  "Die Bedeutung der Pressefreiheit": [
    {"q":"Was ermöglicht die Pressefreiheit den Journalisten?","options":["Reich zu werden","Missstände aufzudecken und unabhängig zu informieren","Die Regierung zu kontrollieren","Werbung zu verkaufen"],"correct":1,"hint":"Schau auf den ersten Satz.","explain":"Sie ermöglicht es, Missstände aufzudecken und unabhängig zu informieren."},
    {"q":"Nenne eine Form der Einschränkung der Pressefreiheit.","options":["Kostenlose Zeitungen","Staatliche Zensur","Mehr Leser","Neue Drucktechnik"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Der Text nennt staatliche Zensur als eine Form."},
    {"q":"Wofür setzt sich Reporter ohne Grenzen ein?","options":["Für den Schutz von Medienschaffenden","Für höhere Preise","Für weniger Zeitungen","Für staatliche Kontrolle"],"correct":0,"hint":"Schau auf den Satz über die Organisation.","explain":"Die Organisation setzt sich für den Schutz von Medienschaffenden ein."},
    {"q":"Was könnte die Konzentration von Medienbesitz gefährden?","options":["Die Meinungsvielfalt","Die Druckqualität","Die Lesegeschwindigkeit","Die Werbung"],"correct":0,"hint":"Schau auf den Satz über Kritiker.","explain":"Sie könnte die Meinungsvielfalt gefährden."},
    {"q":"Was soll eine freie Presse verhindern?","options":["Machtmissbrauch","Wirtschaftswachstum","Bildung","Tourismus"],"correct":0,"hint":"Schau auf den letzten Satz.","explain":"Eine freie Presse soll Machtmissbrauch verhindern."},
  ],
  "Künstliche Intelligenz und Arbeitsmarkt": [
    {"q":"Welche Tätigkeiten könnte KI laut Befürwortern übernehmen?","options":["Nur kreative Arbeit","Repetitive und gefährliche Tätigkeiten","Alle menschlichen Aufgaben","Keine Aufgaben"],"correct":1,"hint":"Schau auf den Satz über Befürworter.","explain":"KI könnte repetitive und gefährliche Tätigkeiten übernehmen."},
    {"q":"Welche Berufsfelder könnten laut Kritikern überflüssig werden?","options":["Kunst und Musik","Verwaltung und Produktion","Sport und Freizeit","Landwirtschaft"],"correct":1,"hint":"Schau auf den Satz über Kritiker.","explain":"Der Text nennt Verwaltung und Produktion."},
    {"q":"Was gewinnen Menschen laut Befürwortern durch KI?","options":["Mehr Zeit für kreative und zwischenmenschliche Aufgaben","Mehr Geld","Weniger Urlaub","Weniger Verantwortung"],"correct":0,"hint":"Schau auf den Satz über Befürworter.","explain":"Menschen gewinnen mehr Zeit für kreative und zwischenmenschliche Aufgaben."},
    {"q":"Wovon hängt die Auswirkung der KI laut Text maßgeblich ab?","options":["Vom Wetter","Von politischen und wirtschaftlichen Weichenstellungen","Vom Zufall","Von der Bevölkerungszahl"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Es hängt von politischen und wirtschaftlichen Weichenstellungen ab."},
    {"q":"Was ist für den Übergang laut Text nötig?","options":["Weniger Bildung","Investitionen in Weiterbildung","Höhere Löhne","Mehr Maschinen"],"correct":1,"hint":"Schau auf den vorletzten Satz.","explain":"Der Übergang erfordert Investitionen in Weiterbildung."},
  ],
  "Die Krise der repräsentativen Demokratie": [
    {"q":"Worin manifestiert sich das Misstrauen unter anderem?","options":["In steigender Wahlbeteiligung","In sinkender Wahlbeteiligung und Populismus","In mehr Parteien","In höheren Steuern"],"correct":1,"hint":"Schau auf den ersten Satz.","explain":"Es manifestiert sich in sinkender Wahlbeteiligung und dem Erstarken populistischer Bewegungen."},
    {"q":"Was ist ein Beispiel für ein deliberatives Element?","options":["Bürgerräte","Wahlen abschaffen","Zensur","Mehr Werbung"],"correct":0,"hint":"Schau auf den Satz über Theoretiker.","explain":"Der Text nennt Bürgerräte als Beispiel."},
    {"q":"Was könnte laut manchen Theoretikern zu Entscheidungslähmung führen?","options":["Zu wenige Wahlen","Eine Überfrachtung mit neuen Partizipationsformen","Weniger Bürgerbeteiligung","Zu stabile Regierungen"],"correct":1,"hint":"Schau auf den Satz mit 'Andere hingegen'.","explain":"Eine Überfrachtung des Systems könnte zu Entscheidungslähmung führen."},
    {"q":"Was scheint in der fragmentierten Öffentlichkeit zu erodieren?","options":["Gemeinsame Faktengrundlagen","Die Wirtschaft","Die Bevölkerung","Die Technik"],"correct":0,"hint":"Schau auf den Satz über die mediale Öffentlichkeit.","explain":"Gemeinsame Faktengrundlagen scheinen zu erodieren."},
    {"q":"Worauf führen Politikwissenschaftler das Phänomen zurück?","options":["Auf eine einzige Ursache","Auf ein Bündel verwobener Ursachen","Auf das Wetter","Auf Zufall"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Sie führen es auf ein Bündel miteinander verwobener Ursachen zurück."},
  ],
  "Sprachwandel und Sprachpurismus": [
    {"q":"Was wollen sprachpuristische Strömungen bewahren?","options":["Eine vermeintlich reine Form der Sprache","Neue Wörter","Fremde Einflüsse","Dialekte"],"correct":0,"hint":"Schau auf den zweiten Satz.","explain":"Sie wollen eine vermeintlich reine oder ursprüngliche Form bewahren."},
    {"q":"Stellt Sprachwandel laut Linguisten einen Verfall dar?","options":["Ja, immer","Nein, keineswegs","Nur bei jungen Menschen","Nur in der Schrift"],"correct":1,"hint":"Schau auf den Satz über Linguisten.","explain":"Linguisten sagen, der Wandel stellt keineswegs einen Verfall dar."},
    {"q":"Was ist fast jede historische Sprachstufe laut Text?","options":["Das Ergebnis früherer Entlehnungs- und Wandelprozesse","Völlig unverändert","Eine reine Erfindung","Ohne Lehnwörter"],"correct":0,"hint":"Schau auf den Satz über historische Sprachstufen.","explain":"Kaum eine Sprachstufe ist nicht selbst Ergebnis früherer Prozesse."},
    {"q":"Wo existieren sprachpuristische Strömungen laut Text?","options":["Nur in Deutschland","In nahezu jeder Sprachgemeinschaft","Nur in Europa","Nirgendwo mehr"],"correct":1,"hint":"Schau auf den zweiten Satz.","explain":"Sie existieren in nahezu jeder Sprachgemeinschaft."},
    {"q":"Welche Herangehensweise bevorzugen Sprachwissenschaftler?","options":["Eine präskriptive","Eine deskriptive","Gar keine","Eine strenge"],"correct":1,"hint":"Schau auf den letzten Satz.","explain":"Sie bevorzugen eine deskriptive statt einer präskriptiven Herangehensweise."},
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
    for title, items in NEW.items():
        start = text.index('title: "%s"' % title)
        close = text.index("\n    ],", start)
        qcount = text.count("{ q: ", start, close)
        if qcount != 5:
            raise SystemExit("ABORT: '%s' has %d questions (expected 5). Already run?" % (title, qcount))
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
