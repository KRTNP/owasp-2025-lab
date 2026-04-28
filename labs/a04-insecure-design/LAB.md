# A04: Insecure Design - Starter Lab

## Goal
Identify design-level control gaps (not just implementation bugs).

## Scenario
Business workflow misses abuse-case protections.

## Steps
1. Model critical workflows (password reset, transfer, role change).
2. Define abuse cases (race, replay, bypass approvals).
3. Execute abuse path in controlled local target.
4. Document missing control and secure design alternative.

## Evidence
- Workflow diagram + abused sequence
- Proof of bypassing intended process

## Remediation
- Add threat modeling in SDLC
- Add rate limits, step-up auth, and anti-automation controls
