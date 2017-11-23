import os

def get_server_type():
    return {'server_type': os.environ.get('NODE_ENV', 'public')}
