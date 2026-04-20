// Wix-hosted Custom Element (Web Component)
// Tag name to use in the Wix editor: customer-feedback-dashboard
//
// Page code sets attribute:
//   $w('#customerFeedbackDash').setAttribute('kpis', JSON.stringify(payload))

class CustomerFeedbackDashboard extends HTMLElement {
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
    const existingAttr = this.getAttribute('kpis');
    if (existingAttr) {
      try {
        const parsed = JSON.parse(decodeHtmlEntities(existingAttr));
        void this.setKpis(parsed);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[customer-feedback-dashboard] failed to parse initial kpis attribute', e);
      }
    } else {
      this.renderEmpty();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'kpis' || oldValue === newValue) return;
    try {
      const parsed = JSON.parse(decodeHtmlEntities(newValue));
      void this.setKpis(parsed);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[customer-feedback-dashboard] failed to parse kpis attribute', e);
    }
  }

  async setKpis(kpis) {
    this._kpis = kpis;
    if (!this.shadowRoot || !this.shadowRoot.getElementById('tiles')) {
      this.renderShell();
    }
    this.render();
  }

  renderShell() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family: Arial, sans-serif; min-height: 160px; padding: 4px; box-sizing: border-box; }
        .grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .tile { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; }
        .label { font-size: 12px; color: #666; margin-bottom: 6px; }
        .value { font-size: 22px; font-weight: 700; }
        .card { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; margin-top: 12px; }
        .hint { font-size: 12px; color: #666; margin-top: 8px; }
        table { width:100%; border-collapse: collapse; }
        th, td { border-bottom: 1px solid #eee; padding: 8px; text-align:left; font-size: 12px; vertical-align: top; }
        th { color:#555; font-weight: 600; }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
      </style>
      <div class="grid" id="tiles"></div>
      <div class="card">
        <div class="label">Stale drafts (older than <span id="days"></span> days)</div>
        <div id="stale"></div>
      </div>
      <div class="hint">Use this list to chase customers to complete their evaluation.</div>
    `;
  }

  renderEmpty() {
    if (!this.shadowRoot) return;
    const tiles = this.shadowRoot.getElementById('tiles');
    if (tiles) tiles.innerHTML = `<div class="tile"><div class="label">Waiting for data…</div><div class="value">—</div></div>`;
  }

  render() {
    if (!this.shadowRoot || !this._kpis) return;
    const tiles = this.shadowRoot.getElementById('tiles');
    const stale = this.shadowRoot.getElementById('stale');
    const daysEl = this.shadowRoot.getElementById('days');

    if (daysEl) daysEl.textContent = String(this._kpis.staleDays ?? '');

    const tileData = [
      { key: 'customerFeedbackSubmitted', label: 'Customer feedback submitted' },
      { key: 'customerFeedbackDraft', label: 'Customer feedback draft' },
    ];

    tiles.innerHTML = tileData.map(d => `
      <div class="tile">
        <div class="label">${d.label}</div>
        <div class="value">${Number(this._kpis[d.key] ?? 0)}</div>
      </div>
    `).join('');

    const rows = Array.isArray(this._kpis.staleDrafts) ? this._kpis.staleDrafts : [];
    if (rows.length === 0) {
      stale.innerHTML = `<div class="label">No stale drafts found.</div>`;
      return;
    }

    stale.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Nominee</th>
            <th>Customer</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>
                <div><strong>${escapeHtml(r.ownerName || '')}</strong></div>
                <div><code>${escapeHtml(r.ownerId || '')}</code></div>
              </td>
              <td>
                <div><strong>${escapeHtml(r.customerOrganization || '')}</strong></div>
                <div>${escapeHtml(r.contactName || '')}</div>
                <div><code>${escapeHtml(r.contactEmail || '')}</code></div>
              </td>
              <td>
                <div>${escapeHtml(String(r.createdDate || ''))}</div>
                <div><code>${escapeHtml(r.id || '')}</code></div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

customElements.define('customer-feedback-dashboard', CustomerFeedbackDashboard);

function decodeHtmlEntities(s) {
  if (typeof s !== 'string') return s;
  return s
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&amp;', '&');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

