from sqlalchemy.orm import query

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
