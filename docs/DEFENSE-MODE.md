# Defense Mode

This repo supports two operating modes per challenge:
- `vuln`: intentionally vulnerable paths for offensive practice
- `fixed`: mitigated implementation for defensive validation

## Suggested Branch Strategy
- `main`: challenge source and infra
- `defense/fixed-baseline`: hardened baseline snapshots

## Verification
For each fix, document:
1. Attack request before fix
2. Blocked result after fix
3. Monitoring signal generated
