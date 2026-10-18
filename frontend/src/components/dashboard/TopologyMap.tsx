import { Globe, GitFork, Layers, Server, Shield } from 'lucide-react';
import { DeviceRole, DeviceSnapshot, TopologyFilter, TopologyLink } from '../../types';
import { StatusIndicator } from '../common/StatusIndicator';
import { ProvenancePill } from '../common/ProvenancePill';

const FILTERS: { id: TopologyFilter; label: string }[] = [
  { id: 'ALL', label: 'All Tiers' },
  { id: 'CORE', label: 'Core' },
  { id: 'AGGREGATION', label: 'Aggregation' },
  { id: 'ACCESS', label: 'Access' },
  { id: 'PERIMETER', label: 'Perimeter' },
];

const TIERS: { role: DeviceRole; label: string; icon: typeof Server }[] = [
  { role: 'CORE', label: 'Core', icon: Server },
  { role: 'AGGREGATION', label: 'Aggregation', icon: GitFork },
  { role: 'ACCESS', label: 'Access', icon: Layers },
  { role: 'FIREWALL', label: 'Firewall', icon: Shield },
  { role: 'WAN', label: 'WAN', icon: Globe },
];

function matchesFilter(role: DeviceRole, filter: TopologyFilter): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'PERIMETER') return role === 'FIREWALL' || role === 'WAN';
  return role === filter;
}

function linkColor(link: TopologyLink): string {
  if (link.crc_errors_per_sec > 50 || link.packet_drop_pct > 10 || link.utilization_pct > 90) {
    return 'bg-red-500';
  }
  if (link.utilization_pct >= 70 || link.packet_drop_pct > 0.1) return 'bg-amber-400';
  return 'bg-emerald-500';
}

interface TopologyMapProps {
  devices: DeviceSnapshot[];
  links: TopologyLink[];
  filter: TopologyFilter;
  onFilterChange: (filter: TopologyFilter) => void;
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
}

export function TopologyMap({
  devices,
  links,
  filter,
  onFilterChange,
  selectedDeviceId,
  onSelectDevice,
}: TopologyMapProps) {
  const visible = devices.filter((d) => matchesFilter(d.role, filter));

  return (
    <section className="bg-surface-1 border border-border-subtle rounded-lg p-4 h-full" aria-label="Network topology">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Topology Health Map</h3>
          <ProvenancePill type="SIMULATED" size="xs" />
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Topology tier filter">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              aria-pressed={filter === item.id}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                filter === item.id
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {TIERS.filter((tier) => visible.some((d) => d.role === tier.role)).map((tier) => {
          const Icon = tier.icon;
          const nodes = visible.filter((d) => d.role === tier.role);
          return (
            <div key={tier.role}>
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">
                <Icon className="w-3 h-3" />
                {tier.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {nodes.map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => onSelectDevice(device.id)}
                    className={`text-left rounded-lg border p-2.5 transition-colors ${
                      selectedDeviceId === device.id
                        ? 'border-blue-500 bg-surface-3'
                        : 'border-border-subtle bg-surface-2/50 hover:bg-surface-2'
                    }`}
                    aria-pressed={selectedDeviceId === device.id}
                    aria-label={`${device.hostname} ${device.status}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-mono text-xs text-white">{device.hostname}</div>
                        <div className="font-mono text-[10px] text-gray-500">{device.ip_address}</div>
                      </div>
                      <StatusIndicator status={device.status} size="sm" />
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500">
                      {device.model} · {device.interface_count} ports
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Transit links</p>
        <ul className="space-y-1 max-h-36 overflow-y-auto">
          {links
            .filter((link) => {
              const from = devices.find((d) => d.id === link.from_device_id);
              const to = devices.find((d) => d.id === link.to_device_id);
              if (!from || !to) return false;
              return matchesFilter(from.role, filter) || matchesFilter(to.role, filter);
            })
            .map((link) => {
              const from = devices.find((d) => d.id === link.from_device_id);
              const to = devices.find((d) => d.id === link.to_device_id);
              return (
                <li key={link.id} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${linkColor(link)}`} />
                  <span className="font-mono truncate">
                    {from?.hostname}:{link.from_interface} → {to?.hostname}:{link.to_interface}
                  </span>
                  <span className="ml-auto font-mono text-gray-500 shrink-0">
                    {link.utilization_pct.toFixed(1)}%
                    {link.crc_errors_per_sec > 0 ? ` · ${link.crc_errors_per_sec} err/s` : ''}
                    {link.packet_drop_pct > 0 ? ` · ${link.packet_drop_pct}% drop` : ''}
                  </span>
                </li>
              );
            })}
        </ul>
        <p className="mt-2 text-[10px] text-gray-600">
          Link color: green &lt;70% util · amber 70–90% or elevated drops · red &gt;90% util, CRC, or &gt;10% drop.
        </p>
      </div>
    </section>
  );
}
