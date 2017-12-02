{% set app_dir = salt['grains.get']('app_dir') %}

include:
  - server

server daemon:
  file.managed:
    - name: /etc/supervisor/conf.d/app-server.conf
    - source: salt://server/supervisor.conf
    - template: jinja
    - file_mode: 0644
    - context:
      app_path: {{ app_dir }}
    - watch_in:
      - service: supervisor
    - require:
      - server install
