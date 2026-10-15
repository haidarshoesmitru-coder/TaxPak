export const rs = (n: number) => "Rs " + Math.round(n).toLocaleString("en-PK");
export const rs2 = (n: number) => "Rs " + n.toLocaleString("en-PK", { maximumFractionDigits: 2 });
export const pkr = (n: number) => "PKR " + Math.round(n).toLocaleString("en-PK");
export const pkr2 = (n: number) => "PKR " + n.toLocaleString("en-PK", { maximumFractionDigits: 2 });
export const pct = (r: number) => (r * 100).toFixed(0) + "%";
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "TaxPak",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
