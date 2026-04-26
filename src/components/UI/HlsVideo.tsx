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

const HLS_CONFIG = {
  maxBufferLength: 6,
  maxMaxBufferLength: 10,
  startLevel: -1,
} as const;

// Same retry pattern as CardItem — if play() is rejected by autoplay policy,
// wait for the next user gesture and retry.
function playWithRetry(video: HTMLVideoElement) {
  video.play().catch(() => {
    const retry = () => { video.play().catch(() => {}); };
    document.addEventListener('touchstart', retry, { once: true, passive: true });
    document.addEventListener('click', retry, { once: true });
  });
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      const hls = new Hls(HLS_CONFIG);
      hls.loadSource(src);
      hls.attachMedia(video);

      if (autoPlay) {
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          playWithRetry(video);
        });
      }

      return () => hls.destroy();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // autoplay=true before src so the browser handles playback itself
      // (muted + playsInline + autoplay = allowed without user gesture on iOS)
      video.autoplay = autoPlay;
      video.src = src;
      video.load();
      if (autoPlay) playWithRetry(video);
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
