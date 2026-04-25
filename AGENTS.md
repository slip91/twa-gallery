# AGENTS.md — TWA Gallery

## Project Overview

Video gallery app for Telegram WebApp (TWA) with 105 test cards (5 static + 100 video, 4 unique video URLs). Works both inside Telegram WebView and standalone browser.

**Primary goals:**
1. Smooth scroll with 105 video cards
2. Pixel-perfect UI matching Figma design
3. Telegram WebApp SDK integration (haptic, back button, theme)
4. Mobile-first responsive (375px mobile → 1280px+ desktop)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict mode), **NO StrictMode** |
| Build | Vite 5 |
| Routing | **Custom useState navigation** (react-router-dom removed — incompatible with Telegram WebView) |
| Styling | Tailwind CSS v3 |
| Video | HLS.js for streaming |
| Telegram SDK | `@tma.js/sdk-react` (modern, not deprecated `@telegram-apps/sdk-react`) |
| Testing | vitest + @testing-library/react + happy-dom |

**Note:** `@tanstack/react-virtual` is in package.json but **NOT USED**. See "Performance Architecture" section.

---

## Architecture Decisions

### Router: Custom useState Navigation

**Why:** `react-router-dom` (v6) uses `useSyncExternalStore` from React 18 which fails in Telegram WebView on macOS/iOS older WebViews. Attempted v5 and v6.3.0 without success.

**Solution:** Simple `useState` navigation with page components:

```tsx
const [page, setPage] = useState<'home' | 'profile'>('home');

if (page === 'profile') {
  return <ProfilePage onBack={() => setPage('home')} />;
}
return <HomePage onProfile={() => setPage('profile')} />;
```

### State Management

No global state library. State is local to components:
- `Gallery.tsx` owns category filter state
- `CardGrid.tsx` owns scroll tracking and active IDs
- `CardItem.tsx` owns video playback state

### Telegram Integration Strategy

**Graceful degradation** — app works fully in browser without Telegram.

All SDK calls wrapped in `try/catch`. The `TelegramProvider`:
1. Catches `init()` errors (both sync and async)
2. Checks `miniApp.isSupported()` before mounting
3. Falls back to noop if SDK unavailable
4. Sets `ready: true` even on failure so UI never blocks

---

## Performance Architecture

### Problem Space
- 105 cards, most are videos
- Mobile devices with limited GPU/decoders
- Smooth 60fps scroll required

### Solution: Batch Loading (NOT Virtualization)

**Why not virtualization:** `@tanstack/react-virtual` caused CSS overlay/positioning bugs with aspect-ratio cards on desktop. On mobile it's unnecessary complexity.

**Solution: Batch Loading**
- Show first 20 cards initially
- Load 20 more when user scrolls near bottom
- `visibleCount` state limits what's rendered via `.slice()`
- In DOM at any time: ~40-60 cards

```tsx
const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
const visibleCards = cards.slice(0, visibleCount);
```

### Scroll-Based Video Visibility

Instead of IntersectionObserver (unreliable in WebView), we calculate visibility manually:

```tsx
const handleScroll = useCallback(() => {
  const scrollTop = window.scrollY;
  const viewH = window.innerHeight;
  const cols = isDesktop ? 4 : 2;

  // Calculate which row is currently visible
  const firstRow = Math.max(0, Math.floor((scrollInGrid - viewH * 0.5) / ROW_HEIGHT));
  const lastRow = Math.ceil((scrollInGrid + viewH) / ROW_HEIGHT);

  // Set active IDs for cards in viewport + buffer
  const start = Math.max(0, firstRow * cols - cols);
  const end = Math.min(lastRow * cols + cols * 3, cards.length);

  const newActive = new Set<string>();
  for (let i = start; i < end; i++) {
    newActive.add(cards[i].id);
  }
  setActiveIds(newActive);
}, [cards, isDesktop]);
```

### Video Control Flow

- `isActive=true` → start video (debounced 100ms)
- `isActive=false` → `video.pause()` + `removeAttribute('src')` + `video.load()` + `hls.destroy()`

```tsx
useEffect(() => {
  if (!isActive) {
    stopVideo(video, hlsRef);
    return;
  }
  // Start video with HLS.js
}, [isActive, card.videoUrl]);
```

### Desktop Masonry

On desktop, cards have variable heights: `[260, 320, 280, 240, 300, 360]`px. This creates Pinterest-style visual effect via CSS columns:

```tsx
// On mobile: grid with 2 columns
// On desktop: CSS columns for masonry
```

### Navigation Cleanup

All videos pause on `pagehide` event:
```tsx
useEffect(() => {
  const handlePageHide = () => {
    document.querySelectorAll('video').forEach(v => v.pause());
  };
  window.addEventListener('pagehide', handlePageHide);
  return () => window.removeEventListener('pagehide', handlePageHide);
}, []);
```

---

## Telegram WebApp Integration

### SDK Setup

File: `src/components/Telegram/TelegramProvider.tsx`

```tsx
import { init, miniApp, backButton, hapticFeedback, viewport } from '@tma.js/sdk-react';
```

**Lifecycle:**
1. `init()` — initialize SDK bridge
2. `miniApp.mount()` — mount mini app component
3. `backButton.mount()` — mount back button component
4. `viewport.mount()` + `viewport.expand()` — expand to full height
5. `miniApp.ready()` — notify Telegram that app is ready (hides loader)
6. `miniApp.setBgColor('#0d0d0d')` + `miniApp.setHeaderColor('#1e1e1e')`

### Haptic Feedback

```tsx
const { impact } = useHaptic();
impact('light'); // 'light' | 'medium' | 'heavy'
```

### Back Button

File: `src/hooks/useBackButton.ts`

```tsx
useBackButton(onBack); // shows/hides button, attaches click handler
```

---

## File Structure

```
src/
├── App.tsx                    # Router (useState based)
├── main.tsx                   # React root + TelegramProvider wrapper
├── index.css                  # Tailwind + CSS vars + TWA safe-area utilities
├── types/
│   └── gallery.ts             # CardItem type, Category union, CATEGORIES const
├── data/
│   ├── mock.ts                # 105-card mock dataset (4 unique video URLs)
│   └── mock.test.ts           # Tests for mock data integrity
├── pages/
│   ├── HomePage.tsx           # Banner + Gallery + Desktop/Mobile nav
│   ├── ProfilePage.tsx        # User profile with back button
│   └── CardDetailPage.tsx     # Card detail with related items
├── components/
│   ├── Telegram/
│   │   └── TelegramProvider.tsx   # SDK init, context, haptic fallback
│   ├── Card/
│   │   ├── CardItem.tsx       # Video playback, scroll-based visibility
│   │   └── CardItem.test.tsx  # Card item tests
│   ├── Gallery/
│   │   ├── Gallery.tsx        # Category tabs + filtered grid
│   │   ├── CardGrid.tsx       # Batch loading + scroll tracking
│   │   ├── GalleryTabs.tsx    # Horizontal scrollable tabs
│   │   └── GalleryTabs.test.tsx
│   ├── UI/
│   │   ├── Header.tsx         # Logo, nav, crystals, profile
│   │   ├── BottomNav.tsx      # Mobile bottom navigation
│   │   ├── BannerSlider.tsx   # Top banner carousel
│   │   └── HlsVideo.tsx       # HLS video player component
│   └── Icons/                 # All SVG icons as components
│       ├── LogoIcon.tsx
│       ├── CrystalIcon.tsx
│       ├── AddIcon.tsx
│       ├── PlusIcon.tsx
│       ├── HomeNavIcon.tsx
│       ├── GalleryIcon.tsx
│       ├── TariffsIcon.tsx
│       └── DiamondNavIcon.tsx
├── hooks/
│   ├── useHaptic.ts           # Telegram haptic feedback
│   ├── useBackButton.ts       # Telegram back button
│   └── useMediaQuery.ts       # Breakpoint detection
└── test/
    └── setup.ts               # vitest setup, happy-dom env
```

---

## Testing

### Unit Tests (vitest)

```bash
npm test        # watch mode
npm test --run  # single run
```

**7 tests, all passing:**
- `src/data/mock.test.ts` — data integrity
- `src/hooks/useMediaQuery.test.ts` — breakpoint hook

### E2E Tests (Playwright)

Config exists but tests not yet written.
```bash
npm run test:e2e
```

---

## Coding Conventions

### TypeScript
- Strict mode enabled
- Prefer `type` over `interface` for simple unions (`Category`)
- Use `React.FC` only when children prop needed
- Memoize heavy components: `memo(function ComponentName(...) {})`

### Components
- Co-locate test files: `Component.tsx` + `Component.test.tsx`
- Extract SVG icons to `src/components/Icons/`
- Hooks go to `src/hooks/`, named `useCamelCase`

### Tailwind
- Use CSS variables for theme colors: `bg-[var(--twa-bg)]`
- Mobile-first utilities, `md:` prefix for desktop
- Safe-area utilities defined in `index.css`: `.pt-safe`, `.pb-safe`

### Video Elements
- Always `muted playsInline loop` for autoplay compliance
- Never use `autoPlay` prop — control via `.play()` based on `isActive` prop
- Pause + reset currentTime before navigation

---

## CSS Variables (index.css)

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

If Telegram SDK provides `themeParams`, these are overridden at runtime:
- `--twa-bg` ← `themeParams.bgColor`
- `--twa-surface` ← `themeParams.secondaryBgColor`
- `--twa-text` ← `themeParams.textColor`
- `--twa-hint` ← `themeParams.hintColor`
- `--twa-btn` ← `themeParams.buttonColor`
- `--twa-text-secondary` ← `themeParams.sectionHeaderTextColor`

---

## Common Tasks

### Adding a new page
1. Create `src/pages/NewPage.tsx`
2. Add to `main.tsx` navigation state
3. Pass navigation callback to page components
4. Add nav link in `Header.tsx` + `BottomNav.tsx` if needed

### Adding Telegram haptic to new interaction
```tsx
const { impact } = useHaptic();
const handleClick = () => {
  impact('light');
  // ... actual logic
};
```

---

## Telegram WebApp Compatibility

### What works:
- React 18 `createRoot` (without StrictMode)
- Batch loading for large lists
- Haptic feedback via `Telegram.WebApp.HapticFeedback`
- `tg.ready()`, `tg.expand()`, theme params
- Custom `useState` navigation

### What doesn't work:
- `react-router-dom` v6 (requires `useSyncExternalStore` from React 18, fails in older WebViews)
- React `StrictMode` (causes DOM resets in WebView)
- `autoPlay` on video elements (must control via `.play()` based on scroll position)

---

## External References

- **Figma:** `https://www.figma.com/design/HpUpUaTOzYO9qhdQded3mC/Test-front---Partial-file-saved-23.04.2026?node-id=48-667`
- **TWA SDK docs:** https://docs.telegram-mini-apps.com/
- **@tma.js/sdk-react:** https://github.com/Telegram-Mini-Apps/tma.js

---

## Known Issues / Decisions Log

1. **Virtualization removed** — `@tanstack/react-virtual` caused CSS overlay bugs. Batch loading (show 20, load more on scroll) works stably.
2. **Batch loading** — instead of virtualizing, we render first 20 cards and lazily load more. ~40-60 in DOM at any time.
3. **4 unique video URLs** — browser caches them, so 105 cards don't hammer network.
4. **`@tma.js/sdk-react` over `@telegram-apps/sdk-react`** — former is modern and maintained, latter is deprecated.
5. **No global state** — local state is sufficient for gallery filter + video playback.
6. **Theme params** — applied via `themeParams.mount()` + `themeParams.bgColor()` etc. CSS fallbacks ensure web version always works.
7. **StrictMode removed** — caused DOM resets in Telegram WebView, breaking the app entirely.
8. **react-router-dom removed** — v6 uses `useSyncExternalStore` which fails in Telegram WebView. v5 had type issues. Replaced with simple `useState` navigation.
9. **Scroll-based visibility** — manual calculation based on `scrollY` + `getBoundingClientRect` instead of IntersectionObserver (unreliable in WebView).
10. **Haptic via useHaptic hook** — `useHaptic()` returns `impact()` function, wraps all Telegram SDK calls in try/catch.
11. **Back button via useBackButton hook** — `useBackButton(onBack)` shows/hides Telegram back button and attaches handler.
12. **Max quality HLS** — configured hls.js to select highest quality level (`startLevel: -1`, then `currentLevel = levels.length - 1`).
13. **HlsVideo component** — reusable component for HLS playback in cards, detail page, and related. Auto-plays on load with max quality.
14. **Desktop masonry** — CSS columns with variable card heights creates Pinterest-style layout on desktop.
15. **Desktop fast scroll stops HLS** — rapid scroll on desktop cancels pending video loads. Low priority bug.