export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
}

export interface ContactResult {
  ok: boolean;
  message: string;
}

export function validateContactPayload(payload: Partial<ContactPayload>): ContactResult {
  if (payload.company) {
    return { ok: false, message: "Submission rejected." };
  }

  if (!payload.name || payload.name.trim().length < 2) {
    return { ok: false, message: "Please enter your name." };
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, message: "Please enter a valid email." };
  }

  if (!payload.message || payload.message.trim().length < 10) {
    return { ok: false, message: "Please include a message with a little context." };
  }

  return { ok: true, message: "Message validated." };
}

