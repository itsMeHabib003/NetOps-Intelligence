import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { IncidentSeverity } from '../../types';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
  showFullLabel?: boolean;
}

export function SeverityBadge({ severity, size = 'md', showFullLabel = true }: SeverityBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  };

  switch (severity) {
    case 'P1':
      return (
        <span 
          className={`inline-flex items-center font-bold uppercase rounded bg-[#450A0A] text-[#FCA5A5] border border-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.25)] ${sizeClasses[size]}`}
          title="Severity P1 (Critical): Outage, Core/WAN degradation, or drop rate > 10%"
          aria-label="Severity P1 Critical"
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
          <span>{showFullLabel ? 'P1 - Critical' : 'P1'}</span>
        </span>
      );

    case 'P2':
      return (
        <span 
          className={`inline-flex items-center font-semibold uppercase rounded bg-[#431407] text-[#FDBA74] border border-[#F97316] ${sizeClasses[size]}`}
          title="Severity P2 (High): Redundancy loss, Aggregation link degradation, CRC storm"
          aria-label="Severity P2 High"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />
          <span>{showFullLabel ? 'P2 - High' : 'P2'}</span>
        </span>
      );

    case 'P3':
      return (
        <span 
          className={`inline-flex items-center font-medium uppercase rounded bg-[#422006] text-[#FDE047] border border-[#EAB308] ${sizeClasses[size]}`}
          title="Severity P3 (Medium): Single access switch degradation, elevated CPU > 85%"
          aria-label="Severity P3 Medium"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>{showFullLabel ? 'P3 - Medium' : 'P3'}</span>
        </span>
      );

    case 'P4':
      return (
        <span 
          className={`inline-flex items-center font-medium uppercase rounded bg-[#172554] text-[#93C5FD] border border-[#3B82F6] ${sizeClasses[size]}`}
          title="Severity P4 (Low): Transient jitter, informational warnings"
          aria-label="Severity P4 Low"
        >
          <Info className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>{showFullLabel ? 'P4 - Low' : 'P4'}</span>
        </span>
      );
  }
}
