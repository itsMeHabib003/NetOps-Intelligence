import { describe, expect, it } from 'vitest';
import { DEVICES, INTERFACES } from './catalog';
import { generateDashboardSnapshot } from './simulation';

const NOW = Date.parse('2026-10-18T12:00:00.000Z');

describe('simulated dashboard snapshot', () => {
  it('keeps inventory sizes fixed', () => {
    expect(DEVICES).toHaveLength(9);
    expect(INTERFACES).toHaveLength(26);
  });

  it('is internally consistent on the healthy baseline', () => {
    const snap = generateDashboardSnapshot('NORMAL_BASELINE', '15m', NOW);
    expect(snap.data_origin).toBe('SIMULATED');
    expect(snap.health).toBe('HEALTHY');
    expect(snap.device_counts).toEqual({ total: 9, online: 9, degraded: 0, offline: 0 });
    expect(snap.interface_counts.online).toBe(26);
    expect(snap.kpis.aggregate_drop_pct).toBe(0);
    expect(snap.incidents).toHaveLength(0);
    expect(snap.severity_distribution).toEqual({ P1: 0, P2: 0, P3: 0, P4: 0 });
    expect(snap.series).toHaveLength(30);
    expect(snap.kpis.managed_devices).toBe(snap.devices.length);
  });

  it('ties CRC storm KPIs, topology, and the P2 incident to the same uplink', () => {
    const snap = generateDashboardSnapshot('SCENARIO_CRC_STORM', '15m', NOW);
    const agg = snap.devices.find((d) => d.id === 'dev-agg-01');
    const uplink = snap.interfaces.find((i) => i.id === 'intf-agg01-1');
    const incident = snap.incidents[0];
    const link = snap.links.find((l) => l.id === 'link-cor1-agg1');

    expect(snap.health).toBe('DEGRADED');
    expect(snap.device_counts).toEqual({ total: 9, online: 8, degraded: 1, offline: 0 });
    expect(agg?.status).toBe('DEGRADED');
    expect(uplink?.latest.crc_errors_per_sec).toBe(184);
    expect(uplink?.latest.packet_drop_pct).toBe(6.8);
    expect(snap.kpis.aggregate_drop_pct).toBe(6.8);
    expect(incident.severity).toBe('P2');
    expect(incident.interface_id).toBe('intf-agg01-1');
    expect(incident.priority_score).toBe(76);
    expect(incident.evidence[0].observed_value).toBe('184 err/s');
    expect(link?.crc_errors_per_sec).toBe(184);
  });

  it('treats WAN saturation as P1 CRITICAL with matching hot-path latency', () => {
    const snap = generateDashboardSnapshot('SCENARIO_WAN_SATURATION', '5m', NOW);
    const wan = snap.interfaces.find((i) => i.id === 'intf-wan01-1');
    const incident = snap.incidents[0];

    expect(snap.health).toBe('CRITICAL');
    expect(snap.device_counts.offline).toBe(1);
    expect(snap.device_counts.degraded).toBe(1);
    expect(wan?.latest.packet_drop_pct).toBe(12.4);
    expect(wan?.latest.bandwidth_util_pct).toBe(96.4);
    expect(wan?.latest.latency_ms).toBe(142.8);
    expect(snap.kpis.aggregate_drop_pct).toBe(12.4);
    expect(snap.kpis.hot_path_latency_ms).toBe(142.8);
    expect(incident.severity).toBe('P1');
    expect(incident.priority_score).toBe(92);
    expect(snap.severity_distribution.P1).toBe(1);
  });

  it('keeps BGP flap on COR-RTR01 without taking the WAN path offline', () => {
    const snap = generateDashboardSnapshot('SCENARIO_BGP_FLAP', '1h', NOW);
    const core = snap.devices.find((d) => d.id === 'dev-cor-01');
    expect(core?.status).toBe('DEGRADED');
    expect(snap.health).toBe('DEGRADED');
    expect(snap.incidents[0].hostname).toBe('COR-RTR01');
    expect(snap.kpis.aggregate_drop_pct).toBeLessThan(10);
    expect(snap.devices.find((d) => d.id === 'dev-wan-01')?.status).toBe('HEALTHY');
  });

  it('does not change catalog identity when the time range changes', () => {
    const a = generateDashboardSnapshot('SCENARIO_CRC_STORM', '5m', NOW);
    const b = generateDashboardSnapshot('SCENARIO_CRC_STORM', '1h', NOW);
    expect(a.incidents[0].id).toBe(b.incidents[0].id);
    expect(a.devices.map((d) => d.id)).toEqual(b.devices.map((d) => d.id));
  });
});
