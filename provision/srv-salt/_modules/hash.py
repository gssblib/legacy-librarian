from hashlib import sha1

def get_mysql_password_hash(password):
    '''
    Create a proper MySQL password hash.

    CLI Example::

        salt '*' hash.get_mysql_password_hash password
    '''
    return "*" + sha1(sha1(password).digest()).hexdigest().upper()
