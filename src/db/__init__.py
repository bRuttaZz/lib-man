from .models import Base

from sqlalchemy import create_engine, null
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker, scoped_session
from ..settings import DB_CONFIG, VAR_DIR, CREATE_ALL_DB_BINDS

engine = null
db_connection_string = ""
db_connection_args = {}

if DB_CONFIG["dbType"] == "sqlite":
    db_connection_string = f'sqlite:///{VAR_DIR}/API.db'
    db_connection_args = {"check_same_thread": False}
    engine = create_engine(
        db_connection_string,
        connect_args=db_connection_args
    )
else:
    db_connection_string = '{urlPrefix}://{username}:{password}@{hostname}:{port}/{database}'.format(
        urlPrefix= DB_CONFIG["dbType"],
        username= DB_CONFIG["username"],
        password= DB_CONFIG["password"],
        hostname= DB_CONFIG["host"],
        port= DB_CONFIG["port"],
        database= DB_CONFIG["database"],
    )
    engine = create_engine(
        db_connection_string, poolclass=NullPool
    )


Session = scoped_session(sessionmaker(bind=engine))

if CREATE_ALL_DB_BINDS:
    print("creating everything")
    Base.metadata.create_all(bind=engine, checkfirst=True)