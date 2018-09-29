alter table `items` modify column state enum('CIRCULATING','STORED','DELETED','LOST','IN_REPAIR') not null default 'CIRCULATING';
