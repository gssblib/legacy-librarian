{% set app_path = '/opt/gssblib/librarian' %}

mysql install:
  pkg.installed:
    - pkgs:
      - mysql-server
      - python-mysqldb
    - refresh: false

mysql run:
  service.running:
    - name: mysql
    - enable: True
    - require:
      - pkg: mysql install

spils db:
  mysql_database.present:
    - name: spils
    - require:
      - service: mysql run

spils db schema:
  mysql_query.run_file:
    - database: spils
    - query_file: {{ app_path }}/sql/schema.sql
    - onchanges:
      - spils db

gssb user:
  mysql_user.present:
    - name: gssb
    - host: localhost
    # Obtained using: mysql> select password('gssblib');
    - password_hash: "*2C7BF760C7D399A11AE5146CF10D4B55C570F386"
    - require:
      - service: mysql run
  mysql_grants.present:
    - database: spils.*
    - grant: ALL PRIVILEGES
    - user: gssb
    - require:
      - service: mysql run
      - spils db
