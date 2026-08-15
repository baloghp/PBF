# Stage 1 Assessor Platform Spec

- Parent: [Assessor Recruitment Workstream — Cycle 1](284164097 - Assessor Recruitment Workstream — Cycle 1.md)
- Page ID: `284196865`
- URL: `https://ittd.atlassian.net/wiki/spaces/PBF/pages/284196865/Stage+1+Assessor+Platform+Spec`
- Confluence version: `2` · `2026-08-09T15:56:55.575Z`

## Body

**Status:** Active · **Hub:** [Assessor Recruitment Workstream](284164097 - Assessor Recruitment Workstream — Cycle 1.md)  
**Scope:** Stage 1 assessor portal + form (Wix). Scoring _meaning_ lives in the [Assessor Guide](130056195 - Assessor Guide.md).

**This page = product / implementation only.**

---

## Roles (no coach)

| Role | Owns |
| --- | --- |
| **Admin / organisers** | Assign assessors · eligibility & completeness gate before assignment · COI reassignment · reminders (Discord) · moderation if needed |
| **Assessor** | Acknowledge · COI confirm · read packet · score 9 criteria · comments · submit |

---

## Portal pages

1. Dashboard — assignments, deadlines, stats
2. My Assignments — list + status
3. Nomination Review — read-only packet (narrative, artifacts, Client Assessment)
4. Assessment Form — steps below
5. Completed — submitted (read-only)
6. Moderation — optional; may stay outside Wix

**Wix:** Member Areas (Assessor type) · Collections (Assignments, Assessments, Nominations) · Forms · Dynamic pages · Repeaters · Velo · Email.

---

## Form steps

1. Acknowledge (optional) → `status = Acknowledged`, date. Optional: request extension → notify **organisers**.
2. **COI (mandatory)** — see below.
3. Score criteria 1–9 (0–5).
4. Justification (required) + evidence notes (optional) per criterion.
5. Review & submit → lock; notify organisers.

Eligibility/completeness is **not** an assessor step — Admin gates before assign.

---

## COI (single path)

| Element | Notes |
| --- | --- |
| "I confirm no COI" checkbox | Required to continue → `coiChecked=true`, `coiIdentified=false` |
| "I have / might have a conflict" | Opens popup; **cannot** continue this assignment |

**Popup heading:** What is a conflict of interest (COI)?

**Body:** Any personal, professional, or financial connection that could affect objectivity — e.g. relationship with nominee/client, financial interest, current/recent business or employment, or anything that would stop a fair independent assessment.

**What to do:** Contact organisers on the **registration channel**. They will reassign. Do not continue.

---

## Scoring fields (UI)

**Scale:** 0 Not demonstrated · 1 Poor · 2 Fair · 3 Good · 4 Very good · 5 Excellent.

| # | Short label | Help / tooltip |
| --- | --- | --- |
| 1 | Project Success (Outcomes) | Delivery vs baseline, benefits, handover; measurable impact |
| 2 | Agility & Adaptability | Change control; fit to contracting model (incl. T&M) |
| 3 | Commercial Model (Liquidity) | Price, milestones, advances/retentions, liquidity both parties |
| 4 | Legal Soundness | Law/jurisdiction, warranty/liability, privity, fit to model |
| 5 | Interface and Governance | Boundary, escalation, decision rights, cross-corporate governance |
| 6 | Risk Management (Cross-Corporate) | Cross-party risks + mitigations |
| 7 | People Development | Investment % of profit (0 / 0–5 / 5%+) , evidence |
| 8 | Team & Business Acumen | Leadership, integrity, anti-corruption, transparency |
| 9 | **Innovation & Industry Advancement** | Critical differentiator — winners typically 4–5 |

Full descriptors: [Assessor Guide](130056195 - Assessor Guide.md).

**Storage (Assessments):** `d1_project_success` … `d9_innovation` (or score1–9) · `comment1–9` · `evidenceNotes1–9` · `totalScore` optional · `status` Draft|Submitted · `submittedDate` · COI flags on Assignments.

On submit: Assessments → Submitted; Assignments → Completed; notify organisers.

---

## Links

[Hub](284164097 - Assessor Recruitment Workstream — Cycle 1.md) · [Strategy & Offer](263618649 - Assessor Recruitment Strategy — Cycle 1.md) · [Assessor Guide](130056195 - Assessor Guide.md) · [2.0 Assessment](129204226 - 2.0 Assessment.md)
