{% set app_dir = salt['grains.get']('app_dir') %}
{% set client_dir = app_dir + '/client' %}

include:
  - node

grunt:
  npm.installed: []

# We cannot use npm.bootstrap, since it will always run. :-(
old-client:
  cmd.run:
    - name: |
        npm install && \
        grunt bower:install && \
        md5sum package.json Gruntfile.js bower.json > .md5sums
    - cwd: {{ client_dir }}
    - runas: gssblib
    - require:
      - npm
    - unless: |
        test -e node_modules && \
        test -e .md5sums && md5sum --strict --status -c .md5sums
