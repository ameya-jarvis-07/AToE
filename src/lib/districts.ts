export type DistrictMapFeature = {
  id: string;
  name: string;
  d: string;
  labelX: number;
  labelY: number;
};

type DistrictGeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    id: string;
    properties: { name: string };
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][][] | number[][][];
    };
  }>;
};

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 800;
const MAP_PADDING = 42;

export async function loadDistricts(stateId: string): Promise<DistrictMapFeature[]> {
  const response = await fetch(`/states/districts/${stateId}.geojson`);
  if (!response.ok) {
    throw new Error("District boundaries could not be loaded for this state.");
  }

  const collection = (await response.json()) as DistrictGeoJSON;
  if (!collection.features.length) return [];
  const points = collection.features.flatMap((feature) =>
    getRings(feature.geometry).flatMap((ring) => ring),
  );
  const latitudeScale = Math.cos(
    (points.reduce((total, point) => total + point[1], 0) / points.length) *
      (Math.PI / 180),
  );
  const projected = points.map(([longitude, latitude]) => [
    longitude * latitudeScale,
    -latitude,
  ]);
  const minX = Math.min(...projected.map(([x]) => x));
  const maxX = Math.max(...projected.map(([x]) => x));
  const minY = Math.min(...projected.map(([, y]) => y));
  const maxY = Math.max(...projected.map(([, y]) => y));
  const scale = Math.min(
    (VIEW_WIDTH - MAP_PADDING * 2) / Math.max(maxX - minX, 0.0001),
    (VIEW_HEIGHT - MAP_PADDING * 2) / Math.max(maxY - minY, 0.0001),
  );
  const mapWidth = (maxX - minX) * scale;
  const mapHeight = (maxY - minY) * scale;
  const offsetX = (VIEW_WIDTH - mapWidth) / 2;
  const offsetY = (VIEW_HEIGHT - mapHeight) / 2;
  const project = ([longitude, latitude]: number[]) => [
    offsetX + (longitude * latitudeScale - minX) * scale,
    offsetY + (-latitude - minY) * scale,
  ];

  return collection.features.map((feature) => {
    const rings = getRings(feature.geometry);
    const projectedRings = rings.map((ring) => ring.map(project));
    const path = projectedRings
      .map((ring) => {
        const [first, ...rest] = ring;
        if (!first) return "";
        return `M${first[0].toFixed(2)},${first[1].toFixed(2)}${rest
          .map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`)
          .join("")}Z`;
      })
      .join("");
    const outerPoints = projectedRings[0] ?? [];
    const labelX =
      outerPoints.reduce((total, [x]) => total + x, 0) / outerPoints.length;
    const labelY =
      outerPoints.reduce((total, [, y]) => total + y, 0) / outerPoints.length;

    return { id: feature.id, name: feature.properties.name, d: path, labelX, labelY };
  });
}

function getRings(geometry: DistrictGeoJSON["features"][number]["geometry"]) {
  if (geometry.type === "Polygon") {
    return geometry.coordinates as number[][][];
  }
  return (geometry.coordinates as number[][][][]).flat();
}

