import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/format";
import DeadlineBanner from "@/components/DeadlineBanner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Pakistan Tax Calculators`, template: `%s | ${SITE.name}` },
  description: "Free Pakistan income tax, sales tax and customs duty calculators based on the latest Finance Act. Runs in your browser; nothing is stored.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_PK" },
};

const nav = [["/income-tax-calculator", "Income tax"], ["/sales-tax-calculator", "Sales tax"], ["/customs-duty-calculator", "Customs"], ["/withholding-tax-rates", "Filer vs non-filer"], ["/property-capital-gains", "Property gains"], ["/zakat-calculator", "Zakat"], ["/budget-changes", "Budget changes"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar"><div className="wrap">
          <Link className="brand" href="/">{SITE.name.slice(0, 3).toUpperCase()}<em>{SITE.name.slice(3).toUpperCase()}</em></Link>
          <nav aria-label="Main">{nav.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        </div></div>
        <DeadlineBanner />
        {children}
        <footer><div className="wrap">
          <p><b>Disclaimer:</b> these calculators give estimates for general information, not tax advice. Rates come from the notified Finance Act and can change by SRO. Confirm with FBR or a registered tax advisor before filing or paying.</p>
          <p style={{ marginTop: 8 }}>© {new Date().getFullYear()} {SITE.name}. Your inputs never leave your browser.</p>
        </div></footer>
      </body>
    </html>
  );
}
