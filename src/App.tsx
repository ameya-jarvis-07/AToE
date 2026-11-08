import { useEffect } from "react";
import Lenis from "lenis";
import AppRoutes from "./pages/AppRoutes";
import "./style.css";

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <AppRoutes />;
}

export default App;
