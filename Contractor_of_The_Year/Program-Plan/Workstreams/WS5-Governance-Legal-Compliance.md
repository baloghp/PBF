# WS5 — Governance, Legal & Compliance

- **Jira Epic:** [SCRUM-5](https://ittd.atlassian.net/browse/SCRUM-5)
- **Status:** Draft v0.1
- **Owner:** [TBD]
- **Parent plan:** [Master Plan](../Master-Plan.md)

> Make the program fair, defensible, and legally sound.

---

## Objective

Provide the legal and governance scaffolding: official rules, conflict-of-interest enforcement, consent handling, data protection, and appeals.

## Scope

- In scope: Rules/T&Cs, COI policy enforcement & recusal records, publication/recording consent, GDPR/data-protection & retention, appeals process, NDAs.
- Out of scope: process execution (WS4), communications (WS6).

## Stories

| Story | Summary | Status | Notes (elaborate here) |
|-------|---------|--------|------------------------|
| [SCRUM-22](https://ittd.atlassian.net/browse/SCRUM-22) | Draft Rules / Terms & Conditions | **Drafted — VALIDATE** | Substance already exists across Confluence; needs validation + consolidation (see 5a) |
| [SCRUM-23](https://ittd.atlassian.net/browse/SCRUM-23) | Consent & data-protection (GDPR / retention) | **Drafted — VALIDATE** | Consent + 1-yr retention + GDPR-minimization already drafted; needs validation (see 5b) |
| [SCRUM-24](https://ittd.atlassian.net/browse/SCRUM-24) | Finalize appeals process | **OUTSTANDING — focus** | Referenced in 3.0 but flagged "to be finalised" with `X days` placeholders (see 5c) |

## Key Deliverables

- Official Rules / Terms & Conditions
- COI policy enforcement & recusal records
- Publication & recording consent forms
- GDPR / data-protection handling + 1-year retention policy
- Appeals process (currently "to be finalised")
- NDAs where required

## Dependencies

- WS1 (timeline). Feeds WS2 (COI), WS3 (eligibility rules), WS4 (gates), WS6 (consents).

## Open Questions

- [ ] Appeal window length (recommend **5 business days** from notification)
- [ ] Appeal response SLA (recommend **10 business days**)
- [ ] Appeals reviewer composition (recommend Program Owner + 1 uninvolved governance member; Oliver F. Lehmann as final escalation)
- [ ] Is a single consolidated **Rules / T&C** page wanted, or keep the rules distributed across existing pages with an index?
- [ ] Legal review needed for T&Cs and consents, or is internal validation sufficient for year one?
- [ ] Stage 2 **recording consent** capture mechanism confirmed (3.0/Eligibility both flag "authorization needs to be collected")

---

## Detailed Plan

> Two of the three deliverables are **already drafted** — the work is **validation**, not authoring. The real build is the **appeals process** (5c).
>
> **Jira note:** task codes below (e.g. `WS5-T01`) are **placeholders only** pending your review; we sync to Jira once agreed (same as WS2/WS3/WS4).

### Sub-track 5a — Rules / Terms & Conditions: VALIDATE (already drafted)  ([SCRUM-22](https://ittd.atlassian.net/browse/SCRUM-22))

The rules already exist, distributed across Confluence. Validation = confirm the standard T&C elements are all present, consistent, and current.

| Standard T&C element | Where it lives today | OK? |
|----------------------|----------------------|-----|
| Eligibility & entry rules | [Overview & Eligibility](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98566145) (project type, 2-yr window, two-actor requirement) | validate |
| Categories & assignment | [Overview & Eligibility](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98566145) (headcount bands) | validate (confirm 1–25 / 26–100 / 101+) |
| What to submit | [Submission Package](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98598913), [1.0 Submission & Intake](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130514945) | validate |
| Judging criteria & process | [Evaluation Framework](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98631681), [Governance & Jury Protocol](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97779722) | validate |
| Fairness / COI / recusal | [Governance & Jury Protocol](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97779722) → COI Policy link | **confirm COI Policy page exists & is filled** |
| Publication / IP / consent | [Governance & Jury Protocol](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97779722), [Client Assessment Form](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98664449) | validate |
| Decisions final / appeals clause | [3.0 Decision/Award](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130547713) | **depends on 5c** |
| Deadlines / key dates | [DR-001](../Decisions/DR-001-Cycle-Schedule.md); [SLAs & Metrics](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117833739) (`X days` placeholders) | **fill placeholders (WS1)** |

- `WS5-T01` ([SCRUM-84](https://ittd.atlassian.net/browse/SCRUM-84)) — **Validate T&C coverage** against the checklist above; log any gaps
- `WS5-T02` ([SCRUM-85](https://ittd.atlassian.net/browse/SCRUM-85)) — **Confirm COI Policy page** exists and is complete (referenced by Governance Protocol)
- `WS5-T03` ([SCRUM-86](https://ittd.atlassian.net/browse/SCRUM-86)) — **Decide consolidation**: single Rules/T&C index page vs. distributed (open question) and apply

### Sub-track 5b — Consent & Data Protection (GDPR / retention): VALIDATE (already drafted)  ([SCRUM-23](https://ittd.atlassian.net/browse/SCRUM-23))

Consent language, 1-year retention, and GDPR-minimization are already written. Validation = confirm each consent is actually captured by the live platform and is consistent everywhere.

| Item | Where it lives today | OK? |
|------|----------------------|-----|
| 1-year retention policy | [Submission Package](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98598913), [1.0 Submission & Intake](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130514945), [3.0](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130547713) | validate |
| GDPR scope (personal data only; minimize) | [Submission Package](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98598913) | validate |
| Retention + GDPR **acknowledgement at submission** | [1.0 Submission & Intake](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130514945) | **confirm captured in live form (WS4)** |
| Publication consent (short case profile) | [Submission Package](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98598913), [Client Assessment Form](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98664449) | validate |
| Client assessment consent (evaluation + comms) | [Client Assessment Form](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98664449) | validate |
| **Stage 2 recording consent** | [Governance Protocol](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97779722), [Eligibility](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98566145) (flagged "to be collected") | **gap — define capture point** |

- `WS5-T04` ([SCRUM-87](https://ittd.atlassian.net/browse/SCRUM-87)) — **Validate consent + retention coverage** against the checklist above
- `WS5-T05` ([SCRUM-88](https://ittd.atlassian.net/browse/SCRUM-88)) — **Confirm each consent is captured in the live platform** (submission acknowledgements; client form) — coordinate WS4
- `WS5-T06` ([SCRUM-89](https://ittd.atlassian.net/browse/SCRUM-89)) — **Close the Stage 2 recording-consent gap** (when/how it's collected from finalists)

### Sub-track 5c — Appeals Process: OUTSTANDING (the focus)  ([SCRUM-24](https://ittd.atlassian.net/browse/SCRUM-24))

The flow exists in [3.0 Decision/Award](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130547713) and the [Process Map](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117866524) (Appeals Gate), but the **policy itself is unfinalized**. Proposed design below for your review:

**Grounds (procedural, not re-judging):**
1. Material deviation from the published process/rules
2. Undisclosed conflict of interest that affected the outcome
3. Demonstrable factual/administrative error (e.g., score mis-entry, wrong category)

> Disagreement with the judges' professional opinion / subjective scoring is **not** a ground for appeal.

**Who can appeal:** any nominee who received a stage decision (Stage 1 shortlist outcome and/or final result).

**Window:** within **5 business days** (recommended) of the decision notification.

**How:** written submission to the Program Owner via the official channel, stating the ground and supporting evidence.

**Who reviews:** an Appeals Reviewer **independent of the original decision** — recommended Program Owner + 1 uninvolved governance member; if the Program Owner was involved in the contested decision, escalate to **Oliver F. Lehmann**. Reviewers must have no COI with the appellant.

**Response SLA:** within **10 business days** (recommended).

**Possible outcomes:** uphold original decision · correct an administrative error · re-run the specific affected step (e.g., re-score by an alternate assessor). No wholesale re-judging.

**Finality:** the appeal decision is final and binding; all other decisions are final.

**Publication hold (cooling-off):** results are held from publication until the appeals window closes (ties to [SLAs & Metrics](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117833739) "publication noting appeals period").

**Documentation:** all appeals + outcomes logged in the decision record (ties to WS4 [SCRUM-83](https://ittd.atlassian.net/browse/SCRUM-83) / 3.0).

- `WS5-T07` ([SCRUM-90](https://ittd.atlassian.net/browse/SCRUM-90)) — **Define appeals policy** (grounds, eligibility, window, review body, SLA, outcomes, finality) — confirm the recommended values
- `WS5-T08` ([SCRUM-91](https://ittd.atlassian.net/browse/SCRUM-91)) — **Wire appeals into the run** (publish process + deadline; cooling-off before publication; logging) — coordinate WS4/WS6
- `WS5-T09` ([SCRUM-92](https://ittd.atlassian.net/browse/SCRUM-92)) — **Backfill the `X days` placeholders** in 3.0 / SLAs & Metrics with the agreed appeal window + response SLA (with WS1)

### Backward timeline
| When | Tasks |
|------|-------|
| Now | 5a validate T&C (T01–T03); 5b validate consent/retention (T04–T06) |
| Before nominations open (Sep 2026) | 5c appeals policy agreed & published (T07–T08); placeholders filled (T09) |
| At each decision point | Appeals window honored; cooling-off before publication; outcomes logged |
