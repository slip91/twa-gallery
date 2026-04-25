import { memo } from 'react';
import type { Category } from '../../types/gallery';

interface CategoryOption {
  key: Category;
  label: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'Оживление', label: 'Оживление' },
  { key: 'Фото', label: 'Фото' },
  { key: 'Видео', label: 'Видео' },
];

interface GalleryTabsProps {
  categories: Category[];
  active: Category;
  onChange: (cat: Category) => void;
}

export const GalleryTabs = memo(function GalleryTabs({ categories, active, onChange }: GalleryTabsProps) {
  const options = CATEGORY_OPTIONS.filter(opt => categories.includes(opt.key));

  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
      {options.map((opt) => {
        const isActive = active === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex-shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-black'
                : 'bg-white/20 text-[var(--twa-text-secondary)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});