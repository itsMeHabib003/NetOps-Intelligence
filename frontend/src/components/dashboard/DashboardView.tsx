import { Activity, Clock, HardDrive, Server } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardSnapshot, TimeRange, TopologyFilter } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { HealthSummary } from './HealthSummary';
import { TopologyMap } from './TopologyMap';
import { IncidentFeed } from './IncidentFeed';
import { SeverityDistribution } from './SeverityDistribution';
import { TelemetryCharts } from './TelemetryCharts';
import { FreshnessBar } from './FreshnessBar';

interface DashboardViewProps {
  snapshot: DashboardSnapshot;
  nowMs: number;
  isStale: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onInjectDemo: () => void;
}

export function DashboardView({
  snapshot,
  nowMs,
  isStale,
  timeRange,
  onTimeRangeChange,
  onInjectDemo,
}: DashboardViewProps) {
  const [topoFilter, setTopoFilter] = useState<TopologyFilter>('ALL');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    snapshot.incidents[0]?.id ?? null,
  );

  const incidentsForDevice = useMemo(() => {
    if (!selectedDeviceId) return snapshot.incidents;
    return snapshot.incidents.filter((i) => i.device_id === selectedDeviceId);
  }, [snapshot.incidents, selectedDeviceId]);

  const kpis = snapshot.kpis;
  const dropSub =
    snapshot.scenario === 'NORMAL_BASELINE'
      ? `Mean ${kpis.aggregate_drop_mean_pct}% across transit`
      : `Max path ${kpis.aggregate_drop_pct}% · mean ${kpis.aggregate_drop_mean_pct}%`;

  return (
    <div className="space-y-4">
      <FreshnessBar
        generatedAt={snapshot.generated_at}
        nowMs={nowMs}
        sampleIntervalSec={snapshot.sample_interval_sec}
        sampleCount={snapshot.sample_count}
        timeRange={snapshot.time_range}
        isStale={isStale}
      />

      <HealthSummary snapshot={snapshot} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Managed Devices"
          value={kpis.managed_devices}
          unit="devices"
          subtext={`Online ${snapshot.device_counts.online} · Deg ${snapshot.device_counts.degraded} · Off ${snapshot.device_counts.offline}`}
          trend="flat"
          trendText="Lab inventory"
          status="normal"
          icon={<Server className="w-3.5 h-3.5 text-blue-400" />}
        />
        <MetricCard
          title="Online Interfaces"
          value={kpis.online_interfaces}
          unit="ports"
          subtext={
            snapshot.interface_counts.degraded > 0
              ? `${snapshot.interface_counts.degraded} port(s) degraded`
              : 'All transit and access ports UP'
          }
          trend={snapshot.interface_counts.degraded > 0 ? 'down' : 'flat'}
          trendText={snapshot.interface_counts.degraded > 0 ? 'Degraded' : 'Nominal'}
          status={snapshot.interface_counts.degraded > 0 ? 'warning' : 'normal'}
          icon={<HardDrive className="w-3.5 h-3.5 text-blue-400" />}
        />
        <MetricCard
          title="Aggregated Drop Rate"
          value={kpis.aggregate_drop_pct.toFixed(2)}
          unit="%"
          subtext={dropSub}
          trend={kpis.drop_trend}
          trendText={kpis.drop_trend === 'flat' ? 'Stable vs window' : 'vs window start'}
          status={kpis.drop_status}
          sparklineData={kpis.drop_sparkline}
          icon={<Activity className="w-3.5 h-3.5 text-red-400" />}
        />
        <MetricCard
          title="Avg Transit Latency"
          value={kpis.avg_latency_ms.toFixed(1)}
          unit="ms"
          subtext={`Hot path ${kpis.hot_path_latency_ms.toFixed(1)} ms`}
          trend={kpis.latency_trend}
          trendText={kpis.latency_trend === 'flat' ? 'Stable vs window' : 'vs window start'}
          status={kpis.latency_status}
          sparklineData={kpis.latency_sparkline}
          icon={<Clock className="w-3.5 h-3.5 text-amber-400" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
        <div className="xl:col-span-7">
          <TopologyMap
            devices={snapshot.devices}
            links={snapshot.links}
            filter={topoFilter}
            onFilterChange={setTopoFilter}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={(id) => {
              setSelectedDeviceId((prev) => (prev === id ? null : id));
              const match = snapshot.incidents.find((i) => i.device_id === id);
              if (match) setSelectedIncidentId(match.id);
            }}
          />
        </div>
        <div className="xl:col-span-3 space-y-4">
          <IncidentFeed
            incidents={incidentsForDevice}
            selectedId={selectedIncidentId}
            onSelect={setSelectedIncidentId}
            onInjectDemo={onInjectDemo}
          />
          <SeverityDistribution snapshot={snapshot} />
        </div>
      </div>

      <TelemetryCharts series={snapshot.series} timeRange={timeRange} onTimeRangeChange={onTimeRangeChange} />
    </div>
  );
}
