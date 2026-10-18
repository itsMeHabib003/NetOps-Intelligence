from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.device import Device
from app.models.interface import Interface
from app.schemas.device import DeviceDetail, DeviceSummary

router = APIRouter(prefix="/api", tags=["Devices"])


@router.get("/devices", response_model=list[DeviceSummary])
def list_devices(
    role: str | None = None,
    status: str | None = None,
    search: str | None = None,
    db: Annotated[Session, Depends(get_db)] = None,
):
    query = db.query(Device)
    if role:
        query = query.filter(Device.role == role)
    if status:
        query = query.filter(Device.status == status)
    if search:
        query = query.filter(
            or_(
                Device.hostname.ilike(f"%{search}%"),
                Device.ip_address.ilike(f"%{search}%"),
            )
        )

    devices = query.all()
    results = []
    for device in devices:
        results.append(
            DeviceSummary(
                id=device.id,
                hostname=device.hostname,
                ip_address=device.ip_address,
                role=device.role,
                status=device.status,
                model=device.model,
                rack_location=device.rack_location,
                uptime_seconds=device.uptime_seconds,
                total_interfaces=len(device.interfaces),
                online_interfaces=sum(1 for iface in device.interfaces if iface.oper_status == "UP"),
                active_incidents_count=0,
                updated_at=device.updated_at.isoformat(timespec="seconds") if device.updated_at else None,
            )
        )
    return results


@router.get("/devices/{device_id}", response_model=DeviceDetail)
def get_device(device_id: str, db: Annotated[Session, Depends(get_db)] = None):
    device = db.get(Device, device_id)
    if device is None:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found")

    interfaces = db.query(Interface).filter(Interface.device_id == device_id).all()
    return DeviceDetail(
        id=device.id,
        hostname=device.hostname,
        ip_address=device.ip_address,
        role=device.role,
        status=device.status,
        model=device.model,
        rack_location=device.rack_location,
        uptime_seconds=device.uptime_seconds,
        interfaces=[
            {
                "id": iface.id,
                "device_id": iface.device_id,
                "name": iface.name,
                "speed_gbps": iface.speed_gbps,
                "admin_status": iface.admin_status,
                "oper_status": iface.oper_status,
                "connected_peer": iface.connected_peer,
            }
            for iface in interfaces
        ],
        created_at=device.created_at.isoformat(timespec="seconds") if device.created_at else None,
        updated_at=device.updated_at.isoformat(timespec="seconds") if device.updated_at else None,
    )
