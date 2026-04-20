// Wix-hosted Custom Element (Web Component)
// Tag name to use in the Wix editor: assessments-dashboard
//
// Page code sets attribute:
//   $w('#assessmentsDash').setAttribute('kpis', JSON.stringify(payload))

class AssessmentsDashboard extends HTMLElement {
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
        console.error('[assessments-dashboard] failed to parse initial kpis attribute', e);
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
      console.error('[assessments-dashboard] failed to parse kpis attribute', e);
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
        <div class="label">Assigned but missing assessment record (top 50)</div>
        <div id="missing"></div>
      </div>
      <div class="hint">“Missing” means the nomination has an assessor assigned but no Assessments row exists for that (nominationId, assessorId).</div>
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
    const missing = this.shadowRoot.getElementById('missing');

    const tileData = [
      { key: 'assessmentsSubmitted', label: 'Assessments submitted' },
      { key: 'assessmentsDraft', label: 'Assessments draft' },
    ];

    tiles.innerHTML = tileData.map(d => `
      <div class="tile">
        <div class="label">${d.label}</div>
        <div class="value">${Number(this._kpis[d.key] ?? 0)}</div>
      </div>
    `).join('');

    const rows = Array.isArray(this._kpis.missingAssessmentRecords) ? this._kpis.missingAssessmentRecords : [];
    if (rows.length === 0) {
      missing.innerHTML = `<div class="label">No missing assessment records found.</div>`;
      return;
    }

    missing.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Nomination</th>
            <th>Missing assessor IDs</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>
                <div><strong>${escapeHtml(r.title || 'Untitled')}</strong></div>
                <div>${escapeHtml(r.company || '')}</div>
                <div><code>${escapeHtml(r.nominationId)}</code></div>
              </td>
              <td>
                ${(Array.isArray(r.missingAssessors) ? r.missingAssessors : (Array.isArray(r.missingAssessorIds) ? r.missingAssessorIds.map(id => ({ id, name: id })) : [])).map(a => `
                  <div>
                    <div><strong>${escapeHtml(a.name || a.id)}</strong></div>
                    <div><code>${escapeHtml(a.id)}</code></div>
                  </div>
                `).join('')}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

customElements.define('assessments-dashboard', AssessmentsDashboard);

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

