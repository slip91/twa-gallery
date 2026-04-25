export const GridNavIcon = ({ active }: { active?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'}/>
    <rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'}/>
    <rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'}/>
    <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'}/>
  </svg>
);
