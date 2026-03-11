import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ErrorBoundary from '@/shared/components/ErrorBoundary';

const ThrowOnce = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test render error');
  return <div>Child content</div>;
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowOnce shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows the error message from the thrown error', () => {
    render(
      <ErrorBoundary>
        <ThrowOnce shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Test render error')).toBeInTheDocument();
  });

  it('uses custom errorTitle and retryLabel when provided', () => {
    render(
      <ErrorBoundary errorTitle="Hata oluştu" retryLabel="Tekrar dene">
        <ThrowOnce shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Hata oluştu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowOnce shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('retry button is present and clickable after an error', () => {
    render(
      <ErrorBoundary>
        <ThrowOnce shouldThrow />
      </ErrorBoundary>
    );

    const retryBtn = screen.getByRole('button', { name: 'Try again' });
    expect(retryBtn).toBeInTheDocument();
    expect(() => fireEvent.click(retryBtn)).not.toThrow();
  });
});
