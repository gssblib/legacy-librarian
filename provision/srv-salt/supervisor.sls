supervisor install:
  pkg.installed:
    - pkgs:
      - supervisor
    - refresh: false

supervisor:
  service.running:
    - name: supervisor
    - enable: True
    - require:
      - supervisor install
