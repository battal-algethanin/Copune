import { z } from "zod";
export const METHODS = ["Phone call", "WhatsApp", "SMS", "Email"] as const;
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  username: z.string().trim().min(2).max(50),
  password: z.string().min(1).max(100),
  phone: z.string().trim().regex(/^[+0-9 ()-]{7,20}$/, "Invalid phone number"),
  method: z.enum(METHODS),
  message: z.string().trim().min(5).max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  website: z.string().max(0).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;
