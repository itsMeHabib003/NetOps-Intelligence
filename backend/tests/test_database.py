from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session

from app.database import Base
from app.models.device import Device
from app.models.interface import Interface


def test_database_schema_can_create_sqlite_tables():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "devices" in tables
    assert "interfaces" in tables


def test_device_and_interface_round_trip_in_sqlite():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        device = Device(
            id="dev-agg-01",
            hostname="AGG-SW01",
            ip_address="192.0.2.11",
            role="AGGREGATION",
            status="HEALTHY",
            model="Catalyst 9500",
            rack_location="DC1-Rack-04-U28",
            uptime_seconds=864200,
        )
        session.add(device)
        session.flush()

        iface = Interface(
            id="intf-agg01-01",
            device_id=device.id,
            name="HundredGigE0/0/1",
            speed_gbps=100,
            admin_status="UP",
            oper_status="UP",
            connected_peer="COR-RTR01:HundredGigE0/0/1",
        )
        session.add(iface)
        session.commit()

        saved = session.get(Device, "dev-agg-01")
        assert saved is not None
        assert saved.hostname == "AGG-SW01"
        assert len(saved.interfaces) == 1
        assert saved.interfaces[0].id == "intf-agg01-01"
