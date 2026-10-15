import type { MetadataRoute } from "next";
import { getRules } from "@/lib/rules";
import { SITE } from "@/lib/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latest] = await getRules();
  return ["", "/income-tax-calculator", "/sales-tax-calculator", "/customs-duty-calculator", "/withholding-tax-rates", "/property-capital-gains", "/zakat-calculator", "/budget-changes"]
    .map((p) => ({ url: SITE.url + p, lastModified: latest.verifiedAt, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 }));
}
