from flask import Blueprint, render_template

from ...settings import URL_PREFIX, SINGLE_BOOK_RENT

views = Blueprint('pages', __name__)

@views.route("/")
def main_page():
    return render_template('main.html', URL_PREFIX=URL_PREFIX, transact_fee=SINGLE_BOOK_RENT )

@views.route("/login")
def login_page():
    return render_template("login.html", URL_PREFIX=URL_PREFIX)