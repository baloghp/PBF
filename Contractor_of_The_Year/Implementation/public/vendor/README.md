# Vendor JS (local bundles)

This folder is for JS bundles you want to host **inside Wix** (no CDN).

## Chart.js single-file bundle

Wix Custom Elements can load Chart.js from a local file, e.g.:

- `public/vendor/chart.umd.min.js`

### How to get the file

1. Download the **UMD** build from the Chart.js release assets (recommended), or install via npm in a separate environment and copy the built file.
2. Place it at:
   - `public/vendor/chart.umd.min.js`

### Why UMD?

The provided custom element (`public/custom-elements/overview-dashboard.js`) loads Chart.js via a `<script>` tag and expects the global `window.Chart`.

