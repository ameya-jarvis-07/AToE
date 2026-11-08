import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { cafes, states } from "../data/seed";
import citiesByDistrict from "../data/cities-by-district.json";
import { CafeCard } from "../components/cards/CafeCard";
import { Footer, Header } from "../components/layout/SiteChrome";
import { useTitle } from "../hooks/useTitle";
import { normalizeCityName } from "../utils/formatters";
import NotFound from "./NotFound";
import { useCityDirectory } from "../hooks/useCityDirectory";
export default function StatePage() {
  const { stateSlug = "" } = useParams();
  const state = states.find((s) => s.slug === stateSlug);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeCity = searchParams.get("city") ?? "";
  const routeDistrict = searchParams.get("district") ?? "";
  const routeDistrictName = searchParams.get("districtName") ?? "";
  const [citySearch, setCitySearch] = useState(routeCity),
    [sort, setSort] = useState("featured");
  const { cities: cityData, error: cityDataError } = useCityDirectory();
  useEffect(() => setCitySearch(routeCity), [routeCity]);
  useTitle(
    state?.name ?? "State not found",
    state?.description ?? "This state could not be found.",
  );
  if (!state) return <NotFound kind="state" />;
  const all = cafes.filter((c) => c.stateId === state.id && c.published);
  const stateCities = Array.from(
    new Map(
      cityData
        .filter((city) => city.stateId === state.id)
        .map((city) => [city.majorCity, city]),
    ).values(),
  ).sort((a, b) => a.majorCity.localeCompare(b.majorCity));
  const districtCityIds = routeDistrict
    ? new Set(
        (citiesByDistrict as Record<string, string[]>)[routeDistrict] ?? [],
      )
    : null;
  const districtCityNames = districtCityIds
    ? new Set(
        cityData
          .filter((city) => districtCityIds.has(city.id))
          .map((city) => normalizeCityName(city.majorCity)),
      )
    : null;
  const shown = all
    .filter(
      (c) => {
        if (
          districtCityNames &&
          (!c.city || !districtCityNames.has(normalizeCityName(c.city)))
        ) {
          return false;
        }
        if (!citySearch) return true;
        if (!c.city) return false;
        const cafeCity = normalizeCityName(c.city);
        const requestedCity = normalizeCityName(citySearch);
        const cityWasSelected =
          routeCity && requestedCity === normalizeCityName(routeCity);
        return cityWasSelected
          ? cafeCity === requestedCity
          : cafeCity.includes(requestedCity);
      },
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : Number(Boolean(b.pick)) - Number(Boolean(a.pick)),
    );
  return (
    <>
      <Header />
      <main className="inner-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> BACK TO THE MAP
        </Link>
        <section className="state-hero">
          <span className="tiny-label">
            A FIELD GUIDE TO INDIA / {state.regionCode}
          </span>
          <h1>
            {state.name}
            <span>.</span>
          </h1>
          <p>{state.description}</p>
          <div className="state-stat">
            <strong>
              {(routeDistrict || citySearch ? shown.length : all.length)
                .toString()
                .padStart(2, "0")}
            </strong>
            <span>
              {routeDistrict
                ? `PUBLISHED IN ${routeDistrictName.toUpperCase()}`
                : citySearch
                ? `PUBLISHED IN ${citySearch.toUpperCase()}`
                : "PUBLISHED HOSPITALITIES"}
            </span>
          </div>
        </section>
        <section className="listing">
          {cityDataError ? <p className="empty-state">{cityDataError}</p> : null}
          <div className="listing-head">
            <div>
              <span className="tiny-label">
                {routeDistrict
                  ? `THE DIRECTORY / ${routeDistrictName || "DISTRICT"}`
                  : citySearch
                    ? `THE DIRECTORY / ${citySearch}`
                    : "THE DIRECTORY"}
              </span>
              <h2>
                Find your <em>kind of place.</em>
              </h2>
            </div>
            <div className="filters">
              <label className="search-field">
                <Search size={16} />
                <input
                  aria-label="Search by city"
                  placeholder="Search by city"
                  list="state-city-options"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />
              </label>
              <datalist id="state-city-options">
                {stateCities.map((city) => (
                  <option key={city.id} value={city.majorCity} />
                ))}
              </datalist>
              <select
                aria-label="Sort hospitalities"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured first</option>
                <option value="name">Name A—Z</option>
              </select>
            </div>
          </div>
          {shown.length ? (
            <div className="cafe-grid">
              {shown.map((c, i) => (
                <CafeCard key={c.id} cafe={c} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-star">✳</span>
              <h3>
                {routeDistrict
                  ? `No hospitalities found in ${routeDistrictName || "this district"}.`
                  : citySearch
                  ? "No hospitalities found in that city."
                  : "The story here is still unfolding."}
              </h3>
              <p>
                {routeDistrict
                  ? "We only publish places after the story and details are ready."
                  : citySearch
                  ? "Try another city or clear the search."
                  : "We only publish places after the story and details are ready."}
              </p>
              <Link to="/" className="text-link">
                BACK TO ALL STATES <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
