import { useEffect, useState } from 'react';
import { Radio, Clock, UserCheck, HelpCircle } from 'lucide-react';
import { OperatorPersona, HealthStatus } from '../../types';

interface HeaderProps {
  operator: OperatorPersona;
  onToggleOperator: () => void;
  systemHealth: HealthStatus;
  activeIncidentsCount: number;
  onOpenShortcuts: () => void;
}

export function Header({
  operator,
  onToggleOperator,
  systemHealth,
  activeIncidentsCount,
  onOpenShortcuts,
}: HeaderProps) {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const healthColor = {
    HEALTHY: 'text-emerald-400 bg-emerald-500',
    DEGRADED: 'text-amber-400 bg-amber-500',
    CRITICAL: 'text-red-400 bg-red-500',
    MAINTENANCE: 'text-slate-400 bg-slate-500',
  };

  const healthLabel = {
    HEALTHY: 'HEALTHY — All Tiers Normal',
    DEGRADED: `DEGRADED — ${activeIncidentsCount} Active Incident${activeIncidentsCount > 1 ? 's' : ''}`,
    CRITICAL: `CRITICAL — Outage Detected (${activeIncidentsCount} Active)`,
    MAINTENANCE: 'MAINTENANCE MODE',
  };

  return (
    <header className="bg-surface-0 border-b border-border-subtle px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Provenance */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
          <Radio className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">NetOps Intelligence</span>
            <span 
              className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-900/60 text-blue-300 border border-blue-600/50"
              title="All network metrics in this prototype are generated via a physics-based simulation engine"
            >
              SIMULATED DATA
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-none mt-0.5 hidden sm:block">
            Enterprise Operations Monitoring & Evidence-Based Triage
          </p>
        </div>
      </div>

      {/* Global Health Pill & Live Clock */}
      <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-1 border border-border-subtle">
        <span className="relative flex h-2 w-2">
          {systemHealth !== 'HEALTHY' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${healthColor[systemHealth].split(' ')[1]}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${healthColor[systemHealth].split(' ')[1]}`}></span>
        </span>
        <span className={`text-xs font-semibold ${healthColor[systemHealth].split(' ')[0]}`}>
          {healthLabel[systemHealth]}
        </span>
        <span className="text-xs text-gray-600">|</span>
        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-500" /> {utcTime}
        </span>
      </div>

      {/* Operator Switcher & Helper */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded bg-surface-1 hover:bg-surface-2 border border-border-subtle text-gray-400 hover:text-white transition-colors"
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 hidden lg:inline">Operator:</span>
          <button 
            onClick={onToggleOperator}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-1 hover:bg-surface-2 border border-border-strong text-xs font-medium text-blue-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            title="Click to toggle operator persona (Alex NOC Tier-1 vs Jordan IT Lead)"
            aria-label={`Active operator: ${operator}. Click to toggle.`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">{operator}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
