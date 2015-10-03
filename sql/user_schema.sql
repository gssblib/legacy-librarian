drop table if exists users;
create table users (
  id int(11) not null auto_increment,
  username varchar(64) not null,
  hashed_password varchar(512) not null,
  roles varchar(512) not null,
  failed_login_attempts int not null,
  primary key (id),
  unique key username (username)
) engine=InnoDB default charset = utf8;
