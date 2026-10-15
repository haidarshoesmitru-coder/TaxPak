"use client";
import type { RuleSet } from "@/lib/types";
export default function FySelect({ rulesets, value, onChange }: { rulesets: RuleSet[]; value: string; onChange: (fy: string) => void }) {
  if (rulesets.length < 2) return <p className="sub">Rates for FY {value} ({rulesets[0].actName})</p>;
  return <><label htmlFor="fy">Fiscal year</label>
    <select id="fy" value={value} onChange={(e) => onChange(e.target.value)}>{rulesets.map((r) => <option key={r.fy} value={r.fy}>FY {r.fy} ({r.actName})</option>)}</select></>;
}
