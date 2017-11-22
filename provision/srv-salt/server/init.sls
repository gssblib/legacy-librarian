{% set app_path = '/opt/gssblib/librarian' %}

server install:
  npm.bootstrap:
    - name: {{ app_path }}/server
    - user: gssblib
    - require:
      - npm
    - onlyif: 'test ! -e {{ app_path }}/server/node_modules'
  file.recurse:
    - name: {{ app_path }}/config
    - source: salt://server/files/
    - user: gssblib
    - template: jinja
    - file_mode: 0644
