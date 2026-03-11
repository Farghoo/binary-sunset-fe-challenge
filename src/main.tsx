/**
 * @fileoverview Application entry point.
 *
 * Mounts the React tree into `#root`.
 * All providers (Router, QueryClient, MUI Theme) live in `AppProviders`.
 * StrictMode is enabled to surface side-effect issues during development.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './styles/index.scss';

async function prepare() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in document.');

prepare().then(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
