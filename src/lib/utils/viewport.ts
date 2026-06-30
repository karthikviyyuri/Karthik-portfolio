export function isSmallViewport(width = window.innerWidth): boolean {
  return width < 768;
}

export function clampRatio(value: number): number {
  return Math.min(1, Math.max(0, value));
}

