{% set app_dir = salt['grains.get']('app_dir') %}
{% set labels_dir = app_dir + '/labels' %}
{% set pip = app_dir + '/python-ve/bin/pip' %}

include:
  - python

labels install:
  cmd.run:
    - name: |
        {{ pip }} install -r requirements.txt && \
        md5sum requirements.txt > .md5sums
    - cwd: {{ labels_dir }}
    - require:
      - python-ve
    - unless: 'test -e .md5sums && md5sum --strict --status -c .md5sums'
