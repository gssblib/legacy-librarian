
all: ve/

.PHONY: help
help:
	@echo "make all                    -- Build Python environment"
	@echo "make clean                  -- Cleanup build"
	@echo "ve/bin/python get_isbns.py  -- Looks for ISBNs"

ve/:
	virtualenv ./ve
	./ve/bin/pip install -r requirements.txt

clean:
	rm -rf ve
