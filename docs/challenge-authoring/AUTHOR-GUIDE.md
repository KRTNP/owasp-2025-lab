# Challenge Author Guide

## Required Files
- `README.md` with story, objectives, run instructions
- `challenge/SCENARIO.md`, `OBJECTIVES.md`, `HINTS.md`, `FLAG-SPEC.md`
- `deploy/docker-compose.yml`
- `writeup-template/WRITEUP.md`

## Difficulty Rubric (Hard)
- 3+ exploit steps
- At least 1 trust-boundary pivot
- 1-2 false leads
- Explicit remediation mapping to OWASP

## Defense Mode
Maintain 2 branches/variants:
- `vuln` behavior for challenge play
- `fixed` behavior for remediation verification

## Quality Checklist
- Deterministic deployment
- No accidental internet dependency
- Flags unique and non-guessable
- Clear intended path + at least one alternate path
