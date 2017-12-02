select barcode, subject, classification from items where
    subject like 'Sachkunde%' and
    classification not in (
    'B - Biographie',
    'Ba - Basteln / Handarbeit',
    'Be - Beschäftigung / Spielen',
    'Ber - Berufe',
    'De - Deutsche Geschichte',
    'Es - Essen / Kochen',
    'G - Geschichte / Kulturen',
    'Geo - Geographie / Atlanten',
    'Kl - Klassik',
    'Ku - Kunst / Architektur',
    'Kö - Körper',
    'Le - Lernen / Lexikon',
    'M - Musik / Liederbuch',
    'N - Natur / Umwelt / Jahreszeiten',
    'R - Religion',
    'Sp - Sport',
    'Te - Technik',
    'Ti - Tiere',
    'Ve - Verkehr / Fahrzeuge',
    'Wir - Wirtschaft',
    'Wo - Wohnen');
