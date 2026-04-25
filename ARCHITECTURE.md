# TWA Gallery — Architecture Decisions

## Layout Strategy

### Desktop (≥768px) — Pinterest/Masonry
- CSS columns: `columns-2 md:columns-3 lg:columns-4 gap-3`
- Benefits: proper masonry for variable height cards
- No virtualization needed for reasonable card count

### Mobile/Telegram WebApp — Grid
- CSS Grid: `grid gap-3 style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}`
- Fixed row height for scroll calculation
- Virtualization-ready structure

---

## Video Loading Strategy

### Mobile/Telegram (scroll-based, parent-controlled)
```
CardGrid → tracks scroll position
         → calculates activeRange (visible rows ± buffer)
         → passes isActive={activeIds.has(card.id)} to CardItem
         → CardItem stops video immediately when isActive=false
```

**Scroll calculation:**
- `rowH = 240` (card height + gap)
- `firstRow = Math.max(0, Math.floor((scrollInGrid - viewH * 0.5) / rowH))`
- Buffer: 50% viewport above, ~6 rows below

**CardItem behavior:**
- `isActive=true` → load and play video (100ms debounce)
- `isActive=false` → `video.pause()`, `video.removeAttribute('src')`, `video.load()`, destroy HLS

### Desktop
- All visible cards `isActive=true` (no scroll-based loading needed)
- HLS quality: 360p for list (`startLevel: -1` → `firstLevel`)

---

## HLS Quality
- **List (CardItem):** 360p max — `startLevel: -1` then `hls.firstLevel`
- **Detail page (HlsVideo):** Max quality — `currentLevel = levels.length - 1`

---

## Key Files
- `src/components/Gallery/CardGrid.tsx` — layout switching + scroll tracking
- `src/components/Card/CardItem.tsx` — video loading/stopping via isActive prop
- `src/components/UI/HlsVideo.tsx` — max quality HLS for detail view
- `vite.config.ts` — `base: '/twa-gallery/'` for GitHub Pages subdirectory

---

## Constants
- `ROW_H = 240` — mobile grid row height (card + gap)
- `BATCH_SIZE = 20` — cards loaded per scroll
- `COLS = 2` — mobile columns, `COLS = 4` — desktop
- `viewH * 0.5` — top buffer (50% viewport)

---

## Known Issues
- Scroll calculation depends on accurate row height estimation
- Real card height may vary (includes text padding)
- Test on actual Telegram WebApp to verify behavior