# 2026 Deadline Change — Execution Run

**Purpose:** Coordinate the change to the P-CotY 2026 nomination deadline and finalist announcement across operations, platform, communications, and project plans.

**Run status:** In progress — local document updates complete; human sign-offs and publishing/export steps remain.
**Decision:** Nominations close **30 November 2026**; finalists are announced **20 December 2026**.
**Decision date / owner:** [add]
**Run coordinator:** [add]

## Working Assumptions

- The nomination and client evaluation deadlines both move from **31 October to 30 November 2026**.
- The finalist announcement moves from **30 November to 20 December 2026**.
- Assessor expressions of interest close **15 November 2026**.
- Stage 2 presentations, winner announcement, and ceremony dates remain as currently published until their feasibility review is complete.
- Historical meeting records remain unchanged. Record the superseding decision in the decision log and current source documents.

## Run Board

Use `[ ]` for not started, `[-]` for in progress, and `[x]` for complete. Add owner, date, and evidence in the Notes column as work is done.

| ID  | Status | Action / completion evidence                                                                                                                                                                                | Lead                  | Notes                                                                                                                                                                                                                                                |
| --- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | [x]    | Confirm scope: this is a change to the overall public timeline milestone. No personal communications have been sent, so no individual date-change notification is needed.                                   | User confirmed        | Future finalist/applicant communications follow the updated program schedule; no separate postponement notice is required.                                                                                                                           |
| R2  | [x] | Confirm the assessor EOI cutoff moves to **15 November 2026**. | User confirmed | Sunday date and 15-day intake gap are recorded; operational capacity and coverage confirmed in R5–R6. |
| R3  | [x] | Record the revised dates in [DR-004](Decisions/DR-004-Deadline-Change.md), mark prior schedule dates superseded, and align current plans. | User confirmed | Historical meeting notes remain unchanged; DR-004 still needs a named owner. |
| R4  | [x] | Set the dated intake-to-finalist path and escalation gates in DR-004 and WS4. | WS1 / WS4 | Confirmed baseline: 1–3 Dec intake/assignment; 4–13 Dec scoring; 14–16 Dec moderation; 17 Dec approval; 18 Dec readiness; 20 Dec announcement. |
| R5  | [x] | Confirm assessor capacity and turnaround; check onboarding/calibration and escalation coverage. | WS2 / WS4 | Confirmed by user on 2026-10-04. |
| R6  | [x] | Confirm December volunteer/approver availability, support coverage, and finalist preparation expectations. | WS1 / WS2 / WS4 | Confirmed by user on 2026-10-04, including coverage for the Sunday 20 Dec milestone and holiday-period work. |
| R7  | [x] | Revalidate Stage 2, judge availability, finalist preparation time, winner date, and ceremony/publication date. | WS2 / WS4 / WS6 | Confirmed by user on 2026-10-04; January/February schedule retained. |
| R8  | [x] | Public website timeline and deadline changes completed. | User confirmed | No website edits made from this workspace. Backend settings/form-lock behavior were not independently tested here. |
| R9  | [x] | Update nominee/client source guides and templates, including the synchronized customer-evaluation deadline. | Copilot | Local files updated. |
| R10 | [-] | Extend local campaign plans and reusable copy through November; add proposed close reminders and corrected countdowns. | WS3 | Plans/copy updated; November placements and owners still need WS3 approval. Live scheduling/queued posts cannot be checked here. |
| R11 | [x] | Update reusable LinkedIn and partner/sponsor communications with revised dates. | Copilot | Local drafts/templates updated. Public websites are user-confirmed; no individual date-change notices are needed. |
| R12 | [-] | Update local Confluence source Markdown, checked-in publish snapshots, assessor pages, UAT summary, historical deck annotations, and maintained campaign material. | WS1 / document owners | Local sources/snapshots updated. Remote Confluence publishing not performed. PDFs remain stale: system Python lacks `markdown`; local Marked parser worked, but LibreOffice PDF conversion fails with `no valid pipe path found` in this environment. |
| R13 | [x] | Sweep repository date references and classify remaining old-date matches. | Copilot | Current reusable sources updated; historical and intentionally preserved references listed below. |
| R14 | [x] | Corrected public timeline published and verified. | User confirmed | No website edits made from this workspace. |
| R15 | [ ]    | Close the run: capture completed checks, unresolved risks, owners, and links to final decision and published timeline.                                                                                      | Run coordinator       | —                                                                                                                                                                                                                                                   |

## Critical-Path Review

Build the detailed dated plan in R4. At minimum, account for:

1. **30 Nov:** nomination and client evaluation close; lock new submissions.
2. **1–3 Dec:** intake, eligibility exceptions, assessor assignment, and COI checks.
3. **4–13 Dec:** independent Stage 1 scoring; check capacity at midpoint and reassign non-responsive assignments to reserves.
4. **14–16 Dec:** moderate scores and resolve outstanding cases; escalate unresolved eligibility/COI issues to WS4.
5. **17 Dec:** approve shortlist; **18 Dec:** complete release-readiness checks; **20 Dec:** announce finalists.
6. **After 20 Dec:** finalist preparation, judge coordination, Stage 2, winner decision, ceremony, and publication on the schedule confirmed in R7.

**Calendar note:** 20 Dec 2026 is a Sunday. R6 must confirm who will staff or pre-schedule the announcement and provide support coverage.

Do not assume the current “clean Christmas pause” remains achievable. The revised dates put the announcement immediately before the holiday period and compress Stage 1 after nominations close.

## Search Exceptions / Notes

| Date checked | Search or review | Historical / unchanged matches | Follow-up |
| ------------ | ---------------- | ------------------------------ | --------- |
| 2026-10-04 | Repository Markdown sweep for 31 Oct / 31 October, 30 Nov / 30 November, and 15 Oct / 15 October | DR-001 retains its original schedule but is marked superseded; the sent assessor warm-list email retains the text actually sent; June–September meeting notes, July sprint decisions/prep, archived material, and the delivered W1/UAT decks preserve historical dates. Decks now carry supersession notes. `voice-style-guide.md` uses 31 Oct only as a generic formatting example. | No remaining active reusable local copy found in the searched current guides, partner templates, content plans, or Confluence source pages. Remote publish still required. |
| 2026-10-04 | Audience-guide PDF export | Existing PDFs still reflect prior Markdown content; the source Markdown files are updated. | The exporter was run with the locally bundled Marked parser, but LibreOffice conversion failed with `no valid pipe path found`, including with an isolated profile and `/tmp`. Retry the documented exporter where LibreOffice can initialize normally. |
| 2026-10-04 | Confluence publication | Workspace Markdown and checked-in `.publish` snapshots updated. | Publish through the authorized Confluence workflow; credentials/API access were not available in this session. |

## Change Log

| Date       | Update                                                                                                              | By      |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| 2026-10-04 | Created execution run from the deadline-change impact review.                                                       | Copilot |
| 2026-10-04 | Completed R3: added DR-004, marked prior schedule dates superseded, and aligned current master, WS2, and WS4 plans. | Copilot |
| 2026-10-04 | Updated participant guides, recruitment/content/sponsor sources, Confluence sources and local snapshots; annotated historical decks; completed repository date sweep. | Copilot |
