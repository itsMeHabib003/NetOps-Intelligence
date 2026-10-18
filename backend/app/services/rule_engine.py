from __future__ import annotations

from collections import defaultdict
from typing import Any


class RuleEngine:
    """Deterministic, explainable rules for simulated network anomalies."""

    def evaluate(self, samples: list[dict[str, Any]]) -> list[dict[str, Any]]:
        groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for sample in samples:
            groups[sample.get("interface_id", "unknown")].append(sample)

        findings: list[dict[str, Any]] = []
        for interface_id, items in groups.items():
            latest = items[-1]
            packet_drop = float(latest.get("packet_drop_pct", 0.0))
            latency = float(latest.get("latency_ms", 0.0))
            crc = int(latest.get("crc_errors_per_sec", 0))
            bandwidth = float(latest.get("bandwidth_util_pct", 0.0))

            if packet_drop > 10.0:
                findings.append(
                    {
                        "rule_id": "PACKET_LOSS_THRESHOLD",
                        "interface_id": interface_id,
                        "severity": "P1",
                        "message": "Packet loss exceeds 10% for the current observation window.",
                        "evidence": {"packet_drop_pct": packet_drop},
                    }
                )
            elif packet_drop > 2.0:
                findings.append(
                    {
                        "rule_id": "PACKET_LOSS_THRESHOLD",
                        "interface_id": interface_id,
                        "severity": "P2",
                        "message": "Packet loss is above the warning threshold.",
                        "evidence": {"packet_drop_pct": packet_drop},
                    }
                )

            if latency > 100.0:
                findings.append(
                    {
                        "rule_id": "LATENCY_THRESHOLD",
                        "interface_id": interface_id,
                        "severity": "P1",
                        "message": "Latency exceeds 100ms and indicates transit saturation.",
                        "evidence": {"latency_ms": latency},
                    }
                )
            elif latency > 40.0:
                findings.append(
                    {
                        "rule_id": "LATENCY_THRESHOLD",
                        "interface_id": interface_id,
                        "severity": "P2",
                        "message": "Latency exceeds the degraded floor and should be investigated.",
                        "evidence": {"latency_ms": latency},
                    }
                )

            if crc > 150 or bandwidth > 95.0:
                findings.append(
                    {
                        "rule_id": "CRC_AND_CAPACITY_RULE",
                        "interface_id": interface_id,
                        "severity": "P2",
                        "message": "High CRC or saturation indicates a stressed transit path.",
                        "evidence": {"crc_errors_per_sec": crc, "bandwidth_util_pct": bandwidth},
                    }
                )

        return findings
