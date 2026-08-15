# UAT Certificate of Recognition

- Page ID: `247136258`
- URL: `https://ittd.atlassian.net/wiki/spaces/PBF/pages/247136258/UAT+Certificate+of+Recognition`
- Parent: [Project Contractor Of The Year Award](97419265 - Project Contractor Of The Year Award.md)
- Related: [Volunteer Thank-You & UAT Results](../../../Contractor_of_The_Year/UAT/Volunteer-Thank-You-and-UAT-Results.md) · [UAT Roster](../../../Contractor_of_The_Year/UAT/Roster.md) · [WS2 — Recruitment & Volunteer Enablement](231407651 - WS2 — Recruitment & Volunteer Enablement.md)
- Source assets: `Marketing/UAT Certificate/` (`certificate-base.html`, `Certificate.html`, `generate-certificates.py`, `volunteers.json`)
- **Status:** Certificates generated (16 HTML + 16 PDF) — distribute at UAT celebration (21 Jul 2026)
- **Owner:** Dr Kris Lea (Communications Head) — send; PM (Peter Balogh) — production
- **Confluence version:** `2026-07-12T08:51:09.810Z`
- **Last updated:** 2026-07-12

## Body

# UAT Certificate of Recognition

Formal **Certificate of Recognition** for the **16 UAT volunteers** who helped validate the **Project Contractor of the Year Award** platform before its first public cycle.

> Design and wording approved by the core team. Use this page for issuance, volunteer messaging, and LinkedIn sharing guidance.

---

## Generated certificates (shared)

All **16 personalised HTML and PDF** files are published on OneDrive for Communications to attach or distribute:

**[PCOTY UAT Certificates — OneDrive folder](https://1drv.ms/u/c/ca096183b9780d9a/IQC1ByYgF9lAQqlsMNC9n7vxAVC4nKZSBrQyiSe6_D1eYSs?e=REmqcQ)**

| Folder on OneDrive | Contents |
| --- | --- |
| `html/` | One self-contained HTML file per volunteer (embedded logos + signature) |
| `pdf/` | Matching PDF — exported via Chromium headless (Playwright), landscape 11 × 8.5 in |

**Naming:** `PCOTY-UAT-Certificate-[First]-[Last]-2026-06.{html,pdf}`  
Example: `PCOTY-UAT-Certificate-Soban-Ahmed-2026-06.pdf`

For volunteer email, attach the **PDF** from the shared folder. HTML is available for spot-checks or re-export if needed.

---

## Certificate at a glance

| Item | Detail |
| --- | --- |
| **Title** | Certificate of Recognition |
| **Programme** | Project Contractor of the Year Award (PCOTY) |
| **Issuer** | Project Business Foundation (PBF) |
| **Signatory** | Oliver F. Lehmann — Founder, Project Business Foundation *(handwritten signature image)* |
| **Recipients** | 16 UAT volunteers ([UAT Volunteer List](https://ittd.atlassian.net/wiki/spaces/PBF/pages/214302721/UAT+Volunteer+List)) |
| **Date on certificate** | **June 2026** (batch) |
| **Format** | Landscape letter (11 × 8.5 in); PDF via browser/Chromium print |

### Wording on the certificate

**Presentation line**

> This certificate is awarded to

**Body (single paragraph)**

> Awarded for professional contribution to the pre-launch validation of the **Project Contractor of the Year Award** — an international programme of the Project Business Foundation. Your expert feedback and professional judgment helped **shape** the award platform and **influence** refinements ahead of its first public cycle.

---

## Source files & production

Repository path: `Marketing/UAT Certificate/`

| File | Purpose |
| --- | --- |
| `certificate-base.html` | Editable layout template (external asset paths) |
| `Certificate.html` | Standalone preview template (embedded images) |
| `generate-certificates.py` | Batch HTML + PDF generator |
| `volunteers.json` | First/last names (synced with [UAT Volunteer List](https://ittd.atlassian.net/wiki/spaces/PBF/pages/214302721/UAT+Volunteer+List)) |
| `logo.svg` | PCOTY award seal |
| `PBF-Logo_wide_dark_300.png` | PBF footer logo (dark, for white background) |
| `Oliver singature.png` | Signatory handwritten signature |

Generated output (also on [OneDrive](https://1drv.ms/u/c/ca096183b9780d9a/IQC1ByYgF9lAQqlsMNC9n7vxAVC4nKZSBrQyiSe6_D1eYSs?e=REmqcQ)):

| Folder | Contents |
| --- | --- |
| `generated/html/` | One HTML file per volunteer — **self-contained** (logos and signature embedded as data URIs) |
| `generated/pdf/` | Matching PDF (`PCOTY-UAT-Certificate-[First]-[Last]-2026-06.pdf`) |

### Regenerate locally (if needed)

```bash
cd "Marketing/UAT Certificate"
pip install playwright && python -m playwright install chromium   # one-time setup
python3 generate-certificates.py
```

Options: `--date "June 2026"`, `--html-only`, `--pdf-only`, `--pdf-engine playwright`, `--dry-run`.

**PDF engine (default order):** Playwright (Chromium headless) → Chrome/Chromium on PATH → LibreOffice. Use Playwright for print fidelity matching the HTML in a browser.

**Manual (single certificate):** open `Certificate.html` in Chrome/Edge → Print → Save as PDF (landscape, background graphics on).

**QA before send:** spell name correctly; date consistent across batch; award seal, PBF logo, and Oliver signature render; footer reads *Founder, Project Business Foundation*.

---

## Issuance checklist (Communications)

- [x] PDF generated for each of the 16 roster names
- [ ] Spot-check 2–3 certificates from [OneDrive](https://1drv.ms/u/c/ca096183b9780d9a/IQC1ByYgF9lAQqlsMNC9n7vxAVC4nKZSBrQyiSe6_D1eYSs?e=REmqcQ) (layout, spelling, logos, signature)
- [ ] Certificates distributed at **UAT celebration (21 Jul 2026)**
- [ ] Follow-up email sent with PDF attached — **same day or immediately after celebration** (approved template below)
- [x] Insert **PCOTY LinkedIn page URL** — https://www.linkedin.com/showcase/p-coty/
- [ ] Record send date in UAT comms log / roster notes if maintained

**Suggested sender:** Dr Kris Lea (Communications Head)  
**Copy (optional):** Peter Balogh (PM), Oliver F. Lehmann (signatory)

---

## Volunteer message — copy/paste

**Status:** ✅ Approved 2026-07-12  
**Send timing:** With certificate at **UAT celebration (21 Jul 2026)** or immediately after, with PDF attached.

**LinkedIn page:** https://www.linkedin.com/showcase/p-coty/

**Suggested subject:** `Your Certificate of Recognition — Project Contractor of the Year UAT`

---

Hi [First name],

Thank you again for your contribution to the **Project Contractor of the Year Award** User Acceptance Test. Your feedback helped us **shape** and **refine** the award platform ahead of its first public nomination cycle.

Attached is your **Certificate of Recognition** from the **Project Business Foundation**, signed by **Oliver F. Lehmann**, Founder of PBF.

We would be grateful if you could help us **spread the word** about the award on LinkedIn — you played a direct role in getting the platform ready, and your network is one of the best ways to reach project professionals who may nominate outstanding contractor–client work when nominations open on **1 September 2026**.

**Three ways to help (pick what works for you):**

**1 · Share your certificate on LinkedIn**  
Post the certificate (PDF, photo, or document upload) with a few lines about your UAT contribution. A ready-to-adapt draft is below — please use your own voice.

**2 · Add it to your profile**  
* **Profile → Add profile section → Licenses & certifications → Add**
* **Name:** Certificate of Recognition — Project Contractor of the Year UAT
* **Issuing organization:** Project Business Foundation
* **Issue date:** June 2026
* Attach the PDF or a clear photo of the certificate

**3 · Follow and amplify the PCOTY LinkedIn page**  
We are building the award's public presence on LinkedIn ahead of the nomination window. Please:

* **Follow** the Project Contractor of the Year page: https://www.linkedin.com/showcase/p-coty/
* **Like, comment, and repost** our upcoming awareness content — it helps the award reach contractors, clients, and assessors worldwide
* If you share your certificate, **mention or tag the PCOTY page** so your connections can follow the campaign

Sharing is entirely voluntary, but as early contributors you are uniquely placed to champion the programme — thank you for considering it.

**Suggested post — copy and adapt**

```
Pleased to receive a Certificate of Recognition from the Project Business Foundation for my contribution to the pre-launch validation of the Project Contractor of the Year Award.

Grateful for the opportunity to help shape the award platform ahead of its first public nomination cycle (opening 1 September 2026).

If you work in project contracting or project business, follow the PCOTY LinkedIn page — https://www.linkedin.com/showcase/p-coty/ — for updates as the campaign builds.

#ProjectContractorOfTheYear #ProjectBusiness #ProjectManagement #ProjectBusinessFoundation
```

Please do **not** share internal UAT URLs, test credentials, or other volunteers' details without consent.

With thanks,

Dr Kris Lea  
Communications Head  
Project Business Foundation — Contractor of the Year Award

---

**Attachment:** `PCOTY-UAT-Certificate-[First]-[Last]-2026-06.pdf` *(from [OneDrive folder](https://1drv.ms/u/c/ca096183b9780d9a/IQC1ByYgF9lAQqlsMNC9n7vxAVC4nKZSBrQyiSe6_D1eYSs?e=REmqcQ))*

---

## LinkedIn guidance (for volunteers)

Sharing your certificate is **encouraged** — it helps the award reach project professionals who may nominate outstanding contractor–client work. **Also follow the PCOTY LinkedIn page** and amplify upcoming campaign posts (see volunteer message above).

### Before you post

1. **Use a clear image** — export or photograph the certificate flat, well lit, full certificate visible (or attach PDF to a LinkedIn document post if you prefer).
2. **Keep wording aligned with the certificate** — you contributed to **pre-launch validation** of the PCOTY platform; you helped **shape** and **influence** refinements ahead of the first public cycle.
3. **Do not share** internal UAT URLs, test credentials, Discord invite links, or synthetic test data from UAT groups.
4. **Tag thoughtfully** — mention **Project Business Foundation** and **Project Contractor of the Year Award**; tag the PCOTY LinkedIn page when you post.

### What to emphasise (professional value)

- You were part of **pre-launch validation** of an **international award programme** (not generic “beta testing”).
- Your role was **professional contribution** — expert feedback and judgment that influenced a real award platform.
- The programme recognises **excellence in contractor–client project delivery** (Project Business / project contracting context).

### Suggested post — short version

Copy, adapt in your own voice, and replace [brackets]:

```
Pleased to receive a Certificate of Recognition from the Project Business Foundation for my contribution to the pre-launch validation of the Project Contractor of the Year Award.

Grateful for the opportunity to help shape the award platform ahead of its first public cycle — feedback that will support nominees, clients, and volunteer assessors worldwide.

#ProjectContractorOfTheYear #ProjectBusiness #ProjectManagement #ProjectBusinessFoundation
```

### Suggested post — fuller version

```
Honoured to receive a Certificate of Recognition from the Project Business Foundation (Oliver F. Lehmann, Founder).

I contributed to the pre-launch validation of the Project Contractor of the Year Award — an international programme recognising excellence in contractor–client project delivery. Through structured feedback and professional judgment, our UAT cohort helped shape and influence the award platform before nominations open to the public.

Congratulations to everyone who volunteered across the test groups — and thank you to the PBF core team for a well-run programme.

#ProjectContractorOfTheYear #ProjectBusiness #ProjectManagement #ProjectBusinessFoundation #QualityAssurance #Volunteering
```

### Hashtags (pick 3–5)

| Hashtag | Use when |
| --- | --- |
| `#ProjectContractorOfTheYear` | Primary — award brand |
| `#ProjectBusiness` | Project Business / contracting context |
| `#ProjectManagement` | Broader PM audience |
| `#ProjectBusinessFoundation` | Issuer / foundation |
| `#QualityAssurance` | If you want to stress validation contribution |
| `#Volunteering` | Optional — community angle |

Avoid hashtag stuffing; three to five is enough.

### Profile tips (optional)

- **Licenses & certifications → Add credential → Custom** — title: *Certificate of Recognition — Project Contractor of the Year UAT*; issuer: *Project Business Foundation*; attach PDF or link if you host the image elsewhere.
- **Featured section** — add the certificate image if you want it visible on your profile without a full post.

### What not to post

- Internal award URLs (`ittd.space/pbf-pcoty`, walkthrough NDA paths, admin accounts). Do not share `cert.project-business.org` — that is internal PBF project reporting only.
- Other volunteers’ names or group assignment details without their consent.
- Claims beyond the certificate wording (e.g. “official assessor” or “PBF staff”) unless accurate.

---

## Internal notes

- Layout and wording: `Marketing/UAT Certificate/certificate-base.html` — update Confluence if the template changes.
- Generated HTML is **self-contained**; PDFs should be attached for email (not HTML).
- UAT volunteers **may still nominate** in a future live cycle (see UAT orientation); the certificate records validation contribution only.
- For programme comms tone and PCOTY LinkedIn articles, see [Marketing LinkedIn: PCOTY articles](https://ittd.atlassian.net/wiki/spaces/PBF/pages/244875266/Marketing+LinkedIn+PCOTY+articles).

---

## Change log

| Date | Change |
| --- | --- |
| 2026-06-29 | Initial offline page — approved design, volunteer email, LinkedIn guidance |
| 2026-06-30 | Batch generated (16 HTML + PDF); Oliver signature; Playwright PDF export; full-name filenames; [OneDrive share link](https://1drv.ms/u/c/ca096183b9780d9a/IQC1ByYgF9lAQqlsMNC9n7vxAVC4nKZSBrQyiSe6_D1eYSs?e=REmqcQ) for Communications |
| 2026-06-30 | Comms owner/sender corrected to Dr Kris Lea (Communications Head) |
| 2026-06-30 | Published to Confluence (page 247136258) |
| 2026-07-12 | **Approved follow-up email** — LinkedIn share + follow PCOTY page; send at UAT celebration (21 Jul) |
| 2026-07-12 | LinkedIn Showcase URL — https://www.linkedin.com/showcase/p-coty/ |
