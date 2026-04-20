# Nominee Coach — Use Cases & WIX Implementation

**Actor:** Nominee Coach  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for nominee coach use cases

---

## Use Cases & Implementation (revised)

### Log in / log out
**Goal:** Secure access to coach tools.

**WIX Implementation:**
- **WIX Member Areas** with "Nominee Coach" member type
- Member Login element on coach portal
- Role-based access control (coach-only pages)
- Session management by WIX

---

### View intake queue
**Goal:** Manage processing flow.

**WIX Implementation:**
- **Repeater** element displaying nominations from Nominations Collection
- Filter: status = "Submitted"
- Sort by submission date
- Show: nominee name, category, submission date, status
- Link to nomination detail page
- Dashboard widget showing queue count

---

### Run completeness check
**Goal:** Ensure submissions are review-ready.

**WIX Implementation:**
- **WIX Velo** function to validate completeness
- Check against checklist: required fields, file uploads, word counts, sections present
- Display completeness status on nomination detail page
- Checklist UI with checkmarks/X marks
- Missing items highlighted
- Store completeness result in Nominations Collection (completenessVerified field)

---

### Run eligibility check
**Goal:** Ensure only eligible nominations proceed.

**WIX Implementation:**
- **WIX Velo** function to validate eligibility criteria
- Check: project type, contractor status, completion window, category classification
- Display eligibility status on nomination detail page
- Eligibility checklist UI
- Store eligibility result in Nominations Collection (eligibilityVerified field)
- Flag ineligible nominations clearly

---

### Coach diary (completeness & eligibility workflow)
**Goal:** Guide the coach through Stage 1 with a single working record: checks, guidance, and placeholders.

**WIX Implementation:**
- Add **Coach diary** to Nominations Collection (or linked CoachDiary collection): **Rich Text** field, one per nomination.
- When the coach first opens the diary for a nomination (or when nomination is assigned to coach), pre-populate the field with the **default template** (see **Coach-Diary-Default-Template.md**). The template includes:
  - Eligibility checklist (project type, contractor status, completion window, category)
  - Completeness checklist (written submission, Exemplary / Impact / Lessons sections, artifacts, Client Assessment Form)
  - Placeholders for nominee name, dates, assessor names, notes
  - Guidance and checklists for: assign assessors, COI recusals, monitor progress, moderation, final score & shortlisting, notify nominee
- Coach edits the diary in place (tick off checks, replace placeholders, add notes). No separate "completeness/eligibility form" is required; the diary encapsulates the process.
- Optional: when coach marks "Ready for assessment: Yes" in the diary (or via a separate checkbox/action), set `completenessVerified` and `eligibilityVerified` in Nominations Collection for workflow/display purposes.

---

### Assign assessors
**Goal:** Start independent Stage 1 reviews.

**WIX Implementation (revised decision):**
- **Admins handle all assignments** (coach does not self-assign assessors in-app).
- Communication and reminders are handled **outside WIX** (Discord).
- In-app coach workflow does not include assignment UI.

---

### Manage COI recusals
**Goal:** Preserve fairness and independence.

**WIX Implementation:**
- View assignments with COI status
- "Replace Assessor" action when COI identified
- Remove conflicted assessor from assignment
- Assign replacement assessor (same interface as initial assignment)
- Update Assignments Collection
- Notify new assessor (WIX Velo)
- Audit trail of recusal and replacement

---

### Monitor assessment progress
**Goal:** Keep Stage 1 on schedule.

**WIX Implementation:**
- Dashboard showing all assigned nominations
- Progress indicators: Assigned, In Progress, Completed, Overdue
- Deadline countdown/timeline
- Filter by status, assessor, deadline
- **Repeater** or **Data Table** showing assignments
- Color coding for urgency (green/yellow/red)
- Completion percentage per nomination

---

## Nominee Coach Portal Structure

**Recommended Pages:**
1. **Dashboard** - Intake queue, progress overview, quick stats
2. **Intake Queue** - Newly submitted nominations
3. **Nomination Detail** - Review, check completeness/eligibility, assign assessors
4. **Assessment Monitor** - Track assessment progress and deadlines
5. (Optional) **Reporting** - View dashboards and metrics (if needed)

**WIX Components:**
- Member Areas (authentication, role-based access)
- Collections (Nominations, Assignments, Assessments, optional Moderation)
- Repeaters/Data Tables (list views)
- Dynamic Pages (nomination detail)
- Forms (assignment, moderation inputs)
- Velo (validation, calculations, workflows, exports)
- Email Marketing (notifications)
