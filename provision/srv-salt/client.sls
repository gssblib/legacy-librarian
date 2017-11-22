{% set app_path = '/opt/gssblib/librarian/client2' %}

angular/cli:
  npm.installed:
    - name: "@angular/cli"
    - require:
      - node

client:
  npm.bootstrap:
    - name: {{ app_path }}
    - user: gssblib
    - require:
      - npm
      - angular/cli
    - onlyif: 'test ! -e {{ app_path }}/node_modules'
