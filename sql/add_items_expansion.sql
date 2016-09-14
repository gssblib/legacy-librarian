-- Adds various new fields for better identification and processing.
--
ALTER TABLE items ADD COLUMN `isbn10` varchar(10);
ALTER TABLE items ADD COLUMN `isbn13` varchar(13);
ALTER TABLE items ADD COLUMN `antolin_book_id` int;
ALTER TABLE items ADD COLUMN `cover` blob;


