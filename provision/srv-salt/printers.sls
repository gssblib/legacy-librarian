
printer drivers:
  pkg.installed:
    - pkgs:
      - printer-driver-dymo
    - refresh: false

#printer single:
#  cmd.run:
#    - name: |
#        lpadmin \
#          -p 'LabelWriter-450-Turbo' \
#          -v 'usb://...' \
#          -m 'LabelWriter-450-Turbo' \
#          -P '/usr/share/ppd/...' \
#          -L 'server'
#    - require:
#      - printer drivers
#
#printer twin:
#  cmd.run:
#    - name: |
#        lpadmin \
#          -p 'LabelWriter-450-Twin-Turbo' \
#          -v 'socket://192.168.1.9' \
#          -m 'LabelWriter-450-Twin-Turbo' \
#          -P '/usr/share/ppd/...' \
#          -L 'server'
#    - require:
#      - printer drivers
