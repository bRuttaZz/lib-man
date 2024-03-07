from .models import HitLog, AuthKeys, Base

from sqlalchemy import create_engine, null
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker, scoped_session
from ..settings import DB_CONFIG, VAR_DIR

engine = null

if DB_CONFIG["dbType"] == "sqlite":
    engine = create_engine(
        f'sqlite:///{VAR_DIR}/API.db', connect_args={"check_same_thread": False}
    )
else:
    connection_string = '{urlPrefix}://{username}:{password}@{hostname}:{port}/{database}'
    engine = create_engine(
        connection_string.format(
            urlPrefix= DB_CONFIG["dbType"],
            username= DB_CONFIG["username"],
            password= DB_CONFIG["password"],
            hostname= DB_CONFIG["host"],
            port= DB_CONFIG["port"],
            database= DB_CONFIG["database"],
        ), poolclass=NullPool
    )


Session = scoped_session(sessionmaker(bind=engine))
