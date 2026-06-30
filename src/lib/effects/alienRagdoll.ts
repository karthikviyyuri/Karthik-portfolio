interface Alien {
  element: HTMLElement;
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  drift: number;
  opacity: number;
  fallSpeed: number;
  age: number;
}

const ALIEN_SVG = `
  <svg viewBox="0 0 80 120" class="alien-ragdoll__svg">
    <g class="alien-ragdoll__body">
      <ellipse class="alien-ragdoll__head" cx="40" cy="28" rx="18" ry="22" />
      <path class="alien-ragdoll__antenna" d="M36 7 Q40 0 44 7" />
      <circle class="alien-ragdoll__eye" cx="33" cy="27" r="2.5" />
      <circle class="alien-ragdoll__eye" cx="47" cy="27" r="2.5" />
      <path class="alien-ragdoll__torso" d="M30 52 Q40 44 50 52 L47 78 Q40 84 33 78 Z" />
    </g>
    <g class="alien-ragdoll__arm alien-ragdoll__arm--left">
      <path d="M31 55 Q18 63 14 78" />
      <circle cx="14" cy="78" r="2" />
    </g>
    <g class="alien-ragdoll__arm alien-ragdoll__arm--right">
      <path d="M49 55 Q62 63 66 78" />
      <circle cx="66" cy="78" r="2" />
    </g>
    <g class="alien-ragdoll__leg alien-ragdoll__leg--left">
      <path d="M35 78 Q30 94 26 108" />
      <circle cx="26" cy="108" r="2" />
    </g>
    <g class="alien-ragdoll__leg alien-ragdoll__leg--right">
      <path d="M45 78 Q50 94 54 108" />
      <circle cx="54" cy="108" r="2" />
    </g>
  </svg>
`;

class AlienRagdollEngine {
  private aliens: Alien[] = [];
  private lastScrollY = 0;
  private scrollVelocity = 0;
  private rafId = 0;
  private lastSpawnTime = 0;
  private nextId = 1;
  private running = false;
  private mobile = false;

  constructor(private readonly layer: HTMLElement) {
    this.lastScrollY = window.scrollY;
    this.mobile = window.innerWidth < 768;
  }

  start(): void {
    if (this.running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    this.running = true;
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  destroy(): void {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    window.cancelAnimationFrame(this.rafId);
    this.aliens.forEach((alien) => alien.element.remove());
    this.aliens = [];
    this.running = false;
  }

  private readonly handleScroll = (): void => {
    const currentY = window.scrollY;
    this.scrollVelocity = currentY - this.lastScrollY;
    this.lastScrollY = currentY;
    if (this.scrollVelocity > 3) {
      this.trySpawnAlien();
    }
  };

  private readonly handleResize = (): void => {
    this.mobile = window.innerWidth < 768;
  };

  private readonly handleVisibility = (): void => {
    if (document.hidden) {
      window.cancelAnimationFrame(this.rafId);
      return;
    }
    this.rafId = window.requestAnimationFrame(this.tick);
  };

  private readonly tick = (): void => {
    this.updateAliens();
    this.rafId = window.requestAnimationFrame(this.tick);
  };

  private trySpawnAlien(): void {
    const now = performance.now();
    const maxAliens = this.mobile ? 4 : 9;
    const minSpawnGap = this.mobile ? 1200 : 700;
    if (this.aliens.length >= maxAliens || now - this.lastSpawnTime < minSpawnGap) {
      return;
    }
    if (Math.random() > (this.mobile ? 0.48 : 0.68)) {
      return;
    }
    this.lastSpawnTime = now;
    this.spawnAlien();
  }

  private spawnAlien(): void {
    const element = document.createElement("div");
    element.className = "alien-ragdoll";
    element.innerHTML = ALIEN_SVG;

    const edgeBias = Math.random();
    const xPercent = this.mobile
      ? edgeBias < 0.5 ? randomBetween(4, 18) : randomBetween(82, 96)
      : randomBetween(6, 94);
    const size = this.mobile ? randomBetween(26, 36) : randomBetween(32, 50);

    const alien: Alien = {
      element,
      id: this.nextId,
      x: window.innerWidth * (xPercent / 100),
      y: -size * randomBetween(1.2, 3.5),
      size,
      rotation: randomBetween(-18, 18),
      rotationSpeed: randomBetween(-0.38, 0.38),
      drift: randomBetween(-0.32, 0.32),
      opacity: 0,
      fallSpeed: randomBetween(0.55, 1.35),
      age: 0
    };
    this.nextId += 1;

    element.style.setProperty("--alien-size", `${alien.size}px`);
    element.style.setProperty("--alien-phase", `${Math.random() * 1.8}s`);
    this.layer.append(element);
    this.aliens.push(alien);
  }

  private updateAliens(): void {
    const velocityBoost = Math.max(0, Math.min(14, this.scrollVelocity)) * 0.18;
    this.scrollVelocity *= 0.9;

    for (const alien of this.aliens) {
      alien.age += 1;
      alien.y += alien.fallSpeed + velocityBoost;
      alien.x += alien.drift + Math.sin(alien.age * 0.025 + alien.id) * 0.08;
      alien.rotation += alien.rotationSpeed + velocityBoost * 0.08;
      const fadeIn = Math.min(1, alien.age / 32);
      const fadeOut = clamp((window.innerHeight + 80 - alien.y) / 180, 0, 1);
      alien.opacity = Math.min(0.72, fadeIn * fadeOut);
      alien.element.style.opacity = String(alien.opacity);
      alien.element.style.transform = `translate3d(${alien.x}px, ${alien.y}px, 0) translate(-50%, -50%) rotate(${alien.rotation}deg)`;
    }

    this.aliens = this.aliens.filter((alien) => {
      const alive = alien.y < window.innerHeight + 140 && alien.opacity > 0.01;
      if (!alive) {
        alien.element.remove();
      }
      return alive;
    });
  }
}

function shouldStartRagdolls(): boolean {
  const introPresent = document.getElementById("portfolio-intro") !== null;
  if (!introPresent) {
    return true;
  }

  return (
    window.sessionStorage.getItem("portfolioIntroSeen") === "true" ||
    document.documentElement.classList.contains("intro-complete")
  );
}

function scheduleRagdollStart(engine: { start: () => void }): void {
  if (shouldStartRagdolls()) {
    engine.start();
    return;
  }

  if (window.__alienRagdollStartScheduled) {
    return;
  }
  window.__alienRagdollStartScheduled = true;

  window.addEventListener(
    "intro:complete",
    () => {
      engine.start();
    },
    { once: true }
  );
}

export function initAlienRagdoll(): void {
  const layer = document.getElementById("alien-ragdoll-layer");
  if (!(layer instanceof HTMLElement)) {
    return;
  }

  if (window.__alienRagdollEngine) {
    scheduleRagdollStart(window.__alienRagdollEngine);
    return;
  }

  const engine = new AlienRagdollEngine(layer);
  window.__alienRagdollEngine = engine;
  scheduleRagdollStart(engine);
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
