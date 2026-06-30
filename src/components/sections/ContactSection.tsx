import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

interface ContactState {
  status: "idle" | "sending" | "success" | "error";
  message: string;
}

export default function ContactSection(): JSX.Element {
  const [state, setState] = useState<ContactState>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState({ status: "sending", message: "Sending..." });

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? "")
      })
    });

    const result = (await response.json()) as { message?: string };
    if (response.ok) {
      form.reset();
      setState({ status: "success", message: result.message ?? "Message received." });
      return;
    }

    setState({ status: "error", message: result.message ?? "Something went wrong." });
  }

  return (
    <form className="contact-form panel" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="name" autoComplete="name" required minLength={2} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="contact-form__hidden">
        <span>Company</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required minLength={10} />
      </label>
      <button className="button button--solid" type="submit" disabled={state.status === "sending"}>
        <Send size={16} aria-hidden="true" />
        {state.status === "sending" ? "Sending" : "Send Message"}
      </button>
      <p className={`contact-form__status contact-form__status--${state.status}`} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}

