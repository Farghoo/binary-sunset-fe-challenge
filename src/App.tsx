/**
 * @fileoverview Root application component.
 *
 * Composes the global provider tree with the application router.
 * Keep this file minimal — all feature logic lives inside pages.
 */

import AppProviders from './providers/AppProviders';
import AppRouter from './router';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
