#!/usr/bin/env bash
# Commit ALL ittdspace files and push to GitHub.
#
# Local Editor Save/Sync only updates the disk. `wix publish` → Remote uses
# GitHub, including wix.config.json (UI version). Always run this after Save
# and before publishing origin/main.
#
# Usage:
#   bash scripts/ittdspace-sync-github.sh
#   bash scripts/ittdspace-sync-github.sh "Your commit message."
#
# Run from a normal host terminal — not the Cursor agent sandbox.

set -euo pipefail

PBF_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ITTDspace="$PBF_ROOT/ittdspace"
MSG="${1:-Sync ittdspace code and Local Editor UI version to GitHub.}"

if [[ ! -d "$ITTDspace/.git" ]]; then
  echo "ittdspace git repo not found: $ITTDspace" >&2
  exit 1
fi

ensure_origin() {
  git -C "$ITTDspace" remote remove origin 2>/dev/null || true
  git -C "$ITTDspace" remote add origin "https://github.com/baloghp/ittdspace.git"
  git -C "$ITTDspace" branch --set-upstream-to=origin/main main 2>/dev/null || true
}

echo "=== ittdspace → GitHub (full tree) ==="
ensure_origin
git -C "$ITTDspace" remote -v
git -C "$ITTDspace" status -sb

# Everything: page/backend JS, public, wix.config.json UI version, etc.
git -C "$ITTDspace" add -A

if git -C "$ITTDspace" diff --cached --quiet; then
  echo "Nothing new to commit."
else
  echo "Committing:"
  git -C "$ITTDspace" diff --cached --stat
  git -C "$ITTDspace" commit -m "$MSG"
fi

git -C "$ITTDspace" push -u origin HEAD
git -C "$ITTDspace" status -sb
echo "Done. origin/main is what \`wix publish\` Remote will use."
