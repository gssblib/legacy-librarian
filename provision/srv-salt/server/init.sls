{% set app_dir = salt['grains.get']('app_dir') %}
{% set server_dir = app_dir + '/server' %}
{% set config_dir = app_dir + '/config' %}
{% set server_type = salt['grains.get']('server_type') %}

include:
  - node

server install:
  cmd.run:
    - name: |
        npm install && \
        md5sum package.json > .md5sums
    - cwd: {{ server_dir }}
    - runas: gssblib
    - require:
      - npm
    - unless: |
        test -e node_modules && \
        test -e .md5sums && md5sum --strict --status -c .md5sums

server config:
  file.managed:
    - name: {{ config_dir }}/{{ server_type }}.json
    - source: salt://server/{{ server_type }}.json
    - user: gssblib
    - template: jinja
    - file_mode: 0644
    - context:
      root_path: {{ app_dir }}
