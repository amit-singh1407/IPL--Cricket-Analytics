from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha1
from typing import Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


class CricketScraper:
    def __init__(self, repository, user_agent: str = "IPL-Analytics-Platform/1.0", timeout: int = 20):
        self.repository = repository
        self.user_agent = user_agent
        self.timeout = timeout

    def _fetch_html(self, url: str):
        response = requests.get(url, headers={"User-Agent": self.user_agent}, timeout=self.timeout)
        response.raise_for_status()
        return response.text

    def _slug_id(self, value: str):
        return sha1(value.encode("utf-8")).hexdigest()[:16]

    def _parse_table(self, table) -> list[dict[str, Any]]:
        headers = [cell.get_text(" ", strip=True) for cell in table.find_all("th")]
        rows: list[dict[str, Any]] = []
        for row in table.find_all("tr"):
            cells = [cell.get_text(" ", strip=True) for cell in row.find_all(["td", "th"])]
            if not cells or cells == headers:
                continue
            entry = {headers[index] if index < len(headers) else f"col_{index}": value for index, value in enumerate(cells)}
            rows.append(entry)
        return rows

    def _extract_batting_rows(self, table_rows: list[dict[str, Any]]):
        batting_rows: list[dict[str, Any]] = []
        for row in table_rows:
            runs = row.get("R", row.get("Runs", row.get("RUNS", 0)))
            balls = row.get("B", row.get("Balls", row.get("BALLS", 0)))
            batting_rows.append(
                {
                    "playerName": row.get("Batter") or row.get("Player") or row.get("BATTER") or row.get("Name"),
                    "playerId": self._slug_id((row.get("Batter") or row.get("Player") or row.get("Name") or "unknown").lower()),
                    "runs": int(float(runs or 0)),
                    "balls": int(float(balls or 0)),
                    "fours": int(float(row.get("4s", row.get("Fours", 0)) or 0)),
                    "sixes": int(float(row.get("6s", row.get("Sixes", 0)) or 0)),
                    "dismissal": row.get("Dismissal", row.get("Out", "")),
                }
            )
        return batting_rows

    def _extract_bowling_rows(self, table_rows: list[dict[str, Any]]):
        bowling_rows: list[dict[str, Any]] = []
        for row in table_rows:
            overs = row.get("O", row.get("Overs", row.get("OVERS", 0)))
            wickets = row.get("W", row.get("Wickets", row.get("WICKET", 0)))
            runs_conceded = row.get("R", row.get("Runs", row.get("RUNS", 0)))
            bowling_rows.append(
                {
                    "playerName": row.get("Bowler") or row.get("Player") or row.get("Name"),
                    "playerId": self._slug_id((row.get("Bowler") or row.get("Player") or row.get("Name") or "unknown").lower()),
                    "overs": float(overs or 0),
                    "wickets": int(float(wickets or 0)),
                    "runsConceded": int(float(runs_conceded or 0)),
                    "economy": float(row.get("Econ", row.get("Economy", 0)) or 0),
                }
            )
        return bowling_rows

    def scrape_scorecard(self, url: str):
        html = self._fetch_html(url)
        soup = BeautifulSoup(html, "html.parser")
        title = (soup.find("h1") or soup.find("title") or soup).get_text(" ", strip=True)[:180]
        parsed_url = urlparse(url)
        match_id = self._slug_id(parsed_url.path or title or url)
        scorecard_id = f"scorecard-{match_id}"
        scorecard = {
            "scorecardId": scorecard_id,
            "matchId": match_id,
            "sourceUrl": url,
            "title": title,
            "season": self._extract_season(title),
            "venue": self._extract_venue(soup),
            "battingTeamId": None,
            "bowlingTeamId": None,
            "inningsNumber": 1,
            "batting": [],
            "bowling": [],
            "total": {"runs": 0, "wickets": 0, "overs": 0},
            "scrapedAt": datetime.now(timezone.utc),
        }

        tables = soup.find_all("table")
        for table in tables:
            table_rows = self._parse_table(table)
            headers = [cell.get_text(" ", strip=True).lower() for cell in table.find_all("th")]
            header_blob = " ".join(headers)
            if any(keyword in header_blob for keyword in ["batter", "runs", "balls"]):
                batting_rows = self._extract_batting_rows(table_rows)
                if batting_rows:
                    scorecard["batting"].extend(batting_rows)
                    scorecard["total"]["runs"] = sum(item["runs"] for item in batting_rows)
            elif any(keyword in header_blob for keyword in ["bowler", "wickets", "overs", "economy"]):
                bowling_rows = self._extract_bowling_rows(table_rows)
                if bowling_rows:
                    scorecard["bowling"].extend(bowling_rows)

        teams = self._extract_teams(soup)
        if teams:
            scorecard["battingTeamId"] = teams[0].get("teamId")
            scorecard["bowlingTeamId"] = teams[1].get("teamId") if len(teams) > 1 else None

        match = {
            "matchId": match_id,
            "sourceUrl": url,
            "title": title,
            "season": scorecard["season"],
            "venue": scorecard["venue"],
            "teams": teams,
            "status": "scraped",
            "scrapedAt": datetime.now(timezone.utc),
        }
        return {"match": match, "scorecard": scorecard}

    def _extract_season(self, title: str):
        for token in title.split():
            if token.isdigit() and len(token) == 4:
                return token
        return None

    def _extract_venue(self, soup: BeautifulSoup):
        venue_node = soup.select_one("[data-venue], .venue, .match-venue")
        if venue_node:
            return venue_node.get_text(" ", strip=True)
        return None

    def _extract_teams(self, soup: BeautifulSoup):
        team_nodes = soup.select(".team-name, [data-team], .match-team")
        teams = []
        for team_node in team_nodes[:2]:
            name = team_node.get_text(" ", strip=True)
            if name:
                teams.append(
                    {
                        "teamId": self._slug_id(name.lower()),
                        "name": name,
                    }
                )
        return teams

    def scrape_and_store(self, urls: list[str]):
        results = []
        for url in urls:
            payload = self.scrape_scorecard(url)
            self.repository.upsert_match(payload["match"])
            self.repository.upsert_scorecard(payload["scorecard"])
            results.append(payload)
        return results
