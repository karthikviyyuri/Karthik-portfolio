export function initRevealOnScroll(root: ParentNode = document): void {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-ready])"));
  if (nodes.length === 0) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  nodes.forEach((node) => {
    node.dataset.revealReady = "true";
    observer.observe(node);
  });
}
