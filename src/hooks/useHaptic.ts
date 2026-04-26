import { useCallback } from 'react';

export function useHaptic() {
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      tg?.HapticFeedback?.impactOccurred(style);
    } catch {}
  }, []);

  return { impact };
}
