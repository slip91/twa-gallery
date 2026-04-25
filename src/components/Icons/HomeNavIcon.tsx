export const HomeNavIcon = ({ active }: { active?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L11 3L19 9.5V19H14V14H8V19H3V9.5Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      fill={active ? 'currentColor' : 'none'}
    />
  </svg>
);
