{% set app_path = '/opt/gssblib/librarian/labels' %}
{% set pip = '/opt/gssblib/librarian/python-ve/bin/pip' %}

include:
  - python
  - supervisor

labels install:
  cmd.run:
    - name: |
        {{ pip }} install -r requirements.txt && \
        md5sum requirements.txt > .md5sums
    - cwd: {{ app_path }}
    - require:
      - python-ve
    - unless: 'test -e .md5sums && md5sum --strict --status -c .md5sums'

labels daemon:
  file.managed:
    - name: /etc/supervisor/conf.d/labels.conf
    - source: salt://labels/supervisor.conf
    - template: jinja
    - file_mode: 0644
    - context:
      app_path: /opt/gssblib/librarian
    - watch_in:
      - service: supervisor
    - require:
      - labels install
