import { Clock } from 'lucide-react';
import { ProvenancePill } from '../common/ProvenancePill';
import { StaleDataBadge } from '../common/UXStates';
import { secondsAgo } from '../../data/windows';

interface FreshnessBarProps {
  generatedAt: string;
  nowMs: number;
  sampleIntervalSec: number;
  sampleCount: number;
  timeRange: string;
  isStale: boolean;
}

export function FreshnessBar({
  generatedAt,
  nowMs,
  sampleIntervalSec,
  sampleCount,
  timeRange,
  isStale,
}: FreshnessBarProps) {
  const age = secondsAgo(generatedAt, nowMs);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
      <div className="flex flex-wrap items-center gap-2">
        <ProvenancePill type="SIMULATED" />
        <span className="inline-flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          Last simulated sample {generatedAt.replace('T', ' ')}
        </span>
        <span>Age {age}s</span>
        <span>Interval {sampleIntervalSec}s</span>
        <span>
          Window {timeRange} · {sampleCount} source samples
        </span>
      </div>
      <StaleDataBadge isStale={isStale} lastSeenSeconds={Math.max(age, sampleIntervalSec * 2)} />
    </div>
  );
}
