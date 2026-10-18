import { DashboardSnapshot } from '../../types';
import { StatusIndicator } from '../common/StatusIndicator';
import { ProvenancePill } from '../common/ProvenancePill';

interface HealthSummaryProps {
  snapshot: DashboardSnapshot;
}

export function HealthSummary({ snapshot }: HealthSummaryProps) {
  const { health, device_counts, interface_counts, incidents } = snapshot;
  const p1 = snapshot.severity_distribution.P1;
  const active = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <section
      className="bg-surface-1 border border-border-subtle rounded-lg p-4"
      aria-label="Network health summary"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Network Health Summary</h2>
          <ProvenancePill type="SIMULATED" size="xs" />
        </div>
        <StatusIndicator status={health} />
      </div>

      <p className="text-xs text-gray-400 mb-3">
        {health === 'HEALTHY' && 'All managed lab devices are inside baseline thresholds. No active incidents.'}
        {health === 'DEGRADED' && `${active} active incident${active === 1 ? '' : 's'} with at least one degraded device. Traffic is forwarding on redundant paths.`}
        {health === 'CRITICAL' && `${active} active incident${active === 1 ? '' : 's'} including ${p1} P1. Packet loss exceeds the 10% critical rule on a transit path.`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <CountTile label="Online" value={device_counts.online} tone="emerald" hint="HEALTHY or MAINTENANCE" />
        <CountTile label="Degraded" value={device_counts.degraded} tone="amber" hint="DEGRADED devices" />
        <CountTile label="Offline" value={device_counts.offline} tone="rose" hint="CRITICAL / service offline" />
        <CountTile
          label="Interfaces Up"
          value={interface_counts.online}
          tone="blue"
          hint={`${interface_counts.degraded} degraded of ${interface_counts.total}`}
        />
      </div>
    </section>
  );
}

function CountTile({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: number;
  tone: 'emerald' | 'amber' | 'rose' | 'blue';
  hint: string;
}) {
  const tones = {
    emerald: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/20',
    amber: 'text-amber-300 border-amber-500/30 bg-amber-950/20',
    rose: 'text-rose-300 border-rose-500/30 bg-rose-950/20',
    blue: 'text-blue-300 border-blue-500/30 bg-blue-950/20',
  };
  return (
    <div className={`rounded-lg border px-2 py-2 ${tones[tone]}`} title={hint}>
      <div className="text-lg font-mono font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}
