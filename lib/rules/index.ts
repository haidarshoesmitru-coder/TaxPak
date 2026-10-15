import type { RuleSet } from "../types";
import { validateSlabs } from "../engine";
import { fy202627 } from "./fy2026-27";
import { fy202526 } from "./fy2025-26";

/** Add next year's ruleset here. Order does not matter: newest FY is sorted first. */
export const LOCAL_RULES: RuleSet[] = [fy202627, fy202526];

/**
 * Local files are the safe default. If Supabase env vars exist, published rows in `tax_rules`
 * override local rules with the same fy (or add new years) with no redeploy.
 * Uses plain REST + ISR cache, so there is no extra npm dependency.
 */
export async function getRules(): Promise<RuleSet[]> {
  const byFy = new Map(LOCAL_RULES.map((r) => [r.fy, r]));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/tax_rules?select=data&status=eq.published`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 3600 },
      });
      if (res.ok) for (const row of (await res.json()) as { data: RuleSet }[]) byFy.set(row.data.fy, row.data);
    } catch { /* fall back to local rules */ }
  }
  const valid = [...byFy.values()].filter((r) => {
    const errs = validateSlabs(r.salaried.slabs);
    if (errs.length) console.error(`[rules] FY ${r.fy} skipped:`, errs);
    return errs.length === 0;
  });
  return valid.sort((a, b) => b.fy.localeCompare(a.fy));
}
