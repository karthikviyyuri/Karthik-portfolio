import { defineCollection, z } from "astro:content";

const labelValue = z.object({
  label: z.string(),
  value: z.string()
});

const experiences = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    dateRange: z.string(),
    type: z.enum(["work", "education", "leadership"]),
    sortOrder: z.number(),
    summary: z.string(),
    highlights: z.array(z.string()).min(1),
    tags: z.array(z.string())
  })
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    timeframe: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    technologies: z.array(z.string()),
    metrics: z.array(labelValue),
    sections: z.array(
      z.object({
        label: z.string(),
        body: z.string()
      })
    )
  })
});

const achievements = defineCollection({
  type: "data",
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        organization: z.string(),
        date: z.string(),
        description: z.string(),
        metric: z.string().optional()
      })
    )
  })
});

const stack = defineCollection({
  type: "data",
  schema: z.object({
    categories: z.array(
      z.object({
        name: z.string(),
        context: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            note: z.string(),
            logo: z.string().optional()
          })
        )
      })
    )
  })
});

export const collections = {
  achievements,
  experiences,
  projects,
  stack
};
