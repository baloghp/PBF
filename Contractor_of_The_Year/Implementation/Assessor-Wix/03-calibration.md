# Phase 3 — Calibration (theory then exam)

**Gate:** Online path = Program complete + exam passed before any Stage 1 assignment. Live session still offered.  
**Back:** [Guide](../Assessor-EOI-Wix-Plan.md) · **Needs:** [phase 2](02-assessor-portal.md) portal  
**When:** late Oct, before Stage 1 (Nov–Dec). Not 15 Aug.

Live late-Oct session stays. Online is two stages.

## Stage A — Theory (Wix Online Programs)

Free, members-only, no payment. Steps: why the award / 9 criteria / 0–5 scale / COI / platform walkthrough. Optional short quiz on the scale (passing grade so they cannot “complete” without it).

Automation **Participant completes program** → patch `Assessors.theoryStatus = Complete`. Emails B2/B3 point here ([04](04-emails.md)). Do **not** use the Program certificate as O1.

There is [no Velo API](https://support.wix.com/en/article/wix-online-programs-request-integrating-velo-api) to read progress in page code — the CMS flag from that automation is the gate.

Last Program step: link to the Calibration exam page.

## Stage B — Exam (duplicate of the live assessment form)

Programs cannot host the 9-criteria packet. **Duplicate the real assessment UI** (same sliders, justifications, COI) onto a member-only **Calibration exam** page. Reuse `public/assessmentPanel.js` `createAssessmentPanel` with a **calibration** backend — do not write into live `Assessments` or assigned `Nominations`.

| Piece | How |
| --- | --- |
| Packet | One canned nomination (fictional / UAT sample), read-only, same layout as live |
| Form | Local Editor duplicate of live assessment elements |
| Storage | `CalibrationAttempts` (preferred) keyed by `userId` — or `Assessments` with `kind = calibration` |
| Key | CMS **CalibrationKey** — the 9 reference scores Angel/Peter set |
| Pass | Every criterion within **±1** of the key; then show theirs vs key |
| Fail | Retry (keep last attempt) |

Exam page: if `theoryStatus ≠ Complete`, send them back to the Program.

Live session attendance can mark `calibrationStatus = Passed` without the exam (and `theoryStatus = Complete`).

## CMS fields to add on `Assessors`

| Key | Type | Purpose |
| --- | --- | --- |
| theoryStatus | text | Not started / Complete |
| calibrationStatus | text | Not started / In progress / Passed / Failed |
| calibrationMode | text | Live / Online |
| calibrationAt | date | |
| calibrationScores | text (JSON) | Their 9 vs reference |

## Roster gate

Admin must not assign Stage 1 nominations until:

`theoryStatus = Complete` **and** `calibrationStatus = Passed` **and** `userId` set.

Lock live scoring UI until then.

## Build order

1. Add CMS fields + CalibrationKey + CalibrationAttempts.
2. Duplicate assessment UI onto Calibration exam page; wire panel to calibration save/compare.
3. Create the Program; last step → exam URL.
4. Automation: program complete → `theoryStatus`.
5. Admin: cannot assign unless gate passes; live-attendance override.

## Test

- [ ] Program complete → `theoryStatus = Complete`
- [ ] Exam page refuses if theory not complete
- [ ] Exam writes `CalibrationAttempts`, not live `Assessments`
- [ ] ±1 vs key → Passed; retry on fail
- [ ] Live attendance → Passed
- [ ] Cannot assign until theory + exam Passed (or live)

## Done when

A test member can finish Program + exam and appear assignable. A member who only finished the Program cannot be assigned.
