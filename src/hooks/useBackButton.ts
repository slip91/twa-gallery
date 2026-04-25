import { useEffect } from 'react';

export function useBackButton(onClick: () => void, visible = true) {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.BackButton) return;

    try {
      if (visible) {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }

      tg.BackButton.onClick(onClick);

      return () => {
        try { tg.BackButton.offClick(onClick); } catch {}
        try { tg.BackButton.hide(); } catch {}
      };
    } catch {
      // ignore if SDK not available
    }
  }, [onClick, visible]);
}
