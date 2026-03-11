/**
 * @fileoverview Translations for the NotFoundPage.
 * Loaded lazily when the 404 route is rendered.
 */

const en = {
  title: 'Page not found',
  description: "The page you're looking for doesn't exist or has been moved.",
  backLabel: 'Back to Orders',
} as const;

export type NotFoundTranslations = Record<keyof typeof en, string>;

export default en;
