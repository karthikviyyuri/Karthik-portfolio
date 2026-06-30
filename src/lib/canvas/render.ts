export interface RenderPalette {
  particle: string;
  line: string;
  grid: string;
}

export function makePalette(scrollRatio: number): RenderPalette {
  const warm = Math.max(0, 1 - scrollRatio);
  const cool = Math.min(1, scrollRatio);
  const amberAlpha = 0.48 + warm * 0.22;
  const blueAlpha = 0.12 + cool * 0.18;

  return {
    particle: `rgba(${212 - cool * 42}, ${168 - cool * 18}, ${83 + cool * 70}, ${amberAlpha})`,
    line: `rgba(212, 168, 83, ${0.07 + warm * 0.06})`,
    grid: `rgba(139, 157, 195, ${blueAlpha})`
  };
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scrollRatio: number,
  palette: RenderPalette
): void {
  const spacing = 88;
  const offset = (scrollRatio * spacing * 2) % spacing;
  ctx.save();
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 0.5;

  for (let x = -spacing + offset; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + scrollRatio * 24, height);
    ctx.stroke();
  }

  for (let y = -spacing + offset; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + scrollRatio * 18);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  positions: Float32Array,
  sizes: Float32Array,
  count: number,
  palette: RenderPalette
): void {
  ctx.save();
  ctx.fillStyle = palette.particle;
  for (let i = 0; i < count; i += 1) {
    const idx = i * 2;
    ctx.beginPath();
    ctx.arc(positions[idx], positions[idx + 1], sizes[i], 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawConnections(
  ctx: CanvasRenderingContext2D,
  positions: Float32Array,
  count: number,
  threshold: number,
  palette: RenderPalette
): void {
  const thresholdSq = threshold * threshold;
  ctx.save();
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 0.7;

  for (let i = 0; i < count; i += 1) {
    const i2 = i * 2;
    const ix = positions[i2];
    const iy = positions[i2 + 1];

    for (let j = i + 1; j < count; j += 1) {
      const j2 = j * 2;
      const dx = ix - positions[j2];
      const dy = iy - positions[j2 + 1];
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < thresholdSq) {
        ctx.globalAlpha = 1 - distanceSq / thresholdSq;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(positions[j2], positions[j2 + 1]);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

