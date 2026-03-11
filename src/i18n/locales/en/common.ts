/**
 * @fileoverview Common translations — shared across multiple features.
 *
 * This English file is the MASTER. German and other locales must
 * satisfy `CommonTranslations` (all keys, all strings).
 * TypeScript errors immediately if a translation key is missing.
 */

const en = {
  appTitle: 'Orders Analytics',
  skipToMain: 'Skip to main content',
  loading: 'Loading…',
  retry: 'Try again',
  errorTitle: 'Something went wrong',

  // Toast / notification messages
  toastClose: 'Close',
  toastDataSkipped: 'Some records could not be loaded due to validation errors.',
  toastI18nLoadError: 'Failed to load translations.',
  toastComponentError: 'An unexpected error occurred.',
} as const;

/** Enforced shape for all non-English common translations. */
export type CommonTranslations = Record<keyof typeof en, string>;

export default en;
