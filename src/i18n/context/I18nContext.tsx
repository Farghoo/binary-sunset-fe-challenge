/**
 * @fileoverview I18n provider and consumer hook.
 *
 * State design:
 *  - `locale`    — active locale, persisted to localStorage
 *  - `cacheRef`  — Map of `"locale:namespace"` → translation object (mutable ref)
 *  - `tick`      — integer bumped after each cache write to trigger re-renders
 *
 * Lazy loading flow (per component):
 *  1. Component calls `useTranslation('ordersToolbar')`
 *  2. Hook calls `loadNamespace('ordersToolbar')`
 *  3. Context checks cache; on miss triggers `LOADERS[locale][namespace]()`
 *  4. On resolve: writes to cacheRef, bumps tick → all consumers re-render
 *  5. Component receives typed translations
 *
 * When locale changes, the cache retains previously loaded namespaces for the
 * old locale (they act as instant fallback). New locale namespaces are loaded
 * on demand as components re-render.
 */

import React, { createContext, useCallback, useContext, useReducer, useRef, useState } from 'react';

import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { notificationService } from '@/shared/notifications/notificationService';

import type { II18nContext } from '../interfaces/II18nContext';
import { LOADERS } from '../loaders';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '../types/locale.types';
import type { Namespace, NamespaceTranslations } from '../types/namespace.types';

const I18nContext = createContext<II18nContext | null>(null);
I18nContext.displayName = 'I18nContext';

function cacheKey(locale: Locale, namespace: Namespace): string {
  return `${locale}:${namespace}`;
}

function resolveLocale(raw: string): Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : DEFAULT_LOCALE;
}

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [storedLocale, setStoredLocale] = useLocalStorage<string>('app:locale', DEFAULT_LOCALE);

  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(storedLocale));

  const cacheRef = useRef<Map<string, Record<string, string>>>(new Map());

  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      setStoredLocale(next);
    },
    [setStoredLocale]
  );

  const loadNamespace = useCallback(async (namespace: Namespace): Promise<void> => {
    setLocaleState((currentLocale) => {
      const key = cacheKey(currentLocale, namespace);
      if (!cacheRef.current.has(key)) {
        LOADERS[currentLocale][namespace]()
          .then((mod) => {
            cacheRef.current.set(key, mod.default as Record<string, string>);
            forceUpdate();
          })
          .catch(() => {
            notificationService.notify('toastI18nLoadError', 'error');
          });
      }
      return currentLocale; // no-op state update
    });
  }, []);

  const getTranslations = useCallback(
    <N extends Namespace>(namespace: N): Partial<NamespaceTranslations[N]> => {
      const key = cacheKey(locale, namespace);
      return (cacheRef.current.get(key) ?? {}) as Partial<NamespaceTranslations[N]>;
    },
    [locale] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const value: II18nContext = { locale, setLocale, getTranslations, loadNamespace };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): II18nContext {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
