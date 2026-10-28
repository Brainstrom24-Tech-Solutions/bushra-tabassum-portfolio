import { useCallback, useEffect, useRef, useState } from "react";

export default function HeroVideo({ poster, alt }: { poster: string; alt: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false);
  const visible = useRef(false);
  const wantsPlay = useRef(false);
  const playbackRequest = useRef(0);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  const syncPlayback = useCallback(() => {
    const media = video.current;
    if (!media) return;
    const request = ++playbackRequest.current;
    if (!wantsPlay.current || !visible.current || document.hidden) {
      media.pause();
      return;
    }

    media.muted = true;
    void media.play().catch((error: unknown) => {
      // Pausing, leaving the viewport or unmounting can interrupt a pending play.
      if (!mounted.current || request !== playbackRequest.current) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      wantsPlay.current = false;
    });
  }, []);

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    mounted.current = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      wantsPlay.current = !motion.matches;
      syncPlayback();
    };

    const bounds = media.getBoundingClientRect();
    visible.current = bounds.bottom > 0 && bounds.top < window.innerHeight &&
      bounds.right > 0 && bounds.left < window.innerWidth;
    updateMotion();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", syncPlayback);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(media);

    return () => {
      mounted.current = false;
      ++playbackRequest.current;
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", syncPlayback);
      observer.disconnect();
      media.pause();
    };
  }, [syncPlayback]);

  return (
    <>
      <img className="hero-video-poster" src={poster} alt={alt} width={2399} height={1425} fetchPriority="high" />
      <video
        ref={video}
        className={`hero-video-viewport${started && !failed ? " is-playing" : ""}`}
        src="/videos/maharaja-walkthrough.mp4"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          if (wantsPlay.current && visible.current && !document.hidden) {
            setStarted(true);
          } else {
            video.current?.pause();
          }
        }}
        onError={() => {
          wantsPlay.current = false;
          ++playbackRequest.current;
          video.current?.pause();
          setFailed(true);
        }}
      />
    </>
  );
}
