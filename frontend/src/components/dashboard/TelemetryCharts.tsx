import type { ReactNode } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TelemetryPoint, TimeRange } from '../../types';
import { ProvenancePill } from '../common/ProvenancePill';
import { TimeRangeToggle } from './TimeRangeToggle';

interface TelemetryChartsProps {
  series: TelemetryPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

function tickLabel(iso: string): string {
  return iso.substring(11, 19);
}

export function TelemetryCharts({ series, timeRange, onTimeRangeChange }: TelemetryChartsProps) {
  const chartData = series.map((p) => ({
    ...p,
    t: tickLabel(p.timestamp),
  }));

  return (
    <section className="bg-surface-1 border border-border-subtle rounded-lg p-4" aria-label="Latency and packet-loss trends">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Latency & Packet-Loss Trends</h3>
          <ProvenancePill type="SIMULATED" size="xs" />
        </div>
        <TimeRangeToggle value={timeRange} onChange={onTimeRangeChange} />
      </div>

      <p className="text-[11px] text-gray-500 mb-3">
        Transit-interface mean, downsampled to {series.length} chart points. Threshold lines are the same rules used for incident scoring.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Packet drop rate (%)">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip content={<SimTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0.1} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warn 0.1%', fill: '#FBBF24', fontSize: 10 }} />
              <ReferenceLine y={10} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Crit 10%', fill: '#F87171', fontSize: 10 }} />
              <Area type="monotone" dataKey="packet_drop_pct" name="Drop %" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.12} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="One-way latency (ms)">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip content={<SimTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warn 40ms', fill: '#FBBF24', fontSize: 10 }} />
              <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Crit 100ms', fill: '#F87171', fontSize: 10 }} />
              <Line type="monotone" dataKey="latency_ms" name="Latency ms" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              <Line type="monotone" dataKey="jitter_ms" name="Jitter ms" stroke="#94A3B8" strokeWidth={1} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <table className="sr-only">
        <caption>Simulated transit telemetry</caption>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Drop %</th>
            <th>Latency ms</th>
          </tr>
        </thead>
        <tbody>
          {series.map((p) => (
            <tr key={p.timestamp}>
              <td>{p.timestamp}</td>
              <td>{p.packet_drop_pct}</td>
              <td>{p.latency_ms}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-300 mb-1">{title}</h4>
      <div className="h-[240px]">{children}</div>
    </div>
  );
}

function SimTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border-strong bg-[#0E1420] px-2.5 py-2 text-[11px]">
      <div className="font-mono text-gray-300 mb-1">{label} UTC · SIMULATED DATA</div>
      {payload.map((item) => (
        <div key={item.name} style={{ color: item.color }}>
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
}
