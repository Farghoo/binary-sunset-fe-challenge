import React from 'react';
import { act, render, screen } from '@testing-library/react';

import NotificationProvider from '@/shared/components/NotificationProvider/NotificationProvider';
import { notificationService } from '@/shared/notifications/notificationService';

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NotificationProvider', () => {
  it('renders nothing when no notification has been emitted', () => {
    const { container } = render(<NotificationProvider />);
    expect(container.firstChild).toBeNull();
  });

  it('shows a toast when notificationService.notify is called', async () => {
    render(<NotificationProvider />);

    act(() => {
      notificationService.notify('testMessage', 'info');
    });

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('shows error severity toast', async () => {
    render(<NotificationProvider />);

    act(() => {
      notificationService.notify('errorMessage', 'error');
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('shows warning severity toast', async () => {
    render(<NotificationProvider />);

    act(() => {
      notificationService.notify('warnMessage', 'warning');
    });

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
