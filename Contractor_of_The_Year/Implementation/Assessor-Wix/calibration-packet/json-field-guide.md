# Calibration packet JSON — field guide

**File:** [calibration-packet.json](calibration-packet.json)  
**Goes to (C4):** `ittdspace/src/backend/calibration-packet.json` (server import only)

Do **not** create a row in `Nominations` or `Customer_Feedback`. That would skew Admin KPIs / assignment stats.

## What you fill in

| Path | Who | Notes |
| --- | --- | --- |
| `packet.exemplary` / `impact` / `lessons` | Already filled from Supply Chain sample | HTML for the three rich-text boxes |
| `packet.mainNarrative` | **You** | URL after you upload the narrative PDF |
| `packet.fileContractMatrix` | **You** | URL after you upload the contract-matrix PDF |
| `packet.fileRaci` | **You** | URL after you upload the RACI PDF |
| `packet.customers[]` | Optional | One fictional client already included; edit or clear |
| `key.*` | Angel/Peter | Nine reference scores 1–10 |
| `passTolerance` | Locked | `2` (±2 on 1–10) |

## How to add file URLs

Ready-to-upload PDFs (and markdown sources): [artifacts/](artifacts/).

1. Upload the three PDFs in Wix Media Manager / site files.
2. Copy each file’s **public URL**.
3. Paste into `calibration-packet.json` → `packet.mainNarrative`, `packet.fileContractMatrix`, `packet.fileRaci`.
4. Commit. Empty string = View button stays collapsed.

## Packet fields (same shape as Assessor Dashboard)

| JSON | UI |
| --- | --- |
| `packet.title` | `#titleInput` |
| `packet.company` | `#companyInput` |
| `packet.nomineeNameDisplay` | `#ownerText` |
| `packet.status` | `#statusText` |
| `packet.exemplary` | `#richTextBoxExamplary` |
| `packet.impact` | `#richTextBoxImpact` |
| `packet.lessons` | `#richTextBoxLessons` |
| `packet.gdprCheck` / `retentionPolicy` / `publicationConsent` | checkboxes |
| `packet.mainNarrative` | `#viewNarrativeBtn` link |
| `packet.fileContractMatrix` | `#viewContractBtn` link |
| `packet.fileRaci` | `#viewRaciBtn` link |
| `packet.customers[]` | `#customerRepeater` (from JSON, not CMS) |

## Key scores (2026-09-13, Assessment Guide 1–10)

Total **71 / 90**. Pass = every score within ±`passTolerance` of the key. `keyReasons` are shown in the exam **Alert lightbox after Submit** (not on the scoring form).

| Field | Key | Why not higher / lower |
| --- | --- | --- |
| `projectSuccessScore` | 9 | Outcomes vs baseline are excellent; not 10 (self-asserted, no audit attached) |
| `agilityAdaptabilityScore` | 7 | Agile process present; almost no real change story |
| `commercialModelScore` | 9 | Outcome + equity + liquidity is the packet’s strength; not 10 (messy equity line, heavy advance) |
| `legalSoundnessScore` | 7 | Sample clauses + English law; not a closed contract |
| `interfaceGovernanceScore` | 7 | RACI works except dual-A on architecture |
| `riskManagementScore` | 7 | Broad register; generic mitigations |
| `peopleDevelopmentScore` | 8 | 15% of profit is top band; thin curriculum evidence |
| `teamBusinessAcumenScore` | 8 | Integrity controls are real; no hard pressure test |
| `innovationAdvancementScore` | 9 | Case-study worthy sharing; not a proven breakthrough 10 |

Pass = every score within ±`passTolerance` of the key.
