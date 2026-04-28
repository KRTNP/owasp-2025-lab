# Hard Challenge: Phantom Ledger

## Theme
A fintech internal portal with role-based access, background export jobs, and internal callback integrations.

## Difficulty
Hard (HTB-style)

## Player Objective
Obtain all flags by chaining vulnerabilities from low-privilege user to privileged internal data access.

## Flags
- `FLAG{ledger_entrypoint}` (user-level foothold)
- `FLAG{rbac_bypass_chain}` (authorization chain)
- `FLAG{internal_callback_pivot}` (SSRF/internal pivot)
- `FLAG{phantom_root}` (final objective)

## Expected Kill Chain (High-level)
1. Discover weak workflow and gain low-priv user access.
2. Abuse object-level authorization gap to access cross-tenant records.
3. Pivot through unsafe internal callback/URL fetch to reach internal admin interface.
4. Abuse trusted internal boundary assumptions to retrieve final flag.

## Run
```bash
cd ctf/hard-phantom-ledger/deploy
docker compose up -d --build
```

## Endpoints (planned)
- Public app: `http://localhost:7400`
- Internal service (not exposed externally in real setup): `http://internal-api:9000`

## Notes
This challenge is intentionally designed with false leads and noisy logs.
