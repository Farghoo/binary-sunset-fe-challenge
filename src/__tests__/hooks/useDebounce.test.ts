import { act, renderHook } from '@testing-library/react';

import { useDebounce } from '@/shared/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    act(() => jest.advanceTimersByTime(200));

    expect(result.current).toBe('initial');
  });

  it('updates after the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe('updated');
  });

  it('resets the timer when value changes before delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'c' });
    act(() => jest.advanceTimersByTime(200));

    // Only 200ms since last change — should still be 'a'
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('c');
  });

  it('uses default delay of 300ms when delay is not provided', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'x' },
    });

    rerender({ value: 'y' });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe('x');

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('y');
  });

  it('works with number values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe(42);
  });
});
