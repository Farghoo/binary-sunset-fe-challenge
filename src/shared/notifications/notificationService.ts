/**
 * @fileoverview Notification service — framework-free pub/sub.
 *
 * Decoupled from React so it can be called from anywhere:
 * plain services, mappers, class components, i18n context.
 *
 * `NotificationProvider` subscribes on mount and renders toasts.
 * Multiple subscribers are supported (e.g. for testing).
 *
 * @example
 * // In a service or mapper:
 * notificationService.notify('toastDataSkipped', 'warning');
 *
 * // In a React component (prefer useNotification hook instead):
 * notificationService.notify('Something went wrong', 'error');
 */

export type ToastSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ToastPayload {
  /**
   * A `common` namespace translation key **or** a raw fallback string.
   * `NotificationProvider` attempts translation first; if the key is not
   * found it renders the string as-is.
   */
  messageKey: string;
  severity: ToastSeverity;
}

type ToastListener = (payload: ToastPayload) => void;

const listeners = new Set<ToastListener>();

export const notificationService = {
  /**
   * Emits a toast to all active subscribers.
   *
   * @param messageKey - `common` i18n key or a raw display string
   * @param severity   - MUI Alert severity; defaults to `'info'`
   */
  notify(messageKey: string, severity: ToastSeverity = 'info'): void {
    listeners.forEach((l) => l({ messageKey, severity }));
  },

  /**
   * Subscribes to toast events. Returns an unsubscribe function.
   *
   * @param listener - Called each time `notify` is invoked
   * @returns Cleanup function — call in `useEffect` return or `componentWillUnmount`
   */
  subscribe(listener: ToastListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
} as const;
