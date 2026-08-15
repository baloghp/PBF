# Contractor of the Year — Award Master Plan

**Status:** Draft v0.1 — subject to change
**Owner:** [Programme Owner / PM — TBD]
**Last updated:** 2026-06-29

> **Updated post-UAT Jun 2026 — Coach role removed.** See [DR-002](Decisions/DR-002-Drop-Nominee-Coach.md).

> Single source of truth for running the **first live (post-UAT) Contractor of the Year award cycle**.

---

## 1. Context

- **Concept:** Mature and documented (Award Credo, Evaluation Framework, two-stage process). See [Project Overview](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97419265).
- **Platform:** Proven in UAT at `ittd.space/pbf-pcoty`; walkthroughs for Nominee/Assessor at `ittd.space/uat-nda` (Coach walkthrough retired — DR-002).
- **Process model:** Submission → automated intake/pre-screen → Stage 1 (volunteer screening) → Stage 2 (judging panel) → Decision → Publication/Ceremony.
- **Now:** Transition from UAT to a **real, public award cycle**. This plan covers what must happen, who owns it, and when.

---

## 2. Workstream Overview

| # | Workstream | Owner | One-line scope |
|---|-----------|-------|----------------|
| WS1 | **Program Management / PMO** ([SCRUM-1](https://ittd.atlassian.net/browse/SCRUM-1)) | [TBD] | Master timeline, milestones (PBF-17), RACI, risk, KPIs/SLAs — the integrator |
| WS2 | **Recruitment & Volunteer Enablement** ([SCRUM-2](https://ittd.atlassian.net/browse/SCRUM-2)) | [TBD] | Recruit + onboard + train **Assessors** and **Judging Panel** (no Nominee Coach — DR-002) |
| WS3 | **Marketing & Nomination Acquisition** ([SCRUM-3](https://ittd.atlassian.net/browse/SCRUM-3)) | [TBD] | Target, invite, and convert nominations |
| WS4 | **Award Operations** ([SCRUM-4](https://ittd.atlassian.net/browse/SCRUM-4)) | [TBD] | Run intake → assessment → decision; **assessor assignment, COI, moderation, shortlist**; platform support |
| WS5 | **Governance, Legal & Compliance** ([SCRUM-5](https://ittd.atlassian.net/browse/SCRUM-5)) | [TBD] | Rules/T&Cs, COI, consent, GDPR/retention, appeals |
| WS6 | **Ceremony, Publication & PR** ([SCRUM-6](https://ittd.atlassian.net/browse/SCRUM-6)) | [TBD] | Winner announcement, case stories, ceremony, dual-site publication |
| WS7 | **Sponsorship & Finance** ([SCRUM-7](https://ittd.atlassian.net/browse/SCRUM-7)) | [TBD] | Sponsor acquisition, budget, prizes/certificates |

> **Note:** Per decision on 2026-06-05, **Recruitment and Volunteer Onboarding/Training are a single workstream (WS2)** because they are tightly coupled and sequential.

---

## 3. Workstreams in Detail

### WS1 — Program Management / PMO
**Detail:** [WS1 file](Workstreams/WS1-Program-Management-PMO.md)
**Owner:** [TBD]
**Objective:** Keep all workstreams synchronised against one calendar and surface risks early.
**Key deliverables:**
- Master timeline & milestone schedule (mapped to **PBF-17**)
- Cross-workstream RACI
- Risk register + mitigation log
- KPIs/SLAs finalised (replace the "X days" placeholders in the SLA doc)
- Cadence: weekly standup / status report
**Depends on:** all workstreams (integrates them)
**Open items:** define nomination window dates; confirm cycle calendar.

---

### WS2 — Recruitment & Volunteer Enablement
**Detail:** [WS2 file](Workstreams/WS2-Recruitment-Volunteer-Enablement.md)
**Owner:** [TBD]
**Objective:** Secure and prepare **Assessors** and the Judging Panel. *(Nominee Coach dropped — DR-002.)*
**Sub-tracks:**
- **2a. Assessors (Stage 1)** — recruit volunteers and onboard; **PM/WS4 assigns** per nomination.
- **2b. Judging Panel (Stage 2)** — recruit **high-profile jury** (e.g., PMI community leaders); different ask, timeline, and scheduling around finalist presentations.
- **2c. Onboarding & Training** — calibrate on the Evaluation Framework, COI acknowledgment, tool/platform training, scheduling, retention.
**Key deliverables:**
- Role descriptions + recruitment outreach
- Confirmed roster (assessors, judges) with COI declarations
- Training/calibration sessions delivered; volunteers "certified" ready
**Depends on:** WS5 (COI policy), WS1 (timeline)
**Open items:** target numbers per role; judge shortlist; honorarium/recognition for judges (link to WS7).

---

### WS3 — Marketing & Nomination Acquisition
**Detail:** [WS3 file](Workstreams/WS3-Marketing-Nomination-Acquisition.md)
**Owner:** [TBD]
**Objective:** Drive a strong, qualified pool of nominations (inbound).
**Key deliverables:**
- Target audience & channel plan (industries, regions, partner networks)
- Campaign assets (landing page, invites, social, partner outreach)
- Nomination drive with conversion tracking
**Depends on:** WS5 (eligibility rules public), WS4 (intake ready), WS7 (sponsor co-marketing)
**Open items:** nomination targets; key channels; partner amplification (ITTD/PBF/PMI).

---

### WS4 — Award Operations
**Detail:** [WS4 file](Workstreams/WS4-Award-Operations.md)
**Owner:** [TBD]
**Objective:** Run the core process reliably from submission to decision.
**Key deliverables:**
- Productionised platform (hardening, security, uptime/monitoring)
- Support/help desk for nominees, assessors, judges
- Intake & eligibility (automated pre-screen + PM exceptions); **assessor assignment, COI, moderation, shortlist**; Stage 1 screening; Stage 2 logistics; decision recording
- Status tracking & notifications
**Depends on:** WS2 (people), WS5 (process gates), WS1 (timeline)
**Open items:** confirm production environment & support model; bug-triage process during live cycle.

---

### WS5 — Governance, Legal & Compliance
**Detail:** [WS5 file](Workstreams/WS5-Governance-Legal-Compliance.md)
**Owner:** [TBD]
**Objective:** Make the program fair, defensible, and legally sound.
**Key deliverables:**
- Official **Rules / Terms & Conditions**
- COI policy enforcement & recusal records
- Publication & recording **consent** forms
- **GDPR / data-protection** handling + 1-year retention policy
- **Appeals process** (currently "to be finalised")
- NDAs where required
**Depends on:** WS1
**Open items:** finalise appeals; legal review of T&Cs and consents.

---

### WS6 — Ceremony, Publication & PR
**Detail:** [WS6 file](Workstreams/WS6-Ceremony-Publication-PR.md)
**Owner:** [TBD]
**Objective:** Recognise winners and amplify the stories (outbound).
**Key deliverables:**
- Winner & finalist notifications (under embargo)
- **Case stories** for winner + top-3 finalists (consent-gated)
- Press releases, social content, methodology summary
- **Ceremony** (format decision: virtual vs in-person) — agenda, AV, hosting
- Dual publication on **ITTD + PBF** websites (framed as cooperation)
- Certificates/trophies (coordinate with WS7)
**Depends on:** WS4 (results), WS5 (consents), WS7 (prizes)
**Open items:** ceremony format & date; publication venues confirmed.

---

### WS7 — Sponsorship & Finance
**Detail:** [WS7 file](Workstreams/WS7-Sponsorship-Finance.md)
**Owner:** [TBD]
**Objective:** Fund the program and deliver tangible recognition.
**Key deliverables:**
- Sponsor prospectus / pitch materials (company outreach for awards + PBF)
- Signed sponsors & deliverables tracking
- Program **budget** & fund management
- Procurement of certificates / trophies / prizes
**Depends on:** WS1 (budget envelope), WS3 (co-marketing), WS6 (deliverables)
**Open items:** sponsorship tiers; budget envelope; prize definition.

---

## 4. High-Level Timeline (to be detailed in PBF-17)

**Cycle shape per [DR-001](Decisions/DR-001-Cycle-Schedule.md): "P-CotY 2026" with Stage 1 in 2026 and Stage 2 + ceremony in late January 2027 (holiday seam after the shortlist).**

| Phase | Indicative window | Lead workstreams |
|-------|-------------------|------------------|
| Setup & readiness | Jun–Aug 2026 | WS1, WS4, WS5 |
| Recruit & enable volunteers/judges | Jun–Oct 2026 (assessor EOI closes **15 Oct**) | WS2 |
| Sponsorship drive | Jun 2026 → ongoing | WS7 |
| Nomination window (open → close) | Sep → 31 Oct 2026 | WS3, WS4 |
| Intake & eligibility | Oct–Nov 2026 | WS4 |
| Stage 1 — volunteer screening / shortlist | Nov–Dec 2026 (shortlist before year-end) | WS4, WS2 |
| — Christmas break (clean pause) — | late Dec 2026 | — |
| Stage 2 — judging panel & Q&A | mid-Jan 2027 | WS2, WS4 |
| Decision & notifications | late Jan 2027 | WS4, WS5 |
| Ceremony & publication | late Jan 2027 | WS6 |
| Post-award (feedback, lessons, archive) | Feb 2027 | WS1, WS5 |

---

## 5. Open Decisions (program-wide)

- [ ] Nomination window dates & full cycle calendar
- [ ] Ceremony format: virtual vs in-person
- [ ] SLA values (replace "X days" placeholders)
- [ ] Appeals process finalisation
- [ ] Number of categories / shortlist size (N per category)
- [ ] Judge shortlist & confirmation
- [ ] Budget envelope & sponsorship tiers
- [ ] Workstream owners (fill all [TBD])

---

## 6. Jira Issues (SCRUM project)

Created 2026-06-05 on board: https://ittd.atlassian.net/jira/software/projects/SCRUM/boards/1

| Epic | Stories |
|------|---------|
| [SCRUM-1](https://ittd.atlassian.net/browse/SCRUM-1) WS1 — Program Management / PMO | [SCRUM-8](https://ittd.atlassian.net/browse/SCRUM-8) Master timeline · [SCRUM-9](https://ittd.atlassian.net/browse/SCRUM-9) RACI · [SCRUM-10](https://ittd.atlassian.net/browse/SCRUM-10) Risk register · [SCRUM-11](https://ittd.atlassian.net/browse/SCRUM-11) KPIs/SLAs |
| [SCRUM-2](https://ittd.atlassian.net/browse/SCRUM-2) WS2 — Recruitment & Volunteer Enablement | [SCRUM-12](https://ittd.atlassian.net/browse/SCRUM-12) Assessors · [SCRUM-13](https://ittd.atlassian.net/browse/SCRUM-13) Judging Panel · [SCRUM-14](https://ittd.atlassian.net/browse/SCRUM-14) Onboarding & training · [SCRUM-15](https://ittd.atlassian.net/browse/SCRUM-15) COI declarations |
| [SCRUM-3](https://ittd.atlassian.net/browse/SCRUM-3) WS3 — Marketing & Nomination Acquisition | [SCRUM-16](https://ittd.atlassian.net/browse/SCRUM-16) Audience & channel plan · [SCRUM-17](https://ittd.atlassian.net/browse/SCRUM-17) Campaign assets · [SCRUM-18](https://ittd.atlassian.net/browse/SCRUM-18) Nomination drive |
| [SCRUM-4](https://ittd.atlassian.net/browse/SCRUM-4) WS4 — Award Operations | [SCRUM-19](https://ittd.atlassian.net/browse/SCRUM-19) Productionize platform · [SCRUM-20](https://ittd.atlassian.net/browse/SCRUM-20) Support/help desk · [SCRUM-21](https://ittd.atlassian.net/browse/SCRUM-21) Run intake→decision |
| [SCRUM-5](https://ittd.atlassian.net/browse/SCRUM-5) WS5 — Governance, Legal & Compliance | [SCRUM-22](https://ittd.atlassian.net/browse/SCRUM-22) Rules/T&Cs · [SCRUM-23](https://ittd.atlassian.net/browse/SCRUM-23) Consent & GDPR · [SCRUM-24](https://ittd.atlassian.net/browse/SCRUM-24) Appeals process |
| [SCRUM-6](https://ittd.atlassian.net/browse/SCRUM-6) WS6 — Ceremony, Publication & PR | [SCRUM-25](https://ittd.atlassian.net/browse/SCRUM-25) Ceremony format · [SCRUM-26](https://ittd.atlassian.net/browse/SCRUM-26) Case stories · [SCRUM-27](https://ittd.atlassian.net/browse/SCRUM-27) Dual publication |
| [SCRUM-7](https://ittd.atlassian.net/browse/SCRUM-7) WS7 — Sponsorship & Finance | [SCRUM-28](https://ittd.atlassian.net/browse/SCRUM-28) Sponsor prospectus · [SCRUM-29](https://ittd.atlassian.net/browse/SCRUM-29) Budget & tiers · [SCRUM-30](https://ittd.atlassian.net/browse/SCRUM-30) Certificates/trophies |

---

## Decision Records

- [DR-001 — Award Cycle Schedule: Stage 2 in January (P-CotY 2026)](Decisions/DR-001-Cycle-Schedule.md) — *Accepted 2026-06-05*
- [DR-002 — Drop Nominee Coach role (Post-UAT)](Decisions/DR-002-Drop-Nominee-Coach.md) — *Accepted 2026-06-16*

---

## 7. References

- [Project Overview](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97419265)
- [Process Map](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117866524)
- [Roles and RACI](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117964816)
- [Governance & Jury Protocol](https://ittd.atlassian.net/wiki/spaces/PBF/pages/97779722)
- [Overview & Eligibility](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98566145)
- [Evaluation Framework](https://ittd.atlassian.net/wiki/spaces/PBF/pages/98631681)
- [SLA's and Metrics](https://ittd.atlassian.net/wiki/spaces/PBF/pages/117833739)
- Jira Epic: **PBF-17 — Key Milestones**
