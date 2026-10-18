from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class TelemetrySlice(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interface_id: str
    device_id: str
    device_hostname: str
    interface_name: str
    timestamp: str
    bandwidth_util_pct: float
    bandwidth_mbps: float
    packet_drop_pct: float
    latency_ms: float
    jitter_ms: float
    crc_errors_per_sec: int
    cpu_util_pct: float
    memory_util_pct: float
    data_origin: str = "SIMULATED"


class TelemetryHistoryQuery(BaseModel):
    interface_id: str | None = None
    device_id: str | None = None
    window: str = "5m"
    limit: int = 30
