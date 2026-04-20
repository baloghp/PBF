# Dashboard Metrics (WIX) — Stage 1 (Actionable KPIs)

This is a curated set of **high-impact, actionable KPIs** that map directly to the current data tables:
`Nominations`, `Assessments`, `Customer_Feedback`, `Coaches`, `Assessors`.

Each major section below can be implemented as **one Custom Element dashboard** (Chart.js) inside its own tab.

---

## 1) Overview (Admin)

### KPI tiles
- **Submitted nominations**: count `Nominations.status="SUBMITTED"`
- **Needs coach assigned**: `SUBMITTED` AND `coachAssignedId` empty
- **Needs assessors assigned**: `SUBMITTED` AND `assessors` empty
- **Assessments submitted**: count `Assessments.status="SUBMITTED"`
- **Customer feedback submitted**: count `Customer_Feedback.evaluationStatus="SUBMITTED"`
- **Score rollup pending**: `Nominations.overallScore` is null (optionally filter to `SUBMITTED`)
- **Missing category**: `SUBMITTED` AND `category` empty (coach must set)

### Action table
- **Work queue**: nominations needing coach/assessors, and nominations needing score rollup

---

## 2) Assignments & workload (Admin)

### KPI tiles
- **Unassigned coach count**: `SUBMITTED` and `coachAssignedId` empty
- **Unassigned assessors count**: `SUBMITTED` and `assessors` empty
- **Under-assigned nominations** (if you require min 2 assessors): `assessors.length < 2`

### Charts / tables
- **Coach workload**: count nominations per `coachAssignedId`
- **Assessor workload**: count nominations per assessor ID in `assessors[]`

---

## 3) Assessment progress (Admin)

### KPI tiles
- **Assessments submitted**: `Assessments.status="SUBMITTED"`
- **Assessments draft**: `Assessments.status="DRAFT"`

### Action table
- **Assigned but missing assessment record**:
  - for each nomination + each assessor in `Nominations.assessors[]`, ensure an `Assessments` row exists

---

## 4) Customer feedback progress (Admin)

### KPI tiles
- **Customer feedback submitted**: `Customer_Feedback.evaluationStatus="SUBMITTED"`
- **Customer feedback draft**: `Customer_Feedback.evaluationStatus="DRAFT"`

### Action table
- **Stale drafts**: `evaluationStatus="DRAFT"` older than X days (use Created Date)

---

## 5) Scores & scoreboards (Admin + Coach)

These rollups are persisted on `Nominations`:
- `assessmentsScore` (Number | null)
- `customersScore` (Number | null)
- `overallScore` (Number | null) = \(0.75 × assessmentsScore\) + \(0.25 × customersScore\)

### KPI tiles
- **Scored nominations**: `overallScore` not null
- **Unscored nominations**: `overallScore` null

### Scoreboards (ranked tables)

**Recommended columns**: `title`, `company`, `category`, `status`, `assessmentsScore`, `customersScore`, `overallScore`

- **Overall (all categories)**
  - Top N by `overallScore`
  - Top N by `assessmentsScore`
  - Top N by `customersScore`

- **Per category** (repeat each leaderboard with `category=<value>`)
  - Top N by `overallScore`
  - Top N by `assessmentsScore`
  - Top N by `customersScore`

### Coach action
- **Calculate Score button** computes and saves `assessmentsScore`, `customersScore`, `overallScore` onto `Nominations`


