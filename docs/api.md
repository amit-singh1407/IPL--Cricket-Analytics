# API Documentation

Base URL: `http://localhost:5000`

## Data Endpoints

### `GET /players`
Query params: `page`, `limit`, `season`, `teamId`, `team`, `role`, `q`, `search`

### `GET /player/<id>`
Returns a single player and embedded analytics.

### `GET /teams`
Query params: `page`, `limit`, `season`, `q`, `search`

### `GET /team/<id>`
Returns a single team and embedded analytics.

### `GET /matches`
Query params: `page`, `limit`, `season`, `teamId`, `team`, `venue`, `q`, `search`

### `GET /match/<id>`
Returns a single match document.

## Analytics

### `GET /analytics/player`
Query params: `season`, `teamId`, `team`, `playerId`

Response shape:

```json
{
  "summary": {},
  "charts": {},
  "table": []
}
```

### `GET /analytics/team`
Query params: `season`, `teamId`, `team`

## Predictions

### `POST /predict`
Generates winner, score, and top player predictions.

Request body:

```json
{
  "team1Id": "csk",
  "team2Id": "mi",
  "venue": "Chepauk",
  "season": "2025",
  "tossWinnerId": "mi",
  "tossDecision": "field",
  "venueAverageScore": 168
}
```

Response fields:

- `winnerPrediction`
- `predictedScore`
- `topPlayerPrediction`
- `confidence`

## Common Response Envelope

All successful responses use this shape:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Errors return:

```json
{
  "success": false,
  "message": "Human readable error"
}
```
