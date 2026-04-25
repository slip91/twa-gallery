import { memo } from 'react';
import { BANNER_SLIDES } from '../../data/mock';

export const BannerSlider = memo(function BannerSlider() {
  return (
    <div className="py-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
        {BANNER_SLIDES.map((slide, i) => (
          <div key={slide.id} className={`${i >= 2 ? 'hidden md:flex' : 'flex'} relative rounded-2xl overflow-hidden h-[100px] md:h-[112px] bg-[var(--twa-surface)] cursor-pointer active:opacity-80 transition-opacity`}>
            <div className="flex-1 flex flex-col justify-center px-3 py-2 gap-1 z-10">
              <p className="text-white text-[11px] font-semibold leading-snug line-clamp-3">{slide.title}</p>
              {slide.subtitle && (
                <p className="text-white/50 text-[10px] leading-snug line-clamp-2">{slide.subtitle}</p>
              )}
            </div>
            <div className="w-[42%] relative flex-shrink-0">
              <img src={slide.poster} alt="" loading={i < 2 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--twa-surface)] to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});