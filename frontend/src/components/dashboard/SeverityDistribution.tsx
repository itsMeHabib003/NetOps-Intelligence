import { IncidentSeverity, DashboardSnapshot } from '../../types';

const ORDER: IncidentSeverity[] = ['P1', 'P2', 'P3', 'P4'];
const COLORS: Record<IncidentSeverity, string> = {
  P1: 'bg-red-500',
  P2: 'bg-orange-500',
  P3: 'bg-yellow-400',
  P4: 'bg-blue-500',
};

interface SeverityDistributionProps {
  snapshot: DashboardSnapshot;
}

export function SeverityDistribution({ snapshot }: SeverityDistributionProps) {
  const dist = snapshot.severity_distribution;
  const total = ORDER.reduce((sum, key) => sum + dist[key], 0);
  const max = Math.max(1, ...ORDER.map((key) => dist[key]));

  return (
    <section className="bg-surface-1 border border-border-subtle rounded-lg p-4" aria-label="Severity distribution">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        Active Severity Distribution
      </h3>
      {total === 0 ? (
        <p className="text-xs text-gray-500">No active incidents in this simulated snapshot.</p>
      ) : (
        <ul className="space-y-2">
          {ORDER.map((sev) => (
            <li key={sev} className="flex items-center gap-2 text-xs">
              <span className="w-8 font-mono text-gray-300">{sev}</span>
              <div className="flex-1 h-2 rounded bg-surface-2 overflow-hidden">
                <div
                  className={`h-full ${COLORS[sev]}`}
                  style={{ width: `${(dist[sev] / max) * 100}%` }}
                />
              </div>
              <span className="w-4 text-right font-mono text-gray-300">{dist[sev]}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">
        P1 {dist.P1}, P2 {dist.P2}, P3 {dist.P3}, P4 {dist.P4}. Total active {total}.
      </p>
    </section>
  );
}
