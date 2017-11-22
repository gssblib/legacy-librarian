{% set app_path = '/opt/gssblib/librarian/server' %}
{% set config_path = '/opt/gssblib/librarian/config' %}

include:
  - node

server install:
  cmd.run:
    - name: |
        npm install && \
        md5sum package.json > .md5sums
    - cwd: {{ app_path }}
    - runas: gssblib
    - require:
      - npm
    - unless: |
        test -e node_modules && \
        test -e .md5sums && md5sum --strict --status -c .md5sums

  file.recurse:
    - name: {{ config_path }}
    - source: salt://server/files/
    - user: gssblib
    - template: jinja
    - file_mode: 0644
