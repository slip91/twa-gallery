# TWA Gallery

Видео-галерея для Telegram WebApp. 74 карточки в 3 категориях (Оживление, Фото, Видео), HLS-видео через hls.js. Работает в Telegram WebView и в обычном браузере.

---

## Суть проблемы

Telegram WebApp — это не обычный браузер. Он работает внутри приложения Telegram на iOS/Android/macOS, и там свои особенности:

1. **Ограниченная производительность** — мобильные устройства слабее десктопов, декодеров видео мало
2. **WebView-рантайм** — не все Web API работают так же, как в Chrome
3. **60fps скролл** — если скролл тормозит, пользователи бросают приложение

Нужно было показать 74 карточки плавно и быстро, не жечь ресурсы на видео вне экрана.

---

## Как это работает

### Навигация без react-router-dom

**Проблема:** `react-router-dom` v6 использует `useSyncExternalStore` из React 18. В старых WebView (macOS/iOS Telegram) это падает.

**Решение:** Простой `useState`:

```tsx
const [page, setPage] = useState<'home' | 'profile' | 'card'>('home');
```

Это работает везде. Это не баг, это архитектурное решение.

---

### Видео: IntersectionObserver per-card

**Проблема:** Много видео одновременно — это много HTTP-запросов и декодеров. Телефон задохнётся.

**Решение:** Каждая карточка сама следит за своей видимостью через `IntersectionObserver`. Видео запускается только когда карточка входит в viewport. Всё остальное время — просто постер (статичная картинка).

```
Карточка попадает в viewport (+ 100px preload margin)
  → debounce 150ms (защита от быстрого скролла)
  → запускаем HLS-видео

Карточка уходит из viewport
  → pause + removeAttribute('src') + hls.destroy()
  → освобождаем декодер и память
```

Каждый `CardItem` содержит свой `IntersectionObserver`. Это layout-agnostic — работает одинаково для masonry (desktop) и grid (mobile).

---

### Виртуализация: НЕТ

**Почему нет:** `@tanstack/react-virtual` отлично работает на десктопе, но в мобильных WebView вызывал баги с CSS `position: sticky` и overlay-элементами.

**Что используем вместо:** Batch loading. Показываем первые 20 карточек. По мере скролла подгружаем ещё по 20. В DOM в любой момент ~40-60 карточек.

```tsx
const [visibleCount, setVisibleCount] = useState(20);
const visibleCards = cards.slice(0, visibleCount);
```

---

### Desktop: masonry-style

На десктопе карточки разной высоты: `[260, 320, 280, 240, 300, 360]px`. Создаёт Pinterest-style сетку через CSS columns.

```css
/* desktop */
columns: 4;

/* mobile */
grid-template-columns: repeat(2, 1fr);
```

---

### Telegram SDK: graceful degradation

Приложение работает даже если Telegram SDK недоступен (открыли в Safari напрямую).

```tsx
const impact = (style: 'light' | 'medium' | 'heavy') => {
  try {
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {}
};
```

---

## Mock-данные

| Категория | Карточек | Видео |
|-----------|----------|-------|
| Оживление | 18 | ~60% |
| Фото | 16 | ~25% |
| Видео | 40 | 100% |

Генерируются с seeded pseudo-random (LCG, seed=42) — порядок стабильный между рендерами.

---

## Стек

| | |
|---|---|
| React 18 + TypeScript | Без StrictMode (ломал DOM reset в WebView) |
| Vite 5 | Быстрая сборка |
| Tailwind CSS v3 | Utility-first, mobile-first |
| HLS.js | Потоковое видео (.m3u8) |
| `@tma.js/sdk-react` | Telegram SDK |

---

## Тесты

```bash
npm test --run
```

---

## CSS-переменные

```css
:root {
  --twa-bg: #0d0d0d;
  --twa-surface: #1e1e1e;
  --twa-surface2: #242424;
  --twa-text: #ffffff;
  --twa-hint: #7f7f7f;
  --twa-btn: #2481cc;
  --twa-hot: #FF551D;
  --twa-border: #2a2a2a;
}
```

---

## Ключевые решения

| Решение | Почему | Альтернатива |
|---------|--------|--------------|
| useState навигация | react-router-dom падает в WebView | HashRouter — не решил проблему |
| IntersectionObserver per-card | Layout-agnostic, точнее скролл-расчёта | Скролл-расчёт — ломался на masonry |
| Batch loading вместо виртуализации | @tanstack/react-virtual ломал CSS overlay | Виртуализация — баги с sticky |
| CSS columns на десктопе | Pinterest-style без JS | Grid — не умеет masonry |
| HLS.js для видео | Нативный `<video>` не поддерживает .m3u8 на Android | Статичные файлы — не гибко |
| No StrictMode | Вызывал DOM reset в WebView | StrictMode — сломал приложение |

---

## Файлы для понимания

- `src/pages/` — страницы (Home, Profile, CardDetail)
- `src/components/Gallery/CardGrid.tsx` — batch loading, infinite scroll
- `src/components/Card/CardItem.tsx` — видео-плеер + IntersectionObserver per-card
- `src/data/mock.ts` — генерация mock-данных с seeded random
- `src/hooks/useHaptic.ts` — haptic feedback
- `src/hooks/useBackButton.ts` — кнопка "назад" в Telegram
- `src/components/Icons/` — SVG-иконки
