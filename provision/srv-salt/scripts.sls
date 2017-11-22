{% set app_path = '/opt/gssblib/librarian/scripts' %}
{% set pip = '/opt/gssblib/librarian/python-ve/bin/pip' %}

include:
  - python

scripts install:
  cmd.run:
    - name: |
        {{ pip }} install -r requirements.txt && \
        md5sum requirements.txt > .md5sums
    - cwd: {{ app_path }}
    - require:
      - python-ve
    - unless: 'test -e .md5sums && md5sum --strict --status -c .md5sums'
