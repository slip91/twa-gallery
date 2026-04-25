import { memo, useRef, useState, useCallback } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  return (
    <div className="columns-2 gap-3 px-4 pb-20" style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}>
      {cards.map((card, idx) => (
        <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
          <CardItem card={card} isActive={true} />
        </div>
      ))}
    </div>
  );
});