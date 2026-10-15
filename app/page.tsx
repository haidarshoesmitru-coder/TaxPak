import Link from "next/link";
import { getRules } from "@/lib/rules";
import SlabTable from "@/components/SlabTable";
import Sources from "@/components/Sources";
import Tilt from "@/components/fx/Tilt";
import HeroScene from "@/components/fx/HeroScene";
import CountUp from "@/components/fx/CountUp";
import { SITE } from "@/lib/format";

export const revalidate = 3600;

const tools = [
  ["/income-tax-calculator", "Income tax", "Salaried slabs with a slice-by-slice breakdown."],
  ["/sales-tax-calculator", "Sales tax (GST)", "Add tax to a price or pull it out of one."],
  ["/customs-duty-calculator", "Customs duty", "Landed cost with every duty stacked in order."],
  ["/withholding-tax-rates", "Filer vs non-filer", "WHT rates compared, plus a calculator."],
  ["/property-capital-gains", "Property gains tax", "Flat 15% or holding-period rates."],
  ["/zakat-calculator", "Zakat calculator", "2.5% on net assets above nisab."],
];

const stats = [
  { n: 6, suffix: "", label: "Precision calculators" },
  { n: 8, suffix: "", label: "Income tax slabs tracked" },
  { n: 18, suffix: "%", label: "Standard GST rate" },
  { n: 6, suffix: "", label: "Duty types in customs estimator" },
];

export default async function Home() {
  const [latest] = await getRules();
  return (<>
    <header className="hero"><div className="wrap hero-grid">
      <div>
        <span className="pill">Rates for FY {latest.fy} · {latest.actName} · checked {latest.verifiedAt}</span>
        <h1>Pakistan&rsquo;s tax code, <i>calculated.</i></h1>
        <p>Income tax, sales tax and customs duty calculators. Free, no signup, and your numbers stay in your browser.</p>
        <Link className="btn" href="/income-tax-calculator">Calculate my tax</Link>
      </div>
      <HeroScene />
    </div></header>
    <div className="wrap"><div className="stats3d">
      {stats.map((s) => (
        <div className="stat3d" key={s.label}>
          <div className="n"><CountUp to={s.n} suffix={s.suffix} /></div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div></div>
    <main className="wrap">
      <section className="block"><div className="grid3">{tools.map(([h, t, d]) => (
        <Tilt key={h}><Link href={h} className="card"><h3>{t}</h3><p>{d}</p></Link></Tilt>
      ))}</div></section>
      <section className="block" style={{ paddingTop: 0 }}>
        <h2>Salaried income tax slabs, FY {latest.fy}</h2><p className="sub">Each slice of income pays only its own band&rsquo;s rate.</p>
        <div className="card"><SlabTable r={latest} /></div><Sources r={latest} />
      </section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url }) }} />
  </>);
}
