-- Adds the 'antolin' column to the items table with default false.
--
alter table items
add column antolin BOOLEAN
not null default false;

