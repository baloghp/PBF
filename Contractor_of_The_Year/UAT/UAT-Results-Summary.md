# UAT Results Summary — Contractor of the Year 2027

- Page ID: `241434625`
- URL: `https://ittd.atlassian.net/wiki/spaces/PBF/pages/241434625/UAT+Results+Summary+Contractor+of+the+Year+2027`

**Status:** Draft — work in progress (Peter)
**Owner:** Peter Balogh
**Last updated:** 2026-06-22
**Purpose:** Internal record of UAT outcomes. Volunteer-facing comms live in **[Volunteer Thank-You & UAT Results](https://ittd.atlassian.net/wiki/spaces/PBF/pages/241467393)** (Chris sends after review).

**Related:** [Volunteer thank-you (draft)](Volunteer-Thank-You-and-UAT-Results.md) · [Roster](Roster.md) · [Comms handover (Dr Kris)](Comms-Handover-Dr-Kris.md) · [UAT Roadmap](../Working%20Folder/UAT-Roadmap.md) · Confluence [UAT Volunteer List](https://ittd.atlassian.net/wiki/spaces/PBF/pages/214302721/UAT+Volunteer+List)

---

## Executive summary

> _To be written — one paragraph for volunteers and one for the core team._

The platform at `ittd.space/pbf-pcoty` was exercised end-to-end by **16 volunteers** in **3 groups** (May–Jun 2026). Core team assessment (16 Jun meeting): **UAT is substantially complete** — nomination, assessor, admin, and client-evaluation flows were exercised with **no remaining blockers** for the live cycle. The **coach module was not adopted by volunteers** and remains **untested in practice**; the team agreed to **drop the coach volunteer role** and replace completeness checking with an **n8n AI agent** (eligibility/completeness only — human assessors unchanged).

---

## Scope & setup

| Item | Detail |
| --- | --- |
| Environment | `https://www.ittd.space/pbf-pcoty` |
| Walkthroughs | `https://www.ittd.space/uat-nda` |
| Volunteers | 16 (see [Roster](Roster.md)) |
| Groups | 3 synthetic nominations (6 + 5 + 5) |
| Roles tested | Nominee/Client, Coach (assigned but largely unused), Assessor |
| Orientation | Two sessions (24 & 28 Apr 2026); NDA via WIX forms |
| Feedback channel | Separate Discord server for UAT (+ shared bug-report channel) |
| Core team leads | Peter, Chris, Leila, Kris, Oliver (+ Soban Ahmed joined core team from UAT pool) |

---

## Participation snapshot

### Mid-UAT progress report (last written status — pre-close)

Source: [Volunteer-Role-Assignment-Communication.md](Volunteer-Role-Assignment-Communication.md) / [Comms-Handover-Dr-Kris.md](Comms-Handover-Dr-Kris.md) — sent to volunteers via Dr Kris.

| Group | Nomination submitted | Coaching | Assessments | Client testimony |
| --- | --- | --- | --- | --- |
| Group 1 | ✅ Submitted | ⏳ Not started | ⏳ Not started | ⏳ Not submitted |
| Group 2 | ✅ Submitted | ⏳ Not started | ⏳ Not started | ⏳ Not submitted |
| Group 3 | ❌ Not yet submitted | — | — | ⏳ Not submitted |

**Critical-path blocker at that point:** Group 3 (Bob Grove / Abhishek Tyagi) had not submitted — gating Group 3 coaching and several cross-group assessments.

### Final status (core team assessment — 12 & 16 Jun meetings)

| Area | Outcome |
| --- | --- |
| Overall UAT | **Nearly / substantially complete** ([12.06 meeting](../../Confluence/Meetings/233472001%20-%20Team%20Meeting%20-%2012.06.2026.md)) |
| Coaching module | **Not tested in practice** — no volunteer adoption ([12.06](../../Confluence/Meetings/233472001%20-%20Team%20Meeting%20-%2012.06.2026.md), [16.06](../../Confluence/Meetings/238288897%20-%20Team%20Meeting%20-%2016.06.2026.md)) |
| Nomination flow | Exercised (Groups 1 & 2 confirmed submitted; Group 3 status at close — _TBD_) |
| Assessor flow | Exercised; no blockers reported for live cycle |
| Admin / role assignment | Verified internally (Leila, Apr); role assignment via Admin Dashboard works |
| Client testimony / evaluation | _TBD — confirm final completion per group_ |
| Blockers for live cycle | **None identified** for non-coach flows ([12.06](../../Confluence/Meetings/233472001%20-%20Team%20Meeting%20-%2012.06.2026.md)) |

> **Gap:** No final per-group completion matrix was recorded after the mid-UAT snapshot. Peter to confirm Group 3 submission and which roles actually completed their walkthroughs before closing.

---

## What worked

_Consolidated from meeting notes and comms — not yet validated against Discord/Jira logs._

- **Volunteer recruitment:** 16 participants signed NDA and were assigned to groups ([Roster](Roster.md)).
- **Nomination submission:** Groups 1 and 2 submitted synthetic nominations; platform supported self-registration and group naming convention (`Group N - [Project Name]`).
- **Assessor cross-assignment:** Admin tooling supported assigning each assessor two nominations across groups ([Roster](Roster.md)).
- **Internal readiness:** Role assignment via Admin Dashboard confirmed working (Leila, [15.04 meeting](../../Confluence/Meetings/205291521%20-%20Team%20Meeting%20-%2015.04.2026.md)).
- **Orientation & materials:** Two global orientation sessions; walkthrough guides published at `ittd.space/uat-nda`.
- **Platform stability:** By early June, coach and assessment pages were live; one bug found and fixed ([06.06 meeting](../../Confluence/Meetings/231899138%20-%20Copy%20of%20Team%20Meeting%20-%2006.06.2026.md)).
- **Warm volunteer → core team pipeline:** Soban Ahmed (UAT assessor, Group 1) joined the core team ([16.06 meeting](../../Confluence/Meetings/238288897%20-%20Team%20Meeting%20-%2016.06.2026.md)).

---

## Issues found & resolved

| Issue | Source | Status |
| --- | --- | --- |
| Nominee cannot view own nomination when logged in with secondary email | [15.04 meeting](../../Confluence/Meetings/205291521%20-%20Team%20Meeting%20-%2015.04.2026.md) | _TBD — confirm fix deployed_ |
| Automated email bugs from nomination testing | [01.04](../../Confluence/Meetings/197787663%20-%20Team%20Meeting%20-%2001.04.2026.md), [15.04](../../Confluence/Meetings/205291521%20-%20Team%20Meeting%20-%2015.04.2026.md) — Leila + Peter | _TBD — Confluence tracker page 197591041_ |
| Coach and assessment pages not yet live | [06.06 meeting](../../Confluence/Meetings/231899138%20-%20Copy%20of%20Team%20Meeting%20-%2006.06.2026.md) | Fixed |
| Unspecified bug (one found during UAT) | [06.06 meeting](../../Confluence/Meetings/231899138%20-%20Copy%20of%20Team%20Meeting%20-%2006.06.2026.md) | Fixed |
| Group 3 nomination not submitted (mid-UAT) | [Comms handover](Comms-Handover-Dr-Kris.md) | _TBD — confirm if resolved_ |

> **Gap:** No central defect log was maintained offline. Discord bug channel and Confluence page 197591041 may hold additional items — not yet exported.

---

## Process & structural learnings (decisions from UAT)

These are **programme changes**, not platform bugs — agreed at [12.06](../../Confluence/Meetings/233472001%20-%20Team%20Meeting%20-%2012.06.2026.md) and [16.06](../../Confluence/Meetings/238288897%20-%20Team%20Meeting%20-%2016.06.2026.md) meetings.

### 1. Drop the Coach volunteer role

- **Finding:** No UAT volunteer adopted the coach role in practice; coaching module untested.
- **Decision:** Remove coach as a volunteer role for the live cycle.
- **Replacement:** n8n AI agent for **eligibility + completeness + attachments only** — not evaluation.
- **Preserved:** Human assessors unchanged; assessment must stay human.
- **Follow-up:** Remove coach features from WIX; archive Coach Guide; update Process Map, RACI, WS2, marketing copy ([16.06 action items](../../Confluence/Meetings/238288897%20-%20Team%20Meeting%20-%2016.06.2026.md)).

### 2. Discord → LinkedIn for volunteer/community engagement

- **Finding:** Discord was a **barrier to entry** for volunteers.
- **Decision:** **LinkedIn is the default** channel for volunteers and community going forward (posts, DMs, Showcase page).
- **Follow-up:** Retire Discord from guides, UAT walkthroughs, and volunteer onboarding; Oliver to set up LinkedIn Showcase page.

### 3. Core team expansion from UAT pool

- Recruitment email sent to all 16 volunteers ([Core-Team-Recruitment-Communication.md](Core-Team-Recruitment-Communication.md)).
- **Outcome:** Soban Ahmed joined core team; target was 1–2 volunteers.

### 4. Recognition & close-out

- Oliver to issue **UAT certificates** (similar to PBT certificate) for LinkedIn recognition.
- **Virtual celebration** targeted for **7 or 10 July 2026** (Peter to confirm date).
- Chris to send **thank-you note** to UAT members after Peter delivers this summary.

---

## UAT exit criteria (from roadmap)

Reference: [UAT-Roadmap.md](../Working%20Folder/UAT-Roadmap.md) — Phase 3 exit.

| Criterion | Met? | Notes |
| --- | --- | --- |
| End-to-end nomination → assessment path exercisable | _Partial / TBD_ | Coach path dropped; assessor path proven |
| P0/P1 defects resolved or accepted | _TBD_ | No formal defect log offline |
| Admin can assign roles and manage cycle | ✅ | Verified Apr 2026 |
| Volunteers could complete walkthroughs with guides | _TBD_ | Mid-UAT snapshot shows low completion |
| Core team confident to run live cycle Sep 2026 | ✅ | [Master Plan](../Program-Plan/Master-Plan.md), [WS4](../Program-Plan/Workstreams/WS4-Award-Operations.md) treat platform as UAT-proven |

---

## Open items (Peter)

- [ ] Confirm final per-group completion status (especially Group 3) — update [volunteer draft](Volunteer-Thank-You-and-UAT-Results.md) appendix if needed
- [ ] Pull any remaining bugs from Discord / Confluence page 197591041
- [ ] Confirm secondary-email bug and email bugs are fixed
- [ ] Write executive summary paragraph (above)
- [ ] Confirm virtual celebration date (7 or 10 Jul) — Chris to update email before send
- [ ] Chris review + send [Volunteer-Thank-You-and-UAT-Results.md](Volunteer-Thank-You-and-UAT-Results.md)
- [ ] Oliver: certificates ready

---

## Source index

| Document | What it contributes |
| --- | --- |
| [238288897 — Team Meeting 16.06.2026](../../Confluence/Meetings/238288897%20-%20Team%20Meeting%20-%2016.06.2026.md) | UAT close decisions; coach drop; Discord→LinkedIn; Peter's action to write this summary |
| [233472001 — Team Meeting 12.06.2026](../../Confluence/Meetings/233472001%20-%20Team%20Meeting%20-%2012.06.2026.md) | "Nearly complete"; coaching untested; no blockers; coach elimination proposed |
| [231899138 — Team Meeting 06.06.2026](../../Confluence/Meetings/231899138%20-%20Copy%20of%20Team%20Meeting%20-%2006.06.2026.md) | Coach/assessor pages went live; one bug fixed |
| [205291521 — Team Meeting 15.04.2026](../../Confluence/Meetings/205291521%20-%20Team%20Meeting%20-%2015.04.2026.md) | Secondary-email bug; admin dashboard verified |
| [Comms-Handover-Dr-Kris.md](Comms-Handover-Dr-Kris.md) | Mid-UAT progress snapshot (Groups 1–3 status table) |
| [Volunteer-Role-Assignment-Communication.md](Volunteer-Role-Assignment-Communication.md) | Same mid-UAT snapshot + role instructions |
| [Core-Team-Recruitment-Communication.md](Core-Team-Recruitment-Communication.md) | Post-UAT core team invite |
| [Roster.md](Roster.md) | 16 volunteers, groups, cross-assignment |
| [UAT-Roadmap.md](../Working%20Folder/UAT-Roadmap.md) | Original exit criteria and phase structure |
| [Master-Plan.md](../Program-Plan/Master-Plan.md) | Platform "proven in UAT" statement |
