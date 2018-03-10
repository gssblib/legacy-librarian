base:
  '*':
    - database
    - node
    - server
    - client

  'server_type:prod':
    - match: grain
    - git
    - supervisor
    - server/supervisor
    - python
    - printers
    - labels
    - labels/supervisor
    - scripts

  'server_type:public':
    - match: grain
    - supervisor
    - server/supervisor
    - nginx

  'server_type:dev':
    - match: grain
    - python
    - labels
    - scripts
