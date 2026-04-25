import { memo, useState, useEffect, useRef } from 'react';
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
const BUFFER = 5;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeRange, setActiveRange] = useState({ start: 0, end: BATCH_SIZE + BUFFER });
  const scrollRef = useRef<{ scrollTop: number; clientHeight: number }>({ scrollTop: 0, clientHeight: 600 });

  const visibleCards = cards.slice(0, visibleCount);

  useEffect(() => {
    const updateScroll = () => {
      scrollRef.current.scrollTop = window.scrollY;
      scrollRef.current.clientHeight = window.innerHeight;

      const firstRow = Math.max(0, Math.floor(window.scrollY / (ROW_H + GAP)));
      const lastRow = Math.ceil((window.scrollY + window.innerHeight) / (ROW_H + GAP));

      const start = firstRow * COLS;
      const end = Math.min(lastRow * COLS + COLS * BUFFER, cards.length);

      setActiveRange({ start, end });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onLoadMore = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      if (window.scrollY + clientHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onLoadMore, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onLoadMore);
    };
  }, [cards.length]);

  if (isDesktop) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 px-4 pb-20">
        {visibleCards.map((card, idx) => (
          <div key={card.id} className="mb-3 break-inside-avoid" onClick={() => onCardClick(card)}>
            <CardItem card={card} isActive={idx >= activeRange.start - BUFFER * 2 && idx <= activeRange.end + BUFFER * 2} />
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
            <CardItem card={card} isActive={idx >= activeRange.start - BUFFER && idx <= activeRange.end + BUFFER} />
          </div>
        ))}
      </div>
    </div>
  );
});