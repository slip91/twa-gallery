import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
  const getSnapshot = () => window.matchMedia(query).matches;
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot);
}
