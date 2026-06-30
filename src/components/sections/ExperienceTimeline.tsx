import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  dateRange: string;
  type: "work" | "education" | "leadership";
  summary: string;
  highlights: string[];
  tags: string[];
}

interface ExperienceTimelineProps {
  items: TimelineItem[];
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps): JSX.Element {
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? "");

  return (
    <div className="timeline">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <article className={`timeline__item timeline__item--${item.type}`} key={item.id}>
            <button className="timeline__header" type="button" onClick={() => setOpenId(isOpen ? "" : item.id)} aria-expanded={isOpen}>
              <span>
                <strong>{item.organization}</strong>
                <em>{item.title}</em>
              </span>
              <span className="timeline__date">{item.dateRange}</span>
              <ChevronDown className={isOpen ? "is-open" : ""} size={18} aria-hidden="true" />
            </button>
            <div className="timeline__body" hidden={!isOpen}>
              <p>{item.summary}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="tag-list">
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

