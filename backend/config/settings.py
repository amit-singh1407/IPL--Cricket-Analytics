from __future__ import annotations

from datetime import timedelta
from pathlib import Path
import os

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env", override=False)
load_dotenv(BASE_DIR.parent / ".env", override=False)


def _parse_csv_env(name: str, default: str) -> list[str]:
    raw_value = os.getenv(name, default)
    return [item.strip() for item in raw_value.split(",") if item.strip()]


def _unique_items(items: list[str]) -> list[str]:
    unique: list[str] = []
    seen: set[str] = set()
    for item in items:
        if item and item not in seen:
            unique.append(item)
            seen.add(item)
    return unique


class Settings:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ipl_analytics")
    CORS_ORIGINS = _unique_items(
        _parse_csv_env("CORS_ORIGINS", "http://localhost:5173")
        + [
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
        ]
    )
    MODEL_DIR = Path(os.getenv("MODEL_DIR", str(BASE_DIR / "ml" / "artifacts")))
    SCRAPE_INTERVAL_MINUTES = int(os.getenv("SCRAPE_INTERVAL_MINUTES", "360"))
    SCRAPER_USER_AGENT = os.getenv("SCRAPER_USER_AGENT", "IPL-Analytics-Platform/1.0")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    JSON_SORT_KEYS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
