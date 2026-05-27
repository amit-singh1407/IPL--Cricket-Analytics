from flask import current_app


def get_repository():
    return current_app.extensions["repository"]


def get_analytics_service():
    return current_app.extensions["analytics_service"]


def get_prediction_service():
    return current_app.extensions["prediction_service"]


def get_scraper_service():
    return current_app.extensions["scraper_service"]
