# Player Guide

## Start
1. Pick challenge under `ctf/`.
2. Start compose in its `deploy/` directory.
3. Solve flags in order.

## Submit Flag
```bash
python3 scripts/scoreboard.py submit --user player1 --flag 'FLAG{ledger_entrypoint}'
python3 scripts/scoreboard.py leaderboard
```

## Hints
```bash
python3 scripts/hints.py release --user player1 --challenge phantom-ledger --stage 1
python3 scripts/hints.py show --user player1 --challenge phantom-ledger
```

## Reset
```bash
bash scripts/reset-labs.sh
```
