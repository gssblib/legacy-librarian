{% set app_path = '/opt/gssblib/librarian' %}
{% set pip = app_path + '/python-ve/bin/pip' %}

labels install:
  cmd.run:
    - name: {{ pip}} install -r labels/requirements.txt
    - cwd: {{ app_path }}
    - require:
      - python-ve