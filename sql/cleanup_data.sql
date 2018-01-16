-- Remove all deleted CD-ROMs; they have a wrong category anyways.
DELETE FROM items WHERE category like "CD-ROM%";

-- Remove School resources. They are not part of the library.
DELETE FROM items WHERE barcode LIKE "2%";

-- Unify all age values.
UPDATE items SET age = 'All Ages' WHERE age = 'A';
UPDATE items SET age = 'All Ages' WHERE age = 'All';
UPDATE items SET age = 'K-1' WHERE age = 'K1';
UPDATE items SET age = 'K-2' WHERE age = 'K2';

-- Set age for where missing.
UPDATE items SET age = 'All Ages' WHERE barcode = '000014197';
UPDATE items SET age = 'T-12' WHERE barcode = '000011570';

-- Change "na" age.
UPDATE items SET age = 'K-2' WHERE barcode = '000011665';
UPDATE items SET age = 'K-2' WHERE barcode = '000010526';
UPDATE items SET age = 'Leseleiter-3' WHERE barcode = '000002328';

-- Remove invalid items.
DELETE FROM items WHERE barcode = '978340160';
DELETE FROM items WHERE barcode = '978347333';

-- Unify all series titles.
UPDATE items SET seriestitle = 'Conni' WHERE seriestitle = 'Conni Lesemaus serie';
UPDATE items SET seriestitle = 'Conni' WHERE seriestitle = 'Conni Lesemaus';
UPDATE items SET seriestitle = 'Durchgeblickt!' WHERE seriestitle = 'Durchgeblickt';
UPDATE items SET seriestitle = 'Fuehlen und Begreifen' WHERE seriestitle = 'Fuehlen & Begreifen';
UPDATE items SET seriestitle = 'Klar will ich das wissen!' WHERE seriestitle = 'Klar will ich das wissen';
UPDATE items SET seriestitle = 'Licht an' WHERE seriestitle = 'Licht an!';
UPDATE items SET seriestitle = 'Meyers Kleine Kinderbibliothek' WHERE seriestitle = 'Meyers Kleine Kinderbibiliothek';
UPDATE items SET seriestitle = 'Meyers Kleine Kinderbibliothek' WHERE seriestitle = 'Meyrs Kleine Kinderbibliothek';
UPDATE items SET seriestitle = 'Meyers Kleine Kinderbibliothek' WHERE seriestitle = 'Meyers kleine Kinderbibliothek';
UPDATE items SET seriestitle = 'Sehen Staunen Wissen' WHERE seriestitle = 'Sehen, Staunen, Wissen';
UPDATE items SET seriestitle = 'Sonne, Mond und Sterne' WHERE seriestitle = 'Sonne Mond und Sterne';
UPDATE items SET seriestitle = 'Spongebob Schwammkopf' WHERE seriestitle = 'Spongebob';
UPDATE items SET seriestitle = 'Tiger-Team' WHERE seriestitle = 'Tiger Team';
UPDATE items SET seriestitle = 'Tim und Struppi' WHERE seriestitle = 'Tim & Struppi';
UPDATE items SET seriestitle = 'Tim und Struppi' WHERE seriestitle = 'Tim in Amerika';
UPDATE items SET seriestitle = 'Tom Turbo' WHERE seriestitle = 'TomTurbo';
UPDATE items SET seriestitle = 'Was ist Was' WHERE seriestitle = 'Was is Was';
UPDATE items SET seriestitle = 'Wieso? Weshalb? Warum?' WHERE seriestitle = 'Wieso? Weshalb? WArum?';
UPDATE items SET seriestitle = 'Wieso? Weshalb? Warum?' WHERE seriestitle = 'Wieso? Weshlab? Warum?';
UPDATE items SET seriestitle = 'Winnie Puuh' WHERE seriestitle = 'Winnie';
UPDATE items SET seriestitle = 'Wir entdecken Komponisten' WHERE seriestitle = 'Wir endecken Komponisten';
UPDATE items SET seriestitle = 'Wissen macht Ah' WHERE seriestitle = 'Wissen mach Ah';
UPDATE items SET seriestitle = 'Pippi Langstrumpf' WHERE seriestitle = 'Pippi';
UPDATE items SET seriestitle = 'Pettersson und Findus' WHERE seriestitle = 'Petttersson und Findus';
UPDATE items SET seriestitle = 'Pettersson und Findus' WHERE seriestitle = 'Petterson';
UPDATE items SET seriestitle = 'National Geographic' WHERE seriestitle = 'National Gegraphic';
UPDATE items SET seriestitle = 'N/A' WHERE seriestitle = 'na';
UPDATE items SET seriestitle = 'N/A' WHERE seriestitle = 'n';
UPDATE items SET seriestitle = 'Muzzy German' WHERE seriestitle = 'Muzzy';
UPDATE items SET seriestitle = 'Meine Freundin Conni' WHERE seriestitle = 'Meine Freundin Connni';
UPDATE items SET seriestitle = 'Marvi Haemmer' WHERE seriestitle = 'Marvie Haemmer';
UPDATE items SET seriestitle = 'Maedchen' WHERE seriestitle = 'Mädchen';
UPDATE items SET seriestitle = 'Laterne, Laterne' WHERE seriestitle = 'Laterne Laterne';
UPDATE items SET seriestitle = 'Kommissar Kugelblitz Ratekrimi' WHERE seriestitle = 'Kommisar Kugelblitz Ratekrimi';
UPDATE items SET seriestitle = 'Kommissar Kugelblitz' WHERE seriestitle = 'Komissar Kugelblitz';
UPDATE items SET seriestitle = 'Kommissar Schlotterteich laesst nicht locker' WHERE seriestitle = 'Komissar Schlotterteich laesst nicht locker';
UPDATE items SET seriestitle = 'Kleine Kinderbibliothek' WHERE seriestitle = 'Kleine Kinderbibliotek';
UPDATE items SET seriestitle = 'Kleine Kinderbibliothek' WHERE seriestitle = 'kleine Kinderbibliothek';
UPDATE items SET seriestitle = 'Heinz Ruehmann' WHERE seriestitle = 'Heinz  Ruehmann';
UPDATE items SET seriestitle = 'Hans-Christian Andersen' WHERE seriestitle = 'Hans Christian Andersen';
UPDATE items SET seriestitle = 'Hanni und Nanni' WHERE seriestitle = 'Hanni & Nanni';
UPDATE items SET seriestitle = 'Eragon' WHERE seriestitle = 'Eragon series';
UPDATE items SET seriestitle = 'Easy Readers A' WHERE seriestitle = 'easy Readers A';
UPDATE items SET seriestitle = 'Die Teufelskicker' WHERE seriestitle = 'DieTeufelskicker';
UPDATE items SET seriestitle = 'Die Maus' WHERE seriestitle = 'Die Maus Serie';
UPDATE items SET seriestitle = 'Die Knickerbocker Bande' WHERE seriestitle = 'Die Knickerbockerbande';
UPDATE items SET seriestitle = 'Die Knickerbocker Bande' WHERE seriestitle = 'Die Knickerbocker-Bande';
UPDATE items SET seriestitle = 'Die Hafenkrokodile' WHERE seriestitle = 'Die Hafen Krokodile';
UPDATE items SET seriestitle = 'Die drei !!!' WHERE seriestitle = 'Die deii !!!';
UPDATE items SET seriestitle = 'Die drei ??? Kids' WHERE seriestitle = 'Die drei ???kids';
UPDATE items SET seriestitle = 'Die drei ??? Kids' WHERE seriestitle = 'Die  drei ??? Kids';
UPDATE items SET seriestitle = 'Die Bourne Trilogie' WHERE seriestitle = 'Die BourneTrilogie';
UPDATE items SET seriestitle = 'Der Kleine Rabe' WHERE seriestitle = 'der kleine RabeSocke';
UPDATE items SET seriestitle = 'Der Blaue Rabe' WHERE seriestitle = 'Der Blauer Rabe';
UPDATE items SET seriestitle = 'Der Blaue Rabe' WHERE seriestitle = 'Der Blaude Rabe';
UPDATE items SET seriestitle = 'Dein Spiegel' WHERE seriestitle = 'Dein Spiege';
UPDATE items SET seriestitle = 'Der ABC-Baer' WHERE seriestitle = 'Der ABC Baer';
UPDATE items SET seriestitle = 'Coolman und ich' WHERE seriestitle = 'Coolman and ich';
UPDATE items SET seriestitle = 'Caillou' WHERE seriestitle = 'Caillou9';
UPDATE items SET seriestitle = '39 Zeichen' WHERE seriestitle = '39  Zeichen';

-- Remove "00" series title.
UPDATE items SET seriestitle = 'Frag doch mal' WHERE barcode = '000010389';
UPDATE items SET seriestitle = NULL WHERE barcode = '000007950';
UPDATE items SET seriestitle = NULL WHERE barcode = '000010187';
UPDATE items SET seriestitle = NULL WHERE barcode = '000009699';

-- Title fixes.
UPDATE items SET title = 'Licht an - Tief in Meer' WHERE barcode = '000011554';
UPDATE items SET title = 'Licht an - Nachts auf dem Bauernhof' WHERE barcode = '000014189';
UPDATE items SET title = 'Kommissar Schlotterteich laesst nicht locker: Ertappt! Erwischt!' WHERE barcode = '000012561';
UPDATE items SET title = 'Kommissar Kugelblitz' WHERE barcode = '000012582';
UPDATE items SET title = 'Klassik fuer Kids - Mozart' WHERE barcode = '000014307';

-- Make "Sachkunde Serie" subject items always have "Serie" classification.
UPDATE items SET classification = 'Serie' WHERE subject LIKE "Sachkunde Serie%";

-- Leseleiter classification fixes.
UPDATE items SET classification = 'L1a' WHERE subject LIKE 'Leseleiter%' and classification = '1a';
UPDATE items SET classification = 'L1b' WHERE subject LIKE 'Leseleiter%' and classification = '1b';
UPDATE items SET classification = 'L1c' WHERE subject LIKE 'Leseleiter%' and classification = '1c';
UPDATE items SET classification = 'L1c' WHERE subject LIKE 'Leseleiter%' and
classification = '1 C';
UPDATE items SET classification = 'L2' WHERE subject LIKE 'Leseleiter%' and classification = '2';
UPDATE items SET classification = 'L3' WHERE subject LIKE 'Leseleiter%' and classification = '3';
UPDATE items SET classification = 'L4' WHERE subject LIKE 'Leseleiter%' and classification = '4';
UPDATE items SET classification = 'L5' WHERE subject LIKE 'Leseleiter%' and classification = '5';
UPDATE items SET classification = 'L6' WHERE subject LIKE 'Leseleiter%' and classification = '6';
UPDATE items SET classification = 'L7' WHERE subject LIKE 'Leseleiter%' and classification = '7';
UPDATE items SET classification = 'L8' WHERE subject LIKE 'Leseleiter%' and classification = '8';
UPDATE items SET classification = 'L9' WHERE subject LIKE 'Leseleiter%' and classification = '9';
UPDATE items SET classification = 'L10' WHERE subject LIKE 'Leseleiter%' and classification = '10';

UPDATE items SET classification = 'L1a' WHERE subject LIKE 'Leseleiter%' and classification = 'L 1a';
UPDATE items SET classification = 'L1b' WHERE subject LIKE 'Leseleiter%' and classification = 'L 1b';
UPDATE items SET classification = 'L1c' WHERE subject LIKE 'Leseleiter%' and classification = 'L 1c';
UPDATE items SET classification = 'L2' WHERE subject LIKE 'Leseleiter%' and classification = 'L 2';
UPDATE items SET classification = 'L3' WHERE subject LIKE 'Leseleiter%' and classification = 'L 3';
UPDATE items SET classification = 'L4' WHERE subject LIKE 'Leseleiter%' and classification = 'L 4';
UPDATE items SET classification = 'L5' WHERE subject LIKE 'Leseleiter%' and classification = 'L 5';
UPDATE items SET classification = 'L6' WHERE subject LIKE 'Leseleiter%' and classification = 'L 6';
UPDATE items SET classification = 'L7' WHERE subject LIKE 'Leseleiter%' and classification = 'L 7';
UPDATE items SET classification = 'L8' WHERE subject LIKE 'Leseleiter%' and classification = 'L 8';
UPDATE items SET classification = 'L9' WHERE subject LIKE 'Leseleiter%' and classification = 'L 9';
UPDATE items SET classification = 'L10' WHERE subject LIKE 'Leseleiter%' and classification = 'L 10';

UPDATE items SET classification = 'L3' WHERE subject LIKE 'Leseleiter%' and classification = 'Leseleiter 3';
UPDATE items SET classification = 'Anfaenger-L4' WHERE barcode = '000010901';
UPDATE items SET classification = 'L5' WHERE subject LIKE 'Leseleiter%' and classification = 'Serie';
UPDATE items SET classification = 'Teen' WHERE subject LIKE 'Leseleiter%' and classification = 'Teen Rei';
UPDATE items SET classification = 'L5' WHERE barcode = '000010957';
UPDATE items SET classification = 'L6' WHERE barcode = '000011747';
UPDATE items SET classification = 'L5' WHERE barcode = '000006459';
UPDATE items SET classification = 'L1b' WHERE barcode = '000000414';

UPDATE items SET classification = 'Anfaenger' WHERE barcode = '000000529';
UPDATE items SET classification = 'L5' WHERE barcode = '000002853';
UPDATE items SET classification = 'L6' WHERE barcode = '000009336';
UPDATE items SET classification = 'L6' WHERE barcode = '000010289';
UPDATE items SET classification = 'L6' WHERE barcode = '000011128';
UPDATE items SET classification = 'L6' WHERE barcode = '000011739';

-- Erzaehlung classification fixes.

--  * Convert classification "Erzaehlung" or "Erzaehlungen" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'Erz%';

--  * Convert classification "Geo - Geographie / Atlanten" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'Geo - %';

--  * Convert classification "E/G" and "E/G Erzaehlung" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'E/G%';

--  * Convert classification "Krimi" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'Krimi';

--  * Convert classification "Roman" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'Roman';

--  * Convert classification "Teenager" to first 3 letters of author.
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification LIKE 'Teenager';

--  * Convert classification "[A-Z]{3}" to first 3 letters of author effectively titling the string..
UPDATE items SET classification = left(author, 3) WHERE subject LIKE 'Erz%' AND classification REGEXP BINARY '[A-Z]{3}';

-- Comic classification fixes
UPDATE items SET classification = 'Raetsel' WHERE subject LIKE 'Comic%' and classification = 'Rae Raetsel';
UPDATE items SET classification = 'Comic' WHERE subject LIKE 'Comic%' and classification = 'Comic book';
UPDATE items SET classification = 'Comic' WHERE subject LIKE 'Comic%' and classification = 'na';
UPDATE items SET
    classification = 'Comic',
    category = 'Comic'
  WHERE subject LIKE 'Comic%' and classification = 'Buch in Comic';
UPDATE items SET
    classification = 'Comic',
    category = 'Comic'
  WHERE subject LIKE 'Comic%' and classification = 'Comic Sachkunde';
UPDATE items SET
    category = 'Comic',
    classification = 'Witze',
    seriestitle = NULL
  WHERE barcode = '000010800';
UPDATE items SET
    classification = 'Comic-Roman',
    seriestitle = NULL
  WHERE barcode = '000010778';

-- Lustiges Taschenbuch fixes.
UPDATE items SET
    title = 'Lustiges Taschenbuch - Die Wikinger Expedition',
    classification = 'Comic'
  WHERE barcode = '000004024';
UPDATE items SET
    title = 'Lustiges Taschenbuch - Mammut',
    classification = 'Comic'
  WHERE barcode = '000005193';
UPDATE items SET
    title = 'Lustiges Taschenbuch - Phantomias ist wieder da!',
    category = 'Comic',
    age = 'K-2'
  WHERE barcode = '000010503';
UPDATE items SET
    title = 'Lustiges Taschenbuch - Taschenbuch Auf Schatzsuche',
    category = 'Comic',
    seriestitle = 'Lustiges Taschenbuch',
    age = 'K-2'
  WHERE barcode = '000010505';
UPDATE items SET
    title = 'Lustiges Taschenbuch 333'
  WHERE barcode = '000010805';
UPDATE items SET
    category = 'Comic',
    seriestitle = 'Lustiges Taschenbuch'
  WHERE barcode = '000012793';
UPDATE items SET author = 'Disney, Walt' WHERE barcode = '000012793';
UPDATE items SET age = 'K-2' WHERE barcode = '000001350';
UPDATE items SET age = 'K-2' WHERE barcode = '000001350';
UPDATE items SET category = 'Comic' WHERE barcode = '000010517';
UPDATE items SET
    title = concat('Lustiges Taschenbuch - ', title),
    author = 'Disney, Walt',
    classification = 'Comic'
  WHERE subject LIKE 'Comic%' and classification LIKE 'Series';

-- Donald Duck fixes.
UPDATE items SET
    classification = 'Comic',
    author = 'Disney, Walt'
  WHERE barcode = '000014296';

-- Peanuts fixes.
UPDATE items SET
    category = 'Comic',
    classification = 'Comic'
  WHERE barcode = '000008789';
UPDATE items SET
    category = 'Comic',
    classification = 'Comic'
  WHERE barcode = '000012794';

-- Lucky Luke fixes.
UPDATE items SET classification = 'Comic'
  WHERE subject LIKE 'Comic%' and title LIKE '%Lucky Luke%';
UPDATE items SET
    title = concat('Lucky Luke - ', title),
    classification = 'Comic'
  WHERE subject LIKE 'Comic%' and classification = 'Comic Lucky Luke';
UPDATE items SET
    category = 'Comic',
    seriestitle = 'Lucky Luke'
  WHERE barcode = '000013074';

-- Gaston fixes.
UPDATE items SET
    classification = 'Comic'
  WHERE subject LIKE 'Comic%' and seriestitle = 'Gaston';

-- Welt des Wissens classification fixes.
UPDATE items SET
    classification = 'Serie',
    seriestitle = 'Welt des Wissens',
    subject = 'Sachkunde Serie - hellblau'
  WHERE barcode = '000011108';


-- Sachkunde fixes.
UPDATE items SET
    classification = 'N - Natur / Umwelt / Jahreszeiten'
  WHERE barcode = '000010456';
UPDATE items SET
    classification = 'Le - Lernen / Lexikon'
  WHERE barcode IN ('000014196', '000011743');
UPDATE items SET
    classification = 'G - Geschichte / Kulturen'
  WHERE barcode = '000004666';
UPDATE items SET
    subject = 'DVD'
  WHERE barcode = '000006691';


-- Zeitschriften
UPDATE items SET
    classification = 'Zeitschrift',
    age = 'K-2',
    author = 'na, na',
    category = 'Zeitschrift'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle LIKE 'Maedchen';
UPDATE items SET
    classification = 'Zeitschrift',
    age = 'K-2',
    author = 'na, na'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle LIKE 'Dein Spiegel';
UPDATE items SET
    classification = 'Zeitschrift',
    age = 'K-2',
    author = 'na, na',
    seriestitle = 'Dein Spiegel'
  WHERE barcode IN ('000010526', '000011875', '000011823');
UPDATE items SET
    classification = 'Zeitschrift',
    age = 'K-2',
    author = 'na, na',
    category = 'Zeitschrift',
    seriestitle = 'GEOlino'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle = 'geolino';
UPDATE items SET
    classification = 'Zeitschrift',
    age = 'K-2',
    author = 'na, na',
    category = 'Zeitschrift',
    seriestitle = 'GEOlino'
  WHERE barcode IN ('000010565', '000010753');
UPDATE items SET
    author = 'na, na',
    seriestitle = 'GEOlino'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle = 'GeoLino 2012';
UPDATE items SET
    classification = 'Zeitschrift'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle = 'National Geographic Kids';
UPDATE items SET
    age = 'K-2'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle = 'National Geographic';
UPDATE items SET
    author = 'na, na'
  WHERE subject LIKE 'Zeitschrift%' AND seriestitle = 'Star Wars';

-- Bilderbuch classifications.
UPDATE items SET
    classification = 'Ze - Zeit'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Zeit', 'Ze Zeit Bilderbuch');
UPDATE items SET
    classification = 'Za - Zahlen'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Zahlen');
UPDATE items SET
    classification = 'Ve - Verkehr / Fahrzeuge'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN (
      'Verkehr', 'VE Fahrzeuge/Verkehr', 'Ve - Verkehr',
      'Ve - Fahrzuge/Verkehr', 'Ve');
UPDATE items SET
    classification = 'Ti - Tiere'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Kleiner Braunbaer', 'Kaninchen');
UPDATE items SET
    classification = 'So - Sozialverhalten'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('So - Sozialverthalten');
UPDATE items SET
    classification = 'Serie Mey Meyers Kleine Kinderbibliothek'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN (
      'Serie Mey Meyers Kleine Kinderbibliotek',
      'Serie Meyers Kleine Kinderbibliothek',
      'Seirie Meyers kleine Kinderbibliothek');
UPDATE items SET
    classification = 'Serie Lesemaus'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Lesemaus', 'Lesemaus Serie', 'Bilderbuch/Serie/Lesemaus');
UPDATE items SET
    classification = 'Serie Lesemaus Conni'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Serie Lesemaus/Maxi/Conni', 'Conni Lesemaus serie');
UPDATE items SET
    classification = 'Serie Kokosnuss'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Serie SIE Kokosnuss', 'Kokosnuss Serie');
UPDATE items SET
    classification = 'Serie Disney'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Serie DIS Disney', 'Serie DIS');
UPDATE items SET
    classification = 'Serie Die Maus'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Die Maus Serie');
UPDATE items SET
    classification = 'Sch - Schule'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Schule', 'Sch Schule');
UPDATE items SET
    classification = 'N - Natur / Umwelt / Jahreszeiten'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Nat - Natur', 'Nat', 'Schmetterling', 'berg');
UPDATE items SET
    classification = 'Far - Farben'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Farben', 'Far', 'Far Farben', 'Bilderbuch/Farben');
UPDATE items SET
    classification = 'Fam - Familie'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Familie', 'Fam Familie', 'Fam -Familie', 'Fam', 'Bilderbuch/Familie');
UPDATE items SET
    classification = 'Dis - Disney'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('DIS Disney', 'Disney');
UPDATE items SET
    classification = 'Bb - Boardbook'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Bb', 'Bb Boardbook', 'Bb Boarbook', 'Boardbook');
UPDATE items SET
    classification = 'B/G'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('B/G Bilderbuch gross', 'Bilderbuch gross', 'Bilderbuch/gross', 'BG');
UPDATE items SET
    classification = 'B/K'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('B/K Bilderbuch Klein', 'Bilderbuch klein');
UPDATE items SET
    classification = 'B/M'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('B/M Bilderbuch mittel', 'Bilderbuch mittel');
UPDATE items SET
    classification = 'Bau - Bauernhof'
  WHERE
    subject LIKE 'Bilderbuch%' AND
    classification IN ('Bau');
UPDATE items SET
    classification = 'B/A Lin'
  WHERE barcode = '000013033';
UPDATE items SET
    classification = 'B/A Lio'
  WHERE barcode = '000005689';
UPDATE items SET
    classification = 'B/K/A Lan'
  WHERE barcode = '000007888';
UPDATE items SET
    classification = 'B/K/A Bon'
  WHERE barcode = '000012384';
UPDATE items SET
    classification = 'Serie Mey Meyers Kleine Kinderbibliothek'
  WHERE barcode = '000000611';
UPDATE items SET
    classification = 'Serie Licht an'
  WHERE barcode = '000000687';
UPDATE items SET
    classification = 'Serie Licht an'
  WHERE barcode = '000011554';
UPDATE items SET
    title = 'Kennst Du Das? - Bauernhof',
    classification = 'Serie Duden',
    seriestitle = 'Kennst Du Das?'
  WHERE barcode = '000001495';
UPDATE items SET
    title = 'Kennst Du Das? - Die Haustiere',
    classification = 'Serie Duden',
    seriestitle = 'Kennst Du Das?'
  WHERE barcode = '000012308';
UPDATE items SET
    title = 'Kennst Du Das? - Die Farben',
    classification = 'Serie Duden',
    seriestitle = 'Kennst Du Das?'
  WHERE barcode = '000013563';
UPDATE items SET
    classification = 'Dis - Disney'
  WHERE barcode = '000004393';
UPDATE items SET
    classification = 'Serie Licht an',
    seriestitle = 'Licht an'
  WHERE barcode = '000003107';
UPDATE items SET
    classification = 'So - Sozialverhalten',
    seriestitle = NULL
  WHERE barcode = '000011624';
UPDATE items SET
    classification = 'Serie'
  WHERE barcode = '000004425';
UPDATE items SET
    age = 'All Ages',
    classification = 'Serie',
    author = 'na, na'
  WHERE barcode = '000004344';
UPDATE items SET
    classification = 'Ti - Tiere',
    seriestitle = NULL
  WHERE barcode = '000009200';

-- Maerchen classifications
UPDATE items SET
    classification = 'P - Poesie'
  WHERE
    subject LIKE 'Mae%' AND
    classification IN ('Poesie', 'P Poesie', 'Poesie/Reime');
UPDATE items SET
    classification = 'Maerchen'
  WHERE
    subject LIKE 'Mae%' AND
    classification IN ('Ma - Maerchen', 'Mae', 'Märchen', 'Mae Maerchen', 'na', 'V Vorlesegeschichten');
UPDATE items SET
    classification = 'Sagen / Mythen'
  WHERE
    subject LIKE 'Mae%' AND
    classification IN ('Sagen/Mythen', 'Mae Maerchen Sagen/Mythen', 'Sagen Mythen', '2');
UPDATE items SET
    classification = 'Hoergeschichten'
  WHERE
    subject LIKE 'Mae%' AND
    classification IN ('geschichten');
