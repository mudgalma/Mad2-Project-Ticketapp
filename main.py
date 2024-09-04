import os
from flask import Flask
from flask_restful import Api
from flask_security import Security, SQLAlchemySessionUserDatastore
from application.config import LocalDevelopmentConfig
from application.database import db
from application.models import User, Role
from application.workers import celery_app,ContextTask
from application import tasks
from flask import Flask
from flask_cors import CORS



app = None
api = None
celery = None


def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv("ENV", "development") == "production":
        raise Exception("Currently no production config is setup.")
    else:
        print("Staring Local Development")
        app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.app_context().push()
    api = Api(app)
    CORS(app)
    app.app_context().push()
    user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    app.security = Security(app, user_datastore)
    cel=celery_app
    cel.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        broker_connection_retry_on_startup=True,
        timezone = "Asia/Kolkata"
    )

    cel.Task=ContextTask
    app.app_context().push()
    
    return app, api, celery


app, api, celery= create_app()


from application.app import *

from application.api import BookedshowAPI
api.add_resource(BookedshowAPI,"/api/bookedshow","/api/bookedshow/create/<int:show_id>")

from application.api import BookdetailsAPI
api.add_resource(BookdetailsAPI,"/api/book/<int:show_id>")

from application.api import ProfileAPI
api.add_resource(ProfileAPI,"/api/profile")

from application.api import ShowSummaryAPI
api.add_resource(ShowSummaryAPI,"/api/summary")

from application.api import RateAPI
api.add_resource(RateAPI, "/api/rating/create/<int:show_id>","/api/rate")





if __name__ == "__main__":
    app.run(debug=True)