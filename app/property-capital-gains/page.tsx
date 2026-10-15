import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import { propertyFaq } from "@/lib/content";
import PropertyGainsCalculator from "@/components/PropertyGainsCalculator";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Property Capital Gains Tax Calculator Pakistan",
  description: "Calculate capital gains tax on selling property in Pakistan: flat 15% for ATL filers (post-July 2024) or holding-period rates for older purchases.",
  alternates: { canonical: "/property-capital-gains" },
};

export default async function Page() {
  const rules = await getRules(), latest = rules[0], faq = propertyFaq(latest);
  const pg = latest.propertyGains;
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">Property capital gains tax calculator</h1>
    <p className="sub">Selling a plot, house or flat? Enter purchase and sale prices. Properties bought on or after 1 July 2024 pay a flat 15% (ATL); older ones use the holding-period table.</p>
    <PropertyGainsCalculator rulesets={rules} />
    {pg && <>
      <h2 style={{ marginTop: 40 }}>Old holding-period rates (acquired before 1 July 2024)</h2>
      {pg.oldRegime.map((t) => (
        <div className="card" style={{ marginTop: 12 }} key={t.type}>
          <h3 style={{ fontFamily: "var(--serif)", margin: "0 0 8px" }}>{t.label}</h3>
          <div className="tbl"><table><thead><tr><th>Held</th><th className="n">Rate</th></tr></thead>
            <tbody>{t.slabs.map((s, i) => <tr key={i}>
              <td>{s.upToYears === null ? `More than ${t.slabs[i - 1].upToYears} years` : `Up to ${s.upToYears} year${s.upToYears > 1 ? "s" : ""}`}</td>
              <td className="n">{s.pct}%</td>
            </tr>)}</tbody></table></div>
        </div>
      ))}
      <p className="sub" style={{ marginTop: 8 }}>Old-regime intermediate steps should be re-checked against the pre-2024 First Schedule before relying on them.</p>
    </>}
    <Sources r={latest} />
    <h2 style={{ marginTop: 40 }}>FAQ</h2>{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
  </section></main>);
}
