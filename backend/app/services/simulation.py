from __future__ import annotations

import math
from datetime import datetime, timedelta, timezone


class SimulationEngine:
    """Deterministic synthetic telemetry generator."""

    def __init__(self, scenario: str = "NORMAL_BASELINE") -> None:
        self.scenario = scenario

    def generate_window(self, interface_id: str, count: int = 12) -> list[dict]:
        now = datetime.now(timezone.utc)
        samples: list[dict] = []
        for index in range(count):
            timestamp = now - timedelta(seconds=(count - index) * 5)
            base = 32.0 + 10.0 * math.sin((index + 1) * 0.7)
            packet_drop = 0.1 + 0.3 * math.sin((index + 1) * 0.9)
            latency = 12.0 + 1.5 * math.cos((index + 1) * 0.6)
            jitter = 1.2 + 0.8 * abs(math.sin((index + 1) * 0.5))
            crc = max(0, int(8 * abs(math.sin((index + 1) * 0.8))))
            cpu = 38.0 + 7.0 * math.sin((index + 1) * 0.4)
            memory = 45.0 + 6.0 * math.cos((index + 1) * 0.35)

            if self.scenario == "SCENARIO_CRC_STORM" and interface_id == "intf-agg01-01":
                packet_drop = max(packet_drop, 6.8)
                latency = max(latency, 28.4)
                crc = 184

            if self.scenario == "SCENARIO_WAN_SATURATION" and interface_id == "intf-wan01-1":
                base = 96.4
                packet_drop = 12.4
                latency = 142.8
                jitter = 22.8
                cpu = 82.0
                memory = 76.0

            samples.append(
                {
                    "interface_id": interface_id,
                    "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "bandwidth_util_pct": round(base, 1),
                    "bandwidth_mbps": round(base * 1240, 1),
                    "packet_drop_pct": round(packet_drop, 2),
                    "latency_ms": round(latency, 1),
                    "jitter_ms": round(jitter, 1),
                    "crc_errors_per_sec": crc,
                    "cpu_util_pct": round(cpu, 1),
                    "memory_util_pct": round(memory, 1),
                    "data_origin": "SIMULATED",
                }
            )
        return samples
