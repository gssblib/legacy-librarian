{% set app_dir = salt['grains.get']('app_dir') %}

include:
  - labels

labels daemon:
  file.managed:
    - name: /etc/supervisor/conf.d/labels.conf
    - source: salt://labels/supervisor.conf
    - template: jinja
    - file_mode: 0644
    - context:
      app_path: {{ app_dir }}
    - watch_in:
      - service: supervisor
    - require:
      - labels install
