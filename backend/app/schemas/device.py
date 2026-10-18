from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class DeviceSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hostname: str
    ip_address: str
    role: str
    status: str
    model: str
    rack_location: str
    uptime_seconds: int
    total_interfaces: int = 0
    online_interfaces: int = 0
    active_incidents_count: int = 0
    updated_at: str | None = None


class DeviceDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hostname: str
    ip_address: str
    role: str
    status: str
    model: str
    rack_location: str
    uptime_seconds: int
    interfaces: list[dict] = []
    created_at: str | None = None
    updated_at: str | None = None
