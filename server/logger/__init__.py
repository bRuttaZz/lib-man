import logging
from .logger import CustomizeLogger

def suppress_unwanted_loggers():
    logging.getLogger("werkzeug").setLevel(logging.INFO)
    logging.getLogger("urllib3").setLevel(logging.WARNING)