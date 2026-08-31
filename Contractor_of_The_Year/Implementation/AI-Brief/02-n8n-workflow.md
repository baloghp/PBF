# n8n — build `PCoTY AI Brief` (node by node)

**Parent (Wix, later):** [01-assessor-guide-at-submit.md](01-assessor-guide-at-submit.md)  
**Do this first.** Do not hook Wix until the golden run produces markdown you would show an assessor.

n8n talks to **Parsr** (read packet PDFs → **markdown**) and **LiteLLM** (OpenRouter model `deepseek/deepseek-v4-flash`). Packet extracts and the finished brief stay **markdown** through node 9. Wix converts to HTML for the rich-text box when storing or rendering. No Gotenberg. No customer eval.

If a Parsr URL 404s, your instance may omit `v1` — try `/api/document` instead of `/api/v1/document`. Same for `/queue`, `/markdown`.

**Parsr is Caddy Basic auth** at `https://parsr.ittd.app`. Finished markdown is `GET /api/v1/markdown/{queueId}?download=1`. Use **HTTP Request** nodes for Parsr (Basic Auth credential). Code nodes cannot use n8n credentials — see [Item flow & credentials](#item-flow--credentials) below.

**Wix file URLs:** Wix always sends **`wix:document://…`** (Media Manager). n8n cannot GET those directly (`Invalid URL … must start with "http" or "https"`). Install the **Wix community node** for **Wix API credentials**, then resolve each file through Wix **Generate File Download URL** before downloading PDF bytes — see [Node 4 — Wix resolve → Download PDF](#node-4--wix-resolve--download-pdf).

---



## Item flow & credentials



### No For Each node

n8n already processes **one item at a time** through most nodes. **List files** emits three items (`kind` + `url`). **Wix resolve URL**, **Tag download URL**, **Download PDF**, **Parsr submit**, **Wait**, and **Parsr markdown** each run **once per item** — three in, three out. You do not need Loop Over Items unless you deliberately collapsed to one item earlier.

The join key for Stitch is `kind` (`mainNarrative`, `fileContractMatrix`, `fileRaci`), not the Parsr queue id. Queue id is only for fetching markdown; keep it on the same item as `kind`.

### What each item should carry


| After node        | JSON on each item                                        |
| ----------------- | -------------------------------------------------------- |
| List files        | `kind`, `url`, `fileId` (GUID from `wix:document://…`)   |
| Tag download URL  | `kind`, `downloadUrl` (HTTPS, ~10 min TTL)               |
| Download PDF      | `kind`, `downloadUrl`, binary `data`                     |
| Wait Parsr        | `kind`, `queueId` (pass-through)                         |
| Parsr markdown    | HTTP body only — `kind` **is not on the output**         |
| Slim extract      | `kind`, `markdown` — merge in Code from **Tag queue id** |


**Parsr submit** returns only the queue id string. The HTTP node **replaces** the item JSON — it does not merge input fields (there is no such option). **5b Tag queue id** rebuilds `{ kind, queueId }`. **6c Slim extract** does the same after markdown download.

### Credentials: HTTP nodes, not Code


| Approach                                           | Works for Parsr Basic Auth? | Works for Wix Media API?     |
| -------------------------------------------------- | --------------------------- | ---------------------------- |
| **HTTP Request** + Generic Credential → Basic Auth | Yes — use this              | No — needs Wix headers       |
| **HTTP Request** + Predefined → **Wix API**        | No                          | Yes — use for node **4**     |
| **HTTP Request** + Header Auth (`Authorization` + `wix-site-id`) | No              | Yes — fallback if no Predefined |
| Code `helpers.httpRequest({ url })`                | No — no auth headers        | No                           |
| Code `helpers.httpRequestWithAuthentication`       | **No**                      | **No**                       |
| Code `this.getCredentials()`                       | **No**                      | **No**                       |


There is no supported helper to pull stored credentials into JavaScript. **Parsr submit**, **Parsr markdown**, and **Wix resolve URL** must stay as **HTTP Request** nodes with stored credentials. Code is fine for List files, Tag download URL, Tag queue id, Slim extract, Stitch, Wrap brief.

**HTTP Request does not keep input fields.** n8n has no “Include Input Fields” on that node. The response replaces the item. To keep `kind` across an HTTP call, either add a **Code** node after it that reads `$('Tag queue id').item.json` (paired item index), or reference that node in expressions: `{{ $('Tag queue id').item.json.kind }}`.

## What you will have on the canvas

**Part A — golden (build this, Execute workflow, stop):**

```
[1 Manual Trigger] → [1b Config] → [2 Golden JSON] → [3 List files]
        → [4 Wix resolve URL] → [4b Tag download URL] → [4c Download PDF]
        → [5 Parsr submit] → [5b Tag queue id]
        → [6a Wait Parsr] → [6b Parsr markdown] → [6c Slim extract]
        → [7 Stitch] → [7b Static prompts] → [8 LiteLLM] → [9 Wrap brief]
```

**Part B — production (add after Part A looks good):**

```
[11 Webhook] → [1b Config] → [12 HMAC in] → [13 IF hmac]
    → no:  [14 Respond 401]
    → yes: [15 Respond 202] → (then the same 3–9 chain)
        → [16 HMAC out] → [17 POST Wix]
```

Connect **15 Respond 202** into **3 List files** (not into 2). Webhook body is the same JSON shape as Golden JSON. Keep node 2 + Manual Trigger for retesting.

---



## 0. Credentials vs Config JSON

n8n Personal has **no Variables** (`$vars`). Credentials still work. Use both:


| Kind                 | Where                                | Examples                                            |
| -------------------- | ------------------------------------ | --------------------------------------------------- |
| **API keys**         | **Credentials** (encrypted)          | LiteLLM (**OpenAI** type), Parsr (**Basic Auth**), Wix (**Wix API** via community node) |
| **URLs + sign root** | **Config** Set node on this workflow | Parsr URL, `parsrWaitSeconds`, Wix write-back URL, `hmacRoot`                          |


The sign root is **not** a credential. It is used in Code nodes only. **Do not use Node `crypto`** — some n8n hosts block it. Use the pure-JS **`pbfSign`** below (same as [sign.js](sign.js)). Parsr uses **Basic Auth** at Caddy. Wix write-back uses `X-PBF-Signature` headers, not Bearer.

### 0.1 Credential: `LiteLLM` (OpenAI type)

LiteLLM speaks the **OpenAI** API. Use n8n’s OpenAI credential, not Header Auth and not an OpenAPI/Swagger import.

**Credentials → Add credential → OpenAI:**


| Field    | Value                                                                                   |
| -------- | --------------------------------------------------------------------------------------- |
| Name     | `LiteLLM`                                                                               |
| API Key  | LiteLLM **master key** only (no `Bearer` prefix — the node adds it)                     |
| Base URL | `https://litellm.your.domain/v1` — stop at `/v1`, do **not** append `/chat/completions` |


If Save shows “couldn’t connect”, save anyway. n8n often probes `/models`; LiteLLM may still chat fine.

OpenRouter’s key stays only in LiteLLM. The OpenAI node on the canvas uses this credential.

### 0.2 Credential: `Wix` (community node + HTTP Request)

Live webhook packets store nomination PDFs as **`wix:document://v1/…`** Media Manager URLs. You need Wix REST API auth to turn those into short-lived **`https://`** download links.

The **`@wix/n8n-nodes-wix`** package (Products/Orders/triggers) does **not** include a “download file” action. Install it anyway — it registers the **Wix API** credential type n8n uses for authenticated HTTP calls to `wixapis.com`.

**Install (once per n8n instance):**

1. **Settings → Community nodes → Install** → package name **`@wix/n8n-nodes-wix`**
2. Restart n8n if prompted

**API key (Wix dashboard):**

1. [API Keys Manager](https://manage.wix.com/account/api-keys) → **Create API Key**
2. Name e.g. `n8n PCoTY AI Brief`
3. Permissions: **Manage Media Manager** (`SCOPE.DC-MEDIA.MANAGE-MEDIAMANAGER`) — read-only scopes often fail here
4. Site access: **ittd.space** (or all sites)
5. Copy the key — shown once

**Site ID:** from dashboard URL after `/dashboard/` (same site Wix sends nominations from).

**Credentials → Add credential → Wix API:**

| Field    | Value        |
| -------- | ------------ |
| Name     | `Wix ittd`   |
| API Key  | your key     |
| Site ID  | your site id |

**Node 4 Wix resolve URL** uses **HTTP Request** with **Authentication → Predefined Credential Type → Wix API** → `Wix ittd`. If your n8n build has no Predefined option for Wix, create a **Header Auth** credential instead:

| Header name     | Value      |
| --------------- | ---------- |
| `Authorization` | API key (raw — **no** `Bearer` prefix) |
| `wix-site-id`   | Site ID    |

Wix docs: [Generate File Download URL](https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/generate-file-download-url), [Connect n8n to Wix](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/integrations/connect-n8n-to-your-wix-site).

Smoke (replace key, site id, and a real `wix:document://…` from a nomination):

```bash
curl -sS -X POST 'https://www.wixapis.com/site-media/v1/files/generate-file-download-url' \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID" \
  -H 'Content-Type: application/json' \
  -d '{"fileId":"dc45d4_93fab5fbecca4b97919580f4c3cd3346.pdf"}' \
  | jq '.downloadUrls[0].url'
```

Use the **GUID** from the `wix:document://v1/GUID/display-name.pdf` path (not the full `wix:…` string). No `Bearer` on the API key. You should get an `https://` URL. `curl -o test.pdf` that URL to confirm bytes before wiring n8n.

### 0.3 Config JSON (not secrets)

**Edit Fields (Set)** named `Config`:

```json
{
  "parsrBase": "https://parsr.ittd.app",
  "parsrWaitSeconds": 12,
  "hmacRoot": "same-long-string-as-wix-aiBriefSecret",
  "wixAiBriefUrl": "https://www.ittd.space/_functions-dev/aiBriefReady"
}
```

LiteLLM URL lives on the **OpenAI credential**, not here. Raise `parsrWaitSeconds` if markdown download still 404s (large PDFs).

**Parsr is behind Caddy Basic auth.** A Code node’s `helpers.httpRequest` does **not** send that login, so markdown fetches come back empty/`401` even when the UI download works. Create a **Basic Auth** credential (same user/password as the Parsr UI) and attach it to **Parsr submit** and **Parsr markdown**.

Smoke (this host returns **401** without `-u`):

```bash
curl -sS -D - -o /tmp/md.md -u 'USER:PASS' \
  'https://parsr.ittd.app/api/v1/markdown/QUEUE_ID?download=1'
head -c 200 /tmp/md.md
```

---



## Part A — Golden workflow

**Workflow** → Add → name `**PCoTY AI Brief`**. Inactive until Part B.

### Node 1 — Manual Trigger

- Add **Manual Trigger**
- No settings



### Node 1b — Config

- Add **Edit Fields (Set)**
- Name: `Config`
- Mode: **JSON**
- Paste the object from §0.3 (URLs, `parsrWaitSeconds`, `hmacRoot`)
- **Include Other Input Fields:** On (so webhook body is kept in Part B)

Connect **1 → 1b**. In Part B also connect **11 Webhook → 1b**.

### Node 2 — Golden JSON

- Add **Edit Fields (Set)**
- Name: `Golden JSON`
- Mode: **JSON**
- Paste the contents of [n8n/fixtures/golden-packet-webhook.json](n8n/fixtures/golden-packet-webhook.json)

For manual runs, the three file fields must be real **`wix:document://…`** URLs (copy from a nomination row in CMS or from a webhook execution). `https://…usrfiles.com…` links will not work on this chain.

Connect **1b → 2**.

Execute node 2. You should see `_id` = `calibration-supply-chain` and three `wix:document://…` URLs.

### Node 3 — List files

- Add **Code**
- Name: `List files`
- Language: JavaScript
- Mode: **Run once for all items**

```javascript
function wixFileId(url) {
  const s = String(url || '').trim();
  // wix:document://v1/GUID/display-name.pdf  (note :// not :/)
  const m = s.match(/^wix:[^:]+:\/\/v1\/([^/#?]+)/i);
  return m ? m[1] : s;
}

const src = $input.first().json;
const files = [
  { kind: 'mainNarrative', url: src.mainNarrative || '' },
  { kind: 'fileContractMatrix', url: src.fileContractMatrix || '' },
  { kind: 'fileRaci', url: src.fileRaci || '' },
];
return files.map((f) => ({
  json: {
    kind: f.kind,
    url: f.url,
    fileId: wixFileId(f.url),
  },
}));
```

Do **not** copy `_id`, title, company, or the three rich-text blobs onto these items. They already sit on **Golden JSON** (lab) or **HMAC in** (webhook). Each file item is `kind` + `url` + `fileId` (GUID for the Wix API).

Execute: `fileId` must be just the GUID, e.g. `dc45d4_93fab5fbecca4b97919580f4c3cd3346.pdf` — not the full `wix:document://…` string. If `fileId` equals `url`, the regex did not match (old bug: used `/v1/` instead of `://v1/`).

Connect **2 → 3**. Execute: **three items**, one per file.

### Node 4 — Wix resolve → Download PDF

Wix sends `wix:document://…` — you cannot GET it directly:

```text
Invalid URL: wix:document://v1/dc45d4_….pdf/….pdf.
URL must start with "http" or "https".
```

Always resolve → tag → download. Three nodes, no IF branches.

**4 — Wix resolve URL**

- Add **HTTP Request**
- Name: `Wix resolve URL`
- Method: **POST** (not GET — GET on this path returns **405**)
- URL: `https://www.wixapis.com/site-media/v1/files/generate-file-download-url`  
  **Not** `…/generate-download-url` (that is the bulk-zip endpoint).
- Authentication: **Predefined Credential Type → Wix API** → `Wix ittd` (or Header Auth from §0.2)
- Send Headers: add **`Content-Type`** = `application/json` (even with Predefined auth)
- Send Body: **On**
- Body Content Type: **JSON**
- Specify Body: **Using JSON**
- JSON (single expression — do **not** paste raw `"={{ … }}"` inside a JSON string; n8n may send it literally and Wix returns **405**):

```
={{ JSON.stringify({ fileId: $json.fileId }) }}
```

Example: `wix:document://v1/dc45d4_abc….pdf/Name.pdf` → `fileId` = `dc45d4_abc….pdf` (from **List files**).

- Response format: **JSON**

The response replaces the item (same as Parsr). **`kind` is gone until 4b.**

Connect **3 → 4**.

**405 / `INVALID_ARGUMENT` / “method is not allowed”** — check in order:

1. Method is **POST**
2. URL ends with **`generate-file-download-url`** (with `-file-`)
3. Body is sent — use the **expression** above, not a static JSON block with `"={{ $json.url }}"`
4. `Authorization` is the raw API key (**no** `Bearer`)
5. `wix-site-id` header present (Predefined **Wix API** credential adds both)
6. API key has **Manage Media Manager** permission
7. `fileId` is the GUID segment, not the full `wix:document://…` string

**403 / 401:** wrong API key, missing Media permission, or Site ID not matching the site that owns the file.

**4b — Tag download URL**

- Add **Code**
- Name: `Tag download URL`
- Run **once for each item**

```javascript
let kind = '';
try {
  kind = String($('List files').item.json.kind || '');
} catch (e) {
  kind = String($json.kind || '');
}

const urls = $json.downloadUrls || [];
const downloadUrl = String(urls[0]?.url || '').trim();

return {
  json: {
    kind,
    downloadUrl,
  },
};
```

Connect **4 → 4b**. Execute: three items, each `{ kind, downloadUrl }` with `https://…` URLs.

**4c — Download PDF**

- Add **HTTP Request**
- Name: `Download PDF`
- Method: **GET**
- URL: `={{ $json.downloadUrl }}`
- Authentication: **None** (Wix download URLs are pre-signed)
- Response format: **File**
- Put output in field: `data`

Connect **4b → 4c → 5**. Execute: each item has binary `data`. **404** on GET usually means the resolve URL expired — default TTL ~600 minutes; download immediately after resolve.

### Node 5 — Parsr submit

- Add **HTTP Request**
- Name: `Parsr submit`
- Method: **POST**
- URL: `{{ $('Config').first().json.parsrBase }}/api/v1/document`
- Authentication: **Generic Credential → Basic Auth** (same user/password as [https://parsr.ittd.app](https://parsr.ittd.app))
- Send Body: On
- Body Content Type: **Form-Data**
- Form field:
  - Name: `file`
  - Type: **n8n Binary File**
  - Input Data Field Name: `data`

Set **Response format: Text** (Parsr returns a **plain queue id** in the body). The output item will be something like `{ "data": "6281e8…" }` — `kind` **is gone until 5b**.

Connect **4c → 5**. Execute: three items; body is a hex id like `6281e8…`.

If this 404s, change URL to `{{ $('Config').first().json.parsrBase }}/api/document`.

### Node 5b — Tag queue id

Parsr’s response is only the id string. This node keeps `kind` from the paired input item and stores the id as `queueId`.

- Add **Code**
- Name: `Tag queue id`
- Run **once for each item**

```javascript
let kind = '';
try {
  kind = String($('List files').item.json.kind || '');
} catch (e) {
  kind = String($json.kind || '');
}

const raw = $json.data ?? $json.body ?? $json.queueId ?? '';
const queueId = String(raw).trim().replace(/^"|"$/g, '');

return {
  json: {
    kind,
    queueId,
  },
};
```

Connect **5 → 5b**. Execute: three items, each exactly `{ kind, queueId }` — no `data`, no nomination blobs.

### Node 6 — Wait, then download markdown

Do **not** fetch markdown from a Code node. `helpers.httpRequest` has no Caddy Basic auth, so you get 401 and `(missing)` while the UI download works.

**6a — Wait**

- Add **Wait**
- Name: `Wait Parsr`
- Resume: **After Time Interval**
- Wait Amount: `{{ $('Config').first().json.parsrWaitSeconds }}`
- Wait Unit: **Seconds**

Do not hard-code 12 here. Change the wait only in Config.

Connect **5b → 6a**. Wait passes the item through unchanged (`kind`, `queueId` stay on the **input** to 6b).

**6b — Parsr markdown**

- Add **HTTP Request**
- Name: `Parsr markdown`
- Method: **GET**
- URL: `{{ $('Config').first().json.parsrBase }}/api/v1/markdown/{{ $json.queueId }}?download=1`  
(same as `{{ $('Tag queue id').item.json.queueId }}` — use whichever reads clearer)
- Authentication: **same Basic Auth credential as Parsr submit**
- Response format: **Text**

Do **not** look for “Include Input Fields” — it is not on this node. The output will be the markdown body only (often field `data`). **6c** puts `kind` back.

This is the same URL as the UI: `https://parsr.ittd.app/api/v1/markdown/<queueId>?download=1`.

Execute: output is a long text blob. **401** = credential missing. **404** = raise `parsrWaitSeconds` or wrong `queueId`.

**6c — Slim extract**

- Add **Code**
- Name: `Slim extract`
- Run **once for each item**

Merge `kind` from **Tag queue id** (paired item) with the markdown body from 6b:

```javascript
let kind = '';
try {
  kind = String($('Tag queue id').item.json.kind || '');
} catch (e) {
  kind = String($json.kind || '');
}

let md = $json.data ?? $json.body ?? $json.markdown ?? $json;
if (md && typeof md === 'object') md = md.data || md.body || '';
md = String(md || '').trim();
const looksLikeQueueId = /^[0-9a-f]{20,}$/i.test(md);
const markdown = md && md !== '(missing)' && !looksLikeQueueId ? md : '(missing)';

return { json: { kind, markdown } };
```

Connect **6a → 6b → 6c**. Execute: three items, **only** `kind` + `markdown`.

### Node 7 — Stitch

- Add **Code**
- Name: `Stitch`
- Run **once for all items**

Nomination text is **not** on the Parsr items. Read it once from **Golden JSON** (manual run) or **HMAC in** (webhook). Parsr items are only `kind` + `markdown`.

```javascript
function nomination() {
  for (const name of ['Golden JSON', 'HMAC in']) {
    try {
      const j = $(name).first().json;
      if (j && j._id) return j;
    } catch (e) {}
  }
  return {};
}

function pickMd(item) {
  const md = String(item.markdown || '').trim();
  return md && md !== '(missing)' ? md : '(missing)';
}

const nom = nomination();
const items = $input.all().map((i) => i.json);
const byKind = Object.fromEntries(items.map((i) => [i.kind, pickMd(i)]));

const user = [
  '# Nomination',
  `id: ${nom._id}`,
  `title: ${nom.title}`,
  `company: ${nom.company}`,
  '',
  '## Exemplary',
  nom.exemplary || '(missing)',
  '',
  '## Impact',
  nom.impact || '(missing)',
  '',
  '## Lessons',
  nom.lessons || '(missing)',
  '',
  '## Extracted: main narrative',
  byKind.mainNarrative || '(missing)',
  '',
  '## Extracted: contract matrix',
  byKind.fileContractMatrix || '(missing)',
  '',
  '## Extracted: RACI',
  byKind.fileRaci || '(missing)',
].join('\n');

return [{
  json: {
    _id: nom._id,
    title: nom.title,
    company: nom.company,
    user,
  },
}];
```

Connect **6c → 7**. Execute: **one** item, field `user` is a long string. The three `## Extracted:` blocks must be markdown, not `(missing)`.

### Node 7b — Static prompts

- Add **Edit Fields (Set)**
- Name: `Static prompts`
- Keep all fields from Stitch (`_id`, `title`, `company`, `user`)
- Add string field `systemPrompt` — paste the full file [prompts/system.md](prompts/system.md)
- Add string field `assessmentGuide` — paste from the Assessment Guide, at least **The nine criteria** + **Criterion 9 in detail** in [../../Guides/Contractor-of-the-Year-Assessment-Guide-2026.md](../../Guides/Contractor-of-the-Year-Assessment-Guide-2026.md)

Connect **7 → 7b**.

### Node 8 — LiteLLM (OpenAI node)

LiteLLM is OpenAI-compatible. Use the **OpenAI** node, not raw HTTP, not OpenAPI/Swagger import.

- Add **OpenAI**
- Name: `LiteLLM`
- Credential: **LiteLLM** (the OpenAI credential from §0.1)
- Resource: **Text** (or **Chat**, depending on your n8n version)
- Operation: **Message a Model** / **Create a Chat Completion**
- Model: by ID `deepseek/deepseek-v4-flash` (if the dropdown is empty, type the id). If LiteLLM 404s, use the id you registered (`openrouter/deepseek/deepseek-v4-flash`)
- Temperature: **0.2**
- Messages:
  - **System:** `{{ $('Static prompts').first().json.systemPrompt }}` then a newline then `{{ $('Static prompts').first().json.assessmentGuide }}`
  - **User:** `{{ $json.user }}`
- Options → Timeout: **120000** ms if the field exists

Connect **7b → 8**.

Execute. **Pass:** markdown with nine named criteria, **found / thin / missing** only, **no 1–10**, no client scores. (Banner is added in node 9, not by the model.)

**LiteLLM output shape (OpenAI node):** one item whose `output` is an **array of message objects**, not a plain string:

```json
{
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        { "type": "output_text", "text": "# Working Paper…\n\n## Packet Snapshot\n…" }
      ]
    }
  ]
}
```

Read the brief from `output[0].content[0].text`. Node 9 handles this (and older `choices[0].message.content` shapes as fallback).

### Node 9 — Wrap brief

- Add **Code**
- Name: `Wrap brief`
- Mode: **Run once for all items** (not “each item” — LiteLLM outputs one brief)

```javascript
function extractLlmText(j) {
  const o = j.output;
  if (Array.isArray(o) && o[0]?.content) {
    const parts = o[0].content
      .filter((c) => c.type === 'output_text' && c.text)
      .map((c) => c.text);
    if (parts.length) return parts.join('');
  }
  if (typeof o === 'string') return o;
  if (typeof j.message?.content === 'string') return j.message.content;
  if (typeof j.choices?.[0]?.message?.content === 'string') {
    return j.choices[0].message.content;
  }
  return '';
}

function stripModelBanner(text) {
  const t = String(text).trim();
  const m = t.match(/^[\s\S]*?(##\s*Packet\s+[Ss]napshot[\s\S]*)$/);
  return m ? m[1].trim() : t;
}

const src = $('Static prompts').first().json;
const fromLlm = $input.first().json;
const body = stripModelBanner(extractLlmText(fromLlm));
const when = new Date().toISOString();
const header = [
  'This brief was generated at nomination **submit**. It uses only the written packet and uploaded files. This is a machine guide, not an official score. Your sliders and comments are the assessment.',
  '',
  `- **Nomination title:** ${src.title}`,
  `- **Company:** ${src.company}`,
  `- **Nomination id:** ${src._id}`,
  `- **Generated at (UTC):** ${when}`,
  `- **Model:** deepseek/deepseek-v4-flash`,
  '',
  '---',
  '',
].join('\n');

return [{
  json: {
    nominationId: src._id,
    status: 'ready',
    markdown: header + body,
    model: 'deepseek/deepseek-v4-flash',
    generatedAt: when,
  },
}];
```

Use `$input.first().json` and `$('…').first().json` in this mode. Do not use `$json` or `.item` here — the editor will warn and `.item` always reads item 0 incorrectly in “all items” mode.

`stripModelBanner` drops a model-generated `## Banner` block (and any title above it) so the n8n header is the only banner. If `body` is empty after Execute, open **LiteLLM** and confirm `output[0].content[0].text` exists.

Connect **8 → 9**. Execute the **whole workflow**. Copy `markdown` into a `.md` file and read it. If you would show it to an assessor, Part A is done.

**Do not add n8n’s Markdown→HTML node.** It mangles tables and leaves artifacts. Wix converts markdown when writing or rendering `#richTextBoxAiBrief`.

---



## Part A checklist

- [x] Three PDFs: Wix resolve → GET download URL → Parsr
- [x] Parsr markdown download (`?download=1`) is real `.md` text, not `(missing)` or a queue id
- [x] LiteLLM returns the nine criterion names exactly
- [x] No 1–10 scores
- [x] Banner is the first thing in `markdown`

---



## Part B — Webhook, sign check, Wix write-back

Do not start this until Part A checklist is ticked.

### Sign helper (paste into Code nodes — no `crypto`)

Canonical string + shared root → **8-char hex** FNV-1a hash. Copy from [sign.js](sign.js):

```javascript
function pbfSign(root, canonical) {
  let h = 2166136261;
  const s = String(root) + String(canonical);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, 'hex');
}
```

| Direction | Canonical string |
| --- | --- |
| Wix → n8n | `{ts}.{_id}` |
| n8n → Wix | `{ts}.{nominationId}.{status}` |

Header `X-PBF-Signature` = `pbfSign(hmacRoot, canonical)`. Reject if mismatch or `|now − ts| > 300` s.

### Node 11 — Webhook

- Add **Webhook**
- Name: `Webhook`
- HTTP Method: **POST**
- Path: `pcoty-ai-brief`
- Authentication: **None** (sign check is the next node)
- Respond: **Using Respond to Webhook Node**

Production URL looks like `https://<your-n8n>/webhook/pcoty-ai-brief`. It must be **real TLS** (Wix `fetch` hangs on self-signed).

The JSON body is the same keys as the golden file (`_id`, `ts`, `title`, `company`, `exemplary`, `impact`, `lessons`, `mainNarrative`, `fileContractMatrix`, `fileRaci`). No customer fields.

### Node 12 — HMAC in

- Add **Code**
- Name: `HMAC in`
- Mode: **Run once for each item** (default — **not** “Run once for all items”). `$input.item` only works in this mode.
- **Return a single object** `{ json: … }` — **not** an array `[{ json: … }]`. (Arrays are only for “Run once for all items”.)

```javascript
function pbfSign(root, canonical) {
  let h = 2166136261;
  const s = String(root) + String(canonical);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, 'hex');
}

const root = String($('Config').first().json.hmacRoot || '');

const wh = $('Webhook').first().json;
let packet = wh.body ?? wh;
if (typeof packet === 'string') {
  try { packet = JSON.parse(packet); } catch { packet = {}; }
}
if (typeof packet !== 'object' || packet === null || Array.isArray(packet)) {
  packet = {};
}

const ts = String(packet.ts ?? '');
const id = String(packet._id ?? '');

const headers = wh.headers || {};
const headerTs = String(headers['x-pbf-timestamp'] || headers['X-PBF-Timestamp'] || '');
const sig = String(headers['x-pbf-signature'] || headers['X-PBF-Signature'] || '').toLowerCase();

const now = Math.floor(Date.now() / 1000);
const n = Number(ts);
const okTime = headerTs === ts && Number.isFinite(n) && Math.abs(now - n) <= 300;
const expect = pbfSign(root, `${ts}.${id}`);
const hmacOk = Boolean(root) && okTime && sig.length > 0 && expect === sig;

return {
  json: {
    _id: id,
    ts: packet.ts,
    title: packet.title ?? '',
    company: packet.company ?? '',
    exemplary: packet.exemplary ?? '',
    impact: packet.impact ?? '',
    lessons: packet.lessons ?? '',
    mainNarrative: packet.mainNarrative ?? '',
    fileContractMatrix: packet.fileContractMatrix ?? '',
    fileRaci: packet.fileRaci ?? '',
    hmacOk,
  },
};
```

**Why read `$('Webhook')`?** After **Config**, `$input.item.json` is often **only** `parsrBase`, `hmacRoot`, etc. — the nomination JSON is gone unless Config has **Include Other Input Fields** on *and* your n8n version merges `body` through. Reading **`$('Webhook').first().json.body`** always works.

Downstream nodes (List files, Stitch) need `_id`, `title`, file URLs at the **top level** — the `return` above flattens `packet` for that.

Connect **11 → 1b Config → 12** (HMAC in only **reads** Config for `hmacRoot`; packet comes from Webhook). Use your Config node name in `$('Config')` if renamed (e.g. `Config1`).

### Node 13 — IF hmac

- Add **IF**
- Name: `IF hmac`
- Condition: Boolean `{{ $json.hmacOk }}` **is true**
- True → node 15
- False → node 14



### Node 14 — Respond 401

- Add **Respond to Webhook**
- Name: `Respond 401`
- Respond With: **JSON**
- Status: **401**
- Body: `{ "ok": false, "error": "bad signature" }`

Stop the branch here.

### Node 15 — Respond 202

- Add **Respond to Webhook**
- Name: `Respond 202`
- Respond With: **JSON**
- Status: **202**
- Body: `{ "ok": true, "id": "{{ $json._id }}" }`

Connect **15 → 3 List files** (the Part A chain). The webhook JSON already has the same fields as Golden JSON, so **List files** works. Leave Manual Trigger + Golden JSON connected for lab runs.

Wix must send headers:


| Header            | Value                               |
| ----------------- | ----------------------------------- |
| `X-PBF-Timestamp` | unix seconds, same as body `ts`     |
| `X-PBF-Signature` | `pbfSign(hmacRoot, \`{ts}.{_id}\`)` — 8 hex chars |
| `Content-Type`    | `application/json`                  |




### Node 16 — HMAC out

- Add **Code** after **Wrap brief** (node 9)
- Name: `HMAC out`
- Mode: **Run once for each item** — return `{ json: … }`, not an array

```javascript
function pbfSign(root, canonical) {
  let h = 2166136261;
  const s = String(root) + String(canonical);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, 'hex');
}

const root = String($('Config').first().json.hmacRoot || '');
const fromWrap = $input.item.json;
const nominationId = String(fromWrap.nominationId);
const status = String(fromWrap.status || 'ready');
const ts = Math.floor(Date.now() / 1000);
const signature = pbfSign(root, `${ts}.${nominationId}.${status}`);

return {
  json: {
    nominationId,
    status,
    markdown: fromWrap.markdown,
    model: fromWrap.model,
    generatedAt: fromWrap.generatedAt,
    ts,
    headers: {
      'Content-Type': 'application/json',
      'X-PBF-Timestamp': String(ts),
      'X-PBF-Signature': signature,
    },
  },
};
```

Connect **9 → 16**.

### Node 17 — POST Wix

- Add **HTTP Request**
- Name: `POST Wix`
- Method: **POST**
- URL: `{{ $('Config').first().json.wixAiBriefUrl }}`
- Authentication: None
- Send Headers: using `{{ $json.headers }}` (or three explicit header fields)
- Send Body: JSON

```json
{
  "nominationId": "{{ $json.nominationId }}",
  "status": "{{ $json.status }}",
  "ts": {{ $json.ts }},
  "markdown": {{ JSON.stringify($json.markdown) }},
  "model": "{{ $json.model }}",
  "generatedAt": "{{ $json.generatedAt }}"
}
```

Until Wix `post_aiBriefReady` exists, set `wixAiBriefUrl` on Config to [webhook.site](https://webhook.site) and confirm the signature headers + `markdown`.

On failure (`status: failed`), same URL, omit `markdown`, add `"error": "short reason"`, sign `{ts}.{nominationId}.failed`.

### Error path (node 18)

- Workflow settings → **Error Workflow**, or add **Error Trigger** on this workflow
- Then a small **Code** that sets `nominationId` from `$json.execution?.id` / last `_id` if you stored it, `status: failed`, then reuse HMAC out + POST Wix

Minimum: Error Trigger → Edit Fields `status=failed` + `_id` from the error payload if present → HMAC out → POST Wix. Do not leave CMS on `queued`.

---



## Curl tests (Part B)

Replace `ROOT`, `URL`, and `_id`. `ROOT` must match Config `hmacRoot`.

```bash
TS=$(date +%s)
ID=calibration-supply-chain
ROOT='same-long-string-as-wix-aiBriefSecret'
SIG=$(node -e "
function pbfSign(r,c){let h=2166136261;const s=r+c;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}process.stdout.write((h>>>0).toString(16).padStart(8,'hex'));}
pbfSign(process.argv[1], process.argv[2]);
" "$ROOT" "${TS}.${ID}")

curl -sS -D - -o /tmp/out.json \
  -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-PBF-Timestamp: $TS" \
  -H "X-PBF-Signature: $SIG" \
  --data-binary @Contractor_of_The_Year/Implementation/AI-Brief/n8n/fixtures/golden-packet-webhook.json
```

Edit the fixture so `"ts"` equals `$TS` before you send (canonical uses body `ts`). Fastest: `jq --argjson ts "$TS" '.ts=$ts' golden-packet-webhook.json > /tmp/body.json` and `--data-binary @/tmp/body.json`.


| Expect               | Result                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| Valid signature      | HTTP **202** in under a second; workflow continues; later POST Wix `ready` |
| Bad signature        | **401**; LiteLLM must not run                                              |
| `ts` 400 seconds old | **401**                                                                    |


---



## Then Wix

When the webhook URL is stable and a signed curl returns 202:

1. Give that URL to [01-assessor-guide-at-submit.md](01-assessor-guide-at-submit.md) Step 4
2. Same `hmacRoot` / `pbfSign` as in `src/backend/aiBriefSecret.js`
3. CMS `aiBrief` + `#richTextBoxAiBrief` on Assessor Dashboard
4. `saveNomination` fires the webhook on final submit; `post_aiBriefReady` stores markdown (Wix converts for the rich-text box)

---



## Do not

- GET `wix:document://…` directly — always resolve via Wix Media API first
- Header Auth as the webhook password
- Customer eval in the stitch
- Parsr **JSON** output (bounding boxes)
- Vision / page images
- Gotenberg / PDF
- `:free` OpenRouter slugs
- Fail the nominee submit if n8n is down

