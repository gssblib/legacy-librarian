{% set root_path = '/opt/gssblib/librarian' %}
{% set app_path = root_path + '/server' %}
{% set config_path = root_path + '/config' %}

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

server daemon:
  file.managed:
    - name: /etc/supervisor/conf.d/app-server.conf
    - source: salt://server/supervisor.conf
    - template: jinja
    - file_mode: 0644
    - context:
      app_path: /opt/gssblib/librarian
    - watch_in:
      - service: supervisor
    - require:
      - server install

{% if salt['grains.get']('server_type') == 'public' %}
server config:
  file.managed:
    - name: {{ config_path }}/public.json
    - source: salt://server/public.json
    - user: gssblib
    - template: jinja
    - file_mode: 0644
{% endif %}

{% if salt['grains.get']('server_type') == 'prod' %}
server config:
  file.managed:
    - name: {{ config_path }}/prod.json
    - source: salt://server/prod.json
    - user: gssblib
    - template: jinja
    - file_mode: 0644
    - context:
      root_path: {{ root_path }}
{% endif %}