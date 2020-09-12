import argparse
import getpass
import pymysql

class ItemNotFoundException(Exception):
    pass

class ItemNotUniqueException(Exception):
    pass

#Will search for a single row which matches the parameters given in id_dict.
#If such a single row exists, then its columns will be updated using update_dict.
#If multiple rows exist, an exception will be raised.
#If no rows exist, then a new item will be created using id_dict, create_only_dict, and update_dict.
#Note that create_only_dict is optional and will only be used if a new item is created.
def update_or_create(cursor, table, id_dict, update_dict, create_only_dict={}, pk_name="id"):

    where_clause= "WHERE " + (" AND ".join([ str(k) + "=%(" + k + ")s" for k in id_dict.keys()]))
    query = "SELECT * FROM " + table + " " + where_clause + " LIMIT 2" #we're expecting one row. Ask for 2. if we get 2, the query is too broad.

    cursor.execute(query, id_dict)
    rows = cursor.fetchmany(size=2)
    if len(rows)==0:
        #item doesn't exist yet.
        final_dict = id_dict.copy()
        final_dict.update(update_dict)
        final_dict.update(create_only_dict)
        query = "INSERT INTO " + table + "(" + ",".join(final_dict.keys()) + ")"\
                " VALUES (" + ",".join(["%(" + k + ")s" for k in final_dict.keys()]) + ")" 

        cursor.execute(query, final_dict)

    elif len(rows)>=2:
        raise ItemNotUniqueException("Found more than 1 item matching this query dict: " + str(id_dict))
    else:
        #we found one item. proceed to update it. We refer to the item via its pk which is "id"
        #throughout our entire system.
        item = rows[0]
        assert(isinstance(item, dict))

        if pk_name in update_dict:
            raise ValueError("You can't update the primary key!")
        
        query = "UPDATE " + table + " SET " + ", ".join([ str(k) + "=%(" + k + ")s" for k in update_dict.keys()]) + " WHERE " + pk_name + "=%(id)s"
        final_dict=update_dict.copy()
        final_dict[pk_name]=item[pk_name]
        cursor.execute(query, final_dict)


def init_connection(parsed_args):
    if not parsed_args.password:
        parsed_args.password = getpass.getpass()

    conn = pymysql.connect(
        user=parsed_args.username,
        password=parsed_args.password,
        database=parsed_args.database,
        charset='utf8',
        cursorclass=pymysql.cursors.DictCursor)

    return conn


def getArgParser(parents=[],add_help=True):
    parser = argparse.ArgumentParser(description='DB Connection Params', parents=parents, add_help=add_help)

    parser.add_argument('-d', '--database', dest='database', default='spils',
                    help='The database to store the data in.')
    parser.add_argument('-u', '--username', dest='username', default='gssb',
                    help='The username for the database.')
    parser.add_argument('-p', '--password', dest='password',
                    help='The password for the database.')

    #todo, alternatively provide an ENV and parse this from file.

    return parser
