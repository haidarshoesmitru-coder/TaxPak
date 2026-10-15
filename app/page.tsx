import Link from "next/link";
import { getRules } from "@/lib/rules";
import SlabTable from "@/components/SlabTable";
import Sources from "@/components/Sources";
import Stats from "@/components/Stats";
import { SITE } from "@/lib/format";
import { IconWallet, IconPercent, IconShip, IconScale, IconBuilding, IconMoon } from "@/components/icons";

export const revalidate = 3600;

const tools = [
  { h: "/income-tax-calculator", t: "Income tax", d: "Salaried slabs with a slice-by-slice breakdown, monthly or annual.", icon: <IconWallet />, chip: { background: "#ecfdf5", color: "#059669" } },
  { h: "/sales-tax-calculator", t: "Sales tax (GST)", d: "Add GST to a price, or strip it out of one.", icon: <IconPercent />, chip: { background: "#eff6ff", color: "#2563eb" } },
  { h: "/customs-duty-calculator", t: "Customs duty", d: "Landed cost with every duty stacked in order.", icon: <IconShip />, chip: { background: "#fffbeb", color: "#d97706" } },
  { h: "/withholding-tax-rates", t: "Filer vs non-filer", d: "39 WHT transactions compared, plus a calculator.", icon: <IconScale />, chip: { background: "#f5f3ff", color: "#7c3aed" } },
  { h: "/property-capital-gains", t: "Property gains tax", d: "Section 37: flat 15% or holding-period rates.", icon: <IconBuilding />, chip: { background: "#fef2f2", color: "#dc2626" } },
  { h: "/zakat-calculator", t: "Zakat calculator", d: "2.5% on net zakatable assets above nisab.", icon: <IconMoon />, chip: { background: "#f0fdfa", color: "#0d9488" } },
];

export default async function Home() {
  const [latest] = await getRules();
  return (<>
    <header className="hero"><div className="wrap">
      <span className="pill"><span className="livedot" /> FY {latest.fy} · {latest.actName} · verified {latest.verifiedAt}</span>
      <h1 className="display">Pakistan&rsquo;s tax, <span className="accent">calculated in seconds.</span></h1>
      <p className="standfirst">Income tax, sales tax, customs duty, withholding rates, property gains and zakat — every figure traced to the {latest.actName}. Free, no signup, and your numbers never leave your browser.</p>
      <div className="cta-row">
        <Link className="btn" href="/income-tax-calculator">Calculate my tax</Link>
        <Link className="btn-ghost" href="/withholding-tax-rates">Filer vs non-filer rates</Link>
      </div>
      <Stats />
    </div></header>
    <main className="wrap">
      <section className="block">
        <h2 className="stitle">Everything you need to file right</h2>
        <p className="sedes">Six precision tools. One source of truth for the rates underneath them.</p>
        <div className="calc-grid">
          {tools.map((t) => (
            <Link key={t.h} href={t.h} className="calc-card">
              <div className="icon-chip" style={t.chip}>{t.icon}</div>
              <h3>{t.t}</h3>
              <p>{t.d}</p>
              <span className="go">Open calculator →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="block" style={{ paddingTop: 0 }}>
        <h2 className="stitle">Salaried income tax slabs, FY {latest.fy}</h2>
        <p className="sedes">Each slice of income pays only its own band&rsquo;s rate.</p>
        <SlabTable r={latest} />
        <Sources r={latest} />
      </section>
    </main>
    <section className="trust"><div className="wrap" style={{ paddingTop: 52, paddingBottom: 56 }}>
      <h2 className="stitle" style={{ color: "#fff" }}>Why trust PKTaxHub</h2>
      <p className="sedes" style={{ color: "#94a3b8" }}>Built like tax infrastructure, not a blog.</p>
      <div className="trustgrid">
        <div><h3><span className="tick">✓</span>Named sources, every time</h3><p>Every rate carries its legal citation — Finance Act schedule, section number, SRO — never an anonymous number.</p></div>
        <div><h3><span className="tick">✓</span>Verified &amp; timestamped</h3><p>Each fiscal year&rsquo;s rules are checked by a person against the notified text, and the check date is printed on the page.</p></div>
        <div><h3><span className="tick">✓</span>Your numbers stay yours</h3><p>All calculations run in your browser. Nothing you type is sent anywhere or stored.</p></div>
      </div>
    </div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url }) }} />
  </>);
}
