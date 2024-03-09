from flask import Blueprint, render_template

from ...settings import URL_PREFIX

views = Blueprint('pages', __name__)

@views.route("/")
def main_page():
    return render_template('main.html', URL_PREFIX=URL_PREFIX )

@views.route("/login")
def login_page():
    return render_template("login.html", URL_PREFIX=URL_PREFIX)