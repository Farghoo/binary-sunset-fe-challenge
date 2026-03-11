/**
 * @fileoverview Device type enum values.
 *
 * Single source of truth for valid device type strings.
 * Consumed by Zod schema and TypeScript types.
 */

export const DEVICE_TYPE = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
} as const;
