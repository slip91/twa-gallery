import { useEffect } from 'react';

export function useTelegramBackButton(onBack: () => void, visible: boolean = true) {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.BackButton) return;

    try {
      if (visible) {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }

      tg.BackButton.onClick(onBack);

      return () => {
        try {
          tg.BackButton.offClick(onBack);
          tg.BackButton.hide();
        } catch {}
      };
    } catch {}
  }, [onBack, visible]);
}