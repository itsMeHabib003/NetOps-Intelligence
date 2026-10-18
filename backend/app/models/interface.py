from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Interface(Base):
    __tablename__ = "interfaces"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    device_id: Mapped[str] = mapped_column(ForeignKey("devices.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    speed_gbps: Mapped[int] = mapped_column(nullable=False, default=10)
    admin_status: Mapped[str] = mapped_column(String(16), nullable=False, default="UP")
    oper_status: Mapped[str] = mapped_column(String(16), nullable=False, default="UP")
    connected_peer: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    device: Mapped["Device"] = relationship(back_populates="interfaces")
    telemetry_samples: Mapped[list["TelemetrySample"]] = relationship(back_populates="interface", cascade="all, delete-orphan")
