{% set app_dir = salt['grains.get']('app_dir') %}
{% set pub_user = salt['grains.get']('public.user') %}
{% set pub_pw = salt['grains.get']('public.password') %}
{% set pub_server = salt['grains.get']('public.server') %}
{% set pub_app_dir = salt['grains.get']('public.app_dir') %}

sshpass install:
  pkg.installed:
    - pkgs:
      - sshpass
    - refresh: false

rsync covers:
  cmd.run:
    - name: |
        sshpass -p "$SSHPASS" \
        rsync -avz ./covers {{ pub_user }}@{{ pub_server }}:{{ pub_app_dir }}/covers
    - cwd: {{ app_dir }}
    - runas: {{ salt['file.get_user'](app_dir) }}
    - env:
      - SSHPASS: {{ pub_pw }}
    - require:
      - sshpass install

make backup:
  cmd.run:
    - name: make backup
    - cwd: {{ app_dir }}
    - runas: {{ salt['file.get_user'](app_dir) }}

transfer backup:
  cmd.run:
    - name: |
        sshpass -p "$SSHPASS" \
        scp $(ls -t1 backups/dump* | head -1) \
          {{ pub_user }}@{{ pub_server }}:{{ pub_app_dir }}/backups
    - cwd: {{ app_dir }}
    - runas: {{ salt['file.get_user'](app_dir) }}
    - env:
      - SSHPASS: {{ pub_pw }}
    - require:
      - sshpass install
      - make backup

apply backup:
  cmd.run:
    - name: |
        sshpass -p "$SSHPASS" \
        ssh {{ pub_user }}@{{ pub_server }} \
          'zcat $(ls -t1 {{ pub_app_dir }}/backups/dump*| head -1) | mysql spils'
    - runas: {{ salt['file.get_user'](app_dir) }}
    - env:
      - SSHPASS: {{ pub_pw }}
    - require:
      - sshpass install
      - transfer backup
