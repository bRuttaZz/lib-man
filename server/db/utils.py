import logging
from sqlalchemy.orm import query
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



def paginate(query:query, page_number:int, per_page:int):
    """get paginated results
    Args:
        query: The SQLAlchemy query object.
        page_number: The current page number (starting from 1).
        per_page: The number of items per page.

    Returns:
        A tuple containing:
            - page_items: A list of items for the current page.
            - total_count: The total number of items in the query.

    """
    offset = (page_number - 1) * per_page
    page_query = query.limit(per_page).offset(offset)
    page_items = page_query.all()

    # Get the total count (optional, requires another query)
    total_count = query.count()

    return page_items, total_count
