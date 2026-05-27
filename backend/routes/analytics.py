from flask import request
from flask_restful import Resource

from utils.context import get_analytics_service
from utils.response import success


class PlayerAnalyticsResource(Resource):
    def get(self):
        analytics = get_analytics_service().player_metrics(
            season=request.args.get("season"),
            team_id=request.args.get("teamId") or request.args.get("team"),
            player_id=request.args.get("playerId"),
        )
        return success(analytics)


class TeamAnalyticsResource(Resource):
    def get(self):
        analytics = get_analytics_service().team_metrics(
            season=request.args.get("season"),
            team_id=request.args.get("teamId") or request.args.get("team"),
        )
        return success(analytics)
