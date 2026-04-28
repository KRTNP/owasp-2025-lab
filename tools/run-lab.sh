#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-juice-shop}"

if docker compose version >/dev/null 2>&1; then
  echo "[+] Starting with docker compose: ${TARGET}"
  docker compose up -d "${TARGET}"
  docker compose ps
  exit 0
fi

echo "[!] docker compose not found, falling back to docker run"

case "$TARGET" in
  juice-shop)
    docker rm -f owasp-juice-shop >/dev/null 2>&1 || true
    docker run -d --name owasp-juice-shop -p 3000:3000 bkimminich/juice-shop:latest
    docker ps --filter "name=owasp-juice-shop"
    ;;
  dvwa)
    docker rm -f owasp-dvwa >/dev/null 2>&1 || true
    docker run -d --name owasp-dvwa -p 8081:80 vulnerables/web-dvwa:latest
    docker ps --filter "name=owasp-dvwa"
    ;;
  *)
    echo "Unknown target: $TARGET"
    echo "Supported: juice-shop, dvwa"
    exit 1
    ;;
esac
