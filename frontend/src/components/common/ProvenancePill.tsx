import { Database, Binary, GitCommit, HelpCircle, CheckCircle } from 'lucide-react';
import { ConfidenceTier } from '../../types';

interface ProvenancePillProps {
  type: 'SIMULATED' | ConfidenceTier;
  size?: 'xs' | 'sm';
}

export function ProvenancePill({ type, size = 'sm' }: ProvenancePillProps) {
  const sizeClass = size === 'xs' ? 'text-[9px] px-1 py-0.2' : 'text-[10px] px-1.5 py-0.5';

  switch (type) {
    case 'SIMULATED':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-bold uppercase rounded bg-blue-950/80 text-blue-300 border border-blue-600/50 ${sizeClass}`}
          title="Data Origin: Synthetically generated via local physics simulation engine"
        >
          <Database className="w-2.5 h-2.5 text-blue-400" />
          <span>SIMULATED DATA</span>
        </span>
      );

    case 'OBSERVED_MEASUREMENT':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-bold uppercase rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 ${sizeClass}`}
          title="Lineage: Concrete empirical metric value recorded from telemetry stream"
        >
          <Binary className="w-2.5 h-2.5 text-emerald-400" />
          <span>OBSERVED MEASUREMENT</span>
        </span>
      );

    case 'RULES_BASED_FINDING':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-bold uppercase rounded bg-indigo-950/80 text-indigo-300 border border-indigo-600/50 ${sizeClass}`}
          title="Lineage: Triggered by deterministic, explainable mathematical rule condition"
        >
          <GitCommit className="w-2.5 h-2.5 text-indigo-400" />
          <span>RULES-BASED FINDING</span>
        </span>
      );

    case 'UNVERIFIED_HYPOTHESIS':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-bold uppercase rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-600/50 animate-pulse ${sizeClass}`}
          title="Lineage: Diagnostic hypothesis requiring human operator verification"
        >
          <HelpCircle className="w-2.5 h-2.5 text-fuchsia-400" />
          <span>UNVERIFIED HYPOTHESIS</span>
        </span>
      );

    case 'VERIFIED_DIAGNOSTIC':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-bold uppercase rounded bg-green-950/80 text-green-300 border border-green-600/50 ${sizeClass}`}
          title="Lineage: Confirmed through guided diagnostic playbook verification"
        >
          <CheckCircle className="w-2.5 h-2.5 text-green-400" />
          <span>VERIFIED DIAGNOSTIC</span>
        </span>
      );
  }
}
