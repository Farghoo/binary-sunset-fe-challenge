import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initialValue when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('reads existing value from localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](99);
    });

    expect(result.current[0]).toBe(99);
    expect(JSON.parse(window.localStorage.getItem('test-key') ?? '')).toBe(99);
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 5));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
  });

  it('handles objects', () => {
    const { result } = renderHook(() => useLocalStorage('obj', { a: 1 }));

    act(() => {
      result.current[1]({ a: 2 });
    });

    expect(result.current[0]).toEqual({ a: 2 });
    expect(JSON.parse(window.localStorage.getItem('obj') ?? '')).toEqual({ a: 2 });
  });

  it('falls back to initialValue when stored value is invalid JSON', () => {
    window.localStorage.setItem('bad-key', 'not-valid-json{{{');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
