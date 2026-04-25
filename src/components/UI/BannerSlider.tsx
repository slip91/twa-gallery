import { memo, useState, useRef, useEffect } from 'react';
import { BANNER_SLIDES } from '../../data/mock';

export const BannerSlider = memo(function BannerSlider() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const idx = Math.round(el.scrollLeft / (el.offsetWidth - 16));
        setActive(idx);
      });
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="px-4 py-3">
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none">
        {BANNER_SLIDES.map((slide) => (
          <div key={slide.id} className="flex-shrink-0 w-[calc(100%-32px)] snap-start relative rounded-2xl overflow-hidden h-44 md:h-52 lg:h-40">
            <img src={slide.poster} alt={slide.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1">
              <p className="text-white text-sm font-semibold leading-snug max-w-[70%] whitespace-pre-line">{slide.title}</p>
              {slide.subtitle && (
                <p className="text-white/70 text-xs font-medium leading-snug max-w-[70%] whitespace-pre-line">{slide.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {BANNER_SLIDES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
});