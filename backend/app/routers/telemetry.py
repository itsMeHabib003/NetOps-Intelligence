from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.interface import Interface
from app.models.telemetry import TelemetrySample

router = APIRouter(prefix="/api", tags=["Telemetry"])


@router.get("/telemetry/live")
def get_live_telemetry(db: Session = Depends(get_db)):
    samples = db.query(TelemetrySample).order_by(TelemetrySample.timestamp.desc()).all()
    seen: set[str] = set()
    payload = []
    for sample in samples:
        if sample.interface_id in seen:
            continue
        iface = db.get(Interface, sample.interface_id)
        payload.append(
            {
                "interface_id": sample.interface_id,
                "device_id": iface.device_id if iface else "",
                "device_hostname": iface.device.hostname if iface and iface.device else "",
                "interface_name": iface.name if iface else "",
                "timestamp": sample.timestamp.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "bandwidth_util_pct": sample.bandwidth_util_pct,
                "bandwidth_mbps": sample.bandwidth_mbps,
                "packet_drop_pct": sample.packet_drop_pct,
                "latency_ms": sample.latency_ms,
                "jitter_ms": sample.jitter_ms,
                "crc_errors_per_sec": sample.crc_errors_per_sec,
                "cpu_util_pct": sample.cpu_util_pct,
                "memory_util_pct": sample.memory_util_pct,
                "data_origin": sample.data_origin,
            }
        )
        seen.add(sample.interface_id)
    return payload


@router.get("/telemetry/history")
def get_history(
    interface_id: str | None = None,
    device_id: str | None = None,
    window: str = "5m",
    limit: int = 30,
    db: Session = Depends(get_db),
):
    if limit > 300:
        raise HTTPException(status_code=400, detail="limit cannot exceed 300")

    delta = {"5m": timedelta(minutes=5), "15m": timedelta(minutes=15), "1h": timedelta(hours=1)}.get(window, timedelta(minutes=5))
    cutoff = datetime.now(timezone.utc) - delta

    query = db.query(TelemetrySample).filter(TelemetrySample.timestamp >= cutoff)
    if interface_id:
        query = query.filter(TelemetrySample.interface_id == interface_id)
    if device_id:
        device_interfaces = [iface.id for iface in db.query(Interface).filter(Interface.device_id == device_id).all()]
        query = query.filter(TelemetrySample.interface_id.in_(device_interfaces))

    samples = query.order_by(TelemetrySample.timestamp.asc()).limit(limit).all()
    return {
        "query": {"interface_id": interface_id, "window": window, "returned_samples": len(samples)},
        "samples": [
            {
                "timestamp": item.timestamp.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "bandwidth_util_pct": item.bandwidth_util_pct,
                "packet_drop_pct": item.packet_drop_pct,
                "latency_ms": item.latency_ms,
                "jitter_ms": item.jitter_ms,
                "crc_errors_per_sec": item.crc_errors_per_sec,
                "cpu_util_pct": item.cpu_util_pct,
                "memory_util_pct": item.memory_util_pct,
                "data_origin": item.data_origin,
            }
            for item in samples
        ],
    }
