# A01: Broken Access Control - Starter Lab

## Goal
Prove at least one access control weakness in a local training app and document remediation.

## Recommended Target
- Primary: OWASP Juice Shop (`http://localhost:3000`)
- Secondary: DVWA (`http://localhost:8081`)

## Setup
If Docker Compose works on your machine:
```bash
docker compose up -d juice-shop
```

If Docker Compose is unavailable, run direct Docker:
```bash
docker run -d --name owasp-juice-shop -p 3000:3000 bkimminich/juice-shop:latest
```

## Test Scenario (IDOR/BOLA style)
1. Register 2 users (User A, User B).
2. Log in as User A and capture traffic in Burp/ZAP.
3. Find request paths that include resource identifiers (order ID, basket ID, user ID).
4. Replace identifier with User B's object ID.
5. Observe if unauthorized read/update is possible.

## Evidence to Capture
- Request before/after tampering
- HTTP status code and response body
- Screenshot of unauthorized data/action

## Remediation Pattern
- Enforce object-level authorization on the server side.
- Never trust client-provided object IDs without ownership checks.
- Add deny-by-default policy and audit logging for access denial events.

## Verification
- Re-run tampered request after fix.
- Expected: `403` or sanitized error with no sensitive data disclosure.

## Deliverable
Create a writeup file:
- `notes/a01-broken-access-control-001.md`
