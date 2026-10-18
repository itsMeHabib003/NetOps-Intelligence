from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class IncidentStatusUpdate(BaseModel):
    status: str
    operator_name: str | None = None
    notes: str | None = None


class IncidentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    device_id: str
    hostname: str
    title: str
    severity: str
    status: str
    priority_score: int
    detected_at: str
    active_scenario: str | None = None


class IncidentDetail(IncidentSummary):
    interface_id: str | None = None
    interface_name: str | None = None
    rule_id: str | None = None
    rule_explanation: str | None = None
    hypothesis: str | None = None
    evidence: list[dict] = []
    data_origin: str = "SIMULATED"
