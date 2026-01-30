# System (Automation) — Use Cases & WIX Implementation

**Actor:** System (Automation)  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for automated system use cases

---

## Use Cases & Implementation

### User registration workflow
**Goal:** Secure onboarding and correct access control.

**WIX Implementation:**
- **WIX Member Areas** self-registration form (nominees only)
- Email verification via WIX built-in system
- Auto-assign "Nominee" member type
- Store in Members Collection
- Welcome email template (WIX Email Marketing)
- Note: Assessors and Nominee Coaches created by Admin, not self-registered

---

### Authentication & authorization
**Goal:** Prevent unauthorized access.

**WIX Implementation:**
- **WIX Member Areas** authentication system (built-in)
- Role-based page permissions:
  - Nominee pages: Nominee member type only
  - Assessor pages: Assessor member type only
  - Nominee Coach pages: Nominee Coach member type only
  - Admin pages: Admin member type only
- **WIX Velo** functions to check member type before data access
- Session management handled by WIX
- Secure API endpoints (WIX Velo) for data operations

---

### Submission validation
**Goal:** Reduce incomplete submissions.

**WIX Implementation:**
- **WIX Velo** validation functions on form submit
- Check: required fields, file uploads present, word count limits, file types/sizes
- Real-time validation feedback in form
- Prevent submission if validation fails
- Show specific error messages for missing/invalid items
- Store validation results in Nominations Collection

---

### Status lifecycle updates
**Goal:** Consistent stage tracking.

**WIX Implementation:**
- **WIX Velo** functions to manage status transitions
- Status field in Nominations Collection
- Valid transitions enforced (e.g., Draft → Submitted → Under Review → Shortlisted)
- Status change triggers:
  - On submission: Draft → Submitted
  - On assignment: Submitted → Under Review
  - On shortlisting: Under Review → Shortlisted/Not Shortlisted
- Status history log (optional, separate Collection or field)
- Timestamp each status change

---

### Assignment notifications
**Goal:** Timely assessment completion.

**WIX Implementation:**
- **WIX Velo** function triggered on assignment creation
- **WIX Email Marketing** template for assignment notification
- Email includes: nomination details, deadline, link to assessor portal
- Scheduled reminder emails (WIX Velo scheduled functions):
  - 3 days before deadline
  - 1 day before deadline
  - Overdue notification
- In-app notification badges (optional, WIX Velo)

---

### COI enforcement
**Goal:** Prevent biased viewing/scoring.

**WIX Implementation:**
- **WIX Velo** function checks COI status before allowing access
- If COI declared: block access to nomination packet
- Hide nomination from assessor's assignment list
- Update assignment status to "Recused"
- Notify Nominee Coach automatically
- Audit log entry for COI declaration

---

### Score aggregation
**Goal:** Enable ranking and reporting.

**WIX Implementation:**
- **WIX Velo** function to calculate weighted average
- Formula: (score1×weight1 + score2×weight2 + ... + score9×weight9) / total weight
- Weights: Criterion 1 (15%), Criterion 9 (15%), others (10% each)
- Store totalScore in Assessments Collection
- Calculate average across multiple assessors (WIX Velo aggregation)
- Store moderated average in Nominations Collection
- Real-time calculation on assessment submission

---

### Discrepancy detection
**Goal:** Trigger moderation when needed.

**WIX Implementation:**
- **WIX Velo** function runs after all assessments submitted for a nomination
- Calculate median score per criterion across assessors
- Flag discrepancies: variance >2 points from median
- Store discrepancy flags in Moderation Collection or Nominations Collection
- Notify Nominee Coach when discrepancies detected
- Display discrepancy indicators on coach dashboard
- Highlight criteria needing moderation

---

### Shortlist calculation support
**Goal:** Assist coach/admin shortlisting.

**WIX Implementation:**
- **WIX Velo** function to generate ranked lists
- Sort nominations by:
  1. Criterion 9 score (prioritize 4-5 scores)
  2. Total moderated score
- Group by category
- Display ranked list on shortlisting dashboard
- Calculate top N per category automatically
- Pre-select top candidates (coach can adjust)
- Store rank in Shortlist Collection or Nominations Collection

---

### Outcome notifications
**Goal:** Consistent communications.

**WIX Implementation:**
- **WIX Email Marketing** templates:
  - Shortlisted notification
  - Not shortlisted notification (with feedback)
- **WIX Velo** function triggered by Nominee Coach action
- Batch send notifications (WIX Velo loop)
- Personalize with nominee name, category, scores
- Include feedback summary (aggregated from assessor comments)
- Track notification status (sent/failed)
- Store notification timestamp in Nominations Collection

---

### Audit logging
**Goal:** Traceability and compliance.

**WIX Implementation:**
- **AuditLog Collection** (WIX Collections)
- **WIX Velo** functions to log critical actions:
  - Assignment creation/changes
  - COI declarations
  - Assessment submissions
  - Moderation decisions
  - Shortlisting decisions
  - Status changes
- Log fields: action, actor, timestamp, details, nominationId
- Read-only log (no manual edits)
- Export audit log for reporting (WIX Velo)

---

### Data export
**Goal:** Reporting and backup.

**WIX Implementation:**
- **WIX Velo** functions to generate exports
- Export formats: CSV, Excel (via WIX Velo or external library)
- Export data from Collections:
  - Nominations
  - Assessments
  - Assignments
  - Audit logs
- Filter by date range, category, status
- Download file or email export
- Scheduled exports (WIX Velo scheduled functions, optional)
- Secure export (admin/coach only)

---

## System Components

**WIX Features Used:**
- **WIX Velo** - Custom code for all automation logic
- **Collections** - Data storage (Nominations, Assessments, Assignments, AuditLog, etc.)
- **Email Marketing** - Automated notifications
- **Member Areas** - Authentication and authorization
- **Scheduled Functions** - Reminders, exports, batch operations
- **API** - Secure data access endpoints

**Key Velo Functions:**
- Validation functions
- Calculation functions (scores, averages, rankings)
- Workflow functions (status transitions, assignments)
- Notification functions (email triggers)
- Export functions (CSV/Excel generation)
- Audit logging functions
