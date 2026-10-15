// Static stats — plain numbers rendered on the server. No animation, no
// client JS, so they can never get stuck at 0.
const items = [
  { value: "6", label: "Precision calculators" },
  { value: "8", label: "Income tax slabs tracked" },
  { value: "18%", label: "Standard GST rate" },
  { value: "6", label: "Duty types in customs estimator" },
];

export default function Stats() {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stat" key={s.label}>
          <div className="v">{s.value}</div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
