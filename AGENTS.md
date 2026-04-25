# AGENTS.md — TWA Gallery

## Project Overview

Video gallery app for Telegram WebApp (TWA) with 1000 test cards (only 4 unique video URLs, rest are duplicates for testing performance). Works both inside Telegram WebView and standalone browser.

**Primary goals:**
1. Smooth scroll with 1000 video cards
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
| Virtualization | `@tanstack/react-virtual` (mobile only) |
| Telegram SDK | `@tma.js/sdk-react` (modern, not deprecated `@telegram-apps/sdk-react`) |
| Testing | vitest + @testing-library/react + happy-dom |
| E2E | Playwright |

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

**Pages implemented:**
- `HomePage` — Gallery + Banner + BottomNav
- `ProfilePage` — User profile with back button

### State Management

No global state library. State is local to components:
- `Gallery.tsx` owns category filter state
- `CardItem.tsx` owns video visibility/playback state
- `TelegramProvider.tsx` owns SDK initialization state

### Telegram Integration Strategy

**Graceful degradation** — app works fully in browser without Telegram.

```
Components → useTelegram() → TelegramContext
                    ↓
            SDK available? → Yes: use real SDK
                     ↓ No: noop fallbacks
```

All SDK calls wrapped in `try/catch`. The `TelegramProvider`:
1. Catches `init()` errors (both sync and async)
2. Checks `miniApp.isSupported()` before mounting
3. Falls back to `isTelegram: false` if SDK unavailable
4. Sets `ready: true` even on failure so UI never blocks

**Theme integration:**
- Telegram `themeParams` are applied to CSS variables on init
- If no theme params (light/dark), defaults to `#0d0d0d` bg + `#1e1e1e` header
- CSS fallbacks in `:root` ensure web version always has colors

---

## Performance Architecture

### Problem Space
- 1000 cards, most are videos
- Mobile devices with limited GPU/decoders
- Smooth 60fps scroll required

### Solution Layers

#### 1. Mobile Virtualization (`@tanstack/react-virtual`)
- Only visible rows + `overscan: 10` are rendered
- ~50 DOM nodes instead of 1000
- `ROW_HEIGHT = 332` (2-column grid + gap)

#### 2. IntersectionObserver for Video Playback
```tsx
const observer = new IntersectionObserver(
  ([entry]) => {
    setIsVisible(entry.isIntersecting);
    if (entry.isIntersecting && !isFastScroll) {
      videoRef.current?.play().catch(() => {});
    }
  },
  { threshold: 0.1, rootMargin }
);
```

#### 3. Adaptive Preload by Scroll Velocity
| Scroll Speed | Preload | Behavior |
|-------------|---------|----------|
| `> 500px/s` | `none` | Show poster only, no network load |
| `<= 500px/s` | `auto` | Preload and autoplay when visible |

#### 4. Adaptive rootMargin
- Mobile: `500px` (smaller screens, less memory)
- Desktop: `800px` (larger viewport, more headroom)

#### 5. Content Visibility CSS
```css
content-visibility: auto;
contain-intrinsic-size: 0 300px;
```
Browser skips layout/paint for off-screen cards.

#### 6. Desktop: No Virtualization
4-column grid renders all cards. Virtualization caused CSS overlay/positioning bugs with aspect ratios. Desktop handles 1000 cards fine.

#### 7. Navigation Cleanup
All videos pause on `pagehide` event and in component cleanup:
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

Used on all interactive elements:
- Card clicks (`CardItem.tsx`)
- Navigation clicks (`Header.tsx`)

```tsx
const { haptic } = useTelegram();
haptic.impact('light');
```

### Back Button

File: `src/hooks/useBackButton.ts`

Used on `CardDetailPage`:
```tsx
const handleBack = useCallback(() => navigate(-1), [navigate]);
useBackButton(handleBack, true);
```

**API (v7+ SDK):**
- `backButton.show()` / `backButton.hide()`
- `backButton.onClick(callback)` / `backButton.offClick(callback)`
- `backButton.isSupported()` returns `Computed<boolean>` (callable signal)

---

## File Structure

```
src/
├── App.tsx                    # Router + Suspense + lazy pages
├── main.tsx                   # React root + TelegramProvider wrapper
├── index.css                  # Tailwind + CSS vars + TWA safe-area utilities
├── types/
│   └── gallery.ts             # CardItem type, Category union, CATEGORIES const
├── data/
│   ├── mock.ts                # 1000-card mock dataset (4 unique video URLs)
│   └── mock.test.ts           # Tests for mock data integrity
├── pages/
│   ├── HomePage.tsx           # Banner + Gallery + BottomNav
│   └── ProfilePage.tsx        # User profile with back button
├── components/
│   ├── Telegram/
│   │   └── TelegramProvider.tsx   # SDK init, context, haptic fallback
│   ├── Card/
│   │   ├── CardItem.tsx       # Video playback, IntersectionObserver
│   │   └── CardItem.test.tsx  # Card item tests
│   ├── Gallery/
│   │   ├── Gallery.tsx        # Category tabs + filtered grid
│   │   ├── CardGrid.tsx       # Virtualized mobile / Grid desktop
│   │   ├── GalleryTabs.tsx    # Horizontal scrollable tabs
│   │   └── GalleryTabs.test.tsx
│   └── UI/
│       ├── Header.tsx         # Nav, crystals, logo, profile
│       ├── BottomNav.tsx      # Mobile bottom navigation
│       └── BannerSlider.tsx   # Top banner carousel
├── hooks/
│   ├── useHaptic.ts           # Telegram haptic feedback
│   ├── useTelegramBackButton.ts # Telegram back button hook
│   └── ...
└── test/
    └── setup.ts               # vitest setup, happy-dom env
```

---

## Testing

### Unit Tests (vitest)

**Config:** `vite.config.ts` includes `test: { environment: 'happy-dom', setupFiles: './src/test/setup.ts' }`

**Current coverage:**
- `src/components/UI/BannerSlider.test.tsx`
- `src/components/Card/CardItem.test.tsx`
- `src/components/Gallery/GalleryTabs.test.tsx`
- `src/hooks/useMediaQuery.test.ts`
- `src/data/mock.test.ts`

**Total:** 19 tests, all passing.

**Run:**
```bash
npm test        # watch mode
npm test --run  # single run
```

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
- Never use `autoPlay` prop — control via IntersectionObserver + `play()`
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
const { haptic } = useTelegram();
const handleClick = () => {
  haptic.impact('light');
  // ... actual logic
};
```

### Adjusting virtualization
- Change `ROW_HEIGHT` in `CardGrid.tsx` if card height changes
- Change `overscan` value for more/less buffer rows
- `gap` in virtualizer must match Tailwind gap class

---

## Telegram WebApp Compatibility

### What works:
- React 18 `createRoot` (without StrictMode)
- `@tanstack/react-virtual` for virtualization
- Haptic feedback via `Telegram.WebApp.HapticFeedback`
- `tg.ready()`, `tg.expand()`, theme params
- Custom `useState` navigation

### What doesn't work:
- `react-router-dom` v6 (requires `useSyncExternalStore` from React 18, fails in older WebViews)
- React `StrictMode` (causes DOM resets in WebView)
- `autoPlay` on video elements (must control via IntersectionObserver)

---

## External References

- **Figma:** `https://www.figma.com/design/HpUpUaTOzYO9qhdQded3mC/Test-front---Partial-file-saved-23.04.2026?node-id=48-667`
- **TWA SDK docs:** https://docs.telegram-mini-apps.com/
- **@tma.js/sdk-react:** https://github.com/Telegram-Mini-Apps/tma.js

---

## Known Issues / Decisions Log

1. **Desktop virtualization disabled** — caused CSS overlay bugs with aspect-ratio cards. 4-column grid handles 1000 cards fine on desktop.
2. **`@tanstack/react-virtual` restored** — initially removed due to WebView issues, but works fine. ROW_HEIGHT adjusted to 220px.
3. **4 unique video URLs** — browser caches them, so 1000 cards don't hammer network.
4. **`@tma.js/sdk-react` over `@telegram-apps/sdk-react`** — former is modern and maintained, latter is deprecated.
5. **No global state** — local state is sufficient for gallery filter + video playback.
6. **Theme params** — applied via `themeParams.mount()` + `themeParams.bgColor()` etc. CSS fallbacks ensure web version always works.
7. **StrictMode removed** — caused DOM resets in Telegram WebView, breaking the app entirely.
8. **react-router-dom removed** — v6 uses `useSyncExternalStore` which fails in Telegram WebView. v5 had type issues. Replaced with simple `useState` navigation.
9. **createRoot confirmed working** — React 18 `createRoot` works fine in Telegram WebView when StrictMode is removed.
10. **Haptic feedback works** — `Telegram.WebApp.HapticFeedback.impactOccurred()` works on interactive elements.
13. **Max quality HLS** — configured hls.js to select highest quality level (`startLevel: -1`, then `currentLevel = levels.length - 1`).
14. **HlsVideo component** — reusable component for HLS playback in cards, detail page, and related. Auto-plays on load with max quality.
15. **Desktop fast scroll stops HLS** — rapid scroll on desktop cancels pending video loads. Low priority bug.
