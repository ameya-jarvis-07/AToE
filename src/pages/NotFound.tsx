import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Footer, Header } from "../components/layout/SiteChrome";
import { useTitle } from "../hooks/useTitle";
export default function NotFound({ kind }: { kind: string }) {
  useTitle("Not found", `This ${kind} could not be found.`);
  return (
    <>
      <Header />
      <main className="not-found">
        <span className="tiny-label">404 / NOT IN THE FIELD NOTES</span>
        <h1>
          We haven't
          <br />
          found that place<span>.</span>
        </h1>
        <p>Try another state or hospitality from the guide.</p>
        <Link to="/" className="text-link">
          RETURN TO THE MAP <ArrowRight size={15} />
        </Link>
      </main>
      <Footer />
    </>
  );
}

