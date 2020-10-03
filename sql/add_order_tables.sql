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


