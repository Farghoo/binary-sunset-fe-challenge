/**
 * @fileoverview Global provider tree.
 *
 * Wraps the entire application with infrastructure providers:
 *  - `BrowserRouter`    — React Router v6 navigation
 *  - `QueryClientProvider` — TanStack Query cache
 *  - `ThemeProvider`    — MUI theme (reads CSS custom properties)
 *
 * Feature-level providers (e.g. `OrdersProvider`) live inside their
 * respective pages — not here. This keeps the global tree lean.
 */

import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { I18nProvider } from '@/i18n';
import NotificationProvider from '@/shared/components/NotificationProvider/NotificationProvider';

/** MUI theme: inherits fonts from CSS custom properties, no palette overrides. */
const muiTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-family-base)',
    fontSize: 13,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

/** Shared QueryClient — configure retry / stale time globally here. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1_000,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <NotificationProvider />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
