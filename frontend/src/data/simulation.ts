import {
  DashboardSnapshot,
  DeviceSnapshot,
  HealthStatus,
  IncidentView,
  InterfaceSnapshot,
  ScenarioId,
  TelemetryPoint,
  TimeRange,
  TopologyLink,
} from '../types';
import {
  BGP_TARGET_DEVICE_ID,
  CRC_TARGET_INTERFACE_ID,
  DEVICES,
  INTERFACES,
  SAMPLE_INTERVAL_SEC,
  TOPOLOGY_LINKS,
  WAN_TARGET_INTERFACE_ID,
} from './catalog';
import {
  computePriorityScore,
  countDevices,
  countInterfaces,
  deriveSystemHealth,
  mean,
  metricSeverityFromTelemetry,
  round1,
  round2,
  severityDistribution,
} from './scoring';
import { downsample, sampleCountForRange, trendFromSeries } from './windows';

const BASE_BANDWIDTH = 32;
const BASE_LATENCY = 11.4;
const BASE_JITTER = 1.2;
const BASE_CPU = 28;
const BASE_MEM = 44;

/** Deterministic unit oscillation in [0, 1). Not a live RNG. */
function wave(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 0.37) * 43758.5453;
  return x - Math.floor(x);
}

function isoAt(nowMs: number, offsetSec: number): string {
  return new Date(nowMs + offsetSec * 1000).toISOString();
}

function baselinePoint(ifaceIndex: number, sampleIndex: number, timestamp: string): TelemetryPoint {
  const w = wave(ifaceIndex + 1, sampleIndex);
  return {
    timestamp,
    bandwidth_util_pct: round1(BASE_BANDWIDTH + w * 8),
    packet_drop_pct: 0,
    latency_ms: round1(BASE_LATENCY + (w - 0.5) * 0.8),
    jitter_ms: round1(BASE_JITTER + (w - 0.5) * 0.4),
    crc_errors_per_sec: 0,
    cpu_util_pct: round1(BASE_CPU + w * 6),
    memory_util_pct: round1(BASE_MEM + w * 4),
    data_origin: 'SIMULATED',
  };
}

function anomalyWeight(sampleIndex: number, totalSamples: number): number {
  const start = Math.floor(totalSamples * 0.55);
  if (sampleIndex < start) return 0;
  return Math.min(1, (sampleIndex - start) / Math.max(1, Math.floor(totalSamples * 0.2)));
}

function applyScenarioToPoint(
  scenario: ScenarioId,
  ifaceId: string,
  deviceId: string,
  point: TelemetryPoint,
  weight: number,
): TelemetryPoint {
  if (scenario === 'NORMAL_BASELINE' || weight <= 0) return point;

  if (scenario === 'SCENARIO_CRC_STORM' && ifaceId === CRC_TARGET_INTERFACE_ID) {
    return {
      ...point,
      crc_errors_per_sec: Math.round(184 * weight),
      packet_drop_pct: round2(6.8 * weight),
      latency_ms: round1(11.4 + 16.6 * weight),
      jitter_ms: round1(1.2 + 4.8 * weight),
    };
  }

  if (scenario === 'SCENARIO_CRC_STORM' && ifaceId === 'intf-cor01-1') {
    return {
      ...point,
      packet_drop_pct: round2(1.1 * weight),
      latency_ms: round1(11.4 + 4.2 * weight),
    };
  }

  if (scenario === 'SCENARIO_WAN_SATURATION' && ifaceId === WAN_TARGET_INTERFACE_ID) {
    return {
      ...point,
      bandwidth_util_pct: round1(38 + 58.4 * weight),
      packet_drop_pct: round2(12.4 * weight),
      latency_ms: round1(11.4 + 131.4 * weight),
      jitter_ms: round1(1.2 + 22.8 * weight),
      cpu_util_pct: round1(point.cpu_util_pct + 24 * weight),
    };
  }

  if (scenario === 'SCENARIO_WAN_SATURATION' && ifaceId === 'intf-fw01-3') {
    return {
      ...point,
      bandwidth_util_pct: round1(36 + 58 * weight),
      packet_drop_pct: round2(8.1 * weight),
      latency_ms: round1(11.4 + 84.6 * weight),
    };
  }

  if (scenario === 'SCENARIO_BGP_FLAP' && deviceId === BGP_TARGET_DEVICE_ID) {
    const flap = weight > 0.6 && Math.floor(Date.parse(point.timestamp) / 15000) % 2 === 0 ? 1 : weight;
    return {
      ...point,
      cpu_util_pct: round1(point.cpu_util_pct + 41 * weight),
      latency_ms: round1(point.latency_ms + 18.6 * flap),
      jitter_ms: round1(point.jitter_ms + 8.4 * flap),
      packet_drop_pct: round2(0.4 * weight),
      bandwidth_util_pct: round1(point.bandwidth_util_pct + 12 * weight),
    };
  }

  return point;
}

function deviceStatusFor(scenario: ScenarioId, deviceId: string): HealthStatus {
  if (scenario === 'SCENARIO_CRC_STORM' && deviceId === 'dev-agg-01') return 'DEGRADED';
  if (scenario === 'SCENARIO_WAN_SATURATION' && deviceId === 'dev-wan-01') return 'CRITICAL';
  if (scenario === 'SCENARIO_WAN_SATURATION' && deviceId === 'dev-fw-01') return 'DEGRADED';
  if (scenario === 'SCENARIO_BGP_FLAP' && deviceId === BGP_TARGET_DEVICE_ID) return 'DEGRADED';
  return 'HEALTHY';
}

function isDegradedInterface(scenario: ScenarioId, ifaceId: string, point: TelemetryPoint): boolean {
  if (scenario === 'SCENARIO_CRC_STORM' && ifaceId === CRC_TARGET_INTERFACE_ID) return true;
  if (scenario === 'SCENARIO_WAN_SATURATION' && (ifaceId === WAN_TARGET_INTERFACE_ID || ifaceId === 'intf-fw01-3')) {
    return true;
  }
  return point.packet_drop_pct > 0.1 || point.crc_errors_per_sec > 50;
}

function buildIncidents(scenario: ScenarioId, nowMs: number, latestByIface: Map<string, TelemetryPoint>): IncidentView[] {
  if (scenario === 'NORMAL_BASELINE') return [];

  const detectedOffset = -90;

  if (scenario === 'SCENARIO_CRC_STORM') {
    const observed = latestByIface.get(CRC_TARGET_INTERFACE_ID)!;
    const metric = metricSeverityFromTelemetry(observed);
    return [
      {
        id: 'INC-2026-001',
        device_id: 'dev-agg-01',
        hostname: 'AGG-SW01',
        interface_id: CRC_TARGET_INTERFACE_ID,
        interface_name: 'HundredGigE0/0/1',
        title: 'High CRC error rate on AGG-SW01 uplink HundredGigE0/0/1',
        severity: 'P2',
        status: 'NEW',
        priority_score: computePriorityScore('AGGREGATION', metric, 50),
        detected_at: isoAt(nowMs, detectedOffset),
        assigned_operator: null,
        active_scenario: scenario,
        rule_id: 'CR_002',
        rule_explanation:
          'Rule CR_002 triggered: CRC error rate > 50 err/s sustained for > 30s on aggregation uplink.',
        hypothesis: 'Dirty fiber end-face or failing optical SFP transceiver on AGG-SW01 HundredGigE0/0/1.',
        evidence: [
          {
            metric_name: 'crc_errors_per_sec',
            observed_value: `${observed.crc_errors_per_sec} err/s`,
            threshold_value: '> 50 err/s',
            confidence_tier: 'OBSERVED_MEASUREMENT',
          },
          {
            metric_name: 'packet_drop_pct',
            observed_value: `${observed.packet_drop_pct}%`,
            threshold_value: '< 0.1%',
            confidence_tier: 'OBSERVED_MEASUREMENT',
          },
        ],
        data_origin: 'SIMULATED',
      },
    ];
  }

  if (scenario === 'SCENARIO_WAN_SATURATION') {
    const observed = latestByIface.get(WAN_TARGET_INTERFACE_ID)!;
    const metric = metricSeverityFromTelemetry(observed);
    return [
      {
        id: 'INC-2026-002',
        device_id: 'dev-wan-01',
        hostname: 'WAN-GW01',
        interface_id: WAN_TARGET_INTERFACE_ID,
        interface_name: 'TenGigE0/0/1',
        title: 'WAN uplink congestion and packet drops on WAN-GW01 TenGigE0/0/1',
        severity: 'P1',
        status: 'NEW',
        priority_score: computePriorityScore('WAN', metric, 80),
        detected_at: isoAt(nowMs, detectedOffset),
        assigned_operator: null,
        active_scenario: scenario,
        rule_id: 'WN_014',
        rule_explanation:
          'Rule WN_014 triggered: packet drop rate > 10% with bandwidth utilization > 95% on WAN transit.',
        hypothesis: 'Egress buffer saturation on the lab WAN circuit; traffic engineering or policing review required.',
        evidence: [
          {
            metric_name: 'packet_drop_pct',
            observed_value: `${observed.packet_drop_pct}%`,
            threshold_value: '> 10%',
            confidence_tier: 'OBSERVED_MEASUREMENT',
          },
          {
            metric_name: 'bandwidth_util_pct',
            observed_value: `${observed.bandwidth_util_pct}%`,
            threshold_value: '> 95%',
            confidence_tier: 'OBSERVED_MEASUREMENT',
          },
          {
            metric_name: 'latency_ms',
            observed_value: `${observed.latency_ms} ms`,
            threshold_value: '< 40 ms',
            confidence_tier: 'OBSERVED_MEASUREMENT',
          },
        ],
        data_origin: 'SIMULATED',
      },
    ];
  }

  const coreIfaces = INTERFACES.filter((i) => i.device_id === BGP_TARGET_DEVICE_ID);
  const coreLatest = coreIfaces.map((i) => latestByIface.get(i.id)!);
  const worst = coreLatest.reduce((a, b) => (a.cpu_util_pct > b.cpu_util_pct ? a : b));
  const metric = metricSeverityFromTelemetry(worst);
  return [
    {
      id: 'INC-2026-003',
      device_id: BGP_TARGET_DEVICE_ID,
      hostname: 'COR-RTR01',
      title: 'BGP peering neighbor resets and route instability on COR-RTR01',
      severity: 'P2',
      status: 'NEW',
      priority_score: computePriorityScore('CORE', Math.max(metric, 70), 60),
      detected_at: isoAt(nowMs, detectedOffset),
      assigned_operator: null,
      active_scenario: scenario,
      rule_id: 'BG_007',
      rule_explanation:
        'Rule BG_007 triggered: control-plane CPU > 60% coincident with session-reset pattern on core router.',
      hypothesis: 'Unstable eBGP session or flapping prefix advertisement from the lab peer (unverified).',
      evidence: [
        {
          metric_name: 'cpu_util_pct',
          observed_value: `${worst.cpu_util_pct}%`,
          threshold_value: '< 60%',
          confidence_tier: 'OBSERVED_MEASUREMENT',
        },
        {
          metric_name: 'latency_ms',
          observed_value: `${worst.latency_ms} ms`,
          threshold_value: '< 40 ms',
          confidence_tier: 'OBSERVED_MEASUREMENT',
        },
      ],
      data_origin: 'SIMULATED',
    },
  ];
}

export function generateDashboardSnapshot(
  scenario: ScenarioId,
  timeRange: TimeRange,
  nowMs: number,
  tick = 0,
): DashboardSnapshot {
  const alignedNow = nowMs - (nowMs % (SAMPLE_INTERVAL_SEC * 1000)) + tick * SAMPLE_INTERVAL_SEC * 1000;
  const sampleCount = sampleCountForRange(timeRange);
  const latestByIface = new Map<string, TelemetryPoint>();
  const transitSeries: TelemetryPoint[] = [];

  const interfaces: InterfaceSnapshot[] = INTERFACES.map((iface, ifaceIndex) => {
    let latest: TelemetryPoint = baselinePoint(ifaceIndex, sampleCount - 1, isoAt(alignedNow, 0));
    for (let s = 0; s < sampleCount; s += 1) {
      const offsetSec = (s - (sampleCount - 1)) * SAMPLE_INTERVAL_SEC;
      const base = baselinePoint(ifaceIndex, s, isoAt(alignedNow, offsetSec));
      const weight = anomalyWeight(s, sampleCount);
      const point = applyScenarioToPoint(scenario, iface.id, iface.device_id, base, weight);
      latest = point;
      if (iface.is_transit) {
        const existing = transitSeries[s];
        if (!existing) {
          transitSeries[s] = { ...point };
        } else {
          existing.bandwidth_util_pct += point.bandwidth_util_pct;
          existing.packet_drop_pct += point.packet_drop_pct;
          existing.latency_ms += point.latency_ms;
          existing.jitter_ms += point.jitter_ms;
          existing.crc_errors_per_sec += point.crc_errors_per_sec;
          existing.cpu_util_pct += point.cpu_util_pct;
          existing.memory_util_pct += point.memory_util_pct;
        }
      }
    }
    latestByIface.set(iface.id, latest);
    return {
      ...iface,
      latest,
      degraded: isDegradedInterface(scenario, iface.id, latest),
    };
  });

  const transitCount = INTERFACES.filter((i) => i.is_transit).length;
  const series = downsample(
    transitSeries.map((bucket) => ({
      ...bucket,
      bandwidth_util_pct: round1(bucket.bandwidth_util_pct / transitCount),
      packet_drop_pct: round2(bucket.packet_drop_pct / transitCount),
      latency_ms: round1(bucket.latency_ms / transitCount),
      jitter_ms: round1(bucket.jitter_ms / transitCount),
      crc_errors_per_sec: Math.round(bucket.crc_errors_per_sec / transitCount),
      cpu_util_pct: round1(bucket.cpu_util_pct / transitCount),
      memory_util_pct: round1(bucket.memory_util_pct / transitCount),
      data_origin: 'SIMULATED' as const,
    })),
  );

  const devices: DeviceSnapshot[] = DEVICES.map((device) => ({
    ...device,
    status: deviceStatusFor(scenario, device.id),
    interface_count: INTERFACES.filter((i) => i.device_id === device.id).length,
  }));

  const links: TopologyLink[] = TOPOLOGY_LINKS.map((link) => {
    const fromIface = interfaces.find(
      (i) => i.device_id === link.from_device_id && i.name === link.from_interface,
    );
    const toIface = interfaces.find(
      (i) => i.device_id === link.to_device_id && i.name === link.to_interface,
    );
    const util = Math.max(fromIface?.latest.bandwidth_util_pct ?? 0, toIface?.latest.bandwidth_util_pct ?? 0);
    const crc = Math.max(fromIface?.latest.crc_errors_per_sec ?? 0, toIface?.latest.crc_errors_per_sec ?? 0);
    const drop = Math.max(fromIface?.latest.packet_drop_pct ?? 0, toIface?.latest.packet_drop_pct ?? 0);
    return { ...link, utilization_pct: util, crc_errors_per_sec: crc, packet_drop_pct: drop };
  });

  const transitLatest = interfaces.filter((i) => i.is_transit).map((i) => i.latest);
  const maxDrop = Math.max(...transitLatest.map((p) => p.packet_drop_pct));
  const meanDrop = round2(mean(transitLatest.map((p) => p.packet_drop_pct)));
  const meanLatency = round1(mean(transitLatest.map((p) => p.latency_ms)));
  const hotPathLatency = round1(Math.max(...transitLatest.map((p) => p.latency_ms)));

  const dropSpark = series.map((p) => p.packet_drop_pct);
  const latSpark = series.map((p) => p.latency_ms);

  const incidents = buildIncidents(scenario, alignedNow, latestByIface);
  const health = deriveSystemHealth(
    devices.map((d) => d.status),
    incidents,
  );
  const ifaceCounts = countInterfaces(interfaces);

  return {
    generated_at: isoAt(alignedNow, 0),
    scenario,
    time_range: timeRange,
    sample_interval_sec: SAMPLE_INTERVAL_SEC,
    sample_count: sampleCount,
    devices,
    interfaces,
    links,
    series,
    incidents,
    kpis: {
      managed_devices: devices.length,
      online_interfaces: `${ifaceCounts.online} / ${ifaceCounts.total}`,
      aggregate_drop_pct: round2(maxDrop),
      aggregate_drop_mean_pct: meanDrop,
      avg_latency_ms: meanLatency,
      hot_path_latency_ms: hotPathLatency,
      drop_status: maxDrop > 10 ? 'critical' : maxDrop > 0.1 ? 'warning' : 'normal',
      latency_status: hotPathLatency > 100 ? 'critical' : hotPathLatency > 40 ? 'warning' : 'normal',
      drop_trend: trendFromSeries(dropSpark, 0.05),
      latency_trend: trendFromSeries(latSpark, 0.5),
      drop_sparkline: dropSpark,
      latency_sparkline: latSpark,
    },
    health,
    device_counts: countDevices(devices.map((d) => d.status)),
    interface_counts: ifaceCounts,
    severity_distribution: severityDistribution(incidents),
    data_origin: 'SIMULATED',
  };
}
