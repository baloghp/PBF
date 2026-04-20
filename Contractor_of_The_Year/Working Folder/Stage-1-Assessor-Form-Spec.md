# Stage 1 Assessor Form — Specification for Web Pages

**Purpose:** Define the structure and fields of the Stage 1 assessor form for WIX (or other) implementation, based on Confluence (Assessor Guide, 2.0 Assessment) and offline use cases (Assessor-Use-Cases-WIX.md).

**Scope:** Stage 1 only. Assessors are volunteers who independently score nominations and provide comments.

---

## Form overview

The assessor experience is a **multi-step form** (or equivalent multi-section page):

1. **Acknowledge assignment** (optional but recommended)
2. **COI declaration** (mandatory, before any review)
3. **Scoring** (9 criteria, 0–5 each)
4. **Per-criterion comments** (justification + optional evidence notes)
5. **Review & submit** (summary, validation, submit)

**Note:** Completeness and eligibility verification are the **Nominee Coach’s** responsibility, not the assessor’s. The coach uses a **Coach diary** (rich-text field) with a default template that includes the checks and process guidance. See **Coach-Diary-Default-Template.md** for the default content to load into that field.

Implement as either: one long form with clear sections, or separate steps/pages with Previous/Next and a progress indicator.

---

## Step 1: Acknowledge assignment

| Element | Type | Required | Notes |
|--------|------|----------|--------|
| Acknowledge | Button | No | Sets assignment status to "Acknowledged", records date |
| Request extension | Button/link | No | Notifies Nominee Coach; optional |

**Storage:** Assignments collection: `status = "Acknowledged"`, `acknowledgmentDate`.

---

## Step 2: COI declaration (mandatory before review)

**Goal:** Prevent biased review; enable recusal. Simplified: one checkbox; if assessor cannot confirm, show popup with explanation and next steps.

| Element | Type | Required | Notes |
|--------|------|----------|--------|
| No COI | Checkbox | Yes | Label e.g. "I confirm I have no conflict of interest with this nomination" — must be checked to continue |
| "I have or might have a conflict" link/button | Link or button | No | Opens **COI popup** (see below); does not submit form |
| Continue | Button | Yes | Enabled only when checkbox is checked. Store `coiChecked = true`, `coiIdentified = false`. If unchecked, block progress. |

**Popup (when user indicates they have or might have COI):** Use the text in **§ COI popup copy** below. Popup includes a single action (e.g. "Understood" or "Close") and optionally a link to the registration channel. Do not allow the user to proceed with this assignment; they must contact organisers.

**Storage:** Assignments collection: `coiChecked = true`, `coiIdentified = false` when checkbox confirmed. If user opens popup, you may log that they viewed it (optional); they cannot continue this assessment until they contact organisers and are potentially reassigned.

---

### COI popup copy

**Use this text in the popup (heading + body + what to do).**

**Heading:** What is a conflict of interest (COI)?

**Body:**

A conflict of interest is any situation where your personal, professional, or financial connections could affect your objectivity when evaluating this nomination. For example:

- A personal or family relationship with the nominee or their client  
- A financial interest in the project or the organisations involved  
- A current or recent business or employment relationship with the nominee or client  
- Any other situation where you feel you could not assess the nomination fairly and independently  

If any of these (or something similar) applies to you, you should not review or score this nomination.

**What to do:**

Please contact the organisers on the **registration channel** and tell them you have a conflict of interest with this assignment. They will arrange for another assessor to take it. Do not continue with this assessment.

---

## Step 3: Score nomination (9 criteria, 0–5 scale)

**Goal:** Structured evaluation per Evaluation Framework (Assessor Guide, 2.0 Assessment).

**Scale (show on form):**

- **0** = Not demonstrated / missing evidence  
- **1** = Poor  
- **2** = Fair  
- **3** = Good  
- **4** = Very good  
- **5** = Excellent  

**Criteria (order and labels):**

| # | Criterion (short label) | Full name (for tooltip/help) |
|---|--------------------------|------------------------------|
| 1 | Project Success (Outcomes) | Delivery vs baseline, benefits realisation, handover; measurable impact and transformation |
| 2 | Agility & Adaptability | Responsiveness to change, change control, fit with contracting model (incl. T&M considerations) |
| 3 | Commercial Model (Liquidity Impact) | Price realism, milestone cash flow, advances/retentions, liquidity/solvency for both parties |
| 4 | Legal Soundness | Law/jurisdiction, warranty/liability, privity, fit of contract to collaboration model |
| 5 | Interface and Governance | Customer–contractor boundary, escalation, decision rights, cross-corporate governance |
| 6 | Risk Management (Cross-Corporate) | Cross-party risk identification and mitigations (financial, operational, IP, cyber, regulatory, reputational, geopolitical) |
| 7 | People Development | Investment as % of net income/profit (0%, 0–5%, 5%+), impact, evidence of training/certs |
| 8 | Team and Business Acumen (Integrity and Conduct) | Leadership, balance of customer satisfaction and profitability, code of conduct, anti-corruption, transparency |
| 9 | **Innovation & Industry Advancement** ⭐ | Innovation, industry contribution, knowledge sharing, case study worthiness — **critical differentiator** |

**Form fields:**

| Element | Type | Required | Notes |
|--------|------|----------|--------|
| Criterion 1–9 score | Dropdown or radio (0–5) | Yes | One per criterion; show criterion name + short description/descriptors |
| Progress indicator | UI | — | e.g. "Criterion 3 of 9" or step indicator |
| Previous / Next | Buttons | — | If multi-page; persist scores on step change |

**Storage:** Assessments collection. Prefer named fields for clarity, e.g.  
`d1_project_success`, `d2_agility`, `d3_commercial_model`, `d4_legal_soundness`, `d5_interface_governance`, `d6_risk_management`, `d7_people_dev`, `d8_business_acumen`, `d9_innovation` (all integer 0–5).  
Alternative: `score1` … `score9` if that matches your schema.

**UX note:** Highlight Criterion 9 (Innovation & Industry Advancement) as critical (e.g. callout, icon, or short note that winners typically score 4–5 here).

---

## Step 4: Per-criterion comments

**Goal:** Justification and evidence notes for moderation and feedback (Assessor Guide Step 6).

For **each** of the 9 criteria:

| Element | Type | Required | Notes |
|--------|------|----------|--------|
| Justification / Comments | Text area (or rich text) | Yes | Why this score; strengths; gaps; constructive feedback |
| Evidence notes | Text area | No | References to submission sections or artifacts |

Optional: character limits (enforced in Velo). Allow save as draft before final submit.

**Storage:** e.g. `comment1` … `comment9`, `evidenceNotes1` … `evidenceNotes9`. If schema uses a single notes field, consider structured JSON or concatenated sections.

---

## Step 5: Review & submit

**Goal:** Confirm all inputs and lock submission (Assessor-Use-Cases-WIX § Submit assessment).

| Element | Type | Required | Notes |
|--------|------|----------|--------|
| Summary | Read-only | — | List all 9 scores + short comment summary (e.g. first 100 chars per criterion) |
| Total score preview | Calculated | — | Weighted total (if weights configured); display only |
| Validation | Back-end | Yes | All 9 criteria scored (0–5), all 9 justification comments non-empty |
| Submit assessment | Button | Yes | Confirm; then lock assessment from further editing |

**On submit:**

- Set Assessments: `status = "Submitted"`, `submittedDate` (and optionally `totalScore` if calculated).
- Set Assignments: status = "Completed".
- Trigger notification to Nominee Coach (e.g. Velo + email).

**Validation (Velo):**

- All scores in 0–5.
- All required comments present.

---

## Data model summary (Assessments collection)

Suggested fields for the **Stage 1 assessor form** (align with your existing schema where names differ):

| Field | Type | Notes |
|-------|------|--------|
| assessment_id | ID | PK |
| nomination_id | Reference | FK to nomination |
| assessor_id | Reference | Current member (assessor) |
| coiChecked | Boolean | From COI step |
| coiIdentified | Boolean | |
| coiReason | Text | If COI |
| d1_project_success … d9_innovation | Integer 0–5 | Or score1–score9 |
| comment1 … comment9 | Text | Justification per criterion |
| evidenceNotes1 … evidenceNotes9 | Text | Optional |
| totalScore | Number | Optional; weighted sum if weights used |
| status | Text | e.g. "Draft" \| "Submitted" |
| submittedDate | Date | When submitted |

Completeness and eligibility are verified by the **Nominee Coach** (via Coach diary and platform actions); the coach marks the nomination as ready for assessment before or when assigning assessors. No separate verification fields are required on the assessor submission.

---

## Portal context (reminder)

- **Dashboard:** Assigned nominations, deadlines, quick stats; link to start/continue assessment.
- **Nomination review:** Read-only view of nomination packet (narrative, artifacts, Client Assessment) so assessors can review before/in parallel with the form.
- **Assessment form:** The multi-step form described above.
- **Completed assessments:** List of submitted assessments (read-only).

Access control: only the assigned assessor can see and submit the form for that assignment; COI and verification gates enforced in Velo.

---

## References

- **Confluence:** [Assessor Guide](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130056195) (Stage 1 evaluation, 9 criteria, 0–5 scale, comments).
- **Confluence:** [2.0 Assessment](https://ittd.atlassian.net/wiki/spaces/PBF/pages/129204226) (Stage 1 process, COI, verification, scoring, shortlisting).
- **Offline:** `Assessor-Use-Cases-WIX.md` (WIX implementation, portal structure, collections).
- **Offline:** `Assessor-Guide.md` (same content as Confluence Assessor Guide).
- **Data:** `datastructure.mmd` (Assessments: d1–d9, assessor_id, nomination_id).
