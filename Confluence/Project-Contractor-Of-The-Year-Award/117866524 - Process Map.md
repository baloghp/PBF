# Process Map

- Page ID: `117866524`
- URL: `https://ittd.atlassian.net/wiki/spaces/PBF/pages/117866524/Process+Map`
- Confluence version: `2026-06-29T21:19:21.359Z`

## Body

> **Updated post-UAT Jun 2026 — Coach role removed.** See [DR-002 — Drop Nominee Coach role (Post-UAT)](https://ittd.atlassian.net/wiki/spaces/PBF/pages/245989377).

# Process Map

Cover: Submission → Assessment → Award process. This page provides an overview of the complete process lifecycle with links to detailed subpages for each phase.

## Overview

This process map covers the complete lifecycle from Submission → Assessment → Award for the PBF Contractor of the Year program. The process follows a two-stage evaluation model with **independent assessor screening (Stage 1)** and **judging panel evaluation (Stage 2)**. Intake eligibility/completeness is handled by **automated pre-screening** before Stage 1.

---

## End-to-End Process Flow

```mermaid
flowchart TD
    A[Nominee Submits] --> B[Intake & Validation]
    B --> C{Eligible & Complete?}
    C -->|No| D[Request Completion/Reject]
    C -->|Yes| E[Stage 1: Assessor Screening]
    E --> F{Meets Shortlist Criteria?}
    F -->|No| G[Provide Feedback]
    F -->|Yes| H[Stage 2: Judging Panel]
    H --> I{Meets Winner Criteria?}
    I -->|No| J[Recognize as Finalist]
    I -->|Yes| K[Winner Selection]
    K --> L[Publication & Award]
    
    style A fill:#e1f5ff
    style K fill:#c8e6c9
    style L fill:#c8e6c9
    style D fill:#ffcdd2
    style G fill:#fff9c4
```

---

## Process Phases

### [1.0 Submission and Intake](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130514945)

Covers nomination submission, **automated pre-screening**, and eligibility validation (PM handles exceptions).

**Key sub-processes:**

* 1.1 Nomination Submission
* 1.2 Intake and Initial Validation

**Key outputs:** Complete, eligible nominations ready for assessor assignment

---

### [2.0 Assessment](https://ittd.atlassian.net/wiki/spaces/PBF/pages/129204226)

Covers the two-stage evaluation process.

**Key sub-processes:**

* 2.1 Stage 1 – Independent Assessor Screening and Evaluation
* 2.2 Stage 2 – Judging Panel Presentation & Q&A

**Key outputs:** Shortlisted nominees (Stage 1), Winners selected (Stage 2)

---

### [3.0 Decision/Award](https://ittd.atlassian.net/wiki/spaces/PBF/pages/130547713)

Covers winner selection, notification, and award publication.

**Key sub-processes:**

* 3.1 Winner Selection and Notification
* 3.2 Award Publication and Ceremony

**Key outputs:** Winners notified, Award published on ITTD and PBF websites

---

## Key Decision Points

```mermaid
flowchart TD
    A[Submission Received] --> B{Eligibility Gate}
    B -->|Eligible & Complete| C[Stage 1 Assessment]
    B -->|Not Eligible/Incomplete| D[Request Completion/Reject]
    C --> E{Shortlist Gate}
    E -->|Meets Criteria| F[Stage 2 Assessment]
    E -->|Does Not Meet| G[Provide Feedback]
    F --> H{Winner Gate}
    H -->|Meets Criteria| I[Select Winner]
    H -->|Does Not Meet| J[Recognize as Finalist]
    I --> K{Appeals Gate}
    K -->|Appeal Received| L[Process Appeal]
    K -->|No Appeal| M[Publication]
    L --> M
    
    style I fill:#c8e6c9
    style M fill:#c8e6c9
    style D fill:#ffcdd2
    style G fill:#fff9c4
```

1. **Eligibility Gate** (1.2): Is nomination eligible and complete?

    * Yes → Proceed to Stage 1
    * No → Request completion or reject
    
2. **Shortlist Gate** (2.1): Does nomination meet shortlist criteria?

    * Yes → Proceed to Stage 2
    * No → Provide feedback, end process
    
3. **Winner Gate** (2.2): Does finalist meet winner criteria?

    * Yes → Select as winner
    * No → Recognize as finalist
    
4. **Appeals Gate** (3.1): Is there an appeal?

    * Yes → Process appeal
    * No → Proceed to publication
    

---

## Quality Gates

* **Completeness Gate:** All required materials submitted
* **Eligibility Gate:** Meets eligibility criteria
* **COI Gate:** No conflicts of interest in evaluation
* **Quorum Gate:** Sufficient evaluators available after recusals
* **Quality Gate:** Minimum **≥2** independent assessor reviews per nomination (target 3 when capacity allows)
* **Documentation Gate:** All decisions documented with rationale

---

## Handoffs Between Phases

1. **Intake → Stage 1:** PM assigns **≥2 assessors** per complete, eligible nomination
2. **Stage 1 → Stage 2:** Shortlisted nominations prepared for judging panel; **Communications Coordinator** notifies applicants
3. **Stage 2 → Decision:** Finalist scores and recommendations to **Project Manager**; Programme Owner sign-off on winners
4. **Decision → Award:** **Communications Coordinator** publishes results (WS6 coordination)

---

## Metrics and Monitoring

* **Average Intake Time:** Σ (Eligibility Decision – Submission Date) ÷ # applications
* **Assessment SLA Compliance %:** (# assessments completed within SLA) ÷ (total assessments) × 100
* **Applicant Satisfaction Score:** (Positive responses ÷ total responses) × 100
* **End-to-End Cycle Time:** Award Date – Submission Date

---

## Notes for Review

* All SLA values (X days) need to be defined based on operational capacity
* Process assumes platform/system supports workflow automation
* Appeals process details need to be finalized
* Publication locations confirmed: ITTD website and PBF website
* Ceremony format (virtual vs in-person) needs decision
* Data retention policy: 1 year retention (GDPR applies only to personal data)

---

_This process map should be reviewed and approved before implementation. All stakeholders should review and provide feedback._
