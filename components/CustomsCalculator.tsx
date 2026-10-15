"use client";
import { useState } from "react";
import type { RuleSet } from "@/lib/types";
import { customs } from "@/lib/engine";
import { rs } from "@/lib/format";
import FySelect from "./FySelect";

const FIELDS = [["cd", "Customs duty %", "10"], ["acd", "Additional customs duty %", "2"], ["rd", "Regulatory duty %", "0"], ["fed", "Federal excise duty %", "0"], ["ast", "Additional sales tax %", "0"], ["wht", "Withholding income tax %", "5"]] as const;

export default function CustomsCalculator({ rulesets }: { rulesets: RuleSet[] }) {
  const [fy, setFy] = useState(rulesets[0].fy);
  const rules = rulesets.find((r) => r.fy === fy) ?? rulesets[0];
  const [cif, setCif] = useState("");
  const [v, setV] = useState<Record<string, string>>(Object.fromEntries(FIELDS.map(([k, , d]) => [k, d])));
  const num = (s: string) => { const x = parseFloat(s); return x >= 0 ? x : 0; };
  const c = parseFloat(cif), bad = cif !== "" && !(c > 0);
  const res = cif !== "" && !bad ? customs({ cif: c, cd: num(v.cd), acd: num(v.acd), rd: num(v.rd), fed: num(v.fed), ast: num(v.ast), wht: num(v.wht) }, rules) : null;
  return (
    <div className="card">
      <FySelect rulesets={rulesets} value={fy} onChange={setFy} />
      <label htmlFor="cif">CIF value of goods (Rs)</label>
      <input id="cif" type="number" inputMode="numeric" min={0} placeholder="1000000" value={cif} onChange={(e) => setCif(e.target.value)} />
      {bad && <p className="err" role="alert">Enter the CIF value as a positive number.</p>}
      <div className="row2">{FIELDS.map(([k, l]) => <div key={k}><label htmlFor={k}>{l}</label>
        <input id={k} type="number" inputMode="decimal" min={0} step={0.5} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></div>)}</div>
      <p className="sub" style={{ marginTop: 10 }}>Duty rates depend on the HS code. Enter the rates from the Customs Tariff or your clearing agent; this tool does not look them up.</p>
      {res && <div className="res" aria-live="polite">
        <div className="kpis">
          <div className="kpi"><small>Landed cost</small><b>{rs(res.landed)}</b></div>
          <div className="kpi"><small>Total duties and taxes</small><b>{rs(res.total)}</b></div>
          <div className="kpi"><small>Burden</small><b>{res.burdenPct.toFixed(1)}% of CIF</b></div></div>
        <div className="tbl"><table><tbody>
          <tr><td><b>Assessable value</b><br /><small>CIF + {rules.customs.landingChargePct}% landing charges</small></td><td className="n">{rs(res.av)}</td></tr>
          {res.lines.map((l) => <tr key={l.label}><td><b>{l.label}</b><br /><small>{l.how}</small></td><td className="n">{rs(l.amount)}</td></tr>)}
        </tbody></table></div></div>}
    </div>
  );
}
