# Lab Report: A01 Broken Access Control (Attempt 001)

## Metadata
- Date: 2026-04-28
- Category (OWASP): A01 Broken Access Control
- Target: Juice Shop (local)
- Environment: Docker local

## Objective
Validate whether object access is enforced server-side when resource identifiers are tampered.

## Reproduction Steps
1. Create two user accounts.
2. Login as User A.
3. Intercept a request that references object ID.
4. Replace ID with User B's object ID.
5. Send request and observe response.

## Evidence
- Pending execution

## Impact
If exploitable, attacker can read/modify other users' resources.

## Root Cause
Missing or weak server-side authorization checks for object ownership.

## Remediation
- Add authorization middleware for every object fetch/update endpoint.
- Validate ownership against authenticated user identity.
- Log and alert repeated access-denied attempts.

## Verification
- Replay tampered request after remediation.
- Confirm `403` and no unauthorized data returned.

## Lessons Learned
- Pending execution
