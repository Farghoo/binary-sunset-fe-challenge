import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmptyState from '@/shared/components/EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No orders found" />);
    expect(screen.getByRole('heading', { name: 'No orders found' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No results" description="Try adjusting your filters." />);
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByRole('paragraph')).toBeNull();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="No results" icon="🔍" />);
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('icon is aria-hidden', () => {
    render(<EmptyState title="No results" icon="🔍" />);
    expect(screen.getByText('🔍')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render icon span when icon is omitted', () => {
    const { container } = render(<EmptyState title="No results" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('renders action button when provided', () => {
    render(<EmptyState title="No results" action={{ label: 'Reset', onClick: jest.fn() }} />);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('calls action.onClick when button is clicked', async () => {
    const onClick = jest.fn();
    render(<EmptyState title="No results" action={{ label: 'Reset', onClick }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when action is omitted', () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('has role="status" and aria-live="polite" for accessibility', () => {
    render(<EmptyState title="No results" />);
    const wrapper = screen.getByRole('status');
    expect(wrapper).toHaveAttribute('aria-live', 'polite');
  });
});
