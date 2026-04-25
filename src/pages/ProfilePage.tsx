import React, { useEffect } from 'react';
import { CrystalIcon } from '../components/Icons/CrystalIcon';

interface ProfilePageProps {
  onBack: () => void;
}

const CRYSTALS = 380;

export function ProfilePage({ onBack }: ProfilePageProps) {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(onBack);
      return () => {
        try {
          tg.BackButton.offClick(onBack);
          tg.BackButton.hide();
        } catch {}
      };
    }
  }, [onBack]);

  const haptic = (style = 'light') => {
    try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style); } catch {}
  };

  return (
    <div className="min-h-screen bg-[var(--twa-bg)] pt-safe flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <button
          onClick={() => { haptic(); onBack(); }}
          className="text-white text-sm active:opacity-70"
        >
          ← Назад
        </button>
        <span className="text-white font-bold text-sm">Профиль</span>
        <div className="w-8" />
      </header>

      <div className="flex-1 px-4 py-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-[var(--twa-btn)] flex items-center justify-center text-white text-3xl font-bold mb-4">
          N
        </div>

        <h1 className="text-white text-xl font-bold mb-1">Hunter</h1>
        <p className="text-[var(--twa-hint)] text-sm mb-6">@hunter</p>

        <div className="w-full bg-[var(--twa-surface)] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm">Мой баланс</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--twa-btn)]"><CrystalIcon size={14} /></span>
              <span className="text-white font-bold">{CRYSTALS}</span>
            </div>
          </div>
          <button
            onClick={() => haptic('medium')}
            className="w-full bg-[var(--twa-btn)] rounded-2xl py-3 text-white font-semibold text-sm active:opacity-70"
          >
            Пополнить
          </button>
        </div>
      </div>
    </div>
  );
}
