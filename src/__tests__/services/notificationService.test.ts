import { notificationService, type ToastPayload } from '@/shared/notifications/notificationService';

describe('notificationService', () => {
  afterEach(() => {
    // Clean up any lingering subscribers between tests
    jest.clearAllMocks();
  });

  it('calls a subscribed listener when notify is called', () => {
    const listener = jest.fn();
    const unsubscribe = notificationService.subscribe(listener);

    notificationService.notify('testKey', 'info');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ messageKey: 'testKey', severity: 'info' });

    unsubscribe();
  });

  it('defaults severity to "info" when not provided', () => {
    const listener = jest.fn();
    const unsubscribe = notificationService.subscribe(listener);

    notificationService.notify('testKey');

    expect(listener).toHaveBeenCalledWith({ messageKey: 'testKey', severity: 'info' });

    unsubscribe();
  });

  it('supports all severity levels', () => {
    const listener = jest.fn();
    const unsubscribe = notificationService.subscribe(listener);

    notificationService.notify('k', 'error');
    notificationService.notify('k', 'warning');
    notificationService.notify('k', 'success');

    const calls = listener.mock.calls.map((c: [ToastPayload]) => c[0].severity);
    expect(calls).toEqual(['error', 'warning', 'success']);

    unsubscribe();
  });

  it('calls multiple subscribers', () => {
    const l1 = jest.fn();
    const l2 = jest.fn();
    const u1 = notificationService.subscribe(l1);
    const u2 = notificationService.subscribe(l2);

    notificationService.notify('msg', 'warning');

    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);

    u1();
    u2();
  });

  it('does not call listener after unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = notificationService.subscribe(listener);

    unsubscribe();
    notificationService.notify('afterUnsubscribe', 'info');

    expect(listener).not.toHaveBeenCalled();
  });

  it('unsubscribing one listener does not affect others', () => {
    const l1 = jest.fn();
    const l2 = jest.fn();
    const u1 = notificationService.subscribe(l1);
    const u2 = notificationService.subscribe(l2);

    u1();
    notificationService.notify('msg', 'success');

    expect(l1).not.toHaveBeenCalled();
    expect(l2).toHaveBeenCalledTimes(1);

    u2();
  });
});
