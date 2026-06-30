import type { APIRoute } from "astro";
import { validateContactPayload, type ContactPayload } from "../../lib/api/contact";

export const POST: APIRoute = async ({ request }) => {
  const payload = (await request.json().catch(() => ({}))) as Partial<ContactPayload>;
  const validation = validateContactPayload(payload);

  if (!validation.ok) {
    return Response.json({ message: validation.message }, { status: 400 });
  }

  return Response.json({
    message: "Message validated. Email delivery can be connected with a Resend API key."
  });
};

