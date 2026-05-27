from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError

from utils.response import failure


def register_error_handlers(app):
    @app.errorhandler(ValueError)
    def handle_value_error(error):
        return failure(str(error), 400)

    @app.errorhandler(InvalidId)
    def handle_invalid_id(error):
        return failure("Invalid identifier", 400)

    @app.errorhandler(DuplicateKeyError)
    def handle_duplicate_key(error):
        return failure("Document already exists", 409)

    @app.errorhandler(404)
    def handle_not_found(error):
        return failure("Resource not found", 404)

    @app.errorhandler(500)
    def handle_server_error(error):
        app.logger.exception("Unhandled server error: %s", error)
        return failure("Unexpected server error", 500)
