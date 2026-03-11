/**
 * @fileoverview Generic localStorage hook with JSON serialization.
 *
 * Provides a `useState`-like API backed by `localStorage`.
 * Handles JSON parse errors gracefully — falls back to `initialValue`.
 *
 * @example
 *   const [pageSize, setPageSize] = useLocalStorage('grid:pageSize', 100);
 */

import { useCallback, useState } from 'react';

/**
 * Persists state in `localStorage` under the given key.
 *
 * @param key          - localStorage key
 * @param initialValue - Value used when key is absent or parse fails
 * @returns Tuple of `[value, setValue]` — same API as `useState`
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (_e) {
          // localStorage write may fail in private browsing — silently ignore
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
