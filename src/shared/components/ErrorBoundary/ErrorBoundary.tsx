/**
 * @fileoverview ErrorBoundary — class-based React error boundary.
 *
 * Catches unhandled render/lifecycle errors in the subtree and shows
 * a friendly fallback instead of a blank screen.
 *
 * Text props accept translated strings from the caller, with English
 * defaults so the component is usable without an i18n provider.
 *
 * @example
 * // Basic usage — English defaults
 * <ErrorBoundary>
 *   <OrdersPage />
 * </ErrorBoundary>
 *
 * // With translated strings
 * const { t } = useTranslation('common');
 * <ErrorBoundary errorTitle={t('errorTitle')} retryLabel={t('retry')}>
 *   <OrdersPage />
 * </ErrorBoundary>
 */

import React, { Component } from 'react';
import styles from '@/styles/components/ErrorBoundary.module.scss';

import { notificationService } from '@/shared/notifications/notificationService';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback UI — overrides the built-in error card when provided. */
  fallback?: React.ReactNode;
  /** Translated heading shown in the error card. @default 'Something went wrong' */
  errorTitle?: string;
  /** Translated retry button label. @default 'Try again' */
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _info: React.ErrorInfo): void {
    notificationService.notify('toastComponentError', 'error');
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const {
      children,
      fallback,
      errorTitle = 'Something went wrong',
      retryLabel = 'Try again',
    } = this.props;

    if (!hasError) return children;
    if (fallback) return fallback;

    return (
      <div className={styles.wrapper} role="alert">
        <span className={styles.icon} aria-hidden="true">
          ⚠
        </span>
        <h2 className={styles.title}>{errorTitle}</h2>
        {error && <p className={styles.message}>{error.message}</p>}
        <button type="button" className={styles.retry} onClick={this.handleRetry}>
          {retryLabel}
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
