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

-- Leseleiter classification fixes
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
