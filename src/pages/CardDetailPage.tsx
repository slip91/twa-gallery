import { useState } from 'react';
import { MOCK_CARDS } from '../data/mock';
import { CrystalIcon } from '../components/Icons/CrystalIcon';
import { LogoIcon } from '../components/Icons/LogoIcon';
import { AddIcon } from '../components/Icons/AddIcon';
import { HlsVideo } from '../components/UI/HlsVideo';
import { useBackButton } from '../hooks/useBackButton';
import { useHaptic } from '../hooks/useHaptic';
import { CRYSTALS, GENERATE_COST } from '../constants';
import type { CardItem } from '../types/gallery';

interface CardDetailPageProps {
  card: CardItem;
  onBack: () => void;
  onCardClick: (card: CardItem) => void;
  onProfile: () => void;
  crystals: number;
}

export function CardDetailPage({ card, onBack, onCardClick, onProfile, crystals }: CardDetailPageProps) {
  const isVideo = card.type === 'video' && card.videoUrl;
  const [activeTab, setActiveTab] = useState(0);

  useBackButton(onBack);
  const { impact } = useHaptic();

  const related = MOCK_CARDS.filter(c => c.category === card.category && c.id !== card.id).slice(0, 4);
  const tabs = [card.category, 'Визуальные эффекты'];

  return (
    <div className="min-h-screen bg-[var(--twa-bg)] flex flex-col pt-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
        <div className="flex items-center gap-2">
          <div className="text-white"><LogoIcon /></div>
          <span className="text-white font-bold text-sm tracking-wide">НЕЙРОСЕТКА</span>
        </div>
        <button
          onClick={() => { impact(); onProfile(); }}
          className="flex items-center gap-2 active:opacity-70"
        >
          <div className="flex items-center gap-1.5 bg-[var(--twa-surface2)] px-2.5 py-1 rounded-full">
            <CrystalIcon size={13} />
            <span className="text-white text-xs font-semibold">{crystals}</span>
            <AddIcon size={14} />
          </div>
          <div className="w-7 h-7 rounded-full bg-[var(--twa-btn)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Media */}
          <div className="relative w-full aspect-square md:aspect-auto md:h-[520px]">
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
                onClick={() => { impact(); setActiveTab(i); }}
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
              onClick={() => impact('medium')}
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
                    onClick={() => { impact(); onCardClick(item); }}
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
    </div>
  );
}