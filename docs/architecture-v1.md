# MIZ Architecture v1

## Pipeline
User input → Need/Claim → Source → Evidence → Verification → Score → Reputation → Audit.

## Principle
MIZ does not turn a numerical confidence score into an absolute truth claim. Every score must remain traceable to evidence, source quality, reviewer input, freshness and contradictions.

## Core modules
1. Needs: structured demand records with urgency, region, budget and visibility.
2. Claims: atomic statements with lifecycle status.
3. Sources: provenance, publisher, authority and verification metadata.
4. Evidence: explicit supports/refutes/context relation between a claim and source.
5. Verification: human review records and rationale.
6. Claim Score V1: weighted evidence/reviewer/source/freshness model with contradiction penalty.
7. Reputation: event-based user history; never a permanent immutable label.
8. Reports: abuse/error reporting and review workflow.
9. Audit: append-only operational trail for sensitive changes.

## Security gates before public launch
- Enable authenticated user creation.
- Enforce RLS for every write path.
- Do not expose service-role keys to the browser.
- Rate-limit public APIs.
- Validate URLs and payload sizes.
- Add moderation and abuse reporting.
- Log score recalculations and reviewer actions.

## Next implementation block
Authentication + profile onboarding, then authenticated CRUD and RLS policies. After that: evidence dossier UI, reviewer queue, reputation calculation and abuse controls.
