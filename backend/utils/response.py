def success(data=None, message: str = "OK", status_code: int = 200, meta=None):
    payload = {"success": True, "message": message, "data": data}
    if meta is not None:
        payload["meta"] = meta
    return payload, status_code


def failure(message: str, status_code: int = 400, details=None):
    payload = {"success": False, "message": message}
    if details is not None:
        payload["details"] = details
    return payload, status_code
