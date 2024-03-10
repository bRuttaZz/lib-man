import logging
from flask import Blueprint, request
from ....utils.decors.pydantic_requests import validate_input 
from ....utils.decors.authenticate import validate_session 
from ....settings import URL_PREFIX
from ....db.models import Transactions, Members, Books
from ....db import Session
from ....db.utils import paginate

from .request_models import SearchTransactions, CreateTransaction, DeleteTransaction, UpdateTransaction

transaction_apis = Blueprint('transaction_apis', __name__)

@transaction_apis.get("/transactions", endpoint="get_transactions")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
def get_transactions():
    try:
        data = SearchTransactions(**request.args)
        page_number = data.page 
    except Exception as exp:
        logging.error(f"invalid incoming data format: {exp}")
        return {"success": False, "detail": "UNPROCESSIBLE_ENTITY"}, 422

    logging.debug(f"getting transactions..")

    with Session() as db:
        quer = db.query(Transactions)
        if data._searchType is Transactions:
            quer = quer.filter(Transactions.returned == data.transaction_status)
        elif data._searchType is Members:
            members = db.query(Members.id).filter(Members.name.contains(data.reader_name)).all()
            
            quer = quer.filter(Transactions.reader_id.in_([member.id for member in members]))

        elif data._searchType is Books:
            books_q = db.query(Books.id)
            if data.book_name:
                books_q = books_q.filter(Books.title.contains(data.book_name))
            if data.isbn:
                books_q = books_q.filter(Books.isbn.contains(data.isbn))
            books = books_q.all()

            quer = quer.filter(Transactions.book_id.in_([book.id for book in books]))

        transactions, total_count = paginate(page_number, page_number, 20)
        logging.info(f"retrieving {len(data)} transactions")
    return {
        "success": True, 
        "total_count": total_count, 
        "message": [dat.to_dict() for dat in transactions]
    }, 200


@transaction_apis.put("/transactions", endpoint="put_transactions")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=CreateTransaction)
def put_transactions(data:CreateTransaction):
    with Session() as db:
        book = db.query(Books).get(data.book_id)
        member = db.query(Members).get(data.reader_id)
        if not book or not member:
            return {"success": False, "detail": "book/member not found"}, 400
        
        dat = Transactions(book=book, member=member)
        db.add(dat)
        db.commit()
    return {"success": True}, 201


@transaction_apis.post("/transactions", endpoint="update_transactions")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=UpdateTransaction)
def update_transactions(data:UpdateTransaction):
    with Session() as db:
        transc = db.query(Transactions).get(data.id)
        if transc:
            transc.returned = data.returned
            db.commit()
        return {"success": True}, 200
    

@transaction_apis.delete("/transactions", endpoint="delete_transactions")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=DeleteTransaction)
def delete_transactions(data:DeleteTransaction):
    with Session() as db:
        transc = db.query(Transactions).get(data.id)
        if transc:
            db.delete(transc)
            db.commit()            
        return {"success": True}, 200