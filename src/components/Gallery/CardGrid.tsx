import { memo, useState, useEffect } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;
const ROW_H = 204;
const COLS = 2;
const HEADER_H = 240;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeRange, setActiveRange] = useState({ start: 0, end: BATCH_SIZE + 20 });

  const visibleCards = cards.slice(0, visibleCount);

  useEffect(() => {
    let rafId: number;

    const updateActiveRange = () => {
      const scrollTop = window.scrollY;
      const viewportH = window.innerHeight;

      const firstVisible = Math.max(0, Math.floor((scrollTop - HEADER_H) / ROW_H));
      const lastVisible = Math.ceil((scrollTop + viewportH - HEADER_H) / ROW_H);

      const start = Math.max(0, firstVisible * COLS - 4);
      const end = Math.min(lastVisible * COLS + COLS * 4, cards.length);

      setActiveRange({ start, end });
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveRange);

      const scrollHeight = document.documentElement.scrollHeight;
      if (window.scrollY + window.innerHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveRange();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cards.length]);

  if (isDesktop) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20">
        {visibleCards.map((card, idx) => (
          <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={idx >= activeRange.start && idx <= activeRange.end} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {visibleCards.map((card, idx) => (
          <div key={card.id} onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={idx >= activeRange.start && idx <= activeRange.end} />
          </div>
        ))}
      </div>
    </div>
  );
});