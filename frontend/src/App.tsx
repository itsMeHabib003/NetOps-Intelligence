import { useEffect, useMemo, useState } from 'react';
import { Activity, Clock, Server, SlidersHorizontal } from 'lucide-react';
import { Header } from './components/common/Header';
import { ScenarioBar } from './components/common/ScenarioBar';
import { NavigationTabs, NavTabId } from './components/common/NavigationTabs';
import { StatusIndicator } from './components/common/StatusIndicator';
import { SeverityBadge } from './components/common/SeverityBadge';
import { ProvenancePill } from './components/common/ProvenancePill';
import { LoadingSkeleton, EmptyState, ErrorState, NotConnectedBanner } from './components/common/UXStates';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { generateDashboardSnapshot } from './data/simulation';
import { OperatorPersona, ScenarioId, TimeRange } from './types';

export default function App() {
  const [operator, setOperator] = useState<OperatorPersona>('Alex (NOC Tier-1)');
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('NORMAL_BASELINE');
  const [timeRange, setTimeRange] = useState<TimeRange>('15m');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [demoState, setDemoState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [isStale, setIsStale] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === '1') {
        setActiveTab('dashboard');
      } else if (e.key === '2') {
        setActiveTab('devices');
      } else if (e.key === '3') {
        setActiveTab('incidents');
      } else if (e.key === '4') {
        setActiveTab('history');
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isStale) return undefined;
    const id = window.setInterval(() => setNowMs(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, [isStale]);

  const handleToggleOperator = () => {
    setOperator((prev) => (prev === 'Alex (NOC Tier-1)' ? 'Jordan (IT Lead)' : 'Alex (NOC Tier-1)'));
  };

  const handleReset = () => {
    setActiveScenario('NORMAL_BASELINE');
    setDemoState('normal');
    setIsStale(false);
    setNowMs(Date.now());
  };

  const snapshot = useMemo(
    () => generateDashboardSnapshot(activeScenario, timeRange, nowMs),
    [activeScenario, timeRange, nowMs],
  );

  const systemHealth = snapshot.health;
  const activeIncidentsCount = snapshot.incidents.filter((incident) => incident.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-canvas text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        operator={operator}
        onToggleOperator={handleToggleOperator}
        systemHealth={systemHealth}
        activeIncidentsCount={activeIncidentsCount}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      <NotConnectedBanner />

      <ScenarioBar
        activeScenario={activeScenario}
        onSelectScenario={(sc) => {
          setActiveScenario(sc);
          setDemoState('normal');
          setActiveTab('dashboard');
          setNowMs(Date.now());
        }}
        onReset={handleReset}
      />

      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeIncidentsCount={activeIncidentsCount}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-[1600px] mx-auto w-full space-y-6">
        <div className="bg-surface-1 border border-border-subtle rounded-lg px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-gray-300">UX State Inspector:</span>
            <span>Test canonical application states:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setDemoState('normal')}
              className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                demoState === 'normal'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              Normal View
            </button>
            <button
              onClick={() => setDemoState('loading')}
              className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                demoState === 'loading'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              Loading Skeleton
            </button>
            <button
              onClick={() => setDemoState('empty')}
              className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                demoState === 'empty'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              Empty State
            </button>
            <button
              onClick={() => setDemoState('error')}
              className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                demoState === 'error'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              Error State
            </button>
            <button
              onClick={() => setIsStale((prev) => !prev)}
              className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                isStale
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-surface-2 text-gray-400 border-border-subtle hover:text-white'
              }`}
            >
              Toggle Stale Badge
            </button>
          </div>
        </div>

        {demoState === 'loading' && (
          <div className="space-y-6">
            <LoadingSkeleton count={4} type="card" />
            <LoadingSkeleton count={1} type="chart" />
            <LoadingSkeleton count={3} type="row" />
          </div>
        )}

        {demoState === 'error' && (
          <div className="space-y-4">
            <ErrorState
              message="Failed to poll telemetry frame: HTTP 503 Service Unavailable on /api/telemetry/live."
              onRetry={() => setDemoState('normal')}
            />
            <EmptyState
              title="Telemetry Feed Offline"
              description="Could not connect to the streaming telemetry broker. Please check local connectivity and retry."
              actionText="Retry Loading Telemetry"
              onAction={() => setDemoState('normal')}
            />
          </div>
        )}

        {demoState === 'empty' && (
          <EmptyState
            title="No Active Incidents Detected"
            description="All 9 lab topology devices and 26 physical interfaces are operating within normal baseline specifications."
            actionText="Inject SFP CRC Storm Demo"
            onAction={() => {
              setActiveScenario('SCENARIO_CRC_STORM');
              setDemoState('normal');
              setActiveTab('dashboard');
            }}
          />
        )}

        {demoState === 'normal' && activeTab === 'dashboard' && (
          <DashboardView
            key={`${activeScenario}-${timeRange}`}
            snapshot={snapshot}
            nowMs={nowMs}
            isStale={isStale}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onInjectDemo={() => {
              setActiveScenario('SCENARIO_CRC_STORM');
              setNowMs(Date.now());
            }}
          />
        )}

        {demoState === 'normal' && activeTab === 'devices' && (
          <div className="bg-surface-1 border border-border-subtle rounded-lg p-8 text-center space-y-3">
            <Server className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Device Inventory & Topology Visualizer</h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Inventory filters and interface tables are scheduled after this dashboard prototype. Use the Dashboard topology map for the current 9-device lab.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <StatusIndicator status="HEALTHY" />
              <ProvenancePill type="SIMULATED" />
            </div>
          </div>
        )}

        {demoState === 'normal' && activeTab === 'incidents' && (
          <div className="bg-surface-1 border border-border-subtle rounded-lg p-8 text-center space-y-3">
            <Activity className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Incident Triage Console & Evidence Inspector</h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Full queue filters, lifecycle actions, and playbooks are not on this dashboard. Inspect recent incidents from the Dashboard feed instead.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs"
            >
              Back to Dashboard
            </button>
            <div className="flex justify-center gap-2 pt-2">
              <SeverityBadge severity="P1" />
              <ProvenancePill type="UNVERIFIED_HYPOTHESIS" />
            </div>
          </div>
        )}

        {demoState === 'normal' && activeTab === 'history' && (
          <div className="bg-surface-1 border border-border-subtle rounded-lg p-8 text-center space-y-3">
            <Clock className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Incident Audit History & MTTR Tracking</h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Audit history is not part of this dashboard phase. No resolved incidents are stored in the simulated snapshot.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <ProvenancePill type="VERIFIED_DIAGNOSTIC" />
            </div>
          </div>
        )}
      </main>

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <footer className="bg-surface-0 border-t border-border-subtle px-4 py-2 text-[11px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>NetOps Intelligence v1.0.0</span>
          <span>•</span>
          <span className="text-blue-400">Modular Monolith</span>
          <span>•</span>
          <span>
            Press <kbd className="px-1 py-0.5 rounded bg-surface-2 text-gray-300 font-mono text-[10px]">?</kbd> for shortcuts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ProvenancePill type="SIMULATED" size="xs" />
          <span>No destructive automation enabled</span>
        </div>
      </footer>
    </div>
  );
}
