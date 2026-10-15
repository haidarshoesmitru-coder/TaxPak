import type { RuleSet } from "@/lib/types";
import { rs, pct } from "@/lib/format";
export default function SlabTable({ r }: { r: RuleSet }) {
  const s = r.salaried.slabs;
  return <div className="tbl"><table><thead><tr><th>Annual taxable income</th><th>Rate</th><th>Tax</th></tr></thead><tbody>
    {s.map((x, i) => { const lo = i === 0 ? 0 : s[i - 1].upTo!;
      return <tr key={i}><td>{x.upTo === null ? `Above ${rs(lo)}` : i === 0 ? `Up to ${rs(x.upTo)}` : `${rs(lo + 1)} to ${rs(x.upTo)}`}</td><td>{pct(x.rate)}</td>
        <td>{i === 0 ? "No tax" : x.fixed ? `${rs(x.fixed)} + ${pct(x.rate)} of the amount above ${rs(lo)}` : `${pct(x.rate)} of the amount above ${rs(lo)}`}</td></tr>; })}
  </tbody></table></div>;
}
