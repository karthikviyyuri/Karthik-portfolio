import { constellations } from "../../components/canvas/constellations";
import { applyCursorRepel, clampVelocity, type CursorState } from "./forces";
import { drawConnections, drawGrid, drawParticles, makePalette } from "./render";

const MOBILE_BREAKPOINT = 768;

export class ParticleEngine {
  private readonly connectionDistance = 120;
  private readonly cursorRepelRadius = 80;
  private readonly cursorRepelForce = 0.28;
  private readonly friction = 0.95;
  private readonly maxSpeed = 0.4;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame = 0;
  private dpr = 1;
  private height = 0;
  private isRunning = false;
  private lastFrame = 0;
  private nextConstellationAt = 0;
  private particleCount = 80;
  private scrollRatio = 0;
  private width = 0;

  private readonly cursor: CursorState = { active: false, x: 0, y: 0 };
  private positions = new Float32Array(160);
  private velocities = new Float32Array(160);
  private sizes = new Float32Array(80);
  private targets = new Float32Array(160);
  private targetStrength = 0;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      throw new Error("Particle canvas context could not be created.");
    }
    this.ctx = ctx;
    this.resize();
    this.seed();
    this.bind();
  }

  public attach(canvas: HTMLCanvasElement): void {
    if (canvas === this.canvas) {
      return;
    }

    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      throw new Error("Particle canvas context could not be created.");
    }
    this.ctx = ctx;
    this.resize();
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.lastFrame = performance.now();
    this.animationFrame = window.requestAnimationFrame(this.tick);
  }

  public stop(): void {
    this.isRunning = false;
    window.cancelAnimationFrame(this.animationFrame);
  }

  private bind(): void {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("scroll", this.updateScroll, { passive: true });
    window.addEventListener("mousemove", this.updateCursor, { passive: true });
    window.addEventListener("mouseleave", this.clearCursor, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  private readonly clearCursor = (): void => {
    this.cursor.active = false;
  };

  private readonly handleVisibility = (): void => {
    if (document.visibilityState === "hidden") {
      this.stop();
      return;
    }
    this.start();
  };

  private readonly resize = (): void => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const nextCount = this.width < MOBILE_BREAKPOINT ? 44 : 80;
    if (nextCount !== this.particleCount) {
      this.particleCount = nextCount;
      this.seed();
    }
  };

  private readonly updateCursor = (event: MouseEvent): void => {
    this.cursor.active = true;
    this.cursor.x = event.clientX;
    this.cursor.y = event.clientY;
  };

  private readonly updateScroll = (): void => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.scrollRatio = Math.min(1, Math.max(0, window.scrollY / scrollable));
  };

  private seed(): void {
    const arraySize = this.particleCount * 2;
    this.positions = new Float32Array(arraySize);
    this.velocities = new Float32Array(arraySize);
    this.targets = new Float32Array(arraySize);
    this.sizes = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i += 1) {
      const idx = i * 2;
      this.positions[idx] = Math.random() * this.width;
      this.positions[idx + 1] = Math.random() * this.height;
      this.velocities[idx] = (Math.random() - 0.5) * this.maxSpeed;
      this.velocities[idx + 1] = (Math.random() - 0.5) * this.maxSpeed;
      this.sizes[i] = 1 + Math.random() * 1.5;
      this.targets[idx] = this.positions[idx];
      this.targets[idx + 1] = this.positions[idx + 1];
    }
  }

  private activateConstellation(now: number): void {
    const constellation = constellations[Math.floor(Math.random() * constellations.length)];

    for (let i = 0; i < this.particleCount; i += 1) {
      const idx = i * 2;
      const point = constellation.points[i % constellation.points.length];
      const jitterX = (Math.random() - 0.5) * 80;
      const jitterY = (Math.random() - 0.5) * 60;
      this.targets[idx] = point[0] * this.width + jitterX;
      this.targets[idx + 1] = point[1] * this.height + jitterY;
    }

    this.targetStrength = 0.018;
    this.nextConstellationAt = now + 8000 + Math.random() * 4000;
  }

  private update(now: number, delta: number): void {
    if (now > this.nextConstellationAt) {
      this.activateConstellation(now);
    }

    this.targetStrength *= 0.992;

    for (let i = 0; i < this.particleCount; i += 1) {
      const idx = i * 2;
      let vx = this.velocities[idx] + (Math.random() - 0.5) * 0.012;
      let vy = this.velocities[idx + 1] + (Math.random() - 0.5) * 0.012;

      vx += (this.targets[idx] - this.positions[idx]) * this.targetStrength;
      vy += (this.targets[idx + 1] - this.positions[idx + 1]) * this.targetStrength;

      [vx, vy] = applyCursorRepel(
        this.positions[idx],
        this.positions[idx + 1],
        vx,
        vy,
        this.cursor,
        this.cursorRepelRadius,
        this.cursorRepelForce
      );
      [vx, vy] = clampVelocity(vx, vy, this.maxSpeed);

      vx *= this.friction;
      vy *= this.friction;

      this.positions[idx] += vx * delta;
      this.positions[idx + 1] += vy * delta;
      this.velocities[idx] = vx;
      this.velocities[idx + 1] = vy;

      if (this.positions[idx] < -20) this.positions[idx] = this.width + 20;
      if (this.positions[idx] > this.width + 20) this.positions[idx] = -20;
      if (this.positions[idx + 1] < -20) this.positions[idx + 1] = this.height + 20;
      if (this.positions[idx + 1] > this.height + 20) this.positions[idx + 1] = -20;
    }
  }

  private readonly tick = (now: number): void => {
    if (!this.isRunning) {
      return;
    }

    const rawDelta = now - this.lastFrame;
    this.lastFrame = now;
    const delta = rawDelta > 32 ? 1 : rawDelta / 16.67;

    this.update(now, delta);
    this.render();
    this.animationFrame = window.requestAnimationFrame(this.tick);
  };

  private render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const palette = makePalette(this.scrollRatio);
    drawGrid(this.ctx, this.width, this.height, this.scrollRatio, palette);
    drawConnections(this.ctx, this.positions, this.particleCount, this.connectionDistance, palette);
    drawParticles(this.ctx, this.positions, this.sizes, this.particleCount, palette);
  }
}

