# TaxPak: Pakistan tax calculators (Next.js 15, Supabase optional)

## Run
    npm install
    cp .env.example .env.local   # set NEXT_PUBLIC_SITE_NAME / NEXT_PUBLIC_SITE_URL
    npm run dev                  # http://localhost:3000
    npm test                     # engine + rules checks (no install needed beyond Node 22.18+)

## How it is organised
| Folder | Job |
|---|---|
| `lib/rules/` | ALL budget numbers, one file per fiscal year. The only thing you edit each budget. |
| `lib/engine.ts` | Pure maths (income tax, sales tax, customs). No rates inside. |
| `lib/rules/index.ts` | Loads local rules, optionally overridden by Supabase `tax_rules`. Skips any year that fails validation. |
| `lib/content.ts` | FAQ text generated from the rules, so it never goes stale. |
| `components/` | UI. Calculators take `rulesets`, show a fiscal-year dropdown automatically. |
| `components/fx/` | 3D animation layer: `HeroScene` (parallax floating cards), `Tilt` (hover tilt), `CountUp`. Purely visual; disabled for touch / reduced-motion. |
| `app/` | One SEO page per tool, plus sitemap, robots, budget-changes. |
| `supabase/migrations/` | Optional `tax_rules` table with RLS (public reads published only, admin writes). |

## Next budget checklist (about 15 minutes)
1. Read `lib/rules/_template.ts.txt`.
2. Copy `fy2026-27.ts` to `fy2027-28.ts`; update year, act name, slabs (`fixed` = official "Rs X +" figure).
3. `npm test`. A wrong `fixed` figure fails `validateSlabs`, and the site skips that year instead of showing wrong tax.
4. Set `verifiedAt` only after checking the gazette. Mark each source and change `verified` honestly.
5. Add the import to `LOCAL_RULES` in `lib/rules/index.ts`. Dropdown, slab table, FAQ, sitemap date and changes page update themselves.
6. No-redeploy option: insert a `published` row in Supabase `tax_rules` (same JSON shape as `RuleSet`).

## Before launch
- Set the real brand and domain in `.env.local` (name is read from `NEXT_PUBLIC_SITE_NAME`).
- Add favicon and an og:image in `app/` (`icon.png`, `opengraph-image.png`).
- Flip `verified: true` on sales tax and customs items only after checking the Act and SROs.
- Customs rates are user-entered; there is no HS-code lookup, and the site says so.
- `whtBaseIncludesSalesTax` follows how withholding tax at import is usually assessed. Confirm with a clearing agent.
