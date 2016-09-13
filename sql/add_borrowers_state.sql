-- Adds the 'state' column to the borrowers table with default 'ACTIVE'.
--
-- Meaning of the states:
--
--   ACTIVE: Currently enrolled parents at the school that can borrow.
--   INACTIVE: Former parents or families with explicitly removed access.
--
alter table borrowers
add column state enum('ACTIVE', 'INACTIVE')
not null default 'ACTIVE';

