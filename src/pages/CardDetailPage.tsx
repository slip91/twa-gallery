import React, { useRef, useEffect, useState } from 'react';
import type { CardItem } from '../types/gallery';
import { MOCK_CARDS } from '../data/mock';
import { CrystalIcon } from '../components/Icons/CrystalIcon';
import { HlsVideo } from '../components/UI/HlsVideo';

interface CardDetailPageProps {
  card: CardItem;
  onBack: () => void;
  onCardClick: (card: CardItem) => void;
}

const GENERATE_COST = 30;

export function CardDetailPage({ card, onBack, onCardClick }: CardDetailPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = card.type === 'video' && card.videoUrl;
  const [playing, setPlaying] = useState(true);

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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play().catch(() => {}); }
    setPlaying(p => !p);
  };

  return (
    <div className="min-h-screen bg-[var(--twa-bg)] flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <button onClick={() => { haptic(); onBack(); }} className="text-white text-sm active:opacity-70">
          ← Назад
        </button>
        <span className="text-white font-bold text-sm truncate max-w-[50%]">{card.title}</span>
        <div className="w-12" />
      </header>

      <div className="overflow-y-auto pb-8">
        {/* Media */}
        <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
          {isVideo && card.videoUrl ? (
            <HlsVideo
              src={card.videoUrl}
              muted
              loop
              autoPlay
              className="w-full h-full object-contain"
              onClick={togglePlay}
            />
          ) : (
            <img src={card.poster} alt={card.title} className="w-full h-full object-contain" />
          )}
          {card.isHot && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[var(--twa-hot)] rounded-md px-2 py-1">
              <span className="text-[11px]">🔥</span>
              <span className="text-white text-[11px] font-bold">HOT</span>
            </div>
          )}
        </div>

        {/* Category tag */}
        <div className="px-4 pt-4 flex gap-2">
          <span className="text-xs bg-[var(--twa-surface2)] text-white px-3 py-1 rounded-full">
            {card.category}
          </span>
        </div>

        {/* Title & description */}
        <div className="px-4 pt-3">
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
            <h2 className="text-white font-semibold text-base mb-3">Похожее</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map(item => (
                <article
                  key={item.id}
                  onClick={() => { haptic(); onCardClick(item); }}
                  className="cursor-pointer rounded-2xl overflow-hidden bg-[var(--twa-surface)] active:opacity-70"
                >
                  <div className="w-full relative" style={{ height: 110 }}>
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
