#!/usr/bin/env bash
set -euo pipefail
BRANCH_NAME="defense/fixed-baseline"

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  echo "[!] Switch to main before creating defense branch"
  exit 1
fi

git branch -f "$BRANCH_NAME" main
echo "[+] Branch prepared: $BRANCH_NAME"
echo "[i] Push with: git push -u origin $BRANCH_NAME"
