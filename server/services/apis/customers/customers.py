import logging
from flask import Blueprint, request
from ....utils.decors.pydantic_requests import validate_input 
from ....utils.decors.authenticate import validate_session 
from ....settings import URL_PREFIX
from ....db.models import Members 
from ....db import Session
from ....db.utils import paginate

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
    logging.info(f"retrieving {len(data)} member count")
    return {
        "success": True, 
        "total_count": total_count, 
        "message": [dat.to_dict() for dat in data]
    }, 200


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







