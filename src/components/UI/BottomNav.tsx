import { HomeNavIcon } from '../Icons/HomeNavIcon';
import { GalleryIcon } from '../Icons/GalleryIcon';
import { PlusIcon } from '../Icons/PlusIcon';
import { TariffsIcon } from '../Icons/TariffsIcon';
import { DiamondNavIcon } from '../Icons/DiamondNavIcon';
import { useHaptic } from '../../hooks/useHaptic';
import { NAV_LABELS } from '../../constants';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavButtonProps {
  page: string;
  activePage: string;
  onNavigate: (page: string) => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton = ({ page, activePage, onNavigate, icon, label }: NavButtonProps) => {
  const { impact } = useHaptic();
  const isActive = activePage === page;

  const handleClick = () => {
    impact();
    onNavigate(page);
  };

  return (
    <button onClick={handleClick} className="flex flex-col items-center gap-0.5 px-3 py-1">
      <span className={isActive ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}>
        {icon}
      </span>
      <span className={`text-[10px] ${isActive ? 'text-[var(--twa-btn)]' : 'text-[var(--twa-hint)]'}`}>
        {label}
      </span>
    </button>
  );
};

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const { impact } = useHaptic();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--twa-surface)] border-t border-[var(--twa-border)] pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16">
        <NavButton page="home" activePage={activePage} onNavigate={onNavigate} icon={<HomeNavIcon active={activePage === 'home'} />} label={NAV_LABELS.home} />
        <NavButton page="gallery" activePage={activePage} onNavigate={onNavigate} icon={<GalleryIcon />} label={NAV_LABELS.gallery} />
        <button onClick={() => { impact('medium'); onNavigate('create'); }} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg">
          <PlusIcon size={40} />
        </button>
        <NavButton page="tariffs" activePage={activePage} onNavigate={onNavigate} icon={<TariffsIcon active={activePage === 'tariffs'} />} label={NAV_LABELS.tariffs} />
        <NavButton page="crystals" activePage={activePage} onNavigate={onNavigate} icon={<DiamondNavIcon active={activePage === 'crystals'} />} label={NAV_LABELS.crystals} />
      </div>
    </nav>
  );
}