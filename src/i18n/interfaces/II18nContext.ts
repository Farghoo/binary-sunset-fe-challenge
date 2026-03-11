/**
 * @fileoverview I18n context interface — the public contract for the i18n system.
 *
 * Components depend on this interface, not on the concrete context implementation.
 */

import type { Locale } from '../types/locale.types';
import type { Namespace, NamespaceTranslations } from '../types/namespace.types';

export interface II18nContext {
  /** Currently active locale. */
  locale: Locale;
  /** Switch to a different locale. Persists the choice to localStorage. */
  setLocale: (locale: Locale) => void;
  /**
   * Returns the cached translation object for a namespace, or an empty object
   * if the namespace hasn't finished loading yet.
   * Use `useTranslation(namespace)` in components — it calls this internally.
   */
  getTranslations: <N extends Namespace>(namespace: N) => Partial<NamespaceTranslations[N]>;
  /**
   * Triggers a dynamic import for the given namespace + current locale.
   * No-ops if already cached.
   */
  loadNamespace: (namespace: Namespace) => Promise<void>;
}
