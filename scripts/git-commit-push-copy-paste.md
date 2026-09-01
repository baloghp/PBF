# Git: commit + push (copy-paste)

Run these in a **normal host terminal** (not the Cursor agent shell).
If remotes are missing, run the restore block first.

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

## 1) ittdspace — status, commit, push

```bash
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace
git status
git diff
git log -5 --oneline
```

```bash
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace
git add -A
git commit -m "$(cat <<'EOF'
Your commit message here.

EOF
)"
git push -u origin HEAD
git status
```

---

## 2) PBF vault — status, commit, push

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

## Optional: push only (already committed)

```bash
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace && git push -u origin HEAD
cd /run/media/peter/WorkGames/Vaults/PBF && git push -u origin HEAD
```
