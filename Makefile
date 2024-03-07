PORT ?= "8000"

start:
	gunicorn main:app -w 4 -t 120 --bind "0.0.0.0:$(PORT)"

dev:
	CONFIG_TYPE=example python3 main.py $(PORT)
