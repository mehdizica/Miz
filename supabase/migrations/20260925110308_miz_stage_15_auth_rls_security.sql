-- MIZ Stage 15: Auth + RLS + Security hardening
alter table public.categories enable row level security;
alter table public.need_groups enable row level security;
alter table public.need_group_memberships enable row level security;
alter table public.tags enable row level security;
alter table public.need_tags enable row level security;
alter table public.reputation_events enable row level security;

drop policy if exists "categories readable" on public.categories;
create policy "categories readable" on public.categories for select to anon, authenticated using (true);
drop policy if exists "tags readable" on public.tags;
create policy "tags readable" on public.tags for select to anon, authenticated using (true);
drop policy if exists "need groups readable" on public.need_groups;
create policy "need groups readable" on public.need_groups for select to anon, authenticated using (true);
drop policy if exists "need group memberships readable" on public.need_group_memberships;
create policy "need group memberships readable" on public.need_group_memberships for select to anon, authenticated using (true);
drop policy if exists "need tags readable" on public.need_tags;
create policy "need tags readable" on public.need_tags for select to anon, authenticated using (true);

drop policy if exists "profile owner insert" on public.profiles;
create policy "profile owner insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profile owner update" on public.profiles;
create policy "profile owner update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "need owner insert" on public.needs;
create policy "need owner insert" on public.needs for insert to authenticated with check ((select auth.uid()) = creator_id);
drop policy if exists "need owner update" on public.needs;
create policy "need owner update" on public.needs for update to authenticated using ((select auth.uid()) = creator_id) with check ((select auth.uid()) = creator_id);
drop policy if exists "need owner delete" on public.needs;
create policy "need owner delete" on public.needs for delete to authenticated using ((select auth.uid()) = creator_id);

drop policy if exists "claim author insert" on public.claims;
create policy "claim author insert" on public.claims for insert to authenticated with check ((select auth.uid()) = author_id);
drop policy if exists "claim author update" on public.claims;
create policy "claim author update" on public.claims for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
drop policy if exists "claim author delete" on public.claims;
create policy "claim author delete" on public.claims for delete to authenticated using ((select auth.uid()) = author_id);

drop policy if exists "evidence contributor insert" on public.evidence;
create policy "evidence contributor insert" on public.evidence for insert to authenticated with check (exists (select 1 from public.claims c where c.id=claim_id and c.author_id=(select auth.uid())));
drop policy if exists "evidence contributor update" on public.evidence;
create policy "evidence contributor update" on public.evidence for update to authenticated using (exists (select 1 from public.claims c where c.id=claim_id and c.author_id=(select auth.uid()))) with check (exists (select 1 from public.claims c where c.id=claim_id and c.author_id=(select auth.uid())));
drop policy if exists "evidence contributor delete" on public.evidence;
create policy "evidence contributor delete" on public.evidence for delete to authenticated using (exists (select 1 from public.claims c where c.id=claim_id and c.author_id=(select auth.uid())));

drop policy if exists "verifications readable" on public.verifications;
create policy "verifications readable" on public.verifications for select to anon, authenticated using (true);

drop policy if exists "reporter insert" on public.reports;
create policy "reporter insert" on public.reports for insert to authenticated with check ((select auth.uid()) = reporter_id);
drop policy if exists "reporter select own" on public.reports;
create policy "reporter select own" on public.reports for select to authenticated using ((select auth.uid()) = reporter_id);

drop policy if exists "notification owner read" on public.notifications;
create policy "notification owner read" on public.notifications for select to authenticated using ((select auth.uid()) = profile_id);
drop policy if exists "notification owner update" on public.notifications;
create policy "notification owner update" on public.notifications for update to authenticated using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);

revoke execute on function public.calculate_claim_score(uuid) from public, anon, authenticated;
revoke execute on function public.refresh_claim_score(uuid) from public, anon, authenticated;

create index if not exists idx_needs_creator_id on public.needs(creator_id);
create index if not exists idx_claims_author_id on public.claims(author_id);
create index if not exists idx_evidence_claim_id on public.evidence(claim_id);
create index if not exists idx_reports_reporter_id on public.reports(reporter_id);
create index if not exists idx_notifications_profile_id on public.notifications(profile_id);
create index if not exists idx_reputation_events_profile_id on public.reputation_events(profile_id);
