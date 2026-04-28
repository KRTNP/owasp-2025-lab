#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-juice-shop}"

echo "[+] Starting lab target: ${TARGET}"
docker compose up -d "${TARGET}"
echo "[+] Running containers:"
docker compose ps
