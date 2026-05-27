from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from backend.ml.features import (
    build_match_feature_frame,
    build_player_feature_frame,
    build_score_feature_frame,
)


class ModelTrainer:
    def __init__(self, repository, artifact_dir):
        self.repository = repository
        self.artifact_dir = Path(artifact_dir)
        self.artifact_dir.mkdir(parents=True, exist_ok=True)

    def _build_pipeline(self, model, categorical_features: list[str], numeric_features: list[str]):
        preprocessor = ColumnTransformer(
            transformers=[
                (
                    "categorical",
                    Pipeline(
                        steps=[
                            ("imputer", SimpleImputer(strategy="most_frequent")),
                            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                        ]
                    ),
                    categorical_features,
                ),
                (
                    "numeric",
                    Pipeline(
                        steps=[
                            ("imputer", SimpleImputer(strategy="median")),
                        ]
                    ),
                    numeric_features,
                ),
            ]
        )
        return Pipeline([("preprocessor", preprocessor), ("model", model)])

    def _save_model(self, name: str, pipeline):
        model_path = self.artifact_dir / name
        joblib.dump(pipeline, model_path)
        return model_path

    def _train_if_possible(self, X: pd.DataFrame, y: pd.Series, pipeline, minimum_rows: int = 12):
        if X.empty or y.empty or len(X) < minimum_rows or len(set(y.astype(str))) < 2:
            return None
        pipeline.fit(X, y)
        return pipeline

    def train_winner_model(self):
        matches = list(self.repository.collection("matches").find({}))
        X, y = build_match_feature_frame(matches, self.repository)
        pipeline = self._build_pipeline(
            RandomForestClassifier(n_estimators=200, random_state=42),
            categorical_features=["team1Id", "team2Id", "venue", "season", "tossWinnerId", "tossDecision"],
            numeric_features=["team1WinPercentage", "team2WinPercentage", "team1AverageScore", "team2AverageScore", "venueAverageScore", "venueWinRateTeam1", "venueWinRateTeam2"],
        )
        fitted = self._train_if_possible(X, y, pipeline)
        if fitted is not None:
            self._save_model("winner_model.joblib", fitted)
        return fitted

    def train_score_model(self):
        scorecards = list(self.repository.collection("scorecards").find({}))
        X, y = build_score_feature_frame(scorecards, self.repository)
        pipeline = self._build_pipeline(
            RandomForestRegressor(n_estimators=200, random_state=42),
            categorical_features=["battingTeamId", "bowlingTeamId", "venue", "season"],
            numeric_features=["inningsNumber", "teamWinPercentage", "oppositionWinPercentage", "teamAverageScore", "oppositionAverageScore", "venueAverageScore"],
        )
        fitted = self._train_if_possible(X, y, pipeline)
        if fitted is not None:
            self._save_model("score_model.joblib", fitted)
        return fitted

    def train_player_model(self):
        scorecards = list(self.repository.collection("scorecards").find({}))
        X, y = build_player_feature_frame(scorecards, self.repository)
        pipeline = self._build_pipeline(
            RandomForestRegressor(n_estimators=250, random_state=42),
            categorical_features=["playerId", "teamId", "oppositionTeamId", "venue", "season"],
            numeric_features=["inningsNumber", "playerBattingAverage", "playerStrikeRate", "playerRunsCareer", "playerBallsCareer", "teamWinPercentage", "oppositionWinPercentage", "venueAverageScore"],
        )
        fitted = self._train_if_possible(X, y, pipeline)
        if fitted is not None:
            self._save_model("player_model.joblib", fitted)
        return fitted

    def train_all(self):
        winner = self.train_winner_model()
        score = self.train_score_model()
        player = self.train_player_model()
        return {
            "winnerModelTrained": winner is not None,
            "scoreModelTrained": score is not None,
            "playerModelTrained": player is not None,
            "artifacts": [str(path) for path in self.artifact_dir.glob("*.joblib")],
        }
