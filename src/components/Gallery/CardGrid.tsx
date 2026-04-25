import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const ROW_H = 140;
const COLS = 2;
const GAP = 12;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeRange, setActiveRange] = useState({ start: 0, end: 50 });

  const rowCount = Math.ceil(cards.length / COLS);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H + GAP,
    overscan: 5,
  });

  const handleScroll = useCallback(() => {
    if (!parentRef.current) return;
    const scrollTop = parentRef.current.scrollTop;
    const clientH = parentRef.current.clientHeight;

    const firstRow = Math.floor(scrollTop / (ROW_H + GAP));
    const lastRow = Math.ceil((scrollTop + clientH) / (ROW_H + GAP));

    const start = firstRow * COLS;
    const end = Math.min(lastRow * COLS + COLS * 2, cards.length);

    setActiveRange({ start, end });
  }, [cards.length]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isDesktop) {
    return (
      <div
        ref={parentRef}
        className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20"
        style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
      >
        {cards.map((card, idx) => {
          const row = Math.floor(idx / 4);
          const isVisible = row >= Math.floor(activeRange.start / 4) - 2 && row <= Math.ceil(activeRange.end / 4) + 2;
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
      ref={parentRef}
      className="px-4 pb-20"
      style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
    >
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * COLS;
          const rowCards = [
            cards[startIdx],
            cards[startIdx + 1],
          ].filter(Boolean);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                left: 0,
                right: 0,
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: GAP,
              }}
            >
              {rowCards.map((card, colIdx) => {
                if (!card) return null;
                const idx = startIdx + colIdx;
                const isVisible = idx >= activeRange.start && idx <= activeRange.end;
                return (
                  <div key={card.id} onClick={() => onCardClick(card)}>
                    <CardItem card={card} isActive={isVisible} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});