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
    - labels
    - scripts

  'server_type:public':
    - match: grain
    - nginx
