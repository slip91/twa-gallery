import { LogoIcon } from '../Icons/LogoIcon';
import { CrystalIcon } from '../Icons/CrystalIcon';
import { AddIcon } from '../Icons/AddIcon';

interface HeaderProps {
  onProfile: () => void;
}

export function Header({ onProfile }: HeaderProps) {
  const handleProfile = () => {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {}
    onProfile();
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[var(--twa-surface)] border-b border-[var(--twa-border)]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 md:w-6 md:h-6 text-white">
          <LogoIcon />
        </div>
        <span className="text-white font-bold text-sm tracking-wide">НЕЙРОСЕТКА</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[var(--twa-surface2)] rounded-full px-2 py-1">
          <CrystalIcon size={16} />
          <span className="text-white text-xs font-medium">380</span>
          <button className="hover:opacity-70 transition-opacity">
            <AddIcon />
          </button>
        </div>

        <button onClick={handleProfile} className="hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[var(--twa-btn)] flex items-center justify-center text-white text-xs font-bold">
            N
          </div>
        </button>
      </div>
    </header>
  );
}