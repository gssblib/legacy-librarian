import os
import subprocess
import sys
from collections import OrderedDict

GITHUB_URL = 'https://github.com/gssblib/librarian.git'
SALT_BOOTSTRAP_URL = 'https://bootstrap.saltstack.com'

grains = OrderedDict()

def cmd(cmd):
    print('  CMD: ' + ' '.join(cmd))
    subprocess.call(cmd)


def install_packages():
    print('Installing bootstrap Ubuntu packages...')
    cmd(['sudo', 'apt-get', 'install', 'git'])


def install_salt():
    print('Installing Saltstack. That may take a while...')
    if not os.path.exists('bootstrap_salt.sh'):
        cmd(['wget' , SALT_BOOTSTRAP_URL, '-O', 'bootstrap_salt.sh'])
    cmd(['sudo', 'sh', 'bootstrap_salt.sh'])


def clone_repos():
    cwd = os.getcwd()
    root_dir = input('Where should we clone the repos to? [%s]' % cwd)
    if not root_dir:
        root_dir = cwd
    if not os.path.exists(root_dir):
        cmd(['sudo', 'mkdir', '-p', root_dir])
        cmd(['sudo', 'chown',
             '%s:%s' % (os.getlogin(), os.getgroups()[0]),
             root_dir])
    grains['app_dir'] = app_dir = os.path.join(root_dir, 'librarian')
    if not os.path.exists(app_dir):
        cmd(['git', 'clone', GITHUB_URL, app_dir])


def get_server_type():
    server_type = input('Please select a server type. [prod]')
    grains['server_type'] = server_type or 'prod'


def get_smtp_creds():
    want_creds = input('Would you like to setup SMTP creds? [y/N]')
    if not want_creds.lower() == 'y':
        return
    grains['smtp.user'] = input('Username:')
    grains['smtp.password'] = input('Password:')


def write_grains():
    grains_path = os.path.join(grains['app_dir'], 'provision', 'grains')
    print('Updating grains in %s' % grains_path)
    installed_grains = OrderedDict()
    if os.path.exists(grains_path):
        with open(grains_path, 'r') as io:
            installed_grains = OrderedDict([
                line.strip().split(': ', 1)
                for line in io.readlines()
            ])
    installed_grains.update(grains)
    with open(grains_path+'.tmp', 'w') as io:
        io.write(
            '\n'.join(
                '%s: %s' % (key, value)
                for key, value in installed_grains.items()))
    cmd(['sudo', 'mv', grains_path+'.tmp', grains_path])

def show_salt_instructions():
    print('You are now ready to apply the salt state.')
    print()
    print('$ cd %s/provision' % grains['app_dir'])
    print('$ sudo salt-call -c . --local state.apply')


def main():
    install_packages()
    install_salt()
    clone_repos()
    get_server_type()
    get_smtp_creds()
    write_grains()
    show_salt_instructions()

if __name__ == '__main__':
    main()
