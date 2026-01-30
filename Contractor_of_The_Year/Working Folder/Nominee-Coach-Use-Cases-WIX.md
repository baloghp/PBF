# Nominee Coach — Use Cases & WIX Implementation

**Actor:** Nominee Coach  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for nominee coach use cases

---

## Use Cases & Implementation

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

### Request completion from nominee
**Goal:** Remediate incomplete submissions.

**WIX Implementation:**
- "Request Completion" button on nomination detail page
- Form/modal to specify missing items
- Set deadline date picker
- **WIX Email Marketing** template triggered (WIX Velo)
- Update nomination status to "Incomplete"
- Store request details in Nominations Collection
- Deadline tracking and reminders

---

### Mark ineligible / reject
**Goal:** Enforce rules with auditability.

**WIX Implementation:**
- "Mark Ineligible" button on nomination detail page
- Form to record rejection reason (required)
- Update status to "Ineligible" or "Rejected" in Nominations Collection
- Store rejection reason and timestamp
- **WIX Velo** to send notification to nominee
- Lock nomination from further processing
- Audit trail entry

---

### Assign assessors
**Goal:** Start independent Stage 1 reviews.

**WIX Implementation:**
- "Assign Assessors" interface on nomination detail page
- **Dropdown** or multi-select showing available assessors (from Members Collection, filtered by Assessor role)
- Select 2-3 assessors
- Set deadline date picker
- Create records in **Assignments Collection** (WIX Velo)
- Link assignment to nomination and assessor
- Trigger assignment notifications (WIX Velo + Email Marketing)
- Update nomination status to "Under Review"

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

### Initiate moderation
**Goal:** Resolve major scoring divergence.

**WIX Implementation:**
- View all assessments for a nomination side-by-side
- **WIX Velo** detects discrepancies (>2 points variance)
- "Initiate Moderation" button when discrepancies flagged
- Create moderation record in **Moderation Collection** (optional)
- Notify assessors of moderation request (WIX Velo + Email)
- Provide moderation interface (see next use case)

---

### Record moderated result
**Goal:** Produce final Stage 1 scoring output.

**WIX Implementation:**
- Moderation interface showing all assessor scores
- Coach can adjust scores with justification
- Calculate moderated average (WIX Velo)
- Store final moderated scores in Nominations Collection or separate **ModeratedScores Collection**
- Update nomination with final score
- Lock assessments from further changes
- Audit trail of moderation decisions

---

### Shortlist nominations (per category)
**Goal:** Advance candidates to Stage 2.

**WIX Implementation:**
- Shortlisting dashboard filtered by category
- View all nominations with moderated scores
- Sort by total score and Criterion 9 (Innovation) score
- **Data Table** or **Repeater** with checkboxes
- Select top N nominations per category
- "Shortlist Selected" button
- Update status to "Shortlisted" in Nominations Collection
- Store shortlist decision with timestamp
- Trigger notifications (WIX Velo)

---

### Trigger Stage 1 notifications
**Goal:** Communicate outcomes consistently.

**WIX Implementation:**
- "Send Notifications" button after shortlisting complete
- **WIX Email Marketing** templates for:
  - Shortlisted nominees
  - Not shortlisted nominees (with feedback)
- **WIX Velo** function to batch send notifications
- Track notification status (sent/pending/failed)
- Store notification timestamp in Nominations Collection

---

### Export Stage 1 reporting
**Goal:** Operational visibility and audit trail.

**WIX Implementation:**
- "Export Report" button on dashboard
- **WIX Velo** function to generate CSV/Excel export
- Include: nominations, scores, assignments, decisions, timelines
- Download file or email export
- Filter by date range, category, status
- Scheduled exports (optional, WIX Velo scheduled functions)

---

## Nominee Coach Portal Structure

**Recommended Pages:**
1. **Dashboard** - Intake queue, progress overview, quick stats
2. **Intake Queue** - Newly submitted nominations
3. **Nomination Detail** - Review, check completeness/eligibility, assign assessors
4. **Assessment Monitor** - Track assessment progress and deadlines
5. **Moderation** - Resolve scoring discrepancies
6. **Shortlisting** - Select top nominations per category
7. **Reporting** - Export dashboards and metrics

**WIX Components:**
- Member Areas (authentication, role-based access)
- Collections (Nominations, Assignments, Assessments, optional Moderation)
- Repeaters/Data Tables (list views)
- Dynamic Pages (nomination detail)
- Forms (assignment, moderation inputs)
- Velo (validation, calculations, workflows, exports)
- Email Marketing (notifications)
