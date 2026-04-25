# Video Performance Optimization

## Текущая архитектура

### Batch Loading (НЕ виртуализация)

- Первые 20 карточек рендерятся сразу
- При скролле подгружаются ещё по 20
- В DOM в любой момент ~40 карточек

### Scroll-Based Video Visibility

Вместо IntersectionObserver используется ручной расчёт видимости:

```tsx
const handleScroll = useCallback(() => {
  const scrollTop = window.scrollY;
  const viewH = window.innerHeight;
  const cols = isDesktop ? 4 : 2;
  const ROW_HEIGHT = 240;

  const firstRow = Math.max(0, Math.floor((scrollInGrid - viewH * 0.5) / ROW_HEIGHT));
  const lastRow = Math.ceil((scrollInGrid + viewH) / ROW_HEIGHT);

  const start = Math.max(0, firstRow * cols - cols);
  const end = Math.min(lastRow * cols + cols * 3, cards.length);

  setActiveIds(new Set(cards.slice(start, end).map(c => c.id)));
}, [cards, isDesktop]);
```

### Video Control

- `isActive=true` → запуск видео (debounced 100ms)
- `isActive=false` → `video.pause()` + `removeAttribute('src')` + `video.load()` + `hls.destroy()`

### Desktop Masonry

CSS columns с переменной высотой карточек: `[260, 320, 280, 240, 300, 360]`px