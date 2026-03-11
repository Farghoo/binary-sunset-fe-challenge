import React from 'react';
import { render } from '@testing-library/react';

import LoadingCellRenderer from '@/features/orders/columnDefs/renderers/LoadingCellRenderer';

describe('LoadingCellRenderer', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingCellRenderer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('is aria-hidden so screen readers ignore loading skeleton', () => {
    const { container } = render(<LoadingCellRenderer />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a skeleton bar element', () => {
    const { container } = render(<LoadingCellRenderer />);
    expect(container.querySelector('[class*="skeletonBar"]')).toBeInTheDocument();
  });
});
