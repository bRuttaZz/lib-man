import os, logging
import sqlalchemy as sa
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool, MetaData, Table
from sqlalchemy.orm import sessionmaker

from server.db import Base, db_connection_string, db_connection_args
from server.settings import IGNORE_MIGRATIONS_IF_NOT_FOUND



# DB connection string
app_url = db_connection_string
connect_args = {}

connect_args["connect_args"] = db_connection_args
connect_args['url'] = app_url

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# for 'autogenerate' support
target_metadata = Base.metadata
# target_metadata = None

# now bypassing default revision file 
if IGNORE_MIGRATIONS_IF_NOT_FOUND and not os.path.exists(config.get_main_option("version_locations")):
    try:
        print(f"[migratio file not found] gathering table metadata..")
        engine = create_engine(url=app_url)
        metadata = MetaData()
        # metadata.reflect(bind=engine)
        try:
            print(f"[migratio file not found] Flushing out migration history..")
            table = Table("alembic_version", metadata, autoload_with=engine)
            with sessionmaker(bind=engine)() as session:
                session.execute(table.delete())
                session.commit()
        except Exception as exp:
            print(f"[migratio file not found] Error finding revision table. Proceeding to create new migration scripts..")

    except Exception as exp:
        print("[migratio file not found] Error removing older alembic version. Procceding with current stage", exp)

def include_object(object, name, type_, reflected, compare_to):
    if type_ == "table" and reflected and compare_to is None:
        return False
    else:
        return True

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    context.configure(
        url=app_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        connect_args,
        prefix="",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, include_object=include_object
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
