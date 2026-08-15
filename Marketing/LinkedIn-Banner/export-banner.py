#!/usr/bin/env python3
"""Export PCOTY LinkedIn Showcase cover (1128×191 PNG) via Playwright."""

from pathlib import Path

BANNER_HTML = Path(__file__).resolve().parent / "banner.html"
OUTPUT = Path(__file__).resolve().parent / "PCOTY-LinkedIn-Cover-1128x191.png"
WIDTH, HEIGHT = 1128, 191


def main() -> None:
    from playwright.sync_api import sync_playwright

    url = BANNER_HTML.as_uri() + "?export=1"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.goto(url)
        page.locator(".banner").screenshot(path=str(OUTPUT), type="png")
        browser.close()
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
