from __future__ import annotations

import hashlib
import json
from pathlib import Path
from statistics import mean
from typing import Any

import joblib
import numpy as np

from ml.features import build_player_prediction_frame, build_prediction_feature_row


class MatchPredictionService:
    def __init__(self, repository, artifact_dir):
        self.repository = repository
        self.artifact_dir = Path(artifact_dir)
        self.artifact_dir.mkdir(parents=True, exist_ok=True)
        self.winner_model = self._load_model("winner_model.joblib")
        self.score_model = self._load_model("score_model.joblib")
        self.player_model = self._load_model("player_model.joblib")

    def _load_model(self, filename: str):
        model_path = self.artifact_dir / filename
        if model_path.exists():
            return joblib.load(model_path)
        return None

    def _prediction_key(self, payload: dict[str, Any]):
        serialized = json.dumps(payload, sort_keys=True, default=str)
        return hashlib.sha1(serialized.encode("utf-8")).hexdigest()

    def _team_form(self, team_id: str | None):
        if not team_id:
            return 50.0
        team = self.repository.get_team(team_id)
        if team:
            stats = team.get("stats", {}) if isinstance(team, dict) else {}
            return float(stats.get("winPercentage") or stats.get("winRate") or 50)
        matches = list(self.repository.collection("matches").find({"$or": [{"team1Id": team_id}, {"team2Id": team_id}]}))
        if not matches:
            return 50.0
        wins = len([match for match in matches if match.get("winnerId") == team_id])
        return float(wins / max(len(matches), 1) * 100)

    def _estimate_winner_without_model(self, payload: dict[str, Any]):
        team1_id = payload.get("team1Id")
        team2_id = payload.get("team2Id")
        team1_form = self._team_form(team1_id)
        team2_form = self._team_form(team2_id)
        toss_advantage = 3.0 if payload.get("tossWinnerId") == team1_id else -3.0 if payload.get("tossWinnerId") == team2_id else 0.0
        venue_bias = float(payload.get("venueWinRateTeam1", 50)) - float(payload.get("venueWinRateTeam2", 50))
        score = (team1_form - team2_form + toss_advantage + venue_bias) / 12.0
        probability = 1 / (1 + np.exp(-score))
        return {
            "teamId": team1_id if probability >= 0.5 else team2_id,
            "probability": round(float(max(probability, 1 - probability)), 3),
        }

    def _estimate_score_without_model(self, payload: dict[str, Any]):
        team1_form = self._team_form(payload.get("team1Id"))
        team2_form = self._team_form(payload.get("team2Id"))
        venue_average = float(payload.get("venueAverageScore", 165))
        toss_adjustment = 4 if payload.get("tossDecision") == "bat" else 2 if payload.get("tossDecision") == "field" else 0
        predicted_runs = venue_average + ((team1_form + team2_form) / 20.0) + toss_adjustment
        return round(float(predicted_runs), 0)

    def _candidate_player_ids(self, payload: dict[str, Any]):
        team_ids = [payload.get("team1Id"), payload.get("team2Id")]
        player_ids: list[str] = []
        for team_id in team_ids:
            if not team_id:
                continue
            players = list(self.repository.collection("players").find({"teamId": team_id}))
            player_ids.extend([player.get("playerId") for player in players if player.get("playerId")])
        return list(dict.fromkeys(player_ids))

    def _estimate_top_player_without_model(self, payload: dict[str, Any]):
        player_ids = self._candidate_player_ids(payload)
        best_candidate = None
        best_score = -1.0
        for player_id in player_ids:
            player = self.repository.get_player(player_id)
            if not player:
                continue
            batting = player.get("batting", {}) if isinstance(player, dict) else {}
            batting_average = float(batting.get("average", 0) or 0)
            strike_rate = float(batting.get("strikeRate", 0) or 0)
            recent_runs = float(batting.get("runs", 0) or 0)
            venue_boost = float(payload.get("venueAverageScore", 165)) / 100.0
            score = batting_average * 0.5 + strike_rate * 0.3 + recent_runs * 0.02 + venue_boost
            if score > best_score:
                best_candidate = {
                    "playerId": player.get("playerId"),
                    "name": player.get("name"),
                    "predictedRuns": round(float(batting_average * 0.45 + recent_runs * 0.12), 0),
                }
                best_score = score
        return best_candidate or {"playerId": None, "name": None, "predictedRuns": 0}

    def _predict_with_model(self, model, features_frame):
        if model is None:
            return None
        prediction = model.predict(features_frame)[0]
        probability = None
        if hasattr(model, "predict_proba"):
            probability = float(np.max(model.predict_proba(features_frame)))
        return prediction, probability

    def predict(self, payload: dict[str, Any]):
        feature_frame = build_prediction_feature_row(payload, self.repository)
        winner_prediction = None
        winner_probability = None
        if self.winner_model is not None:
            predicted_team_id, winner_probability = self._predict_with_model(self.winner_model, feature_frame)
            team = self.repository.get_team(predicted_team_id)
            winner_prediction = {
                "teamId": predicted_team_id,
                "name": team.get("name") if team else predicted_team_id,
                "probability": round(float(winner_probability or 0.5), 3),
                "source": "model",
            }
        else:
            estimated_winner = self._estimate_winner_without_model(payload)
            team = self.repository.get_team(estimated_winner["teamId"])
            winner_prediction = {
                "teamId": estimated_winner["teamId"],
                "name": team.get("name") if team else estimated_winner["teamId"],
                "probability": estimated_winner["probability"],
                "source": "heuristic",
            }
            winner_probability = estimated_winner["probability"]

        if self.score_model is not None:
            predicted_score = float(self.score_model.predict(feature_frame)[0])
            score_source = "model"
        else:
            predicted_score = self._estimate_score_without_model(payload)
            score_source = "heuristic"

        top_player = None
        if self.player_model is not None:
            candidate_ids = self._candidate_player_ids(payload)
            candidate_frame = build_player_prediction_frame(
                {
                    "teamId": payload.get("team1Id"),
                    "oppositionTeamId": payload.get("team2Id"),
                    "venue": payload.get("venue"),
                    "season": payload.get("season"),
                    "inningsNumber": 1,
                    "venueAverageScore": payload.get("venueAverageScore", 165),
                },
                self.repository,
                candidate_ids,
            )
            if not candidate_frame.empty:
                candidate_predictions = self.player_model.predict(candidate_frame)
                candidate_frame = candidate_frame.copy()
                candidate_frame["predictedRuns"] = candidate_predictions
                top_row = candidate_frame.sort_values(by="predictedRuns", ascending=False).iloc[0]
                player = self.repository.get_player(str(top_row["playerId"]))
                top_player = {
                    "playerId": top_row["playerId"],
                    "name": player.get("name") if player else top_row["playerId"],
                    "predictedRuns": round(float(top_row["predictedRuns"]), 0),
                    "source": "model",
                }
        if top_player is None:
            top_player = self._estimate_top_player_without_model(payload)
            top_player["source"] = "heuristic"

        prediction = {
            "predictionKey": self._prediction_key(payload),
            "inputs": payload,
            "winnerPrediction": winner_prediction,
            "predictedScore": {
                "runs": predicted_score,
                "source": score_source,
            },
            "topPlayerPrediction": top_player,
            "confidence": round(float(winner_probability or 0.5), 3),
        }
        self.repository.store_prediction(prediction)
        return prediction
