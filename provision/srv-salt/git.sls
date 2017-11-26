{% set app_dir = salt['grains.get']('app_dir') %}

git install:
  pkg.installed:
    - pkgs:
      - git
    - refresh: false

git user email config:
  git.config_set:
    - name: user.email
    - value: "library-gssb@gmail.com"
    - repo: {{ app_dir }}
    - user: gssblib

git user name config:
  git.config_set:
    - name: user.name
    - value: GSSB Library
    - repo: {{ app_dir }}
    - user: gssblib

git push.default config:
  git.config_set:
    - name: push.default
    - value: simple
    - repo: {{ app_dir }}
    - user: gssblib

