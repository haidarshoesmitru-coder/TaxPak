import type { RuleSet } from "./types";
import { rs, pct } from "./format";

/** FAQ text is generated from the ruleset, so it can never drift out of date with the numbers. */
export function incomeFaq(r: RuleSet) {
  const s = r.salaried.slabs, free = s[0].upTo!, top = s[s.length - 1];
  const bands = s.map((x, i) => i === 0 ? `0% up to ${rs(free)}` : x.upTo === null
    ? `${rs(top.fixed)} + ${pct(top.rate)} above ${rs(s[i - 1].upTo!)}` : `${rs(x.fixed)} + ${pct(x.rate)} up to ${rs(x.upTo)}`).join("; ");
  return [
    { q: `What is the tax-free salary limit in Pakistan for ${r.fy}?`, a: `Salaried individuals earning up to ${rs(free)} a year (${rs(free / 12)} a month) pay no income tax in FY ${r.fy}.` },
    { q: `What are the salaried income tax slabs for ${r.fy}?`, a: `Under the ${r.actName}: ${bands}.` },
    { q: "Is there a surcharge on salary income?", a: r.salaried.surcharge ? `Yes. A ${pct(r.salaried.surcharge.rateOnTax)} surcharge applies to the tax of salaried people earning above ${rs(r.salaried.surcharge.incomeAbove)}.` : "No surcharge applies to salaried income for this fiscal year." },
    { q: "How does my employer deduct salary tax?", a: "Employers withhold estimated annual tax in monthly instalments and deposit it with FBR. Differences are settled when you file your return." },
  ];
}

export function whtFaq(r: RuleSet) {
  const n = r.withholding?.rows.length ?? 0;
  return [
    { q: `What is the difference between filer and non-filer tax rates in ${r.fy}?`, a: `Pakistan taxes many transactions at two rates: a lower rate for people on the Active Taxpayers List (ATL filers) and a much higher rate — often double — for non-filers. Our table covers ${n} common transactions for FY ${r.fy}.` },
    { q: "How much tax is deducted on bank profit?", a: "For FY 2026-27, banks withhold 20% on profit for ATL filers and 40% for non-filers (Section 151). On government bonds held by individuals it is 15% / 30%." },
    { q: "What is the withholding tax on property sale and purchase?", a: "On transfer, the buyer/seller pays 2.75% (filer) or 11.5% (non-filer) on sale under Section 236C, and 1.25% (filer) on purchase under Section 236K — non-filers pay 10.5% to 18.5% on purchase depending on the property value." },
    { q: "Is cash withdrawal from a bank taxed?", a: "Only for non-filers: 0.8% on cash withdrawals above Rs 50,000 in a day (Section 231AB). ATL filers pay nothing." },
  ];
}

export function propertyFaq(r: RuleSet) {
  const pg = r.propertyGains!;
  return [
    { q: "What is the capital gains tax on property in Pakistan?", a: `For properties acquired on or after 1 July 2024, the gain is taxed at a flat ${pg.flatAtlPct}% if you are on the ATL when you sell. Non-filers pay normal slab rates on the gain, never below ${pg.flatAtlPct}%.` },
    { q: "Does the holding period still reduce property tax?", a: `Only for properties acquired before 1 July 2024. Under the old regime the rate fell with holding time — to 0% for plots held over 6 years, constructed property over 4 years, and flats over 2 years.` },
    { q: "Is the 236C withholding the same as capital gains tax?", a: "No. Section 236C is advance tax collected at transfer (2.75% filer / 11.5% non-filer of the value); capital gains tax under Section 37 is on your actual profit and is settled in your annual return, with the 236C amount adjustable against it." },
  ];
}

export function zakatFaq(r: RuleSet) {
  const z = r.zakat!;
  return [
    { q: `What is the Zakat nisab for ${z.zakatYear}?`, a: `The government notified the nisab at Rs ${z.nisab.toLocaleString("en-PK")} for ${z.zakatYear}. Banks deduct ${z.ratePct}% only from savings/PLS accounts holding at least this much on 1 Ramadan.` },
    { q: "How is Zakat calculated on cash and gold?", a: `Add cash, bank balances, gold, silver and business goods, subtract debts. If the net is at or above nisab, Zakat is ${z.ratePct}% of it.` },
    { q: "Can I stop the bank from deducting Zakat?", a: "Yes — file Form CZ-50 (a declaration on oath about your fiqh) with your bank before the deduction date, or keep the balance below nisab on 1 Ramadan. Current accounts are not subject to automatic deduction." },
  ];
}
