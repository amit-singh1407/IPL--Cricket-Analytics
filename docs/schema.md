# MongoDB Schema Design

## `players`

```json
{
  "_id": "ObjectId",
  "playerId": "virat-kohli",
  "name": "Virat Kohli",
  "teamId": "rcb",
  "role": "Batter",
  "seasons": ["2025", "2024"],
  "batting": {
    "runs": 741,
    "ballsFaced": 483,
    "dismissals": 19,
    "average": 38.9,
    "strikeRate": 153.4,
    "fours": 68,
    "sixes": 28
  },
  "bowling": {
    "overs": 0,
    "runsConceded": 0,
    "wickets": 0,
    "economy": 0
  },
  "career": {
    "matches": 16,
    "innings": 16,
    "notOuts": 3,
    "wins": 10
  }
}
```

## `teams`

```json
{
  "_id": "ObjectId",
  "teamId": "csk",
  "name": "Chennai Super Kings",
  "shortName": "CSK",
  "city": "Chennai",
  "colors": ["#facc15", "#f59e0b"],
  "seasons": ["2025", "2024"],
  "stats": {
    "played": 74,
    "won": 50,
    "lost": 24,
    "points": 20,
    "winPercentage": 67.6,
    "averageScore": 171,
    "tossImpact": 61.2
  }
}
```

## `matches`

```json
{
  "_id": "ObjectId",
  "matchId": "ipl-2025-001",
  "season": "2025",
  "date": "2025-04-11",
  "venue": "Chepauk",
  "team1Id": "csk",
  "team2Id": "mi",
  "tossWinnerId": "mi",
  "tossDecision": "field",
  "winnerId": "csk",
  "winnerName": "Chennai Super Kings",
  "resultType": "runs",
  "margin": 18,
  "scoreline": "184/5 - 166/8"
}
```

## `scorecards`

```json
{
  "_id": "ObjectId",
  "scorecardId": "scorecard-123",
  "matchId": "ipl-2025-001",
  "season": "2025",
  "venue": "Chepauk",
  "battingTeamId": "csk",
  "bowlingTeamId": "mi",
  "inningsNumber": 1,
  "batting": [
    {
      "playerId": "virat-kohli",
      "playerName": "Virat Kohli",
      "runs": 71,
      "balls": 43,
      "fours": 6,
      "sixes": 2,
      "dismissal": "caught"
    }
  ],
  "bowling": [
    {
      "playerId": "jasprit-bumrah",
      "playerName": "Jasprit Bumrah",
      "overs": 4,
      "runsConceded": 26,
      "wickets": 2,
      "economy": 6.5
    }
  ],
  "total": {
    "runs": 184,
    "wickets": 5,
    "overs": 20
  }
}
```

## `users`

```json
{
  "_id": "ObjectId",
  "name": "Amit Singh",
  "email": "analyst@example.com",
  "passwordHash": "...",
  "role": "fan",
  "favoriteTeams": ["csk", "mi"],
  "createdAt": "2025-05-27T00:00:00Z"
}
```

## `predictions`

```json
{
  "_id": "ObjectId",
  "predictionKey": "sha1-hash",
  "inputs": {},
  "winnerPrediction": {},
  "predictedScore": {},
  "topPlayerPrediction": {},
  "confidence": 0.82,
  "createdAt": "2025-05-27T00:00:00Z"
}
```

## Index Strategy

- `users.email` unique
- `players.playerId` unique
- `teams.teamId` unique
- `matches.matchId` unique
- `scorecards.scorecardId` unique
- `predictions.predictionKey` unique
- text-friendly lookups on `name`, `venue`, and `season` fields where needed
