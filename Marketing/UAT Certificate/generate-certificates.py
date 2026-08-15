#!/usr/bin/env python3
"""Generate personalised UAT Certificate of Recognition HTML and PDF files."""

from __future__ import annotations

import argparse
import base64
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
BASE_TEMPLATE_PATH = SCRIPT_DIR / "certificate-base.html"
TEMPLATE_PATH = SCRIPT_DIR / "Certificate.html"
VOLUNTEERS_PATH = SCRIPT_DIR / "volunteers.json"
DEFAULT_OUTPUT_DIR = SCRIPT_DIR / "generated"
DEFAULT_DATE = "June 2026"
DEFAULT_DATE_SLUG = "2026-06"

ASSET_FILES = (
    ("logo.svg", "image/svg+xml"),
    ("PBF-Logo_wide_dark_300.png", "image/png"),
    ("Oliver singature.png", "image/png"),
)

CHROME_CANDIDATES = (
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "chrome",
)

LIBREOFFICE_CANDIDATES = (
    "libreoffice",
    "soffice",
)

PDF_WIDTH = "11in"
PDF_HEIGHT = "8.5in"
PDF_MARGINS = {"top": "0in", "right": "0in", "bottom": "0in", "left": "0in"}


def load_volunteers(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8") as handle:
        volunteers = json.load(handle)
    if not isinstance(volunteers, list) or not volunteers:
        raise ValueError(f"No volunteers found in {path}")
    for entry in volunteers:
        if "first" not in entry or "last" not in entry:
            raise ValueError(f"Each volunteer needs first and last name: {entry}")
    return sorted(volunteers, key=lambda item: (item["last"].lower(), item["first"].lower()))


def slugify_name_part(name: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9]+", "-", name.strip()).strip("-")
    return slug or "Volunteer"


def certificate_basename(first_name: str, last_name: str, date_slug: str) -> str:
    name_slug = "-".join(
        part for part in (slugify_name_part(first_name), slugify_name_part(last_name)) if part
    )
    return f"PCOTY-UAT-Certificate-{name_slug}-{date_slug}"


def asset_data_uri(filename: str, mime: str) -> str:
    path = SCRIPT_DIR / filename
    if not path.is_file():
        raise FileNotFoundError(f"Missing certificate asset: {path}")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def embed_assets(html: str) -> str:
    """Inline logos so HTML works via file:// without sibling asset files."""
    for filename, mime in ASSET_FILES:
        uri = asset_data_uri(filename, mime)
        html = html.replace(f'src="{filename}"', f'src="{uri}"')
    return html


def load_base_template(path: Path) -> str:
    if not path.is_file():
        raise FileNotFoundError(f"Missing template: {path}")
    return path.read_text(encoding="utf-8")


def write_standalone_template(path: Path) -> None:
    path.write_text(embed_assets(load_base_template(BASE_TEMPLATE_PATH)), encoding="utf-8")


def prepare_html(template: str, full_name: str, grant_date: str) -> str:
    html = template.replace("Volunteer Name", full_name)
    html = html.replace("June 2026", grant_date)
    html = html.replace('contenteditable="true"', "")
    html = html.replace(
        "<title>Certificate of Recognition - PBF</title>",
        f"<title>Certificate of Recognition - {full_name}</title>",
    )

    if "@page" not in html:
        html = html.replace(
            "        @media print {",
            "        @page {\n"
            "            size: 11in 8.5in;\n"
            "            margin: 0;\n"
            "        }\n\n"
            "        @media print {",
        )

    return embed_assets(html)


def prepare_html_from_base(full_name: str, grant_date: str) -> str:
    return prepare_html(load_base_template(BASE_TEMPLATE_PATH), full_name, grant_date)


def find_playwright() -> bool:
    try:
        import playwright  # noqa: F401
    except ImportError:
        return False
    return True


def find_chrome() -> str | None:
    for candidate in CHROME_CANDIDATES:
        if shutil.which(candidate):
            return candidate
    return None


def find_libreoffice() -> str | None:
    for candidate in LIBREOFFICE_CANDIDATES:
        if shutil.which(candidate):
            return candidate
    return None


def html_to_pdf_playwright(html_path: Path, pdf_path: Path) -> None:
    from playwright.sync_api import sync_playwright

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    uri = html_path.resolve().as_uri()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1056, "height": 816})
        page.goto(uri, wait_until="load")
        page.emulate_media(media="print")
        page.pdf(
            path=str(pdf_path),
            width=PDF_WIDTH,
            height=PDF_HEIGHT,
            print_background=True,
            prefer_css_page_size=True,
            margin=PDF_MARGINS,
        )
        browser.close()
    if not pdf_path.exists():
        raise RuntimeError(f"Playwright did not create {pdf_path}")


def html_to_pdf_chrome(chrome: str, html_path: Path, pdf_path: Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=10000",
        f"--print-to-pdf={pdf_path}",
        html_path.resolve().as_uri(),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(
            "Chrome PDF generation failed.\n"
            f"Command: {' '.join(command)}\n"
            f"stdout: {result.stdout.strip()}\n"
            f"stderr: {result.stderr.strip()}"
        )
    if not pdf_path.exists():
        raise RuntimeError(f"Chrome did not create {pdf_path}")


def html_to_pdf_libreoffice(soffice: str, html_path: Path, pdf_path: Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        soffice,
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        str(pdf_path.parent),
        str(html_path.resolve()),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(
            "LibreOffice PDF generation failed.\n"
            f"Command: {' '.join(command)}\n"
            f"stdout: {result.stdout.strip()}\n"
            f"stderr: {result.stderr.strip()}"
        )
    produced = pdf_path.parent / f"{html_path.stem}.pdf"
    if produced != pdf_path and produced.exists():
        produced.replace(pdf_path)
    if not pdf_path.exists():
        raise RuntimeError(f"LibreOffice did not create {pdf_path}")


def html_to_pdf(engine: str, html_path: Path, pdf_path: Path) -> None:
    if engine == "playwright":
        html_to_pdf_playwright(html_path, pdf_path)
    elif engine in CHROME_CANDIDATES:
        html_to_pdf_chrome(engine, html_path, pdf_path)
    else:
        html_to_pdf_libreoffice(engine, html_path, pdf_path)


def resolve_pdf_engine(requested: str) -> str:
    if requested != "auto":
        if requested == "playwright" and not find_playwright():
            raise RuntimeError(
                "Playwright is not installed. Run: pip install playwright && "
                "python -m playwright install chromium"
            )
        if requested == "chrome" and find_chrome() is None:
            raise RuntimeError("No Chrome/Chromium binary found on PATH.")
        if requested == "libreoffice" and find_libreoffice() is None:
            raise RuntimeError("No LibreOffice binary found on PATH.")
        if requested == "playwright":
            return "playwright"
        if requested == "chrome":
            return find_chrome() or ""
        return find_libreoffice() or ""

    if find_playwright():
        return "playwright"
    chrome = find_chrome()
    if chrome:
        return chrome
    libreoffice = find_libreoffice()
    if libreoffice:
        return libreoffice
    return ""


def pdf_engine_label(engine: str) -> str:
    if engine == "playwright":
        return "Playwright (Chromium headless)"
    if engine in CHROME_CANDIDATES:
        return f"Chrome/Chromium ({engine})"
    return f"LibreOffice ({engine})"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate UAT certificate HTML and PDF files for all volunteers."
    )
    parser.add_argument(
        "--volunteers",
        type=Path,
        default=VOLUNTEERS_PATH,
        help="JSON file with first/last names (default: volunteers.json)",
    )
    parser.add_argument(
        "--template",
        type=Path,
        default=BASE_TEMPLATE_PATH,
        help="Editable HTML template with external logo paths (default: certificate-base.html)",
    )
    parser.add_argument(
        "--refresh-standalone",
        action="store_true",
        help="Rebuild Certificate.html with embedded logos (for browser file:// open)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Output root directory (default: generated/)",
    )
    parser.add_argument(
        "--date",
        default=DEFAULT_DATE,
        help='Grant date shown on certificate (default: "June 2026")',
    )
    parser.add_argument(
        "--date-slug",
        default=DEFAULT_DATE_SLUG,
        help='Filename date suffix (default: "2026-06")',
    )
    parser.add_argument(
        "--html-only",
        action="store_true",
        help="Generate HTML files only",
    )
    parser.add_argument(
        "--pdf-only",
        action="store_true",
        help="Generate PDF files only (HTML must already exist or be regenerated)",
    )
    parser.add_argument(
        "--pdf-engine",
        choices=("auto", "playwright", "chrome", "libreoffice"),
        default="auto",
        help="PDF renderer (default: auto — Playwright, then Chrome, then LibreOffice)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned outputs without writing files",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.refresh_standalone:
        if args.dry_run:
            print(f"Would write embedded template: {TEMPLATE_PATH}")
            return 0
        write_standalone_template(TEMPLATE_PATH)
        print(f"Updated standalone template: {TEMPLATE_PATH}")
        return 0

    if args.html_only and args.pdf_only:
        print("Choose at most one of --html-only and --pdf-only.", file=sys.stderr)
        return 1

    volunteers = load_volunteers(args.volunteers)
    html_dir = args.output_dir / "html"
    pdf_dir = args.output_dir / "pdf"

    if not args.dry_run:
        write_standalone_template(TEMPLATE_PATH)
        print(f"Updated standalone template: {TEMPLATE_PATH}")

    pdf_engine: str | None = None
    if not args.html_only and not args.dry_run:
        try:
            pdf_engine = resolve_pdf_engine(args.pdf_engine)
        except RuntimeError as exc:
            print(str(exc), file=sys.stderr)
            return 1
        if not pdf_engine:
            print(
                "No PDF engine found. Install Playwright (recommended):\n"
                "  pip install playwright && python -m playwright install chromium\n"
                "Or install Chrome/Chromium, or run with --html-only.",
                file=sys.stderr,
            )
            return 1
        print(f"PDF engine: {pdf_engine_label(pdf_engine)}")

    print(f"Volunteers: {len(volunteers)}")
    print(f"Output: {args.output_dir}")

    for volunteer in volunteers:
        full_name = f"{volunteer['first']} {volunteer['last']}"
        basename = certificate_basename(volunteer["first"], volunteer["last"], args.date_slug)
        html_path = html_dir / f"{basename}.html"
        pdf_path = pdf_dir / f"{basename}.pdf"

        print(f"  {full_name} -> {basename}")

        if args.dry_run:
            continue

        if not args.pdf_only:
            html_dir.mkdir(parents=True, exist_ok=True)
            html_path.write_text(
                prepare_html_from_base(full_name, args.date),
                encoding="utf-8",
            )

        if not args.html_only:
            if not html_path.exists():
                html_path.write_text(
                    prepare_html_from_base(full_name, args.date),
                    encoding="utf-8",
                )
            html_to_pdf(pdf_engine, html_path, pdf_path)

    if args.dry_run:
        print("Dry run complete — no files written.")
    else:
        print("Done.")
        if not args.pdf_only:
            print(f"HTML: {html_dir}")
        if not args.html_only:
            print(f"PDF:  {pdf_dir}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
