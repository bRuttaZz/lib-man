import logging
import requests
from sqlalchemy import update, func
from flask import Blueprint, request
from ....utils.decors.pydantic_requests import validate_input 
from ....utils.decors.authenticate import validate_session 
from ....settings import URL_PREFIX, NEW_BOOK_API
from ....db.models import Books, Transactions
from ....db import Session
from ....db.utils import paginate

from .request_models import PutBooks, SearchBook

books_apis = Blueprint('books_apis', __name__)

@books_apis.get("/get-new-books", endpoint="get_new_books")
@validate_session(f"{URL_PREFIX}/login")
def get_new_book():
    try:
        dat = requests.get(NEW_BOOK_API, params=request.args)
        return dat.json(), 200
    except Exception as exp:
        return {"success": False, "detail": "api unreachable", "error": str(exp)}, 501
    
@books_apis.put("/put-books", endpoint="create_new_books")
@validate_session(f"{URL_PREFIX}/login")
@validate_input(input_model=PutBooks)
def put_new_book(data: PutBooks):
    # print(data.model_dump())
    logging.info(f"Importing books : {len(data.books)}")
    with Session() as db:
        # upsert got some support issues (that's why)
        # and for sure this query has to update
        incoming_books = {book.bookID: book for book in data.books}
        existing = db.query(Books).filter(
            Books.bookID.in_(incoming_books.keys())
        ).all()
        existing_bookIDs = [book.bookID for book in existing]
        logging.debug(f"preexisting books : {len(existing)}")

        # update existin
        logging.debug(f"update existing : {len(existing_bookIDs)}")
        for book in existing:
            book.bookCount += incoming_books[book.bookID].bookCount

        remaing_dict_dat = [book for book in data.model_dump()["books"] if book["bookID"] not in existing_bookIDs]
        logging.debug(f"adding remaing books : {len(remaing_dict_dat)}")
        for book in remaing_dict_dat:
            db.add(Books(**book))
        
        # and the commit
        db.commit()
        logging.info(f"books added : {len(data.books)}")
    return {"success": True}, 200


@books_apis.get("/get-books", endpoint="get_books")
@validate_session(f"{URL_PREFIX}/login")
def get_books():
    try:
        params = SearchBook(**request.args).model_dump()
        page_number = params["page"]
        del params["page"]
    except Exception as exp:
        logging.error(f"books, search querry not ok : {exp}")
        return {"success": False, "detail": "UNPROCESSIBLE_ENTITY"}, 422
    logging.info(f"getting new books")
    with Session() as db:
        q = db.query(Books)
        for key, val in params.items():
            if val:
                q = q.filter(getattr(Books, key).contains(val))
        data, total_count = paginate(q, page_number, 20)
        data = {dat.id: {
            **dat.to_dict(),
            "occupied_count": 0,
            "availableCount": dat.bookCount,
        } for dat in data}

        # trust me i have tried using jion for this use case (It's hard to do count and outerjoin level seperate queries)
        d = db.query(Transactions.id, Transactions.book_id).filter(
            Transactions.book_id.in_(data.keys()),
            Transactions.returned == False,
        ).all()
        for _, book_id in d:
            data[book_id]["occupied_count"] += 1
            data[book_id]["availableCount"] -= 1
    return {
        "success": True, 
        "message": list(data.values()), 
        "total_count": total_count
    }, 200