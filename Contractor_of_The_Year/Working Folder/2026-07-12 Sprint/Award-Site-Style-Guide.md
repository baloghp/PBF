# Award site style guide — ittd.space/pbf-pcoty

**Source:** Live page [ittd.space/pbf-pcoty](https://www.ittd.space/pbf-pcoty) · snapshot 12 Jul 2026  
**HTML capture:** `_site-snapshot-pbf-pcoty.html` (same folder)  
**Logo (separate):** [Brand-Assets-Table.md](Brand-Assets-Table.md)

Use this for LinkedIn, banners, Canva, and any creative that should **match the Wix award page** — not the seal SVG alone.

---

## Wix theme fonts (`font_0` … `font_9`)

| Class | Family | Size / line | Typical use on page |
| --- | --- | --- | --- |
| `font_0` | **Cinzel**, serif | 40px / 1.4 | Section H2 — e.g. “What We're Looking For” |
| `font_2` | **Bree Thin Oblique**, sans | 40px / 1.4 | Page-title style headings |
| `font_3` | Cinzel | 24px / 1.4 | Heading XL |
| `font_4` | Cinzel | 20px / 1.4 | Heading L |
| `font_5` | Cinzel | 18px | Heading M |
| `font_6` | Cinzel **bold** | 14px / 1.4 | Countdown line (`#txtCountdown`) |
| `font_7` | **Caudex**, serif | 22px / 1.4 | Body large (theme default) |
| `font_8` | Caudex | 18px / 1.4 | Body / countdown subtitle |
| `font_9` | Caudex | 16px / 1.4 | Body small |
| `font_1` | **DIN Next Light**, sans | 16px / 1.4 | Site menu |

**Section-specific overrides (inline on page):**

| Element | Font | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Hero tagline “Celebrating Excellence…” | **Barlow** | 30px | 300 | `#5E5F68` |
| Timeline dates | **Playfair Display**, serif | 23px | normal | `#282626` |
| Timeline milestone titles | **Avenir Heavy** | 23px | normal | `#282626` |
| Category “Small” | **Lulo Clean Bold** | 18px | — | `color_11` → `#48180D` |
| Category “Medium” / “Large” | Lulo Clean Bold | 18px | — | `#4BD1A0` |
| Supporting body copy | **Avenir Light** | 16px | normal | `#282626` |
| Primary CTA label | **Avenir Light** | 15px | normal | `#FFFFFF` |

---

## Colour palette (Wix `color_*` → hex)

| Token | Hex | Role on live site |
| --- | --- | --- |
| `color_11` | `#48180D` | Page background, dark burgundy |
| `color_12` | `#902F1A` | Hero / section image overlay |
| `color_13` | `#F7F4F4` | Warm off-white panels |
| `color_14` | `#E59887` | Light salmon accent |
| `color_15` | `#F2BCB0` | Peach text on dark (`font_7`/`font_8` default) |
| `color_5` | `#282936` | Dark charcoal (sections, hover borders) |
| `color_8` | `#202B3E` | Navy body text |
| — | `#282626` | Timeline text, CTA button fill |
| — | `#5E5F68` | Hero tagline grey |
| — | `#4BD1A0` | Category accent (Medium / Large) |
| — | `#8B1E2D` | Inline hero seal (matches logo SVG) |
| — | `#4A4A4A` | Seal grey lettering (inline SVG) |

**Overlays (not flat gradients):** hero `#comp-ml0oa0ey` uses `rgb(color_12)` overlay on skyscraper photo; several sections use `rgba(color_12, 0.8)` on background images.

---

## Key UI patterns

| Component | Style |
| --- | --- |
| **Countdown box** | Dark panel (`~#14151B`); `font_6` 14px countdown; `font_8` 18px “Nominations open …” |
| **Primary CTA** (“Submit Your Nomination”) | Fill `#282626`, label `#FFFFFF` Avenir 15px, letter-spacing 0.05em · hover: white bg, `#282936` text/border |
| **Disabled CTA** | Bg `#E2E2E2`, label `#8F8F8F` |
| **Section width** | Content ~980px centred |
| **Hero image** | Full-width photo + burgundy tint (`color_12`) |

---

## For external comms (LinkedIn, email, Canva)

| Use | Match to |
| --- | --- |
| Headlines | Cinzel 40px (or Bree Thin Oblique for hero-style titles) |
| Body | Caudex 18px or Avenir Light 16px |
| Accent burgundy | `#902F1A` (site) or `#8B1E2D` (logo / seal) — both appear on live page |
| Dark button | `#282626` bg, white label |
| Mint highlight | `#4BD1A0` (categories only — use sparingly) |
| Banner gradient | `#8B1E2D` → `#6B1D28` (aligns with seal; see [Brand-Assets-Table.md](Brand-Assets-Table.md)) |

**Marketing assets:** [PCoTY Marketing Drive](https://drive.google.com/drive/folders/1FAjNORg58tL2NT3ArsaFwwrLV9isTTAM?usp=sharing)
