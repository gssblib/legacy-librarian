base:
  '*':
    - supervisor
    - database
    - node
    - server
    - client

  'server_type:prod':
    - match: grain
    - python
    - printers
    - labels
    - scripts
    - old-client

  'server_type:public':
    - match: grain
    - nginx
