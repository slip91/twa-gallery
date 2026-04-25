# TWA Gallery

Видео-галерея для Telegram WebApp (TWA) с 1000 тестовыми карточками. Работает как внутри Telegram WebView, так и в обычном браузере.

## Запуск

```bash
cd twa-gallery
npm i && npm run dev
```

Открыть: http://localhost:5173

## Стек

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Routing | Custom useState (react-router-dom удалён — несовместим с Telegram WebView) |
| Styling | Tailwind CSS v3 |
| Video | HLS.js для потокового видео |
| Telegram SDK | `@tma.js/sdk-react` |
| Testing | vitest + @testing-library/react + happy-dom |

## Архитектура

### Навигация: useState

`react-router-dom` v6 использует `useSyncExternalStore` — не работает в Telegram WebView на macOS/iOS. Заменён на простой `useState`:

```tsx
const [page, setPage] = useState<'home' | 'profile' | 'card'>('home');
```

### Graceful Degradation

Приложение работает полностью в браузере без Telegram. Все вызовы SDK обёрнуты в `try/catch`.

### Hooks

- `useHaptic()` — haptic feedback для Telegram
- `useBackButton()` — управление кнопкой "назад"
- `useMediaQuery()` — breakpoint detection

### State Management

Нет глобального state-менеджера. State локальный:
- `Gallery.tsx` — фильтр категорий
- `CardGrid.tsx` — scroll-based visibility tracking
- `CardItem.tsx` — видео playback

## Производительность

### Scroll-based Video Visibility

Вместо IntersectionObserver используется расчёт видимости по скроллу:

```tsx
// CardGrid.tsx
const handleScroll = useCallback(() => {
  const scrollTop = window.scrollY;
  // расчёт firstRow/lastRow по ROW_HEIGHT = 240
  // Set активных ID → передаётся в CardItem как isActive
}, [cards, isDesktop]);
```

### Видео Control

- `isActive=true` → играет видео (debounced 100ms)
- `isActive=false` → `video.pause()` + `removeAttribute('src')` + `video.load()` + HLS.destroy()

### Desktop Masonry

На десктопе переменная высота карточек: `[260, 320, 280, 240, 300, 360]`px.

## Telegram WebApp Integration

### Haptic Feedback

```tsx
const { impact } = useHaptic();
impact('light'); // 'light' | 'medium' | 'heavy'
```

### Back Button

```tsx
useBackButton(onBack); // показывает/скрывает кнопку, вешает обработчик
```

## Тесты

```bash
npm test        # watch mode
npm test --run  # single run
```

7 тестов, все проходят:
- `mock.test.ts` — валидация данных
- `useMediaQuery.test.ts` — breakpoint hook

## CSS Переменные

```css
:root {
  --twa-bg: #0d0d0d;
  --twa-surface: #1a1a1a;
  --twa-surface2: #2a2a2a;
  --twa-border: rgba(255,255,255,0.1);
  --twa-text: #ffffff;
  --twa-hint: rgba(255,255,255,0.5);
  --twa-btn: #007bff;
  --twa-hot: #ff3b30;
  --twa-text-secondary: rgba(255,255,255,0.7);
}
```

Safe-area: `.pt-safe` / `.pb-safe` через `env(safe-area-inset-*)`.

## Файлы для агентов

См. `AGENTS.md` — подробная документация по архитектуре, конвенциям кода и типичным задачам.

## Известные решения

1. **react-router-dom удалён** — v6 использует `useSyncExternalStore`, не работает в WebView
2. **Custom useState navigation** — простой и надёжный, работает везде
3. **Scroll-based visibility** — вместо IntersectionObserver (ненадёжен в WebView)
4. **Desktop masonry** — CSS columns, визуально Pinterest-style
5. **4 уникальных видео-URL** — браузер кэширует, сеть не грузит
6. **No StrictMode** — вызывал DOM reset в Telegram WebView