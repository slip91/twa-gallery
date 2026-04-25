import { memo, useState, useEffect } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const visibleCards = cards.slice(0, visibleCount);

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      if (window.scrollY + window.innerHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cards.length]);

  if (isDesktop) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20">
        {visibleCards.map((card) => (
          <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={true} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {visibleCards.map((card) => (
          <div key={card.id} onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={true} />
          </div>
        ))}
      </div>
    </div>
  );
});