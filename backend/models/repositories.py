from __future__ import annotations

from datetime import datetime, timezone
from math import ceil
from typing import Any

from bson import ObjectId

from utils.db import MongoConnection, serialize_document


class MongoRepository:
    def __init__(self, mongo_uri: str, db_name: str):
        self.connection = MongoConnection(mongo_uri, db_name)
        self.db = self.connection.db

    def ping(self):
        self.connection.ping()

    def ensure_indexes(self):
        self.db.users.create_index("email", unique=True)
        self.db.players.create_index([("playerId", 1)], unique=True, sparse=True)
        self.db.players.create_index([("name", 1)])
        self.db.players.create_index([("teamId", 1)])
        self.db.players.create_index([("seasons", 1)])
        self.db.teams.create_index([("teamId", 1)], unique=True, sparse=True)
        self.db.teams.create_index([("name", 1)])
        self.db.teams.create_index([("seasons", 1)])
        self.db.matches.create_index([("matchId", 1)], unique=True, sparse=True)
        self.db.matches.create_index([("season", 1)])
        self.db.matches.create_index([("venue", 1)])
        self.db.scorecards.create_index([("scorecardId", 1)], unique=True, sparse=True)
        self.db.scorecards.create_index([("matchId", 1)])
        self.db.scorecards.create_index([("season", 1)])
        self.db.predictions.create_index([("predictionKey", 1)], unique=True, sparse=True)

    def collection(self, name: str):
        return self.db[name]

    def _build_query(self, clauses: list[dict[str, Any]]):
        filtered = [clause for clause in clauses if clause]
        if not filtered:
            return {}
        if len(filtered) == 1:
            return filtered[0]
        return {"$and": filtered}

    def _search_clause(self, search_term: str | None, fields: list[str]):
        if not search_term:
            return None
        regex = {"$regex": search_term, "$options": "i"}
        return {"$or": [{field: regex} for field in fields]}

    def _list(self, collection_name: str, query: dict | None, page: int, limit: int, sort_field: str, sort_direction: int):
        collection = self.collection(collection_name)
        normalized_query = query or {}
        skip = max(page - 1, 0) * limit
        cursor = collection.find(normalized_query).sort(sort_field, sort_direction).skip(skip).limit(limit)
        items = [serialize_document(document) for document in cursor]
        total = collection.count_documents(normalized_query)
        pages = ceil(total / limit) if total and limit else 0
        return {
            "items": items,
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages,
        }

    def _find_by_identifier(self, collection_name: str, identifier: str, alternate_fields: list[str]):
        query_parts: list[dict[str, Any]] = []
        if ObjectId.is_valid(str(identifier)):
            query_parts.append({"_id": ObjectId(str(identifier))})
        for field in alternate_fields:
            query_parts.append({field: str(identifier)})
        query = {"$or": query_parts} if len(query_parts) > 1 else (query_parts[0] if query_parts else {})
        document = self.collection(collection_name).find_one(query)
        return serialize_document(document)

    def find_user_by_email(self, email: str):
        return serialize_document(self.collection("users").find_one({"email": email}))

    def create_user(self, document: dict[str, Any]):
        payload = {**document, "createdAt": document.get("createdAt", datetime.now(timezone.utc))}
        result = self.collection("users").insert_one(payload)
        return str(result.inserted_id)

    def store_prediction(self, document: dict[str, Any]):
        payload = {**document, "createdAt": document.get("createdAt", datetime.now(timezone.utc))}
        return self.collection("predictions").update_one(
            {"predictionKey": payload["predictionKey"]},
            {"$set": payload},
            upsert=True,
        )

    def upsert_player(self, document: dict[str, Any]):
        query = {"playerId": document.get("playerId")}
        return self.collection("players").update_one(query, {"$set": document}, upsert=True)

    def upsert_team(self, document: dict[str, Any]):
        query = {"teamId": document.get("teamId")}
        return self.collection("teams").update_one(query, {"$set": document}, upsert=True)

    def upsert_match(self, document: dict[str, Any]):
        query = {"matchId": document.get("matchId")}
        return self.collection("matches").update_one(query, {"$set": document}, upsert=True)

    def upsert_scorecard(self, document: dict[str, Any]):
        query = {"scorecardId": document.get("scorecardId")}
        return self.collection("scorecards").update_one(query, {"$set": document}, upsert=True)

    def list_players(self, search: str | None = None, season: str | None = None, team_id: str | None = None, role: str | None = None, page: int = 1, limit: int = 20):
        clauses: list[dict[str, Any]] = []
        if season:
            clauses.append({"seasons": season})
        if team_id:
            clauses.append({"teamId": team_id})
        if role:
            clauses.append({"role": {"$regex": role, "$options": "i"}})
        search_clause = self._search_clause(search, ["name", "playerId", "teamName", "role"])
        if search_clause:
            clauses.append(search_clause)
        return self._list("players", self._build_query(clauses), page, limit, "name", 1)

    def get_player(self, identifier: str):
        return self._find_by_identifier("players", identifier, ["playerId", "slug"])

    def list_teams(self, search: str | None = None, season: str | None = None, page: int = 1, limit: int = 20):
        clauses: list[dict[str, Any]] = []
        if season:
            clauses.append({"seasons": season})
        search_clause = self._search_clause(search, ["name", "teamId", "city", "shortName"])
        if search_clause:
            clauses.append(search_clause)
        return self._list("teams", self._build_query(clauses), page, limit, "name", 1)

    def get_team(self, identifier: str):
        return self._find_by_identifier("teams", identifier, ["teamId", "slug"])

    def list_matches(self, search: str | None = None, season: str | None = None, team_id: str | None = None, venue: str | None = None, page: int = 1, limit: int = 20):
        clauses: list[dict[str, Any]] = []
        if season:
            clauses.append({"season": season})
        if team_id:
            clauses.append({"$or": [{"team1Id": team_id}, {"team2Id": team_id}, {"winnerId": team_id}]})
        if venue:
            clauses.append({"venue": {"$regex": venue, "$options": "i"}})
        search_clause = self._search_clause(search, ["matchId", "venue", "team1Name", "team2Name", "winnerName"])
        if search_clause:
            clauses.append(search_clause)
        return self._list("matches", self._build_query(clauses), page, limit, "date", -1)

    def get_match(self, identifier: str):
        return self._find_by_identifier("matches", identifier, ["matchId", "slug"])

    def list_scorecards(self, search: str | None = None, season: str | None = None, team_id: str | None = None, page: int = 1, limit: int = 20):
        clauses: list[dict[str, Any]] = []
        if season:
            clauses.append({"season": season})
        if team_id:
            clauses.append({"$or": [{"battingTeamId": team_id}, {"bowlingTeamId": team_id}]})
        search_clause = self._search_clause(search, ["scorecardId", "matchId", "venue"])
        if search_clause:
            clauses.append(search_clause)
        return self._list("scorecards", self._build_query(clauses), page, limit, "createdAt", -1)

    def summary_counts(self):
        return {
            "players": self.collection("players").count_documents({}),
            "teams": self.collection("teams").count_documents({}),
            "matches": self.collection("matches").count_documents({}),
            "scorecards": self.collection("scorecards").count_documents({}),
            "predictions": self.collection("predictions").count_documents({}),
        }
