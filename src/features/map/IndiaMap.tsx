import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { cafes, states, type StateRecord } from "../../data/seed";
import { loadMapFeatures, type MapPath } from "../../lib/map";
import { loadDistricts, type DistrictMapFeature } from "../../lib/districts";
import { MAP_COLORS } from "../../constants/map";
import type { MapTransitionPhase } from "../../types";
import { getInteriorAnchor } from "../../utils/mapUtils";

function colorFor(state: StateRecord) {
  return MAP_COLORS[
    states.findIndex((candidate) => candidate.id === state.id) %
      MAP_COLORS.length
  ];
}
function IndiaMap() {
  const [features, setFeatures] = useState<MapPath[]>([]),
    [mapError, setMapError] = useState(""),
    [hovered, setHovered] = useState<string | null>(null),
    [active, setActive] = useState<string | null>(null),
    [revealingStateId, setRevealingStateId] = useState<string | null>(null),
    [transitionPhase, setTransitionPhase] =
      useState<MapTransitionPhase>("idle"),
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
                            fill={MAP_COLORS[index % MAP_COLORS.length]}
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
export { IndiaMap };
