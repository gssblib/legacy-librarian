all: build

build: requirements.txt
	virtualenv ve
	ve/bin/pip install -r requirements.txt

.PHONY: run
run: ve
	NODE_ENV=prod ve/bin/python make_label.py serve

