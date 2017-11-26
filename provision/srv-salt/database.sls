{% set app_dir = salt['grains.get']('app_dir') %}

mysql password:
  debconf.set:
    - name: mysql-server
    - data:
        mysql-server/root_password:
          type: string
          value: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}
        mysql-server/root_password_again:
          type: string
          value: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}

mysql install:
  pkg.installed:
    - pkgs:
      - mysql-server
      - python-mysqldb
    - refresh: false
    - require:
      - mysql password

mysql run:
  service.running:
    - name: mysql
    - enable: True
    - require:
      - pkg: mysql install

spils db:
  mysql_database.present:
    - name: spils
    - connection_user: root
    - connection_pass: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}
    - require:
      - service: mysql run

spils db schema:
  mysql_query.run_file:
    - database: spils
    - query_file: {{ app_dir }}/sql/schema.sql
    - connection_user: root
    - connection_pass: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}
    - onchanges:
      - spils db

gssb user:
  mysql_user.present:
    - name: gssb
    - host: localhost
    - password_hash: "{{
        salt['hash.get_mysql_password_hash'](
            salt['grains.get_or_set_hash']('mysql.gssb.password')
        )
      }}"
    - connection_user: root
    - connection_pass: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}
    - require:
      - service: mysql run
  mysql_grants.present:
    - database: spils.*
    - grant: ALL PRIVILEGES
    - user: gssb
    - connection_user: root
    - connection_pass: {{ salt['grains.get_or_set_hash']('mysql.root.password') }}
    - require:
      - service: mysql run
      - spils db
