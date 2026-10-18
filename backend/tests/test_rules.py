from app.services.rule_engine import RuleEngine


def test_rules_detect_packet_loss_and_latency_thresholds():
    engine = RuleEngine()
    samples = [
        {
            "interface_id": "intf-agg01-01",
            "timestamp": "2026-10-18T11:00:00Z",
            "bandwidth_util_pct": 88.0,
            "packet_drop_pct": 12.0,
            "latency_ms": 120.0,
            "jitter_ms": 5.0,
            "crc_errors_per_sec": 110,
            "cpu_util_pct": 75.0,
            "memory_util_pct": 64.0,
            "data_origin": "SIMULATED",
        },
        {
            "interface_id": "intf-agg01-01",
            "timestamp": "2026-10-18T11:00:05Z",
            "bandwidth_util_pct": 90.0,
            "packet_drop_pct": 11.0,
            "latency_ms": 116.0,
            "jitter_ms": 6.0,
            "crc_errors_per_sec": 130,
            "cpu_util_pct": 78.0,
            "memory_util_pct": 67.0,
            "data_origin": "SIMULATED",
        },
    ]

    findings = engine.evaluate(samples)
    assert len(findings) >= 1
    assert any(f["rule_id"] == "PACKET_LOSS_THRESHOLD" for f in findings)


def test_rules_dont_fire_for_healthy_sample_window():
    engine = RuleEngine()
    samples = [
        {
            "interface_id": "intf-agg01-01",
            "timestamp": "2026-10-18T11:00:00Z",
            "bandwidth_util_pct": 42.0,
            "packet_drop_pct": 0.1,
            "latency_ms": 12.0,
            "jitter_ms": 1.0,
            "crc_errors_per_sec": 2,
            "cpu_util_pct": 38.0,
            "memory_util_pct": 44.0,
            "data_origin": "SIMULATED",
        }
    ]

    findings = engine.evaluate(samples)
    assert findings == []
