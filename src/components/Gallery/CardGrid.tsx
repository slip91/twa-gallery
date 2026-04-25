import { memo, useRef, useState, useCallback, useEffect } from 'react';
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
const BUFFER = 10;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCards = cards.slice(0, visibleCount);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    setScrollTop(scrollTop);

    if (scrollTop + clientHeight >= scrollHeight - 300) {
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
    }
  }, [cards.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const firstRow = Math.floor(scrollTop / (ROW_H + GAP));
  const lastRow = Math.ceil((scrollTop + (scrollRef.current?.clientHeight || 600)) / (ROW_H + GAP));

  if (isDesktop) {
    return (
      <div
        ref={scrollRef}
        className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20"
        style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
      >
        {visibleCards.map((card, idx) => {
          const row = Math.floor(idx / 4);
          const isActive = row >= firstRow - 2 && row <= lastRow + BUFFER;
          return (
            <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
              <CardItem card={card} isActive={isActive} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="px-4 pb-20"
      style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
    >
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {visibleCards.map((card, idx) => {
          const row = Math.floor(idx / COLS);
          const isActive = row >= firstRow - 2 && row <= lastRow + Math.floor(BUFFER / COLS);
          return (
            <div key={card.id} onClick={() => onCardClick(card)}>
              <CardItem card={card} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
});