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
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const visibleCards = cards.slice(0, visibleCount);

  useEffect(() => {
    let ticking = false;
    const rowH = 192; // 180 card + 12 gap

    const update = () => {
      const scrollTop = window.scrollY;
      const viewH = window.innerHeight;

      const gridEl = document.querySelector('.gallery-grid');
      const gridTop = gridEl ? gridEl.getBoundingClientRect().top + scrollTop : scrollTop;
      const scrollInGrid = scrollTop - gridTop;

      const firstRow = Math.max(0, Math.floor((scrollInGrid - viewH * 0.5) / rowH));
      const lastRow = Math.ceil((scrollInGrid + viewH) / rowH);

      const cols = isDesktop ? 4 : 2;
      const start = Math.max(0, firstRow * cols - cols);
      const end = Math.min(lastRow * cols + cols * 3, cards.length);

      const newActive = new Set<string>();
      for (let i = start; i < end; i++) {
        if (cards[i]) newActive.add(cards[i].id);
      }
      setActiveIds(newActive);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }

      const scrollHeight = document.documentElement.scrollHeight;
      if (window.scrollY + window.innerHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, [cards.length, isDesktop]);

  if (isDesktop) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20">
        {visibleCards.map((card) => (
          <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={activeIds.has(card.id)} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="gallery-grid grid gap-3 px-4 pb-20" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {visibleCards.map((card) => (
          <div key={card.id} onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={activeIds.has(card.id)} />
          </div>
        ))}
      </div>
    </div>
  );
});