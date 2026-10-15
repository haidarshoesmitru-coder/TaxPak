export default function DeadlineBanner() {
  // Deadline guzarne ke baad khud ghaib ho jayega
  if (new Date() > new Date("2026-10-15T23:59:59+05:00")) return null;
  return (
    <div style={{ background: "linear-gradient(135deg,#0b5c36,#0e7a46)", color: "#fff", padding: "10px 16px", textAlign: "center", fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>
      ⏰ FBR deadline: Tax Year 2026 income tax returns must be filed by <u>15 October 2026</u> — late filing draws staged penalties (Rs 10,000 → 25,000 → 50,000).{" "}
      <a href="/income-tax-calculator" style={{ color: "#ffd76a", textDecoration: "underline" }}>Estimate your tax →</a>
    </div>
  );
}
