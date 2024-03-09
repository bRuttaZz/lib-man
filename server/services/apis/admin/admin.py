import logging
from flask import Blueprint, request
from ....utils.decors.pydantic_requests import validate_input
from ....utils.decors.authenticate import authenticate, validate_session
from ....db import Session
from ....db.models import Admin
from ....utils.crypt import get_hash
from ....settings import ADMIN_PASSWORD_CHANGER_KEY
# importing input models
from .request_model import LoginRequest, AdminUpdateRequest


admin_apis = Blueprint('admin_apis', __name__)

@admin_apis.post("/login", endpoint="login")
@validate_input(input_model=LoginRequest)
def verify_login(inputs:LoginRequest):
    with Session() as db:
        status = db.query(Admin.id).filter(
            Admin.username==inputs.username,
            Admin.password_hash == get_hash(inputs.password),
        ).first()
        if not status:
            return {"success" : False, "detail": "INVALID_CREDENTIALS"}, 400
        return authenticate({"success" : True}, 200)

@admin_apis.post("/test-session", endpoint="testSession")
@validate_session(False)
def test_session():
    return {"status": True}, 200

@admin_apis.post("/update-password", endpoint="user")
@validate_input(input_model=AdminUpdateRequest)
@validate_session(False)
def update_admin(inputs:AdminUpdateRequest):
    if inputs.super_user_password != ADMIN_PASSWORD_CHANGER_KEY:
        return {"sueccess": False, "detail": "NOT_AUTHENTICATED"}, 403
    with Session() as db:
        db.query(Admin).filter(Admin.username == inputs.username).update({
            "password_hash": inputs.new_password
        }) 
        db.commit()
    return {"success": True}