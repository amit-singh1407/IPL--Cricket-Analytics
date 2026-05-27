from __future__ import annotations

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import MongoClient


def to_object_id(value: str | ObjectId | None) -> ObjectId | None:
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return value
    if not ObjectId.is_valid(str(value)):
        raise InvalidId(str(value))
    return ObjectId(str(value))


def serialize_value(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, dict):
        return serialize_document(value)
    if isinstance(value, list):
        return [serialize_value(item) for item in value]
    return value


def serialize_document(document):
    if document is None:
        return None

    serialized = {}
    for key, value in document.items():
        if key == "_id":
            serialized["id"] = str(value)
        else:
            serialized[key] = serialize_value(value)
    return serialized


class MongoConnection:
    def __init__(self, mongo_uri: str, db_name: str):
        self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        self.db = self.client[db_name]

    def ping(self):
        self.client.admin.command("ping")
