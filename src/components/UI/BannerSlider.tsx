import { useState, useEffect, useCallback, useRef } from 'react';
import { BANNER_SLIDES } from '../../data/mock';

const AUTO_SCROLL_MS = 3500;

export function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const total = BANNER_SLIDES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, AUTO_SCROLL_MS);
  }, [total]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    startTimer(); // reset auto-scroll on manual navigation
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  return (
    <div className="py-3 px-4">
      {/* Slide track */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {BANNER_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 flex relative h-[112px] bg-[var(--twa-surface)] cursor-pointer active:opacity-80 transition-opacity"
            >
              <div className="flex-1 flex flex-col justify-center px-4 py-3 gap-1 z-10">
                <p className="text-white text-[12px] font-semibold leading-snug line-clamp-3">
                  {slide.title}
                </p>
                {slide.subtitle && (
                  <p className="text-white/50 text-[11px] leading-snug line-clamp-2">
                    {slide.subtitle}
                  </p>
                )}
              </div>
              <div className="w-[45%] relative flex-shrink-0">
                <img
                  src={slide.poster}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--twa-surface)] to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
