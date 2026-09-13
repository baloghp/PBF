# Git: commit + push (copy-paste)

Run these in a **normal host terminal** (not the Cursor agent shell).
If remotes are missing, run the restore block first.

**ittdspace:** Local Editor Save/Sync is only on disk. `wix publish` → Remote uses GitHub, including `wix.config.json` (UI version). Always sync the **full** ittdspace tree before publishing.

```bash
bash scripts/ittdspace-sync-github.sh
# or with a message:
bash scripts/ittdspace-sync-github.sh "Your commit message."
```

That is `git add -A` (JS + `wix.config.json` + everything else) → commit if needed → push.

---

## 0) Restore remotes (only if `git remote -v` is empty)

```bash
# PBF vault
cd /run/media/peter/WorkGames/Vaults/PBF
git remote remove origin 2>/dev/null
git remote add origin https://github.com/baloghp/PBF.git
git branch --set-upstream-to=origin/main main

# ittdspace
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace
git remote remove origin 2>/dev/null
git remote add origin https://github.com/baloghp/ittdspace.git
git branch --set-upstream-to=origin/main main
```

---

## 1) ittdspace — full sync to GitHub (preferred)

```bash
cd /run/media/peter/WorkGames/Vaults/PBF
bash scripts/ittdspace-sync-github.sh "Your commit message."
```

Manual equivalent — always `git add -A`, never a file subset (or `wix.config.json` stays behind and publish warns about UI versions):

```bash
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace
git status
git diff
git log -5 --oneline
git add -A
git commit -m "$(cat <<'EOF'
Your commit message here.

EOF
)"
git push -u origin HEAD
git status
```

Then `wix publish` → Remote - origin/main.

---

## 2) PBF vault — status, commit, push

Do **not** auto-commit this repo (unrelated vault edits). Commit what you intend, then push.

```bash
cd /run/media/peter/WorkGames/Vaults/PBF
git status
git diff
git log -5 --oneline
```

```bash
cd /run/media/peter/WorkGames/Vaults/PBF
git add -A
git commit -m "$(cat <<'EOF'
Your commit message here.

EOF
)"
git push -u origin HEAD
git status
```

---

## Optional: push both remotes (ittdspace full-sync + PBF push)

```bash
bash scripts/git-push-both.sh
```

ittdspace half always `git add -A` and commits if dirty, then pushes. PBF half pushes only.

```bash
cd /run/media/peter/WorkGames/Vaults/PBF && git push -u origin HEAD
```
