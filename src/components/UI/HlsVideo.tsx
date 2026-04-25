import { memo, useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface HlsVideoProps {
  src: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HlsVideo = memo(function HlsVideo({
  src,
  muted = true,
  loop = true,
  autoPlay = true,
  className,
  onClick,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Prefer HLS
    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      const hls = new Hls({
        maxBufferLength: 6,
        maxMaxBufferLength: 10,
        startLevel: -1,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      
      if (autoPlay) {
        hls.on(Hls.Events.MANIFEST_PARSED, (_, details) => {
          // Max quality
          hls.currentLevel = details.levels.length - 1;
          video.play().catch(() => {});
        });
      }

      return () => hls.destroy();
    } 
    // Safari native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      if (autoPlay) {
        video.addEventListener('loadeddata', () => {
          video.play().catch(() => {});
        });
      }
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      muted={muted}
      playsInline
      loop={loop}
      className={className}
      onClick={onClick}
    />
  );
});