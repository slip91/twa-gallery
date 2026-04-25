import { memo, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import type { CardItem as CardItemType } from '../../types/gallery';

interface CardItemProps {
  card: CardItemType;
  isActive?: boolean;
}

export const CardItem = memo(function CardItem({ card, isActive = false }: CardItemProps) {
  const isVideo = card.type === 'video' && card.videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const cardHeight = 180;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (!isActive) {
      video.pause();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      const url = card.videoUrl!;
      if (Hls.isSupported() && url.endsWith('.m3u8')) {
        if (hlsRef.current) return;
        const hls = new Hls({
          maxBufferLength: 5,
          maxMaxBufferLength: 10,
          startLevel: -1,
        });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls.startLevel = hls.firstLevel;
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(() => {});
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isActive, isVideo, card.videoUrl]);

  return (
    <article className="flex flex-col cursor-pointer rounded-2xl overflow-hidden bg-[var(--twa-surface)] active:opacity-80 transition-opacity">
      <div className="w-full relative flex-shrink-0" style={{ height: cardHeight }}>
        {isVideo ? (
          <video ref={videoRef} muted playsInline loop preload="none" className="w-full h-full object-cover block" />
        ) : (
          <img src={card.poster} alt={card.title} loading="lazy" className="w-full h-full object-cover block" />
        )}
        {card.isHot && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[var(--twa-hot)] rounded-md px-1.5 py-0.5">
            <span className="text-[10px]">🔥</span>
            <span className="text-white text-[10px] font-bold">HOT</span>
          </div>
        )}
      </div>
      <div className="p-3 flex-shrink-0">
        <p className="text-white text-sm font-semibold truncate">{card.title}</p>
        <p className="text-[var(--twa-hint)] text-xs truncate mt-0.5">{card.description}</p>
      </div>
    </article>
  );
});