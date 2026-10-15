import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import { zakatFaq } from "@/lib/content";
import { rs } from "@/lib/format";
import ZakatCalculator from "@/components/ZakatCalculator";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Zakat Calculator Pakistan 2026",
  description: "Calculate Zakat on cash, bank balances, gold, silver and business goods at 2.5%, with the notified nisab for 1446-47 AH.",
  alternates: { canonical: "/zakat-calculator" },
};

export default async function Page() {
  const rules = await getRules(), latest = rules[0], faq = zakatFaq(latest);
  const z = latest.zakat;
  return (<main className="wrap"><section className="block">
    <h1 style={{ fontFamily: "var(--serif)", marginBottom: 8 }}>Zakat calculator</h1>
    <p className="sub">Add your zakatable assets, subtract debts. If the net reaches nisab ({z ? rs(z.nisab) : ""}, {z?.zakatYear}), Zakat is {z?.ratePct}%.</p>
    <ZakatCalculator rulesets={rules} />
    <Sources r={latest} />
    <h2 style={{ marginTop: 40 }}>FAQ</h2>{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
  </section></main>);
}
