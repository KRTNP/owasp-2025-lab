# A07: Identification and Authentication Failures - Starter Lab

## Goal
Assess weaknesses in authentication/session handling.

## Scenario
Login/session controls allow brute force, weak reset, or session abuse.

## Steps
1. Test account lockout/rate limits.
2. Inspect reset flows for token quality and expiry.
3. Validate session invalidation on logout/password change.
4. Check MFA coverage (if present).

## Evidence
- Unlimited attempts or weak reset mechanics
- Session remains valid after logout/change

## Remediation
- Rate limiting and lockout strategy
- Strong reset tokens with short TTL
- Proper session rotation/invalidation
