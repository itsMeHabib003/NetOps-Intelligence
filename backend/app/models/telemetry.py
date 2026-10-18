from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TelemetrySample(Base):
    __tablename__ = "telemetry_samples"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    interface_id: Mapped[str] = mapped_column(ForeignKey("interfaces.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    bandwidth_util_pct: Mapped[float] = mapped_column(Float, default=0.0)
    bandwidth_mbps: Mapped[float] = mapped_column(Float, default=0.0)
    packet_drop_pct: Mapped[float] = mapped_column(Float, default=0.0)
    latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    jitter_ms: Mapped[float] = mapped_column(Float, default=0.0)
    crc_errors_per_sec: Mapped[int] = mapped_column(Integer, default=0)
    cpu_util_pct: Mapped[float] = mapped_column(Float, default=0.0)
    memory_util_pct: Mapped[float] = mapped_column(Float, default=0.0)
    data_origin: Mapped[str] = mapped_column(String(32), default="SIMULATED", nullable=False)

    interface: Mapped["Interface"] = relationship(back_populates="telemetry_samples")
