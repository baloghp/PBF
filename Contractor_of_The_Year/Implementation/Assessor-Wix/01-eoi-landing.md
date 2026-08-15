# Phase 1 — EOI landing (15 Aug)

**Gate:** Public `/become-an-assessor` takes an application into `Assessors` and sends A1–A3.  
**Back:** [Guide](../Assessor-EOI-Wix-Plan.md) · **Emails:** [04](04-emails.md) (A1–A3 only this phase)

Reuse [UAT NDA Public](https://www.ittd.space/uat-nda) (`src/pages/UAT NDA Public.u1buo.js`). Layout and assets stay; copy and CTA change. Page code is empty today — most work is **Local Editor**, plus a small backend for verify.

**Slug:** `/become-an-assessor`. Keep `/uat-nda` as a redirect.

## Kill on this page

- UAT volunteer copy (May–Jun window, synthetic/AI, Discord, roleplay)
- “Continue to NDA” → `UAT NDA Document.gt426.js`
- Coach walkthrough and any Nominee Coach mention
- “Participating in UAT does not exclude you…”

Unpublish or noindex `UAT NDA Document` once nothing links to it.

## Rewrite (one screen)

1. Why this award exists
2. What nominations look like
3. Two stages (you score Stage 1)
4. The job: ~6–8 h, remote, Nov–Dec, 3–5 nominations
5. Gate: **PMP or PBP**
6. Offer: credential · PDUs if Oliver confirms · LinkedIn recognition. **Do not** headline a PBP/ACE discount
7. Close **15 Oct**. Soft CTA for Foundation Workshop 31 Aug once the URL exists

Link “Award homepage” to `ittd.space/pbf-pcoty`. Optional: Assessor Guide.

## CMS — extend **`Assessors`**, do not create `AssessorEOI`

Export reference: `/home/peter/Downloads/Assessors.csv`. Admin `addStaff` already writes `title_fld`, `email`, `userId`. Assignment uses `userId` on `Nominations.assessors[]`.

**Keep these keys. Do not rename.**

| CSV column | Wix key | Keep as |
| --- | --- | --- |
| title_fld | `title_fld` | Display name (given + family). Admin search uses this |
| ID | `_id` | System |
| Created / Updated | `_createdDate` / `_updatedDate` | System |
| Owner | `_owner` | System |
| email | `email` | Upsert key |
| userId | `userId` | Member id. **Empty until invited** |
| Published / Hidden | — | CMS visibility |
| Status | — | **Wix publish state only.** Never the pipeline |

**Add now (this phase):**

| Key | Type | Purpose |
| --- | --- | --- |
| givenName, familyName | text | Form + PBP `family_name` |
| linkedin | url | Outreach |
| credential | text (PMP / PBP / both) | Gate |
| pbpCandidateNumber | text | PBP verify |
| pmiId | text | Optional record |
| country | text | Optional Credly match |
| credlyBadgeUrl | url | PMP lookup key |
| yearsSeniority, industry | text | Persona |
| whyInterested, howHeard | text | |
| calibrationPreference | text | Live / Online / Either |
| verifyStatus | text | Unchecked / PBP-ok / PMP-ok / PMP-pending / Fail |
| verifyDetail | text (JSON) | Lookup snapshot |
| pipelineStatus | text | New / Verified / Waitlist / Declined / Active |
| persona | text | P0–P3 |
| contacted, response, notes | text | Warm outreach |

Defer `theoryStatus` and `calibration*` to [phase 3](03-calibration.md).

**Submit:** upsert by **email**; set `title_fld`; leave `userId` blank; `pipelineStatus = New`; run verify. No member account yet.

## Verification

Call from a **Wix backend** webMethod. Browser CORS will block Oliver’s API.

### PBP

Widget: `https://cert.project-business.org/widget/certregistry`

```
GET https://cert.project-business.org/api/verify?family_name={family}&candidate_number={number}
```

Miss → `{ "found": false }`. Hit → `found`, `name`, `city`, `country`, `credentials[]` (`PBP` / `ACE` / `PBP Trainer`, `date_certified`).

Pass if `found` and `credentials` contains **PBP**. ACE-only is not the gate. Form must split given / family name.

Ask Oliver (CORS **not** required for server-side). Copy:

> For assessor EOI we will check PBP the same way the public registry widget does: `GET https://cert.project-business.org/api/verify?family_name=…&candidate_number=…` from our Wix **server** (not the visitor’s browser), so we do not need CORS. Please confirm (1) we may call that URL from ittd.space, (2) the path and query params stay stable, (3) a miss keeps returning `{found:false}` and a hit includes `credentials[]` with `PBP`. Optional: if you prefer a dedicated key or allow-list, send that instead. We will not call it from the browser unless you add `Access-Control-Allow-Origin` for `https://www.ittd.space`.

### PMP

The ID in `https://www.credly.com/badges/{uuid}` is Credly’s UUID, **not** the PMI number. You cannot build a Credly URL from a PMP ID.

1. Require **Credly public badge URL** + given/family name. `pmiId` is optional.
2. Parse `{uuid}` from `/badges/{uuid}` or `/public_url`.
3. Fetch the public badge from the backend.
4. Pass when issuer is PMI, template is PMP, and last name matches (case-insensitive). First name should match when present.
5. Country: match **only if** Credly returns `country`.
6. Private badge / bad URL / name mismatch → `PMP-pending` or Fail. Do not scrape the [PMI registry](https://www.pmi.org/certifications/certification-resources/registry).

Expired PMP is acceptable ([28.07](../../Confluence/Meetings/277086209%20-%20Team%20Meeting%20-%2028.07.2026.md)) — ignore `expires_at`.

**15 Aug:** PBP auto. PMP auto if they pasted a public URL; otherwise pending.

Thank-you on the same page. Do not send people through the UAT NDA.

## Emails this phase

Wire **A1, A2, A3** only — see [04-emails.md](04-emails.md).

## Test

- [ ] `/become-an-assessor` loads; `/uat-nda` redirects
- [ ] No NDA, no coach, no UAT Discord
- [ ] Upsert `Assessors` by email (`userId` empty; `pipelineStatus = New`)
- [ ] PBP number + family name → `verifyStatus` PBP-ok or Fail
- [ ] PMP with Credly URL → PMP-ok / pending / Fail
- [ ] A1 always; A2 or A3 after verify
- [ ] No member login required
- [ ] Mobile

## Done when

Published live. Warm-list people can be sent the URL.
