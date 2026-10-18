export type DeviceRole = 'CORE' | 'AGGREGATION' | 'ACCESS' | 'FIREWALL' | 'WAN';
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'MAINTENANCE';
export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
export type OperStatus = 'UP' | 'DOWN';

export type ConfidenceTier =
  | 'OBSERVED_MEASUREMENT'
  | 'RULES_BASED_FINDING'
  | 'UNVERIFIED_HYPOTHESIS'
  | 'VERIFIED_DIAGNOSTIC';

export type DataOrigin = 'SIMULATED';

export type OperatorPersona = 'Alex (NOC Tier-1)' | 'Jordan (IT Lead)';

export type ScenarioId =
  | 'NORMAL_BASELINE'
  | 'SCENARIO_CRC_STORM'
  | 'SCENARIO_WAN_SATURATION'
  | 'SCENARIO_BGP_FLAP';

export type TimeRange = '5m' | '15m' | '1h';

export type TopologyFilter = 'ALL' | DeviceRole | 'PERIMETER';

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  description: string;
  targetDevice: string;
  targetInterface?: string;
  expectedSeverity: IncidentSeverity;
}

export interface Device {
  id: string;
  hostname: string;
  ip_address: string;
  role: DeviceRole;
  model: string;
  rack_location: string;
  firmware: string;
  status: HealthStatus;
  uptime_seconds: number;
}

export interface NetworkInterface {
  id: string;
  device_id: string;
  name: string;
  speed_gbps: number;
  admin_status: OperStatus;
  oper_status: OperStatus;
  connected_peer: string;
  is_transit: boolean;
}

export interface TelemetryPoint {
  timestamp: string;
  bandwidth_util_pct: number;
  packet_drop_pct: number;
  latency_ms: number;
  jitter_ms: number;
  crc_errors_per_sec: number;
  cpu_util_pct: number;
  memory_util_pct: number;
  data_origin: DataOrigin;
}

export interface InterfaceSnapshot extends NetworkInterface {
  latest: TelemetryPoint;
  degraded: boolean;
}

export interface DeviceSnapshot extends Device {
  interface_count: number;
}

export interface TopologyLink {
  id: string;
  from_device_id: string;
  to_device_id: string;
  from_interface: string;
  to_interface: string;
  utilization_pct: number;
  crc_errors_per_sec: number;
  packet_drop_pct: number;
}

export interface IncidentEvidenceRow {
  metric_name: string;
  observed_value: string;
  threshold_value: string;
  confidence_tier: ConfidenceTier;
}

export interface IncidentView {
  id: string;
  device_id: string;
  hostname: string;
  interface_id?: string;
  interface_name?: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priority_score: number;
  detected_at: string;
  assigned_operator: string | null;
  active_scenario: ScenarioId;
  rule_id: string;
  rule_explanation: string;
  hypothesis: string;
  evidence: IncidentEvidenceRow[];
  data_origin: DataOrigin;
}

export interface DeviceCounts {
  total: number;
  online: number;
  degraded: number;
  offline: number;
}

export interface InterfaceCounts {
  total: number;
  online: number;
  degraded: number;
  down: number;
}

export interface DashboardKpis {
  managed_devices: number;
  online_interfaces: string;
  aggregate_drop_pct: number;
  aggregate_drop_mean_pct: number;
  avg_latency_ms: number;
  hot_path_latency_ms: number;
  drop_status: 'normal' | 'warning' | 'critical';
  latency_status: 'normal' | 'warning' | 'critical';
  drop_trend: 'up' | 'down' | 'flat';
  latency_trend: 'up' | 'down' | 'flat';
  drop_sparkline: number[];
  latency_sparkline: number[];
}

export interface DashboardSnapshot {
  generated_at: string;
  scenario: ScenarioId;
  time_range: TimeRange;
  sample_interval_sec: number;
  sample_count: number;
  devices: DeviceSnapshot[];
  interfaces: InterfaceSnapshot[];
  links: TopologyLink[];
  series: TelemetryPoint[];
  incidents: IncidentView[];
  kpis: DashboardKpis;
  health: HealthStatus;
  device_counts: DeviceCounts;
  interface_counts: InterfaceCounts;
  severity_distribution: Record<IncidentSeverity, number>;
  data_origin: DataOrigin;
}
