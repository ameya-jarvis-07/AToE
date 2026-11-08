export function getInteriorAnchor(path: SVGPathElement, bounds: DOMRect): DOMPoint {
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
        ...outline.map((edge) => (edge.x - point.x) ** 2 + (edge.y - point.y) ** 2),
      );
      if (clearance > bestClearance) {
        bestPoint = point;
        bestClearance = clearance;
      }
    }
  }

  return bestPoint ?? path.getPointAtLength(length / 2);
}
