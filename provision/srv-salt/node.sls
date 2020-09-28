{% set node_deb_url = 'https://deb.nodesource.com/setup_12.x' %}

node pre-install:
  pkg.installed:
    - pkgs:
      - curl
    - refresh: false

node repository:
  cmd.run:
    - name: curl -sL {{ node_deb_url }} | sudo -E bash -
    - creates:
      - /etc/apt/sources.list.d/nodesource.list
    - require:
      - node pre-install

node:
  pkg.installed:
    - pkgs:
      - nodejs
    - require:
      - node repository

npm:
  npm.installed:
    - pkgs:
      - npm
    - require:
      - node
