ALTER TABLE items DROP COLUMN antolin;
ALTER TABLE items DROP COLUMN antolin_book_id;
ALTER TABLE items DROP COLUMN antolin_sticker;
ALTER TABLE items DROP COLUMN cover;
ALTER TABLE items ADD COLUMN antolin int DEFAULT NULL;

UPDATE items, antolin
  SET items.antolin = antolin.book_id
  WHERE
    (items.isbn10 IS NOT NULL and items.isbn10 = antolin.isbn10)
    OR
    (items.isbn13 IS NOT NULL and items.isbn13 = antolin.isbn13)
;
