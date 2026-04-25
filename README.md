# TWA Gallery

Видео-галерея для Telegram WebApp. 1000 карточек, из них 4 уникальных видео (остальные дубликаты для теста производительности). Работает в Telegram WebView и в обычном браузере.

---

## Суть проблемы

Telegram WebApp — это не обычный браузер. Он работает внутри приложения Telegram на iOS/Android/macOS, и там свои особенности:

1. **Ограниченная производительность** — мобильные устройства слабее десктопов, декодеров видео мало
2. **WebView-рантайм** — не все Web API работают так же, как в Chrome
3. **60fps скролл** — если скролл тормозит, пользователи бросают приложение

Нужно было показать 1000 видео-карточек плавно и быстро.

---

## Как это работает

### Навигация без react-router-dom

**Проблема:** `react-router-dom` v6 использует `useSyncExternalStore` из React 18. В старых WebView (macOS/iOS Telegram) это падает.

**Решение:** Простой `useState`:

```tsx
const [page, setPage] = useState<'home' | 'profile' | 'card'>('home');
```

Это работает везде. Это не баг, это архитектурное решение.

**Альтернатива:** Можно было попробовать react-router v5, но там проблемы с TypeScript и он deprecated. Проще написать 5 строчек навигации, чем тащить legacy-роутер.

---

### Видео: не все сразу

**Проблема:** 1000 видео одновременно — это 1000 HTTP-запросов и 1000 декодеров. Телефон задохнётся.

**Решение:** Видео запускается только когда карточка в зоне видимости. Всё остальное время — просто постер (статичная картинка).

**Как работает:**

```
Скролл → расчёт: какая карточка в viewport
       → передаём isActive в CardItem
       → isActive=true: запускаем видео (debounced 100ms)
       → isActive=false: останавливаем, убираем src, destroy HLS
```

Никаких IntersectionObserver (они глючат в WebView). Ручной расчёт по `scrollY`, `getBoundingClientRect()`, фиксированная высота строки.

---

### Виртуализация: НЕТ

**Почему нет:** `@tanstack/react-virtual` отлично работает на десктопе, но в мобильных WebView вызывал баги с CSS `position: sticky` и overlay-элементами. Плюс, на десктопе 1000 карточек и так рендерятся без проблем.

**Что используем вместо:** Batch loading. Показываем первые 20 карточек. По мере скролла подгружаем ещё по 20. В DOM в любой момент ~40-60 карточек, остальные не рендерятся благодаря `.slice()`.

```tsx
const [visibleCount, setVisibleCount] = useState(20);
// ...
const visibleCards = cards.slice(0, visibleCount);
```

Это не виртуализация в классическом смысле, но работает стабильно и не ломает CSS.

---

### Desktop: masonry-style

На десктопе карточки разной высоты: `[260, 320, 280, 240, 300, 360]`. Это создаёт визуально Pinterest-style сетку через CSS columns.

**Почему не grid:** Grid не умеет в masonry из коробки. CSS columns — это одна строка кода:

```tsx
style={isDesktop ? undefined : { gridTemplateColumns: `repeat(2, 1fr)` }}
```

На десктопе используем обычный CSS columns, на мобильных — grid.

---

### Telegram SDK: graceful degradation

Приложение должно работать даже если Telegram SDK недоступен (например, открыли ссылку в Safari напрямую).

**Как:** Все вызовы SDK обёрнуты в `try/catch`. Haptic feedback просто не срабатывает, приложение работает дальше.

```tsx
const impact = (style: 'light' | 'medium' | 'heavy') => {
  try {
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {}
};
```

---

## Стек

| | |
|---|---|
| React 18 + TypeScript | Без StrictMode (он ломал WebView) |
| Vite 5 | Быстрая сборка |
| Tailwind CSS v3 | Utility-first, mobile-first |
| HLS.js | Потоковое видео |
| `@tma.js/sdk-react` | Telegram SDK (не устаревший `@telegram-apps/sdk-react`) |

**Примечание:** `react-router-dom` указан в package.json, но не используется. Это legacy от начального прототипа. Можно удалить.

---

## Тесты

```bash
npm test --run
```

7 тестов — проверяют целостность данных и breakpoint hook.

---

## CSS-переменные

```css
:root {
  --twa-bg: #0d0d0d;
  --twa-surface: #1a1a1a;
  --twa-surface2: #2a2a2a;
  --twa-border: rgba(255,255,255,0.1);
  --twa-btn: #007bff;
  --twa-hot: #ff3b30;
  --twa-hint: rgba(255,255,255,0.5);
}
```

Если Telegram передаёт свои `themeParams`, они перезаписывают эти значения.

---

## Ключевые решения и почему

| Решение | Почему | Альтернатива |
|---------|--------|--------------|
| useState навигация | react-router-dom падает в WebView | HashRouter — не решил проблему |
| Скролл-расчёт вместо IntersectionObserver | IntersectionObserver ненадёжен в WebView | IntersectionObserver — глючит |
| Batch loading вместо виртуализации | @tanstack/react-virtual ломал CSS overlay | Виртуализация — баги с sticky |
| CSS columns на десктопе | Pinterest-style без JS | Grid — не умеет masonry |
| HLS.js для видео | Нативный `<video>` не поддерживает .m3u8 | Статичные файлы — не гибко |
| No StrictMode | Вызывал DOM reset в WebView | StrictMode — сломал приложение |

---

## Файлы для понимания

- `src/pages/` — страницы (Home, Profile, CardDetail)
- `src/components/Gallery/CardGrid.tsx` — логика видимости карточек
- `src/components/Card/CardItem.tsx` — видео-плеер для карточки
- `src/hooks/useHaptic.ts` — haptic feedback
- `src/hooks/useBackButton.ts` — кнопка "назад" в Telegram
- `src/components/Icons/` — все SVG-иконки вынесены в отдельные компоненты