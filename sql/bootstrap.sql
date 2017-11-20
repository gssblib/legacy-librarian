CREATE USER IF NOT EXISTS 'gssb'@'localhost' IDENTIFIED BY 'gssblib';
CREATE DATABASE IF NOT EXISTS spils;
GRANT ALL ON spils.* TO 'gssb'@'localhost';
