import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import type { CardItem as CardItemType } from '../../types/gallery';
import { CardItem } from '../Card/CardItem';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface CardGridProps {
  cards: CardItemType[];
  onCardClick: (card: CardItemType) => void;
}

const BATCH_SIZE = 20;
const COLS_MOBILE = 2;
const COLS_DESKTOP = 4;
// px buffer around viewport — preload before entering, keep after leaving
const VISIBILITY_BUFFER = 200;
// How often to poll for visibility (ms) — main mechanism for Telegram WebView
// where window.scrollY and scroll events are unreliable
const POLL_INTERVAL = 250;
const LOAD_MORE_THRESHOLD = 300;

function getViewportHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight || 667;
}

export const CardGrid = memo(function CardGrid({ cards, onCardClick }: CardGridProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  const checkVisibility = useCallback(() => {
    const vh = getViewportHeight();
    const newActive = new Set<string>();

    // getBoundingClientRect works regardless of which scroll container is active —
    // even if Telegram WebView scrolls natively and window.scrollY stays 0
    document.querySelectorAll<HTMLElement>('[data-card-id]').forEach(el => {
      const { top, bottom } = el.getBoundingClientRect();
      if (bottom > -VISIBILITY_BUFFER && top < vh + VISIBILITY_BUFFER) {
        const id = el.getAttribute('data-card-id');
        if (id) newActive.add(id);
      }
    });

    setActiveIds(prev => {
      // Only update state if something actually changed
      if (prev.size === newActive.size && [...newActive].every(id => prev.has(id))) return prev;
      return newActive;
    });

    // Infinite scroll via getBoundingClientRect on the last card —
    // window.scrollY is always 0 in Telegram WebView so we can't use it
    const allCards = document.querySelectorAll<HTMLElement>('[data-card-id]');
    const lastCard = allCards[allCards.length - 1];
    if (lastCard) {
      const { bottom } = lastCard.getBoundingClientRect();
      if (bottom < vh + LOAD_MORE_THRESHOLD) {
        setVisibleCount(prev => Math.min(prev + BATCH_SIZE, cards.length));
      }
    }
  }, [cards.length]);

  useEffect(() => {
    const onScroll = () => checkVisibility();

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });

    // Primary mechanism for Telegram WebView
    const intervalId = setInterval(checkVisibility, POLL_INTERVAL);

    // Deferred initial checks — Telegram WebView may not have settled layout yet
    checkVisibility();
    const t1 = setTimeout(checkVisibility, 100);
    const t2 = setTimeout(checkVisibility, 600);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      clearInterval(intervalId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [checkVisibility]);

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
        <div
          key={card.id}
          data-card-id={card.id}
          onClick={() => onCardClick(card)}
          className="mb-3 break-inside-avoid"
        >
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
