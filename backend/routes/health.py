from flask_restful import Resource

from utils.context import get_repository
from utils.response import success


class HealthResource(Resource):
    def get(self):
        status = "healthy"
        repository = None
        try:
            repository = get_repository()
            repository.ping()
        except Exception:
            status = "degraded"
        payload = {
            "status": status,
            "service": "IPL Analytics API",
            "database": status == "healthy",
        }
        if repository is not None:
            payload["collections"] = repository.summary_counts()
        return success(payload)
