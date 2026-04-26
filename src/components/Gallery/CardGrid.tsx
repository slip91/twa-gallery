import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;
const LOAD_MORE_THRESHOLD = 300;
const COLS_MOBILE = 2;
const COLS_DESKTOP = 4;
const ROW_HEIGHT_MOBILE = 240;
const ROW_HEIGHT_DESKTOP = 240;
const BUFFER_ROWS = 4;

function getViewportHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight || 667;
}

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const viewH = getViewportHeight();
    const cols = isDesktop ? COLS_DESKTOP : COLS_MOBILE;
    const rowH = isDesktop ? ROW_HEIGHT_DESKTOP : ROW_HEIGHT_MOBILE;

    const firstRow = Math.max(0, Math.floor((scrollTop - viewH) / rowH) - BUFFER_ROWS);
    const lastRow = Math.ceil((scrollTop + viewH * 2) / rowH) + BUFFER_ROWS;

    const start = firstRow * cols;
    const end = Math.min(lastRow * cols, visibleCount);

    const newActive = new Set<string>();
    for (let i = Math.max(0, start); i < end; i++) {
      if (cards[i]) newActive.add(cards[i].id);
    }

    setActiveIds(newActive);

    // Infinite scroll
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

    // Listen on both window and document — different WebViews fire on different targets
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });

    // Polling fallback for Telegram WebView where scroll events may not fire
    const intervalId = setInterval(handleScroll, 300);

    // Initial checks — deferred to handle Telegram WebView layout settling
    handleScroll();
    const t1 = setTimeout(handleScroll, 100);
    const t2 = setTimeout(handleScroll, 600);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [handleScroll]);

  // Reset when category changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setActiveIds(new Set());
  }, [cards]);

  if (cards.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--twa-hint)]">Ничего не найдено</p>;
  }

  const cols = isDesktop ? COLS_DESKTOP : COLS_MOBILE;

  return (
    <div
      className={isDesktop ? 'columns-4 gap-3 px-4 pb-20' : 'grid gap-3 px-4 pb-20'}
      style={isDesktop ? undefined : { gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {visibleCards.map((card) => (
        <div key={card.id} onClick={() => onCardClick(card)} className="mb-3 break-inside-avoid">
          <CardItem
            card={card}
            isActive={activeIds.has(card.id)}
            isDesktop={isDesktop}
          />
        </div>
      ))}
    </div>
  );
});
