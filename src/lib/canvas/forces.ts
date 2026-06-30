export interface CursorState {
  active: boolean;
  x: number;
  y: number;
}

export function applyCursorRepel(
  px: number,
  py: number,
  vx: number,
  vy: number,
  cursor: CursorState,
  radius: number,
  force: number
): [number, number] {
  if (!cursor.active) {
    return [vx, vy];
  }

  const dx = px - cursor.x;
  const dy = py - cursor.y;
  const distanceSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distanceSq > radiusSq || distanceSq === 0) {
    return [vx, vy];
  }

  const distance = Math.sqrt(distanceSq);
  const strength = (1 - distance / radius) * force;
  return [vx + (dx / distance) * strength, vy + (dy / distance) * strength];
}

export function clampVelocity(vx: number, vy: number, maxSpeed: number): [number, number] {
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed <= maxSpeed || speed === 0) {
    return [vx, vy];
  }

  const scale = maxSpeed / speed;
  return [vx * scale, vy * scale];
}

