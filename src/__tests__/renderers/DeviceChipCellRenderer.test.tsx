import React from 'react';
import { render, screen } from '@testing-library/react';

import DeviceChipCellRenderer from '@/features/orders/columnDefs/renderers/DeviceChipCellRenderer';

const makeParams = (value: string | undefined) =>
  ({ value }) as Parameters<typeof DeviceChipCellRenderer>[0];

describe('DeviceChipCellRenderer', () => {
  it('renders Mobile chip for mobile device', () => {
    render(<DeviceChipCellRenderer {...makeParams('mobile')} />);
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('renders Desktop chip for desktop device', () => {
    render(<DeviceChipCellRenderer {...makeParams('desktop')} />);
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('renders null for unknown device type', () => {
    const { container } = render(<DeviceChipCellRenderer {...makeParams('tablet')} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null for undefined value', () => {
    const { container } = render(<DeviceChipCellRenderer {...makeParams(undefined)} />);
    expect(container.firstChild).toBeNull();
  });
});
