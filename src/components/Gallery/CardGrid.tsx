import { memo, useRef, useState, useCallback, useEffect } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const ROW_H = 140;
const BUFFER = 4;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientH, setClientH] = useState(600);

  useEffect(() => {
    if (scrollRef.current) setClientH(scrollRef.current.clientHeight);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, []);

  const firstRow = Math.floor(scrollTop / ROW_H);
  const lastRow = Math.ceil((scrollTop + clientH) / ROW_H);

  return (
    <div
      ref={scrollRef}
      className="columns-2 gap-3 px-4 pb-20"
      style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      {cards.map((card, idx) => {
        const row = Math.floor(idx / 2);
        const isVisible = row >= firstRow - BUFFER && row <= lastRow + BUFFER;
        return (
          <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={isVisible} />
          </div>
        );
      })}
    </div>
  );
});