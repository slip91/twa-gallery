import React from 'react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const GalleryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="white"/>
    <path d="M24.0001 16.5563C24.2822 16.5563 24.5528 16.6683 24.7523 16.8678C24.9517 17.0673 25.0638 17.3378 25.0638 17.6199V22.9383H30.3822C30.6643 22.9383 30.9348 23.0504 31.1343 23.2498C31.3338 23.4493 31.4458 23.7199 31.4458 24.002C31.4458 24.2841 31.3338 24.5546 31.1343 24.7541C30.9348 24.9536 30.6643 25.0656 30.3822 25.0656H25.0638V30.384C25.0638 30.6661 24.9517 30.9366 24.7523 31.1361C24.5528 31.3356 24.2822 31.4477 24.0001 31.4477C23.718 31.4477 23.4475 31.3356 23.248 31.1361C23.0485 30.9366 22.9365 30.6661 22.9365 30.384V25.0656H17.6181C17.336 25.0656 17.0655 24.9536 16.866 24.7541C16.6665 24.5546 16.5544 24.2841 16.5544 24.002C16.5544 23.7199 16.6665 23.4493 16.866 23.2498C17.0655 23.0504 17.336 22.9383 17.6181 22.9383H22.9365V17.6199C22.9365 17.3378 23.0485 17.0673 23.248 16.8678C23.4475 16.6683 23.718 16.5563 24.0001 16.5563Z" fill="black"/>
  </svg>
);

const TariffsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="14" y2="14"/>
  </svg>
);

const CrystalsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 12l10 10 10-10L12 2z"/>
  </svg>
);

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const handleNav = (page: string) => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}
    onNavigate(page);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--twa-surface)] border-t border-[var(--twa-border)] pb-safe md:hidden">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => handleNav('home')}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <span className={`text-xl ${activePage === 'home' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            <HomeIcon />
          </span>
          <span className={`text-[10px] ${activePage === 'home' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            Главная
          </span>
        </button>

        <button
          onClick={() => handleNav('gallery')}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <span className={`text-xl ${activePage === 'gallery' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            <GalleryIcon />
          </span>
          <span className={`text-[10px] ${activePage === 'gallery' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            Галерея
          </span>
        </button>

        <button
          onClick={() => handleNav('create')}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg"
        >
          <PlusIcon />
        </button>

        <button
          onClick={() => handleNav('tariffs')}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <span className={`text-xl ${activePage === 'tariffs' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            <TariffsIcon />
          </span>
          <span className={`text-[10px] ${activePage === 'tariffs' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            Тарифы
          </span>
        </button>

        <button
          onClick={() => handleNav('crystals')}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <span className={`text-xl ${activePage === 'crystals' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            <CrystalsIcon />
          </span>
          <span className={`text-[10px] ${activePage === 'crystals' ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
            Кристаллы
          </span>
        </button>
      </div>
    </nav>
  );
}