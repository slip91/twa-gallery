export const DiamondNavIcon = ({ active, size = 22 }: { active?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 3L18 8L15 19H7L4 8L11 3Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      fill={active ? 'currentColor' : 'none'}
    />
    <path d="M4 8H18" stroke={active ? 'var(--twa-bg)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 8L11 3L14 8L11 19L8 8Z" stroke={active ? 'var(--twa-bg)' : 'currentColor'} strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);
