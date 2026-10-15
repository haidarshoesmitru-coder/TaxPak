"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { zakatCalc } from "@/lib/engine";
import { rs } from "@/lib/format";

const FIELDS = [
  ["cash", "Cash in hand (Rs)"],
  ["bank", "Bank balances (Rs)"],
  ["gold", "Gold value (Rs)"],
  ["silver", "Silver value (Rs)"],
  ["goods", "Business goods / stock (Rs)"],
  ["debts", "Debts you owe (Rs)"],
] as const;

export default function ZakatCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const rules = rulesets[0];
  const z = rules.zakat;
  const [vals, setVals] = useState<Record<string, string>>({});

  if (!z) return <div className="card"><p className="sub">Zakat data is not available for this fiscal year.</p></div>;

  const nums: Record<string, number> = {};
  let bad = false;
  for (const [k] of FIELDS) {
    const v = vals[k] ?? "";
    const n = v === "" ? 0 : parseFloat(v);
    if (v !== "" && !(n >= 0)) bad = true;
    nums[k] = isNaN(n) ? 0 : n;
  }
  const res = !bad ? zakatCalc({ cash: nums.cash, bank: nums.bank, gold: nums.gold, silver: nums.silver, goods: nums.goods, debts: nums.debts }, z) : null;

  return (
    <div className="card">
      {FIELDS.map(([k, label]) => (
        <div key={k}>
          <label htmlFor={`zk-${k}`}>{label}</label>
          <input id={`zk-${k}`} type="number" inputMode="numeric" min={0} step={1000} placeholder="0"
            value={vals[k] ?? ""} onChange={(e) => setVals((v) => ({ ...v, [k]: e.target.value }))} />
        </div>
      ))}
      <p className="sub" style={{ marginTop: 8, fontSize: ".82rem" }}>Nisab for {z.zakatYear}: {rs(z.nisab)} (notified).</p>
      {bad && <p className="err" role="alert">Enter valid numbers.</p>}
      {res && (
        <div className="res" aria-live="polite">
          <div className="kpis">
            <div className="kpi"><small>Net zakatable assets</small><b>{rs(res.net)}</b></div>
            <div className="kpi"><small>Nisab</small><b>{rs(res.nisab)}</b></div>
            <div className="kpi"><small>Zakat payable ({res.ratePct}%)</small><b>{rs(res.zakat)}</b></div>
            <div className="kpi"><small>Status</small><b>{res.eligible ? "Due" : "Not due"}</b></div>
          </div>
          {!res.eligible && <p className="sub">Your net assets are below nisab, so no Zakat is due on these assets.</p>}
        </div>
      )}
    </div>
  );
}
