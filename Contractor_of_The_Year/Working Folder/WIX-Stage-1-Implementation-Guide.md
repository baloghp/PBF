## Stage 1 — Actors & Use Cases (Draft)

**Scope:** Stage 1 only (intake/validation + volunteer screening + scoring).  
**Actors:** Nominee, Nomination Client, Nominee Coach, Assessor, System (automation), Admin.  
**Instruction:** Use cases listed only (brief description + goal). Start from user registration.

---

### Nominee

- **Register account**: Create a member account on the platform. **Goal:** enable authenticated access and ownership of submissions.
- **Log in / log out**: Authenticate into/out of the portal. **Goal:** secure access to nominee features.
- **Start nomination**: Create a new nomination record. **Goal:** begin the submission workflow.
- **Save draft nomination**: Save incomplete nomination data. **Goal:** allow completion over multiple sessions.
- **Submit nomination**: Finalize and submit the nomination package. **Goal:** enter Stage 1 intake/validation.
- **Provide customer contact**: Enter client representative details. **Goal:** enable client assessment request flow.
- **Upload required artifacts**: Upload evidence documents required for Stage 1. **Goal:** satisfy completeness requirements.
- **Provide required narrative sections**: Provide written submission + required sections. **Goal:** supply evidence for Stage 1 scoring.
- **View nomination status**: View lifecycle status (e.g., Submitted, Under Review, Incomplete). **Goal:** transparency and tracking.
- **Respond to completion request**: Provide missing items after a request. **Goal:** remediate incompleteness within deadline.
- **Withdraw nomination**: Withdraw a nomination (within allowed window). **Goal:** allow nominee-controlled termination.
- **Receive Stage 1 outcome notification**: Receive shortlist / not-shortlisted result. **Goal:** communicate Stage 1 decision.
- **Receive Stage 1 feedback (if not shortlisted)**: Receive feedback summary. **Goal:** enable improvement for future cycles.

---

### Nomination Client

- **Access client assessment form**: Open contractor evaluation form via secure link. **Goal:** enable client evaluation of contractor performance.
- **Complete contractor evaluation**: Rate 7 criteria (0-10 scale) with weights, calculate scores. **Goal:** provide structured client assessment.
- **Add evidence notes**: Provide justification for ratings ≥8 or ≤4. **Goal:** support scoring with evidence.
- **Sign and consent**: Sign form and provide consent for evaluation and publication. **Goal:** formalize assessment and enable publication.
- **Submit client assessment**: Finalize and submit completed assessment form. **Goal:** complete client assessment requirement for nomination.

---

### Nominee Coach

- **Log in / log out**: Authenticate into/out of coach portal. **Goal:** secure access to coach tools.
- **View intake queue**: View newly submitted nominations pending checks. **Goal:** manage processing flow.
- **Run completeness check**: Validate required fields/files/sections. **Goal:** ensure submissions are review-ready.
- **Run eligibility check**: Validate eligibility criteria. **Goal:** ensure only eligible nominations proceed.
- **Request completion from nominee**: Send missing-items request + deadline. **Goal:** remediate incomplete submissions.
- **Mark ineligible / reject**: Record ineligibility decision with reason. **Goal:** enforce rules with auditability.
- **Assign assessors**: Assign nominations to 2–3 assessors. **Goal:** start independent Stage 1 reviews.
- **Manage COI recusals**: Replace assessors with COI. **Goal:** preserve fairness and independence.
- **Monitor assessment progress**: Track completion vs deadlines. **Goal:** keep Stage 1 on schedule.
- **Initiate moderation**: Trigger moderation for large discrepancies. **Goal:** resolve major scoring divergence.
- **Record moderated result**: Store final moderated score/outcome. **Goal:** produce final Stage 1 scoring output.
- **Shortlist nominations (per category)**: Select top N per category. **Goal:** advance candidates to Stage 2.
- **Trigger Stage 1 notifications**: Send shortlisted/not-shortlisted messages. **Goal:** communicate outcomes consistently.
- **Export Stage 1 reporting**: Export dashboards/metrics. **Goal:** operational visibility and audit trail.

---

### Assessor

- **Log in / log out**: Authenticate into/out of assessor portal. **Goal:** secure access to assessment tasks.
- **View assigned nominations**: View nominations assigned to the assessor. **Goal:** understand workload and deadlines.
- **Acknowledge assignment**: Confirm ability to complete by deadline. **Goal:** establish commitment and accountability.
- **Declare COI (per nomination)**: Declare COI/no-COI before review. **Goal:** prevent biased review and enable recusal.
- **Access nomination packet**: View submission narrative and artifacts. **Goal:** review evidence needed to score.
- **Verify completeness/eligibility (assessor check)**: Confirm minimum materials exist. **Goal:** avoid scoring incomplete packets.
- **Score nomination (9 criteria)**: Provide 0–5 scores per criterion. **Goal:** produce structured evaluation.
- **Add per-criterion comments**: Provide justification/evidence notes. **Goal:** enable feedback and moderation.
- **Submit assessment**: Finalize and submit scores/comments. **Goal:** complete Stage 1 evaluation input.
- **Participate in moderation (if requested)**: Justify/adjust scores. **Goal:** improve consistency and fairness.

---

### System (Automation)

- **User registration workflow**: Create nominee accounts (self-registration), verify email, assign role. **Goal:** secure onboarding and correct access control. (Note: Assessors and Nominee Coaches are created by Admin, not self-registered.)
- **Authentication & authorization**: Enforce login and role-based access. **Goal:** prevent unauthorized access.
- **Submission validation**: Validate required fields/files/limits at submit time. **Goal:** reduce incomplete submissions.
- **Status lifecycle updates**: Apply workflow state transitions. **Goal:** consistent stage tracking.
- **Assignment notifications**: Notify assessors on assignment + send reminders. **Goal:** timely assessment completion.
- **COI enforcement**: Restrict access to conflicted nominations after COI. **Goal:** prevent biased viewing/scoring.
- **Score aggregation**: Compute totals and store results. **Goal:** enable ranking and reporting.
- **Discrepancy detection**: Flag outlier scores / large variance. **Goal:** trigger moderation when needed.
- **Shortlist calculation support**: Generate ranked lists per category. **Goal:** assist coach/admin shortlisting.
- **Outcome notifications**: Send shortlisted/not-shortlisted and feedback templates. **Goal:** consistent communications.
- **Audit logging**: Log critical actions (assignments, COI, decisions). **Goal:** traceability and compliance.
- **Data export**: Provide exports of nominations/assessments. **Goal:** reporting and backup.

---

### Admin

- **Register admin account**: Create admin account. **Goal:** enable privileged access to administration features.
- **Create/manage assessor accounts**: Invite/approve/disable assessors; manage roles. **Goal:** maintain reviewer roster and access control.
- **Create/manage nominee coach accounts**: Invite/approve/disable nominee coaches; manage roles. **Goal:** maintain coach roster and access control.
- **Configure Stage 1 settings**: Configure thresholds, categories, and stage settings. **Goal:** align the platform to the process.
- **Manage intake exceptions**: Handle duplicates/resets/technical issues. **Goal:** keep workflow unblocked.
- **Override assignments (if needed)**: Reassign for capacity/governance reasons. **Goal:** operational continuity.
- **Manage templates & automated messages**: Configure message templates. **Goal:** consistent communications.
- **Handle data retention/admin requests**: Execute deletes/exports per policy. **Goal:** compliance and governance.

