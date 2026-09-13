#!/usr/bin/env bash
# Restore remotes (if wiped by Cursor agent sandbox) and push main.
# ittdspace always git add -A first (code + wix.config.json UI version) so
# Local Editor Save is on GitHub before `wix publish` Remote.
#
# Usage:
#   bash scripts/git-push-both.sh
#   bash scripts/ittdspace-sync-github.sh "Your ittdspace message."

set -euo pipefail

PBF_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

ensure_origin() {
  local repo="$1"
  local url="$2"
  git -C "$repo" remote remove origin 2>/dev/null || true
  git -C "$repo" remote add origin "$url"
  git -C "$repo" branch --set-upstream-to=origin/main main 2>/dev/null || true
  echo "origin -> $url  ($repo)"
  git -C "$repo" remote -v
}

echo "=== PBF vault (push only; commit separately) ==="
ensure_origin "$PBF_ROOT" "https://github.com/baloghp/PBF.git"
git -C "$PBF_ROOT" status -sb
git -C "$PBF_ROOT" push -u origin main

echo
bash "$PBF_ROOT/scripts/ittdspace-sync-github.sh"

echo
echo "Done."
