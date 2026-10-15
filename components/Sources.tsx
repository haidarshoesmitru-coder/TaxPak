import type { RuleSet } from "@/lib/types";
export default function Sources({ r }: { r: RuleSet }) {
  return <div className="sources">
    <h3>Sources for FY {r.fy}</h3>
    <p className="sub">Last checked by a person on {r.verifiedAt}.</p>
    <ul>{r.sources.map((s) => <li key={s.label}>{s.label}<span className={`tag ${s.verified ? "ok" : ""}`}>{s.verified ? "Verified" : "Not yet verified"}</span>
      {s.ref && <div className="sub" style={{ margin: 0, fontSize: ".85rem" }}>{s.ref}</div>}</li>)}</ul>
  </div>;
}
