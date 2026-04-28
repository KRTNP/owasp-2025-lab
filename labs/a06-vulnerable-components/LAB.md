# A06: Vulnerable and Outdated Components - Starter Lab

## Goal
Identify known-vulnerable dependencies and patch safely.

## Scenario
Project includes old libraries with known CVEs.

## Steps
1. Generate dependency inventory.
2. Scan for CVEs (`npm audit` or SCA tool).
3. Evaluate exploitability in this app context.
4. Upgrade dependency and run regression checks.

## Evidence
- Dependency + CVE mapping
- Before/after version and risk reduction

## Remediation
- Pin supported versions
- Add scheduled dependency review
- Fail CI on critical vulnerable packages
