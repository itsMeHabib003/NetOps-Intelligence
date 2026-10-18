import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'flat';
  trendText?: string;
  status?: 'normal' | 'warning' | 'critical';
  icon?: React.ReactNode;
  sparklineData?: number[];
}

function Sparkline({ data, status }: { data: number[]; status: 'normal' | 'warning' | 'critical' }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const w = 72;
  const h = 24;
  const d = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 2) - 1;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const color = status === 'critical' ? '#F43F5E' : status === 'warning' ? '#F59E0B' : '#10B981';
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function MetricCard({
  title,
  value,
  unit,
  subtext,
  trend,
  trendText,
  status = 'normal',
  icon,
  sparklineData,
}: MetricCardProps) {
  const borderClasses = {
    normal: 'border-border-subtle hover:border-border-strong',
    warning: 'border-amber-500/50 bg-amber-950/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    critical: 'border-red-500/60 bg-red-950/15 shadow-[0_0_14px_rgba(239,68,68,0.2)]',
  };

  const statusTextColor = {
    normal: 'text-white',
    warning: 'text-amber-300',
    critical: 'text-red-300',
  };

  return (
    <div 
      className={`bg-surface-1 border rounded-lg p-4 transition-all duration-200 flex flex-col justify-between ${borderClasses[status]}`}
      tabIndex={0}
      aria-label={`${title}: ${value} ${unit || ''}`}
    >
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] truncate flex items-center gap-1.5">
            {icon}
            {title}
          </span>
          <span className="text-[10px] font-mono text-blue-400 border border-blue-500/30 px-1 py-0.2 rounded bg-blue-950/40 shrink-0">
            SIM
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-2xl font-bold font-mono tracking-tight ${statusTextColor[status]}`}>
            {value}
          </span>
          {unit && <span className="text-xs text-gray-400 font-medium">{unit}</span>}
        </div>
      </div>

      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-2 flex justify-end">
          <Sparkline data={sparklineData} status={status} />
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-border-subtle/60 flex items-center justify-between text-xs">
        {subtext && <span className="text-gray-400 truncate">{subtext}</span>}
        {trend && (
          <span className={`flex items-center gap-0.5 font-medium shrink-0 ml-auto ${
            status === 'critical' || trend === 'up' && status !== 'normal' 
              ? 'text-red-400' 
              : trend === 'down' 
              ? 'text-emerald-400' 
              : 'text-gray-400'
          }`}>
            {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend === 'flat' && <Minus className="w-3.5 h-3.5" />}
            {trendText}
          </span>
        )}
      </div>
    </div>
  );
}
