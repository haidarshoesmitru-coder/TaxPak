import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/format";
import DeadlineBanner from "@/components/DeadlineBanner";
import MobileNav from "@/components/MobileNav";

const ogTitle = "PKTaxHub | Pakistan Tax, GST & Customs Calculators (FY 2026-27)";
const ogDesc = "Calculate Income Tax, Sales Tax (GST), Customs Duties, Property Capital Gains and Zakat instantly with accurate FBR slabs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: ogTitle, template: `%s | PKTaxHub` },
  description: ogDesc,
  openGraph: { siteName: "PKTaxHub", type: "website", locale: "en_PK", title: ogTitle, description: ogDesc },
  twitter: { card: "summary_large_image", title: ogTitle, description: ogDesc },
};

const nav = [["/income-tax-calculator", "Income tax"], ["/sales-tax-calculator", "Sales tax"], ["/customs-duty-calculator", "Customs"], ["/withholding-tax-rates", "Filer vs non-filer"], ["/property-capital-gains", "Property gains"], ["/zakat-calculator", "Zakat"], ["/budget-changes", "Budget changes"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="utilbar"><div className="wrap">
          <span className="livedot" aria-hidden="true" />
          <span><strong>Live</strong> <span className="sep">·</span> FY 2026-27 <span className="sep">·</span> Finance Act 2026 <span className="sep">·</span> rates verified 13 Oct 2026</span>
        </div></div>
        <div className="masthead"><div className="wrap">
          <Link className="brand" href="/">PK<em>TAXHUB</em></Link>
          <nav className="mainnav" aria-label="Main">{nav.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
          <MobileNav />
        </div></div>
        <DeadlineBanner />
        {children}
        <footer><div className="wrap footgrid">
          <div>
            <p><b style={{ color: "#fff" }}>Disclaimer:</b> these calculators give estimates for general information, not tax advice. Rates come from the notified Finance Act and can change by SRO. Confirm with FBR or a registered tax advisor before filing or paying.</p>
          </div>
          <div>
            <p>© {new Date().getFullYear()} PKTaxHub. Your inputs never leave your browser.</p>
            <p style={{ marginTop: 8 }}><Link href="/budget-changes">Budget changes</Link></p>
          </div>
        </div></footer>
      </body>
    </html>
  );
}
