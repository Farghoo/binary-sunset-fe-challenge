import React from 'react';
import { render, screen } from '@testing-library/react';

import StatusChipCellRenderer from '@/features/orders/columnDefs/renderers/StatusChipCellRenderer';

const makeParams = (value: string | undefined, data?: object) =>
  ({ value, data }) as Parameters<typeof StatusChipCellRenderer>[0];

describe('StatusChipCellRenderer', () => {
  it('renders "Excellent" chip for excellent status', () => {
    render(<StatusChipCellRenderer {...makeParams('excellent', {})} />);
    expect(screen.getByRole('img', { name: /excellent/i })).toBeInTheDocument();
  });

  it('renders "Good" chip for good status', () => {
    render(<StatusChipCellRenderer {...makeParams('good', {})} />);
    expect(screen.getByRole('img', { name: /good/i })).toBeInTheDocument();
  });

  it('renders "Warning" chip for warning status', () => {
    render(<StatusChipCellRenderer {...makeParams('warning', {})} />);
    expect(screen.getByRole('img', { name: /warning/i })).toBeInTheDocument();
  });

  it('renders "Loss" chip for loss status', () => {
    render(<StatusChipCellRenderer {...makeParams('loss', {})} />);
    expect(screen.getByRole('img', { name: /loss/i })).toBeInTheDocument();
  });

  it('renders null for unknown status', () => {
    const { container } = render(<StatusChipCellRenderer {...makeParams('unknown', {})} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when value is undefined', () => {
    const { container } = render(<StatusChipCellRenderer {...makeParams(undefined, {})} />);
    expect(container.firstChild).toBeNull();
  });
});
