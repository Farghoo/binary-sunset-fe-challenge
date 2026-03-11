import React from 'react';
import { render, screen } from '@testing-library/react';

import SourceChipCellRenderer from '@/features/orders/columnDefs/renderers/SourceChipCellRenderer';

const makeParams = (value: string | undefined, data?: object) =>
  ({ value, data }) as Parameters<typeof SourceChipCellRenderer>[0];

describe('SourceChipCellRenderer', () => {
  it('renders null when params.data is undefined (loading row guard)', () => {
    const { container } = render(<SourceChipCellRenderer {...makeParams('gsearch', undefined)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Google chip for gsearch', () => {
    render(<SourceChipCellRenderer {...makeParams('gsearch', {})} />);
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('renders Bing chip for bsearch', () => {
    render(<SourceChipCellRenderer {...makeParams('bsearch', {})} />);
    expect(screen.getByText('Bing')).toBeInTheDocument();
  });

  it('renders Social chip for socialbook', () => {
    render(<SourceChipCellRenderer {...makeParams('socialbook', {})} />);
    expect(screen.getByText('Social')).toBeInTheDocument();
  });

  it('renders fallback chip with raw source label for unknown value', () => {
    render(<SourceChipCellRenderer {...makeParams('some_channel', {})} />);
    expect(screen.getByText('some_channel')).toBeInTheDocument();
  });

  it('is case-insensitive for source matching', () => {
    render(<SourceChipCellRenderer {...makeParams('GSEARCH', {})} />);
    expect(screen.getByText('Google')).toBeInTheDocument();
  });
});
