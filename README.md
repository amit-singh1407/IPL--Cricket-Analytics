# IPL Analytics & Match Insights Platform

A production-style full-stack cricket analytics application built with Flask, React, Tailwind CSS, MongoDB Atlas, Pandas, NumPy, BeautifulSoup, Requests, and scikit-learn.

## What it does

- Responsive sports dashboard with modern gradients, cards, charts, tables, and AI-style insights
- Flask REST API with JWT authentication and MongoDB integration
- IPL/cricket scraping workflow for scorecards and player statistics
- Analytics services for batting average, strike rate, economy rate, win percentage, toss impact, venue performance, and consistency metrics
- Machine learning prediction module for match winner, predicted score, and top player forecasts
- Separate deployment paths for Vercel frontend and Render backend

## Tech Stack

- Backend: Python, Flask, Flask-RESTful, Flask-JWT-Extended, PyMongo
- Frontend: React, Vite, Tailwind CSS, Recharts, Axios
- Data: MongoDB Atlas, Pandas, NumPy
- Scraping: BeautifulSoup, Requests
- ML: scikit-learn, joblib

## Project Structure

```text
backend/
  app.py
  wsgi.py
  config/
  routes/
  models/
  scraper/
  analytics/
  ml/
  utils/

frontend/
  src/
    components/
    charts/
    hooks/
    layouts/
    pages/
    services/
    data/
```

## Backend Setup

1. Create a Python virtual environment inside `backend/`.
2. Install dependencies from `backend/requirements.txt`.
3. Copy `backend/.env.example` to `backend/.env` and fill in your MongoDB Atlas credentials.
4. Start the API with:

```bash
cd backend
python wsgi.py
```

The server runs on `http://localhost:5000` by default.

## Frontend Setup

1. Install dependencies inside `frontend/`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Point `VITE_API_URL` to the Flask backend.
4. Start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

- `FLASK_SECRET_KEY`
- `JWT_SECRET_KEY`
- `MONGO_URI`
- `MONGO_DB_NAME`
- `CORS_ORIGINS`
- `MODEL_DIR`
- `SCRAPE_INTERVAL_MINUTES`
- `SCRAPER_USER_AGENT`

### Frontend

- `VITE_API_URL`

## API Endpoints

See [docs/api.md](docs/api.md) for the full request and response contract.

Core endpoints:

- `GET /players`
- `GET /teams`
- `GET /matches`
- `GET /player/<id>`
- `GET /team/<id>`
- `GET /analytics/player`
- `GET /analytics/team`
- `POST /predict`
- `POST /login`
- `POST /register`

## MongoDB Collections

See [docs/schema.md](docs/schema.md) for the collection design.

Collections:

- `players`
- `teams`
- `matches`
- `scorecards`
- `seasons`
- `users`
- `predictions`

## Scraping Pipeline

- `backend/scraper/scorecard_scraper.py` uses Requests + BeautifulSoup to fetch and normalize scorecard content
- Duplicate protection is handled via upsert-based writes and unique indexes
- `backend/scraper/scheduler.py` provides a background scheduler wrapper for periodic scraping jobs

## ML Pipeline

- `backend/ml/trainer.py` trains winner, score, and player-run prediction models
- `backend/ml/predictor.py` returns model-backed predictions and falls back to heuristics when the artifact store is empty
- The design is intentionally data-driven so it can train from your MongoDB history once populated

## Deployment

### Backend on Render

- Use the included `render.yaml`
- Set the backend root directory to `backend`
- Start command: `gunicorn wsgi:app`

### Frontend on Vercel

- Use the included `frontend/vercel.json`
- Set `VITE_API_URL` to the Render backend URL
- Deploy the `frontend/` directory as a separate project

## Notes

- The frontend includes polished sample data so the dashboard remains presentable before the database is populated.
- The backend is structured so you can seed real IPL data, train the models, and wire the scraper to a live source without changing the app shape.
