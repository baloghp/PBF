# Volunteer Thank-You & UAT Results — Contractor of the Year 2027

- Page ID: `241467393`
- URL: `https://ittd.atlassian.net/wiki/spaces/PBF/pages/241467393/Volunteer+Thank-You+UAT+Results+Contractor+of+the+Year+2027`

**Status:** Draft for Chris — review before send
**Prepared by:** Peter Balogh
**Sender:** Dr Chris Kelly (Communications Head)
**Audience:** All 16 UAT volunteers ([Roster](Roster.md))
**Last updated:** 2026-06-30

**Internal reference:** [UAT Results Summary](https://ittd.atlassian.net/wiki/spaces/PBF/pages/241434625)

---

## Before you send (Chris)

1. Replace `[CONTACT EMAIL]` and `[SIGNATURE]` below.
2. Confirm celebration date with Peter (target **7 or 10 July 2026**) before mentioning it.
3. **Bcc** all 16 volunteers (list in [Comms-Handover-Dr-Kris.md](Comms-Handover-Dr-Kris.md)).
4. Oliver: confirm UAT certificates are ready (or soften wording to “coming shortly”).
5. If anyone replied to the core-team recruitment email, acknowledge individually in a separate note.

**Suggested subject:** `Thank you — Contractor of the Year UAT complete (and what we learned)`

---

## Email — copy/paste

Hi everyone,

Thank you for giving your time, patience, and honest feedback during the **Contractor of the Year User Acceptance Test**. Sixteen of you stepped up across three countries and time zones to help us prove — before we go public — that the award platform actually works for real people playing real roles.

**This email closes the UAT.** Below is what you helped us achieve, what we fixed because of you, and what we changed in the programme as a direct result of your experience.

---

### What you were testing

The **Project Business Foundation Contractor of the Year Award** celebrates outstanding contractor–client projects. Behind that idea sits a full digital platform where nominees submit their work, clients provide testimony, volunteer assessors score submissions, and administrators run the cycle.

Your job in UAT was to **role-play one synthetic nomination end to end** — in groups of five or six — using fictional or AI-generated project content. No polish required; snags and confusion were exactly what we needed to see.

You had walkthrough guides at [ittd.space/uat-nda](https://www.ittd.space/uat-nda) and the award platform at [ittd.space/pbf-pcoty](https://www.ittd.space/pbf-pcoty).

---

### What you helped us prove

These are the core workflows we needed confidence in before opening the **first public nomination window on 1 September 2026**. Your testing — and your feedback — confirmed they are ready.

**1. Nomination submission (Nominee role)**

You showed that a contractor can **register, log in, and submit a full nomination** — project description, supporting materials, and the structured fields the award requires. Groups used the agreed naming convention (`Group N – Project Name`) so parallel test projects stayed cleanly separated.

This matters because the live cycle will depend entirely on self-service submission: there is no back-office data entry team. If nominees cannot complete the form alone, the award does not run.

**2. Client testimony / customer evaluation (Client role)**

The award requires independent client input, not just the contractor’s story. You exercised the **client evaluation pathway** — the separate flow where the “client” on a nomination submits their testimony about the project.

This validated that the two-sided nature of a nomination (contractor + client) works in practice, not just on paper.

**3. Assessor scoring (Assessor role)**

Volunteer assessors are the human heart of Stage 1 screening. You confirmed that an assessor can:

- see the nominations assigned to them (including **cross-group assignments** — each assessor scoring two different projects);
- open a nomination and work through the **scoring form**; and
- navigate the assessor workspace without admin hand-holding.

That cross-group assignment pattern is how we balance workload and avoid any single assessor only ever seeing one project style. Your testing proved the admin tooling and the assessor UI work together.

**4. Administration and role management (Core team — informed by your participation)**

Behind the scenes, the core team used the **Admin Dashboard** to register volunteers, assign groups, assign assessors to nominations, and manage roles. Internal testing plus your live participation confirmed that a 16-person, 3-group UAT can be stood up and run without manual workarounds.

**5. Orientation, guides, and self-service support**

Two global orientation sessions (April 2026), NDAs, role assignments, and the published walkthrough guides at `ittd.space/uat-nda` formed the **handover pack** for volunteers. The fact that you could work asynchronously, across time zones, with written guides rather than live hand-holding, tells us the enablement model scales to a larger volunteer pool for the live cycle.

---

### What we found and fixed along the way

UAT is supposed to surface problems early. Yours did. Highlights:

| Area | What you surfaced | What we did |
| --- | --- | --- |
| **Nominee access** | A nominee logging in with a secondary email could lose access to their own submission | Identified and corrected — row ownership must follow the nominee |
| **Notification emails** | Automated emails during nomination did not always behave as expected | Tracked and repaired through internal testing (Leila + Peter) |
| **Assessor & coach pages** | Early in UAT, some role-specific pages were not yet live for volunteers | Deployed and verified before UAT close |
| **General defects** | Additional issues reported via Discord during testing | Triaged and fixed as part of the UAT fix-and-retest loop |

We are not claiming the platform will never throw a surprise — no software does — but **there are no open blockers** on the nomination, client evaluation, and assessor paths you exercised. That is the bar we needed to hit, and you got us there.

---

### What we learned — and changed because of you

Some of the most valuable UAT outcomes were not bugs in code but **lessons about how people actually want to participate**. Three decisions follow directly from your experience:

**1. Human assessment stays; the Coach volunteer role goes**

We originally designed a **Nominee Coach** role — a volunteer who would guide each submission through eligibility and completeness checks before assessors saw it. In UAT, **nobody picked up that role in practice**, and the coaching module was never exercised end to end.

We have decided to **drop the Coach volunteer role** for the live cycle. Completeness and eligibility checking will be handled by an **automated pre-screening agent** (rules-based / AI-assisted — checking that submissions are complete and eligible, **not** judging quality). **Assessors remain human**, and Stage 2 judging remains human. Your feedback helped us simplify the volunteer model to what people will actually do.

**2. LinkedIn, not Discord, for community going forward**

Many of you told us — directly or by simply not engaging — that **Discord was a barrier**. Creating yet another account on yet another platform was friction we cannot afford for a volunteer-run award.

Going forward, **LinkedIn is our default community and volunteer channel** — posts, direct outreach, and (soon) a Project Business Showcase page. We are retiring Discord from volunteer onboarding and guides. If you are happy to stay involved, LinkedIn is where we will reach you.

**3. Warm volunteers can join the steering group**

We invited UAT participants to join the **core team** that steers the programme. **Soban Ahmed** (Group 1 assessor) and **Angel Chew** (Group 2 assessor) accepted and are now part of that group — a direct pipeline from “tester” to “shaper.” If you expressed interest and we have not yet replied, we will follow up individually.

---

### Where the award goes next

Because of UAT, we are moving from test to **first live cycle**. Public milestones agreed:

| Date | Milestone |
| --- | --- |
| **1 September 2026** | Nominations open |
| **31 October 2026** | Submission deadline |
| **30 November 2026** | Finalists announced |
| **Last week of January 2027** | Stage 2 presentations (virtual) |
| **15 February 2027** | Winners announced |

Full programme plan: [Master Plan](../Program-Plan/Master-Plan.md) · [DR-001 Cycle Schedule](../Program-Plan/Decisions/DR-001-Cycle-Schedule.md)

Some of you may be invited back as **assessors for the live cycle** — you already know the platform, and you are our warm list. We will be in touch separately about that.

---

### Recognition

**Certificates:** Oliver is preparing **UAT contributor certificates** (similar to other Project Business Foundation certificates) that you can display on **LinkedIn**. We will send details when they are ready.

**Celebration:** We are planning a **short virtual get-together** to mark the end of UAT — target **7 or 10 July 2026** _(Peter to confirm — update this line before send)_. Calendar invite to follow.

If you post about the award or your UAT role on LinkedIn, tag **Project Business Foundation** — it helps us build visibility ahead of the September launch.

---

### Thank you

Sixteen people, three parallel test projects, two orientation sessions, and dozens of hours of volunteer time — that is what it took to get a brand-new award platform from “built” to **“ready for the public.”**

You found bugs. You told us where the process was heavier than it needed to be. You helped us cut the Coach role, move to LinkedIn, and simplify the path to September.

We could not have done this without you.

Thank you,

**[SIGNATURE]**
Dr Chris Kelly — Communications Head, Contractor of the Year
**[CONTACT EMAIL]**

---

## Appendix — UAT results detail (optional: Confluence / website / LinkedIn post)

_Use this section if Chris wants a longer public-facing summary. Trim as needed._

### By the numbers

| Metric | Value |
| --- | --- |
| Volunteers | 16 |
| Groups / synthetic nominations | 3 |
| Orientation sessions | 2 (24 & 28 Apr 2026) |
| Roles in scope | Nominee, Client, Assessor (+ Coach assigned but not exercised) |
| Platform | WIX at `ittd.space/pbf-pcoty` |
| Walkthrough hub | `ittd.space/uat-nda` |

### Workflow readiness (post-UAT)

| Workflow | Readiness | Evidence |
| --- | --- | --- |
| Self-service nomination | **Ready** | Groups submitted synthetic nominations; self-registration works |
| Client evaluation | **Ready** | Client testimony path exercised per walkthrough |
| Assessor scoring | **Ready** | Cross-group assignment and scoring UI validated |
| Admin / role assignment | **Ready** | 16-person roster managed via Admin Dashboard |
| Coach / Coach Diary | **Removed from live model** | Not adopted in UAT; replaced by automated completeness check |
| Live-cycle blockers | **None on tested paths** | Core team UAT close (12 & 16 Jun 2026) |

### Volunteer cohort

See [Roster.md](Roster.md) for full names, groups, and roles. Group structure:

- **Group 1** — Samuel Koramati, Enoch Toppo (nominee/client); Luis Garrido (coach); Dale Porter, Soban Ahmed, Langson Samala (assessors)
- **Group 2** — Christopher Solie, Atul Sen (nominee/client); Kostiantyn Valieiev (coach); Angel Chew, Mercy Engesia (assessors)
- **Group 3** — Bob Grove, Abhishek Tyagi (nominee/client); Sasha Savage (coach); Derrick Amponsah, Davis Mok (assessors)

### Core team conclusion

At UAT close (16 June 2026), the core team recorded:

- UAT objectives met for nomination, client evaluation, and assessor flows
- No remaining blockers for opening the public nomination window
- Programme simplified: coach role out, LinkedIn in, automated pre-screening in
- Platform and documentation updates in progress before September launch

---

## Facilitator notes (do not send)

- Mid-UAT snapshot (pre-close) showed Groups 1 & 2 with nominations in; Group 3 was pending at that point. The volunteer email uses **core-team close-out language** (no blockers; flows proven) rather than a per-group completion matrix. Peter to confirm Group 3 final status and update appendix if needed.
- Celebration date still TBD between 7 and 10 Jul.
- Chris sends; Peter wrote. Certificates depend on Oliver.
- LinkedIn Showcase page may not exist yet — email says “soon” rather than linking.
