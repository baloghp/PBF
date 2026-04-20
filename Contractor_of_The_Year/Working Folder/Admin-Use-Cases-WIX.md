# Admin — Use Cases & WIX Implementation

**Actor:** Admin  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for admin use cases

---

## Use Cases & Implementation

### [x] Register admin account
**Goal:** Enable privileged access to administration features.

**WIX Implementation:**
- Initial admin account created manually in WIX dashboard (site owner)
- Additional admin accounts: **WIX Members** → Create Member → Assign "Admin" member type
- Admin member type with highest permissions
- Access to all pages and data
- Cannot be self-registered (security)

---

### [x] Create/manage assessor accounts
**Goal:** Maintain reviewer roster and access control.

**WIX Implementation:**
- **Admin Dashboard** page with "Manage Assessors" section
- **WIX Members** interface or custom admin page
- Create assessor: Add member → Assign "Assessor" member type
- Invite via email (WIX built-in invitation system)
- Manage: Enable/disable accounts, update roles, view activity
- List all assessors with: name, email, status, assignments count
- Filter/search assessors
- Bulk operations (optional, WIX Velo)

---

### [x] Create/manage nominee coach accounts
**Goal:** Maintain coach roster and access control.

**WIX Implementation:**
- **Admin Dashboard** page with "Manage Nominee Coaches" section
- **WIX Members** interface or custom admin page
- Create coach: Add member → Assign "Nominee Coach" member type
- Invite via email (WIX built-in invitation system)
- Manage: Enable/disable accounts, update roles, view activity
- List all coaches with: name, email, status, assigned nominations count
- Filter/search coaches
- Assign coaches to specific categories (optional, custom field)

---

### Configure Stage 1 settings
**Goal:** Align the platform to the process.

**WIX Implementation:**
- **Settings Collection** (WIX Collections) or **WIX Velo** environment variables
- Admin settings page with configuration forms
- Settings include:
  - Scoring weights (per criterion)
  - Discrepancy thresholds (e.g., >2 points)
  - Shortlist counts per category (top N)
  - Deadline defaults (assessment completion days)
  - Word count limits
  - File size limits
  - Category definitions
- Store in Settings Collection or Velo environment
- Apply settings across platform (WIX Velo reads settings)
- Version history (optional, track changes)

---

### Manage intake exceptions
**Goal:** Keep workflow unblocked.

**WIX Implementation:**
- **Admin Dashboard** with "Exceptions" section
- View nominations with exceptions: duplicates, technical issues, stuck status
- Actions:
  - Reset nomination status
  - Merge duplicate nominations
  - Manually fix data issues
  - Unlock stuck nominations
  - Force status transitions
- Direct database access via WIX Collections (admin only)
- **WIX Velo** functions for exception handling
- Audit log all exception actions

---

### [x] Override assignments (if needed)
**Goal:** Operational continuity.

**WIX Implementation:**
- **Admin Dashboard** → "Manage Assignments"
- View all assignments across all nominations
- Actions:
  - Reassign assessor (replace)
  - Add additional assessor
  - Remove assessor
  - Extend deadlines
  - Cancel assignments
- Update Assignments Collection directly
- Notify affected assessors (WIX Velo + Email)
- Audit log all override actions

---

### Manage templates & automated messages
**Goal:** Consistent communications.

**WIX Implementation:**
- **WIX Email Marketing** template management
- Admin page to edit email templates:
  - Assignment notification
  - Reminder emails
  - Shortlisted notification
  - Not shortlisted notification
  - Moderation request
- Template variables: {nomineeName}, {category}, {deadline}, etc.
- Preview templates before saving
- Version control (optional, track template changes)
- Test send functionality

---

### Handle data retention/admin requests
**Goal:** Compliance and governance.

**WIX Implementation:**
- **Admin Dashboard** → "Data Management"
- Actions:
  - Export all data (full backup)
  - Delete nominations (with confirmation)
  - Anonymize data (GDPR compliance)
  - Archive old nominations
- **WIX Velo** functions for:
  - Bulk export
  - Bulk delete (with audit log)
  - Data anonymization
- Retention policy settings (optional, automated cleanup)
- Secure deletion confirmation (admin password required)

---

## Admin Portal Structure

**Recommended Pages:**
1. **Dashboard** - Overview, system stats, recent activity
2. **User Management** - Create/manage assessors and coaches
3. **Settings** - Configure Stage 1 parameters
4. **Exceptions** - Handle workflow issues
5. **Assignments** - Override and manage assignments
6. **Templates** - Manage email templates
7. **Data Management** - Exports, deletions, retention
8. **Audit Log** - View system audit trail
9. **Reporting** - System-wide reports and analytics

**WIX Components:**
- Member Areas (admin authentication, highest permissions)
- Collections (Settings, AuditLog, all data collections)
- Forms (settings configuration, user creation)
- Repeaters/Data Tables (user lists, exception lists)
- Velo (all admin functions, overrides, exports, data management)
- Email Marketing (template management)
- WIX Dashboard (direct member management, if preferred)

---

## Security Considerations

**Admin Access:**
- Highest permission level
- Access to all data and functions
- Cannot be self-registered
- All admin actions logged in audit trail
- Sensitive operations require confirmation (delete, override)
- Secure admin pages (WIX Member Areas with Admin-only permissions)

---

## Revised scope note (2026-04)

The following are **handled directly via WIX built-ins** and are **not implemented as custom Velo features**:
- Settings management (weights, thresholds, deadlines, limits, categories)
- Intake exception handling tooling
- Template management / email marketing administration
- Data retention / deletion tooling
- Audit log UI

The only custom admin capability still required beyond user/assignment management is **reporting/export**.

---

### Export reporting (required)
**Goal:** Provide operational visibility (Stage 1 status + assignments + customer evaluations).

**WIX Implementation (planned):**
- Admin dashboard button(s) to export CSV (or view tables) for:
  - Nominations (status, dates, nominee, project, category)
  - Assignments (coachAssignedId, assessors, COI flags if used)
  - Customer evaluations (draft/submitted, scores/fields as needed)
- Export can be either:
  - Client-side CSV generation from queried collections (admin-only UI), or
  - Backend Velo method that returns an export payload for download.
