export const TariffsIcon = ({ active, size = 22 }: { active?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'}/>
    <line x1="7" y1="8" x2="15" y2="8" stroke={active ? 'var(--twa-bg)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="7" y1="12" x2="15" y2="12" stroke={active ? 'var(--twa-bg)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="7" y1="16" x2="11" y2="16" stroke={active ? 'var(--twa-bg)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
