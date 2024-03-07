from flask import Flask, send_from_directory

from ..settings import URL_PREFIX, TEMPLATE_DIRECTORY, STATIC_DIRECTORY
from ..services.views import views

def create_app():
    app = Flask(__name__, template_folder=TEMPLATE_DIRECTORY)

    # setting static files
    @app.route(f"{URL_PREFIX}/static/<path:filename>")
    def static_files(filename):
        return send_from_directory(STATIC_DIRECTORY, filename)

    # bind views
    app.register_blueprint(views, url_prefix=f"{URL_PREFIX}/")

    return app