import { useState } from 'react';
import { BannerSlider } from '../components/UI/BannerSlider';
import { Gallery } from '../components/Gallery/Gallery';
import { GalleryIcon } from '../components/Icons/GalleryIcon';
import { LogoIcon } from '../components/Icons/LogoIcon';
import { CrystalIcon } from '../components/Icons/CrystalIcon';
import { AddIcon } from '../components/Icons/AddIcon';
import { HomeNavIcon } from '../components/Icons/HomeNavIcon';
import { GridNavIcon } from '../components/Icons/GridNavIcon';
import { TariffsIcon } from '../components/Icons/TariffsIcon';
import { DiamondNavIcon } from '../components/Icons/DiamondNavIcon';
import { PlusIcon } from '../components/Icons/PlusIcon';
import { useHaptic } from '../hooks/useHaptic';
import { CRYSTALS } from '../constants';
import type { CardItem } from '../types/gallery';

type NavTab = 'home' | 'gallery' | 'tariffs' | 'crystals';

interface HomePageProps {
  onProfile: () => void;
  onCardClick: (card: CardItem) => void;
}

const desktopNavItems = [
  { key: 'home', label: 'Главная' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'tariffs', label: 'Тарифы' },
  { key: 'crystals', label: 'Кристаллы' },
  { key: 'about', label: 'О нас' },
] as const;

const NAV_ICON_SIZE = 14;

export function HomePage({ onProfile, onCardClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const { impact } = useHaptic();

  const handleTab = (tab: NavTab) => {
    impact();
    setActiveTab(tab);
  };

  return (
    <div className="bg-[var(--twa-bg)] pt-safe">
      {/* Header */}
      <header className="bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <div className="max-w-[1280px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-white"><LogoIcon /></div>
            <span className="text-white font-bold text-sm tracking-wide">НЕЙРОСЕТКА</span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {desktopNavItems.map(item => (
              <button
                key={item.key}
                onClick={() => { impact(); if (item.key !== 'about') handleTab(item.key as NavTab); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? 'text-white bg-white/10'
                    : 'text-[var(--twa-hint)] hover:text-white'
                }`}
              >
                {item.key === 'home' && <HomeNavIcon size={NAV_ICON_SIZE} active={activeTab === 'home'} />}
                {item.key === 'gallery' && <GalleryIcon size={NAV_ICON_SIZE} />}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden lg:flex items-center gap-1.5 bg-[var(--twa-surface2)] px-3 py-1.5 rounded-lg text-xs text-[var(--twa-hint)] hover:text-white transition-colors">
              Рабочее пространство
            </button>
            <button
              onClick={() => { impact(); onProfile(); }}
              className="flex items-center gap-2 active:opacity-70"
            >
              <div className="flex items-center gap-1.5 bg-[var(--twa-surface2)] px-2.5 py-1 rounded-full">
                <CrystalIcon size={13} />
                <span className="text-white text-xs font-semibold">{CRYSTALS}</span>
                <AddIcon size={14} />
              </div>
              <div className="w-7 h-7 rounded-full bg-[var(--twa-btn)] flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* JS scroll container — position:fixed guarantees clientHeight is correct
          even in Telegram WebView where 100dvh/flex-1 may return 0.
          Owns the scroll so getBoundingClientRect and scrollTop are reliable. */}
      <div
        id="main-scroll"
        style={{
          position: 'fixed',
          top: 48,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
      <div className="max-w-[1280px] mx-auto w-full flex flex-col">
        <BannerSlider />

        {/* Gallery title */}
        <div className="px-4 pt-2 pb-0 flex items-center gap-2">
          <span className="text-[var(--twa-hint)] hidden lg:inline"><GalleryIcon size={32} /></span>
          <span className="text-[var(--twa-hint)] lg:hidden"><GalleryIcon size={24} /></span>
          <h2 className="text-white font-bold text-2xl">Галерея</h2>
        </div>

        <Gallery onCardClick={onCardClick} />
      </div>
      </div>

      {/* Bottom Nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--twa-surface)] border-t border-[var(--twa-border)] pb-safe lg:hidden">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => handleTab('home')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <HomeNavIcon active={activeTab === 'home'} />
            <span className="text-[10px]">Главная</span>
          </button>

          <button
            onClick={() => handleTab('gallery')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'gallery' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <GridNavIcon active={activeTab === 'gallery'} />
            <span className="text-[10px]">Галерея</span>
          </button>

          <button
            onClick={() => impact('medium')}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black text-2xl font-light mb-2"
          >
            <PlusIcon size={40} />
          </button>

          <button
            onClick={() => handleTab('tariffs')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'tariffs' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}
          >
            <TariffsIcon active={activeTab === 'tariffs'} />
            <span className="text-[10px]">Тарифы</span>
          </button>

          <button
            onClick={() => handleTab('crystals')}
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