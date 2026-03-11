/**
 * @fileoverview Dynamic import registry for all locale × namespace combinations.
 *
 * WHY explicit imports instead of template literals:
 *  - Vite (Rollup) can statically analyse explicit `import()` calls and
 *    create a separate chunk per translation file → true lazy loading.
 *  - Template-literal dynamic imports produce a single "catch-all" chunk,
 *    defeating the purpose of lazy loading.
 *
 * Adding a new namespace: add one entry per locale in LOADERS below.
 */

import type { Locale } from '../types/locale.types';
import type { Namespace, NamespaceTranslations } from '../types/namespace.types';

type TranslationModule<N extends Namespace> = { default: NamespaceTranslations[N] };
type NamespaceLoader<N extends Namespace> = () => Promise<TranslationModule<N>>;

// Typed per-namespace to preserve the exact translation shape.
type LocaleLoaders = {
  [N in Namespace]: NamespaceLoader<N>;
};

export const LOADERS: Record<Locale, LocaleLoaders> = {
  en: {
    common: () => import('../locales/en/common'),
    ordersGrid: () => import('../locales/en/ordersGrid'),
    ordersToolbar: () => import('../locales/en/ordersToolbar'),
    notFound: () => import('../locales/en/notFound'),
  },
  de: {
    common: () => import('../locales/de/common'),
    ordersGrid: () => import('../locales/de/ordersGrid'),
    ordersToolbar: () => import('../locales/de/ordersToolbar'),
    notFound: () => import('../locales/de/notFound'),
  },
};
