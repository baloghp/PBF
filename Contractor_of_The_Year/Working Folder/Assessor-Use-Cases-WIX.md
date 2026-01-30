# Assessor — Use Cases & WIX Implementation

**Actor:** Assessor  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for assessor use cases

---

## Use Cases & Implementation

### Log in / log out
**Goal:** Secure access to assessment tasks.

**WIX Implementation:**
- **WIX Member Areas** with "Assessor" member type
- Member Login element on assessor portal
- Role-based access control (assessor-only pages)
- Session management by WIX

---

### View assigned nominations
**Goal:** Understand workload and deadlines.

**WIX Implementation:**
- **Repeater** element displaying assignments from Assignments Collection
- Filter: assessorId = current member ID
- Show: nomination details, deadline, status, progress
- Sort by deadline (urgent first)
- Dashboard showing: assigned count, in progress, completed, overdue
- Link to start/continue assessment

---

### Acknowledge assignment
**Goal:** Establish commitment and accountability.

**WIX Implementation:**
- "Acknowledge Assignment" button on assignment card
- Confirmation dialog
- Update Assignments Collection: status = "Acknowledged", acknowledgmentDate
- Optional: allow assessor to request deadline extension (notify Nominee Coach)
- Track acknowledgment in audit log

---

### Declare COI (per nomination)
**Goal:** Prevent biased review and enable recusal.

**WIX Implementation:**
- COI declaration form (first step in assessment workflow)
- Checkboxes for COI types: personal, financial, business, employment, family
- Text field for COI details/reason
- "No COI" option
- Store in Assignments Collection: coiChecked = true, coiIdentified = true/false, coiReason
- If COI: stop workflow, notify Nominee Coach, update status to "Recused"
- If no COI: proceed to assessment
- **WIX Velo** to enforce: cannot access nomination if COI declared

---

### Access nomination packet
**Goal:** Review evidence needed to score.

**WIX Implementation:**
- **Dynamic Page** showing nomination details
- Pull from Nominations Collection (filtered by assignment)
- Display: all narrative sections (read-only rich text)
- **File Download** buttons for evidence artifacts
- Client Assessment Form viewer/download
- Organized sections matching submission structure
- Print-friendly view (optional)

---

### Verify completeness/eligibility (assessor check)
**Goal:** Avoid scoring incomplete packets.

**WIX Implementation:**
- Checklist interface in assessment form
- Verify: required sections present, files uploaded, client assessment complete
- Checkboxes for each requirement
- If incomplete: flag and notify Nominee Coach (WIX Velo)
- Store verification in Assessments Collection: completenessVerified, eligibilityVerified
- Cannot proceed to scoring until verified (WIX Velo validation)

---

### Score nomination (9 criteria)
**Goal:** Produce structured evaluation.

**WIX Implementation:**
- Multi-page or sectioned **WIX Form** for scoring
- One section per criterion (9 total)
- Each criterion shows:
  - Criterion name and description
  - Performance descriptors (0-5 scale)
  - Score input: **Dropdown** or **Radio Buttons** (0-5)
- Store scores in Assessments Collection: score1 through score9
- Progress indicator showing which criterion being scored
- Navigation: Previous/Next buttons
- Highlight Criterion 9 (Innovation) as critical

---

### Add per-criterion comments
**Goal:** Enable feedback and moderation.

**WIX Implementation:**
- **Text Area** or **Rich Text Editor** for each criterion
- Two comment fields per criterion:
  - Justification/Comments (required)
  - Evidence Notes (optional)
- Store in Assessments Collection: comment1 through comment9, evidenceNotes1 through evidenceNotes9
- Character limits (optional, WIX Velo validation)
- Save comments as draft before final submission

---

### Submit assessment
**Goal:** Complete Stage 1 evaluation input.

**WIX Implementation:**
- "Review & Submit" page showing all scores and comments summary
- Final validation: all 9 criteria scored, all comments provided
- Calculate total weighted score (WIX Velo)
- Display total score preview
- "Submit Assessment" button
- Update Assessments Collection: status = "Submitted", submittedDate
- Update Assignments Collection: status = "Completed"
- Lock assessment from further editing
- Trigger notification to Nominee Coach (WIX Velo + Email)

---

### Participate in moderation (if requested)
**Goal:** Improve consistency and fairness.

**WIX Implementation:**
- Moderation request notification (email + in-app)
- Moderation interface showing:
  - Own scores and comments
  - Other assessors' scores (anonymized or named, per policy)
  - Discrepancy highlights (WIX Velo calculation)
- Discussion forum or comments section (WIX Comments app or custom)
- Option to adjust scores with justification
- Store moderation discussion and adjustments in Moderation Collection (optional)
- Final moderated scores recorded by Nominee Coach

---

## Assessor Portal Structure

**Recommended Pages:**
1. **Dashboard** - Assigned nominations overview, deadlines, quick stats
2. **My Assignments** - List of all assigned nominations with status
3. **Assessment Form** - Multi-step form for COI, verification, scoring
4. **Nomination Review** - View nomination packet (read-only)
5. **Completed Assessments** - View submitted assessments
6. **Moderation** - Participate in moderation discussions (if needed)

**WIX Components:**
- Member Areas (authentication, role-based access)
- Collections (Assignments, Assessments, Nominations - read access)
- Forms (COI declaration, scoring form)
- Dynamic Pages (nomination packet view)
- Repeaters (assignment lists)
- Velo (calculations, validation, workflow enforcement, notifications)
- Email Marketing (assignment notifications, moderation requests)
- File Manager (evidence artifact storage)
