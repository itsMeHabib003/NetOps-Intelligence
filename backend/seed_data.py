from __future__ import annotations

import argparse
from datetime import datetime, timezone

from app.database import SessionLocal, Base, engine
from app.models.device import Device
from app.models.interface import Interface
from app.models.telemetry import TelemetrySample


def seed_devices() -> None:
    devices = [
        {"id": "dev-cor-01", "hostname": "COR-RTR01", "ip_address": "192.0.2.10", "role": "CORE", "status": "HEALTHY", "model": "Nexus 9336C-FX2", "rack_location": "LAB-R01-U20", "uptime_seconds": 7884000},
        {"id": "dev-cor-02", "hostname": "COR-RTR02", "ip_address": "192.0.2.11", "role": "CORE", "status": "HEALTHY", "model": "Nexus 9336C-FX2", "rack_location": "LAB-R02-U20", "uptime_seconds": 7883640},
        {"id": "dev-agg-01", "hostname": "AGG-SW01", "ip_address": "192.0.2.20", "role": "AGGREGATION", "status": "HEALTHY", "model": "Catalyst 9500-48Y4C", "rack_location": "LAB-R01-U12", "uptime_seconds": 4320000},
        {"id": "dev-agg-02", "hostname": "AGG-SW02", "ip_address": "192.0.2.21", "role": "AGGREGATION", "status": "HEALTHY", "model": "Catalyst 9500-48Y4C", "rack_location": "LAB-R02-U12", "uptime_seconds": 4319400},
        {"id": "dev-acc-01", "hostname": "ACC-SW01", "ip_address": "192.0.2.30", "role": "ACCESS", "status": "HEALTHY", "model": "Catalyst 9300-24T", "rack_location": "LAB-R03-U08", "uptime_seconds": 2592000},
        {"id": "dev-acc-02", "hostname": "ACC-SW02", "ip_address": "192.0.2.31", "role": "ACCESS", "status": "HEALTHY", "model": "Catalyst 9300-24T", "rack_location": "LAB-R03-U10", "uptime_seconds": 2591400},
        {"id": "dev-acc-03", "hostname": "ACC-SW03", "ip_address": "192.0.2.32", "role": "ACCESS", "status": "HEALTHY", "model": "Catalyst 9300-24T", "rack_location": "LAB-R04-U08", "uptime_seconds": 2590800},
        {"id": "dev-fw-01", "hostname": "FW-EDG01", "ip_address": "192.0.2.40", "role": "FIREWALL", "status": "HEALTHY", "model": "PA-3220", "rack_location": "LAB-R01-U04", "uptime_seconds": 1296000},
        {"id": "dev-wan-01", "hostname": "WAN-GW01", "ip_address": "192.0.2.50", "role": "WAN", "status": "HEALTHY", "model": "ISR 4431", "rack_location": "LAB-R01-U02", "uptime_seconds": 1209600},
    ]
    with SessionLocal() as session:
        for payload in devices:
            session.merge(Device(**payload))
        session.commit()


def seed_interfaces() -> None:
    entries = [
        ("intf-cor01-1", "dev-cor-01", "HundredGigE0/0/1", 100, "UP", "UP", "AGG-SW01:HundredGigE0/0/1"),
        ("intf-cor01-2", "dev-cor-01", "HundredGigE0/0/2", 100, "UP", "UP", "AGG-SW02:HundredGigE0/0/1"),
        ("intf-cor02-1", "dev-cor-02", "HundredGigE0/0/1", 100, "UP", "UP", "AGG-SW01:HundredGigE0/0/2"),
        ("intf-agg01-1", "dev-agg-01", "HundredGigE0/0/1", 100, "UP", "UP", "COR-RTR01:HundredGigE0/0/1"),
        ("intf-wan01-1", "dev-wan-01", "TenGigE0/0/1", 10, "UP", "UP", "FW-EDG01:TenGigE0/1/3"),
    ]
    with SessionLocal() as session:
        for seq in entries:
            session.merge(Interface(id=seq[0], device_id=seq[1], name=seq[2], speed_gbps=seq[3], admin_status=seq[4], oper_status=seq[5], connected_peer=seq[6]))
        session.commit()


def seed_telemetry() -> None:
    interface_ids = ["intf-cor01-1", "intf-cor01-2", "intf-cor02-1", "intf-agg01-1", "intf-wan01-1"]
    now = datetime.now(timezone.utc)
    with SessionLocal() as session:
        for index, iface_id in enumerate(interface_ids):
            for offset in range(5):
                timestamp = now - __import__("datetime").timedelta(seconds=(4 - offset) * 5)
                sample = TelemetrySample(
                    interface_id=iface_id,
                    timestamp=timestamp,
                    bandwidth_util_pct=40.0 + index * 8 + offset,
                    bandwidth_mbps=4000.0 + index * 1000,
                    packet_drop_pct=0.1 + offset * 0.2,
                    latency_ms=12.0 + index * 2,
                    jitter_ms=1.2,
                    crc_errors_per_sec=max(0, 4 - index),
                    cpu_util_pct=35.0 + index * 6,
                    memory_util_pct=42.0 + index * 4,
                    data_origin="SIMULATED",
                )
                session.add(sample)
        session.commit()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true")
    args = parser.parse_args()

    if args.reset:
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
    seed_devices()
    seed_interfaces()
    seed_telemetry()
    print("Seeded synthetic data for NetOps Intelligence")


if __name__ == "__main__":
    main()
