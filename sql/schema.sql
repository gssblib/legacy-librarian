DROP TABLE IF EXISTS borrower_emails;
DROP TABLE IF EXISTS `borrowers`;
CREATE TABLE `borrowers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `borrowernumber` int(11) NOT NULL,
  `surname` text NOT NULL,
  `firstname` text,
  `phone` varchar(15) DEFAULT NULL,
  `emailaddress` text,
  `contactname` text,
  `state` enum('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `sycamoreid` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `borrowernumber` (`borrowernumber`),
  KEY `borrowernumber_2` (`borrowernumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `latefee`;
CREATE TABLE `latefee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(20) NOT NULL,
  `borrowernumber` int(11) NOT NULL,
  `checkout_date` datetime DEFAULT NULL,
  `date_due` date DEFAULT NULL,
  `returndate` datetime DEFAULT NULL,
  `renewals` int(11) DEFAULT NULL,
  `fine_due` float DEFAULT NULL,
  `fine_paid` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `barcode` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(20) NOT NULL,
  `description` text,
  `title` text,
  `author` text,
  `subject` text,
  `isbn10` varchar(10),
  `isbn13` varchar(13),
  `publicationyear` smallint(6) DEFAULT NULL,
  `publisher` text,
  `age` text,
  `serial` int(11) DEFAULT NULL,
  `seriestitle` text,
  `classification` text,
  `itemnotes` text,
  `replacementprice` float DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `antolin` int DEFAULT NULL,
  `state` enum('CIRCULATING', 'STORED', 'DELETED', 'LOST', 'IN_REPAIR') NOT NULL DEFAULT 'CIRCULATING',
  `has_cover_image` tinyint,
  PRIMARY KEY (`id`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `barcode_2` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `out`;

CREATE TABLE `out` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(20) NOT NULL,
  `borrowernumber` int(11) DEFAULT NULL,
  `checkout_date` datetime DEFAULT NULL,
  `date_due` date NOT NULL,
  `returndate` datetime DEFAULT NULL,
  `renewals` int(11) DEFAULT NULL,
  `fine_due` float DEFAULT '0',
  `fine_paid` float DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `borrowernumber` (`borrowernumber`),
  CONSTRAINT `out_ibfk_1` FOREIGN KEY (`barcode`) REFERENCES `items` (`barcode`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `out_ibfk_2` FOREIGN KEY (`borrowernumber`) REFERENCES `borrowers` (`borrowernumber`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `issue_history`;
CREATE TABLE `issue_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `borrowernumber` int(11) DEFAULT NULL,
  `barcode` varchar(20) DEFAULT NULL,
  `checkout_date` date DEFAULT NULL,
  `date_due` date NOT NULL,
  `returndate` date DEFAULT NULL,
  `renewals` int(11) DEFAULT NULL,
  `fine_due` float DEFAULT '0',
  `fine_paid` float DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  hashed_password VARCHAR(512) NOT NULL,
  roles VARCHAR(512) NOT NULL,
  failed_login_attempts INT NOT NULL,
  primary KEY (id),
  UNIQUE KEY username (username)
) ENGINE=InnoDB DEFAULT CHARSET = utf8;


DROP TABLE IF EXISTS antolin;
CREATE TABLE antolin (
  id INT(11) NOT NULL AUTO_INCREMENT,
  author TEXT,
  title TEXT,
  publisher TEXT,
  isbn10 VARCHAR(10),
  isbn10_formatted VARCHAR(13),
  isbn13 VARCHAR(13),
  isbn13_formatted VARCHAR(17),
  book_id INT,
  available_since DATE,
  grade TEXT,
  num_read INT,
  PRIMARY KEY (id),
  UNIQUE KEY book_id (book_id)
) ENGINE=InnoDB DEFAULT CHARSET = utf8;

-- drop order table following dependencies
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_cycles;

-- Order cycles
--
-- An order cycle models the two-week cycle for online orders and pickup.
--
-- Orders (see below) are associated with an order cycle and a borrower.
-- An order can be edited by the borrower during the order window which
-- typically starts shortly after the pickup day and ends two days before
-- the next pickup day.
--
-- The order window is set when a new order cycle is created.
CREATE TABLE order_cycles (
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Beginning of the order window.
  order_window_start datetime NOT NULL,

  -- End of the order window.
  order_window_end datetime NOT NULL,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET = utf8;

-- Orders
--
-- Orders of a borrower for an order cycle. 
--
-- This table so far contains only the order identification, but we may add
-- more data such as the state of the order in the future.
CREATE TABLE orders (
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Id of the order cycle that the order belongs to
  order_cycle_id int(11) NOT NULL,

  -- Identifies the borrower ordering the items.
  borrower_id int(11) DEFAULT NULL,

  PRIMARY KEY (id),

  -- Secondary key enforcing at most one order per order cycle and borrower.
  UNIQUE KEY orders_sk (order_cycle_id, borrower_id),

  -- Borrower id must point to existing borrower.
  CONSTRAINT orders_borrowers_fk
    FOREIGN KEY (borrower_id) REFERENCES borrowers (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- Order cycle id must point to existing order cycle.
  CONSTRAINT orders_order_cycles_fk
    FOREIGN KEY (order_cycle_id) REFERENCES order_cycles (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8;

-- Ordered items
--
-- Items contained in the orders.
CREATE TABLE order_items (
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Id of the order the items belong to.
  order_id INT(11) NOT NULL,

  -- Identifies the item being ordered.
  item_id INT(11) NOT NULL,

  PRIMARY KEY (id),

  -- Order id must point to existing order.
  CONSTRAINT order_items_orders_fk
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- Item id must point to existing item.
  CONSTRAINT order_items_items_fk
    FOREIGN KEY (item_id) REFERENCES items (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE borrower_emails (
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Id of the borrower the email was sent to.
  borrower_id INT(11) NOT NULL,

  -- Email address the email was sent to (the borrower's email address
  -- may change over time).
  recipient TEXT,

  -- Time when the email was sent.
  send_time DATETIME NOT NULL,

  -- Text of the email (only plain text version).
  email_text TEXT NOT NULL,

  PRIMARY KEY (id),

  -- Borrower id must point to existing borrower, and the email
  -- data is deleted together with the borrower.
  CONSTRAINT borrower_emails_borrowers_fk
    FOREIGN KEY (borrower_id) REFERENCES borrowers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8;

