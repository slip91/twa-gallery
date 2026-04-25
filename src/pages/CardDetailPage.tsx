import React, { useRef, useEffect, useState } from 'react';
import type { CardItem } from '../types/gallery';
import { MOCK_CARDS } from '../data/mock';
import { CrystalIcon } from '../components/Icons/CrystalIcon';
import { LogoIcon } from '../components/Icons/LogoIcon';
import { HlsVideo } from '../components/UI/HlsVideo';

interface CardDetailPageProps {
  card: CardItem;
  onBack: () => void;
  onCardClick: (card: CardItem) => void;
  onProfile: () => void;
  crystals: number;
}

const GENERATE_COST = 30;

const ADD_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM7.75 4.5C7.75 4.30109 7.67098 4.11032 7.53033 3.96967C7.38968 3.82902 7.19891 3.75 7 3.75C6.80109 3.75 6.61032 3.82902 6.46967 3.96967C6.32902 4.11032 6.25 4.30109 6.25 4.5V6.25H4.5C4.30109 6.25 4.11032 6.32902 3.96967 6.46967C3.82902 6.61032 3.75 6.80109 3.75 7C3.75 7.19891 3.82902 7.38968 3.96967 7.53033C4.11032 7.67098 4.30109 7.75 4.5 7.75H6.25V9.5C6.25 9.69891 6.32902 9.88968 6.46967 10.0303C6.61032 10.171 6.80109 10.25 7 10.25C7.19891 10.25 7.38968 10.171 7.53033 10.0303C7.67098 9.88968 7.75 9.69891 7.75 9.5V7.75H9.5C9.69891 7.75 9.88968 7.67098 10.0303 7.53033C10.171 7.38968 10.25 7.19891 10.25 7C10.25 6.80109 10.171 6.61032 10.0303 6.46967C9.88968 6.32902 9.69891 6.25 9.5 6.25H7.75V4.5Z" fill="white"/>
  </svg>
);

export function CardDetailPage({ card, onBack, onCardClick, onProfile, crystals }: CardDetailPageProps) {
  const isVideo = card.type === 'video' && card.videoUrl;
  const [playing, setPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(onBack);
      return () => {
        try { tg.BackButton.offClick(onBack); tg.BackButton.hide(); } catch {}
      };
    }
  }, [onBack]);

  const haptic = (style = 'light') => {
    try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style); } catch {}
  };

  const related = MOCK_CARDS.filter(c => c.category === card.category && c.id !== card.id).slice(0, 4);
  const tabs = [card.category, 'Визуальные эффекты'];

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
          <div className="flex items-center gap-1.5 bg-[var(--twa-surface2)] px-2.5 py-1 rounded-full">
            <span className="text-[var(--twa-btn)]"><CrystalIcon size={13} /></span>
            <span className="text-white text-xs font-semibold">{crystals}</span>
            {ADD_ICON}
          </div>
          <div className="w-7 h-7 rounded-full bg-[var(--twa-btn)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        </button>
      </header>

      <div className="overflow-y-auto pb-8">
        {/* Media — full width, square */}
        <div className="relative w-full aspect-square">
          {isVideo && card.videoUrl ? (
            <HlsVideo
              src={card.videoUrl}
              muted
              loop
              autoPlay
              className="w-full h-full object-cover"
              onClick={() => {}}
            />
          ) : (
            <img src={card.poster} alt={card.title} className="w-full h-full object-cover" />
          )}
          {card.isHot && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[var(--twa-hot)] rounded-md px-2 py-1">
              <span className="text-[11px]">🔥</span>
              <span className="text-white text-[11px] font-bold">HOT</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { haptic(); setActiveTab(i); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === i ? 'bg-white text-black' : 'bg-[var(--twa-surface2)] text-[var(--twa-hint)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Title & description */}
        <div className="px-4 pt-4">
          <h1 className="text-white text-xl font-bold mb-1">{card.title}</h1>
          <p className="text-[var(--twa-hint)] text-sm">{card.description}</p>
        </div>

        {/* Generate button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => haptic('medium')}
            className="w-full bg-[var(--twa-btn)] rounded-2xl py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-sm active:opacity-70"
          >
            <span>Генерировать за {GENERATE_COST}</span>
            <CrystalIcon size={14} />
          </button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="px-4 pt-6">
            <h2 className="text-white font-semibold text-base mb-3 flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9707 25.4358C18.6177 24.7055 23.3333 22.0817 23.3333 15.2975C23.3333 9.12468 18.8148 5.01334 15.5657 3.12451C14.8435 2.70451 14 3.25634 14 4.09051V6.22318C14 7.90551 13.293 10.9762 11.3283 12.2537C10.325 12.9058 9.24 11.9293 9.11867 10.7393L9.01833 9.76168C8.90167 8.62534 7.74433 7.93584 6.83667 8.62884C5.2045 9.87134 3.5 12.053 3.5 15.2963C3.5 23.5925 9.6705 25.668 12.7552 25.668C12.9356 25.668 13.1238 25.6622 13.3198 25.6505C11.7962 25.521 9.33333 24.576 9.33333 21.5193C9.33333 19.1277 11.0775 17.5118 12.4028 16.7243C12.7598 16.5143 13.1763 16.7885 13.1763 17.2027V17.891C13.1763 18.416 13.3805 19.2385 13.8647 19.8008C14.413 20.4378 15.2168 19.7705 15.281 18.9328C15.302 18.6692 15.568 18.5012 15.7967 18.6342C16.5445 19.0717 17.5 20.005 17.5 21.5193C17.5 23.9087 16.1828 25.0077 14.9707 25.4358Z" fill="#FF551D"/>
              </svg>
              Похожее
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map(item => (
                <article
                  key={item.id}
                  onClick={() => { haptic(); onCardClick(item); }}
                  className="cursor-pointer rounded-2xl overflow-hidden bg-[var(--twa-surface)] active:opacity-70"
                >
                  <div className="w-full aspect-square relative">
                    {item.type === 'video' && item.videoUrl ? (
                      <HlsVideo src={item.videoUrl} muted loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.poster} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                    )}
                    {item.isHot && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-[var(--twa-hot)] rounded px-1 py-0.5">
                        <span className="text-[9px]">🔥</span>
                        <span className="text-white text-[9px] font-bold">HOT</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                    <p className="text-[var(--twa-hint)] text-[10px] truncate">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
