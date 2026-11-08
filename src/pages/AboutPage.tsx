import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer, Header } from "../components/layout/SiteChrome";
import { useTitle } from "../hooks/useTitle";
export default function AboutPage() {
  useTitle(
    "About ATOE",
    "How ATOE documents hospitalities and verifies place information.",
  );
  return (
    <>
      <Header />
      <main className="inner-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> BACK TO EXPLORE
        </Link>
        <section className="about-page">
          <span className="tiny-label">A FIELD GUIDE WITH CARE</span>
          <h1>
            Good places deserve
            <br />
            <em>good telling.</em>
          </h1>
          <div className="about-columns">
            <p>
              ATOE — Asthitva's Title of Existence — is an editorial field guide
              to India's hospitality culture. The map makes place the beginning of the
              story.
            </p>
            <p>
              We publish only the places we can describe honestly. Missing
              hours, addresses, prices, photos, and contact details stay out
              until verified. Café records are maintained directly in the
              frontend so this edition remains transparent and easy to review.
            </p>
          </div>
          <div className="about-source">
            <span>MAP SOURCE</span>
            <p>
              India states use the selectable SVG map. State drilldowns use
              transparent district geometry from geoBoundaries, with source
              and license notes alongside the generated boundary assets.
            </p>
            <span>CONTENT MODE</span>
            <p>
              Frontend catalogue — published hospitality records are typed in the
              application source. No database or remote content service is
              required.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

