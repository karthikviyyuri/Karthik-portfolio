export interface UfoPoint {
  x: number;
  y: number;
}

export interface UfoPosition extends UfoPoint {
  angle: number;
}

export function getScrollProgress(): number {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return clamp(window.scrollY / scrollable, 0, 1);
}

export function buildUfoPath(width: number, height: number, sectionCount: number): UfoPoint[] {
  const mobile = width < 768;
  const railX = mobile ? 22 : 34;
  const top = mobile ? 0.16 : 0.15;
  const bottom = mobile ? 0.9 : 0.88;
  const count = Math.max(5, sectionCount + 1 || 5);
  const points: UfoPoint[] = [];

  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0 : index / (count - 1);
    points.push({
      x: railX,
      y: height * (top + (bottom - top) * ratio)
    });
  }
  return points;
}

export function pathToD(points: UfoPoint[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

export function positionAtProgress(points: UfoPoint[], progress: number): UfoPosition {
  if (points.length < 2) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0 };
  }

  const segments = points.slice(1).map((point, index) => {
    const previous = points[index];
    const length = Math.hypot(point.x - previous.x, point.y - previous.y);
    return { from: previous, to: point, length };
  });
  const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0) || 1;
  let target = clamp(progress, 0, 1) * totalLength;

  for (const segment of segments) {
    if (target <= segment.length) {
      const ratio = segment.length === 0 ? 0 : target / segment.length;
      const x = lerp(segment.from.x, segment.to.x, ratio);
      const y = lerp(segment.from.y, segment.to.y, ratio);
      const angle = Math.atan2(segment.to.y - segment.from.y, segment.to.x - segment.from.x) * 180 / Math.PI;
      return { x, y, angle };
    }
    target -= segment.length;
  }

  const last = segments[segments.length - 1];
  return {
    x: last.to.x,
    y: last.to.y,
    angle: Math.atan2(last.to.y - last.from.y, last.to.x - last.from.x) * 180 / Math.PI
  };
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
