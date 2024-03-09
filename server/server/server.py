import logging
from flask import Flask, send_from_directory
from flask_cors import CORS

from ..settings import (
    URL_PREFIX, 
    TEMPLATE_DIRECTORY, 
    STATIC_DIRECTORY, 
    SET_DEFAULT_USER_IF_NONE_FOUND,
    CREATE_ALL_DB_BINDS
)
from ..services.views import views
from ..services.apis import apis
from ..db import Base, engine
from ..db.utils import create_admin_if_not

def create_app():
    app = Flask(
        __name__, 
        template_folder=TEMPLATE_DIRECTORY,
        static_folder=STATIC_DIRECTORY,
        static_url_path=f"{URL_PREFIX}/static",
    )
    CORS(app, origins=[
        "self", 
    ])

    # setting favicon 
    @app.route(f"{URL_PREFIX}/favicon.ico")
    def favicon():
        return send_from_directory(STATIC_DIRECTORY, "images/lib-man.png")


    # bind views
    app.register_blueprint(views, url_prefix=f"{URL_PREFIX}/")

    # bind apis
    app.register_blueprint(apis, url_prefix=f"{URL_PREFIX}/api")

    if CREATE_ALL_DB_BINDS:
        logging.info("[DB] creating bindings..")
        Base.metadata.create_all(bind=engine, checkfirst=True)

    if SET_DEFAULT_USER_IF_NONE_FOUND:
        logging.debug("[DB] checking default admin user..")
        create_admin_if_not()

    return app