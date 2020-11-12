{% set app_dir = salt['grains.get']('app_dir') %}
{% set client_dir = app_dir + '/client2' %}

include:
  - git
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
    - name: |
        ng build public --prod --base-href "/" --progress false && \
        git rev-parse HEAD > .public.git-rev
    - cwd: {{ client_dir }}
    - runas: gssblib
    - unless: |
        test -e {{ client_dir }}/dist-public && \
        test -e .public.git-rev && test `git rev-parse HEAD` = `cat .public.git-rev`
    - require:
      - git install
client admin:
  cmd.run:
    - name: |
        ng build --prod --base-href "/admin/" --progress false && \
        git rev-parse HEAD > .public.git-rev
    - cwd: {{ client_dir }}
    - runas: gssblib
    - unless: |
        test -e {{ client_dir }}/dist && \
        test -e .volunteers.git-rev && test `git rev-parse HEAD` = `cat .volunteers.git-rev`
    - require:
      - git install
{% endif %}

{% if salt['grains.get']('server_type') == 'prod' %}
client public:
  cmd.run:
    - name: |
        ng build public --prod --base-href "/public/" --progress false && \
        git rev-parse HEAD > .public.git-rev
    - cwd: {{ client_dir }}
    - runas: gssblib
    - unless: |
        test -e {{ client_dir }}/dist-public && \
        test -e .public.git-rev && test `git rev-parse HEAD` = `cat .public.git-rev`
    - require:
      - git install

client prod:
  cmd.run:
    - name: |
        ng build --prod --base-href "/" --progress false && \
        git rev-parse HEAD > .volunteers.git-rev
    - cwd: {{ client_dir }}
    - runas: gssblib
    - unless: |
        test -e {{ client_dir }}/dist && \
        test -e .volunteers.git-rev && test `git rev-parse HEAD` = `cat .volunteers.git-rev`
    - require:
      - git install
{% endif %}
