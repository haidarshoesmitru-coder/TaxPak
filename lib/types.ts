/** One salaried slab. `fixed` = official "Rs X +" amount = tax accumulated at the slab's lower bound. */
export type Slab = { upTo: number | null; rate: number; fixed: number };

export type Source = { label: string; ref?: string; verified: boolean };
export type Change = { area: "Income tax" | "Sales tax" | "Customs" | "WHT" | "Zakat"; title: string; body: string; verified: boolean };

/** One row of the filer vs non-filer withholding table. Percents, e.g. 15 = 15%. */
export type WhtRow = {
  section: string;      // "151", "231B" ...
  transaction: string;  // "Bank account profit"
  filerPct: number | null;    // null = not applicable / same-as-filer handled by equal values
  nonFilerPct: number | null;
  /** For rows where the non-filer rate depends on the amount (e.g. 236K by property value). */
  nonFilerTiers?: { upTo: number | null; pct: number }[];
  note?: string;
};

/** Section 37 capital-gains on immovable property. */
export type PropertyGains = {
  /** Cutoff: properties acquired on/after this ISO date use the flat regime. */
  flatRegimeFrom: string; // "2024-07-01"
  flatAtlPct: number;     // 15
  /** Old holding-period regime for properties acquired before the cutoff. */
  oldRegime: { type: "plot" | "constructed" | "flat"; label: string; slabs: { upToYears: number | null; pct: number }[] }[];
};

/** Zakat on cash-like assets. */
export type ZakatRules = {
  nisab: number;        // notified nisab in Rs for the zakat year
  ratePct: number;      // 2.5
  zakatYear: string;    // "1446-47 AH (2026)"
};

/** Everything that changes from one budget to the next lives in this one object. */
export type RuleSet = {
  fy: string;            // "2026-27"  (also the unique key)
  taxYear: number;       // 2027
  effectiveFrom: string; // ISO date
  actName: string;       // "Finance Act 2026"
  verifiedAt: string;    // ISO date: when a human last checked this against official text
  salaried: {
    slabs: Slab[];
    surcharge: { incomeAbove: number; rateOnTax: number } | null;
  };
  salesTax: { standardRatePct: number };
  customs: { landingChargePct: number; whtBaseIncludesSalesTax: boolean };
  /** Filer vs non-filer withholding table. Optional: older FY files may omit it. */
  withholding?: { rows: WhtRow[] };
  propertyGains?: PropertyGains;
  zakat?: ZakatRules;
  sources: Source[];
  changes: Change[];
};
