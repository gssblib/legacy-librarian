apache remove:
  pkg.purged:
    - pkgs:
      - apache2

systemd install:
  pkg.installed:
    - pkgs:
      - systemd

run systemd:
  service.running:
    - name: systemd
    - enable: True
    - require:
      - systemd install

nginx install:
  pkg.installed:
    - pkgs:
      - nginx
      - nginx-extras
      - logrotate
    - refresh: false
    - require:
      - apache remove
      - run systemd

  file.recurse:
    - name: /etc/nginx
    - source: salt://nginx/files/nginx
    - template: jinja
    - file_mode: 0755
    - require:
        - pkg: nginx install
    - watch_in:
      - service: run nginx

run nginx:
  service.running:
    - name: nginx
    - enable: True
    - require:
      - cmd: ssl-certificates

nginx:
  cmd.run:
    - name: nginx -t
    - prereq:
      - service: run nginx

/etc/nginx/sites-enabled/forward-http.conf:
  file.symlink:
    - target: /etc/nginx/sites-available/forward-http.conf
    - force: true
    - watch_in:
      - service: run nginx

/etc/nginx/sites-enabled/node-server.conf:
  file.symlink:
    - target: /etc/nginx/sites-available/node-server.conf
    - force: true
    - watch_in:
      - service: run nginx

/etc/nginx/sites-enabled/default:
  file.absent:
    - watch_in:
      - service: run nginx

/etc/nginx/ssl-conf:
  file.directory:
    - mode: 755
    - makedirs: True

ssl-certificates:
  cmd.run:
    - name: openssl req -x509 -nodes -days 365 -newkey rsa:2048
              -subj "/C=US/ST=Massachusetts/L=Lexington/O=German Saturday School Boston/OU=Library/CN=library.gssb.org/emailAddress=librarygssb@gmail.com"
              -keyout /etc/nginx/ssl-conf/server.key
              -out /etc/nginx/ssl-conf/server.crt
    - creates:
      - /etc/nginx/ssl-conf/server.key
      - /etc/nginx/ssl-conf/server.crt
    - require:
      - file: /etc/nginx/ssl-conf
