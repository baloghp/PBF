// Wix-hosted Custom Element (Web Component)
// Tag name to use in the Wix editor: overview-dashboard
//
// This element loads Chart.js from a CDN (jsDelivr).
//
// Page code should fetch data from backend and call:
//   $w('#<customElementId>').setKpis(kpiObject)

// Note: cards-only version (no Chart.js dependency).

class OverviewDashboard extends HTMLElement {
  constructor() {
    super();
    this._kpis = null;
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['kpis'];
  }

  connectedCallback() {
    this.renderShell();
    // Wix sometimes sets attributes before connectedCallback runs.
    // If KPIs are already present as an attribute, parse and render.
    const existingAttr = this.getAttribute('kpis');
    if (existingAttr) {
      try {
        const parsed = JSON.parse(decodeHtmlEntities(existingAttr));
        void this.setKpis(parsed);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[overview-dashboard] failed to parse initial kpis attribute', e);
      }
    } else {
      this.renderEmpty();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'kpis' || oldValue === newValue) return;
    // eslint-disable-next-line no-console
    console.log('[overview-dashboard] kpis attribute changed', { length: newValue ? newValue.length : 0 });
    try {
      const parsed = JSON.parse(decodeHtmlEntities(newValue));
      // Fire and forget; render() is async.
      void this.setKpis(parsed);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[overview-dashboard] failed to parse kpis attribute', e);
    }
  }

  /**
   * Called from page code (recommended).
   */
  async setKpis(kpis) {
    this._kpis = kpis;
    if (!this.shadowRoot || !this.shadowRoot.getElementById('tiles')) {
      this.renderShell();
    }
    await this.render();
  }

  renderShell() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family: Arial, sans-serif; }
        .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .tile { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; }
        .label { font-size: 12px; color: #666; margin-bottom: 6px; }
        .value { font-size: 22px; font-weight: 700; }
        .card { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; margin-top: 12px; }
        .hint { font-size: 12px; color: #666; margin-top: 8px; }
      </style>
      <div class="grid" id="tiles"></div>
      <div class="card" id="notes"></div>
      <div class="hint">Counts are live from collections.</div>
    `;
  }

  renderEmpty() {
    if (!this.shadowRoot) return;
    const tiles = this.shadowRoot.getElementById('tiles');
    const notes = this.shadowRoot.getElementById('notes');
    if (tiles) tiles.innerHTML = '';
    if (notes) notes.innerHTML = `<div class="label">Waiting for data…</div>`;
  }

  async render() {
    if (!this.shadowRoot) return;
    if (!this._kpis) return;

    const tiles = this.shadowRoot.getElementById('tiles');
    const notes = this.shadowRoot.getElementById('notes');

    const data = [
      { key: 'submittedNominations', label: 'Submitted nominations' },
      { key: 'needsCoachAssigned', label: 'Needs coach assigned' },
      { key: 'needsAssessorsAssigned', label: 'Needs assessors assigned' },
      { key: 'assessmentsSubmitted', label: 'Assessments submitted' },
      { key: 'customerFeedbackSubmitted', label: 'Customer feedback submitted' },
      { key: 'scoreRollupPending', label: 'Score rollup pending' },
      { key: 'missingCategoryCount', label: 'Missing category (coach action)' },
    ];

    tiles.innerHTML = data.map(d => `
      <div class="tile">
        <div class="label">${d.label}</div>
        <div class="value">${Number(this._kpis[d.key] ?? 0)}</div>
      </div>
    `).join('');

    notes.innerHTML = `
      <div class="label">Next actions</div>
      <ul>
        <li>Assign coaches/assessors where missing.</li>
        <li>Ask coaches to set category for nominations missing one.</li>
        <li>Ask coaches to calculate scores for pending nominations.</li>
      </ul>
    `;

    // Cards only (no chart)
  }
}

customElements.define('overview-dashboard', OverviewDashboard);

function decodeHtmlEntities(s) {
  if (typeof s !== 'string') return s;
  // Minimal decoding for common Wix attribute escaping.
  return s
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&amp;', '&');
}

