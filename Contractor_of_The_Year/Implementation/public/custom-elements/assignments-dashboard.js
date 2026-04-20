// Wix-hosted Custom Element (Web Component)
// Tag name to use in the Wix editor: assignments-dashboard
//
// Cards-only KPI view for Topic 2 (Assignments & workload).
// Page code sets attribute:
//   $w('#assignmentsDash').setAttribute('kpis', JSON.stringify(payload))

class AssignmentsDashboard extends HTMLElement {
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
        console.error('[assignments-dashboard] failed to parse initial kpis attribute', e);
      }
    } else {
      this.renderEmpty();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'kpis' || oldValue === newValue) return;
    // eslint-disable-next-line no-console
    console.log('[assignments-dashboard] kpis attribute changed', { length: newValue ? newValue.length : 0 });
    try {
      const parsed = JSON.parse(decodeHtmlEntities(newValue));
      void this.setKpis(parsed);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[assignments-dashboard] failed to parse kpis attribute', e);
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
        :host { display:block; font-family: Arial, sans-serif; min-height: 140px; padding: 4px; box-sizing: border-box; }
        .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .tile { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; }
        .label { font-size: 12px; color: #666; margin-bottom: 6px; }
        .value { font-size: 22px; font-weight: 700; }
        .row { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .card { border: 1px solid #e5e5e5; border-radius: 10px; padding: 12px; background: #fff; }
        .bars { display:flex; flex-direction:column; gap: 8px; margin-top: 8px; }
        .barRow { display:grid; grid-template-columns: 180px 1fr 40px; gap: 10px; align-items:center; }
        .barLabel { font-size: 12px; color:#333; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .barTrack { height: 10px; background:#f1f1f1; border-radius: 999px; overflow:hidden; }
        .barFill { height: 100%; background:#2b6cb0; border-radius: 999px; width: 0%; }
        .barValue { font-size: 12px; color:#333; text-align:right; }
        .hint { font-size: 12px; color: #666; margin-top: 8px; }
      </style>
      <div class="grid" id="tiles"></div>
      <div class="row">
        <div class="card">
          <div class="label">Coach workload (submitted nominations)</div>
          <div class="bars" id="coachBars"></div>
        </div>
        <div class="card">
          <div class="label">Assessor workload (submitted nominations)</div>
          <div class="bars" id="assessorBars"></div>
        </div>
      </div>
      <div class="hint">Counts reflect submitted nominations only.</div>
    `;
  }

  renderEmpty() {
    if (!this.shadowRoot) return;
    const tiles = this.shadowRoot.getElementById('tiles');
    if (tiles) tiles.innerHTML = '';
    if (tiles) tiles.innerHTML = `<div class="tile"><div class="label">Waiting for data…</div><div class="value">—</div></div>`;
  }

  render() {
    if (!this.shadowRoot || !this._kpis) return;
    const tiles = this.shadowRoot.getElementById('tiles');
    const coachBars = this.shadowRoot.getElementById('coachBars');
    const assessorBars = this.shadowRoot.getElementById('assessorBars');

    const tileData = [
      { key: 'unassignedCoachCount', label: 'Unassigned coach count' },
      { key: 'unassignedAssessorsCount', label: 'Unassigned assessors count' },
      { key: 'underAssignedCount', label: 'Under-assigned nominations (<2)' },
    ];

    tiles.innerHTML = tileData.map(d => `
      <div class="tile">
        <div class="label">${d.label}</div>
        <div class="value">${Number(this._kpis[d.key] ?? 0)}</div>
      </div>
    `).join('');

    const coachData = Array.isArray(this._kpis.coachWorkload) ? this._kpis.coachWorkload : [];
    const assessorData = Array.isArray(this._kpis.assessorWorkload) ? this._kpis.assessorWorkload : [];

    if (coachBars) coachBars.innerHTML = renderBars(coachData, '#2f855a');
    if (assessorBars) assessorBars.innerHTML = renderBars(assessorData, '#2b6cb0');
  }
}

customElements.define('assignments-dashboard', AssignmentsDashboard);

function decodeHtmlEntities(s) {
  if (typeof s !== 'string') return s;
  return s
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&amp;', '&');
}

function renderBars(items, color) {
  const safe = Array.isArray(items) ? items : [];
  if (safe.length === 0) return `<div class="label">No data</div>`;

  const max = Math.max(...safe.map((x) => Number(x.count) || 0), 1);

  return safe.map((x) => {
    const name = String(x.name || x.id || '').trim() || 'Unknown';
    const count = Number(x.count) || 0;
    const pct = Math.round((count / max) * 100);
    return `
      <div class="barRow">
        <div class="barLabel" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
        <div class="barTrack"><div class="barFill" style="width:${pct}%; background:${color};"></div></div>
        <div class="barValue">${count}</div>
      </div>
    `;
  }).join('');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

