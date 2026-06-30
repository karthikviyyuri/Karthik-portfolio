export const profile = {
  name: "Karthik Viyyuri",
  city: "Hyderabad",
  hudCity: "HYD",
  timezone: "Asia/Kolkata",
  email: "karthikviyyuri@gmail.com",
  phone: "+91 9701992085",
  linkedin: "https://www.linkedin.com/in/karthik",
  github: "https://github.com/karthikviyyuri",
  kaggle: "",
  role: "AI/ML Engineer",
  roleDetail: "B.Tech CSE (AI-ML) - BV Raju Institute of Technology",
  headline: "Not what a model outputs - how the system is tested, shipped, and made useful.",
  shortBio:
    "AI/ML engineer focused on multimodal learning, automation, and practical systems that survive real delivery constraints.",
  resumeHref: "/api/resume-download"
} as const;

export const aboutParagraphs = [
  "Karthik's path sits at the intersection of computer science, applied AI, and delivery engineering. His B.Tech in CSE with an AI-ML specialization gives him the model-building foundation, while internships at TCS and PalTech anchor that foundation in production workflows.",
  "At TCS, he supported a Microsoft 365 tenant transformation project, working around identity, mailbox migration, and validation flows. The useful lesson was not only migration mechanics; it was that automation matters most when the system has many small operational edges.",
  "At PalTech, he moved from requirements to working validation by building and automating 200+ UI regression test cases with JavaScript, Playwright, and the Page Object Model. That work strengthened the habit this portfolio is built around: prove behavior before polishing claims.",
  "His research work, Cache-Augmented Multimodal Sentiment Analysis using Embeddings, combines text, audio, and facial-expression signals with BERT, CLIP, and Streamlit. It was presented and published at WECON 2025, backed by the IEEE Delhi Section."
] as const;

export const beliefs = [
  {
    title: "Models Need Operating Context",
    body:
      "A useful AI system is more than a trained model. Karthik thinks about input quality, repeated computation, retrieval efficiency, interface clarity, and how quickly another engineer can validate the behavior."
  },
  {
    title: "Automation Should Remove Friction",
    body:
      "The strongest internship outcomes in his resume are automation outcomes: reduced post-migration cleanup effort at TCS and lower repetitive manual testing at PalTech."
  },
  {
    title: "Evidence Beats Decoration",
    body:
      "The portfolio keeps numbers traceable: 200+ regression cases, approximately 30% reduction in post-migration manual effort, approximately 25% reduction in repetitive testing, GPA 8.1, and 94.9% intermediate score."
  }
] as const;

export const negativeSpace = [
  "No inflated client metrics from unrelated work.",
  "No fake recommendation quotes.",
  "No generic AI claims without a project, paper, or delivery context."
] as const;

export const metrics = [
  {
    group: "Delivery",
    value: 30,
    suffix: "%",
    label: "manual post-migration effort reduced",
    context: "PowerShell cleanup and validation during the TCS Microsoft 365 tenant transformation internship.",
    source: "/work/tcs-m365-transformation"
  },
  {
    group: "Quality",
    value: 200,
    suffix: "+",
    label: "UI regression cases automated",
    context: "JavaScript, Playwright, and Page Object Model automation at PalTech.",
    source: "/work/paltech-regression-automation"
  },
  {
    group: "Quality",
    value: 25,
    suffix: "%",
    label: "repetitive manual testing effort reduced",
    context: "CI/CD-integrated automated validation at PalTech.",
    source: "/work/paltech-regression-automation"
  },
  {
    group: "Research",
    value: 3,
    suffix: "",
    label: "modalities combined",
    context: "Text, audio, and facial-expression inputs in the multimodal sentiment project.",
    source: "/work/cache-augmented-multimodal-sentiment"
  },
  {
    group: "Research",
    value: 2025,
    suffix: "",
    label: "WECON publication year",
    context: "IEEE Delhi Section-backed WECON 2025 conference paper.",
    source: "/work/wecon-2025-publication"
  },
  {
    group: "Academics",
    value: 8.1,
    suffix: "/10",
    label: "B.Tech GPA",
    context: "CSE (AI-ML), BV Raju Institute of Technology, 2022-2026.",
    source: "/about#education"
  },
  {
    group: "Academics",
    value: 94.9,
    suffix: "%",
    label: "intermediate score",
    context: "MPC, Excellencia Junior College, 2020-2022.",
    source: "/about#education"
  }
] as const;

export const certifications = [
  "Deep Learning for Natural Language Processing - NPTEL (2025)",
  "Data Structures and Algorithms - Smart Interviews (2024)",
  "Database Management with SQL - Oracle Academy (2023)",
  "Joy of Computing using Python - NPTEL (2023)"
] as const;

export const socialLinks = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` }
] as const;
