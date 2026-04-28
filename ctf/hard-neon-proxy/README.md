# Hard Challenge: Neon Proxy

## Objective
Exploit edge proxy trust bugs to pivot into internal admin routes.

## Flags
- FLAG{proxy_foothold}
- FLAG{header_smuggle}
- FLAG{trust_boundary_break}
- FLAG{neon_root}

## Run
```bash
cd ctf/hard-neon-proxy/deploy
docker compose up -d --build
```

## Endpoint
- Public app: `http://localhost:7500`
