from __future__ import annotations

from math import ceil


def parse_pagination(args, default_limit: int = 12, max_limit: int = 100):
    page = max(int(args.get("page", 1) or 1), 1)
    limit = min(max(int(args.get("limit", default_limit) or default_limit), 1), max_limit)
    return page, limit


def build_paginated_response(items, total: int, page: int, limit: int):
    pages = ceil(total / limit) if total and limit else 0
    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": pages,
    }
