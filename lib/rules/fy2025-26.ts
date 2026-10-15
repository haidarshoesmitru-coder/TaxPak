import type { RuleSet } from "../types";

export const fy202526: RuleSet = {
  fy: "2025-26",
  taxYear: 2026,
  effectiveFrom: "2025-07-01",
  actName: "Finance Act 2025",
  verifiedAt: "2026-10-13",
  salaried: {
    slabs: [
      { upTo: 600_000, rate: 0, fixed: 0 },
      { upTo: 1_200_000, rate: 0.01, fixed: 0 },
      { upTo: 2_200_000, rate: 0.11, fixed: 6_000 },
      { upTo: 3_200_000, rate: 0.23, fixed: 116_000 },
      { upTo: 4_100_000, rate: 0.3, fixed: 346_000 },
      { upTo: null, rate: 0.35, fixed: 616_000 },
    ],
    surcharge: { incomeAbove: 10_000_000, rateOnTax: 0.09 },
  },
  salesTax: { standardRatePct: 18 },
  customs: { landingChargePct: 1, whtBaseIncludesSalesTax: true },
  sources: [
    { label: "Finance Act 2025: salaried slabs and 9% surcharge", ref: "Prior-year slabs shown for comparison and for returns for tax year 2026.", verified: false },
  ],
  changes: [],
};
