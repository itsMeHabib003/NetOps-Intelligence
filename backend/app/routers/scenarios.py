from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Scenarios"])

ACTIVE_SCENARIO = "NORMAL_BASELINE"


@router.get("/scenarios")
def list_scenarios() -> dict:
    return {
        "active_scenario": ACTIVE_SCENARIO,
        "available": ["NORMAL_BASELINE", "SCENARIO_CRC_STORM", "SCENARIO_WAN_SATURATION", "SCENARIO_BGP_FLAP"],
    }


@router.post("/scenarios/inject")
def inject_scenario(payload: dict) -> dict:
    global ACTIVE_SCENARIO
    scenario = payload.get("scenario", "NORMAL_BASELINE")
    ACTIVE_SCENARIO = scenario
    return {"status": "injected", "active_scenario": ACTIVE_SCENARIO}


@router.post("/scenarios/reset")
def reset_scenario() -> dict:
    global ACTIVE_SCENARIO
    ACTIVE_SCENARIO = "NORMAL_BASELINE"
    return {"status": "reset", "active_scenario": ACTIVE_SCENARIO}
