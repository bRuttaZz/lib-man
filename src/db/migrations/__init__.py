import os
from datetime import datetime
from alembic import command
from alembic.config import Config
from ... import settings


def get_alembic_conf():
    return Config(os.path.join(os.path.dirname(__file__), "alembic.ini"))

def make_migrations():
    conf = get_alembic_conf()
    # conf.set_section_option('alembic', 'version_locations', "migrations")
    command.revision(
        conf, 
        message=f"migration @ {datetime.now().strftime('%H:%M, %d-%m-%Y')}",
        autogenerate=True
    )

def migrate():
    conf = get_alembic_conf()
    # conf.set_section_option('alembic', 'version_locations', "migrations")    
    command.upgrade(conf, "head")
