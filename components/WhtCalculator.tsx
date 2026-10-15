"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { whtOn } from "@/lib/engine";
import { rs, pct } from "@/lib/format";
import Seg from "./Seg";

export default function WhtCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const rules = rulesets[0];
  const rows = rules.withholding?.rows ?? [];
  const [idx, setIdx] = useState("0");
  const [amt, setAmt] = useState("");
  const [atl, setAtl] = useState<"filer" | "nonfiler">("filer");

  const row = rows[parseInt(idx, 10)];
  const n = parseFloat(amt);
  const bad = amt !== "" && !(n >= 0);
  const res = row && amt !== "" && !bad ? whtOn(n, row) : null;
  const mine = res ? (atl === "filer" ? res.filer : res.nonFiler) : null;
  const minePct = res ? (atl === "filer" ? res.filerPct : res.nonFilerPct) : null;

  return (
    <div className="card">
      <label htmlFor="wht-tx">Transaction</label>
      <select id="wht-tx" value={idx} onChange={(e) => setIdx(e.target.value)}>
        {rows.map((r, i) => <option key={i} value={i}>Sec {r.section} — {r.transaction}</option>)}
      </select>
      <label htmlFor="wht-amt">Amount (Rs)</label>
      <input id="wht-amt" type="number" inputMode="numeric" min={0} step={1000} placeholder="e.g. 1000000" value={amt} onChange={(e) => setAmt(e.target.value)} />
      <div style={{ marginTop: 12 }}>
        <Seg value={atl} onChange={setAtl} options={[["filer", "I'm a filer (ATL)"], ["nonfiler", "Non-filer"]]} />
      </div>
      {bad && <p className="err" role="alert">Enter a valid amount.</p>}
      {row?.note && <p className="sub" style={{ marginTop: 8 }}>{row.note}.</p>}
      {res && mine !== null && (
        <div className="res" aria-live="polite">
          <div className="kpis">
            <div className="kpi"><small>Your withholding ({atl === "filer" ? "filer" : "non-filer"}{minePct !== null ? ` ${pct(minePct / 100)}` : ""})</small><b>{rs(mine)}</b></div>
            <div className="kpi"><small>Filer would pay</small><b>{res.filer === null ? "—" : rs(res.filer)}</b></div>
            <div className="kpi"><small>Non-filer pays</small><b>{res.nonFiler === null ? "—" : rs(res.nonFiler)}</b></div>
            <div className="kpi"><small>You receive</small><b>{rs(n - mine)}</b></div>
          </div>
          {res.filer !== null && res.nonFiler !== null && res.nonFiler > res.filer && atl === "nonfiler" && (
            <p className="sub">Filing your return and joining the ATL would save you {rs(res.nonFiler - res.filer)} on this transaction.</p>
          )}
        </div>
      )}
    </div>
  );
}
