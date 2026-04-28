#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
HINTS = BASE / "hints" / "hints.json"
STATE = BASE / "hints" / "hint-state.json"


def load(path, default):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save(path, data):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def release(user, challenge, stage):
    hints = load(HINTS, {})
    state = load(STATE, {})
    user_state = state.setdefault(user, {})
    chal_state = user_state.setdefault(challenge, {"released": []})

    key = f"stage{stage}"
    if challenge not in hints or key not in hints[challenge]:
        print("[-] No hints found")
        return 1

    if key not in chal_state["released"]:
        chal_state["released"].append(key)

    save(STATE, state)
    print(f"[+] Released {challenge}:{key} for {user}")
    return 0


def show(user, challenge):
    hints = load(HINTS, {})
    state = load(STATE, {})
    released = state.get(user, {}).get(challenge, {}).get("released", [])
    print(f"# Hints for {user} / {challenge}")
    for key in sorted(released):
        print(f"## {key}")
        for line in hints.get(challenge, {}).get(key, []):
            print(f"- {line}")


def main():
    parser = argparse.ArgumentParser(description="Hint release system")
    sub = parser.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("release")
    r.add_argument("--user", required=True)
    r.add_argument("--challenge", required=True)
    r.add_argument("--stage", type=int, required=True)

    s = sub.add_parser("show")
    s.add_argument("--user", required=True)
    s.add_argument("--challenge", required=True)

    args = parser.parse_args()
    if args.cmd == "release":
        raise SystemExit(release(args.user, args.challenge, args.stage))
    if args.cmd == "show":
        show(args.user, args.challenge)


if __name__ == "__main__":
    main()
