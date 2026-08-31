/**
 * PBF webhook signature — pure JS, no Node crypto module.
 * Copy this function into n8n Code nodes and Wix backend/aiBriefSecret.js.
 *
 * sign = hex FNV-1a( root + canonical )
 * canonical examples:
 *   Wix → n8n: `${ts}.${_id}`
 *   n8n → Wix: `${ts}.${nominationId}.${status}`
 */
function pbfSign(root, canonical) {
  let h = 2166136261;
  const s = String(root) + String(canonical);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, 'hex');
}

module.exports = { pbfSign };
