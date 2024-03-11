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
        quer = db.query(Transactions, Members, Books)\
                .join(Members, Transactions.reader_id == Members.id)\
                .join(Books, Transactions.book_id == Books.id)\
                .group_by(Transactions.id)
        
        if isinstance(data.transaction_status, bool): 
            quer = quer.filter(Transactions.returned == data.transaction_status)
        if data.reader_name:            
            quer = quer.filter(Members.name.contains(data.reader_name))
        if data.book_name:
            quer = quer.filter(Books.title.contains(data.book_name))
        if data.isbn:
            quer = quer.filter(Books.isbn.contains(data.isbn))

        transactions, total_count = paginate(quer, page_number, 20)
        logging.info(f"retrieving {len(transactions)} transactions")
        messages = []
        for transact, member, book in transactions:
            messages.append({
                "title": book.title,
                "authors": book.authors,
                "book_id": book.id,
                "isbn": book.isbn,
                "readerName": member.name,
                "reader_id": member.id,
                "returned": transact.returned,  
                "returned_at": transact.returned_at,
                "borrowed_at": transact.borrowed_at,
            })
    return {
        "success": True, 
        "total_count": total_count, 
        "message": messages,
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