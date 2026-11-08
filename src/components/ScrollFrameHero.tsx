import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollFrameHeroProps = {
  videoPath: string;
  fallbackVideoPath?: string;
  posterPath?: string;
  children: ReactNode;
  className?: string;
};

const SCROLL_STORY_DURATION_SECONDS = 3;
const MIN_SEEK_DELTA_SECONDS = 1 / 30;

function mediaType(path: string) {
  if (/\.webm(?:$|[?#])/i.test(path)) return "video/webm";
  if (/\.ogg(?:$|[?#])/i.test(path)) return "video/ogg";
  return "video/mp4";
}

export function ScrollFrameHero({
  videoPath,
  fallbackVideoPath,
  posterPath,
  children,
  className = "",
}: ScrollFrameHeroProps) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!scene || !canvas || !video) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    let cancelled = false;
    let seekPending = false;
    let targetTime = 0;
    let lastRequestedTime = -1;

    const drawSource = (source: HTMLVideoElement | HTMLImageElement) => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      const sourceWidth =
        source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
      const sourceHeight =
        source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
      if (!sourceWidth || !sourceHeight) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(
        source,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    };

    const drawFrame = () => {
      if (video.videoWidth) drawSource(video);
    };

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawFrame();
    };

    const seekToTarget = () => {
      animationFrame = 0;
      if (
        cancelled ||
        seekPending ||
        video.readyState < HTMLMediaElement.HAVE_METADATA
      ) {
        return;
      }
      if (Math.abs(targetTime - lastRequestedTime) < MIN_SEEK_DELTA_SECONDS) {
        return;
      }
      seekPending = true;
      lastRequestedTime = targetTime;
      video.currentTime = targetTime;
    };

    const updateTargetFromScroll = () => {
      const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - scene.offsetTop) / travel),
      );
      targetTime =
        progress * Math.min(SCROLL_STORY_DURATION_SECONDS, video.duration || 3);
      if (!seekPending) {
        if (!animationFrame) {
          animationFrame = window.requestAnimationFrame(seekToTarget);
        }
      }
    };

    const requestFrame = () => {
      updateTargetFromScroll();
    };

    const handleMetadata = () => {
      if (!cancelled) {
        setFramesReady(true);
        video.pause();
        resizeCanvas();
        updateTargetFromScroll();
        requestFrame();
      }
    };
    const handleSeeked = () => {
      seekPending = false;
      drawFrame();
      if (Math.abs(targetTime - lastRequestedTime) >= MIN_SEEK_DELTA_SECONDS) {
        requestFrame();
      }
    };
    const handleError = () => {
      if (!cancelled) {
        console.error(`Scroll story video could not load: ${videoPath}`);
      }
    };
    const poster = posterPath ? new Image() : null;
    if (poster && posterPath) {
      poster.onload = () => {
        if (!cancelled && !video.videoWidth) {
          resizeCanvas();
          drawSource(poster);
        }
      };
      poster.src = posterPath;
    }

    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);
    resizeCanvas();
    video.load();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", resizeCanvas);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [fallbackVideoPath, posterPath, videoPath]);

  return (
    <section ref={sceneRef} className={`scroll-frame-scene ${className}`}>
      <div className="scroll-frame-sticky">
        <canvas
          ref={canvasRef}
          className="scroll-frame-canvas"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={posterPath}
          aria-hidden="true"
          className="scroll-frame-video-source"
        >
          <source src={videoPath} type={mediaType(videoPath)} />
          {fallbackVideoPath ? (
            <source
              src={fallbackVideoPath}
              type={mediaType(fallbackVideoPath)}
            />
          ) : null}
        </video>
        <div className="scroll-frame-overlay" aria-hidden="true" />
        {children}
        {!framesReady && (
          <span className="scroll-frame-loading">LOADING STORY</span>
        )}
      </div>
    </section>
  );
}
