{% set app_path = '/opt/gssblib/librarian' %}
{% set pip = app_path + '/python-ve/bin/pip' %}

scripts install:
  cmd.run:
    - name: {{ pip}} install -r scripts/requirements.txt
    - cwd: {{ app_path }}
    - runas: gssblib
    - require:
      - python-ve