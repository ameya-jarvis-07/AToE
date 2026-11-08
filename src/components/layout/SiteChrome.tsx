import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";

export function Header() {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", close);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("menu-open");
    };
  }, [menu]);

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="ATOE home" onClick={() => setMenu(false)}>
        <img src="/ate-logo.png" alt="ATOE — Asthitva's Title of Existence" />
      </Link>
      <button
        className="menu-toggle"
        aria-label={menu ? "Close navigation" : "Open navigation"}
        aria-expanded={menu}
        onClick={() => setMenu(!menu)}
      >
        {menu ? "CLOSE" : "MENU"}
      </button>
      <button
        className={`nav-backdrop${menu ? " visible" : ""}`}
        aria-label="Close navigation"
        onClick={() => setMenu(false)}
      />
      <nav className={menu ? "nav open" : "nav"} aria-label="Primary navigation">
        <NavLink to="/" onClick={() => setMenu(false)}>Explore</NavLink>
        <Link to="/about" onClick={() => setMenu(false)}>About</Link>
        <Link to="/search" className="nav-search" onClick={() => setMenu(false)}>
          <Search size={16} /> Search
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="footer-mark" aria-label="ATOE home">
        <img src="/ate-logo.png" alt="ATOE — Asthitva's Title of Existence" />
      </Link>
      <span>A field guide to India's hospitality culture.</span>
      <span>Made for finding your place.</span>
    </footer>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 420);
      const footer = document.querySelector(".footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const bottom = Math.max(24, window.innerHeight - footerTop + 16);
      if (buttonRef.current) buttonRef.current.style.bottom = `${bottom}px`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`back-to-top${visible ? " visible" : ""}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      BACK TO TOP <ArrowUpRight size={14} />
    </button>
  );
}
