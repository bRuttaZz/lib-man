import logging
from . import Session
from .models import Admin
from ..settings import DEFAULT_PASSWORD, DEFAULT_USERNAME
from ..utils.crypt import get_hash


def create_admin_if_not():
    """Create admin user if not already exists"""
    with Session() as db:
        count = db.query(Admin).count()
        if not count:
            logging.debug(f"[DEFAULT USER] admin user not found! creating default one.")
            d_user = Admin(
                username=DEFAULT_USERNAME, 
                password_hash=get_hash(DEFAULT_PASSWORD) 
            )
            db.add(d_user)
            db.commit()
            logging.info(f"[DEFAULT USER] admin user created.\nusername\t: {DEFAULT_USERNAME}\n"
                        + f"password\t: {DEFAULT_PASSWORD}")
            return
        logging.info(f"[DEFAULT USER] admin users already exists : {count}")