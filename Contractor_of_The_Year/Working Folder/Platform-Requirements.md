# Platform Requirements (actor- and use‑case driven)

This specification derives from the award concept and evaluation framework (client + contractor, two phases; written + client assessment → finalist presentation & jury Q&A).

## Actors
- Nominee (Contractor) submitter
- Client Representative signer (completes client assessment)
- Volunteer Screener (Stage 1 reviewers)
- Juror (Stage 2 panelists)
- Program Secretariat/Admin (ops, governance, reporting)
- Communications/Marketing (announcement assets)
- Observer/Steering (read-only oversight)

## Primary use cases
1) Nomination intake
   - Create account, start nomination, save draft
   - Complete structured form (≤2,000‑word narrative), upload artifacts (contract matrix, interface RACI, payment curve, code of conduct acknowledgment)
   - Add client representative details and route client assessment form for completion/signature
   - Validate completeness (field rules, required files), submit; receive confirmation

2) Client assessment capture
   - Client receives secure link; completes weighted scoring sheet (0–10 per line), adds evidence notes, signs/consents
   - System stores signed artifact (PDF/record) and exposes totals (% achieved) to nomination

3) Eligibility & admin screening (Stage 1)
   - Queue of new submissions with checklist (completion, eligibility window, evidence present, COI declarations)
   - Assign screeners; record pass/fail with reasons; request fixes via comment/request cycle

4) Volunteer evaluation (Stage 1 scoring)
   - Anonymous or masked packet view (as configured)
   - Score against weighted criteria (0–5) with descriptors; per‑criterion comments
   - Inter‑rater reliability view; shortlist tool (top N per category)

5) COI & recusal
   - Juror/reviewer COI attestations per cycle
   - Recusal per nomination; automatic exclusion from viewing/scoring conflicted entries; COI log

6) Finalist management (Stage 2)
   - Convert shortlist to finalists; schedule presentations; collect decks and demo assets
   - Juror portal for live scoring during presentation + Q&A; timer; question queue; moderation/outlier handling

7) Decisions & notifications
   - Moderation meeting workspace; score aggregation; tie‑break workflow; decision log
   - Batch notifications: acceptance/rejection/finalist/winner; templated emails and page links

8) Reporting & audit
   - Dashboards: submission funnel, completion rates, category mix
   - Scoring distribution, I/R reliability, COI/recusal ledger, change history
   - Export datasets (CSV/JSON); immutable decision/audit trail

9) Asset collection for publicity
   - For finalists/winners: collect bios, headshots, logos, project blurbs; consent capture; approval workflow

## Functional requirements
- Forms
  - Dynamic forms with conditional fields; file uploads with type/size limits; versioning
  - Rich‑text editor with word‑count; inline guidance/tooltips
- Workflow
  - Assignments, statuses, and SLA timers across intake → screening → scoring → finalist → decision
  - Commenting and request‑changes loop to nominee; history preserved
- Scoring
  - Configurable criteria/weights per category; rubric text; per‑criterion comments; auto totals
  - Separate client assessment capture with weight×rating table and signature; link totals into reviewer view
- Permissions
  - Role‑based access; fine‑grained visibility (e.g., jurors see only assigned, masked materials)
  - Read‑only observer role for steering
- Communications
  - Templated emails; reminders (time‑based and rule‑based); calendar invites for finalist sessions
- Content
  - Static pages for guidelines; ability to link out to Confluence pages

## Non‑functional requirements
- Security & privacy
  - Strong authentication (SSO or MFA); encryption in transit/at rest; configurable data residency; GDPR‑compliant consent and DPA
  - Data retention policies per artifact type; deletion/export on request
- Reliability & scale
  - High availability during deadlines; autosave drafts; idempotent submissions
- Usability & accessibility
  - WCAG‑compliant UI; clear progress indicators; mobile‑friendly nominee and juror portals
- Internationalization
  - Support multi‑region time zones and date formats; translatable copy

## Configuration checklist (pilot)
- Categories and criteria match Evaluation Framework; eligibility window configured
- Nomination form fields align with Submission Package; client assessment enabled
- COI attestation flow and recusal rules active; masking option set for Stage 1
- Reporting: scoring distribution, I/R reliability, COI log, audit trail
- Notifications: submission confirmation, reminder cadence, finalist scheduling, outcomes

## Buy‑vs‑configure rubric (pilot)
- Ready in ≤ 8 weeks, supports anonymous/masked review and weighted scoring natively
- Total pilot cost within budget constraints; allows export of all data/artifacts
- Admin self‑service for forms, criteria, roles, and notifications