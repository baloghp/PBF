# Phase 1 — EOI landing (15 Aug)

**Gate:** Public `/become-an-assessor` takes an application into `Assessors` and emails the applicant (A1) plus the admin team.  
**Back:** [Guide](../Assessor-EOI-Wix-Plan.md) · **Email catalogue:** [04](04-emails.md)

**Page:** `src/pages/Become an Assessor.u1buo.js` · **Slug:** `/become-an-assessor` · keep `/uat-nda` as redirect.  
**Homepage CTA:** award page `Contractor Of The Year Award.z9t1g.js` — `#btnBecomeAssessor` below countdown → `/become-an-assessor`.

**No automatic credential verification.** Form stores evidence; core team checks manually, then sets `verifiedBy` and `pipelineStatus`.

---

## How to use this file (order)

Do the steps in order. Do not ask Cursor for code until **Step 3** is fully ticked.


| Step  | What                                              | Who                               |
| ----- | ------------------------------------------------- | --------------------------------- |
| **1** | Page copy + CMS + form in Local Editor, then Sync | You                               |
| **2** | Two Triggered Emails in Wix dashboard             | You                               |
| **3** | Pre-code checklist (gate)                         | You                               |
| **4** | Cursor writes page + backend code                 | Cursor (after Step 3)             |
| **5** | Verify + run test scenarios                       | You (+ Cursor if something fails) |
| **6** | Publish                                           | You                               |


---



## Step 1 — Local Editor (copy, CMS, form)



### 1A. Kill UAT leftovers

- UAT volunteer copy (May–Jun, synthetic/AI, Discord, roleplay)
- "Continue to NDA" → `UAT NDA Document.gt426.js`
- Coach walkthrough / Nominee Coach
- "Participating in UAT does not exclude you…"

Unpublish or noindex `UAT NDA Document` once nothing links to it.

### 1B. Locked marketing copy

Plain ASCII only.

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

Link Award homepage to `https://www.ittd.space/pbf-pcoty`. Optional: Assessor Guide. Soft CTA for Foundation Workshop 31 Aug once the URL exists.

### 1C. CMS — `Assessors` (final fields)

Export reference: `/home/peter/Downloads/Assessors (1).csv`. Do **not** create `AssessorEOI`.

**Keep / do not rename:** `title_fld`, `email`, `userId` (+ system fields). On EOI submit, `userId` is filled automatically when the email already matches a site member (`Members/PrivateMembersData.loginEmail`); otherwise it stays empty until invite.


| Wix key              | Type    | On public form? | Purpose                            |
| -------------------- | ------- | --------------- | ---------------------------------- |
| `givenName`          | text    | Yes             | Name                               |
| `familyName`         | text    | Yes             | Name + manual PBP check            |
| `linkedin`           | url     | Yes             | Outreach                           |
| `credentialPmp`      | boolean | Yes             | Claims PMP                         |
| `credentialPbp`      | boolean | Yes             | Claims PBP                         |
| `pbpCandidateNumber` | text    | Yes if PBP      | PBP **Credential Number**          |
| `credlyBadgeUrl`     | url     | Yes if PMP      | Public Credly badge URL            |
| `pmiId`              | text    | Optional        | Record only                        |
| `pipelineStatus`     | text    | No              | New / Waitlist / Declined / Active |
| `verifiedBy`         | text    | No              | Who accepted the seat              |


At least one of `credentialPmp` / `credentialPbp` must be true. Defer `theoryStatus` / `calibration*` to [phase 3](03-calibration.md).

**Manual check later (not in code):** PBP via [registry widget](https://cert.project-business.org/widget/certregistry); PMP via Credly URL. Then set `verifiedBy` + `pipelineStatus`.

### 1D. Form build

Do **not** use a CMS-connected Wix Form. Use inputs + `#btnEoiSubmit` (backend will upsert + send mail).

**Not on the form (and not stored from CoC):** `pipelineStatus`, `verifiedBy`, `userId`, `title_fld` (derived on submit). Code of Conduct is **required to submit** but **not** written to `Assessors`.

**Structure (below marketing copy):** intro line → `#boxEoiForm` → submit → `#textEoiError` (collapsed) → `#boxEoiThankYou` (collapsed).

Intro: `Takes about three minutes. You will need your PMP Credly badge URL and/or PBP Credential Number.`

**Element IDs (lock spelling):**


| Order | Label             | Element    | ID                         | CMS                  | Required   | Notes                                                                               |
| ----- | ----------------- | ---------- | -------------------------- | -------------------- | ---------- | ----------------------------------------------------------------------------------- |
| 1     | Given name        | Text Input | `#inputGivenName`          | `givenName`          | Yes        |                                                                                     |
| 2     | Family name       | Text Input | `#inputFamilyName`         | `familyName`         | Yes        |                                                                                     |
| 3     | Email             | Text Input | `#inputEmail`              | `email`              | Yes        |                                                                                     |
| 4     | Code of Conduct   | Checkbox   | `#checkboxCodeOfConduct`   | —                    | Yes        | Label: `I agree to the PBF Code of Conduct` (link in label). **Not stored in CMS.** |
| 5     | LinkedIn          | Text Input | `#inputLinkedin`           | `linkedin`           | Yes        |                                                                                     |
| 6     | PMP               | Checkbox   | `#checkboxCredentialPmp`   | `credentialPmp`      | One of 6/7 |                                                                                     |
| 7     | PBP               | Checkbox   | `#checkboxCredentialPbp`   | `credentialPbp`      | One of 6/7 |                                                                                     |
| 8     | Credential Number | Text Input | `#inputPbpCandidateNumber` | `pbpCandidateNumber` | If PBP     | Inside `#boxPbpFields`                                                              |
| 9     | Credly badge URL  | Text Input | `#inputCredlyBadgeUrl`     | `credlyBadgeUrl`     | If PMP     | Inside `#boxPmpFields`                                                              |
| 10    | PMI ID (optional) | Text Input | `#inputPmiId`              | `pmiId`              | No         | Inside `#boxPmpFields`                                                              |
| 11    | Submit            | Button     | `#btnEoiSubmit`            | —                    | —          |                                                                                     |
| 12    | Error             | Text       | `#textEoiError`            | —                    | —          | Start collapsed                                                                     |
| 13    | Form wrap         | Box        | `#boxEoiForm`              | —                    | —          |                                                                                     |
| 14    | PBP wrap          | Box        | `#boxPbpFields`            | —                    | —          | Start collapsed                                                                     |
| 15    | PMP wrap          | Box        | `#boxPmpFields`            | —                    | —          | Start collapsed                                                                     |
| 16    | Thank you         | Box        | `#boxEoiThankYou`          | —                    | —          | Start collapsed                                                                     |


**Code of Conduct (Oliver)**

- Set the checkbox ID in Properties to exactly: `checkboxCodeOfConduct` (Velo: `#checkboxCodeOfConduct`).
- Keep the hyperlink on "PBF Code of Conduct" in the label.
- No new CMS field. Client (+ backend) must reject submit if unchecked.

**Thank-you copy**

Heading: `Thank you — we have your application.`

```
We have emailed you a confirmation. The core team will check your PMP and/or PBP details and decide on a Stage 1 seat application by application.

Expressions of interest close 15 October.
```

**Validation messages (for later code):**


| Rule                                  | `#textEoiError`                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| Given name empty                      | `Please enter your given name.`                                                |
| Family name empty                     | `Please enter your family name.`                                               |
| Bad email                             | `Please enter a valid email address.`                                          |
| Code of Conduct unchecked             | `Please agree to the PBF Code of Conduct.`                                     |
| LinkedIn empty                        | `Please enter your LinkedIn profile URL.`                                      |
| LinkedIn not a LinkedIn URL           | `Please enter a valid LinkedIn profile URL (https://www.linkedin.com/in/...).` |
| Neither credential                    | `Select PMP, PBP, or both.`                                                    |
| PBP, no Credential Number             | `Enter your PBP Credential Number.`                                            |
| PMP, no Credly URL                    | `Paste your public Credly PMP badge URL.`                                      |
| Credly URL invalid / not a badge link | `Use a Credly badge URL (https://www.credly.com/badges/...).`                  |


Sync Local Editor → git when the form looks right (including CoC ID set).

### 1E. Award homepage — Become an Assessor button (Phase 1 add-on)

On **Contractor Of The Year Award** (the page with the nominations countdown):

1. Add a Button **below** `#countdownBox` (visible to everyone; not login-gated).
2. Label: `Become an Assessor` (or your preferred wording).
3. Set element ID exactly: **`btnBecomeAssessor`** → `#btnBecomeAssessor`.
4. Do **not** put it inside a collapsed-only staff box. Keep it public.
5. Sync.

Code (already in `Contractor Of The Year Award.z9t1g.js`) expands the button and navigates to `/become-an-assessor`. Optional: you can also set the button link in the Editor to `/become-an-assessor`; code covers click either way.

Visible during the countdown period (before 1 Sep) and after — independent of `#mainActionBtn`.

---



## Step 2 — Triggered Emails (dashboard)

Create **two** templates before any Velo code. Backend will use `contacts.appendOrCreateContact` + `triggeredEmails.emailContact(emailId, ...)`.

### How variables work (read this first)

You are not typing a separate "parameter list" into a form. Wix Triggered Emails work like this:

1. **In the email designer** you insert a **variable** into a text block (or the subject, where supported).
2. That inserts a placeholder such as `{{givenName}}`. The name you give the variable is what code must pass later.
3. You also set a **fallback** value (e.g. `there` for `Hi {{givenName}}` becomes `Hi there` if code forgets the variable).
4. **Preview & Test** sends the email using **fallbacks**, not a form of real values. That is normal. You will not see a screen to type `givenName = Jane` in the designer test.
5. **Real values** are filled only when code sends the email, e.g. `variables: { givenName: "Jane", ... }`. That happens after Step 4.

**How to add a variable in the designer**

1. Click into a text element in the email body (or subject if the UI allows variables there).
2. Click **+ Add Variable** (sometimes under Personalize / Variables).
3. **Variable name:** use the exact names from the tables below (`givenName`, `titleFld`, …). Spelling must match code later.
4. **Fallback value:** something safe if the value is missing (e.g. `there`, `Applicant`, `-`).
5. Click **Add**. The designer shows the placeholder; do not invent `{{...}}` by hand unless the UI already created it.

If you cannot find **+ Add Variable**, make sure you are editing a **Triggered Email** (Developer / Triggered Emails), not a normal Email Marketing campaign. Campaigns do not take Velo `variables` the same way.

**Email ID:** after save, copy the template's code ID (e.g. `assessorEoiReceived`). That string is what Velo passes as `emailId`. Wix also shows a code snippet per template with the variable keys — keep that for Cursor in Step 4.

**What "test" means for Step 2**

- Designer **Preview & Test** = layout + fallbacks look OK in your inbox. Enough for Step 3.
- Full personalisation test = after Step 4 code, run scenario T5 (real `givenName` etc. from the form).



### Where

Site dashboard → **Marketing & SEO** / **CRM** / **Developer tools** → **Triggered Emails** (wording varies). Create each template; copy the **Email ID** so it matches the table below exactly. If Wix only gives a UUID, write it here and tell Cursor to use that string.

### Templates


| Email ID (lock)          | Audience   | Subject                                     |
| ------------------------ | ---------- | ------------------------------------------- |
| `assessorEoiReceived`    | Applicant  | We received your PCotY assessor application |
| `assessorEoiAdminNotify` | Organisers | New PCotY assessor EOI: {{titleFld}}        |


Do **not** create A2/A3 auto-verify emails for submit. Seat outcomes later: D1/D2 or B1 — see [04-emails.md](04-emails.md).

### A1 — `assessorEoiReceived`

**Variables:** `givenName`, `familyName`, `titleFld`, `SITE_URL`

**Must say:** thanks; core team will check credential; seat not automatic; no login yet; closes 15 October.

```
Hi {{givenName}},

Thank you for applying to be a Stage 1 assessor for the Project Contractor of the Year Award.

We have your details. The core team will check your credential and decide on a seat application by application. You do not need a site login yet.

Expressions of interest close 15 October.

PCotY organisers
{{SITE_URL}}
```



### A1-Admin — `assessorEoiAdminNotify`

**Who receives it:** every Contact that has a specific **label** (tag) in Wix CRM. No hardcoded email list in code.

**Set up the label (do this in Step 2)**

1. Dashboard → **Contacts** → **Labels** (or open any contact → Labels).
2. Create (or reuse) the label with display name exactly: `**PCOTY-Core-Team**`.
3. Note the label **key** Wix assigns (often `custom.pcoty_2027_core_team` or similar). Write the exact key here for Cursor if it differs:
  - Label display name (locked): `PCOTY-Core-Team`
  - Label key: __________________ (copy from Contacts → Labels after create)
4. On each core-team Contact who must get every EOI, add label `PCOTY-Core-Team`.
5. Backend (Step 4) will: find that label by display name (or use the key you wrote), `queryContacts().hasSome("info.labelKeys", [labelKey])`, then `emailContact` for each. If zero contacts have the label, log an error (do not fail the applicant upsert / A1).

**Variables:** `titleFld`, `givenName`, `familyName`, `email`, `linkedin`, `credentialPmp`, `credentialPbp`, `pbpCandidateNumber`, `credlyBadgeUrl`, `pmiId`, `pipelineStatus`, `SITE_URL`

```
New assessor EOI (pipelineStatus: {{pipelineStatus}})

Name: {{titleFld}}
Email: {{email}}
LinkedIn: {{linkedin}}

PMP: {{credentialPmp}}
Credly badge: {{credlyBadgeUrl}}
PMI ID: {{pmiId}}

PBP: {{credentialPbp}}
Credential Number: {{pbpCandidateNumber}}

Review in CMS (Assessors), check the credential, then set verifiedBy and pipelineStatus.
{{SITE_URL}}
```

---



## Step 3 — Pre-code checklist (gate)

Tick **every** box before asking Cursor to generate code.

**Page / CMS / form**

- [x] Copy locked; no UAT / NDA / coach / Discord leftovers
- [x] Slug `/become-an-assessor`; `/uat-nda` redirects
- [x] `UAT NDA Document` unpublished or noindex
- [x] `Assessors` fields match Step 1C (no extra EOI collection)
- [x] All form element IDs match Step 1D exactly
- [x] `#boxPbpFields`, `#boxPmpFields`, `#textEoiError`, `#boxEoiThankYou` start collapsed
- [x] Not a CMS-connected Wix Form
- [x] Local Editor **Synced** to `ittdspace`
- [x] Mobile layout checked in Local Editor

**Emails**

- [x] `assessorEoiReceived` exists; Email ID exact; variables added; ready to send
- [x] `assessorEoiAdminNotify` exists; Email ID exact; variables added; ready to send
- [x] Label `PCOTY-Core-Team` exists; at least one core-team Contact tagged; label key noted if needed
- [x] Optional: Wix UI test-send of both templates to yourself passed

**When all ticked:** ask Cursor to implement Step 4 (`assessorEoi.web.js` + `Become an Assessor.u1buo.js`).

---



## Step 4 — Code (Cursor; only after Step 3)

Implement:

1. `src/backend/assessorEoi.web.js` — `submitAssessorEoi`
2. `src/pages/Become an Assessor.u1buo.js` — checkbox show/hide, validate, call backend, thank-you

**Backend must:**

- Upsert `Assessors` by `email`
- Set `title_fld` from given + family
- Set `pipelineStatus = New` on insert; leave `verifiedBy` blank
- If `loginEmail` matches a site member (`Members/PrivateMembersData`), set `userId` to that member `_id`; otherwise leave `userId` empty until invite
- Send `assessorEoiReceived` to applicant
- Send `assessorEoiAdminNotify` to every Contact labeled `PCOTY-Core-Team`
- **Not** call PBP or Credly APIs

**Page must:**

- Expand/collapse `#boxPbpFields` / `#boxPmpFields` from checkboxes
- Client validation (Step 1D messages), including `#checkboxCodeOfConduct` required (not sent to CMS)
- Backend also rejects if `codeOfConductAccepted` is not true (defense in depth; still do not persist it)
- Disable submit while running; on success collapse form / expand thank-you; on failure show `#textEoiError`

---



## Step 5 — Verify and test (after code)



### 5A. Smoke verify (before scenarios)

- [x] `npm run dev` / Local Editor loads the page without console errors on open
- [x] Checking PMP expands `#boxPmpFields`; unchecking collapses it
- [x] Checking PBP expands `#boxPbpFields`; unchecking collapses it
- [x] Empty submit shows an error; does not create a CMS row
- [x] Backend file exists and exports `submitAssessorEoi`



### 5B. Test scenarios (must all pass)

Use a real inbox you control for the applicant. Confirm at least one Contact with label `PCOTY-Core-Team` will receive admin mail. Check **Assessors** in CMS after each success case.


| #            | Scenario                                   | Steps                                                                                                        | Pass when                                                                                                                                                                                            |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1 - Passed  | Validation — blank form                    | Click Submit with nothing filled                                                                             | Error shown; no new/updated `Assessors` row; no emails                                                                                                                                               |
| T2 - Passed  | Validation — neither credential            | Fill name, email, LinkedIn; leave PMP/PBP unchecked                                                          | Error `Select PMP, PBP, or both.`; no CMS write                                                                                                                                                      |
| T3 - Passed  | Validation — PBP without Credential Number | Check PBP only; leave Credential Number empty                                                                | Error about Credential Number; no CMS write                                                                                                                                                          |
| T4 - Passed  | Validation — PMP without Credly URL        | Check PMP only; leave Credly empty                                                                           | Error about Credly URL; no CMS write                                                                                                                                                                 |
| T4c          | Validation — Code of Conduct               | Fill an otherwise valid form; leave `#checkboxCodeOfConduct` unchecked                                       | Error `Please agree to the PBF Code of Conduct.`; no CMS write                                                                                                                                       |
| T5 - passed  | Happy path — PBP only                      | Valid fields **including CoC checked**; PBP + Credential Number; submit                                      | Thank-you shown; CMS row correct; `pipelineStatus=New`; `verifiedBy` empty; `title_fld` set; `userId` set if email is already a site member (else empty); A1 + A1-Admin; **no CoC field on the row** |
| T5b - passed | Existing member email                      | Submit EOI using a known member login email (e.g. [peter.balogh@ittd.space](mailto:peter.balogh@ittd.space)) | `Assessors.userId` equals that member's `_id`                                                                                                                                                        |
| T6 - passed  | Happy path — PMP only                      | Same identity fields; PMP + Credly badge URL (+ optional PMI ID)                                             | Same as T5 for CMS/emails; PMP fields populated; PBP fields empty/false                                                                                                                              |
| T7 - passed  | Happy path — both                          | PMP + PBP both checked with both evidence fields                                                             | Both credential flags true; both evidence fields stored; both emails fire                                                                                                                            |
| T8 - passed  | Upsert same email                          | Submit T5, then submit again with same email and changed LinkedIn or name                                    | One row for that email (update, not duplicate); emails fire again; `pipelineStatus` still New unless you changed it by hand                                                                          |
| T9 - passed  | No login required                          | Submit while logged out                                                                                      | T5 still works                                                                                                                                                                                       |
| T10 - passed | Mobile                                     | Repeat T5 on a phone width                                                                                   | Layout usable; submit + thank-you work                                                                                                                                                               |
| T11 - passed | No auto-verify                             | After T5, inspect network / backend                                                                          | No calls to `cert.project-business.org` or Credly from submit                                                                                                                                        |
| T12 - passed | Manual seat path | In CMS, set `verifiedBy` and `pipelineStatus` to Active on a test row | Saves cleanly; public form never wrote those fields |
| T13 | Homepage Become an Assessor CTA | On award homepage, click `#btnBecomeAssessor` below countdown | Goes to `/become-an-assessor`; works while countdown is visible (before 1 Sep) |




### 5C. Failures — what to check


| Symptom                      | Check                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| Thank-you never shows        | Browser console; element IDs; backend error                                                        |
| CMS row missing              | Collection permissions; field keys; upsert by email                                                |
| No A1 / no admin mail        | Triggered Email IDs; template published; contact created; spam; Contacts labeled `PCOTY-Core-Team` |
| Wrong variable blank in mail | Variable names in template vs code                                                                 |


---



## Step 6 — Publish

- [x] All Step 5B scenarios passed on Local Editor / preview
- [x] Commit + push `main` inside `ittdspace/`
- [x] `npx wix publish` **or** Publish in Local Editor (one source only)
- [x] Live smoke: one real EOI to yourself on production
- [x] Warm-list can receive `/become-an-assessor`



## Done when

**Done (15 Aug 2026).** Live URL takes applications into `Assessors`, sends A1 + A1-Admin, fills `userId` when the email is already a member, and core team processes seats manually. Next: [phase 2](02-assessor-portal.md).