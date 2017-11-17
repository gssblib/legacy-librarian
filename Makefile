CONFIG_DIR = $(shell pwd)/config
BACKUPS_DIR = $(shell pwd)/backups
PYTHON = `pwd`/python-ve/bin/python
PIP = `pwd`/python-ve/bin/pip

##> all : Build all components
all: server labels scripts client

##> help : Show this help text
.PHONY: help
help:
	@python scripts/makefile_self_document.py

python-ve:
	virtualenv python-ve

clean:
	rm -rf python-ve
	rm -rf client2/dist
	rm -rf client2/dist-public
	rm -rf client2/node_modules

####> Library Application Server <#############################################

##> server : Install/build the node server.
server: server/package.json
	cd server; \
	nvm install stable; \
	npm install

##> test-server : Run server tests.
.PHONY: test-server
test-server:
	cd server; \
	npm test

##> run-server : Run server on standard port.
.PHONY: run-server
run-server:
	cd server; \
	NODE_CONFIG_DIR=$(CONFIG_DIR) NODE_ENV=prod node ./src/library_server.js


####> Library Label Server <###################################################

##> labels : Install/build the label server/cli environment.
labels: python-ve labels/requirements.txt
	$(PIP) install -r labels/requirements.txt

##> run-labels-server : Run labels server.
run-labels-server:
	NODE_CONFIG_DIR=$(CONFIG_DIR) NODE_ENV=prod \
	    $(PYTHON) `pwd`/labels/make_label.py serve


####> Old Client <#############################################################

##> old-client : Install/build the old client.
old-client: client/Gruntfile.js client/bower.json client/package.json
	cd client; \
	npm install; \
	grunt bower:install


####> Client <#################################################################

##> client : Install client components.
client: client2/package.json
	cd client2; \
	npm install -g @angular/cli; \
	npm install

##> client-dist : Build volunteer client distribution
client-dist:
	cd client2; \
	ng build --base-href "/volunteers/"

##> client-dev : Start the volunteer client dev server on port 4200.
client-dev:
	cd client2; \
	ng serve --proxy-config proxy.conf.json

##> public-client-dist : Build public client distribution
public-client-dist:
	cd client2; \
	ng build --app public --base-href "/public/"

##> public-client-dev : Start the public client dev server on port 5200.
public-client-dev:
	cd client2; \
	ng serve --proxy-config proxy.conf.json --port 5200 --app public


####> Scripts <###############################################################

##> scripts : Install/build the scripts environment.
scripts: python-ve scripts/requirements.txt
	$(PIP) install -r scripts/requirements.txt

##> backup : Create a backup of the database.
.PHONY: backup
backup:
	mkdir -p $(BACKUPS_DIR)
	NODE_ENV=prod $(PYTHON) scripts/backup_db.py --backup_dir $(BACKUPS_DIR)

##> reminder-emails-file : Create a file with reminder E-mails
.PHONY: reminder-emails
reminder-emails-file:
	NODE_ENV=prod $(PYTHON) \
	    scripts/reminder_email.py file email-recipients.txt

##> send-reminder-emails : Create a file with reminder E-mails
.PHONY: send-reminder-emails
send-reminder-emails:
	NODE_ENV=prod $(PYTHON) \
	    scripts/reminder_email.py email email-recipients.txt
