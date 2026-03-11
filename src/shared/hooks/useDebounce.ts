/**
 * @fileoverview Generic debounce hook.
 *
 * Returns a debounced version of `value` that only updates after
 * `delay` ms of inactivity. Useful for search inputs, filter fields,
 * and any rapid-change scenario where downstream effects are expensive.
 *
 * @example
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *   // debouncedSearch updates 300 ms after the user stops typing
 */

import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value`.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
