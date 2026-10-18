from datetime import datetime, timezone

from fastapi import APIRouter

from app.config import settings
from app.database import check_database_connection

router = APIRouter(prefix="/api", tags=["System"])


@router.get("/health")
def get_health() -> dict:
    connected, message = check_database_connection()
    if connected:
        db_engine = "MySQL 8.0" if not settings.USE_SQLITE_FALLBACK else "SQLite"
    else:
        db_engine = "SQLite fallback"

    return {
        "status": "HEALTHY" if connected else "DEGRADED",
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "uptime_seconds": 0,
        "database": {
            "connected": connected,
            "engine": db_engine,
            "is_fallback": settings.USE_SQLITE_FALLBACK,
            "latency_ms": 1.5,
        },
        "simulation": {
            "active": True,
            "active_scenario": "NORMAL_BASELINE",
            "sampling_interval_seconds": 5,
        },
        "db_status_detail": message,
    }
