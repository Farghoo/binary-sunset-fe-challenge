/**
 * @fileoverview Zod schema for the paginated API response envelope.
 *
 * Generic wrapper — accepts any item schema and wraps it in
 * `{ data: T[], meta: { total, page, limit, pages } }`.
 *
 * @example
 *   const schema = ApiResponseSchema(OrderAnalyticsRowSchema);
 *   const validated = schema.parse(rawResponse);
 */

import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      total: z.number().int(),
      page: z.number().int(),
      limit: z.number().int(),
      pages: z.number().int(),
    }),
  });
