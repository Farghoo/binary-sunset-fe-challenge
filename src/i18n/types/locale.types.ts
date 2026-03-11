/**
 * @fileoverview Supported locales and the default locale.
 *
 * Adding a new language:
 *  1. Add the locale code to `SUPPORTED_LOCALES`
 *  2. Add translation files under `src/i18n/locales/{code}/`
 *  3. Add loader entries in `src/i18n/loaders/index.ts`
 */

export const SUPPORTED_LOCALES = ['en', 'de'] as const;

/** Union of all supported locale codes. */
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Locale used when no preference is stored. */
export const DEFAULT_LOCALE: Locale = 'en';

/** Human-readable label for each locale (used in the language switcher). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
};
