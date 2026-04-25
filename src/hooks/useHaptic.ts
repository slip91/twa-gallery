export function useHaptic() {
  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      tg?.HapticFeedback?.impactOccurred(style);
    } catch {}
  };

  return { impact };
}