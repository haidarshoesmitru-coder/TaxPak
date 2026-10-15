"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { salesTax } from "@/lib/engine";
import { rs2 } from "@/lib/format";
import Seg from "./Seg";
import FySelect from "./FySelect";

export default function SalesCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const [fy, setFy] = useState(rulesets[0].fy);
  const rules = rulesets.find((r) => r.fy === fy) ?? rulesets[0];
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [amt, setAmt] = useState(""), [rate, setRate] = useState<string | null>(null);
  const rateStr = rate ?? String(rules.salesTax.standardRatePct);
  const a = parseFloat(amt), r = parseFloat(rateStr);
  const badA = amt !== "" && !(a >= 0), badR = !(r >= 0 && r <= 100);
  const res = amt !== "" && !badA && !badR ? salesTax(a, r, mode) : null;
  return (
    <div className="card">
      <FySelect rulesets={rulesets} value={fy} onChange={(v) => { setFy(v); setRate(null); }} />
      <Seg value={mode} onChange={setMode} options={[["exclusive", "Add tax to price"], ["inclusive", "Price includes tax"]]} />
      <div className="row2">
        <div><label htmlFor="amt">Amount (Rs)</label><input id="amt" type="number" inputMode="decimal" min={0} placeholder="10000" value={amt} onChange={(e) => setAmt(e.target.value)} /></div>
        <div><label htmlFor="rate">GST rate (%)</label><input id="rate" type="number" inputMode="decimal" min={0} max={100} step={0.1} value={rateStr} onChange={(e) => setRate(e.target.value)} /></div>
      </div>
      {(badA || badR) && <p className="err" role="alert">{badA ? "Enter a valid amount." : "Rate must be between 0 and 100."}</p>}
      {res && <div className="res" aria-live="polite"><div className="kpis">
        <div className="kpi"><small>Total</small><b>{rs2(res.total)}</b></div>
        <div className="kpi"><small>Sales tax</small><b>{rs2(res.tax)}</b></div>
        <div className="kpi"><small>Price before tax</small><b>{rs2(res.base)}</b></div></div></div>}
    </div>
  );
}
