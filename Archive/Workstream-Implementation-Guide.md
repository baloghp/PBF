# Workstream Restructuring - Implementation Guide

**Date:** 2025-12-04  
**Status:** Ready for Implementation

---

## Summary

Restructuring from 9 workstreams to 7 simplified workstreams by merging related epics and updating scope to align with new milestones and concepts.

---

## Step-by-Step Implementation

### Step 1: Update Existing Workstream Epics

#### PBF-1: Foundation & Integration
**Current:** "Project Integration"  
**New Summary:** "Foundation & Integration"  
**New Description:**
```
**Merged from:** PBF-1 (Project Integration) + PBF-4 (Governance and Policies)

**Scope:**
- Concept finalization (Award Credo, Research Findings)
- Team building and role assignment
- Documentation (Process Maps, RACI, Role Guides)
- Policies (COI, GDPR, Appeals, Data Retention)
- Project management and integration
- Source document management

**Key Milestones:**
- M1: Concept & Foundation Complete (2025-12-15)
- M2: Team & Roles Ready (2025-12-20)
- M4: Documentation Complete (2025-12-20)
- M16: Winners Selected (2026-04-25)
- M18: Publication Complete (2026-05-15)
```

#### PBF-2: Communications
**Current:** "Communications"  
**No changes needed** - Keep as is

#### PBF-3: Evaluation Framework
**Current:** "Evaluation Framework"  
**No changes needed** - Keep as is

#### PBF-5: Jury Management
**Current:** "Jury Management"  
**No changes needed** - Keep as is

#### PBF-7: Nominee Support
**Current:** "Nominee Guide"  
**New Summary:** "Nominee Support"  
**New Description:**
```
**Merged from:** PBF-6 (Nomination Guidelines) + PBF-7 (Nominee Guide)

**Scope:**
- Nominee Coach Model implementation
- Nomination guidelines and submission package
- Nominee support materials
- Coach training
- Expression of Interest process
- Full nomination process

**Key Milestones:**
- M7: Nominee Coaches Trained (2025-12-30)
- M8: Nominations Open (2026-01-15)
- M9: Expression of Interest Complete (2026-01-29)
- M10: Full Nominations Accepted (2026-03-02)
- M11: Nominations Closed (2026-03-02)
```

#### PBF-8: Platform & Technology
**Current:** "Platform"  
**New Summary:** "Platform & Technology"  
**New Description:**
```
**Scope:**
- SurveyMonkey account setup
- Three-survey structure (Nomination, Expression of Interest, Client Assessment)
- Excel template for Client Assessment Form
- Platform integration with ITTD/PBF websites
- Technical support

**Key Milestones:**
- M3: Platform & Tools Ready (2025-12-20)
- M8: Nominations Open (2026-01-15) - supports this
```

#### PBF-9: Risks
**Current:** "Risks"  
**No changes needed** - Keep as is

---

### Step 2: Close Merged Workstreams

#### PBF-4: Governance and Policies
**Action:** Close/Archive  
**Reason:** Content merged into PBF-1 (Foundation & Integration)  
**Note to add:** "This workstream has been merged into PBF-1: Foundation & Integration. All tasks have been moved to PBF-1."

#### PBF-6: Nomination Guidelines
**Action:** Close/Archive  
**Reason:** Content merged into PBF-7 (Nominee Support)  
**Note to add:** "This workstream has been merged into PBF-7: Nominee Support. All tasks have been moved to PBF-7."

---

### Step 3: Task Migration

#### Tasks to Move from PBF-4 → PBF-1
(Need to identify all PBF-4 child tasks first, then move them)

#### Tasks to Move from PBF-6 → PBF-7
(Need to identify all PBF-6 child tasks first, then move them)

---

### Step 4: Link Tasks to Milestones

Use the "Epic Link" or "Parent" field to link tasks to milestones (PBF-79 through PBF-96).

**Example:**
- Task PBF-76 should link to milestone PBF-79 (M1)
- Task PBF-72 should link to milestone PBF-80 (M2)
- etc.

---

### Step 5: Create New Tasks

#### For M1: Concept & Foundation Complete (PBF-79)
**Workstream: PBF-1**

1. **Finalize Award Credo and integrate into main page**
   - Description: Ensure Award Credo is finalized and integrated into the main Project Contractor Of The Year Award Confluence page
   - Link to: PBF-79

2. **Integrate Research Findings section into main page**
   - Description: Add "Research Findings: What Makes Award Winners Stand Out" section to main page after Award Credo
   - Link to: PBF-79

3. **Update Evaluation Framework with "Innovation & Industry Advancement" criterion**
   - Description: Add new evaluation criterion for Innovation & Industry Advancement to Evaluation Framework page
   - Link to: PBF-79

4. **Update Submission Package with three new required sections**
   - Description: Add "What Makes This Exemplary?", "Impact Measurement & Transformation", and "Lessons Learned & Industry Contribution" sections to Submission Package
   - Link to: PBF-79

5. **Finalize GDPR policy (1 year retention) and add to all relevant pages**
   - Description: Finalize GDPR policy with 1-year retention period and add guidance to Submission Package, 1.0 Submission and Intake, and 3.0 Decision/Award pages
   - Link to: PBF-79

#### For M2: Team & Roles Ready (PBF-80)
**Workstream: PBF-1**

1. **Identify Nominee Coaches and assign to categories**
   - Description: Identify team members to serve as Nominee Coaches and assign them to ensure equal distribution across categories (Small: 1-10, Medium: 11-100, Large: 101+)
   - Link to: PBF-80

2. **Create detailed content for role guide pages**
   - Description: Create detailed content for each role guide page (Project Manager, Nominee Coach, Assessor, Judging Panel, Communications Coordinator). High-level pages exist, need detailed operational content.
   - Link to: PBF-80

#### For M3: Platform & Tools Ready (PBF-81)
**Workstream: PBF-8**

1. **Configure SurveyMonkey account and set up three-survey structure**
   - Description: Set up SurveyMonkey account and configure three surveys: Nomination, Expression of Interest, and Client Assessment
   - Link to: PBF-81

2. **Create Expression of Interest survey**
   - Description: Create lightweight survey (1-2 minutes) for companies to express interest and provide basic information (company size, headcount for categorization)
   - Link to: PBF-81

3. **Create Nomination survey with new sections**
   - Description: Create full nomination survey including new sections: "What Makes This Exemplary?", "Impact Measurement & Transformation", and "Lessons Learned & Industry Contribution"
   - Link to: PBF-81

4. **Create Client Assessment survey**
   - Description: Create survey for client representatives to complete Client Assessment Form
   - Link to: PBF-81

5. **Create Excel template for Client Assessment Form**
   - Description: Create Excel version of Client Assessment Form template (delegated to team)
   - Link to: PBF-81

6. **Integrate surveys with ITTD WIX website and PBF website**
   - Description: Embed SurveyMonkey forms into ITTD WIX website and PBF website
   - Link to: PBF-81

#### For M4: Documentation Complete (PBF-82)
**Workstream: PBF-1**

1. **Add GDPR guidance to Submission Package page**
   - Description: Add comprehensive GDPR section with data retention policy and guidance to minimize personal data
   - Link to: PBF-82

2. **Add GDPR guidance to 1.0 Submission and Intake page**
   - Description: Add GDPR reminders and data protection section to process documentation
   - Link to: PBF-82

3. **Add GDPR guidance to 3.0 Decision/Award page**
   - Description: Add GDPR compliance details to archive/retention section
   - Link to: PBF-82

#### For M5: Award Announced (PBF-83)
**Workstream: PBF-2**

1. **Create announcement materials incorporating Award Credo**
   - Description: Create announcement materials that highlight the Award Credo and what makes winners exemplary
   - Link to: PBF-83

2. **Prepare communication templates with new award positioning**
   - Description: Update communication templates to reflect new award positioning based on Award Credo and Research Findings
   - Link to: PBF-83

#### For M6: Jury Selected (PBF-84)
**Workstream: PBF-5**

1. **Select Judging Panel members**
   - Description: Identify and select members for the Judging Panel
   - Link to: PBF-84

2. **Conduct conflict of interest checks**
   - Description: Check all Judging Panel members for conflicts of interest with nominees
   - Link to: PBF-84

3. **Brief jury on evaluation framework**
   - Description: Brief Judging Panel on evaluation framework, including new "Innovation & Industry Advancement" criterion
   - Link to: PBF-84

#### For M7: Nominee Coaches Trained (PBF-85)
**Workstream: PBF-7**

1. **Brief coaches on process**
   - Description: Brief Nominee Coaches on the complete process from submission to award
   - Link to: PBF-85

2. **Train coaches on submission package requirements**
   - Description: Train coaches on all submission package requirements, including new sections
   - Link to: PBF-85

3. **Train coaches on GDPR guidance**
   - Description: Train coaches on GDPR requirements and how to guide nominees to minimize personal data
   - Link to: PBF-85

4. **Prepare coach assignment process**
   - Description: Finalize process for assigning Nominee Coaches to nominees
   - Link to: PBF-85

#### For M8-M11: Nomination Period (PBF-86 through PBF-89)
**Workstream: PBF-7 + PBF-8**

Create tasks for:
- Launching surveys
- Processing Expression of Interest
- Processing full nominations
- Completeness checks
- Eligibility validation
- Coach assignment
- Closing nominations

#### For M12-M15: Assessment Period (PBF-90 through PBF-93)
**Workstream: PBF-3 + PBF-5**

Create tasks for:
- Stage 1 assessment
- Shortlisting
- Stage 2 assessment
- Finalist selection

#### For M16-M18: Decision & Award (PBF-94 through PBF-96)
**Workstream: PBF-1 + PBF-2**

Create tasks for:
- Winner selection and approval
- Results announcement
- Publication
- Data archiving

---

## Implementation Checklist

- [ ] Update PBF-1 summary and description
- [ ] Update PBF-7 summary and description
- [ ] Update PBF-8 summary and description
- [ ] Close PBF-4 with merge note
- [ ] Close PBF-6 with merge note
- [ ] Move all PBF-4 tasks to PBF-1
- [ ] Move all PBF-6 tasks to PBF-7
- [ ] Link all existing tasks to appropriate milestones
- [ ] Create all new tasks identified above
- [ ] Link new tasks to milestones
- [ ] Update task descriptions to reflect new concepts
- [ ] Verify all tasks are in correct workstreams

---

## Notes

- Authentication may need to be refreshed to access Jira
- Some tasks may need to be created incrementally
- Task linking to milestones uses the "Parent" field (milestones are parents)
- All new concepts (Award Credo, Nominee Coach Model, GDPR, three-survey structure) should be reflected in tasks


