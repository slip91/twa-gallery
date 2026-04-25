import React, { useState } from 'react';
import { BannerSlider } from '../components/UI/BannerSlider';
import { Gallery } from '../components/Gallery/Gallery';
import { GalleryIcon } from '../components/Icons/GalleryIcon';
import { LogoIcon } from '../components/Icons/LogoIcon';
import { CrystalIcon } from '../components/Icons/CrystalIcon';
import { HomeNavIcon } from '../components/Icons/HomeNavIcon';
import { GridNavIcon } from '../components/Icons/GridNavIcon';
import { TariffsIcon } from '../components/Icons/TariffsIcon';
import { DiamondNavIcon } from '../components/Icons/DiamondNavIcon';
import type { CardItem } from '../types/gallery';

type NavTab = 'home' | 'gallery' | 'tariffs' | 'crystals';

interface HomePageProps {
  onProfile: () => void;
  onCardClick: (card: CardItem) => void;
}

const CRYSTALS = 380;

export function HomePage({ onProfile, onCardClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const haptic = () => {
    try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch {}
  };

  return (
    <div className="min-h-screen bg-[var(--twa-bg)] flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <div className="flex items-center gap-2">
          <div className="text-white">
            <LogoIcon />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">НЕЙРОСЕТКА</span>
        </div>

        <button
          onClick={() => { haptic(); onProfile(); }}
          className="flex items-center gap-2 active:opacity-70"
        >
          <div className="flex items-center gap-1 bg-[var(--twa-surface2)] px-2.5 py-1 rounded-full">
            <span className="text-[var(--twa-btn)]"><CrystalIcon size={13} /></span>
            <span className="text-white text-xs font-semibold">{CRYSTALS}</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[var(--twa-btn)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        </button>
      </header>

      <BannerSlider />

      {/* Gallery title with icon */}
      <div className="px-4 pt-2 pb-0 flex items-center gap-2">
        <span className="text-[var(--twa-hint)]"><GalleryIcon /></span>
        <h2 className="text-white font-semibold text-[24px]">Галерея</h2>
      </div>

      <Gallery onCardClick={onCardClick} />

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--twa-surface)] border-t border-[var(--twa-border)] pb-safe md:hidden">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => { haptic(); setActiveTab('home'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <HomeNavIcon active={activeTab === 'home'} />
            <span className="text-[10px]">Главная</span>
          </button>

          <button
            onClick={() => { haptic(); setActiveTab('gallery'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'gallery' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <GridNavIcon active={activeTab === 'gallery'} />
            <span className="text-[10px]">Галерея</span>
          </button>

          <button
            onClick={haptic}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black text-2xl font-light mb-2"
          >
            +
          </button>

          <button
            onClick={() => { haptic(); setActiveTab('tariffs'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'tariffs' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <TariffsIcon active={activeTab === 'tariffs'} />
            <span className="text-[10px]">Тарифы</span>
          </button>

          <button
            onClick={() => { haptic(); setActiveTab('crystals'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'crystals' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <DiamondNavIcon active={activeTab === 'crystals'} />
            <span className="text-[10px]">Кристаллы</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
