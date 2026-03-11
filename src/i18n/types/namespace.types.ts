/**
 * @fileoverview Translation namespace registry.
 *
 * `NamespaceTranslations` maps each namespace string → its translation shape.
 * This is the single file to update when adding a new translation namespace:
 *  1. Create `src/i18n/locales/en/{namespace}.ts` (defines the type)
 *  2. Create `src/i18n/locales/de/{namespace}.ts` (implements the type)
 *  3. Add loader entries in `src/i18n/loaders/index.ts`
 *  4. Add the entry below ↓
 *
 * The generic `useTranslation<N extends Namespace>(namespace)` hook uses this
 * map to narrow `t(key)` to `keyof NamespaceTranslations[N]` — full autocomplete.
 */

import type { CommonTranslations } from '../locales/en/common';
import type { NotFoundTranslations } from '../locales/en/notFound';
import type { OrdersGridTranslations } from '../locales/en/ordersGrid';
import type { OrdersToolbarTranslations } from '../locales/en/ordersToolbar';

/** Maps namespace identifier → translation object type. */
export interface NamespaceTranslations {
  common: CommonTranslations;
  ordersGrid: OrdersGridTranslations;
  ordersToolbar: OrdersToolbarTranslations;
  notFound: NotFoundTranslations;
}

/** All valid namespace identifiers. */
export type Namespace = keyof NamespaceTranslations;
