import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import { incomeFaq } from "@/lib/content";
import IncomeCalculator from "@/components/IncomeCalculator";
import SlabTable from "@/components/SlabTable";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Pakistan Salary Income Tax Calculator",
  description: "Calculate monthly and annual salary tax in Pakistan with the latest FBR slabs. Compare fiscal years and see a slice-by-slice breakdown.",
  alternates: { canonical: "/income-tax-calculator" },
};

export default async function Page() {
  const rules = await getRules(), latest = rules[0], faq = incomeFaq(latest);
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">Salary income tax calculator, Pakistan</h1>
    <p className="sub">Salaried individuals only. Based on the {latest.actName}.</p>
    <IncomeCalculator rulesets={rules} />
    <h2 style={{ marginTop: 40 }}>Slabs for FY {latest.fy}</h2><div className="card" style={{ marginTop: 12 }}><SlabTable r={latest} /></div>
    <Sources r={latest} />
    <h2 style={{ marginTop: 40 }}>FAQ</h2>{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
  </section></main>);
}
