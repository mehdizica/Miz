-- MIZ Stage 16 performance hardening
drop policy if exists "public categories readable" on public.categories;
drop policy if exists "public memberships readable" on public.need_group_memberships;
drop policy if exists "public need groups readable" on public.need_groups;
drop policy if exists "public need tags readable" on public.need_tags;
drop policy if exists "public tags readable" on public.tags;
drop policy if exists "profile owner read" on public.profiles;
create policy "profile owner read" on public.profiles for select to authenticated using ((select auth.uid()) = id);

create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_categories_parent_id on public.categories(parent_id);
create index if not exists idx_claims_need_id on public.claims(need_id);
create index if not exists idx_need_group_memberships_need_id on public.need_group_memberships(need_id);
create index if not exists idx_need_groups_category_id on public.need_groups(category_id);
create index if not exists idx_need_tags_tag_id on public.need_tags(tag_id);
create index if not exists idx_needs_category_id on public.needs(category_id);
create index if not exists idx_reviews_report_id on public.reviews(report_id);
create index if not exists idx_reviews_reviewer_id on public.reviews(reviewer_id);
create index if not exists idx_verifications_reviewer_id on public.verifications(reviewer_id);