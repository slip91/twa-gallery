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

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeRange, setActiveRange] = useState({ start: 0, end: 50 });

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const clientH = scrollRef.current.clientHeight;

    const firstRow = Math.floor(scrollTop / (ROW_H + GAP));
    const lastRow = Math.ceil((scrollTop + clientH) / (ROW_H + GAP));

    const start = firstRow * COLS;
    const end = Math.min(lastRow * COLS + COLS * 4, cards.length);

    setActiveRange({ start, end });
  }, [cards.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isDesktop) {
    return (
      <div
        ref={scrollRef}
        className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20"
        style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
      >
        {cards.map((card, idx) => {
          const col = idx % 4;
          const isVisible = idx >= activeRange.start - 4 && idx <= activeRange.end + 4;
          return (
            <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
              <CardItem card={card} isActive={isVisible} />
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
        {cards.map((card, idx) => {
          const isVisible = idx >= activeRange.start - 4 && idx <= activeRange.end + 4;
          return (
            <div key={card.id} onClick={() => onCardClick(card)}>
              <CardItem card={card} isActive={isVisible} />
            </div>
          );
        })}
      </div>
    </div>
  );
});