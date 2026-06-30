import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(null, {
    status: 302,
    headers: {
      Location: "/resume.pdf",
      "Cache-Control": "no-store"
    }
  });

