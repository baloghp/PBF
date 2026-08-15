#!/usr/bin/env python3
"""Export PCoTY audience guides from markdown to branded A4 PDFs."""

from __future__ import annotations

import argparse
import base64
import mimetypes
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[1]
CSS_PATH = SCRIPT_DIR / "pdf-style.css"
DEFAULT_OUTPUT_DIR = SCRIPT_DIR / "pdf"
LOGO_PATH = REPO_ROOT / "Marketing" / "logo" / "Logo_transparent.png"

GUIDES = (
    {
        "key": "assessment",
        "source": SCRIPT_DIR / "Contractor-of-the-Year-Assessment-Guide-2026.md",
        "pdf_name": "PCoTY-2027-Assessment-Guide.pdf",
        "footer": "Assessment Guide",
    },
    {
        "key": "customer",
        "source": SCRIPT_DIR / "Contractor-of-the-Year-Customer-Guide-2026.md",
        "pdf_name": "PCoTY-2027-Customer-Guide.pdf",
        "footer": "Customer Guide",
    },
    {
        "key": "nominee",
        "source": SCRIPT_DIR / "Contractor-of-the-Year-Nominee-Guide-2026.md",
        "pdf_name": "PCoTY-2027-Nominee-Guide.pdf",
        "footer": "Nominee Guide",
    },
)

CHROME_CANDIDATES = (
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "chrome",
)

IMG_SRC_RE = re.compile(r'(<img\b[^>]*\bsrc=")([^"]+)(")', re.IGNORECASE)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")


def find_weasyprint() -> bool:
    try:
        import weasyprint  # noqa: F401
    except ImportError:
        return False
    return True


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
    for candidate in ("soffice", "libreoffice"):
        if shutil.which(candidate):
            return candidate
    return None


def resolve_engine(requested: str) -> str:
    if requested == "weasyprint":
        if not find_weasyprint():
            raise RuntimeError("WeasyPrint is not installed. Run: pip install weasyprint")
        return "weasyprint"
    if requested == "playwright":
        if not find_playwright():
            raise RuntimeError(
                "Playwright is not installed. Run: pip install playwright && "
                "python -m playwright install chromium"
            )
        return "playwright"
    if requested == "chrome":
        chrome = find_chrome()
        if chrome is None:
            raise RuntimeError("No Chrome/Chromium binary found on PATH.")
        return chrome
    if requested == "libreoffice":
        soffice = find_libreoffice()
        if soffice is None:
            raise RuntimeError("No LibreOffice binary found on PATH.")
        return soffice
    if find_weasyprint():
        return "weasyprint"
    if find_playwright():
        return "playwright"
    chrome = find_chrome()
    if chrome:
        return chrome
    soffice = find_libreoffice()
    if soffice:
        return soffice
    raise RuntimeError(
        "No PDF engine found. Install WeasyPrint (recommended):\n"
        "  pip install weasyprint markdown\n"
        "Or Playwright + Chromium, Chrome, or LibreOffice."
    )


def engine_label(engine: str) -> str:
    if engine == "weasyprint":
        return "WeasyPrint"
    if engine == "playwright":
        return "Playwright (Chromium headless)"
    if engine in CHROME_CANDIDATES:
        return f"Chrome/Chromium ({engine})"
    return f"LibreOffice ({engine})"


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def rewrite_images(html: str, source_dir: Path) -> str:
    def replace(match: re.Match[str]) -> str:
        prefix, src, suffix = match.groups()
        if src.startswith(("data:", "http://", "https://")):
            return match.group(0)
        path = (source_dir / src).resolve()
        if not path.is_file():
            print(f"Warning: missing image {path}", file=sys.stderr)
            return match.group(0)
        return f"{prefix}{data_uri(path)}{suffix}"

    return IMG_SRC_RE.sub(replace, html)


def markdown_to_body(text: str) -> str:
    try:
        import markdown
    except ImportError as exc:
        raise RuntimeError(
            "The markdown package is required. Run: pip install markdown"
        ) from exc

    converter = markdown.Markdown(
        extensions=["tables", "sane_lists", "toc"],
        extension_configs={"toc": {"permalink": False, "toc_depth": 3}},
    )
    return converter.convert(text)


def extract_title(body_html: str, fallback: str) -> str:
    match = H1_RE.search(body_html)
    if not match:
        return fallback
    return TAG_RE.sub("", match.group(1)).strip() or fallback


def wrap_html(title: str, body: str, css: str, footer_label: str) -> str:
    safe_label = footer_label.replace("\\", "\\\\").replace('"', '\\"')
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
html {{ string-set: guide-label "{safe_label}"; }}
{css}
  </style>
</head>
<body>
  <article class="guide">
{body}
  </article>
</body>
</html>
"""


def footer_template(label: str) -> str:
    return (
        '<div style="width:100%; font-size:8.5px; color:#4A4A4A; '
        'font-family:Georgia, serif; padding:0 16mm; '
        'display:flex; justify-content:space-between; align-items:center;">'
        "<span>Project Business Foundation</span>"
        f"<span>PCoTY 2027 - {label}</span>"
        '<span><span class="pageNumber"></span> / '
        '<span class="totalPages"></span></span>'
        "</div>"
    )


def html_to_pdf_weasyprint(html: str, pdf_path: Path, base_url: Path) -> None:
    from weasyprint import HTML

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html, base_url=base_url.as_uri()).write_pdf(target=pdf_path)
    if not pdf_path.exists():
        raise RuntimeError(f"WeasyPrint did not create {pdf_path}")


def html_to_pdf_playwright(html_path: Path, pdf_path: Path, footer_label: str) -> None:
    from playwright.sync_api import sync_playwright

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    uri = html_path.resolve().as_uri()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 794, "height": 1123})
        page.goto(uri, wait_until="networkidle", timeout=60000)
        page.evaluate("() => document.fonts.ready")
        page.emulate_media(media="print")
        page.pdf(
            path=str(pdf_path),
            format="A4",
            print_background=True,
            prefer_css_page_size=True,
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=footer_template(footer_label),
            margin={
                "top": "14mm",
                "bottom": "16mm",
                "left": "16mm",
                "right": "16mm",
            },
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
        "--virtual-time-budget=15000",
        f"--print-to-pdf={pdf_path}",
        html_path.resolve().as_uri(),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0 or not pdf_path.exists():
        raise RuntimeError(
            "Chrome PDF generation failed.\n"
            f"Command: {' '.join(command)}\n"
            f"stdout: {result.stdout.strip()}\n"
            f"stderr: {result.stderr.strip()}"
        )


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


def selected_guides(keys: list[str] | None) -> list[dict[str, object]]:
    if not keys:
        return list(GUIDES)
    wanted = {key.lower() for key in keys}
    known = {item["key"] for item in GUIDES}
    unknown = wanted - known
    if unknown:
        raise RuntimeError(
            "Unknown guide(s): "
            + ", ".join(sorted(unknown))
            + ". Choose from: "
            + ", ".join(item["key"] for item in GUIDES)
        )
    return [item for item in GUIDES if item["key"] in wanted]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export PCoTY audience guides to branded A4 PDFs."
    )
    parser.add_argument(
        "--guide",
        action="append",
        dest="guides",
        metavar="NAME",
        help="Export only this guide (assessment, customer, nominee). Repeatable.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"PDF output directory (default: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--pdf-engine",
        choices=("auto", "weasyprint", "playwright", "chrome", "libreoffice"),
        default="auto",
        help="PDF renderer (default: auto — WeasyPrint, then Playwright, Chrome, LibreOffice)",
    )
    parser.add_argument(
        "--keep-html",
        action="store_true",
        help="Write intermediate HTML next to each PDF",
    )
    parser.add_argument(
        "--html-only",
        action="store_true",
        help="Write HTML and skip PDF generation",
    )
    return parser.parse_args()


def export_one(
    guide: dict[str, object],
    css: str,
    output_dir: Path,
    engine: str | None,
    keep_html: bool,
    html_only: bool,
) -> Path:
    source = Path(str(guide["source"]))
    if not source.is_file():
        raise RuntimeError(f"Missing source: {source}")

    footer_label = str(guide["footer"])
    body = rewrite_images(markdown_to_body(source.read_text(encoding="utf-8")), source.parent)
    title = extract_title(body, source.stem.replace("-", " "))
    html = wrap_html(title, body, css, footer_label)

    html_path = output_dir / f"{Path(str(guide['pdf_name'])).stem}.html"
    pdf_path = output_dir / str(guide["pdf_name"])

    if keep_html or html_only:
        output_dir.mkdir(parents=True, exist_ok=True)
        html_path.write_text(html, encoding="utf-8")
        print(f"HTML  {html_path}")
        if html_only:
            return html_path

    if engine is None:
        raise RuntimeError("PDF engine was not resolved.")

    if engine == "weasyprint":
        html_to_pdf_weasyprint(html, pdf_path, source.parent)
        print(f"PDF   {pdf_path}")
        return pdf_path

    if keep_html:
        render_html = html_path
        cleanup = None
    else:
        handle = tempfile.NamedTemporaryFile(
            suffix=".html", prefix="pcoty-guide-", delete=False
        )
        handle.write(html.encode("utf-8"))
        handle.close()
        render_html = Path(handle.name)
        cleanup = render_html

    try:
        if engine == "playwright":
            html_to_pdf_playwright(render_html, pdf_path, footer_label)
        elif engine in CHROME_CANDIDATES:
            html_to_pdf_chrome(engine, render_html, pdf_path)
        else:
            html_to_pdf_libreoffice(engine, render_html, pdf_path)
    finally:
        if cleanup is not None:
            cleanup.unlink(missing_ok=True)

    print(f"PDF   {pdf_path}")
    return pdf_path


def main() -> int:
    args = parse_args()
    try:
        guides = selected_guides(args.guides)
        css = CSS_PATH.read_text(encoding="utf-8")
        engine = None if args.html_only else resolve_engine(args.pdf_engine)
    except (OSError, RuntimeError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if not LOGO_PATH.is_file():
        print(f"Warning: logo not found at {LOGO_PATH}", file=sys.stderr)

    if engine:
        print(f"PDF engine: {engine_label(engine)}")
    print(f"Output: {args.output_dir}")

    for guide in guides:
        try:
            export_one(
                guide,
                css,
                args.output_dir,
                engine,
                args.keep_html,
                args.html_only,
            )
        except RuntimeError as exc:
            print(str(exc), file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
