import ContactForm from "@/components/ContactForm";
import { coupons, status } from "@/lib/coupons";

export default function Home() {
  return (
    <main>
      <header><h1>Couponly</h1><p>Compare coupons and see whether they’re still valid.</p></header>
      <section>
        <h2>Coupons</h2>
        <p className="note">Sample data. Coupons marked “Unverified” have not been checked.</p>
        <div className="grid">{coupons.map((c) => { const s = status(c); return (
          <article key={c.code} className="card"><h3>{c.store}</h3><p>{c.offer}</p><code>{c.code}</code>
            <p>Expires {c.expires}</p><span className={`badge ${s.toLowerCase()}`}>{s}</span></article>); })}</div>
      </section>
      <section id="contact"><h2>Contact us</h2><ContactForm /></section>
    </main>
  );
}
