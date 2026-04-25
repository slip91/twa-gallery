import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramContextType {
  ready: boolean;
  isTelegram: boolean;
  haptic: {
    impact: (style?: string) => void;
  };
}

const TelegramContext = createContext<TelegramContextType>({
  ready: true,
  isTelegram: false,
  haptic: { impact: () => {} },
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState({ ready: true, isTelegram: false });

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
      setState({ ready: true, isTelegram: !!tg });
    } catch (e) {
      setState({ ready: true, isTelegram: false });
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ ...state, haptic: { impact: () => {} } }}>
      {children}
    </TelegramContext.Provider>
  );
};