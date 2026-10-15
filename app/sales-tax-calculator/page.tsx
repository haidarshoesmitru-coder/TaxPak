import type { Metadata } from "next";
import { getRules } from "@/lib/rules";
import SalesCalculator from "@/components/SalesCalculator";
import Sources from "@/components/Sources";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Pakistan Sales Tax (GST) Calculator",
  description: "Add GST to a price or extract it from a tax-inclusive price, using the current standard rate.",
  alternates: { canonical: "/sales-tax-calculator" },
};

export default async function Page() {
  const rules = await getRules();
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">Sales tax (GST) calculator, Pakistan</h1>
    <p className="sub">Standard rate is {rules[0].salesTax.standardRatePct}% for FY {rules[0].fy}. Reduced and special-rate goods can be entered manually.</p>
    <SalesCalculator rulesets={rules} /><Sources r={rules[0]} />
  </section></main>);
}
