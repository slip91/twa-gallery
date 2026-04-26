# TWA Gallery — НЕЙРОСЕТКА

Видео-галерея для Telegram WebApp. Показывает 74 карточки в трёх категориях (Оживление, Фото, Видео) с HLS-видео, которое воспроизводится только пока карточка видна на экране.

Открывается внутри Telegram как WebApp и работает как обычное SPA в браузере.

---

## Технологии

- **React 18 + TypeScript** — без StrictMode (ломал DOM-состояние в Telegram WebView)
- **Vite 5** — сборка
- **Tailwind CSS v3** — стили, breakpoint `lg:` (1024px) для десктопа
- **HLS.js** — потоковое HLS-видео на Android; нативный `canPlayType` на iOS
- **@tma.js/sdk-react** — Telegram SDK с graceful degradation (работает и в браузере)

---

## Структура

```
src/
  pages/           — HomePage, CardDetailPage, ProfilePage
  components/
    Gallery/       — CardGrid (сетка + infinite scroll + видимость)
    Card/          — CardItem (карточка с HLS-видео)
    UI/            — BannerSlider, HlsVideo
    Icons/         — SVG-иконки
  hooks/           — useHaptic, useBackButton, useMediaQuery
  data/mock.ts     — генерация mock-данных
  types/           — TypeScript типы
```

---

## Ключевые архитектурные решения

### Навигация через useState

`react-router-dom` v6 использует `useSyncExternalStore` из React 18, которая падает в старых WebView (macOS/iOS Telegram). Поэтому навигация сделана через простой `useState('home' | 'profile' | 'card')`. Никаких зависимостей, работает везде.

---

### Скролл через собственный контейнер

Telegram WebView прокручивает страницу на уровне OS, не JS. Это значит `window.scrollY` всегда 0, события `scroll` на `window` не стреляют, а `getBoundingClientRect` возвращает одни и те же значения независимо от позиции прокрутки.

Решение — контейнер `#main-scroll` с `overflow-y: auto` и `position: fixed`:

```tsx
<div
  id="main-scroll"
  style={{ position: 'fixed', top: 48, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}
>
```

`position: fixed` гарантирует правильный `clientHeight` даже там, где `100dvh` и `flex-1` возвращают 0. Теперь `scrollTop` читается из этого элемента, `getBoundingClientRect` обновляется при прокрутке, а события `scroll` стреляют надёжно.

---

### Видимость карточек — централизованно в CardGrid

Каждый `CardItem` принимает prop `isActive: boolean`. Кто решает, активна ли карточка — `CardGrid`, а не сама карточка. Это позволяет одним махом отключить все видео при смене категории и активировать первые N карточек без ожидания скролла.

`CardGrid` отслеживает видимость через `getBoundingClientRect` на элементах с `data-card-id`:

```
1. Scroll-событие на #main-scroll        — основной триггер
2. Polling каждые 250ms                  — fallback (Telegram иногда не стреляет события)
3. resize-событие                        — Telegram расширяет WebApp с анимацией
4. Таймеры 100ms / 600ms / 1500ms        — ловят конец анимации открытия
5. Первые 8 карточек — active сразу      — до первого scroll/visibility-check
```

Последний пункт важен: при открытии приложения Telegram WebApp анимируется ~300-500ms, в это время `getBoundingClientRect` возвращает неверные координаты. Форсируем первые 8 карточек активными немедленно, polling потом скорректирует.

---

### Видео: iOS vs Android

iOS и Android требуют разных подходов для HLS и автоплея.

**Android (HLS.js):**

```tsx
const hls = new Hls({ maxBufferLength: 5, maxMaxBufferLength: 10 });
hls.loadSource(url);
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED, () => playWithRetry(video));
```

**iOS (нативный HLS):**

```tsx
// autoplay=true до src — браузер сам управляет воспроизведением
// muted+playsInline+autoplay = разрешено без жеста пользователя
video.autoplay = true;
video.src = url;
video.load();
playWithRetry(video); // fallback на случай если всё же заблокировано
```

**`playWithRetry`** — если `play()` отклонён политикой автоплея, вешает одноразовый `touchstart`/`click`-листенер и повторяет при первом касании:

```tsx
function playWithRetry(video: HTMLVideoElement) {
  video.play().catch(() => {
    const retry = () => { video.play().catch(() => {}); };
    document.addEventListener('touchstart', retry, { once: true, passive: true });
    document.addEventListener('click', retry, { once: true });
  });
}
```

**Остановка видео** — при уходе карточки из viewport: `pause()` + `removeAttribute('src')` + `hls.destroy()`. Освобождает декодер и RAM полностью.

---

### Infinite scroll

При скролле до конца списка подгружается следующая пачка по 20 карточек. DOM никогда не становится огромным — в каждый момент в нём не больше нескольких десятков карточек (зависит от скорости прокрутки).

---

### Masonry на десктопе

Карточки имеют разную высоту `[280, 340, 300, 260, 320, 380]px` — создаёт Pinterest-style сетку через CSS `columns: 4`. На мобильном — обычный `grid` 2 колонки, фиксированная высота 200px.

---

### BannerSlider

Карусель с автопрокруткой каждые 3.5 секунды и pagination dots снизу. Клик по точке переключает слайд и сбрасывает таймер.

---

## Страницы и компоненты

**HomePage** — главная. Хедер с логотипом и навигацией (десктоп) / bottom nav (мобильный), BannerSlider, галерея карточек.

**CardDetailPage** — детальный просмотр карточки. HLS-видео или постер, табы, кнопка генерации, блок "Похожее" с 4 карточками (видео с автоплеем).

**ProfilePage** — страница профиля.

---

## CSS-переменные

```css
--twa-bg: #0d0d0d
--twa-surface: #1e1e1e
--twa-surface2: #242424
--twa-hint: #7f7f7f
--twa-btn: #2481cc
--twa-hot: #FF551D
--twa-border: #2a2a2a
```

---

## Mock-данные

74 карточки генерируются в `src/data/mock.ts` через seeded LCG (seed=42) — порядок стабилен между рендерами. 4 HLS-потока (`.m3u8`) + 12 постеров.

| Категория | Карточек | Видео  |
|-----------|----------|--------|
| Оживление | 18       | ~60%   |
| Фото      | 16       | ~25%   |
| Видео     | 40       | 100%   |

---

## Локальная разработка

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm test --run   # тесты
```

Деплой настроен через GitHub Actions → GitHub Pages при пуше в `main`.
