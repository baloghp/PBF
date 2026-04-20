// Wix-hosted Custom Element (Web Component)
// Tag name to use in the Wix editor: scores-dashboard
//
// Page code sets attribute:
//   $w('#scoresDash').setAttribute('kpis', JSON.stringify(payload))

class ScoresDashboard extends HTMLElement {
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
        console.error('[scores-dashboard] failed to parse initial kpis attribute', e);
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
      console.error('[scores-dashboard] failed to parse kpis attribute', e);
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
        .sectionTitle { font-size: 13px; font-weight: 700; margin: 4px 0 10px; color:#222; }
        .subTitle { font-size: 12px; font-weight: 700; margin: 14px 0 8px; color:#333; }
        .hint { font-size: 12px; color: #666; margin-top: 8px; }
        table { width:100%; border-collapse: collapse; }
        th, td { border-bottom: 1px solid #eee; padding: 8px; text-align:left; font-size: 12px; vertical-align: top; }
        th { color:#555; font-weight: 600; }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
        .muted { color:#666; }
        .twoCol { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mono { font-variant-numeric: tabular-nums; }
      </style>
      <div class="grid" id="tiles"></div>
      <div class="card">
        <div class="sectionTitle">Overall scoreboards</div>
        <div class="twoCol">
          <div>
            <div class="subTitle">Top by overallScore</div>
            <div id="overallOverall"></div>
          </div>
          <div>
            <div class="subTitle">Top by assessmentsScore</div>
            <div id="overallAssessments"></div>
          </div>
        </div>
        <div>
          <div class="subTitle">Top by customersScore</div>
          <div id="overallCustomers"></div>
        </div>
      </div>
      <div class="card">
        <div class="sectionTitle">Per-category scoreboards</div>
        <div id="perCategory"></div>
        <div class="hint" id="catHint"></div>
      </div>
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
    const overallOverall = this.shadowRoot.getElementById('overallOverall');
    const overallAssessments = this.shadowRoot.getElementById('overallAssessments');
    const overallCustomers = this.shadowRoot.getElementById('overallCustomers');
    const perCategory = this.shadowRoot.getElementById('perCategory');
    const catHint = this.shadowRoot.getElementById('catHint');

    const tileData = [
      { key: 'scoredNominations', label: 'Scored nominations' },
      { key: 'unscoredNominations', label: 'Unscored nominations' },
    ];
    tiles.innerHTML = tileData.map(d => `
      <div class="tile">
        <div class="label">${d.label}</div>
        <div class="value">${Number(this._kpis[d.key] ?? 0)}</div>
      </div>
    `).join('');

    const overall = this._kpis.overall || {};
    overallOverall.innerHTML = renderTable(overall.byOverallScore, 'overallScore');
    overallAssessments.innerHTML = renderTable(overall.byAssessmentsScore, 'assessmentsScore');
    overallCustomers.innerHTML = renderTable(overall.byCustomersScore, 'customersScore');

    const cats = Array.isArray(this._kpis.perCategory) ? this._kpis.perCategory : [];
    if (cats.length === 0) {
      perCategory.innerHTML = `<div class="muted">No categories found on submitted nominations.</div>`;
    } else {
      perCategory.innerHTML = cats.map(c => `
        <div style="margin-top: 10px;">
          <div class="subTitle">${escapeHtml(c.category)} <span class="muted">(${Number(c.totalNominations ?? 0)})</span></div>
          <div class="twoCol">
            <div>
              <div class="label">Top by overallScore</div>
              ${renderTable(c.byOverallScore, 'overallScore')}
            </div>
            <div>
              <div class="label">Top by assessmentsScore</div>
              ${renderTable(c.byAssessmentsScore, 'assessmentsScore')}
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div class="label">Top by customersScore</div>
            ${renderTable(c.byCustomersScore, 'customersScore')}
          </div>
        </div>
      `).join('');
    }

    const truncated = Number(this._kpis.truncatedCategoryCount ?? 0);
    const topN = Number(this._kpis.topN ?? 10);
    catHint.textContent = truncated > 0
      ? `Showing first 10 categories (and Top ${topN} rows each). ${truncated} more categories exist.`
      : `Showing Top ${topN} rows per table.`;
  }
}

customElements.define('scores-dashboard', ScoresDashboard);

function renderTable(rows, scoreKey) {
  const arr = Array.isArray(rows) ? rows : [];
  if (arr.length === 0) return `<div class="muted">No data.</div>`;

  return `
    <table>
      <thead>
        <tr>
          <th>Nomination</th>
          <th>Company</th>
          <th>Category</th>
          <th class="mono">${escapeHtml(scoreKey)}</th>
        </tr>
      </thead>
      <tbody>
        ${arr.map(r => `
          <tr>
            <td>
              <div><strong>${escapeHtml(r.title || 'Untitled')}</strong></div>
              <div><code>${escapeHtml(r.nominationId || '')}</code></div>
            </td>
            <td>${escapeHtml(r.company || '')}</td>
            <td>${escapeHtml(r.category || '')}</td>
            <td class="mono">${formatScore(r?.[scoreKey])}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function formatScore(v) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '—';
  return v.toFixed(2);
}

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

