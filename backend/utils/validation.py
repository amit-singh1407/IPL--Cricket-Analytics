from __future__ import annotations

import re

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_required_fields(payload: dict, fields: list[str]):
    missing = [field for field in fields if payload.get(field) in (None, "", [])]
    return missing


def is_valid_email(email: str | None) -> bool:
    return bool(email and EMAIL_PATTERN.match(email))


def validate_prediction_payload(payload: dict):
    required_fields = ["team1Id", "team2Id", "venue", "season"]
    return validate_required_fields(payload, required_fields)
