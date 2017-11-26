#!/usr/bin/python
#
# A little wrapper around mysqldump that gets the database configuration
# from the server's node.js (json) config and gzip's the dump file.

import common
import os
import sys

from argparse import ArgumentParser, ArgumentTypeError
from time import strftime
from subprocess import Popen, PIPE


def create_db_dump(db_config, dump_filename):
    """Writes the gzipped dump of the database to the file."""
    args = [
        'mysqldump',
        #'-u',
        #db_config['user'],
        #'-p%s' % db_config['password'],
        db_config['database']
        ]
    with open(dump_filename, 'wb', 0) as dump_file:
        p1 = Popen(args, stdout=PIPE)
        p2 = Popen('gzip', stdin=p1.stdout, stdout=dump_file)
    p1.stdout.close()
    p2.wait()
    p1.wait()

if __name__ == '__main__':
    if not 'NODE_ENV' in os.environ:
        print 'error: NODE_ENV environment variable is required for node config'
        sys.exit(1)

    config = common.get_json_config(os.environ['NODE_ENV'])
    db_config = config['db']

    def to_existing_dir(s):
        """Argument type function checking that 's' is an existing directory."""
        if not os.path.exists(s):
            raise ArgumentTypeError("backup_dir '%s' does not exist" % s)
        if not os.path.isdir(s):
            raise ArgumentTypeError("backup_dir '%s' is not a directory" % s)
        return s

    arg_parser = ArgumentParser(description='Create library database backup')
    arg_parser.add_argument(
        '--backup_dir',
        type=to_existing_dir,
        default=os.path.join(os.environ['HOME'], 'backups'),
        help='Backup directory (only used if --backup_file is not given.')
    arg_parser.add_argument(
        '--backup_file',
        default=None,
        help='File to write the backup to.')
    args = arg_parser.parse_args()

    backup_file = args.backup_file or os.path.join(
        args.backup_dir, 'dump-%s.sql.gz' % strftime('%Y-%m-%dT%H:%M:%S'))

    create_db_dump(db_config, backup_file)

