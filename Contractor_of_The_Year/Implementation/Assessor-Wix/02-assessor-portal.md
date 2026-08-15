# Phase 2 — Assessor portal (kill coach)

**Gate:** One member portal; coach UI and APIs gone; homepage Assessor button.  
**Back:** [Guide](../Assessor-EOI-Wix-Plan.md) · **After:** [phase 1](01-eoi-landing.md) is live

DR-002: no Nominee Coach. Admin owns assign / COI / reminders.

Do **not** copy code onto the empty Assessor Dashboard (`Assessor Dashboard.d94bg.js` has no UI). The working portal is **Coach Dashboard** (`Coach Dashboard.b7c5p.js`).

## Local Editor

- Rename page → **Assessor Dashboard**. Do not rename the file in git; Sync after the editor rename.
- Hide/delete: `#boxCoachView`, `#coachTable`, `#searchCoach`, Coach Diary tab, `#coachDiaryRichText`, `#saveDiaryBtn`, `#cbCOI`, `#dropdownCategory`.
- Keep: `#assessorTable`, `#searchAssessor`, nomination tabs (packet + customers + assessment), `#boxAssessmentContent`, scoring sliders.
- Unpublish the empty Assessor Dashboard page so there is one portal URL.
- Relabel homepage `#btnCoach` to Assessor; show only for Assessor role.

## Code (git, `ittdspace/src`)

| File | Change |
| --- | --- |
| `pages/Coach Dashboard.b7c5p.js` | Assessor-only: drop coach table, diary, `currentRoleView === 'COACH'` |
| `backend/coach.web.js` | Keep `getAssessorNominations` + customer fetch. Delete diary / coach COI / rollup gated on coach. Rename later to `assessor.web.js` and fix imports |
| `public/coachDiaryPanel.js`, `public/diaryTemplate.js` | Delete |
| `public/assignmentsAdmin.js` + `backend/assignments.web.js` | Drop `#coachDropdown` / writes to `coachAssignedId` |
| `public/roleAdmin.js` + `backend/admin.web.js` | Drop Coaches table / add / delete / cascade |
| `backend/multiRole.web.js` | Drop `Coaches` query and `"Nominee Coach"` |
| `public/cycleConfig.js` | Remove `'Nominee Coach'` from `STAFF_ROLES` |
| `pages/Contractor Of The Year Award.z9t1g.js` | `#btnCoach` only for Assessor |
| `pages/Nominee Dashboard.myj3i.js` + `backend/nomination.web.js` | Hide/remove `#coachText` / `coachNameDisplay` |
| `backend/dashboard.web.js` + assignment custom element | Drop coach workload / `needsCoachAssigned` |

Leave CMS field `coachAssignedId` in place (do not delete columns mid-cycle). Stop writing it.

## What the portal is after the strip

1. List of assigned nominations (`getAssessorNominations` via `Nominations.assessors[]`)
2. Read-only packet + customer cards (already there)
3. Assessment panel (already there: 9 scores, justifications, COI checkbox, draft/submit)

Do not rebuild the form in this phase.

**Before Stage 1 (can slip into this phase or sit with [phase 3](03-calibration.md)):** COI must block scoring (`COILightBox.g3elh.js` exists); conflict → stop + contact organisers; lock on submit. Eligibility/completeness is Admin, not an assessor step.

After member invite, set `Assessors.userId` and `pipelineStatus = Active`. Assignment still uses `Nominations.assessors[]` → `userId`. Do not assign until [phase 3](03-calibration.md) roster gate exists — until then, only test members.

## Test

- [ ] Homepage shows Assessor button, not Coach
- [ ] Assigned noms list; packet read-only; draft + submit
- [ ] Coach table/diary gone
- [ ] Nominee dashboard has no “your coach”
- [ ] Admin: assign assessors only; no Add Coach / coach dropdown

## Done when

Published. Empty assessor page unpublished. Coach role not shown to members.
