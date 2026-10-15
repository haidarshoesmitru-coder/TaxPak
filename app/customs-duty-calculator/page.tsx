import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import CustomsCalculator from "@/components/CustomsCalculator";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Pakistan Customs Duty and Landed Cost Calculator",
  description: "Estimate import duties and taxes in Pakistan: customs duty, ACD, regulatory duty, FED, sales tax and withholding tax stacked in order.",
  alternates: { canonical: "/customs-duty-calculator" },
};

export default async function Page() {
  const rules = await getRules();
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">Customs duty and landed cost calculator</h1>
    <p className="sub">An estimate only. Final assessment is by Pakistan Customs under the item&rsquo;s HS code.</p>
    <CustomsCalculator rulesets={rules} /><Sources r={rules[0]} />
  </section></main>);
}
