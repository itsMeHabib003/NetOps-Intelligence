from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.incident import Incident
from app.models.evidence import IncidentEvidence
from app.models.status_history import IncidentStatusHistory

router = APIRouter(prefix="/api", tags=["Incidents"])


@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.detected_at.desc()).all()
    results = []
    for incident in incidents:
        results.append(
            {
                "id": incident.id,
                "device_id": incident.device_id,
                "hostname": incident.device.hostname,
                "title": incident.title,
                "severity": incident.severity,
                "status": incident.status,
                "priority_score": incident.priority_score,
                "detected_at": incident.detected_at.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "active_scenario": incident.active_scenario,
            }
        )
    return results


@router.get("/incidents/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.get(Incident, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    evidence = db.query(IncidentEvidence).filter(IncidentEvidence.incident_id == incident_id).all()
    return {
        "id": incident.id,
        "device_id": incident.device_id,
        "hostname": incident.device.hostname,
        "interface_id": incident.interface_id,
        "title": incident.title,
        "severity": incident.severity,
        "status": incident.status,
        "priority_score": incident.priority_score,
        "detected_at": incident.detected_at.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "rule_id": "RULE-001",
        "rule_explanation": "Deterministic rule evaluation detected a threshold breach.",
        "hypothesis": "Unverified hypothesis: transient congestion or optic degradation.",
        "evidence": [
            {
                "metric_name": row.metric_name,
                "observed_value": row.observed_value,
                "threshold_value": row.threshold_value,
                "confidence_tier": row.confidence_tier,
            }
            for row in evidence
        ],
        "data_origin": "SIMULATED",
    }


@router.patch("/incidents/{incident_id}/status")
def update_incident_status(incident_id: str, payload: dict, db: Session = Depends(get_db)):
    incident = db.get(Incident, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    new_status = payload.get("status")
    if new_status not in {"NEW", "ACKNOWLEDGED", "INVESTIGATING", "RESOLVED"}:
        raise HTTPException(status_code=400, detail="Invalid status")

    old_status = incident.status
    incident.status = new_status
    incident.assigned_operator = payload.get("operator_name") or incident.assigned_operator
    if new_status == "RESOLVED":
        incident.resolved_at = datetime.now(timezone.utc)

    db.add(
        IncidentStatusHistory(
            id=f"HIST-{incident_id}-{new_status}",
            incident_id=incident_id,
            previous_status=old_status,
            new_status=new_status,
            operator_name=payload.get("operator_name") or "Alex (NOC Tier-1)",
            transition_notes=payload.get("notes"),
        )
    )
    db.commit()
    return {"id": incident_id, "status": new_status, "updated": True}
