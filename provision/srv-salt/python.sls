{% set app_dir = salt['grains.get']('app_dir') %}

python-ve deps:
  pkg.installed:
    - pkgs:
      - python
      - python-dev
      - virtualenv
    - refresh: false

python-ve:
  cmd.run:
    - name: virtualenv python-ve
    - cwd: {{ app_dir }}
    - runas: gssblib
    - creates:
      - {{ app_dir }}/python-ve
    - require:
      - python-ve deps