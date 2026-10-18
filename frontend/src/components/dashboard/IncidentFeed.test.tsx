import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncidentView } from '../../types';
import { IncidentFeed } from './IncidentFeed';

const incident: IncidentView = {
  id: 'INC-2026-001',
  device_id: 'dev-agg-01',
  hostname: 'AGG-SW01',
  interface_id: 'intf-agg01-1',
  interface_name: 'HundredGigE0/0/1',
  title: 'High CRC error rate on AGG-SW01 uplink HundredGigE0/0/1',
  severity: 'P2',
  status: 'NEW',
  priority_score: 76,
  detected_at: '2026-10-18T12:00:00.000Z',
  assigned_operator: null,
  active_scenario: 'SCENARIO_CRC_STORM',
  rule_id: 'CR_002',
  rule_explanation: 'Rule CR_002 triggered: CRC error rate > 50 err/s.',
  hypothesis: 'Failing optical SFP transceiver.',
  evidence: [
    {
      metric_name: 'crc_errors_per_sec',
      observed_value: '184 err/s',
      threshold_value: '> 50 err/s',
      confidence_tier: 'OBSERVED_MEASUREMENT',
    },
  ],
  data_origin: 'SIMULATED',
};

describe('IncidentFeed', () => {
  it('injects a demo scenario from the empty state', async () => {
    const user = userEvent.setup();
    const onInjectDemo = vi.fn();
    render(<IncidentFeed incidents={[]} selectedId={null} onSelect={vi.fn()} onInjectDemo={onInjectDemo} />);
    await user.click(screen.getByRole('button', { name: /inject sfp crc storm/i }));
    expect(onInjectDemo).toHaveBeenCalledTimes(1);
  });

  it('opens evidence for a selected incident', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <IncidentFeed incidents={[incident]} selectedId={null} onSelect={onSelect} onInjectDemo={vi.fn()} />,
    );
    await user.click(screen.getByRole('button', { name: /high crc error rate/i }));
    expect(onSelect).toHaveBeenCalledWith('INC-2026-001');
  });

  it('shows rule evidence when an incident is already selected', () => {
    render(
      <IncidentFeed incidents={[incident]} selectedId="INC-2026-001" onSelect={vi.fn()} onInjectDemo={vi.fn()} />,
    );
    expect(screen.getByText('CR_002')).toBeInTheDocument();
    expect(screen.getByText('184 err/s')).toBeInTheDocument();
    expect(screen.getByText(/UNVERIFIED HYPOTHESIS/i)).toBeInTheDocument();
  });
});
