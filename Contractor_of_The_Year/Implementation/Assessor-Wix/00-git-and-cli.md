# Phase 0 — Git and Wix CLI

**Gate:** `npx wix login` and `npm run dev` open the Local Editor.  
**Back:** [Guide](../Assessor-EOI-Wix-Plan.md)

The old method was: edit JS in this vault → paste into the Wix editor. That copy in `Contractor_of_The_Year/Implementation/` is gone. **Live code is** `ittdspace/`, already on GitHub. The PBF vault gitignores `/ittdspace/`, so site commits happen **inside** that folder, not in PBF.

## What git holds vs the editor


| In `ittdspace` (git)   | Only in Wix (Local Editor / CMS / Programs) |
| ---------------------- | ------------------------------------------- |
| `src/pages/*.js`       | Layout, text, images, buttons, tabs         |
| `src/backend/*.web.js` | CMS collections + fields                    |
| `src/public/*.js`      | Member types / roles                        |
|                        | Wix Forms, menus, slugs, SEO                |
|                        | Online Programs content                     |


You cannot create or rename pages from Cursor. Create/rename in the Local Editor, then **Sync** so the `.js` filename updates. Do not rename page files in the IDE — Wix ignores the file and creates a stub.

## Daily loop

```bash
cd /run/media/peter/WorkGames/Vaults/PBF/ittdspace
npx wix login          # only if `wix whoami` says not authenticated
npm run dev            # Local Editor in the browser
```

1. Code in Cursor under `ittdspace/src/…` — Local Editor hot-reloads it.
2. Copy, layout, forms, CMS, Programs in the **Local Editor** / dashboard.
3. Local Editor → **Sync** design changes into the repo.
4. Commit and push `main` (the branch Wix tracks):

```bash
git add -A && git commit -m "…" && git push origin main
```

1. Preview: `npx wix preview` · Live: `npx wix publish` (or Publish in Local Editor).

Pushing `main` updates the site’s **code**. It does not publish the live site by itself.

## Rules

- Never paste code into the Wix Editor. After Git connect, editor code is read-only.
- Do not keep a second copy of Velo files in the PBF vault.
- One publish source: local `wix publish` **or** Local Editor — not both on diverged trees.
- If Local Editor and GitHub disagree: pull `main`, then Sync from Local Editor, then commit.

Official: [Set up Git + CLI](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/setting-up-git-integration-wix-cli-for-sites) · [Local Editor](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/test-your-code-in-the-local-editor)

## Done when

- [x] `npm run dev` opens Local Editor
- [x] A trivial comment in a page file hot-reloads
- [x] `git status` in `ittdspace/` is clean after a test commit on a throwaway change (or discarded)