-- Optional: lets you publish next budget's rates from the Supabase dashboard (or a future admin panel)
-- without redeploying. `data` holds one RuleSet JSON object (see lib/types.ts).
create table if not exists public.tax_rules (
  fy          text primary key,                       -- '2027-28'
  status      text not null default 'draft' check (status in ('draft','published')),
  data        jsonb not null,
  verified_at date,
  updated_at  timestamptz not null default now()
);

alter table public.tax_rules enable row level security;

-- Anyone can read PUBLISHED rows only. Drafts stay private.
create policy "public reads published rules" on public.tax_rules
  for select to anon, authenticated using (status = 'published');

-- Only admins (app_metadata.role = 'admin') can read drafts and write.
create policy "admins manage rules" on public.tax_rules
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.tax_rules to anon, authenticated;
grant insert, update, delete on public.tax_rules to authenticated;
