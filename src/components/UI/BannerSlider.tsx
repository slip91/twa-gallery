import { memo } from 'react';
import { BANNER_SLIDES } from '../../data/mock';

export const BannerSlider = memo(function BannerSlider() {
  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {BANNER_SLIDES.map((slide) => (
          <div key={slide.id} className="relative rounded-2xl overflow-hidden h-44 md:h-52 lg:h-40">
            <img src={slide.poster} alt={slide.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-xs md:text-sm font-semibold leading-snug">{slide.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});