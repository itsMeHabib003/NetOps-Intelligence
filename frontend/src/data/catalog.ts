import { Device, NetworkInterface, TopologyLink } from '../types';

export const SAMPLE_INTERVAL_SEC = 5;
export const CHART_POINT_LIMIT = 30;

export const DEVICES: Device[] = [
  { id: 'dev-cor-01', hostname: 'COR-RTR01', ip_address: '10.10.0.1', role: 'CORE', model: 'Nexus 9336C-FX2', rack_location: 'LAB-R01-U20', firmware: '10.3.4.M', status: 'HEALTHY', uptime_seconds: 7_884_000 },
  { id: 'dev-cor-02', hostname: 'COR-RTR02', ip_address: '10.10.0.2', role: 'CORE', model: 'Nexus 9336C-FX2', rack_location: 'LAB-R02-U20', firmware: '10.3.4.M', status: 'HEALTHY', uptime_seconds: 7_883_640 },
  { id: 'dev-agg-01', hostname: 'AGG-SW01', ip_address: '10.10.1.1', role: 'AGGREGATION', model: 'Catalyst 9500-48Y4C', rack_location: 'LAB-R01-U12', firmware: '17.12.3', status: 'HEALTHY', uptime_seconds: 4_320_000 },
  { id: 'dev-agg-02', hostname: 'AGG-SW02', ip_address: '10.10.1.2', role: 'AGGREGATION', model: 'Catalyst 9500-48Y4C', rack_location: 'LAB-R02-U12', firmware: '17.12.3', status: 'HEALTHY', uptime_seconds: 4_319_400 },
  { id: 'dev-acc-01', hostname: 'ACC-SW01', ip_address: '10.10.2.1', role: 'ACCESS', model: 'Catalyst 9300-24T', rack_location: 'LAB-R03-U08', firmware: '17.12.3', status: 'HEALTHY', uptime_seconds: 2_592_000 },
  { id: 'dev-acc-02', hostname: 'ACC-SW02', ip_address: '10.10.2.2', role: 'ACCESS', model: 'Catalyst 9300-24T', rack_location: 'LAB-R03-U10', firmware: '17.12.3', status: 'HEALTHY', uptime_seconds: 2_591_400 },
  { id: 'dev-acc-03', hostname: 'ACC-SW03', ip_address: '10.10.2.3', role: 'ACCESS', model: 'Catalyst 9300-24T', rack_location: 'LAB-R04-U08', firmware: '17.12.3', status: 'HEALTHY', uptime_seconds: 2_590_800 },
  { id: 'dev-fw-01', hostname: 'FW-EDG01', ip_address: '10.10.8.1', role: 'FIREWALL', model: 'PA-3220 (lab image)', rack_location: 'LAB-R01-U04', firmware: '11.1.2', status: 'HEALTHY', uptime_seconds: 1_296_000 },
  { id: 'dev-wan-01', hostname: 'WAN-GW01', ip_address: '10.10.9.1', role: 'WAN', model: 'ISR 4431', rack_location: 'LAB-R01-U02', firmware: '17.9.4a', status: 'HEALTHY', uptime_seconds: 1_209_600 },
];

/** 26 physical interfaces — IDs are stable keys used by the simulator. */
export const INTERFACES: NetworkInterface[] = [
  { id: 'intf-cor01-1', device_id: 'dev-cor-01', name: 'HundredGigE0/0/1', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW01:HundredGigE0/0/1', is_transit: true },
  { id: 'intf-cor01-2', device_id: 'dev-cor-01', name: 'HundredGigE0/0/2', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW02:HundredGigE0/0/1', is_transit: true },
  { id: 'intf-cor01-3', device_id: 'dev-cor-01', name: 'HundredGigE0/0/3', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR02:HundredGigE0/0/3', is_transit: true },
  { id: 'intf-cor01-4', device_id: 'dev-cor-01', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'FW-EDG01:TenGigE0/1/1', is_transit: true },
  { id: 'intf-cor02-1', device_id: 'dev-cor-02', name: 'HundredGigE0/0/1', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW01:HundredGigE0/0/2', is_transit: true },
  { id: 'intf-cor02-2', device_id: 'dev-cor-02', name: 'HundredGigE0/0/2', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW02:HundredGigE0/0/2', is_transit: true },
  { id: 'intf-cor02-3', device_id: 'dev-cor-02', name: 'HundredGigE0/0/3', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR01:HundredGigE0/0/3', is_transit: true },
  { id: 'intf-cor02-4', device_id: 'dev-cor-02', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'FW-EDG01:TenGigE0/1/2', is_transit: true },
  { id: 'intf-agg01-1', device_id: 'dev-agg-01', name: 'HundredGigE0/0/1', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR01:HundredGigE0/0/1', is_transit: true },
  { id: 'intf-agg01-2', device_id: 'dev-agg-01', name: 'HundredGigE0/0/2', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR02:HundredGigE0/0/1', is_transit: true },
  { id: 'intf-agg01-3', device_id: 'dev-agg-01', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'ACC-SW01:TenGigE0/1/1', is_transit: true },
  { id: 'intf-agg01-4', device_id: 'dev-agg-01', name: 'TenGigE0/1/2', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'ACC-SW02:TenGigE0/1/1', is_transit: true },
  { id: 'intf-agg02-1', device_id: 'dev-agg-02', name: 'HundredGigE0/0/1', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR01:HundredGigE0/0/2', is_transit: true },
  { id: 'intf-agg02-2', device_id: 'dev-agg-02', name: 'HundredGigE0/0/2', speed_gbps: 100, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR02:HundredGigE0/0/2', is_transit: true },
  { id: 'intf-agg02-3', device_id: 'dev-agg-02', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'ACC-SW03:TenGigE0/1/1', is_transit: true },
  { id: 'intf-agg02-4', device_id: 'dev-agg-02', name: 'TenGigE0/1/2', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'ACC-SW02:TenGigE0/1/2', is_transit: true },
  { id: 'intf-acc01-1', device_id: 'dev-acc-01', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW01:TenGigE0/1/1', is_transit: false },
  { id: 'intf-acc01-2', device_id: 'dev-acc-01', name: 'GigabitEthernet0/1', speed_gbps: 1, admin_status: 'UP', oper_status: 'UP', connected_peer: 'LAB-HOST-A', is_transit: false },
  { id: 'intf-acc02-1', device_id: 'dev-acc-02', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW01:TenGigE0/1/2', is_transit: false },
  { id: 'intf-acc02-2', device_id: 'dev-acc-02', name: 'TenGigE0/1/2', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW02:TenGigE0/1/2', is_transit: false },
  { id: 'intf-acc03-1', device_id: 'dev-acc-03', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'AGG-SW02:TenGigE0/1/1', is_transit: false },
  { id: 'intf-acc03-2', device_id: 'dev-acc-03', name: 'GigabitEthernet0/1', speed_gbps: 1, admin_status: 'UP', oper_status: 'UP', connected_peer: 'LAB-HOST-C', is_transit: false },
  { id: 'intf-fw01-1', device_id: 'dev-fw-01', name: 'TenGigE0/1/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR01:TenGigE0/1/1', is_transit: true },
  { id: 'intf-fw01-2', device_id: 'dev-fw-01', name: 'TenGigE0/1/2', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'COR-RTR02:TenGigE0/1/1', is_transit: true },
  { id: 'intf-fw01-3', device_id: 'dev-fw-01', name: 'TenGigE0/1/3', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'WAN-GW01:TenGigE0/0/1', is_transit: true },
  { id: 'intf-wan01-1', device_id: 'dev-wan-01', name: 'TenGigE0/0/1', speed_gbps: 10, admin_status: 'UP', oper_status: 'UP', connected_peer: 'FW-EDG01:TenGigE0/1/3', is_transit: true },
];

export const TOPOLOGY_LINKS: Omit<TopologyLink, 'utilization_pct' | 'crc_errors_per_sec' | 'packet_drop_pct'>[] = [
  { id: 'link-core-ha', from_device_id: 'dev-cor-01', to_device_id: 'dev-cor-02', from_interface: 'HundredGigE0/0/3', to_interface: 'HundredGigE0/0/3' },
  { id: 'link-cor1-agg1', from_device_id: 'dev-cor-01', to_device_id: 'dev-agg-01', from_interface: 'HundredGigE0/0/1', to_interface: 'HundredGigE0/0/1' },
  { id: 'link-cor1-agg2', from_device_id: 'dev-cor-01', to_device_id: 'dev-agg-02', from_interface: 'HundredGigE0/0/2', to_interface: 'HundredGigE0/0/1' },
  { id: 'link-cor2-agg1', from_device_id: 'dev-cor-02', to_device_id: 'dev-agg-01', from_interface: 'HundredGigE0/0/1', to_interface: 'HundredGigE0/0/2' },
  { id: 'link-cor2-agg2', from_device_id: 'dev-cor-02', to_device_id: 'dev-agg-02', from_interface: 'HundredGigE0/0/2', to_interface: 'HundredGigE0/0/2' },
  { id: 'link-agg1-acc1', from_device_id: 'dev-agg-01', to_device_id: 'dev-acc-01', from_interface: 'TenGigE0/1/1', to_interface: 'TenGigE0/1/1' },
  { id: 'link-agg1-acc2', from_device_id: 'dev-agg-01', to_device_id: 'dev-acc-02', from_interface: 'TenGigE0/1/2', to_interface: 'TenGigE0/1/1' },
  { id: 'link-agg2-acc2', from_device_id: 'dev-agg-02', to_device_id: 'dev-acc-02', from_interface: 'TenGigE0/1/2', to_interface: 'TenGigE0/1/2' },
  { id: 'link-agg2-acc3', from_device_id: 'dev-agg-02', to_device_id: 'dev-acc-03', from_interface: 'TenGigE0/1/1', to_interface: 'TenGigE0/1/1' },
  { id: 'link-cor1-fw', from_device_id: 'dev-cor-01', to_device_id: 'dev-fw-01', from_interface: 'TenGigE0/1/1', to_interface: 'TenGigE0/1/1' },
  { id: 'link-cor2-fw', from_device_id: 'dev-cor-02', to_device_id: 'dev-fw-01', from_interface: 'TenGigE0/1/1', to_interface: 'TenGigE0/1/2' },
  { id: 'link-fw-wan', from_device_id: 'dev-fw-01', to_device_id: 'dev-wan-01', from_interface: 'TenGigE0/1/3', to_interface: 'TenGigE0/0/1' },
];

export const TIER_WEIGHT: Record<Device['role'], number> = {
  CORE: 100,
  WAN: 90,
  AGGREGATION: 75,
  FIREWALL: 70,
  ACCESS: 100,
};

export const CRC_TARGET_INTERFACE_ID = 'intf-agg01-1';
export const WAN_TARGET_INTERFACE_ID = 'intf-wan01-1';
export const BGP_TARGET_DEVICE_ID = 'dev-cor-01';
