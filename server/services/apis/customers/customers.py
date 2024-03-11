import logging
from flask import Blueprint, request
from sqlalchemy import func
from ....utils.decors.pydantic_requests import validate_input 
from ....utils.decors.authenticate import validate_session 
from ....settings import URL_PREFIX
from ....db.models import Members, Transactions
from ....db import Session
from ....db.utils import paginate
from ....settings import SINGLE_BOOK_RENT

from .request_models import SearchMember, CreateMember, UpdateMember, DeleteMember

reader_apis = Blueprint('reader_apis', __name__)



@reader_apis.put("/member", endpoint="put_member")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=CreateMember)
def put_member(data:CreateMember):
    try:
        logging.debug("adding new member")
        with Session() as db:
            db.add(Members(**data.model_dump()))
            db.commit()
    except Exception as exp:
        logging.error(f"error adding member : {exp}")
        return {"success": False, "detail": "ERROR_CREATING_READER"}, 400
    logging.info(f"new member created : {data.name}")
    return {"success": True}, 201


@reader_apis.get("/member", endpoint="get_member")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
def get_member():
    try:
        data = SearchMember(**request.args)
        page_number = data.page 
        params = data.model_dump()
        del params["page"]
    except Exception as exp:
        logging.error(f"invalid incoming data format: {exp}")
        return {"success": False, "detail": "UNPROCESSIBLE_ENTITY"}, 422

    logging.debug(f"getting members..")
    with Session() as db:
        q = db.query(Members)
        for key, val in params.items():
            if val:
                q = q.filter(getattr(Members, key).contains(val))
        data, total_count = paginate(q, page_number, 20)
        members = {dat.id: {
            **dat.to_dict(),
            "numBooksInHand": 0,
            "debt": 0,
            "total_transacts": 0,
        } for dat in data}

        # now getting the transaction count
        trans_count = db.query(Transactions.reader_id, Transactions.returned).filter(Transactions.reader_id.in_(
            members.keys()
        )).order_by(Transactions.reader_id).all()
        for id, return_stat in trans_count:
            members[id]["total_transacts"] += 1
            if not return_stat:
                members[id]["numBooksInHand"] += 1
                members[id]["debt"] += SINGLE_BOOK_RENT
    
    logging.info(f"retrieving {len(data)} member count")
    
    return {
        "success": True, 
        "total_count": total_count, 
        "message": list(members.values()),
    }, 200

    # and that solution got a weird pagination issues (I hate sql :)
    # with Session() as db:
    #     q = db.query(Members, Transactions)\
    #         .outerjoin(Transactions, Members.id == Transactions.reader_id)\
    #         .order_by(Members.name)
    #     for key, val in params.items():
    #         if val:
    #             q = q.filter(getattr(Members, key).contains(val))
    #     data, total_count = paginate(q, page_number, 20)
    # logging.info(f"retrieving {len(data)} member count")
    
    # members = {}
    # for member, transact in data:
    #     print(member, transact.returned if transact else transact)
    #     if member.id not in members:
    #         members[member.id] = member.to_dict()
    #         members[member.id]["numBooksInHand"] = 0
    #         members[member.id]["debt"] = 0
    #         members[member.id]["total_transacts"] = 0
    #     if transact is not None:
    #         members[member.id]["total_transacts"] += 1
    #         if not transact.returned:
    #             members[member.id]["numBooksInHand"] += 1
    #             members[member.id]["debt"] += SINGLE_BOOK_RENT
    # return {
    #     "success": True, 
    #     "total_count": total_count, 
    #     "message": list(members.values()),
    # }, 200
    
    # single query direct method is not working out! wasn't figured out
    # with Session() as db:
    #     q = db.query(Members, func.count(Transactions.id).label("transact_count"), func.sum(Transactions.returned).label("transact_count_"))\
    #             .outerjoin(Transactions, Members.id == Transactions.reader_id) \
    #             .group_by(Members.id) 
    #     for key, val in params.items():
    #         if val:
    #             q = q.filter(getattr(Members, key).contains(val))
    #     data, total_count = paginate(q, page_number, 20)
    # members = []
    # for member, transact_count, _ in data:
    #     print(transact_count, _)
    #     members.append({**member.to_dict(), "numBooksInHand": transact_count, 
    #                     "debt": transact_count*SINGLE_BOOK_RENT})      
    # return {
    #     "success": True, 
    #     "total_count": total_count, 
    #     "message": members,
    # }, 200


@reader_apis.post("/member", endpoint="update_member")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=UpdateMember)
def update_member(data:UpdateMember):
    data.email = ""
    with Session() as db:
        dat = db.query(Members).get(data.id)
        for key, val in data.model_dump().items():
            if val:
                setattr(dat, key, val)
        db.commit()
    return {"success": True}, 200


@reader_apis.delete("/member", endpoint="delete_member")
@validate_session(redirect_req=f"{URL_PREFIX}/login")
@validate_input(input_model=DeleteMember)
def delete_member(data:DeleteMember):
    with Session() as db:
        dat = db.query(Members).get(data.id)
        if dat:
            db.delete(dat)
        db.commit()
    return {"success": True}, 200







