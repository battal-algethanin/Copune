"use client";
import { useState } from "react";
import { METHODS } from "@/lib/schema";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setState("sending");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: f.get("name"), username: f.get("username"), password: f.get("password"), phone: f.get("phone"),
        method: f.get("method"), message: f.get("message"), consent: f.get("consent") === "on", website: f.get("website") || "" }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.fields ? Object.values(j.fields).flat().join(", ") : j.error);
      setState("ok"); setMsg("Thanks, your message was sent."); form.reset();
    } catch (err) { setState("err"); setMsg((err as Error).message || "Something went wrong"); }
  }
  return (
    <form onSubmit={onSubmit} className="form">
      <label>Name<input name="name" required minLength={2} autoComplete="name" /></label>
      <label>Username<input name="username" required minLength={2} autoComplete="off" /></label>
      <label>Password<input name="password" type="password" required autoComplete="new-password" />
        <small>Not an account password. Don’t reuse a real one.</small></label>
      <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
      <label>Preferred contact method<select name="method" required>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
      <label>Message<textarea name="message" required minLength={5} rows={5} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden />
      <label className="check"><input name="consent" type="checkbox" required />
        <span>I consent to Couponly using my details only to respond to this request. My details are emailed to the site owner and not shared with third parties.</span></label>
      <button disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
      {msg && <p role="status" className={state === "ok" ? "ok" : "err"}>{msg}</p>}
    </form>
  );
}
