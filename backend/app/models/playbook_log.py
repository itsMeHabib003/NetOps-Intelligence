from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PlaybookLog(Base):
    __tablename__ = "playbook_step_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), nullable=False)
    playbook_id: Mapped[str] = mapped_column(String(64), nullable=False)
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    step_instruction: Mapped[str] = mapped_column(String(255), nullable=False)
    simulated_cli_output: Mapped[str] = mapped_column(Text, nullable=False)
    operator_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    operator_name: Mapped[str] = mapped_column(String(64), nullable=False)
    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    incident: Mapped["Incident"] = relationship(back_populates="playbook_logs")
