-- MIZ integrity and automatic score refresh
create or replace function public.refresh_claim_score_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_claim_score(coalesce(new.claim_id, old.claim_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists evidence_refresh_claim_score on public.evidence;
create trigger evidence_refresh_claim_score
after insert or update or delete on public.evidence
for each row execute function public.refresh_claim_score_trigger();

drop trigger if exists verification_refresh_claim_score on public.verifications;
create trigger verification_refresh_claim_score
after insert or update or delete on public.verifications
for each row execute function public.refresh_claim_score_trigger();

create index if not exists idx_needs_status_visibility_created on public.needs(status, visibility, created_at desc);
create index if not exists idx_claims_status_created on public.claims(status, created_at desc);
create index if not exists idx_sources_verified_authority on public.sources(verified, authority_level);
