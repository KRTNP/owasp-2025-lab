# Hard Challenge: Cerberus Cache

## Objective
Exploit cache key confusion + poisoned trusted objects to escalate.

## Flags
- FLAG{cache_footprint}
- FLAG{key_confusion}
- FLAG{poisoned_object}
- FLAG{cerberus_root}

## Run
```bash
cd ctf/hard-cerberus-cache/deploy
docker compose up -d --build
```

## Endpoint
- Public app: `http://localhost:7600`
