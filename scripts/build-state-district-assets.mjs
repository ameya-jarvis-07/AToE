import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const states = (await readFile(path.join(root, "src/data/seed.ts"), "utf8"));
const entries = [...states.matchAll(/\[\s*"(IN-[A-Z]{2})",\s*"([^"]+)"/gm)].map((match) => ({
  id: match[1],
  name: match[2],
}));
const [districtsResponse, statesResponse] = await Promise.all([
  fetch("https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM2/geoBoundaries-IND-ADM2_simplified.geojson"),
  fetch("https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM1/geoBoundaries-IND-ADM1_simplified.geojson"),
]);
if (!districtsResponse.ok || !statesResponse.ok) {
  throw new Error("Could not download geoBoundaries India district/state boundaries.");
}
const [districtData, stateData] = await Promise.all([
  districtsResponse.json(),
  statesResponse.json(),
]);

function allPoints(value, result = []) {
  if (!Array.isArray(value)) return result;
  if (typeof value[0] === "number") result.push(value);
  else for (const child of value) allPoints(child, result);
  return result;
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInGeometry(point, geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(([outer, ...holes]) =>
    pointInRing(point, outer) && !holes.some((hole) => pointInRing(point, hole)),
  );
}

function roundCoordinates(value) {
  if (typeof value === "number") return Number(value.toFixed(5));
  return Array.isArray(value) ? value.map(roundCoordinates) : value;
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function canonicalDistrictName(value, stateId) {
  const key = normalize(value);
  const aliases = {
    ahmadnagar: "Ahmednagar",
    bid: "Beed",
    buldana: "Buldhana",
    gondiya: "Gondia",
    mumbai: "Mumbai City",
    raigarh: "Raigad",
  };
  if (stateId === "IN-MH" && aliases[key]) return aliases[key];
  return value;
}

const stateFeatures = new Map(
  stateData.features.map((feature) => [feature.properties.shapeISO, feature]),
);
const manualOwners = new Map([
  ["Dadra & Nagar Haveli", "IN-DN"],
  ["Daman", "IN-DN"],
  ["Diu", "IN-DN"],
  ["South Andaman", "IN-AN"],
  ["Nicobars", "IN-AN"],
  ["Lakshadweep", "IN-LD"],
  ["Nandurbar", "IN-MH"],
]);
const perState = new Map(entries.map(({ id }) => [id, []]));
const unmatchedDistricts = [];
for (const district of districtData.features) {
  const points = allPoints(district.geometry.coordinates);
  const centroid = points.reduce(
    ([x, y], [longitude, latitude]) => [x + longitude, y + latitude],
    [0, 0],
  ).map((sum) => sum / points.length);
  let owner = manualOwners.get(district.properties.shapeName) ?? [...stateFeatures.entries()].find(([, feature]) =>
    pointInGeometry(centroid, feature.geometry),
  )?.[0];
  if (!owner) {
    let best = { iso: "", score: 0 };
    for (const [iso, feature] of stateFeatures) {
      const sample = points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 80)) === 0);
      const score = sample.filter((point) => pointInGeometry(point, feature.geometry)).length / sample.length;
      if (score > best.score) best = { iso, score };
    }
    if (best.score >= 0.6) owner = best.iso;
  }
  if (!owner || !perState.has(owner)) {
    unmatchedDistricts.push(district.properties.shapeName);
    continue;
  }
  perState.get(owner).push({
    type: "Feature",
    id: `${owner}-${normalize(district.properties.shapeName)}`,
    properties: {
      name: canonicalDistrictName(district.properties.shapeName, owner),
      sourceName: district.properties.shapeName,
      sourceId: district.properties.shapeID,
    },
    geometry: {
      type: district.geometry.type,
      coordinates: roundCoordinates(district.geometry.coordinates),
    },
  });
}

const cities = JSON.parse(await readFile(path.join(root, "src/data/cities.json"), "utf8"));
const csvResponse = await fetch("https://raw.githubusercontent.com/planemad/india-local-government-directory/main/municipal-directory.csv");
if (!csvResponse.ok) throw new Error("Could not download Local Government Directory municipal records.");
const csv = await csvResponse.text();
function parseCsv(input) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        value += '"';
        i++;
      } else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else value += char;
  }
  if (value || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}
const rows = parseCsv(csv);
const headers = rows[0].map((header) => header.replace(/^\uFEFF/, ""));
const index = Object.fromEntries(headers.map((header, i) => [header, i]));
const localBodies = new Map();
for (const row of rows.slice(1)) {
  const stateName = row[index["State Name"]]?.trim();
  const name = row[index["Localbody Name"]]?.trim();
  const district = row[index["District Name"]]?.trim();
  if (!stateName || !name || !district) continue;
  const state = entries.find((entry) => normalize(entry.name) === normalize(stateName));
  if (!state) continue;
  const key = `${state.id}:${normalize(name)}`;
  if (!localBodies.has(key)) localBodies.set(key, new Set());
  localBodies.get(key).add(normalize(district));
}
const stateByDistrict = new Map();
for (const [stateId, features] of perState) {
  for (const feature of features) {
    stateByDistrict.set(
      `${stateId}:${normalize(canonicalDistrictName(feature.properties.name, stateId))}`,
      feature.id,
    );
  }
}
const cityMatches = new Map();
const unmatchedCities = [];
for (const city of cities) {
  const districts = localBodies.get(`${city.stateId}:${normalize(city.name)}`);
  const uniqueDistrict = districts?.size === 1 ? [...districts][0] : null;
  const districtId = uniqueDistrict
    ? stateByDistrict.get(
        `${city.stateId}:${normalize(canonicalDistrictName(uniqueDistrict, city.stateId))}`,
      )
    : null;
  if (!districtId) {
    unmatchedCities.push(city.id);
    continue;
  }
  if (!cityMatches.has(districtId)) cityMatches.set(districtId, []);
  cityMatches.get(districtId).push(city.id);
}
const cityStateById = new Map(cities.map((city) => [city.id, city.stateId]));

const outputDirectory = path.join(root, "public/states/districts");
await mkdir(outputDirectory, { recursive: true });
const summaries = [];
for (const state of entries) {
  const features = perState.get(state.id).sort((a, b) => a.properties.name.localeCompare(b.properties.name));
  const collection = {
    type: "FeatureCollection",
    name: `${state.name} districts`,
    source: "geoBoundaries, gbOpen India ADM2, 2021 boundary vintage",
    sourceUrl: "https://www.geoboundaries.org/",
    license: "Open Data Commons Open Database License 1.0 (ODbL)",
    attribution: "geoBoundaries (Pathways Data Pvt. Ltd. / LG Directory), ODbL 1.0",
    features,
  };
  await writeFile(path.join(outputDirectory, `${state.id}.geojson`), `${JSON.stringify(collection)}\n`);
  summaries.push({ stateId: state.id, districtCount: features.length });
}
await writeFile(path.join(root, "src/data/cities-by-district.json"), `${JSON.stringify(Object.fromEntries(cityMatches))}\n`);
console.log(JSON.stringify({
  states: entries.length,
  districts: summaries.reduce((sum, item) => sum + item.districtCount, 0),
  perState: summaries,
  unmatchedDistricts,
  cityRecords: cities.length,
  mappedCities: cities.length - unmatchedCities.length,
  unmatchedCities: unmatchedCities.length,
  cityDistrictCoverage: Object.fromEntries(
    entries.map(({ id }) => [
      id,
      {
        cityRecords: cities.filter((city) => city.stateId === id).length,
        matched: [...cityMatches.values()]
          .flat()
          .filter((cityId) => cityStateById.get(cityId) === id).length,
      },
    ]),
  ),
}, null, 2));
