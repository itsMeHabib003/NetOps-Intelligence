import { CheckCircle2, AlertTriangle, AlertOctagon, Wrench } from 'lucide-react';
import { HealthStatus } from '../../types';

interface StatusIndicatorProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StatusIndicator({ status, size = 'md', showLabel = true }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  switch (status) {
    case 'HEALTHY':
      return (
        <span 
          className={`inline-flex items-center font-medium rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 ${sizeClasses[size]}`}
          title="Status: HEALTHY — Operating within normal parameters"
          aria-label="Status: Healthy"
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-400`} />
          {showLabel && <span>HEALTHY</span>}
        </span>
      );

    case 'DEGRADED':
      return (
        <span 
          className={`inline-flex items-center font-medium rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/50 ${sizeClasses[size]}`}
          title="Status: DEGRADED — Warning threshold breached"
          aria-label="Status: Degraded"
        >
          <AlertTriangle className={`${iconSizes[size]} text-amber-400`} />
          {showLabel && <span>DEGRADED</span>}
        </span>
      );

    case 'CRITICAL':
      return (
        <span 
          className={`inline-flex items-center font-medium rounded-full bg-red-950/70 text-red-400 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.2)] ${sizeClasses[size]}`}
          title="Status: CRITICAL — Outage or severe packet loss"
          aria-label="Status: Critical"
        >
          <AlertOctagon className={`${iconSizes[size]} text-red-400 animate-pulse`} />
          {showLabel && <span className="font-bold tracking-wide">CRITICAL</span>}
        </span>
      );

    case 'MAINTENANCE':
      return (
        <span 
          className={`inline-flex items-center font-medium rounded-full bg-slate-900 text-slate-400 border border-slate-700 ${sizeClasses[size]}`}
          title="Status: MAINTENANCE — Under planned maintenance"
          aria-label="Status: Maintenance"
        >
          <Wrench className={`${iconSizes[size]} text-slate-400`} />
          {showLabel && <span>MAINTENANCE</span>}
        </span>
      );
  }
}
