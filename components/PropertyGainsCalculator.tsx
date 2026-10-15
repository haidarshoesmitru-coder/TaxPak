"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { propertyGainsTax } from "@/lib/engine";
import { rs } from "@/lib/format";
import Seg from "./Seg";

export default function PropertyGainsCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const rules = rulesets[0];
  const pg = rules.propertyGains;
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [acquired, setAcquired] = useState("2025-01-01");
  const [ptype, setPtype] = useState<"plot" | "constructed" | "flat">("plot");
  const [years, setYears] = useState("3");
  const [atl, setAtl] = useState<"yes" | "no">("yes");

  if (!pg) return <div className="card"><p className="sub">Property gains data is not available for this fiscal year.</p></div>;

  const b = parseFloat(buy), s = parseFloat(sell), y = parseInt(years, 10);
  const bad = (buy !== "" && !(b >= 0)) || (sell !== "" && !(s >= 0)) || (years !== "" && !(y >= 0));
  const newRegime = acquired >= pg.flatRegimeFrom;
  const res = buy !== "" && sell !== "" && !bad && acquired
    ? propertyGainsTax({ buy: b, sell: s, acquiredISO: acquired, propType: ptype, holdingYears: isNaN(y) ? 0 : y, atl: atl === "yes" }, pg, rules.salaried)
    : null;

  return (
    <div className="card">
      <label htmlFor="pg-buy">Purchase price (Rs)</label>
      <input id="pg-buy" type="number" inputMode="numeric" min={0} step={100000} placeholder="e.g. 10000000" value={buy} onChange={(e) => setBuy(e.target.value)} />
      <label htmlFor="pg-sell">Sale price (Rs)</label>
      <input id="pg-sell" type="number" inputMode="numeric" min={0} step={100000} placeholder="e.g. 15000000" value={sell} onChange={(e) => setSell(e.target.value)} />
      <label htmlFor="pg-acq">Date acquired</label>
      <input id="pg-acq" type="date" value={acquired} max="2030-12-31" onChange={(e) => setAcquired(e.target.value)} />
      {!newRegime && <>
        <Seg value={ptype} onChange={setPtype} options={[["plot", "Open plot"], ["constructed", "Constructed"], ["flat", "Flat"]]} />
        <label htmlFor="pg-years">Years held</label>
        <input id="pg-years" type="number" inputMode="numeric" min={0} step={1} value={years} onChange={(e) => setYears(e.target.value)} />
      </>}
      <div style={{ marginTop: 12 }}>
        <Seg value={atl} onChange={setAtl} options={[["yes", "On ATL (filer)"], ["no", "Non-filer"]]} />
      </div>
      {bad && <p className="err" role="alert">Enter valid numbers.</p>}
      {res && (
        <div className="res" aria-live="polite">
          <div className="kpis">
            <div className="kpi"><small>Capital gain</small><b>{rs(res.gain)}</b></div>
            <div className="kpi"><small>Tax rate</small><b>{res.rate.toFixed(1)}%</b></div>
            <div className="kpi"><small>Gains tax</small><b>{rs(res.tax)}</b></div>
            <div className="kpi"><small>You keep</small><b>{rs(s - res.tax)}</b></div>
          </div>
          <p className="sub">{res.regime}. This is separate from the 236C advance tax collected at transfer, which adjusts against this liability.</p>
        </div>
      )}
    </div>
  );
}
