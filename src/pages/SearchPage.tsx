import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { cafes, states } from "../data/seed";
import type { CityRecord } from "../types";
import { CafeCard } from "../components/cards/CafeCard";
import { Footer, Header } from "../components/layout/SiteChrome";
import { useTitle } from "../hooks/useTitle";
import { useCityDirectory } from "../hooks/useCityDirectory";
export default function SearchPage() {
  const [q, setQ] = useState(
    new URLSearchParams(useLocation().search).get("q") ?? "",
  );
  const { cities: cityData, error: cityDataError } = useCityDirectory();
  const term = q.trim().toLowerCase();
  const locationResults = Array.from(
    new Map(
      cityData
        .filter((city) => !term || city.majorCity.toLowerCase().includes(term))
        .map((city: CityRecord) => [
          `${city.stateId}-${city.majorCity}`,
          {
            city: city.majorCity,
            state: states.find((item) => item.id === city.stateId),
          },
        ]),
    ).values(),
  );
  const found = cafes.filter(
    (c) =>
      c.published &&
      `${c.city ?? ""} ${c.name} ${c.description}`
        .toLowerCase()
        .includes(term),
  );
  useTitle("Search", "Search ATOE by city or state.");
  return (
    <>
      <Header />
      <main className="inner-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> BACK TO EXPLORE
        </Link>
        <section className="search-page">
          <span className="tiny-label">THE FIELD GUIDE / SEARCH</span>
          <h1>
            Find a place<span>.</span>
          </h1>
          <label className="search-field large">
            <Search />
            <input
              autoFocus
              placeholder="Search a city or state..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <p className="results-count">
            {cityDataError
              ? cityDataError
              : q
              ? `${locationResults.length} city results - ${found.length} published ${found.length === 1 ? "hospitality" : "hospitalities"}`
              : "Search cities and states to find hospitalities."
            }
          </p>
          {q && (
            <>
              {locationResults.length > 0 && (
                <div className="location-results">
                  {locationResults.slice(0, 24).map(({ city, state }) =>
                    state ? (
                      <Link key={`${state.id}-${city}`} to={`/india/${state.slug}`}>
                        <span>{city}</span>
                        <span>{state.name}</span>
                        <ArrowRight size={14} />
                      </Link>
                    ) : null,
                  )}
                </div>
              )}
              {found.length > 0 && (
                <div className="cafe-grid">
                  {found.map((c, i) => (
                    <CafeCard key={c.id} cafe={c} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
