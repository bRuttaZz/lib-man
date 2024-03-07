import os
from dotenv import load_dotenv

from .logger import CustomizeLogger, suppress_unwanted_loggers

# setup logger
CustomizeLogger.make_logger()
suppress_unwanted_loggers()

_dirname = os.path.dirname(__file__)

# loading .env
load_dotenv(dotenv_path=f"{os.getenv('CONFIG_TYPE', '')}.env")

# and the configs
TEMPLATE_DIRECTORY=os.path.join(_dirname, "..", "templates")
STATIC_DIRECTORY=os.path.join(_dirname, "..",  "public")
URL_PREFIX=os.getenv("URL_PREFIX", "")

DB_CONFIG = {
    "dbType": os.getenv("DB_TYPE", "sqlite"),
    "host": os.getenv("DB_HOST", "0.0.0.0"),
    "port": int(os.getenv("DB_PORT", 1234)),
    "username": os.getenv("DB_USER", "admin"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "")
}
VAR_DIR = os.path.join(_dirname, "..", "var")