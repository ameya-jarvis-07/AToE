import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollFrameHeroProps = {
  framePath: string;
  frameCount: number;
  children: ReactNode;
  className?: string;
};

const MAX_CONCURRENT_LOADS = 6;

function frameUrl(framePath: string, index: number) {
  return framePath.replace("{index}", String(index + 1).padStart(3, "0"));
}

export function ScrollFrameHero({
  framePath,
  frameCount,
  children,
  className = "",
}: ScrollFrameHeroProps) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas || frameCount < 1) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const frames: Array<HTMLImageElement | undefined> = [];
    let currentFrame = 0;
    let animationFrame = 0;
    let cancelled = false;

    const drawFrame = (frameIndex: number) => {
      const frame = frames[frameIndex];
      if (!frame?.naturalWidth || !canvas.clientWidth || !canvas.clientHeight) {
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.max(
        width / frame.naturalWidth,
        height / frame.naturalHeight,
      );
      const drawWidth = frame.naturalWidth * scale;
      const drawHeight = frame.naturalHeight * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(
        frame,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    };

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawFrame(currentFrame);
    };

    const updateFrame = () => {
      animationFrame = 0;
      const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - scene.offsetTop) / travel),
      );
      const nextFrame = Math.floor(progress * (frameCount - 1));
      if (nextFrame !== currentFrame && frames[nextFrame]?.complete) {
        currentFrame = nextFrame;
        drawFrame(currentFrame);
      }
    };

    const requestFrame = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateFrame);
      }
    };

    const loadFrame = (index: number) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const frame = new Image();
        frame.decoding = "async";
        frame.onload = () => resolve(frame);
        frame.onerror = () => {
          console.error(`Hero frame ${index + 1} could not load: ${frame.src}`);
          resolve(null);
        };
        frame.src = frameUrl(framePath, index);
        frames[index] = frame;
      });

    const preloadFrames = async () => {
      let nextIndex = 0;
      let loadedCount = 0;

      const worker = async () => {
        while (!cancelled) {
          const index = nextIndex++;
          if (index >= frameCount) return;
          if (await loadFrame(index)) loadedCount += 1;
          if (index === 0 && !cancelled) {
            resizeCanvas();
            drawFrame(0);
          }
        }
      };

      await Promise.all(
        Array.from(
          { length: Math.min(MAX_CONCURRENT_LOADS, frameCount) },
          worker,
        ),
      );
      if (!cancelled) {
        setFramesReady(loadedCount === frameCount);
        requestFrame();
      }
    };

    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    void preloadFrames();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      frames.forEach((frame) => {
        if (frame) frame.src = "";
      });
    };
  }, [frameCount, framePath]);

  return (
    <section ref={sceneRef} className={`scroll-frame-scene ${className}`}>
      <div className="scroll-frame-sticky">
        <canvas
          ref={canvasRef}
          className="scroll-frame-canvas"
          aria-hidden="true"
        />
        <div className="scroll-frame-overlay" aria-hidden="true" />
        {children}
        {!framesReady && (
          <span className="scroll-frame-loading">LOADING STORY</span>
        )}
      </div>
    </section>
  );
}
