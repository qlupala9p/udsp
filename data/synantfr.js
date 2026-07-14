// French Synonyms & Antonyms (self-authored). Combines the previously
// separate data/synonymsfr.js + data/antonymsfr.js into ONE file, in the
// same structural format as data/synanten.js / data/synantde.js:
// - Single flat array, ONE entry per line, minified object literals
//   (no line breaks inside an entry), keys NOT quoted.
// - Schema: { word, level, category, definition, example, synonyms, antonyms }
//   -- note there is NO `pos` field here (unlike wordsXXfr.js), matching the
//   EN/DE synant files exactly. `level` (A1..C2) is a frequency-rank sextile
//   split (see scripts/synant_metadata.py); `category` is a topical domain
//   from scripts/classify_word_categories.py's keyword classifier, run
//   directly against this file's (already-English) `definition` gloss.
//   `synonyms`/`antonyms` are OMITTED (not
//   empty-string) whenever a word doesn't have that relation -- most
//   entries only have one of the two; words that appeared in BOTH source
//   lists (e.g. "grand" was in both the synonyms and antonyms lists) are
//   merged into a single entry carrying both fields.
// - `definition`/`example` use the SAME ";"-separated STRUCTURE as the
//   EN/DE files ("<text>;<Turkish>"), but since this file is hand-authored
//   (not run through scripts/translate_and_build_synant.py like the EN/DE
//   ones), `definition` is an English gloss of the French word (matching
//   this project's usual bilingual convention for hand-authored French
//   content), NOT a native-French dictionary definition like the EN/DE
//   files have for their own languages. Only the FILE FORMAT/schema was
//   matched here, not a full re-authoring into native French definitions.
// synonyms/antonyms are semicolon-separated when multiple values exist.
// Used by Word Morph (wordmorph.js), same as data/synanten.js / data/synantde.js.
window.SYN_ANT_FR = [
{word:"content",level:"B2",category:"Emotions",definition:"Happy, glad.;Mutlu, memnun.",example:"Elle est très contente de son nouveau travail.;Yeni işinden çok memnun.",synonyms:"joyeux; heureux"},
{word:"triste",level:"C1",category:"Emotions",definition:"Sad.;Üzgün.",example:"Il est triste depuis son départ.;Onun gidişinden beri üzgün.",synonyms:"malheureux; chagriné"},
{word:"grand",level:"A2",category:"General",definition:"Big, tall.;Büyük, uzun boylu.",example:"Ils habitent dans un grand appartement.;Büyük bir dairede oturuyorlar.",synonyms:"immense; vaste",antonyms:"petit"},
{word:"petit",level:"A1",category:"General",definition:"Small.;Küçük.",example:"Le chat est tout petit.;Kedi çok küçük.",synonyms:"minuscule; menu"},
{word:"beau",level:"A2",category:"General",definition:"Beautiful.;Güzel.",example:"C'est un beau paysage.;Bu güzel bir manzara.",synonyms:"joli; magnifique",antonyms:"laid"},
{word:"laid",level:"C2",category:"General",definition:"Ugly.;Çirkin.",example:"Ce bâtiment est vraiment laid.;Bu bina gerçekten çirkin.",synonyms:"moche; disgracieux"},
{word:"difficile",level:"B1",category:"General",definition:"Difficult.;Zor.",example:"Cet examen est difficile.;Bu sınav zor.",synonyms:"compliqué; ardu"},
{word:"facile",level:"B1",category:"General",definition:"Easy.;Kolay.",example:"Cette recette est facile à suivre.;Bu tarifi takip etmek kolay.",synonyms:"simple; aisé",antonyms:"difficile"},
{word:"important",level:"B1",category:"General",definition:"Important.;Önemli.",example:"C'est une décision importante.;Bu önemli bir karar.",synonyms:"essentiel; capital"},
{word:"intelligent",level:"C1",category:"General",definition:"Intelligent.;Zeki.",example:"Cette élève est très intelligente.;Bu öğrenci çok zeki.",synonyms:"brillant; futé"},
{word:"fort",level:"B1",category:"General",definition:"Strong.;Güçlü.",example:"Il est très fort physiquement.;O fiziksel olarak çok güçlü.",synonyms:"puissant; robuste",antonyms:"faible"},
{word:"faible",level:"C1",category:"General",definition:"Weak.;Zayıf.",example:"Après la maladie, il se sentait faible.;Hastalıktan sonra kendini zayıf hissetti.",synonyms:"fragile; frêle"},
{word:"riche",level:"C1",category:"General",definition:"Rich.;Zengin.",example:"Sa famille est très riche.;Ailesi çok zengin.",synonyms:"fortuné; aisé",antonyms:"pauvre"},
{word:"gentil",level:"B2",category:"General",definition:"Kind.;Nazik.",example:"Le voisin est très gentil.;Komşu çok nazik.",synonyms:"aimable; bienveillant",antonyms:"méchant"},
{word:"calme",level:"B2",category:"General",definition:"Calm.;Sakin.",example:"La mer est calme ce matin.;Bu sabah deniz sakin.",synonyms:"tranquille; paisible",antonyms:"agité"},
{word:"parler",level:"A1",category:"Communication",definition:"To speak / talk.;Konuşmak.",example:"Nous parlons de nos projets.;Projelerimizden bahsediyoruz.",synonyms:"discuter; converser"},
{word:"manger",level:"B1",category:"Food",definition:"To eat.;Yemek yemek.",example:"Ils mangent ensemble tous les soirs.;Her akşam birlikte yemek yiyorlar.",synonyms:"consommer; se nourrir"},
{word:"regarder",level:"B1",category:"General",definition:"To watch / look at.;İzlemek / bakmak.",example:"Elle regarde le film attentivement.;Filmi dikkatle izliyor.",synonyms:"observer; contempler"},
{word:"commencer",level:"B2",category:"General",definition:"To start.;Başlamak.",example:"Le spectacle commence à huit heures.;Gösteri saat sekizde başlıyor.",synonyms:"débuter; entamer",antonyms:"finir"},
{word:"finir",level:"B2",category:"General",definition:"To finish.;Bitirmek.",example:"Il a fini son travail tôt.;İşini erken bitirdi.",synonyms:"terminer; achever"},
{word:"aider",level:"A1",category:"General",definition:"To help.;Yardım etmek.",example:"Elle aide toujours ses amis.;O her zaman arkadaşlarına yardım eder.",synonyms:"assister; soutenir"},
{word:"chercher",level:"A2",category:"General",definition:"To look for.;Aramak.",example:"Je cherche mes clés partout.;Anahtarlarımı her yerde arıyorum.",synonyms:"rechercher; quêter"},
{word:"trouver",level:"A1",category:"General",definition:"To find.;Bulmak.",example:"Il a trouvé une solution simple.;Basit bir çözüm buldu.",synonyms:"découvrir; dénicher"},
{word:"penser",level:"B1",category:"General",definition:"To think.;Düşünmek.",example:"Je pense souvent à mes vacances.;Sık sık tatilimi düşünüyorum.",synonyms:"réfléchir; songer"},
{word:"aimer",level:"C1",category:"Emotions",definition:"To like / love.;Sevmek.",example:"Elle aime beaucoup la musique classique.;Klasik müziği çok seviyor.",synonyms:"adorer; apprécier",antonyms:"détester"},
{word:"montrer",level:"B2",category:"General",definition:"To show.;Göstermek.",example:"Il m'a montré ses photos de voyage.;Bana seyahat fotoğraflarını gösterdi.",synonyms:"indiquer; exposer"},
{word:"cacher",level:"C1",category:"General",definition:"To hide.;Gizlemek.",example:"Elle cache ses sentiments.;Duygularını gizliyor.",synonyms:"dissimuler; masquer",antonyms:"montrer"},
{word:"construire",level:"C2",category:"General",definition:"To build.;İnşa etmek.",example:"Ils construisent une nouvelle maison.;Yeni bir ev inşa ediyorlar.",synonyms:"bâtir; édifier",antonyms:"détruire"},
{word:"donner",level:"A2",category:"General",definition:"To give.;Vermek.",example:"Il donne des conseils utiles.;Faydalı tavsiyeler veriyor.",synonyms:"offrir; fournir",antonyms:"recevoir"},
{word:"arriver",level:"B1",category:"General",definition:"To arrive.;Varmak.",example:"Le train arrive à la gare.;Tren istasyona varıyor.",synonyms:"parvenir; atteindre",antonyms:"partir"},
{word:"la maison",level:"A1",category:"Household",definition:"House.;Ev.",example:"Notre maison a un grand jardin.;Evimizin büyük bir bahçesi var.",synonyms:"la demeure; le logis"},
{word:"la voiture",level:"A2",category:"Transportation",definition:"Car.;Araba.",example:"Sa voiture est neuve.;Onun arabası yeni.",synonyms:"l'automobile; le véhicule"},
{word:"le travail",level:"A2",category:"General",definition:"Work / job.;İş.",example:"Il aime son travail.;İşini seviyor.",synonyms:"l'emploi; le boulot"},
{word:"l'ami",level:"A2",category:"General",definition:"Friend.;Arkadaş.",example:"C'est mon meilleur ami.;O benim en iyi arkadaşım.",synonyms:"le camarade; le copain",antonyms:"l'ennemi"},
{word:"le problème",level:"A1",category:"General",definition:"Problem.;Sorun.",example:"Nous devons résoudre ce problème.;Bu sorunu çözmeliyiz.",synonyms:"la difficulté; l'ennui"},
{word:"l'idée",level:"A2",category:"General",definition:"Idea.;Fikir.",example:"C'est une excellente idée.;Bu mükemmel bir fikir.",synonyms:"la pensée; la notion"},
{word:"la peur",level:"A1",category:"Emotions",definition:"Fear.;Korku.",example:"Il a une peur des araignées.;Örümceklerden korkuyor.",synonyms:"la crainte; l'angoisse"},
{word:"la joie",level:"C2",category:"Emotions",definition:"Joy.;Sevinç.",example:"Quelle joie de te revoir !;Seni tekrar görmek ne büyük sevinç!",synonyms:"le bonheur; l'allégresse",antonyms:"la tristesse"},
{word:"le succès",level:"C2",category:"General",definition:"Success.;Başarı.",example:"Le film a eu un grand succès.;Film büyük başarı elde etti.",synonyms:"la réussite; le triomphe",antonyms:"l'échec"},
{word:"le début",level:"B2",category:"General",definition:"Beginning.;Başlangıç.",example:"Le début du roman est captivant.;Romanın başlangıcı sürükleyici.",synonyms:"le commencement; l'origine",antonyms:"la fin"},
{word:"la fin",level:"A2",category:"General",definition:"End.;Son.",example:"La fin du film était surprenante.;Filmin sonu şaşırtıcıydı.",synonyms:"la conclusion; le terme"},
{word:"le chemin",level:"B2",category:"General",definition:"Path / way.;Yol.",example:"Ce chemin mène à la forêt.;Bu yol ormana çıkıyor.",synonyms:"la route; le sentier"},
{word:"la ville",level:"A2",category:"General",definition:"City.;Şehir.",example:"Cette ville est très animée.;Bu şehir çok hareketli.",synonyms:"la cité; l'agglomération"},
{word:"la nourriture",level:"C1",category:"Food",definition:"Food.;Yiyecek.",example:"La nourriture ici est délicieuse.;Buradaki yiyecekler lezzetli.",synonyms:"l'alimentation; les aliments"},
{word:"le danger",level:"C1",category:"General",definition:"Danger.;Tehlike.",example:"Ce sentier présente un danger réel.;Bu patika gerçek bir tehlike içeriyor.",synonyms:"le péril; le risque"},
{word:"souvent",level:"B2",category:"General",definition:"Often.;Sık sık.",example:"Nous nous voyons souvent.;Sık sık görüşüyoruz.",synonyms:"fréquemment; régulièrement",antonyms:"rarement"},
{word:"toujours",level:"A1",category:"General",definition:"Always.;Her zaman.",example:"Il est toujours ponctuel.;O her zaman dakiktir.",synonyms:"constamment; sans cesse",antonyms:"jamais"},
{word:"vite",level:"A2",category:"General",definition:"Quickly.;Hızlı / çabuk.",example:"Viens vite, s'il te plaît !;Çabuk gel, lütfen!",synonyms:"rapidement; promptement"},
{word:"beaucoup",level:"A1",category:"General",definition:"A lot.;Çok.",example:"Il a beaucoup voyagé.;Çok seyahat etti.",synonyms:"énormément; considérablement",antonyms:"peu"},
{word:"maintenant",level:"A1",category:"General",definition:"Now.;Şimdi.",example:"Je dois partir maintenant.;Şimdi gitmem gerekiyor.",synonyms:"actuellement; à présent",antonyms:"plus tard"},
{word:"bientôt",level:"B1",category:"General",definition:"Soon.;Yakında.",example:"Nous partons bientôt en vacances.;Yakında tatile gidiyoruz.",synonyms:"prochainement; sous peu"},
{word:"aussi",level:"A1",category:"General",definition:"Also.;Ayrıca / de.",example:"Elle parle aussi espagnol.;O ayrıca İspanyolca da konuşuyor.",synonyms:"également; pareillement"},
{word:"cependant",level:"C2",category:"General",definition:"However.;Ancak.",example:"Il pleut, mais nous sortons quand même.;Yağmur yağıyor, ama yine de dışarı çıkıyoruz.",synonyms:"toutefois; néanmoins"},
{word:"enfin",level:"A2",category:"General",definition:"Finally.;Sonunda.",example:"Enfin, le train est arrivé.;Sonunda tren geldi.",synonyms:"finalement; à la fin"},
{word:"ensuite",level:"B1",category:"General",definition:"Then / next.;Sonra.",example:"D'abord on mange, ensuite on sort.;Önce yeriz, sonra çıkarız.",synonyms:"puis; après"},
{word:"presque",level:"B1",category:"General",definition:"Almost.;Neredeyse.",example:"J'ai presque fini mon travail.;İşimi neredeyse bitirdim.",synonyms:"quasiment; à peu près"},
{word:"vraiment",level:"A1",category:"General",definition:"Really.;Gerçekten.",example:"C'est vraiment gentil de ta part.;Bu senden gerçekten çok kibarca.",synonyms:"réellement; véritablement"},
{word:"facilement",level:"C2",category:"General",definition:"Easily.;Kolayca.",example:"Il apprend facilement les langues.;Dilleri kolayca öğreniyor.",synonyms:"aisément; sans peine"},
{word:"clairement",level:"C2",category:"General",definition:"Clearly.;Açıkça.",example:"Explique-moi clairement la situation.;Durumu bana açıkça anlat.",synonyms:"distinctement; nettement"},
{word:"simplement",level:"B2",category:"General",definition:"Simply.;Basitçe.",example:"Il a simplement dit non.;Basitçe hayır dedi.",synonyms:"tout bonnement; purement"},
{word:"bon",level:"A1",category:"General",definition:"Good.;İyi.",example:"Ce restaurant est très bon.;Bu restoran çok iyi.",antonyms:"mauvais"},
{word:"chaud",level:"C1",category:"General",definition:"Hot.;Sıcak.",example:"Le café est encore chaud.;Kahve hâlâ sıcak.",antonyms:"froid"},
{word:"rapide",level:"C1",category:"General",definition:"Fast.;Hızlı.",example:"Cette voiture est très rapide.;Bu araba çok hızlı.",antonyms:"lent"},
{word:"jeune",level:"A2",category:"General",definition:"Young.;Genç.",example:"Le chien est encore jeune.;Köpek hâlâ genç.",antonyms:"vieux"},
{word:"heureux",level:"B1",category:"Emotions",definition:"Happy.;Mutlu.",example:"Elle semble très heureuse aujourd'hui.;Bugün çok mutlu görünüyor.",antonyms:"malheureux"},
{word:"propre",level:"B1",category:"General",definition:"Clean.;Temiz.",example:"La cuisine est bien propre.;Mutfak oldukça temiz.",antonyms:"sale"},
{word:"plein",level:"B1",category:"General",definition:"Full.;Dolu.",example:"La bouteille est encore pleine.;Şişe hâlâ dolu.",antonyms:"vide"},
{word:"ouvert",level:"C1",category:"General",definition:"Open.;Açık.",example:"Le magasin est ouvert le dimanche.;Mağaza pazar günleri açık.",antonyms:"fermé"},
{word:"clair",level:"B2",category:"General",definition:"Bright.;Aydınlık.",example:"La pièce est très claire le matin.;Oda sabahları çok aydınlık.",antonyms:"sombre"},
{word:"large",level:"C2",category:"General",definition:"Wide.;Geniş.",example:"Cette avenue est très large.;Bu cadde çok geniş.",antonyms:"étroit"},
{word:"lourd",level:"C2",category:"General",definition:"Heavy.;Ağır.",example:"Cette valise est trop lourde.;Bu bavul çok ağır.",antonyms:"léger"},
{word:"cher",level:"B2",category:"General",definition:"Expensive.;Pahalı.",example:"Cet hôtel est trop cher pour nous.;Bu otel bizim için çok pahalı.",antonyms:"bon marché"},
{word:"simple",level:"B2",category:"General",definition:"Simple.;Basit.",example:"La solution est en fait très simple.;Çözüm aslında çok basit.",antonyms:"compliqué"},
{word:"monter",level:"C1",category:"General",definition:"To go up.;Çıkmak.",example:"Nous montons les escaliers ensemble.;Merdivenleri birlikte çıkıyoruz.",antonyms:"descendre"},
{word:"entrer",level:"B1",category:"General",definition:"To enter.;Girmek.",example:"Il entre dans la salle en silence.;Odaya sessizce giriyor.",antonyms:"sortir"},
{word:"acheter",level:"B2",category:"General",definition:"To buy.;Satın almak.",example:"Nous allons acheter une nouvelle voiture.;Yeni bir araba satın alacağız.",antonyms:"vendre"},
{word:"gagner",level:"B2",category:"General",definition:"To win.;Kazanmak.",example:"Notre équipe a gagné le match.;Takımımız maçı kazandı.",antonyms:"perdre"},
{word:"ouvrir",level:"C1",category:"General",definition:"To open.;Açmak.",example:"Peux-tu ouvrir la fenêtre ?;Pencereyi açabilir misin?",antonyms:"fermer"},
{word:"accepter",level:"C1",category:"General",definition:"To accept.;Kabul etmek.",example:"Elle a accepté notre invitation.;Davetimizi kabul etti.",antonyms:"refuser"},
{word:"se souvenir",level:"C2",category:"General",definition:"To remember.;Hatırlamak.",example:"Je me souviens bien de ce jour.;O günü iyi hatırlıyorum.",antonyms:"oublier"},
{word:"réussir",level:"C2",category:"General",definition:"To succeed.;Başarmak.",example:"Elle a réussi tous ses examens.;Tüm sınavlarını başardı.",antonyms:"échouer"},
{word:"permettre",level:"C2",category:"General",definition:"To allow.;İzin vermek.",example:"Le règlement permet les visites le soir.;Yönetmelik akşam ziyaretlerine izin veriyor.",antonyms:"interdire"},
{word:"augmenter",level:"C2",category:"General",definition:"To increase.;Artırmak.",example:"Les prix augmentent chaque année.;Fiyatlar her yıl artıyor.",antonyms:"diminuer"},
{word:"attaquer",level:"C2",category:"General",definition:"To attack.;Saldırmak.",example:"L'armée a attaqué à l'aube.;Ordu şafak vakti saldırdı.",antonyms:"défendre"},
{word:"rire",level:"C1",category:"General",definition:"To laugh.;Gülmek.",example:"Les enfants rient dans le jardin.;Çocuklar bahçede gülüyor.",antonyms:"pleurer"},
{word:"se lever",level:"C2",category:"General",definition:"To get up.;Kalkmak.",example:"Je me lève tôt tous les jours.;Her gün erken kalkıyorum.",antonyms:"se coucher"},
{word:"économiser",level:"C2",category:"General",definition:"To save (money).;Biriktirmek.",example:"Elle économise pour ses vacances.;Tatili için para biriktiriyor.",antonyms:"dépenser"},
{word:"le jour",level:"A1",category:"General",definition:"Day.;Gündüz.",example:"Il travaille le jour et étudie le soir.;Gündüz çalışıyor, akşam ders çalışıyor.",antonyms:"la nuit"},
{word:"la guerre",level:"B1",category:"Military",definition:"War.;Savaş.",example:"Cette région a connu la guerre pendant des années.;Bu bölge yıllarca savaş yaşadı.",antonyms:"la paix"},
{word:"la vérité",level:"A2",category:"General",definition:"Truth.;Gerçek.",example:"Il faut toujours dire la vérité.;Her zaman gerçeği söylemek gerekir.",antonyms:"le mensonge"},
{word:"le nord",level:"C1",category:"General",definition:"North.;Kuzey.",example:"Nous voyageons vers le nord cet été.;Bu yaz kuzeye seyahat ediyoruz.",antonyms:"le sud"},
{word:"l'est",level:"A1",category:"General",definition:"East.;Doğu.",example:"Le soleil se lève à l'est.;Güneş doğudan doğar.",antonyms:"l'ouest"},
{word:"la question",level:"A2",category:"General",definition:"Question.;Soru.",example:"C'est une question difficile.;Bu zor bir soru.",antonyms:"la réponse"},
{word:"ici",level:"A1",category:"General",definition:"Here.;Burada.",example:"Viens ici, s'il te plaît.;Buraya gel, lütfen.",antonyms:"là-bas"},
{word:"tôt",level:"B2",category:"General",definition:"Early.;Erken.",example:"Elle se réveille tôt chaque matin.;Her sabah erken uyanır.",antonyms:"tard"},
{word:"dedans",level:"C1",category:"General",definition:"Inside.;İçeride.",example:"Il fait froid, restons dedans.;Hava soğuk, içeride kalalım.",antonyms:"dehors"},
{word:"dessus",level:"B1",category:"General",definition:"Above / on top.;Üstünde.",example:"Mets le livre dessus la table.;Kitabı masanın üstüne koy.",antonyms:"dessous"},
{word:"devant",level:"A2",category:"General",definition:"In front.;Önünde.",example:"Elle attend devant la porte.;Kapının önünde bekliyor.",antonyms:"derrière"},
{word:"avant",level:"A1",category:"General",definition:"Before.;Önce.",example:"Réfléchis avant de parler.;Konuşmadan önce düşün.",antonyms:"après"},
];
