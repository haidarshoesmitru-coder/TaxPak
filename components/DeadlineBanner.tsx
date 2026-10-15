export default function DeadlineBanner() {
  // Deadline guzarne ke baad khud ghaib ho jayega
  if (new Date() > new Date("2026-10-15T23:59:59+05:00")) return null;
  return (
    <div className="banner"><div className="wrap">
      <b>FBR deadline:</b> Tax Year 2026 income tax returns must be filed by <u>15 October 2026</u> — late filing draws staged penalties (Rs 10,000 → 25,000 → 50,000).{" "}
      <a href="/income-tax-calculator">Estimate your tax →</a>
    </div></div>
  );
}
