import type { Metadata } from "next";
import { getRules } from "@/lib/rules";

export const revalidate = 3600;
export const metadata: Metadata = { title: "What Changed in the Budget", description: "Plain-language summary of tax changes in each Pakistan federal budget.", alternates: { canonical: "/budget-changes" } };

export default async function Page() {
  const rules = (await getRules()).filter((r) => r.changes.length);
  return (<main className="wrap"><section className="block">
    <h1 className="pagetitle">What changed in the budget</h1>
    <p className="sub">Items marked &ldquo;Not yet verified&rdquo; still need checking against the official text.</p>
    {rules.map((r) => <div key={r.fy} style={{ marginTop: 24 }}><h2>{r.actName} (FY {r.fy})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginTop: 12 }}>{r.changes.map((c) => <div className="card" key={c.title}>
        <small style={{ fontWeight: 800, color: "var(--pine-700)", letterSpacing: ".08em" }}>{c.area.toUpperCase()}</small>
        <h3>{c.title}<span className={`tag ${c.verified ? "ok" : ""}`}>{c.verified ? "Verified" : "Not yet verified"}</span></h3><p>{c.body}</p></div>)}</div></div>)}
  </section></main>);
}
