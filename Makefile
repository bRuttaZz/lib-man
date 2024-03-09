# No confusions start by executing `make` command 

# general configs
CONFIG_TYPE ?= "example"
PORT ?= "8000"

# gunicorn  settings
WORKERS ?= "4"
SREVER_TIMEOUT ?= "120"

help:
	@echo -e "LIB SUPERVISOR! "
	@echo -e ""
	@echo -e "Usage : "
	@echo -e "	make <command>" 
	@echo -e ""
	@echo -e "commands: "
	@echo -e "	start\t\t: To start the server using gunicorn "
	@echo -e "	dev  \t\t: To start a development server in debug mode "
	@echo -e "	make-migrations\t: To make new databse migrations" 
	@echo -e "	migrate \t: To apply migrations" 
	@echo -e ""
	@echo -e "configurations:"
	@echo -e "	environment-variables:"
	@echo -e "		CONFIG_TYPE\t: To select curresponding .env config file"
	@echo -e "		PORT \t\t: To specify custom port (defaults to 8000)"
	@echo -e "		WORKERS\t\t: To specify number of workers to be used with gunicorn (defaults to 4)"
	@echo -e "		SREVER_TIMEOUT\t: To specify server timeout to be used with gunicorn (defaults to 120s)"
	@echo -e ""


start: main.py server
	@gunicorn main:app -w $(WORKERS) -t $(SREVER_TIMEOUT) --bind "0.0.0.0:$(PORT)"

dev: main.py server
	@CONFIG_TYPE=$(CONFIG_TYPE) PORT=$(PORT) python3 main.py run

make-migrations: main.py server
	@CONFIG_TYPE=$(CONFIG_TYPE) python3 main.py make-migrations

migrate: main.py server
	@CONFIG_TYPE=$(CONFIG_TYPE) python3 main.py migrate

