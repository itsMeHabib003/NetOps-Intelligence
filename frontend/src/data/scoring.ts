import {
  DeviceCounts,
  DeviceRole,
  HealthStatus,
  IncidentSeverity,
  IncidentView,
  InterfaceCounts,
  InterfaceSnapshot,
} from '../types';
import { TIER_WEIGHT } from './catalog';

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * PRD FR-4.3:
 * Priority Score = Clamp_0^100(Tier Weight × 0.4 + Metric Severity × 0.4 + Blast Radius × 0.2)
 */
export function computePriorityScore(
  role: DeviceRole,
  metricSeverity: number,
  blastRadius: number,
): number {
  const score = TIER_WEIGHT[role] * 0.4 + clamp(metricSeverity) * 0.4 + clamp(blastRadius) * 0.2;
  return Math.round(clamp(score));
}

export function metricSeverityFromTelemetry(input: {
  packet_drop_pct: number;
  crc_errors_per_sec: number;
  latency_ms: number;
  bandwidth_util_pct: number;
}): number {
  let severity = 0;
  if (input.packet_drop_pct > 10) severity = Math.max(severity, 100);
  else if (input.packet_drop_pct > 2) severity = Math.max(severity, 70);
  else if (input.packet_drop_pct > 0.1) severity = Math.max(severity, 40);

  if (input.crc_errors_per_sec > 150) severity = Math.max(severity, 90);
  else if (input.crc_errors_per_sec > 50) severity = Math.max(severity, 75);

  if (input.latency_ms > 100) severity = Math.max(severity, 85);
  else if (input.latency_ms > 40) severity = Math.max(severity, 55);

  if (input.bandwidth_util_pct > 95) severity = Math.max(severity, 80);
  else if (input.bandwidth_util_pct > 90) severity = Math.max(severity, 60);

  return severity;
}

export function deriveSystemHealth(
  deviceStatuses: HealthStatus[],
  activeIncidents: Pick<IncidentView, 'severity' | 'status'>[],
): HealthStatus {
  const open = activeIncidents.filter((i) => i.status !== 'RESOLVED');
  if (deviceStatuses.includes('CRITICAL') || open.some((i) => i.severity === 'P1')) {
    return 'CRITICAL';
  }
  if (
    deviceStatuses.includes('DEGRADED') ||
    open.some((i) => i.severity === 'P2' || i.severity === 'P3')
  ) {
    return 'DEGRADED';
  }
  return 'HEALTHY';
}

export function countDevices(statuses: HealthStatus[]): DeviceCounts {
  return {
    total: statuses.length,
    online: statuses.filter((s) => s === 'HEALTHY' || s === 'MAINTENANCE').length,
    degraded: statuses.filter((s) => s === 'DEGRADED').length,
    offline: statuses.filter((s) => s === 'CRITICAL').length,
  };
}

export function countInterfaces(ifaces: InterfaceSnapshot[]): InterfaceCounts {
  return {
    total: ifaces.length,
    online: ifaces.filter((i) => i.oper_status === 'UP').length,
    degraded: ifaces.filter((i) => i.degraded).length,
    down: ifaces.filter((i) => i.oper_status === 'DOWN').length,
  };
}

export function severityDistribution(
  incidents: Pick<IncidentView, 'severity' | 'status'>[],
): Record<IncidentSeverity, number> {
  const dist: Record<IncidentSeverity, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };
  for (const incident of incidents) {
    if (incident.status !== 'RESOLVED') {
      dist[incident.severity] += 1;
    }
  }
  return dist;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
