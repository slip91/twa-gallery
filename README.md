# TWA Gallery

Видео-галерея для Telegram WebApp (TWA) с 1000 тестовыми карточками. Работает как внутри Telegram WebView, так и в обычном браузере.

## Запуск

```bash
cd twa-gallery
npm i && npm run dev
```

Открыть: http://localhost:5173

## Стек

- React 18 + TypeScript (strict)
- Vite 5
- React Router DOM v6 (HashRouter)
- Tailwind CSS v3
- `@tanstack/react-virtual` (мобильная виртуализация)
- `@tma.js/sdk-react` (Telegram WebApp SDK)
- vitest + @testing-library/react + happy-dom
- Playwright (E2E)

## Архитектура

### Router: HashRouter

Telegram WebApp инжектирует query-параметры (`tgWebAppData`, `tgWebAppPlatform`). `HashRouter` избегает конфликтов и работает везде.

### Graceful Degradation

Приложение работает полностью в браузере без Telegram. Все вызовы SDK обёрнуты в `try/catch`:

```
Components → useTelegram() → TelegramContext
                    ↓
            SDK available? → Yes: use real SDK
                     ↓ No: noop fallbacks
```

### State Management

Нет глобального state-менеджера. State локальный:
- `Gallery.tsx` — фильтр категорий
- `CardItem.tsx` — видео playback
- `TelegramProvider.tsx` — инициализация SDK

## Производительность

### Autoplay без потери FPS

`CardItem.tsx` использует `IntersectionObserver` (threshold 0.1) — никаких polling-циклов.

### Оптимизации

- **Виртуализация на мобильных** — рендерится ~50 DOM-нод вместо 1000
- **Адаптивный preload** — быстрый скролл (>500px/s): `preload="none"`, медленный: `preload="auto"`
- **Content-visibility** — `content-visibility: auto` + `contain-intrinsic-size` пропускает layout/paint для off-screen карточек
- **Auto-pause** — видео останавливаются при уходе из viewport
- **Cleanup при навигации** — остановка всех видео на `pagehide`
- **Desktop без виртуализации** — 4-колоночная сетка, 1000 карточек без проблем

## Telegram WebApp Integration

### SDK Setup

```tsx
import { init, miniApp, backButton, hapticFeedback, viewport } from '@tma.js/sdk-react';
```

**Lifecycle:**
1. `init()` — инициализация SDK bridge
2. `miniApp.mount()` + `backButton.mount()` + `viewport.mount()`
3. `viewport.expand()` — разворачивание на полную высоту
4. `miniApp.ready()` — скрытие loader, показ приложения
5. `miniApp.setBgColor('#0d0d0d')` + `miniApp.setHeaderColor('#1e1e1e')`

### Haptic Feedback

Используется на всех интерактивных элементах:
- Клики по карточкам (`CardItem.tsx`)
- Навигация (`Header.tsx`)

```tsx
const { haptic } = useTelegram();
haptic.impact('light');
```

### Back Button

На странице деталей карточки (`CardDetailPage.tsx`):

```tsx
const handleBack = useCallback(() => navigate(-1), [navigate]);
useBackButton(handleBack, true);
```

## Тесты

### Unit Tests (vitest)

```bash
npm test        # watch mode
npm test --run  # single run
```

19 тестов, все проходят:
- `BannerSlider.test.tsx`
- `CardItem.test.tsx`
- `GalleryTabs.test.tsx`
- `useMediaQuery.test.ts`
- `mock.test.ts`

### E2E (Playwright)

```bash
npm run test:e2e
```

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

Safe-area через `env(safe-area-inset-*)` в утилитарных классах `.pt-safe` / `.pb-safe`.

## Файлы для агентов

См. `AGENTS.md` — подробная документация по архитектуре, конвенциям кода и типичным задачам.

## Известные решения

1. **Desktop без виртуализации** — виртуализация ломала CSS с aspect-ratio карточками
2. **HashRouter** — необходим для Telegram WebApp query params
3. **4 уникальных видео-URL** — браузер кэширует, сеть не грузит 1000 видео
4. **`@tma.js/sdk-react` вместо `@telegram-apps/sdk-react`** — современный, поддерживаемый SDK
5. **Нет глобального state** — локального state достаточно для фильтра + видео
