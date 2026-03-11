import React from 'react';
import { render, screen } from '@testing-library/react';

import StatusChip from '@/shared/components/StatusChip';

describe('StatusChip', () => {
  it('renders the label', () => {
    render(<StatusChip variant="excellent" label="Excellent" />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(<StatusChip variant="excellent" label="Excellent" icon="↑" />);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('does not render icon span when icon is omitted', () => {
    render(<StatusChip variant="good" label="Good" />);
    expect(screen.queryByRole('presentation')).toBeNull();
  });

  it('has role="img" with aria-label equal to the label', () => {
    render(<StatusChip variant="warning" label="Warning" icon="⚠" />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  it('icon is aria-hidden', () => {
    render(<StatusChip variant="loss" label="Loss" icon="↓" />);
    const iconSpan = screen.getByText('↓');
    expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the variant class', () => {
    const { container } = render(<StatusChip variant="excellent" label="Excellent" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip.className).toMatch(/chip--excellent/);
  });

  it('applies md size class when size="md"', () => {
    const { container } = render(<StatusChip variant="good" label="Good" size="md" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip.className).toMatch(/chip--md/);
  });

  it('does not apply md size class when size="sm" (default)', () => {
    const { container } = render(<StatusChip variant="good" label="Good" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip.className).not.toMatch(/chip--md/);
  });

  it('forwards extra className to the chip element', () => {
    const { container } = render(
      <StatusChip variant="good" label="Good" className="custom-class" />
    );
    const chip = container.firstChild as HTMLElement;
    expect(chip.className).toMatch(/custom-class/);
  });
});
