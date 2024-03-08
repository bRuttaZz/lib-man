
from flask import Blueprint, request
from .admin import admin_apis
from .books import books_apis
from .customers import reader_apis
from .transactions import transaction_apis

apis = Blueprint('api', __name__)
apis.register_blueprint(admin_apis, url_prefix="/admin")
apis.register_blueprint(books_apis, url_prefix="/books")
apis.register_blueprint(reader_apis, url_prefix="/readers")
apis.register_blueprint(transaction_apis, url_prefix="/transactions")


