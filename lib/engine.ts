import type { RuleSet, Slab, WhtRow, PropertyGains, ZakatRules } from "./types";

/** Pure functions only: no UI, no network. Rates always come in via a RuleSet. */

export function incomeTax(annual: number, salaried: RuleSet["salaried"]) {
  let prev = 0, tax = 0, marginal = 0;
  const rows: { from: number; to: number | null; rate: number; amount: number; tax: number }[] = [];
  for (const s of salaried.slabs) {
    const top = s.upTo ?? Infinity;
    const amount = Math.min(annual, top) - prev;
    if (amount > 0) {
      const t = amount * s.rate;
      tax += t; marginal = s.rate;
      rows.push({ from: prev, to: s.upTo, rate: s.rate, amount, tax: t });
    }
    if (annual <= top) break;
    prev = top;
  }
  const sc = salaried.surcharge;
  const surcharge = sc && annual > sc.incomeAbove ? tax * sc.rateOnTax : 0;
  const total = tax + surcharge;
  return {
    annual, tax, surcharge, total, rows, marginal,
    monthly: total / 12,
    takeHomeMonthly: (annual - total) / 12,
    effective: annual > 0 ? total / annual : 0,
  };
}

/** Guard against typos when adding next year's slabs. Returns a list of problems (empty = OK). */
export function validateSlabs(slabs: Slab[]): string[] {
  const errs: string[] = [];
  let prev = 0, cum = 0;
  slabs.forEach((s, i) => {
    const last = i === slabs.length - 1;
    if (Math.abs(s.fixed - cum) > 0.5) errs.push(`Slab ${i + 1}: fixed=${s.fixed} but cumulative tax is ${cum}`);
    if (last !== (s.upTo === null)) errs.push(`Slab ${i + 1}: only the last slab may have upTo = null`);
    if (s.upTo !== null) {
      if (s.upTo <= prev) errs.push(`Slab ${i + 1}: upTo must be greater than the previous bound`);
      cum += (s.upTo - prev) * s.rate;
      prev = s.upTo;
    }
  });
  return errs;
}

export function salesTax(amount: number, ratePct: number, mode: "exclusive" | "inclusive") {
  const r = ratePct / 100;
  if (mode === "exclusive") return { base: amount, tax: amount * r, total: amount * (1 + r) };
  const base = amount / (1 + r);
  return { base, tax: amount - base, total: amount };
}

export type CustomsInput = { cif: number; cd: number; acd: number; rd: number; fed: number; ast: number; wht: number };

export function customs(i: CustomsInput, rules: RuleSet) {
  const st = rules.salesTax.standardRatePct;
  const av = i.cif * (1 + rules.customs.landingChargePct / 100);
  const cd = (av * i.cd) / 100, acd = (av * i.acd) / 100, rd = (av * i.rd) / 100;
  const fedBase = av + cd + acd + rd, fed = (fedBase * i.fed) / 100;
  const stBase = fedBase + fed;
  const stA = (stBase * st) / 100, ast = (stBase * i.ast) / 100;
  const whtBase = rules.customs.whtBaseIncludesSalesTax ? stBase + stA : stBase;
  const wht = (whtBase * i.wht) / 100;
  const total = cd + acd + rd + fed + stA + ast + wht;
  return {
    av, total, landed: i.cif + total, burdenPct: i.cif > 0 ? (total / i.cif) * 100 : 0,
    lines: [
      { label: `Customs duty (${i.cd}%)`, how: "AV × rate", amount: cd },
      { label: `Additional customs duty (${i.acd}%)`, how: "AV × rate", amount: acd },
      { label: `Regulatory duty (${i.rd}%)`, how: "AV × rate", amount: rd },
      { label: `Federal excise duty (${i.fed}%)`, how: "(AV + duties) × rate", amount: fed },
      { label: `Sales tax (${st}%)`, how: "(AV + duties + FED) × rate", amount: stA },
      { label: `Additional sales tax (${i.ast}%)`, how: "(AV + duties + FED) × rate", amount: ast },
      { label: `Withholding income tax (${i.wht}%)`, how: rules.customs.whtBaseIncludesSalesTax ? "(AV + duties + FED + sales tax) × rate" : "(AV + duties + FED) × rate", amount: wht },
    ],
  };
}

/* ---------------- Withholding tax (filer vs non-filer) ---------------- */

/** Guard against typos in the WHT table. Returns problems (empty = OK). */
export function validateWhtRows(rows: WhtRow[]): string[] {
  const errs: string[] = [];
  rows.forEach((r, i) => {
    for (const [k, v] of [["filerPct", r.filerPct], ["nonFilerPct", r.nonFilerPct]] as const) {
      if (v !== null && (v < 0 || v > 100)) errs.push(`WHT row ${i + 1} (${r.section}): ${k} out of range`);
    }
    if (r.nonFilerTiers) {
      let prev = 0;
      r.nonFilerTiers.forEach((t, j) => {
        const last = j === r.nonFilerTiers!.length - 1;
        if (last !== (t.upTo === null)) errs.push(`WHT row ${i + 1} (${r.section}): only the last tier may have upTo = null`);
        if (t.upTo !== null) {
          if (t.upTo <= prev) errs.push(`WHT row ${i + 1} (${r.section}): tiers must ascend`);
          prev = t.upTo;
        }
        if (t.pct < 0 || t.pct > 100) errs.push(`WHT row ${i + 1} (${r.section}): tier pct out of range`);
      });
    }
  });
  return errs;
}

/** Withholding on a payment amount, filer vs non-filer. */
export function whtOn(amount: number, row: WhtRow) {
  const filer = row.filerPct === null ? null : (amount * row.filerPct) / 100;
  let nonFilerPct = row.nonFilerPct;
  if (row.nonFilerTiers) {
    nonFilerPct = row.nonFilerTiers.find((t) => t.upTo === null || amount <= t.upTo)!.pct;
  }
  const nonFiler = nonFilerPct === null ? null : (amount * nonFilerPct) / 100;
  return { filer, nonFiler, filerPct: row.filerPct, nonFilerPct };
}

/* ---------------- Property capital gains (Section 37) ---------------- */

export type PropertyGainsInput = {
  buy: number;
  sell: number;
  /** ISO date the property was acquired, e.g. "2023-05-14" */
  acquiredISO: string;
  propType: "plot" | "constructed" | "flat";
  /** Whole years held (only used for pre-cutoff acquisitions) */
  holdingYears: number;
  atl: boolean;
};

/**
 * Capital-gains tax on immovable property (Section 37).
 * - Acquired on/after flatRegimeFrom: flat rate for ATL; non-ATL individuals pay
 *   normal slab rates on the gain with a 15% floor.
 * - Acquired before: the old holding-period table by property type.
 */
export function propertyGainsTax(inp: PropertyGainsInput, pg: PropertyGains, salaried: RuleSet["salaried"]) {
  const gain = inp.sell - inp.buy;
  if (gain <= 0) return { gain, rate: 0, tax: 0, regime: "No gain — no capital-gains tax." as const };
  if (inp.acquiredISO >= pg.flatRegimeFrom) {
    if (inp.atl) return { gain, rate: pg.flatAtlPct, tax: (gain * pg.flatAtlPct) / 100, regime: `Flat ${pg.flatAtlPct}% (ATL, acquired on/after ${pg.flatRegimeFrom})` as const };
    const slabTax = incomeTax(gain, salaried).total;
    const slabRate = (slabTax / gain) * 100;
    const rate = Math.max(slabRate, pg.flatAtlPct);
    return { gain, rate, tax: (gain * rate) / 100, regime: `Non-ATL: normal slab rates on the gain, minimum ${pg.flatAtlPct}%` as const };
  }
  const table = pg.oldRegime.find((t) => t.type === inp.propType)!;
  const slab = table.slabs.find((s) => s.upToYears === null || inp.holdingYears <= s.upToYears)!;
  return { gain, rate: slab.pct, tax: (gain * slab.pct) / 100, regime: `Old holding-period regime (${table.label}, held ${inp.holdingYears} yrs)` as const };
}

/* ---------------- Zakat ---------------- */

export type ZakatInput = { cash: number; bank: number; gold: number; silver: number; goods: number; debts: number };

/** Zakat on cash-like assets: 2.5% of net zakatable assets at/above nisab. */
export function zakatCalc(inp: ZakatInput, z: ZakatRules) {
  const gross = inp.cash + inp.bank + inp.gold + inp.silver + inp.goods;
  const net = Math.max(0, gross - inp.debts);
  const eligible = net >= z.nisab;
  const zakat = eligible ? (net * z.ratePct) / 100 : 0;
  return { gross, net, eligible, zakat, nisab: z.nisab, ratePct: z.ratePct };
}
