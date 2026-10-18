import { describe, expect, it } from 'vitest';
import {
  clamp,
  computePriorityScore,
  countDevices,
  deriveSystemHealth,
  metricSeverityFromTelemetry,
  severityDistribution,
} from './scoring';

describe('priority scoring', () => {
  it('matches the PRD weighted formula and clamps to 0–100', () => {
    expect(computePriorityScore('WAN', 100, 80)).toBe(92);
    expect(computePriorityScore('AGGREGATION', 90, 50)).toBe(76);
    expect(computePriorityScore('CORE', 70, 60)).toBe(80);
    expect(computePriorityScore('ACCESS', 200, 200)).toBe(100);
  });

  it('maps telemetry to metric severity using the same thresholds as the dashboard', () => {
    expect(metricSeverityFromTelemetry({ packet_drop_pct: 12.4, crc_errors_per_sec: 0, latency_ms: 142.8, bandwidth_util_pct: 96.4 })).toBe(100);
    expect(metricSeverityFromTelemetry({ packet_drop_pct: 6.8, crc_errors_per_sec: 184, latency_ms: 28, bandwidth_util_pct: 40 })).toBe(90);
    expect(metricSeverityFromTelemetry({ packet_drop_pct: 0, crc_errors_per_sec: 0, latency_ms: 11.4, bandwidth_util_pct: 32 })).toBe(0);
  });

  it('clamps numeric inputs', () => {
    expect(clamp(-4)).toBe(0);
    expect(clamp(140)).toBe(100);
  });
});

describe('health and counts', () => {
  it('treats P1 or CRITICAL devices as system CRITICAL', () => {
    expect(deriveSystemHealth(['HEALTHY', 'CRITICAL'], [])).toBe('CRITICAL');
    expect(deriveSystemHealth(['HEALTHY'], [{ severity: 'P1', status: 'NEW' }])).toBe('CRITICAL');
  });

  it('treats P2 plus DEGRADED as DEGRADED and ignores resolved incidents', () => {
    expect(deriveSystemHealth(['HEALTHY', 'DEGRADED'], [{ severity: 'P2', status: 'NEW' }])).toBe('DEGRADED');
    expect(deriveSystemHealth(['HEALTHY'], [{ severity: 'P1', status: 'RESOLVED' }])).toBe('HEALTHY');
  });

  it('maps HEALTHY/MAINTENANCE to online and CRITICAL to offline', () => {
    expect(countDevices(['HEALTHY', 'HEALTHY', 'DEGRADED', 'CRITICAL', 'MAINTENANCE'])).toEqual({
      total: 5,
      online: 3,
      degraded: 1,
      offline: 1,
    });
  });

  it('counts only non-resolved incidents in severity distribution', () => {
    expect(
      severityDistribution([
        { severity: 'P1', status: 'NEW' },
        { severity: 'P1', status: 'RESOLVED' },
        { severity: 'P2', status: 'ACKNOWLEDGED' },
      ]),
    ).toEqual({ P1: 1, P2: 1, P3: 0, P4: 0 });
  });
});
