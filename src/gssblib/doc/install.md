# Server Installation

This page describes the installation of the gssblib server on
a new Ubuntu Linux machine.

## Ubuntu packages

- aptitude
- curl
- mysql (pick a good root password and keep it in a safe place)
- gnome-tweak-tool (optional, just to switch caps lock to control)

## Github projects

```
$ cd
$ mkdir -p github/gssb
```


## Install node

We use a local installation under ~/local and build node from
the source tar ball.  The following instructions use a build
directory under `~/install`, but one can obviously pick any
directory for this step.

```
$ cd
$ mkdir ~/install
$ cd install
$ curl http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz | tar xzf
$ ln -s node-v0.12.0 node-latest
$ cd node-latest
$ ./configure --prefix=/home/gssblib/local
$ make install
$ cd
```

After adding `~/local/bin` to the `PATH`, the `node` and `npm` commands
should be available.

## Mysql gssb database

```
$ mysql -p -u root
...
mysql> create user 'gssb'@'localhost' identified by '...';
mysql> create database spils;
mysql> quit
```

### Upload dump

```
$ mysql -p -u gssb < dump.sql
```

Check:

```
$ mysql -p -u gssb spils
mysql> select count(*) from items;
```



## Gssblib server

```
$ cd ~/github/gssblib/librarian/src/gssblib
$ npm install
```

## Work environment (optional)

To fell comfortable, I also installed my vim configuration:

```
$ cd ~/github
$ mkdir ahohmann
$ cd ahohmann
$ git clone https://github.com/ahohmann/dotfiles.git
$ cd
$ ln -s ./github/ahohmann/dotfiles/.vimrc .vimrc
$ mkdir -p .vim/bundle
$ git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```


