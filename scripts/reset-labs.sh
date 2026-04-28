#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[+] Stopping root lab compose (if any)"
(cd "$ROOT_DIR" && docker compose down --remove-orphans >/dev/null 2>&1 || true)

echo "[+] Stopping CTF compose projects"
for d in "$ROOT_DIR"/ctf/*/deploy; do
  [ -d "$d" ] || continue
  (cd "$d" && docker compose down --remove-orphans >/dev/null 2>&1 || true)
done

echo "[+] Removing known standalone containers"
docker rm -f owasp-juice-shop owasp-dvwa phantom-ledger-app phantom-ledger-internal neon-proxy-app neon-internal cerberus-app cerberus-internal >/dev/null 2>&1 || true

echo "[+] Resetting hint and scoreboard state"
cp "$ROOT_DIR/scoreboard/scoreboard.json" "$ROOT_DIR/scoreboard/scoreboard.json.bak" 2>/dev/null || true
cat > "$ROOT_DIR/scoreboard/scoreboard.json" << 'JSON'
{
  "users": [
    {
      "username": "player1",
      "solves": [],
      "score": 0
    }
  ],
  "challenges": [
    {"id": "phantom-ledger", "flags": 4, "max_points": 400},
    {"id": "neon-proxy", "flags": 4, "max_points": 400},
    {"id": "cerberus-cache", "flags": 4, "max_points": 400}
  ]
}
JSON
rm -f "$ROOT_DIR/hints/hint-state.json"

echo "[+] Lab reset complete"
