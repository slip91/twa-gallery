import { memo, useRef, useMemo, useState, useCallback, useLayoutEffect } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const CARD_H = 128;
const TALL_H = 180;
const GAP = 12;

interface ItemPos {
  card: CardItemType;
  col: number;
  top: number;
  height: number;
  idx: number;
}

function calcPositions(cards: CardItemType[], cols: number): { items: ItemPos[]; totalH: number } {
  const columns: number[] = Array(cols).fill(0);
  const items: ItemPos[] = [];

  cards.forEach((card, idx) => {
    const h = card.tall ? TALL_H : CARD_H;
    const minCol = columns.indexOf(Math.min(...columns));
    const top = columns[minCol];
    items.push({ card, col: minCol, top, height: h, idx });
    columns[minCol] += h + GAP;
  });

  const totalH = Math.max(...columns);
  return { items, totalH };
}

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientH, setClientH] = useState(600);

  useLayoutEffect(() => {
    if (parentRef.current) setClientH(parentRef.current.clientHeight);
  }, []);

  const handleScroll = useCallback(() => {
    if (parentRef.current) setScrollTop(parentRef.current.scrollTop);
  }, []);

  const { items, totalH } = useMemo(() => calcPositions(cards, 2), [cards]);

  const firstVisible = Math.floor(scrollTop / (CARD_H + GAP)) - 1;
  const lastVisible = Math.ceil((scrollTop + clientH) / (CARD_H + GAP)) + 1;

  return (
    <div ref={parentRef} className="overflow-auto px-4 pb-20" style={{ height: 'calc(100vh - 240px)' }} onScroll={handleScroll}>
      <div className="columns-2 gap-3" style={{ height: totalH }}>
        {items.map(({ card, col, top, idx }) => (
          <div
            key={card.id}
            className="mb-3 break-inside-avoid"
            style={{ marginTop: top > 0 ? 0 : undefined }}
            onClick={() => onCardClick(card)}
          >
            <CardItem card={card} isActive={idx >= firstVisible && idx <= lastVisible} />
          </div>
        ))}
      </div>
    </div>
  );
});