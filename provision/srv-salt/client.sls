{% set app_dir = salt['grains.get']('app_dir') %}
{% set client_dir = app_dir + '/client2' %}

include:
  - node

# We cannot use npm.installed here since it does
# not handle package names with @ signs properly.
angular/cli:
  cmd.run:
    - name: "npm install --global @angular/cli"
    - require:
      - node
    - unless: "npm list --global --depth 0|grep -q @angular/cli" 

# We cannot use npm.bootstrap, since it will always run. :-(
client:
  cmd.run:
    - name: |
        npm install && \
        md5sum package.json > .md5sums
    - cwd: {{ client_dir }}
    - runas: gssblib
    - require:
      - npm
      - angular/cli
    - unless: |
        test -e node_modules && \
        test -e .md5sums && md5sum --strict --status -c .md5sums

{% if salt['grains.get']('server_type') == 'public' %}
client public:
  cmd.run:
    - name: ng build --app public --base-href "/"
    - cwd: {{ client_dir }}
    - runas: gssblib
    - creates:
      - {{ client_dir }}/dist-public
{% endif %}

{% if salt['grains.get']('server_type') == 'prod' %}
client public:
  cmd.run:
    - name: ng build --app public --base-href "/public/"
    - cwd: {{ client_dir }}
    - runas: gssblib
    - creates:
      - {{ client_dir }}/dist-public

client prod:
  cmd.run:
    - name: ng build --base-href "/volunteers/"
    - cwd: {{ client_dir }}
    - runas: gssblib
    - creates:
      - {{ client_dir }}/dist
{% endif %}
