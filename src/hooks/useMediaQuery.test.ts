import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Set<(e: MediaQueryListEvent) => void>;
  let currentMatches = true;

  beforeEach(() => {
    listeners = new Set();
    currentMatches = true;
    vi.stubGlobal('matchMedia', (query: string) => ({
      get matches() { return currentMatches; },
      media: query,
      addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.add(cb);
      },
      removeEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.delete(cb);
      },
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when media query matches', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 1200px)'));
    expect(result.current).toBe(false);
  });

  it('updates when media query changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);

    // Simulate media query change
    currentMatches = false;
    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent));
    });
    expect(result.current).toBe(false);
  });
});
