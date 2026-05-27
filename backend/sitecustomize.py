from __future__ import annotations

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
VENV_SITE_PACKAGES = PROJECT_ROOT / ".venv" / "Lib" / "site-packages"

for path in (PROJECT_ROOT, VENV_SITE_PACKAGES):
    if path.exists():
        path_str = str(path)
        if path_str not in sys.path:
            sys.path.insert(0, path_str)
