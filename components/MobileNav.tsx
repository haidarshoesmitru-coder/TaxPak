"use client";
import { useState } from "react";
import Link from "next/link";

const links = [["/income-tax-calculator", "Income tax"], ["/sales-tax-calculator", "Sales tax"], ["/customs-duty-calculator", "Customs"], ["/withholding-tax-rates", "Filer vs non-filer"], ["/property-capital-gains", "Property gains"], ["/zakat-calculator", "Zakat"], ["/budget-changes", "Budget changes"]];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
      </button>
      <div className={`drawer-back${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div className={`drawer${open ? " open" : ""}`} role="dialog" aria-label="Menu">
        <div className="dhead">
          <span className="brand" style={{ fontSize: "1.1rem" }}>PK<em>TAXHUB</em></span>
          <button className="burger" style={{ display: "block" }} aria-label="Close menu" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
        {links.map(([h, l]) => (
          <Link key={h} href={h} className="dlink" onClick={() => setOpen(false)}>{l}</Link>
        ))}
      </div>
    </>
  );
}
