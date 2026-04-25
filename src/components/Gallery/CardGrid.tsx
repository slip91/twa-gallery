import { memo, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;
const ROW_HEIGHT = 240;
const COLS_MOBILE = 2;
const COLS_DESKTOP = 4;
const TOP_BUFFER_VH = 0.5;
const BOTTOM_BUFFER_ROWS = 5;
const LOAD_MORE_THRESHOLD = 200;

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef({ scrollTop: 0, viewH: 0, gridTop: 0 });

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const viewH = window.innerHeight;

    scrollRef.current = { scrollTop, viewH, gridTop: 0 };

    const cols = isDesktop ? COLS_DESKTOP : COLS_MOBILE;
    const scrollInGrid = scrollTop;

    const firstRow = Math.max(0, Math.floor((scrollInGrid - viewH * TOP_BUFFER_VH) / ROW_HEIGHT));
    const lastRow = Math.ceil((scrollInGrid + viewH) / ROW_HEIGHT);

    const start = Math.max(0, firstRow * cols - cols);
    const end = Math.min(lastRow * cols + cols * BOTTOM_BUFFER_ROWS, cards.length);

    const newActive = new Set<string>();
    for (let i = start; i < Math.min(end, visibleCount); i++) {
      const card = cards[i];
      if (card) newActive.add(card.id);
    }
    setActiveIds(newActive);

    if (scrollTop + viewH >= document.documentElement.scrollHeight - LOAD_MORE_THRESHOLD) {
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
    }
  }, [cards, isDesktop, visibleCount]);

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

  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const cols = isDesktop ? COLS_DESKTOP : COLS_MOBILE;

  return (
    <div className={`${isDesktop ? '' : 'gallery-grid'} grid gap-3 px-4 pb-20`}
         style={isDesktop ? undefined : { gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {visibleCards.map((card) => (
        <div key={card.id} onClick={() => onCardClick(card)}>
          <CardItem card={card} isActive={activeIds.has(card.id)} isDesktop={isDesktop} />
        </div>
      ))}
    </div>
  );
});