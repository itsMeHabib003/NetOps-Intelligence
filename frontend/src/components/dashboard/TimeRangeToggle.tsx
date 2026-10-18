import { TimeRange } from '../../types';

const RANGES: { id: TimeRange; label: string; hint: string }[] = [
  { id: '5m', label: '5m', hint: 'Last 5 minutes (60 samples @ 5s)' },
  { id: '15m', label: '15m', hint: 'Last 15 minutes (180 samples @ 5s)' },
  { id: '1h', label: '1h', hint: 'Last 1 hour (720 samples @ 5s, downsampled to 30 points)' },
];

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeToggle({ value, onChange }: TimeRangeToggleProps) {
  return (
    <div className="inline-flex rounded border border-border-subtle overflow-hidden" role="group" aria-label="Telemetry time range">
      {RANGES.map((range) => {
        const active = value === range.id;
        return (
          <button
            key={range.id}
            type="button"
            title={range.hint}
            onClick={() => onChange(range.id)}
            aria-pressed={active}
            className={`px-2.5 py-1 text-[11px] font-mono font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active
                ? 'bg-blue-600 text-white'
                : 'bg-surface-2 text-gray-400 hover:text-white hover:bg-surface-3'
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
