
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


