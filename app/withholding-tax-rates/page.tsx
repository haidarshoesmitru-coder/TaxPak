import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import { whtFaq } from "@/lib/content";
import { pct } from "@/lib/format";
import WhtCalculator from "@/components/WhtCalculator";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Filer vs Non-Filer Withholding Tax Rates Pakistan",
  description: "Complete filer vs non-filer withholding tax rates for Pakistan FY 2026-27: bank profit, dividends, property, vehicles, services and more. Calculate your WHT instantly.",
  alternates: { canonical: "/withholding-tax-rates" },
};

export default async function Page() {
  const rules = await getRules(), latest = rules[0], faq = whtFaq(latest);
  const rows = latest.withholding?.rows ?? [];
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">Filer vs non-filer withholding tax rates</h1>
    <p className="sub">Pakistan taxes the same transaction at two rates: lower for ATL filers, often double for non-filers. Pick a transaction, enter the amount, and see both sides instantly. Rates for FY {latest.fy}.</p>
    <WhtCalculator rulesets={rules} />
    <h2 style={{ marginTop: 40 }}>Full rate table — FY {latest.fy}</h2>
    <div className="card" style={{ marginTop: 12 }}><div className="tbl"><table>
      <thead><tr><th>Section</th><th>Transaction</th><th className="n">Filer</th><th className="n">Non-filer</th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>
        <td>{r.section}</td>
        <td>{r.transaction}{r.note ? <><br /><span style={{ color: "var(--faint)", fontSize: ".8rem" }}>{r.note}</span></> : null}</td>
        <td className="n">{r.filerPct === null ? "—" : pct(r.filerPct / 100)}</td>
        <td className="n">{r.nonFilerTiers ? r.nonFilerTiers.map((t) => pct(t.pct / 100)).join(" / ") : r.nonFilerPct === null ? "—" : pct(r.nonFilerPct / 100)}</td>
      </tr>)}</tbody>
    </table></div></div>
    <Sources r={latest} />
    <h2 style={{ marginTop: 40 }}>FAQ</h2>{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
  </section></main>);
}
