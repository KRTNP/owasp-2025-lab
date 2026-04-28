# A05: Security Misconfiguration - Starter Lab

## Goal
Find unsafe defaults, verbose errors, exposed admin/debug surfaces.

## Scenario
Application or infrastructure runs with insecure config.

## Steps
1. Enumerate headers, routes, exposed files.
2. Check debug modes and stack traces.
3. Check default creds and admin endpoints.
4. Harden and verify settings.

## Evidence
- Missing security headers
- Exposed config/debug output
- Access to unintended endpoint

## Remediation
- Harden baseline config
- Disable debug in production profile
- Automate config checks in CI
