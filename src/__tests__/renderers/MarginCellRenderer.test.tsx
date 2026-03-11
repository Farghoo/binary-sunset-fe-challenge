import React from 'react';
import { render, screen } from '@testing-library/react';

import MarginCellRenderer from '@/features/orders/columnDefs/renderers/MarginCellRenderer';

const makeParams = (value: number | null | undefined) =>
  ({ value }) as Parameters<typeof MarginCellRenderer>[0];

describe('MarginCellRenderer', () => {
  it('renders null for undefined value', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(undefined)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null for null value', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(null)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders formatted percentage text', () => {
    render(<MarginCellRenderer {...makeParams(61.0)} />);
    expect(screen.getByText('61.0%')).toBeInTheDocument();
  });

  it('has accessible aria-label with percentage', () => {
    render(<MarginCellRenderer {...makeParams(61.0)} />);
    expect(screen.getByLabelText('Margin: 61.0%')).toBeInTheDocument();
  });

  it('renders bar fill with correct data-status for excellent margin', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(60)} />);
    const bar = container.querySelector('[data-status="excellent"]');
    expect(bar).toBeInTheDocument();
  });

  it('renders bar fill with data-status "good" for good margin', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(40)} />);
    const bar = container.querySelector('[data-status="good"]');
    expect(bar).toBeInTheDocument();
  });

  it('renders bar fill with data-status "warning" for low margin', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(20)} />);
    const bar = container.querySelector('[data-status="warning"]');
    expect(bar).toBeInTheDocument();
  });

  it('renders bar fill with data-status "loss" for negative margin', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(-10)} />);
    const bar = container.querySelector('[data-status="loss"]');
    expect(bar).toBeInTheDocument();
  });

  it('clamps bar width to 0 for negative values', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(-50)} />);
    const bar = container.querySelector('[data-status]') as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });

  it('clamps bar width to 100 for values above 100', () => {
    const { container } = render(<MarginCellRenderer {...makeParams(150)} />);
    const bar = container.querySelector('[data-status]') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });
});
