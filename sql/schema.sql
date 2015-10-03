DROP TABLE IF EXISTS `borrowers`;
CREATE TABLE `borrowers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `borrowernumber` int(11) NOT NULL,
  `cardnumber` varchar(16) NOT NULL,
  `surname` text NOT NULL,
  `firstname` text,
  `streetaddress` text,
  `city` text,
  `zipcode` varchar(25) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `emailaddress` text,
  `emailaddress_2` text,
  `contactname` text,
  `debarred` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `borrowernumber` (`borrowernumber`),
  UNIQUE KEY `cardnumber` (`cardnumber`),
  KEY `borrowernumber_2` (`borrowernumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `latefee`;
CREATE TABLE `latefee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(20) NOT NULL,
  `borrowernumber` int(11) NOT NULL,
  `checkout_date` date DEFAULT NULL,
  `date_due` date DEFAULT NULL,
  `returndate` date DEFAULT NULL,
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
  `publicationyear` smallint(6) DEFAULT NULL,
  `publishercode` text,
  `age` text,
  `media` varchar(25) DEFAULT NULL,
  `serial` int(11) DEFAULT NULL,
  `seriestitle` text,
  `classification` text,
  `country` text,
  `itemnotes` text,
  `replacementprice` float DEFAULT NULL,
  `issues` int(11) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `itemlost` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `barcode_2` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `out`;

CREATE TABLE `out` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(20) NOT NULL,
  `borrowernumber` int(11) DEFAULT NULL,
  `checkout_date` date DEFAULT NULL,
  `date_due` date NOT NULL,
  `returndate` date DEFAULT NULL,
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


