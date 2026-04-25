import { memo, useState, useEffect } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const ROW_H = 192;
const COLS = 2;
const GAP = 12;
const BATCH_SIZE = 20;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeRange, setActiveRange] = useState({ start: 0, end: BATCH_SIZE });

  const visibleCards = cards.slice(0, visibleCount);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const clientH = window.innerHeight;
        const cardH = 192;
        const gap = 12;
        const rowH = cardH + gap;

        const firstRow = Math.floor(scrollTop / rowH);
        const lastRow = Math.ceil((scrollTop + clientH) / rowH);

        const start = Math.max(0, firstRow * COLS - 4);
        const end = Math.min(lastRow * COLS + 12, cards.length);

        setActiveRange({ start, end });
        ticking = false;
      });
    };

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      updateScroll();
      if (window.scrollY + clientHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', onScroll);
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