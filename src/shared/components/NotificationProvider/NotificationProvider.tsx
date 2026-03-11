/**
 * @fileoverview NotificationProvider — MUI Snackbar rendered via portal.
 *
 * Subscribes to `notificationService` and displays one toast at a time.
 * When a new notification arrives while one is visible, the current one
 * closes first; the next opens after MUI's exit transition (~300 ms).
 *
 * Message keys are looked up in the `common` i18n namespace at render time,
 * so toasts are always displayed in the active locale.
 */

import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton, Snackbar } from '@mui/material';

import { useTranslation } from '@/i18n';
import type { CommonTranslations } from '@/i18n/locales/en/common';

import {
  notificationService,
  type ToastPayload,
  type ToastSeverity,
} from '../../notifications/notificationService';

const DURATIONS: Record<ToastSeverity, number> = {
  error: 6_000,
  warning: 4_000,
  success: 3_000,
  info: 3_000,
};

/**
 * Self-rendering notification outlet — place once inside `ThemeProvider`
 * and `I18nProvider`. Renders nothing visible until a toast is emitted.
 *
 * No children — uses MUI portal to escape the DOM tree.
 */
function NotificationProvider() {
  const { t } = useTranslation('common');

  const [queue, setQueue] = useState<ToastPayload[]>([]);
  const [current, setCurrent] = useState<ToastPayload | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return notificationService.subscribe((payload) => {
      setQueue((prev) => [...prev, payload]);
    });
  }, []);

  useEffect(() => {
    if (!open && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    }
  }, [open, queue]);

  function handleClose(_event: React.SyntheticEvent | Event, reason?: string) {
    if (reason === 'clickaway') return;
    setOpen(false);
  }

  if (!current) return null;

  const commonKeys = Object.keys({} as CommonTranslations);
  const isTranslationKey = commonKeys.length === 0 || true; // always attempt — t() falls back to key
  const displayMessage = isTranslationKey
    ? t(current.messageKey as keyof CommonTranslations)
    : current.messageKey;

  return (
    <Snackbar
      open={open}
      autoHideDuration={DURATIONS[current.severity]}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={current.severity}
        variant="filled"
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label={t('toastClose')}
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ minWidth: 300, maxWidth: 520 }}
      >
        {displayMessage}
      </Alert>
    </Snackbar>
  );
}

export default NotificationProvider;
