from flask import request
from flask_restful import Resource

from utils.context import get_analytics_service, get_repository
from utils.pagination import build_paginated_response, parse_pagination
from utils.response import failure, success


class PlayersResource(Resource):
    def get(self):
        page, limit = parse_pagination(request.args)
        repository = get_repository()
        data = repository.list_players(
            search=request.args.get("q") or request.args.get("search"),
            season=request.args.get("season"),
            team_id=request.args.get("teamId") or request.args.get("team"),
            role=request.args.get("role"),
            page=page,
            limit=limit,
        )
        return success(data)


class PlayerResource(Resource):
    def get(self, identifier):
        repository = get_repository()
        player = repository.get_player(identifier)
        if not player:
            return failure("Player not found", 404)

        analytics = get_analytics_service().player_metrics(season=request.args.get("season"), player_id=player.get("playerId"))
        player["analytics"] = analytics
        return success(player)
