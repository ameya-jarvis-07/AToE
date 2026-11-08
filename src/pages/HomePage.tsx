import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Header, Footer } from "../components/layout/SiteChrome";
import { useTitle } from "../hooks/useTitle";
import { IndiaMap } from "../features/map/IndiaMap";
export default function HomePage() {
  useTitle(
    "A field guide to India's hospitality culture",
    "Discover thoughtful hospitalities across India, one state at a time.",
  );
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-kicker">
            <span>INDIA / HOSPITALITY CULTURE / FIELD NOTES</span>
            <span>EST. 2025 — ALWAYS IN PROGRESS</span>
          </div>
          <h1>
            SOME PLACES
            <br />
            JUST HIT <em>DIFFERENT.</em>
          </h1>
          <div className="hero-bottom">
            <p>
              A field guide to
              <br />
              India's hospitality culture.
            </p>
            <a href="#map" className="scroll-link">
              SCROLL TO EXPLORE <ArrowDownRight size={18} />
            </a>
            <span className="hero-index">01—36 / STATES & TERRITORIES</span>
          </div>
          <div className="hero-sun" aria-hidden="true">
            <img src="/foottoe.png" alt="" />
          </div>
        </section>
        <div id="map">
          <IndiaMap />
        </div>
        <section className="statement">
          <span className="tiny-label">A NOTE ON HOW WE WORK</span>
          <p>
            Good places deserve
            <br />
            <em>good telling.</em>
          </p>
          <Link to="/about" className="text-link">
            READ OUR APPROACH <ArrowUpRight size={15} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

