type AbductionElements = {
  root: HTMLElement;
  stage: HTMLElement;
  ufo: HTMLElement;
  beam: HTMLElement;
  copy: HTMLElement;
  terrain: HTMLElement | null;
  progress: HTMLElement | null;
};

const INTRO_KEY = "portfolioIntroSeen";

export function initAlienAbductionIntro(): void {
  const root = document.getElementById("portfolio-intro");
  const stage = document.getElementById("intro-scroll-stage");
  const ufo = document.querySelector<HTMLElement>("[data-abduction-ufo]");
  const beam = document.querySelector<HTMLElement>("[data-abduction-beam]");
  const copy = document.querySelector<HTMLElement>("[data-intro-copy]");
  if (!(root instanceof HTMLElement) || !(stage instanceof HTMLElement) || !ufo || !beam || !copy) {
    return;
  }
  if (root.dataset.booted === "true") return;

  root.dataset.booted = "true";
  window.__alienAbductionIntroInitialized = true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "reset") {
    window.sessionStorage.removeItem(INTRO_KEY);
    window.__portfolioIntroCompleteDispatched = false;
  }

  const elements: AbductionElements = {
    root,
    stage,
    ufo,
    beam,
    copy,
    terrain: document.querySelector<HTMLElement>(".intro-loader__scene"),
    progress: document.getElementById("intro-progress")
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = window.sessionStorage.getItem(INTRO_KEY) === "true";
  if (seen) {
    completeIntro(elements, true);
    return;
  }

  document.body.classList.add("intro-active");
  elements.root.classList.add("is-loading");

  if (reducedMotion) {
    elements.progress && (elements.progress.textContent = "100");
    elements.root.classList.add("is-welcome");
    window.setTimeout(() => completeIntro(elements), 750);
    return;
  }

  let loadingReady = false;
  let completed = false;
  let rafId = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  const loadStart = performance.now();
  const loadDuration = 1450;

  function computeProgress(): number {
    const scrollable = Math.max(1, elements.stage.offsetHeight - window.innerHeight);
    return clamp(window.scrollY / scrollable);
  }

  function scheduleProgress(): void {
    targetProgress = loadingReady ? computeProgress() : 0;
  }

  function tick(now: number): void {
    const loadRatio = clamp((now - loadStart) / loadDuration);
    const loadValue = Math.round((1 - Math.pow(1 - loadRatio, 3)) * 100);
    if (elements.progress) {
      elements.progress.textContent = String(loadValue).padStart(3, "0");
    }
    if (loadRatio >= 1 && !loadingReady) {
      loadingReady = true;
      elements.root.classList.add("is-welcome");
      elements.root.classList.remove("is-loading");
      scheduleProgress();
    }

    currentProgress += (targetProgress - currentProgress) * 0.12;
    render(elements, currentProgress, now * 0.001);

    if (!completed && currentProgress >= 0.982) {
      completed = true;
      completeIntro(elements);
      return;
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function onVisibility(): void {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      return;
    }
    rafId = window.requestAnimationFrame(tick);
  }

  window.__alienAbductionScroll = scheduleProgress;
  window.__alienAbductionResize = scheduleProgress;
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  rafId = window.requestAnimationFrame(tick);
}

function render(elements: AbductionElements, progress: number, time: number): void {
  const suction = smoothstep(0.18, 0.88, progress);
  const lateFade = smoothstep(0.82, 0.96, progress);
  const beamOpacity = 0.82 * smoothstep(0.1, 0.32, progress) * (1 - smoothstep(0.94, 1, progress));
  const beamScale = 1 - smoothstep(0.72, 0.94, progress) * 0.26;
  const idleRotation = Math.sin(time * 0.35) * 1.2;
  const suctionRotation = suction * Math.sin(time * (2 + suction * 8)) * 4;
  const copyPull = easeInOutCubic(suction);
  const copyJitter = suction * Math.sin(time * (4 + suction * 9)) * 4;
  const copyOpacity = progress < 0.82 ? 1 : 1 - lateFade;
  const copyY = -window.innerHeight * 0.45 * copyPull + copyJitter;
  const copyScale = 1 - copyPull * 0.54;
  const copyRotation = Math.sin(progress * Math.PI * 4) * suction * 4 + suction * 8;
  const copyBlur = lateFade * 3.5;
  const terrainY = Math.sin(time * 0.7) * (7 + suction * 5);
  const terrainOpacity = 0.58 + suction * 0.16;

  elements.ufo.style.setProperty("--ufo-rotation", `${idleRotation + suctionRotation}deg`);
  elements.ufo.style.setProperty("--ufo-scale", String(1 + Math.sin(time * 0.5) * 0.006));
  elements.beam.style.setProperty("--beam-opacity", String(beamOpacity));
  elements.beam.style.setProperty("--beam-scale", String(beamScale));
  elements.copy.style.setProperty("--intro-copy-opacity", String(copyOpacity));
  elements.copy.style.setProperty("--intro-copy-y", `${copyY}px`);
  elements.copy.style.setProperty("--intro-copy-scale", String(copyScale));
  elements.copy.style.setProperty("--intro-copy-rotation", `${copyRotation}deg`);
  elements.copy.style.setProperty("--intro-copy-blur", `${copyBlur}px`);
  elements.root.style.setProperty("--intro-fade", String(1 - smoothstep(0.92, 1, progress)));
  elements.terrain?.style.setProperty("--terrain-y", `${terrainY}px`);
  elements.terrain?.style.setProperty("--terrain-opacity", String(terrainOpacity));
}

function completeIntro(elements: AbductionElements, instant = false): void {
  window.sessionStorage.setItem(INTRO_KEY, "true");
  document.body.classList.remove("intro-active");
  document.documentElement.classList.add("intro-complete");
  elements.root.classList.add("is-hidden");
  if (instant) {
    elements.stage.remove();
  } else {
    window.setTimeout(() => {
      elements.stage.remove();
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 680);
  }
  if (!window.__portfolioIntroCompleteDispatched) {
    window.__portfolioIntroCompleteDispatched = true;
    window.dispatchEvent(new CustomEvent("intro:complete"));
  }
  if (window.__alienAbductionScroll) {
    window.removeEventListener("scroll", window.__alienAbductionScroll);
  }
  if (window.__alienAbductionResize) {
    window.removeEventListener("resize", window.__alienAbductionResize);
  }
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
