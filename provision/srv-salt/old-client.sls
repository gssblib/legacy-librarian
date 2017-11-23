{% set app_path = '/opt/gssblib/librarian/client' %}

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
    - cwd: {{ app_path }}
    - runas: gssblib
    - require:
      - npm
    - unless: |
        test -e node_modules && \
        test -e .md5sums && md5sum --strict --status -c .md5sums
