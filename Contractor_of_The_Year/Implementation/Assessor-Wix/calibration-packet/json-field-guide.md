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

## Key scores (starter)

| Field | Suggested |
| --- | --- |
| `projectSuccessScore` | 5 |
| `agilityAdaptabilityScore` | 4 |
| `commercialModelScore` | 5 |
| `legalSoundnessScore` | 4 |
| `interfaceGovernanceScore` | 4 |
| `riskManagementScore` | 4 |
| `peopleDevelopmentScore` | 5 |
| `teamBusinessAcumenScore` | 5 |
| `innovationAdvancementScore` | 5 |

Pass = every score within ±`passTolerance` of the key.
