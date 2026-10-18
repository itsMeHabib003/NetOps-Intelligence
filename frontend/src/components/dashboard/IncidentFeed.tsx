import { IncidentView } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { ProvenancePill } from '../common/ProvenancePill';
import { EmptyState } from '../common/UXStates';

interface IncidentFeedProps {
  incidents: IncidentView[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onInjectDemo: () => void;
}

export function IncidentFeed({ incidents, selectedId, onSelect, onInjectDemo }: IncidentFeedProps) {
  const recent = incidents.slice(0, 5);
  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  return (
    <section className="bg-surface-1 border border-border-subtle rounded-lg p-4 h-full flex flex-col" aria-label="Recent incidents">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Recent Incidents</h3>
        <ProvenancePill type="SIMULATED" size="xs" />
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="No incidents match this snapshot"
          description="Baseline simulation has zero rule breaches. Inject a demo scenario to populate the feed."
          actionText="Inject SFP CRC Storm"
          onAction={onInjectDemo}
        />
      ) : (
        <ul className="space-y-2">
          {recent.map((incident) => (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onSelect(incident.id)}
                className={`w-full text-left rounded-lg border p-2.5 ${
                  selectedId === incident.id
                    ? 'border-blue-500 bg-surface-3'
                    : 'border-border-subtle bg-surface-2/40 hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <SeverityBadge severity={incident.severity} size="sm" />
                  <span className="font-mono text-[11px] text-gray-400">{incident.priority_score}/100</span>
                </div>
                <p className="mt-1 text-xs text-white leading-snug">{incident.title}</p>
                <p className="mt-1 font-mono text-[10px] text-gray-500">
                  {incident.id} · {incident.hostname}
                  {incident.interface_name ? `:${incident.interface_name}` : ''} · {incident.status}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-3 pt-3 border-t border-border-subtle space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <ProvenancePill type="RULES_BASED_FINDING" size="xs" />
            <span className="font-mono text-indigo-300">{selected.rule_id}</span>
          </div>
          <p className="text-gray-300">{selected.rule_explanation}</p>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left font-medium py-1">Metric</th>
                <th className="text-left font-medium">Observed</th>
                <th className="text-left font-medium">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {selected.evidence.map((row) => (
                <tr key={row.metric_name} className="font-mono text-gray-300">
                  <td className="py-0.5">{row.metric_name}</td>
                  <td>{row.observed_value}</td>
                  <td>{row.threshold_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rounded border border-fuchsia-700/40 bg-fuchsia-950/20 p-2">
            <ProvenancePill type="UNVERIFIED_HYPOTHESIS" size="xs" />
            <p className="mt-1 text-fuchsia-100/90">{selected.hypothesis}</p>
            <p className="mt-1 text-[10px] text-gray-500">
              Operator verification required. Guided playbooks are not on this dashboard.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
