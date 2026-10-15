"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { incomeTax } from "@/lib/engine";
import { rs, pct } from "@/lib/format";
import Seg from "./Seg";
import FySelect from "./FySelect";

export default function IncomeCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const [fy, setFy] = useState(rulesets[0].fy);
  const [mode, setMode] = useState<"monthly" | "annual">("monthly");
  const [val, setVal] = useState("");
  const rules = rulesets.find((r) => r.fy === fy) ?? rulesets[0];
  const n = parseFloat(val), bad = val !== "" && !(n >= 0);
  const res = val !== "" && !bad ? incomeTax(mode === "monthly" ? n * 12 : n, rules.salaried) : null;
  return (
    <div className="card">
      <FySelect rulesets={rulesets} value={fy} onChange={setFy} />
      <Seg value={mode} onChange={setMode} options={[["monthly", "Monthly salary"], ["annual", "Annual salary"]]} />
      <label htmlFor="sal">Taxable salary (Rs)</label>
      <input id="sal" type="number" inputMode="numeric" min={0} step={1000} placeholder={mode === "monthly" ? "150000" : "1800000"} value={val} onChange={(e) => setVal(e.target.value)} />
      {bad && <p className="err" role="alert">Enter a valid amount.</p>}
      {res && <div className="res" aria-live="polite">
        <div className="kpis">
          <div className="kpi"><small>Tax / month</small><b>{rs(res.monthly)}</b></div>
          <div className="kpi"><small>Tax / year</small><b>{rs(res.total)}</b></div>
          <div className="kpi"><small>Take-home / month</small><b>{rs(res.takeHomeMonthly)}</b></div>
          <div className="kpi"><small>Effective rate</small><b>{(res.effective * 100).toFixed(2)}%</b></div>
        </div>
        <p className="sub">Marginal rate {pct(res.marginal)}: the tax on your next rupee.{res.annual <= rules.salaried.slabs[0].upTo! && " Your income is inside the tax-free threshold."}</p>
        {res.surcharge > 0 && <p className="sub">Includes surcharge of {rs(res.surcharge)}.</p>}
        <div className="tbl"><table><thead><tr><th>Slice</th><th>Rate</th><th className="n">Amount</th><th className="n">Tax</th></tr></thead><tbody>
          {res.rows.map((r, i) => <tr key={i}><td>{rs(r.from)} to {r.to === null ? "above" : rs(r.to)}</td><td>{pct(r.rate)}</td><td className="n">{rs(r.amount)}</td><td className="n">{rs(r.tax)}</td></tr>)}
        </tbody></table></div>
      </div>}
    </div>
  );
}
