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

## Rewrite (one screen) — final copy

Lock this text in Local Editor (plain ASCII; keyboard characters only).

Somebody has to decide what "outstanding" means in contracted project delivery.

You will read real nominations from real contracts: the delivery story, the commercial model, the governance, the client's own assessment.

Then you score them against nine published criteria, alongside peers who do the work you do.

**What we ask**

- PMP or PBP. That is the gate. You give us the number, we verify it.
- 1-2 hours of calibration before scoring opens, so everyone marks to the same standard.
- 8-10 hours across November and December. Capped, not open ended.
- Score 3-5 nominations, read remotely, on your own schedule.

**What you get**

- A verifiable PCotY Assessor credential, listed on the Project Business Foundation certification registry.
- A discount on PBP certification for assessors who complete the cycle.
- PDUs under PMI Giving Back for the hours you volunteer. We send the claim guidance when you join.
- Named recognition as a Cycle 1 Stage 1 assessor. Yours to post on LinkedIn.

Expressions of interest close 15 October.

Verification confirms your credential, but the seat is a decision the core team makes application by application.

Link "Award homepage" to `ittd.space/pbf-pcoty`. Optional: Assessor Guide. Soft CTA for Foundation Workshop 31 Aug once the URL exists.

## CMS — `Assessors` (final field set)

Export reference: `/home/peter/Downloads/Assessors (1).csv`. Do not create `AssessorEOI`. Admin `addStaff` already writes `title_fld`, `email`, `userId`. Assignment uses `userId` on `Nominations.assessors[]`.

**System / existing — keep keys. Do not rename.**


| CSV column                           | Wix key                         | Keep as                                               |
| ------------------------------------ | ------------------------------- | ----------------------------------------------------- |
| title_fld                            | `title_fld`                     | Display name (given + family). Admin search uses this |
| ID                                   | `_id`                           | System                                                |
| Created / Updated                    | `_createdDate` / `_updatedDate` | System                                                |
| Owner                                | `_owner`                        | System                                                |
| email                                | `email`                         | Upsert key                                            |
| userId                               | `userId`                        | Member id. **Empty until invited**                    |
| Published on site / Hidden from site | —                               | CMS visibility                                        |
| Status                               | —                               | **Wix publish state only.** Never the pipeline        |


**EOI / seat fields (this phase) — locked to the export**


| CSV column         | Wix key              | Type    | Purpose                                             |
| ------------------ | -------------------- | ------- | --------------------------------------------------- |
| givenName          | `givenName`          | text    | Form + PBP `family_name` / Credly name match        |
| familyName         | `familyName`         | text    | Form + PBP / Credly name match                      |
| linkedin           | `linkedin`           | url     | Outreach                                            |
| credentialPmp      | `credentialPmp`      | boolean | Gate: claims PMP                                    |
| credentialPbp      | `credentialPbp`      | boolean | Gate: claims PBP                                    |
| pbpCandidateNumber | `pbpCandidateNumber` | text    | PBP Credential Number (required if `credentialPbp`) |
| credlyBadgeUrl     | `credlyBadgeUrl`     | url     | Credly public badge (required if `credentialPmp`)   |
| pmiId              | `pmiId`              | text    | Optional record; not used to build Credly URLs      |
| pipelineStatus     | `pipelineStatus`     | text    | New / Waitlist / Declined / Active (core-team seat) |
| verifiedBy         | `verifiedBy`         | text    | Who accepted the seat (core-team name)              |


Form rule: at least one of `credentialPmp` / `credentialPbp` must be true. "Both" = both checked.

Defer `theoryStatus` and `calibration*` to [phase 3](03-calibration.md).

**Submit:** upsert by **email**; set `title_fld` from given + family; leave `userId` and `verifiedBy` blank; `pipelineStatus = New`. Run credential verify in the backend for **A2/A3 routing only** (no verify status field on the row). No member account yet.

## Form — Local Editor build (follow this)

Do this on the EOI page in **Local Editor** (`npm run dev`). Do **not** use a Wix Form that writes straight to CMS. We need page inputs + a Submit button that will call a backend webMethod (upsert `Assessors` + verify + A1/A2/A3). Build the inputs now; wire the code after Sync.

**Not on the public form:** `pipelineStatus`, `verifiedBy`, `userId`, `title_fld` (derived on submit from given + family).

### 1. Page structure

Under the locked marketing copy, add one section titled **Apply to be an assessor** (or keep your existing CTA heading).

Suggested stack (top to bottom):

1. Short intro line: `Takes about three minutes. You will need your PMP Credly badge URL and/or PBP Credential Number.`
2. Form box (`#boxEoiForm`) — all inputs live here
3. Submit button
4. Error text (collapsed by default)
5. Thank-you box (collapsed by default) — same page, no redirect

After a successful submit, page code will collapse `#boxEoiForm` + submit button and expand `#boxEoiThankYou`. Do not send anyone to the NDA page.

### 2. Element inventory (IDs are locked — use these exact IDs)

Create each control, then set **ID** in the Properties panel to the value in the ID column. Spelling matters; Velo will use these strings.

| Order | Label on page | Wix element | ID | Maps to CMS | Required | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Given name | Text Input | `#inputGivenName` | `givenName` | Yes | Placeholder: `Given name` |
| 2 | Family name | Text Input | `#inputFamilyName` | `familyName` | Yes | Placeholder: `Family name` (PBP registry uses this) |
| 3 | Email | Text Input (email) | `#inputEmail` | `email` | Yes | Type: Email if available |
| 4 | LinkedIn profile | Text Input | `#inputLinkedin` | `linkedin` | Yes | Placeholder: `https://www.linkedin.com/in/...` |
| 5 | I hold PMP | Checkbox | `#checkboxCredentialPmp` | `credentialPmp` | At least one of 5/6 | Label: `PMP` |
| 6 | I hold PBP | Checkbox | `#checkboxCredentialPbp` | `credentialPbp` | At least one of 5/6 | Label: `PBP` |
| 7 | PBP Credential Number | Text Input | `#inputPbpCandidateNumber` | `pbpCandidateNumber` | If PBP checked | Inside `#boxPbpFields`. Label on page: `Credential Number` (PBP's term). CMS key stays `pbpCandidateNumber`. |
| 8 | Credly PMP badge URL | Text Input | `#inputCredlyBadgeUrl` | `credlyBadgeUrl` | If PMP checked | Inside `#boxPmpFields`. Placeholder: `https://www.credly.com/badges/...` |
| 9 | PMI ID (optional) | Text Input | `#inputPmiId` | `pmiId` | No | Inside `#boxPmpFields`. Helper: `Optional. Not used to look up Credly.` |
| 10 | Submit | Button | `#btnEoiSubmit` | — | — | Label: `Submit application` |
| 11 | Form error | Text | `#textEoiError` | — | — | Start **collapsed**. Red/error style. |
| 12 | Form container | Box / Container | `#boxEoiForm` | — | — | Wrap inputs 1-9 + submit + error |
| 13 | PBP fields box | Box / Container | `#boxPbpFields` | — | — | Wrap row 7 only. Start **collapsed**. |
| 14 | PMP fields box | Box / Container | `#boxPmpFields` | — | — | Wrap rows 8-9. Start **collapsed**. |
| 15 | Thank you | Box / Container | `#boxEoiThankYou` | — | — | Start **collapsed**. See copy below. |

Optional helper texts (no special ID required unless you want them):

- Next to credential checkboxes: `Select at least one. You can select both.`
- Under Credly URL: `Paste the public badge link from Credly, not your PMI number.`
- Under Credential Number: `As shown on your Project Business credential / the certification registry.`

### 3. Conditional fields (Local Editor + later page code)

**In Local Editor now:** put `#inputPbpCandidateNumber` inside `#boxPbpFields`, and `#inputCredlyBadgeUrl` + `#inputPmiId` inside `#boxPmpFields`. Collapse both boxes so a first paint without code still looks clean.

**Page code (next step, after Sync)** will:

- On `#checkboxCredentialPbp` change: expand `#boxPbpFields` when checked, collapse when unchecked (and clear the number if you want).
- On `#checkboxCredentialPmp` change: expand `#boxPmpFields` when checked, collapse when unchecked.
- On submit: if PBP checked and number empty → show error; if PMP checked and Credly URL empty → show error; if neither checked → show error.

You can also set both boxes expanded always if you prefer a simpler first build; validation still enforces the rules.

### 4. Validation rules (what Submit must enforce)

| Rule | Message (put in `#textEoiError`) |
| --- | --- |
| Given name empty | `Please enter your given name.` |
| Family name empty | `Please enter your family name.` |
| Email empty or not an email | `Please enter a valid email address.` |
| LinkedIn empty | `Please enter your LinkedIn profile URL.` |
| Neither PMP nor PBP checked | `Select PMP, PBP, or both.` |
| PBP checked, Credential Number empty | `Enter your PBP Credential Number.` |
| PMP checked, Credly URL empty | `Paste your public Credly PMP badge URL.` |
| Credly URL present but not a Credly badge link | `Use a Credly badge URL (credly.com/badges/...).` |

Do not require login. Do not collect `pipelineStatus` or `verifiedBy` from the visitor.

### 5. Thank-you box copy (`#boxEoiThankYou`)

Heading: `Thank you — we have your application.`

Body:

```
We will check your PMP and/or PBP details and email you next steps.

Verification of your credential is automatic where we can. A seat on the Stage 1 panel is a core-team decision, application by application.

Expressions of interest close 15 October.
```

Optional link back to award homepage: `https://www.ittd.space/pbf-pcoty`.

### 6. What happens on Submit (for when code is wired)

1. Disable `#btnEoiSubmit` (prevent double send).
2. Clear / collapse `#textEoiError`.
3. Read all inputs; run client-side validation above.
4. Call backend `submitAssessorEoi({ ... })` with:

```
givenName, familyName, email, linkedin,
credentialPmp, credentialPbp,
pbpCandidateNumber, credlyBadgeUrl, pmiId
```

5. Backend: upsert `Assessors` by `email`; set `title_fld = givenName + " " + familyName`; `pipelineStatus = "New"`; leave `userId` and `verifiedBy` blank; run PBP/PMP verify; send A1 then A2 or A3.
6. On success: collapse `#boxEoiForm`, expand `#boxEoiThankYou`.
7. On failure: expand `#textEoiError` with a short message (`Something went wrong. Please try again or email the organisers.`), re-enable the button.

### 7. Layout and mobile checklist

- One column on mobile; given / family can sit side by side on desktop if the theme allows.
- Checkbox labels large enough to tap.
- Submit full-width on mobile.
- No NDA button, no Discord, no coach links in this section.
- Form sits **below** the locked marketing copy, not in the hero.

### 8. After the form exists in Local Editor

1. **Sync** design into `ittdspace`.
2. Tell Cursor the form IDs are live — page code + `assessorEoi.web.js` get written next.
3. Slug `/become-an-assessor` + `/uat-nda` redirect if not done yet.
4. Create A1–A3 triggered emails ([04-emails.md](04-emails.md)) before go-live testing.

### 9. Form done when

- [ ] All IDs in the inventory exist and match spelling above
- [ ] `#boxPbpFields` / `#boxPmpFields` / `#boxEoiThankYou` / `#textEoiError` start collapsed
- [ ] No CMS-connected Wix Form writing a second collection
- [ ] Mobile layout checked in Local Editor preview
- [ ] Synced to git

## Verification

Call from a **Wix backend** webMethod. Browser CORS will block Oliver’s API.

### PBP

Widget: `https://cert.project-business.org/widget/certregistry`

```
GET https://cert.project-business.org/api/verify?family_name={family}&candidate_number={number}
```

Miss → `{ "found": false }`. Hit → `found`, `name`, `city`, `country`, `credentials[]` (`PBP` / `ACE` / `PBP Trainer`, `date_certified`).

Pass if `found` and `credentials` contains **PBP**. ACE-only is not the gate. Form must split given / family name. On the form, label the field **Credential Number** (PBP's term); CMS key and API query stay `pbpCandidateNumber` / `candidate_number`.

Ask Oliver (CORS **not** required for server-side). Copy:

> For assessor EOI we will check PBP the same way the public registry widget does: `GET https://cert.project-business.org/api/verify?family_name=…&candidate_number=…` from our Wix **server** (not the visitor’s browser), so we do not need CORS. Please confirm (1) we may call that URL from ittd.space, (2) the path and query params stay stable, (3) a miss keeps returning `{found:false}` and a hit includes `credentials[]` with `PBP`. Optional: if you prefer a dedicated key or allow-list, send that instead. We will not call it from the browser unless you add `Access-Control-Allow-Origin` for `https://www.ittd.space`.



### PMP

The ID in `https://www.credly.com/badges/{uuid}` is Credly’s UUID, **not** the PMI number. You cannot build a Credly URL from a PMP ID.

1. Require **Credly public badge URL** + given/family name. `pmiId` is optional.
2. Parse `{uuid}` from `/badges/{uuid}` or `/public_url`.
3. Fetch the public badge from the backend.
4. Pass when issuer is PMI, template is PMP, and last name matches (case-insensitive). First name should match when present.
5. No `country` field on `Assessors` — do not gate on Credly country.
6. Private badge / bad URL / name mismatch → treat as pending or fail for **A2** (do not persist a verify status). Do not scrape the [PMI registry](https://www.pmi.org/certifications/certification-resources/registry).

Expired PMP is acceptable ([28.07](../../Confluence/Meetings/277086209%20-%20Team%20Meeting%20-%2028.07.2026.md)) — ignore `expires_at`.

**15 Aug:** PBP auto for A2/A3. PMP auto if they pasted a public URL; otherwise A2 (pending). Seat / `verifiedBy` stays core-team.

Thank-you on the same page. Do not send people through the UAT NDA.

## Emails this phase

Wire **A1, A2, A3** only — see [04-emails.md](04-emails.md).

## Test

- [x] `/become-an-assessor` loads; `/uat-nda` redirects
- [x] No NDA, no coach, no UAT Discord
- [ ] Upsert `Assessors` by email (`userId` empty; `pipelineStatus = New`; `verifiedBy` empty)
- [ ] At least one of `credentialPmp` / `credentialPbp`; PBP Credential Number + family name routes A2/A3 correctly
- [ ] PMP with Credly URL routes A2/A3 correctly (pending or fail → A2)
- [ ] A1 always; A2 or A3 after verify (no verify status field written)
- [ ] No member login required
- [ ] Mobile



## Done when

Published live. Warm-list people can be sent the URL.