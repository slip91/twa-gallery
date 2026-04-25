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

const ADD_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM7.75 4.5C7.75 4.30109 7.67098 4.11032 7.53033 3.96967C7.38968 3.82902 7.19891 3.75 7 3.75C6.80109 3.75 6.61032 3.82902 6.46967 3.96967C6.32902 4.11032 6.25 4.30109 6.25 4.5V6.25H4.5C4.30109 6.25 4.11032 6.32902 3.96967 6.46967C3.82902 6.61032 3.75 6.80109 3.75 7C3.75 7.19891 3.82902 7.38968 3.96967 7.53033C4.11032 7.67098 4.30109 7.75 4.5 7.75H6.25V9.5C6.25 9.69891 6.32902 9.88968 6.46967 10.0303C6.61032 10.171 6.80109 10.25 7 10.25C7.19891 10.25 7.38968 10.171 7.53033 10.0303C7.67098 9.88968 7.75 9.69891 7.75 9.5V7.75H9.5C9.69891 7.75 9.88968 7.67098 10.0303 7.53033C10.171 7.38968 10.25 7.19891 10.25 7C10.25 6.80109 10.171 6.61032 10.0303 6.46967C9.88968 6.32902 9.69891 6.25 9.5 6.25H7.75V4.5Z" fill="white"/>
  </svg>
);

const desktopNavItems = [
  { key: 'home', label: 'Главная' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'tariffs', label: 'Тарифы' },
  { key: 'crystals', label: 'Кристаллы' },
  { key: 'about', label: 'О нас' },
] as const;

export function HomePage({ onProfile, onCardClick }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const haptic = () => {
    try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch {}
  };

  return (
    <div className="min-h-screen bg-[var(--twa-bg)] flex flex-col pt-safe">
      {/* Header */}
      <header className="bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <div className="max-w-[1280px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-white"><LogoIcon /></div>
            <span className="text-white font-bold text-sm tracking-wide">НЕЙРОСЕТКА</span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopNavItems.map(item => (
              <button
                key={item.key}
                onClick={() => { haptic(); if (item.key !== 'about') setActiveTab(item.key as NavTab); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? 'text-white bg-white/10'
                    : 'text-[var(--twa-hint)] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden md:flex items-center gap-1.5 bg-[var(--twa-surface2)] px-3 py-1.5 rounded-lg text-xs text-[var(--twa-hint)] hover:text-white transition-colors">
              Рабочее пространство
            </button>
            <button
              onClick={() => { haptic(); onProfile(); }}
              className="flex items-center gap-2 active:opacity-70"
            >
              <div className="flex items-center gap-1.5 bg-[var(--twa-surface2)] px-2.5 py-1 rounded-full">
                <CrystalIcon size={13} />
                <span className="text-white text-xs font-semibold">{CRYSTALS}</span>
                {ADD_ICON}
              </div>
              <div className="w-7 h-7 rounded-full bg-[var(--twa-btn)] flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto w-full flex-1 flex flex-col">
        <BannerSlider />

        {/* Gallery title */}
        <div className="px-4 pt-2 pb-0 flex items-center gap-2">
          <span className="text-[var(--twa-hint)] hidden md:inline"><GalleryIcon size={32} /></span>
          <span className="text-[var(--twa-hint)] md:hidden"><GalleryIcon size={24} /></span>
          <h2 className="text-white font-bold text-2xl">Галерея</h2>
        </div>

        <Gallery onCardClick={onCardClick} />
      </div>

      {/* Bottom Nav — mobile only */}
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
