import logging
from flask import Blueprint
from ....utils.decors.pydantic_requests import validate_input 
from ....utils.decors.authenticate import validate_session 
from ....settings import URL_PREFIX
from ....db.models import Transactions, Members, Books
from ....db import Session
from ....db.utils import paginate


transaction_apis = Blueprint('transaction_apis', __name__)

# @transaction_apis.get("")