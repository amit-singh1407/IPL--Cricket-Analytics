from __future__ import annotations

from collections.abc import Sequence
from typing import Any, cast

import numpy as np
import pandas as pd

from utils.db import serialize_document


class AnalyticsService:
    def __init__(self, repository):
        self.repository = repository

    def _load_documents(self, collection_name: str, query: dict[str, Any]) -> list[dict[str, Any]]:
        documents = list(self.repository.collection(collection_name).find(query))
        normalized_documents: list[dict[str, Any]] = []
        for document in documents:
            serialized_document = serialize_document(document)
            if serialized_document is not None:
                normalized_documents.append(serialized_document)
        return normalized_documents

    def _safe_numeric(self, frame: pd.DataFrame, column: str, default: float = 0.0):
        if column not in frame.columns:
            return pd.Series([default] * len(frame), index=frame.index, dtype="float64")
        numeric_series = pd.to_numeric(frame[column], errors="coerce")
        if isinstance(numeric_series, pd.Series):
            return numeric_series.fillna(default)
        return pd.Series([default] * len(frame), index=frame.index, dtype="float64")

    def _sort_frame(self, frame: pd.DataFrame, column: str) -> pd.DataFrame:
        return cast(Any, frame).sort_values(by=[column], ascending=False)

    def _frame_records(
        self,
        frame: pd.DataFrame,
        columns: Sequence[str] | None = None,
        rename_map: dict[str, str] | None = None,
    ) -> list[dict[str, Any]]:
        working_frame: Any = frame
        if columns:
            available_columns = [column for column in columns if column in frame.columns]
            working_frame = working_frame[available_columns]
        if rename_map:
            working_frame = working_frame.rename(columns=rename_map)
        return cast(Any, working_frame).to_dict(orient="records")

    def _empty_player_metrics(self):
        return {
            "summary": {
                "totalPlayers": 0,
                "averageBattingAverage": 0,
                "averageStrikeRate": 0,
                "averageEconomyRate": 0,
                "topScorers": [],
                "mostConsistent": [],
            },
            "charts": {
                "battingAverage": [],
                "strikeRate": [],
                "economyRate": [],
                "consistency": [],
            },
            "table": [],
        }

    def _empty_team_metrics(self):
        return {
            "summary": {
                "totalTeams": 0,
                "averageWinPercentage": 0,
                "bestWinTeam": None,
                "bestTossImpact": None,
            },
            "charts": {
                "winPercentage": [],
                "tossImpact": [],
                "venuePerformance": [],
            },
            "table": [],
        }

    def _batting_rows_from_scorecards(self, scorecards: Sequence[dict[str, Any]]):
        rows: list[dict[str, Any]] = []
        for scorecard in scorecards:
            batting_rows = scorecard.get("batting") or []
            for batting in batting_rows:
                row = {
                    "matchId": scorecard.get("matchId"),
                    "scorecardId": scorecard.get("scorecardId"),
                    "season": scorecard.get("season"),
                    "venue": scorecard.get("venue"),
                    "battingTeamId": scorecard.get("battingTeamId"),
                    "bowlingTeamId": scorecard.get("bowlingTeamId"),
                    "inningsNumber": scorecard.get("inningsNumber", 1),
                }
                row.update(batting)
                rows.append(row)
        return rows

    def player_metrics(self, season: str | None = None, team_id: str | None = None, player_id: str | None = None):
        query: dict[str, Any] = {}
        if season:
            query["seasons"] = season
        if team_id:
            query["teamId"] = team_id
        if player_id:
            query["$or"] = [{"playerId": player_id}, {"_id": player_id}]

        player_docs = self._load_documents("players", query)
        scorecard_query: dict[str, Any] = {}
        if season:
            scorecard_query["season"] = season
        if team_id:
            scorecard_query["$or"] = [{"battingTeamId": team_id}, {"bowlingTeamId": team_id}]
        scorecards = self._load_documents("scorecards", scorecard_query)

        players_df = pd.json_normalize(player_docs) if player_docs else pd.DataFrame()
        batting_df = pd.DataFrame(self._batting_rows_from_scorecards(scorecards))

        if players_df.empty and batting_df.empty:
            return self._empty_player_metrics()

        if players_df.empty:
            players_df = pd.DataFrame(columns=["playerId", "name", "teamId", "batting.runs", "batting.ballsFaced", "batting.dismissals", "batting.average", "batting.strikeRate", "bowling.overs", "bowling.runsConceded"])

        if "playerId" not in players_df.columns and "id" in players_df.columns:
            players_df["playerId"] = players_df["id"]

        if not batting_df.empty:
            batting_grouped = batting_df.groupby(["playerId", "playerName"], dropna=False).agg(
                innings=("runs", "count"),
                runs=("runs", "sum"),
                balls=("balls", "sum"),
                fours=("fours", "sum"),
                sixes=("sixes", "sum"),
                highestScore=("runs", "max"),
            ).reset_index()
            batting_grouped["dismissals"] = batting_grouped["innings"].clip(lower=1)
            batting_grouped["battingAverage"] = batting_grouped["runs"] / batting_grouped["dismissals"]
            batting_grouped["strikeRate"] = np.where(batting_grouped["balls"] > 0, batting_grouped["runs"] / batting_grouped["balls"] * 100, 0)
            batting_grouped["consistency"] = batting_grouped["runs"] / (batting_grouped["highestScore"].replace(0, 1))
        else:
            batting_grouped = pd.DataFrame(columns=["playerId", "playerName", "innings", "runs", "balls", "fours", "sixes", "highestScore", "dismissals", "battingAverage", "strikeRate", "consistency"])

        if not players_df.empty:
            players_df["battingRuns"] = self._safe_numeric(players_df, "batting.runs")
            players_df["battingBalls"] = self._safe_numeric(players_df, "batting.ballsFaced")
            players_df["battingDismissals"] = self._safe_numeric(players_df, "batting.dismissals", 1)
            players_df["battingAverage"] = self._safe_numeric(players_df, "batting.average")
            players_df["strikeRate"] = self._safe_numeric(players_df, "batting.strikeRate")
            players_df["bowlingOvers"] = self._safe_numeric(players_df, "bowling.overs")
            players_df["runsConceded"] = self._safe_numeric(players_df, "bowling.runsConceded")
            players_df["economyRate"] = np.where(players_df["bowlingOvers"] > 0, players_df["runsConceded"] / players_df["bowlingOvers"], 0)
            players_df["consistency"] = np.where(players_df["battingAverage"] > 0, players_df["battingAverage"] / (players_df["strikeRate"].replace(0, 1) / 100), 0)
        else:
            players_df["playerId"] = batting_grouped["playerId"]
            players_df["name"] = batting_grouped["playerName"]
            players_df["teamId"] = None
            players_df["battingAverage"] = batting_grouped["battingAverage"]
            players_df["strikeRate"] = batting_grouped["strikeRate"]
            players_df["economyRate"] = 0
            players_df["consistency"] = batting_grouped["consistency"]

        if not batting_grouped.empty and "playerId" in players_df.columns:
            players_df = players_df.merge(
                batting_grouped[["playerId", "playerName", "runs", "battingAverage", "strikeRate", "consistency"]],
                on="playerId",
                how="left",
                suffixes=("", "_history"),
            )
            players_df["battingAverage"] = players_df["battingAverage_history"].fillna(players_df.get("battingAverage", 0))
            players_df["strikeRate"] = players_df["strikeRate_history"].fillna(players_df.get("strikeRate", 0))
            players_df["consistency"] = players_df["consistency_history"].fillna(players_df.get("consistency", 0))
            if "runs_history" in players_df.columns:
                players_df["battingRuns"] = players_df["runs_history"].fillna(players_df.get("battingRuns", 0))

        players_df["battingAverage"] = self._safe_numeric(players_df, "battingAverage")
        players_df["strikeRate"] = self._safe_numeric(players_df, "strikeRate")
        players_df["economyRate"] = self._safe_numeric(players_df, "economyRate")
        players_df["consistency"] = self._safe_numeric(players_df, "consistency")
        players_df["battingRuns"] = self._safe_numeric(players_df, "battingRuns")
        players_df["battingBalls"] = self._safe_numeric(players_df, "battingBalls")

        if player_id and "playerId" in players_df.columns:
            players_df = players_df[players_df["playerId"] == player_id]

        top_scorers = self._sort_frame(players_df, "battingRuns").head(10)
        most_consistent = self._sort_frame(players_df, "consistency").head(10)
        chart_frame = self._sort_frame(players_df, "battingRuns").head(10)

        top_scorers_records = self._frame_records(top_scorers, ["playerId", "name", "teamName", "battingRuns"], {"battingRuns": "runs"})
        most_consistent_records = self._frame_records(most_consistent, ["playerId", "name", "teamName", "consistency"])
        batting_average_records = self._frame_records(chart_frame, ["name", "battingAverage"], {"battingAverage": "value"})
        strike_rate_records = self._frame_records(chart_frame, ["name", "strikeRate"], {"strikeRate": "value"})
        economy_rate_records = self._frame_records(chart_frame, ["name", "economyRate"], {"economyRate": "value"})
        consistency_records = self._frame_records(chart_frame, ["name", "consistency"], {"consistency": "value"})
        table_records = self._frame_records(players_df, ["id", "playerId", "name", "teamName", "role", "battingAverage", "strikeRate", "economyRate", "consistency"])

        return {
            "summary": {
                "totalPlayers": int(len(players_df)),
                "averageBattingAverage": round(float(players_df["battingAverage"].mean() or 0), 2),
                "averageStrikeRate": round(float(players_df["strikeRate"].mean() or 0), 2),
                "averageEconomyRate": round(float(players_df["economyRate"].mean() or 0), 2),
                "topScorers": top_scorers_records,
                "mostConsistent": most_consistent_records,
            },
            "charts": {
                "battingAverage": batting_average_records,
                "strikeRate": strike_rate_records,
                "economyRate": economy_rate_records,
                "consistency": consistency_records,
            },
            "table": table_records,
        }

    def team_metrics(self, season: str | None = None, team_id: str | None = None):
        query: dict[str, Any] = {}
        if season:
            query["seasons"] = season
        if team_id:
            query["$or"] = [{"teamId": team_id}, {"_id": team_id}]

        team_docs = self._load_documents("teams", query)
        match_query: dict[str, Any] = {}
        if season:
            match_query["season"] = season
        if team_id:
            match_query["$or"] = [{"team1Id": team_id}, {"team2Id": team_id}, {"winnerId": team_id}]
        match_docs = self._load_documents("matches", match_query)

        teams_df = pd.json_normalize(team_docs) if team_docs else pd.DataFrame()
        matches_df = pd.json_normalize(match_docs) if match_docs else pd.DataFrame()

        if teams_df.empty and matches_df.empty:
            return self._empty_team_metrics()

        if teams_df.empty:
            team_ids = pd.unique(matches_df[[col for col in ["team1Id", "team2Id", "winnerId"] if col in matches_df.columns]].values.ravel("K"))
            teams_df = pd.DataFrame({"teamId": [team_id for team_id in team_ids if pd.notna(team_id)], "name": [team_id for team_id in team_ids if pd.notna(team_id)]})

        if "teamId" not in teams_df.columns and "id" in teams_df.columns:
            teams_df["teamId"] = teams_df["id"]

        records: list[dict[str, Any]] = []
        for _, team in teams_df.iterrows():
            current_team_id = team.get("teamId")
            played_mask = (matches_df.get("team1Id") == current_team_id) | (matches_df.get("team2Id") == current_team_id)
            wins_mask = matches_df.get("winnerId") == current_team_id
            toss_wins_mask = matches_df.get("tossWinnerId") == current_team_id
            played = int(played_mask.sum()) if not matches_df.empty else int(team.get("stats.played", 0) or 0)
            wins = int(wins_mask.sum()) if not matches_df.empty else int(team.get("stats.won", 0) or 0)
            toss_wins = int(toss_wins_mask.sum()) if not matches_df.empty else 0
            toss_conversion = round(float((wins_mask & toss_wins_mask).sum() / max(toss_wins, 1) * 100), 2) if not matches_df.empty else float(team.get("stats.tossImpact", 0) or 0)
            win_percentage = round(float(wins / max(played, 1) * 100), 2)
            records.append(
                {
                    "id": team.get("id"),
                    "teamId": current_team_id,
                    "name": team.get("name") or current_team_id,
                    "shortName": team.get("shortName"),
                    "city": team.get("city"),
                    "played": played,
                    "won": wins,
                    "lost": max(played - wins, 0),
                    "winPercentage": win_percentage,
                    "tossImpact": toss_conversion,
                    "tossWins": toss_wins,
                    "points": int(team.get("stats.points", 0) or team.get("points", 0) or 0),
                }
            )

        summary_frame = pd.DataFrame(records)
        if summary_frame.empty:
            return self._empty_team_metrics()

        summary_frame = self._sort_frame(summary_frame, "winPercentage")
        best_win_team = summary_frame.iloc[0].to_dict() if not summary_frame.empty else None
        best_toss_team = self._sort_frame(summary_frame, "tossImpact").iloc[0].to_dict() if not summary_frame.empty else None

        venue_frame = pd.DataFrame()
        if not matches_df.empty and "venue" in matches_df.columns:
            venue_frame = matches_df.groupby("venue").agg(
                matches=("venue", "count"),
            ).reset_index()
            venue_frame["value"] = np.where(venue_frame["matches"] > 0, venue_frame["matches"], 0)
            venue_frame = venue_frame.sort_values(by="matches", ascending=False).head(10)

        return {
            "summary": {
                "totalTeams": int(len(summary_frame)),
                "averageWinPercentage": round(float(summary_frame["winPercentage"].mean() or 0), 2),
                "bestWinTeam": best_win_team,
                "bestTossImpact": best_toss_team,
            },
            "charts": {
                "winPercentage": self._frame_records(summary_frame.head(10), ["name", "winPercentage"], {"winPercentage": "value"}),
                "tossImpact": self._frame_records(summary_frame.head(10), ["name", "tossImpact"], {"tossImpact": "value"}),
                "venuePerformance": self._frame_records(venue_frame, ["venue", "value"], {"venue": "name"}) if not venue_frame.empty else [],
            },
            "table": self._frame_records(summary_frame, ["id", "teamId", "name", "shortName", "city", "played", "won", "lost", "winPercentage", "tossImpact", "points"]),
        }
