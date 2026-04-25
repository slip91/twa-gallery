import { memo, useRef, useEffect, useMemo } from 'react';
import Hls from 'hls.js';
import type { CardItem as CardItemType } from '../../types/gallery';

interface CardItemProps {
  card: CardItemType;
  isActive?: boolean;
  isDesktop?: boolean;
}

const DESKTOP_HEIGHTS = [260, 320, 280, 240, 300, 360] as const;
const MOBILE_HEIGHT = 180;
const HLS_CONFIG = {
  maxBufferLength: 5,
  maxMaxBufferLength: 10,
} as const;
const START_DEBOUNCE_MS = 50;

function getCardHeight(card: CardItemType, isDesktop: boolean): number {
  if (!isDesktop) return MOBILE_HEIGHT;
  const idx = parseInt(card.id.split('_')[1] ?? '0', 10);
  return DESKTOP_HEIGHTS[idx % DESKTOP_HEIGHTS.length];
}

function stopVideo(video: HTMLVideoElement, hlsRef: React.MutableRefObject<Hls | null>) {
  video.pause();
  video.removeAttribute('src');
  video.load();
  if (hlsRef.current) {
    hlsRef.current.destroy();
    hlsRef.current = null;
  }
}

export const CardItem = memo(function CardItem({ card, isActive = false, isDesktop = false }: CardItemProps) {
  const isVideo = card.type === 'video' && !!card.videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const cardHeight = useMemo(() => getCardHeight(card, isDesktop), [card, isDesktop]);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (!isActive) {
      stopVideo(video, hlsRef);
      return;
    }

    const timer = setTimeout(() => {
      if (!isActiveRef.current || !video) return;
      const url = card.videoUrl!;
      if (Hls.isSupported() && url.endsWith('.m3u8')) {
        if (!hlsRef.current) {
          const hls = new Hls(HLS_CONFIG);
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!isActiveRef.current || !video) return;
            hls.startLevel = hls.firstLevel;
            video.play().catch(() => {});
          });
        } else {
          video.play().catch(() => {});
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(() => {});
      }
    }, START_DEBOUNCE_MS);

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