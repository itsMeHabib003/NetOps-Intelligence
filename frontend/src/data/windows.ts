import { TimeRange } from '../types';
import { CHART_POINT_LIMIT, SAMPLE_INTERVAL_SEC } from './catalog';

export function minutesForRange(range: TimeRange): number {
  if (range === '5m') return 5;
  if (range === '15m') return 15;
  return 60;
}

export function sampleCountForRange(range: TimeRange, intervalSec = SAMPLE_INTERVAL_SEC): number {
  return (minutesForRange(range) * 60) / intervalSec;
}

export function downsample<T>(points: T[], target = CHART_POINT_LIMIT): T[] {
  if (points.length <= target) return points;
  const out: T[] = [];
  const step = (points.length - 1) / (target - 1);
  for (let i = 0; i < target; i += 1) {
    out.push(points[Math.round(i * step)]);
  }
  return out;
}

export function trendFromSeries(values: number[], epsilon = 0.05): 'up' | 'down' | 'flat' {
  if (values.length < 2) return 'flat';
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  if (Math.abs(delta) <= epsilon) return 'flat';
  return delta > 0 ? 'up' : 'down';
}

export function secondsAgo(fromIso: string, nowMs: number): number {
  return Math.max(0, Math.round((nowMs - Date.parse(fromIso)) / 1000));
}
