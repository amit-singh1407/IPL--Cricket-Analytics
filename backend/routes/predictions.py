from flask import request
from flask_restful import Resource

from utils.context import get_prediction_service
from utils.response import failure, success
from utils.validation import validate_prediction_payload


class PredictionResource(Resource):
    def post(self):
        payload = request.get_json(silent=True) or {}
        missing_fields = validate_prediction_payload(payload)
        if missing_fields:
            return failure(f"Missing required fields: {', '.join(missing_fields)}", 400)

        prediction = get_prediction_service().predict(payload)
        return success(prediction, message="Prediction generated")
