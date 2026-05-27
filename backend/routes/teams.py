from flask import request
from flask_restful import Resource

from utils.context import get_analytics_service, get_repository
from utils.response import failure, success


class TeamsResource(Resource):
    def get(self):
        repository = get_repository()
        data = repository.list_teams(
            search=request.args.get("q") or request.args.get("search"),
            season=request.args.get("season"),
            page=max(int(request.args.get("page", 1) or 1), 1),
            limit=min(max(int(request.args.get("limit", 20) or 20), 1), 100),
        )
        return success(data)


class TeamResource(Resource):
    def get(self, identifier):
        repository = get_repository()
        team = repository.get_team(identifier)
        if not team:
            return failure("Team not found", 404)

        analytics = get_analytics_service().team_metrics(season=request.args.get("season"), team_id=team.get("teamId"))
        team["analytics"] = analytics
        return success(team)
