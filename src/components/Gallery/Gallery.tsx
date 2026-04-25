import { useState, useMemo, useEffect } from 'react';
import { MOCK_CARDS, CATEGORIES } from '../../data/mock';
import type { Category, CardItem } from '../../types/gallery';
import { GalleryTabs } from './GalleryTabs';
import { CardGrid } from './CardGrid';

interface GalleryProps {
  onCardClick: (card: CardItem) => void;
}

export function Gallery({ onCardClick }: GalleryProps) {
  const [active, setActive] = useState<Category>('Оживление');

  const filtered = useMemo(
    () => MOCK_CARDS.filter((c) => c.category === active),
    [active]
  );

  useEffect(() => {
    const stopAll = () => {
      document.querySelectorAll('video').forEach(v => v.pause());
    };
    window.addEventListener('pagehide', stopAll);
    return () => {
      window.removeEventListener('pagehide', stopAll);
      stopAll();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <GalleryTabs categories={CATEGORIES} active={active} onChange={setActive} />
      <CardGrid cards={filtered} onCardClick={onCardClick} />
    </div>
  );
}
