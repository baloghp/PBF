#!/usr/bin/env bash
# Restore remotes (if wiped by Cursor agent sandbox) and push main.
# Run from a normal host terminal — not the Cursor agent shell.
#
# Usage:
#   bash scripts/git-push-both.sh
#   # or copy-paste the blocks below one repo at a time

set -euo pipefail

PBF_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ITTDspace="$PBF_ROOT/ittdspace"

ensure_origin() {
  local repo="$1"
  local url="$2"
  git -C "$repo" remote remove origin 2>/dev/null || true
  git -C "$repo" remote add origin "$url"
  git -C "$repo" branch --set-upstream-to=origin/main main 2>/dev/null || true
  echo "origin -> $url  ($repo)"
  git -C "$repo" remote -v
}

echo "=== PBF vault ==="
ensure_origin "$PBF_ROOT" "https://github.com/baloghp/PBF.git"
git -C "$PBF_ROOT" status -sb
git -C "$PBF_ROOT" push -u origin main

echo
echo "=== ittdspace ==="
ensure_origin "$ITTDspace" "https://github.com/baloghp/ittdspace.git"
git -C "$ITTDspace" status -sb
git -C "$ITTDspace" push -u origin main

echo
echo "Done."
