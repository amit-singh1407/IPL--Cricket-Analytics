from __future__ import annotations

from collections import defaultdict
from typing import Any

import numpy as np
import pandas as pd

from utils.db import serialize_document


MATCH_FEATURE_COLUMNS = [
    "team1Id",
    "team2Id",
    "venue",
    "season",
    "tossWinnerId",
    "tossDecision",
    "team1WinPercentage",
    "team2WinPercentage",
    "team1AverageScore",
    "team2AverageScore",
    "venueAverageScore",
    "venueWinRateTeam1",
    "venueWinRateTeam2",
]

SCORE_FEATURE_COLUMNS = [
    "battingTeamId",
    "bowlingTeamId",
    "venue",
    "season",
    "inningsNumber",
    "teamWinPercentage",
    "oppositionWinPercentage",
    "teamAverageScore",
    "oppositionAverageScore",
    "venueAverageScore",
]

PLAYER_FEATURE_COLUMNS = [
    "playerId",
    "teamId",
    "oppositionTeamId",
    "venue",
    "season",
    "inningsNumber",
    "playerBattingAverage",
    "playerStrikeRate",
    "playerRunsCareer",
    "playerBallsCareer",
    "teamWinPercentage",
    "oppositionWinPercentage",
    "venueAverageScore",
]


def _team_lookup(repository):
    teams = list(repository.collection("teams").find({}))
    return {team.get("teamId"): serialize_document(team) for team in teams if team.get("teamId")}


def _player_lookup(repository):
    players = list(repository.collection("players").find({}))
    return {player.get("playerId"): serialize_document(player) for player in players if player.get("playerId")}


def _team_stat(team: dict[str, Any] | None, path: list[str], default=0):
    current = team or {}
    for segment in path:
        if not isinstance(current, dict):
            return default
        current = current.get(segment, default)
    return current if current is not None else default


def build_match_feature_frame(matches: list[dict[str, Any]], repository):
    teams = _team_lookup(repository)
    rows: list[dict[str, Any]] = []
    targets: list[str] = []
    for match in matches:
        winner_id = match.get("winnerId")
        team1_id = match.get("team1Id")
        team2_id = match.get("team2Id")
        if not winner_id or not team1_id or not team2_id:
            continue
        team1 = teams.get(team1_id, {})
        team2 = teams.get(team2_id, {})
        rows.append(
            {
                "team1Id": team1_id,
                "team2Id": team2_id,
                "venue": match.get("venue") or "unknown",
                "season": match.get("season") or "unknown",
                "tossWinnerId": match.get("tossWinnerId") or "unknown",
                "tossDecision": match.get("tossDecision") or "unknown",
                "team1WinPercentage": _team_stat(team1, ["stats", "winPercentage"], 50),
                "team2WinPercentage": _team_stat(team2, ["stats", "winPercentage"], 50),
                "team1AverageScore": _team_stat(team1, ["stats", "averageScore"], 165),
                "team2AverageScore": _team_stat(team2, ["stats", "averageScore"], 165),
                "venueAverageScore": match.get("venueAverageScore", 165),
                "venueWinRateTeam1": match.get("venueWinRateTeam1", 50),
                "venueWinRateTeam2": match.get("venueWinRateTeam2", 50),
            }
        )
        targets.append(winner_id)
    return pd.DataFrame(rows), pd.Series(targets, name="winnerId")


def build_score_feature_frame(scorecards: list[dict[str, Any]], repository):
    teams = _team_lookup(repository)
    rows: list[dict[str, Any]] = []
    targets: list[float] = []
    for scorecard in scorecards:
        batting_team_id = scorecard.get("battingTeamId")
        bowling_team_id = scorecard.get("bowlingTeamId")
        total_runs = _team_stat(scorecard, ["total", "runs"], scorecard.get("totalRuns", 0))
        rows.append(
            {
                "battingTeamId": batting_team_id or "unknown",
                "bowlingTeamId": bowling_team_id or "unknown",
                "venue": scorecard.get("venue") or "unknown",
                "season": scorecard.get("season") or "unknown",
                "inningsNumber": scorecard.get("inningsNumber", 1),
                "teamWinPercentage": _team_stat(teams.get(batting_team_id), ["stats", "winPercentage"], 50),
                "oppositionWinPercentage": _team_stat(teams.get(bowling_team_id), ["stats", "winPercentage"], 50),
                "teamAverageScore": _team_stat(teams.get(batting_team_id), ["stats", "averageScore"], 165),
                "oppositionAverageScore": _team_stat(teams.get(bowling_team_id), ["stats", "averageScore"], 165),
                "venueAverageScore": scorecard.get("venueAverageScore", 165),
            }
        )
        targets.append(float(total_runs or 0))
    return pd.DataFrame(rows), pd.Series(targets, name="totalRuns")


def build_player_feature_frame(scorecards: list[dict[str, Any]], repository):
    teams = _team_lookup(repository)
    players = _player_lookup(repository)
    rows: list[dict[str, Any]] = []
    targets: list[float] = []
    for scorecard in scorecards:
        batting_team_id = scorecard.get("battingTeamId")
        bowling_team_id = scorecard.get("bowlingTeamId")
        venue = scorecard.get("venue") or "unknown"
        season = scorecard.get("season") or "unknown"
        innings_number = scorecard.get("inningsNumber", 1)
        for batting_entry in scorecard.get("batting") or []:
            player_id = batting_entry.get("playerId")
            player = players.get(player_id, {})
            batting_stats = player.get("batting", {}) if isinstance(player, dict) else {}
            rows.append(
                {
                    "playerId": player_id or "unknown",
                    "teamId": batting_team_id or "unknown",
                    "oppositionTeamId": bowling_team_id or "unknown",
                    "venue": venue,
                    "season": season,
                    "inningsNumber": innings_number,
                    "playerBattingAverage": batting_stats.get("average", batting_entry.get("battingAverage", 0)),
                    "playerStrikeRate": batting_stats.get("strikeRate", batting_entry.get("strikeRate", 0)),
                    "playerRunsCareer": batting_stats.get("runs", batting_entry.get("playerRunsCareer", 0)),
                    "playerBallsCareer": batting_stats.get("ballsFaced", batting_entry.get("playerBallsCareer", 0)),
                    "teamWinPercentage": _team_stat(teams.get(batting_team_id), ["stats", "winPercentage"], 50),
                    "oppositionWinPercentage": _team_stat(teams.get(bowling_team_id), ["stats", "winPercentage"], 50),
                    "venueAverageScore": scorecard.get("venueAverageScore", 165),
                }
            )
            targets.append(float(batting_entry.get("runs", 0)))
    return pd.DataFrame(rows), pd.Series(targets, name="runs")


def build_prediction_feature_row(payload: dict[str, Any], repository):
    teams = _team_lookup(repository)
    team1 = teams.get(payload.get("team1Id"), {})
    team2 = teams.get(payload.get("team2Id"), {})
    return pd.DataFrame([
        {
            "team1Id": payload.get("team1Id") or "unknown",
            "team2Id": payload.get("team2Id") or "unknown",
            "venue": payload.get("venue") or "unknown",
            "season": payload.get("season") or "unknown",
            "tossWinnerId": payload.get("tossWinnerId") or "unknown",
            "tossDecision": payload.get("tossDecision") or "unknown",
            "team1WinPercentage": _team_stat(team1, ["stats", "winPercentage"], 50),
            "team2WinPercentage": _team_stat(team2, ["stats", "winPercentage"], 50),
            "team1AverageScore": _team_stat(team1, ["stats", "averageScore"], 165),
            "team2AverageScore": _team_stat(team2, ["stats", "averageScore"], 165),
            "venueAverageScore": payload.get("venueAverageScore", 165),
            "venueWinRateTeam1": payload.get("venueWinRateTeam1", 50),
            "venueWinRateTeam2": payload.get("venueWinRateTeam2", 50),
        }
    ])


def build_player_prediction_frame(payload: dict[str, Any], repository, player_ids: list[str]):
    teams = _team_lookup(repository)
    players = _player_lookup(repository)
    team_id = payload.get("teamId")
    opposition_team_id = payload.get("oppositionTeamId")
    venue = payload.get("venue") or "unknown"
    season = payload.get("season") or "unknown"
    innings_number = payload.get("inningsNumber", 1)
    rows: list[dict[str, Any]] = []
    for player_id in player_ids:
        player = players.get(player_id, {})
        batting_stats = player.get("batting", {}) if isinstance(player, dict) else {}
        rows.append(
            {
                "playerId": player_id,
                "teamId": team_id or "unknown",
                "oppositionTeamId": opposition_team_id or "unknown",
                "venue": venue,
                "season": season,
                "inningsNumber": innings_number,
                "playerBattingAverage": batting_stats.get("average", 0),
                "playerStrikeRate": batting_stats.get("strikeRate", 0),
                "playerRunsCareer": batting_stats.get("runs", 0),
                "playerBallsCareer": batting_stats.get("ballsFaced", 0),
                "teamWinPercentage": _team_stat(teams.get(team_id), ["stats", "winPercentage"], 50),
                "oppositionWinPercentage": _team_stat(teams.get(opposition_team_id), ["stats", "winPercentage"], 50),
                "venueAverageScore": payload.get("venueAverageScore", 165),
            }
        )
    return pd.DataFrame(rows)
