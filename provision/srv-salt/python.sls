{% set app_path = '/opt/gssblib/librarian' %}

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
    - cwd: {{ app_path }}
    - runas: gssblib
    - creates:
      - {{ app_path }}/python-ve
    - require:
      - python-ve deps