import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;
const LOAD_MORE_THRESHOLD = 200;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const viewH = window.innerHeight;

    if (scrollTop + viewH >= document.documentElement.scrollHeight - LOAD_MORE_THRESHOLD) {
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
    }
  }, [cards.length]);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [cards]);

  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const cols = isDesktop ? 4 : 2;

  return (
    <div className={isDesktop ? 'columns-4 gap-3 px-4 pb-20' : 'gallery-grid grid gap-3 px-4 pb-20'}
         style={isDesktop ? undefined : { gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {visibleCards.map((card) => (
        <div key={card.id} onClick={() => onCardClick(card)} className="mb-3 break-inside-avoid">
          <CardItem card={card} isDesktop={isDesktop} />
        </div>
      ))}
    </div>
  );
});
