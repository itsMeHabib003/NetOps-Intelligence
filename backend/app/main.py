from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers.devices import router as devices_router
from app.routers.health import router as health_router
from app.routers.incidents import router as incidents_router
from app.routers.scenarios import router as scenarios_router
from app.routers.telemetry import router as telemetry_router

app = FastAPI(
    title="NetOps Intelligence API",
    description="Operations Monitoring, Incident Triage & Telemetry API",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(devices_router)
app.include_router(telemetry_router)
app.include_router(incidents_router)
app.include_router(scenarios_router)


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/", tags=["System"])
def root():
    return {
        "name": "NetOps Intelligence API",
        "status": "ONLINE",
        "documentation": "/docs",
        "health": "/api/health",
    }
