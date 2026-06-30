import { useEffect, useMemo, useRef, useState } from "react";

export interface ImpactMetric {
  group: string;
  value: number;
  suffix: string;
  label: string;
  context: string;
  source: string;
}

interface ImpactMetricsProps {
  metrics: readonly ImpactMetric[];
}

function Counter({ value, suffix }: { value: number; suffix: string }): JSX.Element {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const start = performance.now();
        const duration = 900;
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setDisplay(Number((value * progress).toFixed(value % 1 === 0 ? 0 : 1)));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function ImpactMetrics({ metrics }: ImpactMetricsProps): JSX.Element {
  const groups = useMemo(() => Array.from(new Set(metrics.map((metric) => metric.group))), [metrics]);
  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "Delivery");
  const activeMetrics = metrics.filter((metric) => metric.group === activeGroup);

  return (
    <div className="impact-metrics">
      <div className="impact-metrics__tabs" role="tablist" aria-label="Impact metric groups">
        {groups.map((group) => (
          <button
            aria-selected={group === activeGroup}
            className={group === activeGroup ? "is-active" : ""}
            key={group}
            onClick={() => setActiveGroup(group)}
            role="tab"
            type="button"
          >
            {group}
          </button>
        ))}
      </div>
      <div className="impact-metrics__grid">
        {activeMetrics.map((metric) => (
          <a className="impact-card panel" href={metric.source} key={`${metric.group}-${metric.label}`}>
            <strong>
              <Counter value={metric.value} suffix={metric.suffix} />
            </strong>
            <span>{metric.label}</span>
            <em>{metric.context}</em>
          </a>
        ))}
      </div>
    </div>
  );
}
