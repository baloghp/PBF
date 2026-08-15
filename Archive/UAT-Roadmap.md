# UAT roadmap — Contractor of the Year (WIX)

This document is the **end-to-end plan** for user acceptance testing with roleplay “projects” (nominations). It assumes roughly **30 volunteers**, organized into **four parallel UAT groups** — **four distinct nominations** (each with 1–3 nominees, 1 coach, 3–5 assessors as your roster allows). Adjust dates to your calendar.

**How to read this doc:** **UAT phases** are always written **Phase 0**, **Phase 1**, **Phase 2**, **Phase 3** (four stages: 0 through 3). Numbered headings such as **1. Objectives** or **3. Volunteer model** are **document sections only**, not UAT phase numbers.

**UAT phases (summary):** **Phase 0** (readiness + handover pack) → **Phase 1** (orientations) → **Phase 2** (internal pilot, administration team only) → **Phase 3** (execution with volunteers, repeated until the product is stable).

**Volunteer cadence:** Live volunteer sessions stay **short and bounded** (e.g. **2-hour** orientation in Phase 1; **≤ half-day** execution sessions in Phase 3). Plan **at least one calendar week** between **volunteer** meetings unless everyone agrees otherwise. **Phase 2 does not use volunteers** — it is internal only — so the gap after Phase 1 is for **admin pilot + fixes** before the first **Phase 3** volunteer session.

**Related references (Working Folder):**

- [[Admin-Use-Cases-WIX]]
- [[Assessor-Use-Cases-WIX]]
- [[Nominee-Use-Cases-WIX]]
- [[Nominee-Coach-Use-Cases-WIX]]
- [[Nomination-Client-Use-Cases-WIX]]
- [[System-Use-Cases-WIX]]
- [[Dashboard-Metrics-WIX]]

---

## 1. Objectives and success criteria

**Objectives**

- Validate end-to-end flows per role under realistic (roleplay) data.
- Surface **usability**, **data integrity**, and **permission** issues before go-live.
- Confirm **operational readiness**: support channels, defect triage, and rollback/communicate plan if needed.

**Success criteria (examples)**

- Each role completes **core scenarios** without blocker confusion (or blockers are logged with repro steps).
- Cross-role handoffs work (nomination → coach → assessors → admin views/metrics where applicable).
- **Defect severity** is assigned; P0/P1 have owners. **Fix, deploy, and regression** are **internal**: they run **after Phase 2** before the first Phase 3 volunteer session, and **between Phase 3 volunteer sessions**, until **UAT exit** criteria (below) are met.

**UAT exit — end of Phase 3 (when “everything works”)**

- Agreed scenario set passes for all **four** nomination groups (or documented **accepted** deferrals with workarounds).
- No open **P0**; **P1** either fixed or explicitly signed off.
- Short **closure note** or readout: coverage, defect summary, residual risk, **go / no-go** (or “continue wave”) decision.

---

## 2. Scope and assumptions

**In scope**

- Scripted scenarios per role, plus **limited exploratory time in Phase 3** execution sessions. Phase 1 uses **structured** breakout mini-drills only (not open-ended exploration).
- Data: synthetic personas — no real PII unless policy allows.

**Out of scope (unless you add them)**

- Load/performance testing, penetration testing, full accessibility audit.

**Assumptions**

- Environment URLs, accounts, and role assignments are ready **before Phase 1** (orientations).
- A **UAT coordinator** owns volunteer scheduling, comms, and the defect log.
- **Fix and regression** between volunteer touchpoints are **internal** (dev/admin); volunteers are not asked to retest on demand outside scheduled sessions unless you explicitly recruit for that.

---

## 3. Volunteer model — four nominations, four groups

**Scale during Phase 3 (execution)**

The **four groups / four nominations** model applies to **Phase 3**. Phase 1 gathers everyone for orientation; Phase 2 is admin-only.

- **Four** parallel UAT streams: **Group 1 … Group 4**, each tied to **one synthetic nomination** (distinct storylines to broaden coverage).
- Within each group: **nominees** (1–3), **one coach**, **assessors** (3–5), as needed for the scenario.

**Headcount (~30 volunteers)**

- With **four** groups, approximate **7–8 people per group** if evenly split; adjust roster so every role is filled (use floaters as backup assessors or notetakers).
- If a role is short: merge two groups temporally (same week, different half-days) — still **four** nomination storylines over the cycle.

---

## 4. Phased roadmap (summary)

| Phase | Who | Purpose | Typical time |
|-------|-----|---------|----------------|
| **Phase 0** | Internal (product, admin, tech) | Readiness, smoke tests, and **full UAT handover pack** for the UAT team | As needed (often several days internally) |
| **Phase 1** | **All volunteers** | **Orientations** — one combined session (plenary + role breakouts) | **2 hours** (once) |
| **Phase 2** | **Administration team only** | **Internal pilot** — full path on test, one nomination, no volunteer dependency | Internal (e.g. half-day + follow-up fixes) |
| **Phase 3** | Volunteers (**4 groups / 4 nominations**) | **Execution waves** — run scenarios, capture issues; **repeat** volunteer sessions only after internal **fix + regression**; **continue until UAT exit** (see **UAT exit — end of Phase 3** above) | **≤ half-day per volunteer session**; **≥ ~1 week** between sessions unless agreed |

**Internal fix–regress loop (from end of Phase 2 through close of Phase 3):** triage → fix → deploy to test → **regression** (admin/coordinator) → update “known issues” for volunteers → schedule the **next** Phase 3 volunteer session (or close UAT if exit criteria are met). The same loop applies **once** after Phase 2 before Wave 1, and **between** Phase 3 waves.

---

## 5. Phase 0 — Readiness and UAT handover pack

### 5.1 Readiness checklist

- [ ] Test environment stable; internal **happy path** smoke-tested.
- [ ] Accounts created and **assigned to roles** for all four group rosters (and admin/coordinator).
- [ ] Four **scenario packets** drafted (one per nomination group) — see Appendix A.
- [ ] Defect template agreed (title, environment, role, steps, expected/actual, severity, screenshot/video).
- [ ] Comms channel live (Teams/Slack) + how volunteers escalate.
- [ ] **RACI:** triage owner, fix priority, “not a bug” decider.
- [ ] NDA signing

### 5.2 UAT handover materials (give to UAT lead / facilitators before Phase 1)

Deliver a **single pack** (folder or wiki) containing:

| Item | Description |
|------|-------------|
| **Schedule** | Phase 1 date/time; placeholder Phase 3 dates (“TBD after Phase 2 complete”) |
| **Environment** | Base URL(s), which build/version is UAT, browser notes |
| **Roster** | Group 1–4: names, emails, **role per person**, login initials |
| **Scenario packets (×4)** | Per Appendix A; distinct project briefs / edge cases |
| **Facilitator one-pagers** | Per role: links, 3 “must show” screens, mini-drill steps |
| **Orientation deck / script** | Timings for 2 h session (or link to runbook) |
| **How to log defects** | Template link, example ticket, severity guide |
| **Known limitations** | What is **not** in scope for UAT; mock vs live integrations |
| **Data playbook** | How scenarios are seeded/reset; who resets between waves |
| **Contact tree** | UAT coordinator, admin on-call, dev escalation |

**After Phase 0 — internal only**

- Convert smoke-test findings into tickets; stabilize access and seed data.
- **Exit:** handover pack distributed; coordinator confirms facilitators have everything for **Phase 1**.

---

## 6. Phase 1 — Orientations (volunteers)

**Goals**

- **Plenary:** award **journey**, roleplay rules (**one nomination = one project**), UAT reporting rules.
- **Breakouts:** each role sees their screens and does a **short mini-drill**.

**Agenda (2 hours — example)**

| Block | Time | Audience | Content |
|-------|------|----------|---------|
| A | ~25 min | Everyone | Welcome, data handling; end-to-end story; roleplay framing |
| B | ~15 min | Everyone | Links, defect template, channel, **cadence** (week between **Phase 3** volunteer sessions, once execution starts) |
| C | ~55 min | **Parallel breakouts** | Role walkthrough + mini-drill |
| D | ~15 min | Everyone | Q&A; what happens next — **Phase 2 internal pilot**, then first **Phase 3** volunteer date (to be announced) |

**Breakout tracks**

### 6.1 Nominees

- **Focus:** nominee dashboard, tasks, constraints.
- **Deliverable:** can follow happy path for their group’s packet.

### 6.2 Nominee coaches

- **Focus:** coach diary, boundaries, visibility.
- **Deliverable:** can explain coach steps for one nomination.

### 6.3 Assessors

- **Focus:** assignments, form behavior, save/submit; edge cases.
- **Reference:** [[Stage-1-Assessor-Form-Spec]].

### 6.4 Nomination clients / nominator (if in scope)

- **Focus:** submission flow, confirmations.

### 6.5 Admin (if any volunteers act as admin-like testers)

- **Focus:** dashboards, assignments — *note: heavy admin validation sits in **Phase 2** with the administration team.*

**Artifacts**

- Same as handover pack; printed **group links** on day one.

**After Phase 1**

- FAQ from Q&A; update packets; fix **blockers that would waste volunteer time** in Phase 3.
- Communicate: **no volunteer pilot** — **Phase 2** is internal next; **first Phase 3 session** announced when the admin pilot passes internal readiness.

---

## 7. Phase 2 — Internal pilot (administration team only)

**Purpose**

- Run **one full nomination path** on the test environment **without volunteers**.
- Prove scheduling, handoffs, permissions, data, and defect workflow.
- Flush **P0/P1** before the four groups arrive for Phase 3.

**Who**

- **Administration team** (and whoever they need: one dev on call, DBA, etc.). They may use **test accounts** to walk nominee/coach/assessor **behaviors** if volunteers are not involved — goal is **system truth**, not usability sample.

**Suggested design**

- One **end-to-end** storyline; include at least one **exception path** if supported (reassign, incomplete assessment, etc.).
- Confirm **four** nomination **templates** or seed scripts work — not only one.

**Exit criteria**

- Happy path repeatable by admin runbook.
- No silent blockers for login, routing, core saves.
- **Go** to schedule **Phase 3 — Wave 1** for all four groups (or stagger by capacity).

**After Phase 2**

- Triage, fixes, **internal regression** until stable enough for volunteers.
- Publish **known issues** in the handover channel before the **first Phase 3** session.

---

## 8. Phase 3 — Execution waves (four groups, four nominations)

**Shape**

- **Four** UAT groups, **four** nomination storylines, run according to capacity (e.g. **all four same half-day** if facilitation allows, or **two + two** on different days).
- Each session: kickoff → timed scenarios → short exploratory window → hot wash.

### Session structure (per volunteer meet)

1. **Kickoff (~15 min)** — storyline, stop conditions, notetaker, links to current **known issues**.
2. **Scenarios (~90–150 min)** — establish context; nominee + coach; assessor; admin checks if in scope for volunteers.
3. **Exploratory (~15–30 min)** — within role.
4. **Hot wash (~15 min)** — top frictions / positives; coordinator consolidates.

### Between volunteer sessions (internal)

- **Fix → deploy → regression**; update digest for next meet.

### Closing Phase 3 / UAT

- **Repeat** volunteer execution sessions as needed until **UAT exit** criteria (**UAT exit — end of Phase 3**, under **Objectives and success criteria**) are met. There are **no further UAT phase numbers** after Phase 3 in this roadmap; optionally hold a **final 30–60 min readout** with stakeholders once you call UAT complete.

### Waves numbering

- **Wave 1, 2, … n** — however many **volunteer** iterations you need. Early waves may find many defects; later waves confirm regression. **Four nominations** persist; **storylines** stay the same unless you version packets after big fixes.

---

## 9. Communications plan

- **T-7 days:** save-the-date, pre-read links from handover pack.
- **T-1 day:** “log in once” (optional).
- **Day-of:** link sheet + escalation.
- **Between Phase 3 volunteer sessions:** async digest (fixed / still open / workarounds); next session date.

---

## 10. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Phase 2 skipped or rushed | Volunteers hit the same blockers admin would have caught — protect Phase 2 time |
| Four groups = coordination load | Stagger two groups per day; shared facilitator checklist |
| Regression not done between waves | Define minimum internal smoke checklist before next volunteer call |
| Admin pilot ≠ volunteer UX | Still capture **usability** in Phase 3; Phase 2 is **technical + process** truth |

---

## 11. Next actions (fill in)

- **Phase 1 (orientation) date:** ____________________
- **Phase 2 (internal pilot) complete-by:** ____________________
- **Phase 3 — Wave 1 date:** ____________________
- **UAT coordinator:** ____________________
- **Environment URL(s):** ____________________
- **Defect tool:** ____________________

---

## Appendix A — Scenario packet outline (one per nomination group × 4)

1. **Group id** (1–4) and **persona names** (nominees, coach, assessors).
2. **Project brief** (fiction).
3. **Customer list** (if applicable).
4. **Expected milestones** (timeboxed for a half-day).
5. **Deliberate edge case** (distinct per group where possible).
6. **Success checklist** (“done” for this nomination).

---

## Appendix B — Example calendar (volunteer vs internal)

| Calendar week | Volunteer session? | Focus |
|---------------|-------------------|--------|
| **Week 0** | No | **Phase 0:** readiness + **handover pack** complete |
| **Week 1** | Yes — **2 h** | **Phase 1:** orientations |
| **Week 2** *(example)* | No | **Phase 2:** admin internal pilot; fixes + **internal regression** before Phase 3 |
| **Week 3+** | Yes — half-days as scheduled | **Phase 3:** execution waves for **four** groups; internal fix/regression **between** sessions until **UAT exit** |

Phase 2 may need more than one calendar week if fixes are heavy; extend the “no volunteer session” block before scheduling **Phase 3 — Wave 1**.

Volunteers need **confirmed dates** for **Phase 1** and each **Phase 3** session they attend. **Phase 2** has **no volunteer meetings**; communicate only that **Phase 3** dates will be confirmed **after internal pilot** and stabilization.
