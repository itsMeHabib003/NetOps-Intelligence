import { Activity, RefreshCw } from 'lucide-react';
import { ScenarioId } from '../../types';

interface ScenarioBarProps {
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  onReset: () => void;
}

export function ScenarioBar({ activeScenario, onSelectScenario, onReset }: ScenarioBarProps) {
  return (
    <div className="bg-surface-1 border-b border-border-subtle px-4 py-1.5 flex items-center justify-between overflow-x-auto gap-3 text-xs">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-gray-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" /> Scenario Injector:
        </span>

        {/* 1. Normal Baseline */}
        <button
          onClick={() => onSelectScenario('NORMAL_BASELINE')}
          className={`px-2.5 py-1 rounded font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            activeScenario === 'NORMAL_BASELINE'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
              : 'bg-surface-2 hover:bg-surface-3 text-gray-300 border border-border-subtle'
          }`}
          title="Normal baseline operating parameters: zero CRC errors, <40% load, 0% drop rate."
        >
          ● Normal Baseline
        </button>

        {/* 2. SFP CRC Storm */}
        <button
          onClick={() => onSelectScenario('SCENARIO_CRC_STORM')}
          className={`px-2.5 py-1 rounded font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            activeScenario === 'SCENARIO_CRC_STORM'
              ? 'bg-red-950/90 text-red-300 border border-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
              : 'bg-surface-2 hover:bg-surface-3 text-gray-300 border border-border-subtle'
          }`}
          title="Induces CRC frame error storm (>150/s) on AGG-SW01 uplink HundredGigE0/0/1 due to physical transceiver degradation."
        >
          ▲ SFP CRC Storm
        </button>

        {/* 3. WAN Congestion */}
        <button
          onClick={() => onSelectScenario('SCENARIO_WAN_SATURATION')}
          className={`px-2.5 py-1 rounded font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            activeScenario === 'SCENARIO_WAN_SATURATION'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
              : 'bg-surface-2 hover:bg-surface-3 text-gray-300 border border-border-subtle'
          }`}
          title="Induces WAN link saturation (>95% bandwidth) and buffer queue drop spikes on WAN-GW01."
        >
          ▲ WAN Congestion
        </button>

        {/* 4. BGP Route Flap */}
        <button
          onClick={() => onSelectScenario('SCENARIO_BGP_FLAP')}
          className={`px-2.5 py-1 rounded font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            activeScenario === 'SCENARIO_BGP_FLAP'
              ? 'bg-purple-950/90 text-purple-300 border border-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
              : 'bg-surface-2 hover:bg-surface-3 text-gray-300 border border-border-subtle'
          }`}
          title="Induces peering reset flaps on Core router COR-RTR01 causing route table recalculations."
        >
          ▲ BGP Peering Flap
        </button>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-gray-300 hover:text-white bg-surface-2 hover:bg-surface-3 border border-border-subtle shrink-0 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        title="Reset all telemetry metrics and incidents back to healthy baseline"
      >
        <RefreshCw className="w-3 h-3 text-gray-400" />
        <span>Reset to Healthy</span>
      </button>
    </div>
  );
}
