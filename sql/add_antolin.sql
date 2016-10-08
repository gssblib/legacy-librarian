-- Adds new antolin table.
-- Adds the 'antolin_sticker' column to the items table with default false.
--
alter table items
add column antolin_sticker BOOLEAN
not null default false;

DROP TABLE IF EXISTS antolin;
CREATE TABLE antolin (
  id INT(11) NOT NULL AUTO_INCREMENT,
  author VARCHAR,
  title VARCHAR,
  publisher VARCHAR,
  isbn10 VARCHAR(10),
  isbn10_formatted VARCHAR(13),
  isbn13 VARCHAR(13),
  isbn13_formatted VARCHAR(17),
  book_id INT,
  available_since DATE,
  grade VARCHAR,
  num_read INT,
  PRIMARY KEY (id),
  UNIQUE KEY book_id (book_id)
) ENGINE=InnoDB DEFAULT CHARSET = utf8;
