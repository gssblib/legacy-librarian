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

#gssblib ssh key:
#  cmd.run:
#    - name: |
#        ssh-keygen -q -t rsa -b 4096 \
#          -N "{{ salt['grains.get_or_set_hash']('ssh.passphrase') }}"
#          -C "librarygssb@gmail.com" \
#          -f ~/.ssh/id_rsa
#    - runas: gssblib
#    - unless: test -f ~/.ssh/id_rsa

#gssblib ssh-agent add key:
#  cmd.run:
#    - name: ssh-agent -s && ssh-add ~/.ssh/id_rsa
#    - runas: gssblib

{% if salt['grains.get']('github.password') %}
gssblib ssh key github creation:
  cmd.run:
    - name: |
        curl -u "gssb-library:{{ salt['grains.get']('github.password') }}" \
        --data "{\"title\":\"Server Key\", \"key\":\"$(cat ~/.ssh/id_rsa.pub)\"}" \
        https://api.github.com/user/keys
    - runas: gssblib
{% endif %}

gssblib clone:
  git.latest:
    - target: {{ salt['grains.get']('app_dir') }}
    - name: https://github.com/gssblib/librarian.git
    - user: gssblib
    - force_clone: True
    - force_checkout: True
    - force_reset: True
    - require:
      - git install
