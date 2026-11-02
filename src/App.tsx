import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { cafes, states, type Cafe, type StateRecord } from "./data/seed";
import cityData from "./data/cities.json";
import citiesByDistrict from "./data/cities-by-district.json";
import { loadMapFeatures, type MapPath } from "./lib/map";
import { loadDistricts, type DistrictMapFeature } from "./lib/districts";
import "./style.css";

type CityRecord = {
  id: string;
  stateId: string;
  name: string;
  slug: string;
  majorCity: string;
};

function normalizeCityName(name: string) {
  return name.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
}

function getInteriorAnchor(path: SVGPathElement, bounds: DOMRect) {
  const center = new DOMPoint(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  if (path.isPointInFill(center)) return center;

  const length = path.getTotalLength();
  const outline = Array.from({ length: 128 }, (_, index) =>
    path.getPointAtLength((length * index) / 128),
  );
  let bestPoint: DOMPoint | null = null;
  let bestClearance = -1;
  const steps = 48;

  for (let row = 1; row < steps; row += 1) {
    for (let column = 1; column < steps; column += 1) {
      const point = new DOMPoint(
        bounds.x + (bounds.width * column) / steps,
        bounds.y + (bounds.height * row) / steps,
      );
      if (!path.isPointInFill(point)) continue;
      const clearance = Math.min(
        ...outline.map(
          (edge) => (edge.x - point.x) ** 2 + (edge.y - point.y) ** 2,
        ),
      );
      if (clearance > bestClearance) {
        bestPoint = point;
        bestClearance = clearance;
      }
    }
  }

  return bestPoint ?? path.getPointAtLength(length / 2);
}

function useTitle(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — ATOE`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
}
function Header() {
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
      <Link
        to="/"
        className="brand"
        aria-label="ATOE home"
        onClick={() => setMenu(false)}
      >
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
      <nav
        className={menu ? "nav open" : "nav"}
        aria-label="Primary navigation"
      >
        <NavLink to="/" onClick={() => setMenu(false)}>
          Explore
        </NavLink>
        <Link to="/about" onClick={() => setMenu(false)}>
          About
        </Link>
        <Link
          to="/search"
          className="nav-search"
          onClick={() => setMenu(false)}
        >
          <Search size={16} /> Search
        </Link>
      </nav>
    </header>
  );
}
function Footer() {
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
function BackToTop() {
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
function CafeCard({ cafe, index = 0 }: { cafe: Cafe; index?: number }) {
  return (
    <motion.article
      className="cafe-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={`/cafe/${cafe.slug}`}
        className="cafe-image"
        aria-label={`Read about ${cafe.name}`}
      >
        <span className="image-stamp">ATOE / FIELD NOTE</span>
        <span className="image-number">0{index + 1}</span>
        <ArrowUpRight size={20} />
      </Link>
      <div className="card-meta">
        <span>{cafe.city ?? "Location to be confirmed"}</span>
        {cafe.pick && (
          <span>{cafe.pick === "sv" ? "SV'S PICK" : "EDITOR'S PICK"}</span>
        )}
      </div>
      <h3>
        <Link to={`/cafe/${cafe.slug}`}>{cafe.name}</Link>
      </h3>
      <p>{cafe.description}</p>
      <div className="tags">
        {cafe.ambienceTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </motion.article>
  );
}
function IndiaMap() {
  const [features, setFeatures] = useState<MapPath[]>([]),
    [mapError, setMapError] = useState(""),
    [hovered, setHovered] = useState<string | null>(null),
    [active, setActive] = useState<string | null>(null),
    [revealingStateId, setRevealingStateId] = useState<string | null>(null),
    [transitionPhase, setTransitionPhase] = useState<
      "idle" | "clearing" | "zooming" | "returning" | "revealing"
    >("idle"),
    [activeViewBox, setActiveViewBox] = useState<string | null>(null),
    [mapZoomOrigin, setMapZoomOrigin] = useState("50% 50%"),
    [stateTransitionOrigin, setStateTransitionOrigin] = useState("50% 50%"),
    [mapZoomScale, setMapZoomScale] = useState(2.4),
    [districts, setDistricts] = useState<DistrictMapFeature[]>([]),
    [districtError, setDistrictError] = useState(""),
    [pendingStateId, setPendingStateId] = useState<string | null>(null),
    [previewSide, setPreviewSide] = useState<"left" | "right">("right"),
    [query, setQuery] = useState(""),
    [touch, setTouch] = useState(false);
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);
  const mapSvgRef = useRef<SVGSVGElement | null>(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  useEffect(() => {
    loadMapFeatures()
      .then(setFeatures)
      .catch((e) =>
        setMapError(
          e instanceof Error
            ? e.message
            : "Map boundaries could not be loaded.",
        ),
      );
  }, []);
  useEffect(() => {
    if (!active || districts.length) return;
    let cancelled = false;
    let transitionTimer: number | undefined;
    loadDistricts(active)
      .then((items) => {
        if (!cancelled) {
          transitionTimer = window.setTimeout(() => {
            setDistricts(items);
          }, reduced ? 0 : 800);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDistrictError(
            error instanceof Error
              ? error.message
              : "District boundaries could not be loaded.",
          );
        }
      });
    return () => {
      cancelled = true;
      if (transitionTimer !== undefined) {
        window.clearTimeout(transitionTimer);
      }
    };
  }, [active, districts.length, reduced]);
  useEffect(() => {
    if (!active || transitionPhase !== "clearing") return;
    const timer = window.setTimeout(
      () => setTransitionPhase("zooming"),
      reduced ? 0 : 300,
    );
    return () => window.clearTimeout(timer);
  }, [active, reduced, transitionPhase]);
  useEffect(() => {
    if (active || transitionPhase !== "revealing") return;
    const timer = window.setTimeout(
      () => {
        setTransitionPhase("idle");
        setRevealingStateId(null);
      },
      reduced ? 0 : 450,
    );
    return () => window.clearTimeout(timer);
  }, [active, reduced, transitionPhase]);
  const filtered = states.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const current = states.find((s) => s.id === (active ?? hovered));
  const cards = current
    ? cafes
        .filter((c) => c.stateId === current.id && c.published && c.pick)
        .slice(0, 3)
    : [];
  const count = current
    ? cafes.filter((c) => c.stateId === current.id && c.published).length
    : 0;
  const activeFeature = active
    ? features.find((feature) => feature.id === active)
    : null;
  const resetMap = () => {
    setHovered(null);
    if (active && transitionPhase === "zooming") {
      setTransitionPhase("returning");
      return;
    }
    setActive(null);
    setRevealingStateId(null);
    setTransitionPhase("idle");
    setActiveViewBox(null);
  };
  const activateDistrict = (district: DistrictMapFeature) => {
    if (!current) return;
    navigate(
      `/india/${current.slug}?district=${encodeURIComponent(district.id)}&districtName=${encodeURIComponent(district.name)}`,
    );
  };
  const activate = (s: StateRecord, path: SVGPathElement) => {
    const box = path.getBBox();
    const anchor = getInteriorAnchor(path, box);
    const viewBox = path.ownerSVGElement?.viewBox.baseVal;
    const canvas = mapCanvasRef.current;
    const mapSvg = path.ownerSVGElement;
    const mapRect = mapSvg?.getBoundingClientRect();
    const canvasRect = canvas?.getBoundingClientRect();
    const cropWidth = box.width * 1.16;
    const cropHeight = box.height * 1.16;
    if (viewBox?.width && viewBox.height && mapRect && canvasRect) {
      setMapZoomOrigin(
        `${((anchor.x - viewBox.x) / viewBox.width) * 100}% ${((anchor.y - viewBox.y) / viewBox.height) * 100}%`,
      );
      const sourceScale = Math.min(
        mapRect.width / viewBox.width,
        mapRect.height / viewBox.height,
      );
      const targetHeight = Math.max(
        360,
        Math.min(window.innerHeight * 0.68, 680),
      );
      const targetScale = Math.min(
        canvasRect.width / cropWidth,
        targetHeight / cropHeight,
      );
      setMapZoomScale(Math.max(1, targetScale / sourceScale));
      const matrix = path.getScreenCTM();
      if (matrix) {
        const screenAnchor = new DOMPoint(anchor.x, anchor.y).matrixTransform(
          matrix,
        );
        setStateTransitionOrigin(
          `${((screenAnchor.x - canvasRect.left) / canvasRect.width) * 100}% ${((screenAnchor.y - canvasRect.top) / canvasRect.height) * 100}%`,
        );
      }
    }
    setPreviewSide(
      anchor.x > 500 ? "left" : "right",
    );
    if (active !== s.id) {
      setActive(s.id);
      setTransitionPhase("clearing");
      setDistricts([]);
      setDistrictError("");
      setActiveViewBox(
        `${box.x - box.width * 0.08} ${box.y - box.height * 0.08} ${
          box.width * 1.16
        } ${box.height * 1.16}`,
      );
      return;
    }
  };
  useEffect(() => {
    if (!pendingStateId || active) return;
    const state = states.find((item) => item.id === pendingStateId);
    const path = mapSvgRef.current?.querySelector<SVGPathElement>(
      `[data-state-id="${pendingStateId}"]`,
    );
    if (!state || !path) return;
    setPendingStateId(null);
    activate(state, path);
  }, [active, features, pendingStateId]);
  return (
    <section className="map-section">
      <div className="map-instruction">
        <span className="tiny-label">
          THE WHOLE COUNTRY, ONE PLACE AT A TIME
        </span>
        <h2>
          SELECT A STATE.
          <br />
          <em>FIND YOUR PLACE.</em>
        </h2>
      </div>
      <div className="map-controls">
        <label htmlFor="state-search">
          <Search size={16} />
          <input
            id="state-search"
            placeholder="Find a state or union territory"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {query && (
          <div className="state-results">
            {filtered.slice(0, 6).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  const path = mapSvgRef.current?.querySelector<SVGPathElement>(
                    `[data-state-id="${s.id}"]`,
                  );
                  if (path) {
                    activate(s, path);
                    setHovered(null);
                    setQuery("");
                    return;
                  }
                  setPendingStateId(s.id);
                  if (active) resetMap();
                  setHovered(null);
                  setQuery("");
                }}
              >
                {s.name}
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="map-layout">
        <div
          ref={mapCanvasRef}
          className={`map-canvas${active ? " state-map-open" : ""}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) resetMap();
          }}
          onPointerLeave={() => setHovered(null)}
          onPointerEnter={(e) => {
            if (e.pointerType === "touch") setTouch(true);
          }}
        >
          <AnimatePresence
            mode="sync"
            initial={false}
            onExitComplete={() => {
              if (transitionPhase !== "returning") return;
              setRevealingStateId(active);
              setActive(null);
              setActiveViewBox(null);
              setTransitionPhase("revealing");
            }}
          >
          {active && activeFeature && transitionPhase === "zooming" ? (
            <motion.div
              key={`state-${active}`}
              className="state-map-view"
              initial={reduced ? false : { scale: 1 / mapZoomScale }}
              animate={{ scale: 1, opacity: 1 }}
              exit={
                reduced
                  ? undefined
                  : { scale: 1 / mapZoomScale, opacity: 1 }
              }
              transition={{
                duration: reduced ? 0 : 0.8,
                ease: [0.65, 0, 0.35, 1],
              }}
              onAnimationComplete={() => {
                if (mapCanvasRef.current?.classList.contains("state-map-open")) {
                  mapCanvasRef.current.scrollIntoView({
                    block: "start",
                    behavior: "smooth",
                  });
                }
              }}
              style={{ transformOrigin: stateTransitionOrigin }}
              onClick={(event) => {
                if (event.target === event.currentTarget) resetMap();
              }}
            >
              <div className="state-map-heading">
                <button
                  className="map-reset"
                  onClick={resetMap}
                >
                  <ArrowLeft size={14} /> ALL STATES
                </button>
                <span className="tiny-label">
                  {current?.name.toUpperCase()} / SELECT A DISTRICT
                </span>
              </div>
              <svg
                viewBox={
                  districts.length
                    ? "0 0 1000 800"
                    : activeViewBox ?? "0 0 1000 1000"
                }
                role={districts.length ? "group" : "img"}
                aria-label={`${current?.name} map`}
              >
                <motion.path
                  d={activeFeature.d}
                  fill={current ? colorFor(current) : "var(--blue)"}
                  animate={{ opacity: districts.length ? 0 : 1 }}
                  transition={{ duration: reduced ? 0 : 0.35 }}
                />
                {districts.length ? (
                  <motion.g
                    className="district-map-regions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : 0.45 }}
                  >
                    {districts.map((district, index) => {
                      return (
                        <g key={district.id}>
                          <motion.path
                            d={district.d}
                            className="district-region"
                            fill={[
                              "#2549ff",
                              "#075e38",
                              "#f45112",
                              "#c84c34",
                              "#e4b839",
                              "#39806b",
                              "#708be7",
                              "#4b2d78",
                            ][index % 8]}
                            tabIndex={0}
                            role="button"
                            aria-label={`${district.name} district`}
                            onClick={() => activateDistrict(district)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                activateDistrict(district);
                              }
                            }}
                            initial={false}
                          >
                            <title>{district.name}</title>
                          </motion.path>
                          <text
                            className="district-map-label"
                            x={district.labelX}
                            y={district.labelY}
                            aria-hidden="true"
                          >
                            {district.name}
                          </text>
                        </g>
                      );
                    })}
                  </motion.g>
                ) : (
                  <>
                    {districtError ? (
                      <text className="district-map-loading" x="500" y="500">
                        {districtError}
                      </text>
                    ) : null}
                  </>
                )}
              </svg>
              <p className="map-source district-source-credit">
                District boundaries: geoBoundaries India ADM2 · ODbL 1.0.
                City directory: India Local Government Directory · Government
                Open Data License – India.
              </p>
            </motion.div>
          ) : active && transitionPhase === "returning" ? null : features.length ? (
            <motion.svg
              key="india"
              viewBox="0 0 1000 1000"
              role="group"
              aria-label="Interactive map of India"
              ref={mapSvgRef}
              initial={
                reduced
                  ? false
                  : { scale: mapZoomScale }
              }
              animate={{ scale: 1 }}
              exit={reduced ? undefined : { scale: mapZoomScale }}
              transition={{
                duration: reduced ? 0 : 0.8,
                ease: [0.65, 0, 0.35, 1],
              }}
              style={{ transformOrigin: mapZoomOrigin }}
            >
              {features.map(({ d, id, name }) => {
                const state = states.find((s) => s.id === id);
                if (!state) return null;
                const selected =
                  (active ??
                    (transitionPhase === "revealing"
                      ? revealingStateId
                      : null) ??
                    hovered) === state.id;
                return (
                  <motion.path
                    key={state.id}
                    d={d}
                    data-state-id={state.id}
                    className={`map-region ${selected ? "selected" : ""}`}
                    fill={colorFor(state)}
                    initial={
                      !reduced &&
                      transitionPhase === "revealing" &&
                      !selected
                        ? { opacity: 0 }
                        : false
                    }
                    tabIndex={active && !selected ? -1 : 0}
                    role="button"
                    aria-label={`${name}, ${cafes.filter((c) => c.stateId === state.id && c.published).length} published hospitalities`}
                    onPointerEnter={() => {
                      if (!touch) setHovered(state.id);
                    }}
                    onFocus={() => setHovered(state.id)}
                    onBlur={() => setHovered(null)}
                    onClick={(e) => activate(state, e.currentTarget)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activate(state, e.currentTarget);
                      }
                      if (e.key === "Escape") {
                        resetMap();
                      }
                    }}
                    animate={{
                      scale:
                        selected &&
                        !active &&
                        transitionPhase === "idle" &&
                        !reduced
                          ? 1.025
                          : 1,
                      opacity: active && !selected ? 0 : 1,
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.35,
                      delay:
                        transitionPhase === "revealing" && !selected ? 0.08 : 0,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      pointerEvents: active && !selected ? "none" : "auto",
                    }}
                  />
                );
              })}
            </motion.svg>
          ) : (
            <div className={`map-missing${mapError ? " has-error" : ""}`}>
              <div className="map-skeleton" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <strong>
                {mapError ? "MAP SVG NOT INSTALLED" : "LOADING THE MAP"}
              </strong>
              <p>
                {mapError ||
                  "Loading independently selectable state boundaries."}
              </p>
              <Link to="/about">
                How the map works <ArrowRight size={15} />
              </Link>
            </div>
          )}
          </AnimatePresence>
        </div>
        <aside className="map-side-note">
          <p>
            Every state has a story.
            <br />
            We're adding them carefully.
          </p>
          <span className="map-count">
            28 STATES
            <br />
            08 UNION TERRITORIES
          </span>
          <p className="map-source">
            India state boundaries: public/in.svg · SimpleMaps attribution in asset
          </p>
        </aside>
      </div>
      {current && !active && (
        <motion.section
          className={`state-preview side-${previewSide}`}
          aria-live="polite"
          aria-labelledby="selected-state-title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="preview-header">
            <span className="tiny-label">SELECTED STATE</span>
            <button
              className="preview-close"
              aria-label="Clear selected state"
              onClick={() => {
                setActive(null);
                setHovered(null);
              }}
            >
              Clear
            </button>
          </div>
          <h3 id="selected-state-title">{current.name}</h3>
          <p className="preview-count">
            {count} published {count === 1 ? "hospitality" : "hospitalities"}
          </p>
          <p className="preview-description">{current.description}</p>
          {cards.length > 0 ? (
            <ul>
              {cards.map((c) => (
                <li key={c.id}>
                  <Link to={`/cafe/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="preview-empty">
              The next good thing here is still being found.
            </p>
          )}
          <Link className="preview-link" to={`/india/${current.slug}`}>
            EXPLORE {current.name}
          </Link>
        </motion.section>
      )}
    </section>
  );
}
function colorFor(s: StateRecord) {
  const colors = [
    "#2549FF",
    "#075E38",
    "#F45112",
    "#c84c34",
    "#e4b839",
    "#39806b",
    "#708be7",
    "#4b2d78",
  ];
  return colors[states.findIndex((x) => x.id === s.id) % colors.length];
}
function Home() {
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
            <img src="/ate-hero.png" alt="" />
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
function StatePage() {
  const { stateSlug = "" } = useParams();
  const state = states.find((s) => s.slug === stateSlug);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeCity = searchParams.get("city") ?? "";
  const routeDistrict = searchParams.get("district") ?? "";
  const routeDistrictName = searchParams.get("districtName") ?? "";
  const [citySearch, setCitySearch] = useState(routeCity),
    [sort, setSort] = useState("featured");
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
function CafePage() {
  const { cafeSlug = "" } = useParams();
  const cafe = cafes.find((c) => c.slug === cafeSlug && c.published);
  const state = states.find((s) => s.id === cafe?.stateId);
  useTitle(
    cafe?.name ?? "Hospitality not found",
    cafe?.description ?? "This hospitality could not be found.",
  );
  if (!cafe) return <NotFound kind="hospitality" />;
  return (
    <>
      <Header />
      <main className="inner-page cafe-page">
        <Link to={`/india/${state?.slug}`} className="back-link">
          <ArrowLeft size={16} /> BACK TO {state?.name.toUpperCase()}
        </Link>
        <section className="cafe-detail">
          <div className="detail-image">
            <span>FIELD NOTE / {state?.regionCode}</span>
            <span className="detail-glyph">✳</span>
          </div>
          <div className="detail-copy">
            <span className="tiny-label">
              {state?.name.toUpperCase()} · CAFÉ PROFILE
            </span>
            <h1>
              {cafe.name}
              <span>.</span>
            </h1>
            <span className="detail-city">
              {cafe.city ?? "Location awaiting verification"}
            </span>
            <p>{cafe.description}</p>
            <div className="tags">
              {cafe.ambienceTags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="detail-rule" />
            <p className="source-note">
              Editorial profile from the supplied collection. Location and
              business details will be added when verified.
            </p>
            <Link to={`/india/${state?.slug}`} className="text-link">
              MORE FROM {state?.name.toUpperCase()} <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
function SearchPage() {
  const [q, setQ] = useState(
    new URLSearchParams(useLocation().search).get("q") ?? "",
  );
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
            {q
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
function About() {
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
function NotFound({ kind }: { kind: string }) {
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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/india/:stateSlug" element={<StatePage />} />
        <Route path="/cafe/:cafeSlug" element={<CafePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound kind="page" />} />
      </Routes>
      <BackToTop />
    </>
  );
}
export default App;
