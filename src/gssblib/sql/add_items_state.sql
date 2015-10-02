-- Adds the 'state' column to the items table with default 'CIRCULATING'.
--
-- Meaning of the states:
--
--   CIRCULATING: item is circulating (the normal case)
--   STORED: item is in storage
--   DELETED: item has been deleted
--   LOST: item was lost
--
-- Only CIRCULATING items can be checked out.
--
alter table items
add column state enum('CIRCULATING', 'STORED', 'DELETED', 'LOST')
not null default 'CIRCULATING';

