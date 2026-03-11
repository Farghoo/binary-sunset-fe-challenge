/**
 * @fileoverview Type-safe translation hook.
 *
 * Usage:
 *   const { t, locale } = useTranslation('ordersToolbar');
 *   t('searchPlaceholder')                   // → 'Quick search…'
 *   t('rowCount', { count: '1,234' })        // → '1,234 rows'
 *
 * Type safety:
 *   - `t`'s first argument is narrowed to `keyof NamespaceTranslations[N]`
 *   - TypeScript autocompletes and errors on invalid keys
 *   - Adding a key to the EN file immediately makes it available in `t()`
 *
 * Lazy loading:
 *   - On first call, triggers a dynamic import for `locale:namespace`
 *   - Re-renders automatically when translations arrive
 *   - Falls back to the translation key string until loaded (imperceptible flash)
 */

import { useCallback, useEffect } from 'react';

import { useI18n } from '../context/I18nContext';
import type { Locale } from '../types/locale.types';
import type { Namespace, NamespaceTranslations } from '../types/namespace.types';

/** Interpolation params — replaces `{key}` placeholders in the translation string. */
type InterpolationParams = Record<string, string | number>;

/** The typed `t()` function returned for a given namespace. */
type TypedT<N extends Namespace> = (
  key: keyof NamespaceTranslations[N],
  params?: InterpolationParams
) => string;

interface UseTranslationResult<N extends Namespace> {
  /** Typed translation function. Key autocomplete is scoped to namespace `N`. */
  t: TypedT<N>;
  /** Currently active locale — useful for locale-aware rendering. */
  locale: Locale;
}

/**
 * Loads and returns translations for the given namespace.
 *
 * @param namespace - Translation namespace (must exist in `NamespaceTranslations`)
 */
export function useTranslation<N extends Namespace>(namespace: N): UseTranslationResult<N> {
  const { locale, getTranslations, loadNamespace } = useI18n();

  // Trigger lazy load on mount and whenever locale changes.
  useEffect(() => {
    loadNamespace(namespace);
  }, [namespace, locale, loadNamespace]);

  const translations = getTranslations(namespace);

  const t = useCallback<TypedT<N>>(
    (key, params) => {
      const raw = translations[key as keyof typeof translations];
      // Fallback to the key itself if not yet loaded — prevents blank UI.
      let str = typeof raw === 'string' ? raw : String(key);

      if (params) {
        str = Object.entries(params).reduce(
          (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
          str
        );
      }
      return str;
    },
    [translations]
  );

  return { t, locale };
}
