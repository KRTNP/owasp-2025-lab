#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SCORE_FILE = BASE / "scoreboard" / "scoreboard.json"
FLAGS_FILE = BASE / "scoreboard" / "flags.json"


def load_json(path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def ensure_user(board, username):
    for u in board["users"]:
        if u["username"] == username:
            return u
    user = {"username": username, "solves": [], "score": 0}
    board["users"].append(user)
    return user


def submit(username, flag):
    board = load_json(SCORE_FILE)
    flags = load_json(FLAGS_FILE)

    found = None
    for cid, flist in flags.items():
        if flag in flist:
            found = (cid, flist.index(flag) + 1)
            break

    if not found:
        print("[-] Invalid flag")
        return 1

    challenge_id, stage = found
    solve_id = f"{challenge_id}:stage{stage}"
    user = ensure_user(board, username)

    if solve_id in user["solves"]:
        print("[!] Already solved")
        return 0

    user["solves"].append(solve_id)
    user["score"] += 100
    save_json(SCORE_FILE, board)
    print(f"[+] Accepted: {solve_id} (+100)")
    return 0


def leaderboard():
    board = load_json(SCORE_FILE)
    users = sorted(board["users"], key=lambda x: x["score"], reverse=True)
    print("# Leaderboard")
    rank = 1
    for u in users:
        print(f"{rank}. {u['username']} - {u['score']} pts - {len(u['solves'])} solves")
        rank += 1


def main():
    parser = argparse.ArgumentParser(description="Local CTF scoreboard")
    sub = parser.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("submit")
    s.add_argument("--user", required=True)
    s.add_argument("--flag", required=True)

    sub.add_parser("leaderboard")

    args = parser.parse_args()

    if args.cmd == "submit":
        raise SystemExit(submit(args.user, args.flag))
    if args.cmd == "leaderboard":
        leaderboard()


if __name__ == "__main__":
    main()
