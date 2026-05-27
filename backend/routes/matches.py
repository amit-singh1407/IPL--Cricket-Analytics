from flask import request
from flask_restful import Resource

from utils.context import get_repository
from utils.pagination import parse_pagination
from utils.response import failure, success


class MatchesResource(Resource):
    def get(self):
        page, limit = parse_pagination(request.args)
        repository = get_repository()
        data = repository.list_matches(
            search=request.args.get("q") or request.args.get("search"),
            season=request.args.get("season"),
            team_id=request.args.get("teamId") or request.args.get("team"),
            venue=request.args.get("venue"),
            page=page,
            limit=limit,
        )
        return success(data)


class MatchResource(Resource):
    def get(self, identifier):
        repository = get_repository()
        match = repository.get_match(identifier)
        if not match:
            return failure("Match not found", 404)
        return success(match)
