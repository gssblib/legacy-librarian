# GSSB Library App

This directory contains the web app for the library of the GSSB.

The application consists of an AngularJS client talking to a node.js server
backed by a mysql database (using the schema of the previous version of the
library application which was based on MS WebMatrix).

## Directory Structure

- client: client web application (angular)
- server: node.js server
- node_modules: local npm installation directory
- bower_modules: bower installation directory
- doc: project documentation
- Gruntfile.js: grunt makefile for the web app (copying libraries)
- bower.json: bower configuration for re-installing the web app libs

## How did we get here?

With `npm` and `bower` available, all one needs to do is call their `install`
commands with the `--save` option (`npm` for the server modules, `bower` for
the client modules).  This adds the modules to the `package.json` and
`bower.json` files so that everything can be installed again with `npm install`
and `bower install`, respectively.

### Installing node modules (with npm)

```
$ npm install grunt
$ npm install grunt-bower-task --save-dev
$ npm install express --save
$ npm install express-session --save
...
```

### Installing client modules (with bower)

```
$ bower init
$ bower install angular --save
$ bower install bootstrap --save
...
```

The minimal `Gruntfile.js` sets bower's `targetDir` option to `./client/vendor`
so that one can copy the client libraries (js, css, images) to the frontend
directory with

```
$ grunt bower:install
```

