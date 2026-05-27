from backend.routes.analytics import PlayerAnalyticsResource, TeamAnalyticsResource
from backend.routes.health import HealthResource
from backend.routes.matches import MatchResource, MatchesResource
from backend.routes.players import PlayerResource, PlayersResource
from backend.routes.predictions import PredictionResource
from backend.routes.teams import TeamResource, TeamsResource


def register_routes(api):
    api.add_resource(HealthResource, "/", "/health")
    api.add_resource(PlayersResource, "/players")
    api.add_resource(PlayerResource, "/player/<string:identifier>")
    api.add_resource(TeamsResource, "/teams")
    api.add_resource(TeamResource, "/team/<string:identifier>")
    api.add_resource(MatchesResource, "/matches")
    api.add_resource(MatchResource, "/match/<string:identifier>")
    api.add_resource(PlayerAnalyticsResource, "/analytics/player")
    api.add_resource(TeamAnalyticsResource, "/analytics/team")
    api.add_resource(PredictionResource, "/predict")
