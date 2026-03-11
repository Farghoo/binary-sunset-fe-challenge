import React from 'react';
import { render, screen } from '@testing-library/react';

import ProfitCellRenderer from '@/features/orders/columnDefs/renderers/ProfitCellRenderer';

const makeParams = (value: number | null | undefined) =>
  ({ value }) as Parameters<typeof ProfitCellRenderer>[0];

describe('ProfitCellRenderer', () => {
  it('renders null for undefined value', () => {
    const { container } = render(<ProfitCellRenderer {...makeParams(undefined)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null for null value', () => {
    const { container } = render(<ProfitCellRenderer {...makeParams(null)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders up arrow for positive profit', () => {
    render(<ProfitCellRenderer {...makeParams(30.5)} />);
    expect(screen.getByText('▲')).toBeInTheDocument();
    expect(screen.getByText('$30.50')).toBeInTheDocument();
  });

  it('renders down arrow for negative profit', () => {
    render(<ProfitCellRenderer {...makeParams(-19.49)} />);
    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.getByText('-$19.49')).toBeInTheDocument();
  });

  it('renders dash for zero profit', () => {
    render(<ProfitCellRenderer {...makeParams(0)} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('has accessible aria-label with formatted value', () => {
    render(<ProfitCellRenderer {...makeParams(30.5)} />);
    expect(screen.getByLabelText('Profit: $30.50')).toBeInTheDocument();
  });

  it('renders low positive profit with up arrow', () => {
    render(<ProfitCellRenderer {...makeParams(5)} />);
    expect(screen.getByText('▲')).toBeInTheDocument();
  });
});
