# Calibration packet — sample nominations

Source on Confluence: parent page [Pilot Project](https://ittd.atlassian.net/wiki/spaces/PBF/pages/148799489/Pilot+Project) (Jan 2026 AI-generated role-play packets).

| # | File / page | Contract | Category | Client form | Best for |
| --- | --- | --- | --- | --- | --- |
| **1 — SELECTED** | [01-supply-chain-ecommerce.md](01-supply-chain-ecommerce.md) · [Confluence](https://ittd.atlassian.net/wiki/spaces/PBF/pages/149159942) | Outcome-based + equity | Medium | 91/100 | **Calibration exam** |
| 2 | [02-healthcare-network.md](02-healthcare-network.md) · [Confluence](https://ittd.atlassian.net/wiki/spaces/PBF/pages/148930585) | Fixed-price milestones | Medium | 87/100 | Alternate / compare |
| 3 | [03-bess-grid-storage.md](03-bess-grid-storage.md) · [Confluence](https://ittd.atlassian.net/wiki/spaces/PBF/pages/149487617) | T&M + milestone gates | Small (solo) | 89/100 | Alternate (T&M liquidity) |

## Why Supply Chain for calibration

1. **Richest commercial story** — outcome-based + equity forces real Commercial Model / Legal judgment.
2. **Strong Innovation evidence** — multi-objective AI, open-source, conferences.
3. **Clear People Development** — 15% of profit.
4. **Complete packet shape** — maps cleanly into the Assessor Dashboard fields via JSON.

## How we ship it (no Nominations CMS row)

The live exam packet is **one JSON file** — not a CMS nomination (that would mess up Admin statistics).

| File | Role |
| --- | --- |
| [calibration-packet.json](calibration-packet.json) | Packet text + file URLs + customers + key scores |
| [json-field-guide.md](json-field-guide.md) | What to edit / where URLs go |
| [01-supply-chain-ecommerce.md](01-supply-chain-ecommerce.md) | Human-readable source (optional) |

### Your steps

1. Upload the three PDFs from [artifacts/](artifacts/) to Wix Media Manager:
   - `01-main-narrative.pdf` → `packet.mainNarrative`
   - `02-contract-matrix.pdf` → `packet.fileContractMatrix`
   - `03-interface-raci.pdf` → `packet.fileRaci`
2. Paste the public URLs into `calibration-packet.json`.
3. Angel/Peter confirm `key` scores before late Oct.
4. Commit. On C4, Cursor copies the JSON into `ittdspace/src/backend/`.

**Note:** Confluence Pilot Project pages did **not** have downloadable RACI/contract PDFs — only text “sample descriptions.” The tables used for these PDFs came from the vault Sample Projects markdown (richer than Confluence).

Do **not** insert into `Nominations` or `Customer_Feedback`.
