export type Coupon = { store: string; code: string; offer: string; expires: string; verified: boolean };
// DEMO DATA: none of these are verified. Replace with real data and set verified:true only after checking.
export const coupons: Coupon[] = [
  { store: "Demo Store A", code: "DEMO10", offer: "10% off", expires: "2026-12-31", verified: false },
  { store: "Demo Store B", code: "SAMPLE25", offer: "25 SAR off 150+", expires: "2026-11-01", verified: false },
  { store: "Demo Store C", code: "FREESHIP", offer: "Free shipping", expires: "2027-01-15", verified: false },
];
export function status(c: Coupon, now = new Date()) {
  if (new Date(c.expires + "T23:59:59") < now) return "Expired";
  return c.verified ? "Verified" : "Unverified";
}
