# Project Contractor of the Year (PCoTY) Award 2027: audience guides

Working markdown for the three PCoTY 2027 audience guides. Word exports in this folder are the previous layout; these `.md` files are the source to edit.

| Guide | Audience | File |
| --- | --- | --- |
| [Nominee Guide](Contractor-of-the-Year-Nominee-Guide-2026.md) | Nominees preparing a submission | `Contractor-of-the-Year-Nominee-Guide-2026.md` |
| [Customer Guide](Contractor-of-the-Year-Customer-Guide-2026.md) | Client representatives completing the customer evaluation | `Contractor-of-the-Year-Customer-Guide-2026.md` |
| [Assessment Guide](Contractor-of-the-Year-Assessment-Guide-2026.md) | Stage 1 assessors and Stage 2 judges | `Contractor-of-the-Year-Assessment-Guide-2026.md` |

Platform: [ittd.space/pbf-pcoty](https://www.ittd.space/pbf-pcoty)

Each guide has the award seal at the top (`Marketing/logo/Logo_transparent.png`) for PDF export. The SVG master is `Marketing/logo/logo (1).svg`; PNG is used in the markdown because curved SVG text often drops out in print.

## PDF export

From this folder:

```bash
python3 export-pdf.py
```

Writes A4 PDFs to `pdf/`:

- `PCoTY-2027-Assessment-Guide.pdf`
- `PCoTY-2027-Customer-Guide.pdf`
- `PCoTY-2027-Nominee-Guide.pdf`

Useful flags: `--guide assessment` (repeatable), `--keep-html`, `--html-only`, `--output-dir PATH`.

One-time: `pip install markdown weasyprint`. Print stylesheet: `pdf-style.css` (Cinzel + Source Sans 3, seal burgundy).

## What was corrected from the Word exports

The Word files were converted, then aligned to the live PCoTY 2027 cycle:

- **No Nominee Coach.** Intake is automated pre-screen plus program support ([DR-002](../Program-Plan/Decisions/DR-002-Drop-Nominee-Coach.md)).
- **Assessors and judges score 0-5**, not 0-10. Customer evaluation stays **0-10 with weights** (max 550).
- **Customer form** is a unique link emailed to the client representative. The nominee does not fill it in or upload it.
- **Narrative word counts are ceilings**, not targets.
- **Evidence list** matches the [Submission Package](../../Confluence/Project-Contractor-Of-The-Year-Award/98598913%20-%20Submission%20Package.md) (contract matrix, interface RACI, people-development metric, code of conduct, integrity plan).
