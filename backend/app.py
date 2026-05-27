from __future__ import annotations

from pathlib import Path
import sitecustomize  # noqa: F401

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from backend.analytics.metrics import AnalyticsService
from backend.config.settings import Settings
from backend.models.repositories import MongoRepository
from backend.ml.predictor import MatchPredictionService
from backend.routes import register_routes
from backend.scraper.scorecard_scraper import CricketScraper
from backend.utils.errors import register_error_handlers


def create_app(config_object=Settings):
    app = Flask(__name__)
    app.config.from_object(config_object)
    app.config["MODEL_DIR"] = Path(app.config["MODEL_DIR"])
    app.config["MODEL_DIR"].mkdir(parents=True, exist_ok=True)

    CORS(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)

    repository = MongoRepository(app.config["MONGO_URI"], app.config["MONGO_DB_NAME"])
    try:
        repository.ping()
        repository.ensure_indexes()
    except Exception as exc:
        app.logger.warning("Mongo initialization warning: %s", exc)

    app.extensions["repository"] = repository
    app.extensions["analytics_service"] = AnalyticsService(repository)
    app.extensions["prediction_service"] = MatchPredictionService(repository, app.config["MODEL_DIR"])
    app.extensions["scraper_service"] = CricketScraper(repository, user_agent=app.config["SCRAPER_USER_AGENT"])

    api = Api(app)
    register_routes(api)
    register_error_handlers(app)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
