import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimeRangeToggle } from './TimeRangeToggle';

describe('TimeRangeToggle', () => {
  it('marks the active range and reports clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeRangeToggle value="15m" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '15m' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '5m' }));
    expect(onChange).toHaveBeenCalledWith('5m');
  });
});
