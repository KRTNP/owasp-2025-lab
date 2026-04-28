# OWASP Labs 2025 (Personal Training Repo)

This repository is a **local-only, legal training environment** for learning web security using OWASP-style labs.

## Scope and Rules

- Use only on `localhost` or systems you own and explicitly authorize.
- Do not test external targets without written permission.
- Keep this repo private by default.
- Never store real secrets or production credentials.

## Quick Start

1. Install Docker + Docker Compose.
2. Start a vulnerable training app:
   ```bash
   docker compose up -d juice-shop
   ```
3. Open the app:
   - Juice Shop: <http://localhost:3000>
4. Pick a lab folder in `labs/` and follow `LAB.md`.
5. Record your work in `notes/` using `templates/lab-report-template.md`.

## Repository Structure

- `labs/` - OWASP Top 10 lab tracks (A01-A10)
- `notes/` - your findings, writeups, and remediation notes
- `templates/` - reusable report/checklist templates
- `tools/` - optional helper scripts for setup/checks
- `docker-compose.yml` - local vulnerable targets for training

## Suggested Workflow Per Lab

1. Setup lab target
2. Reproduce vulnerability
3. Explain impact
4. Add mitigation/fix guidance
5. Verify the fix
6. Capture lessons learned

## Safety Checklist

- [ ] Repo visibility set to private
- [ ] `.env` and secrets are ignored
- [ ] Only local targets are used
- [ ] Notes include remediation, not only exploitation

## License

For educational use in controlled environments.
# owasp-2025-lab

## Extra Track

- `ctf/` - HTB-style challenge track (hard chain labs)

## Advanced CTF Extensions

- `ctf/` now includes 3 hard challenges: `phantom-ledger`, `neon-proxy`, `cerberus-cache`
- `scoreboard/` local scoring data and challenge flags
- `hints/` staged hint release data
- `scripts/scoreboard.py` local scoring CLI
- `scripts/hints.py` hint release/show CLI
- `scripts/reset-labs.sh` one-shot environment reset
- `.github/workflows/security.yml` secret scan + dependency scan + CodeQL
- `docs/player-guide/PLAYER-GUIDE.md` and `docs/challenge-authoring/AUTHOR-GUIDE.md`
