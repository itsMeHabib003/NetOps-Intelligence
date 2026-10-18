import { describe, expect, it } from 'vitest';
import { downsample, minutesForRange, sampleCountForRange, secondsAgo, trendFromSeries } from './windows';

describe('time windows', () => {
  it('uses a 5 second sample interval for approved ranges', () => {
    expect(minutesForRange('5m')).toBe(5);
    expect(sampleCountForRange('5m')).toBe(60);
    expect(sampleCountForRange('15m')).toBe(180);
    expect(sampleCountForRange('1h')).toBe(720);
  });

  it('downsamples to 30 inclusive endpoints without inventing values', () => {
    const source = Array.from({ length: 180 }, (_, i) => i);
    const out = downsample(source, 30);
    expect(out).toHaveLength(30);
    expect(out[0]).toBe(0);
    expect(out[29]).toBe(179);
    expect(out.every((v) => source.includes(v))).toBe(true);
  });

  it('classifies trend direction from window start vs end', () => {
    expect(trendFromSeries([0, 0, 0.01], 0.05)).toBe('flat');
    expect(trendFromSeries([0, 6.8])).toBe('up');
    expect(trendFromSeries([12, 1])).toBe('down');
  });

  it('computes sample age from ISO timestamps', () => {
    expect(secondsAgo('2026-10-18T12:00:00.000Z', Date.parse('2026-10-18T12:00:08.000Z'))).toBe(8);
  });
});
