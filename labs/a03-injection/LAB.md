# A03: Injection - Starter Lab

## Goal
Demonstrate query/command injection and prove secure parameterization fixes it.

## Scenario
User input reaches query or shell context unsafely.

## Steps
1. Locate user-controlled input points.
2. Test with harmless payloads (`'`, `"`, `;`, boolean conditions).
3. Confirm behavior change (error/data leak/auth bypass).
4. Retest after parameterized query or input handling.

## Evidence
- Request payload and response differences
- Error traces or modified result set

## Remediation
- Parameterized statements only
- No string concatenation for queries/commands
- Input validation as secondary control
