# Profile Optimizer — Build Reference

**Last Updated:** 2026-04-02
**Domain:** `profile-optimizer.isyourwebsitegood.com`
**Status:** Starting from scratch

---

## 🎯 Purpose

Internal tool Eric uses to generate a Google Business Profile optimization deliverable for paying prospects and existing clients. Public flow handles lead intake and Stripe payment ($99). Internal flow handles GBP data lookup, content generation, and deliverable publishing. Deliverable is a token-based public page the client can access anytime.

This tool is the second rung in the lead generation tool ladder:
**Health Check ($49) → Profile Optimizer ($99) → Brand Clarity → Apply**

---

## 🌐 URL Structure

| URL | Access | Purpose |
|-----|--------|---------|
| `/` | Public | Redirect to `/get-started` |
| `/get-started` | Public | Lead intake form |
| `/payment-success` | Public | Post-Stripe confirmation |
| `/callback` | Public | Auth0 OAuth callback |
| `/dashboard` | Auth0 protected | Internal deliverable list |
| `/dashboard/edit/:id` | Auth0 protected | Internal deliverable editor |
| `/:token` | Public | Client-facing deliverable page |

---

## 🔨 Tech Stack

- **Framework:** Vue 3 (Composition API) + TypeScript + Vite
- **Styling:** Tailwind CSS 4 (CSS-native `@theme` block, no `tailwind.config.js`)
- **State:** Pinia
- **Auth:** Auth0 (`@auth0/auth0-vue`) — internal routes only
- **Functions:** Netlify Functions (TypeScript)
- **Database:** Turso (LibSQL) — shared instance with all other pipeline projects
- **Payments:** Stripe
- **Email:** Resend
- **Places:** Google Places API (GBP data lookup)
- **Dev ports:** Vite `5177`, Netlify `8891`

**Brand Theme:** Teal Warmth (same as all other pipeline tools)

```css
/* Light mode */
--color-primary: #0e7490;
--color-secondary: #0d9488;
--color-accent: #f59e0b;
--color-bg: #ffffff;
--color-surface: #f0fdfa;
--color-text: #164e63;
--color-text-secondary: #0f766e;

/* Dark mode (.dark class on <html>) */
--color-primary: #22d3ee;
--color-secondary: #2dd4bf;
--color-accent: #fbbf24;
--color-bg: #083344;
--color-surface: #164e63;
--color-text: #ecfeff;
--color-text-secondary: #a5f3fc;
```

**Typography:** Plus Jakarta Sans (headings, 800/700) + Inter (body, 400/500/600)
**Border radius:** 8px
**PWA:** Yes — installable, offline-capable, auto-updating service worker

---

## 🗄️ Database Schema

All tables use `CREATE TABLE IF NOT EXISTS`. This project shares the Turso instance used by health-check, application-assessment, and client-dashboard. Do not redefine existing tables (`clients`, `prospects`, `applications`, etc.).

### New Tables

```sql
CREATE TABLE IF NOT EXISTS gbp_leads (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  business_type TEXT NOT NULL,
  city_region TEXT NOT NULL,
  business_description TEXT,
  has_gbp INTEGER NOT NULL DEFAULT 0,
  gbp_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  stripe_session_id TEXT
);

CREATE TABLE IF NOT EXISTS gbp_deliverables (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  lead_id TEXT,
  prospect_id TEXT,
  client_id TEXT,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  city_region TEXT NOT NULL,
  track TEXT NOT NULL DEFAULT 'A',
  gbp_place_id TEXT,
  gbp_data TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  expires_at INTEGER,
  published_at INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);
```

**`gbp_leads.status`:** `new` | `paid`
**`gbp_leads.business_type`:** `local_service` | `consultant` | `nonprofit` | `church` | `hoa` | `retail` | `creative` | `technology`
**`gbp_deliverables.track`:** `A` (no GBP) | `B` (has GBP, needs improvement)
**`gbp_deliverables.status`:** `draft` | `published` | `expired` | `archived`
**`gbp_deliverables.expires_at`:** null for existing clients (permanent); 90 days from `published_at` for prospects

---

## 📦 Content JSON Shape

The `gbp_deliverables.content` column stores a JSON string with this structure:

```typescript
interface DeliverableContent {
  description: {
    current: string | null      // Track B: pulled from GBP data
    optimized: string           // Generated — max 750 chars
    characterCount: number
  }
  categories: {
    primary: string
    secondary: string[]         // Up to 9
    rationale: string
  }
  services: Array<{
    name: string
    description: string         // 1-2 sentences
  }>
  qAndA: Array<{
    question: string
    answer: string
  }>
  photoChecklist: Array<{
    item: string
    why: string
    priority: 'high' | 'medium' | 'low'
  }>
  posts: Array<{
    type: 'intro' | 'event' | 'impact'
    body: string                // Max 1500 chars (GBP limit)
    cta: string
  }>
  reviewTemplates: {
    positive: string
    mixed: string
  }
  gapAnalysis: GapAnalysisField[] | null  // Track B only
}

interface GapAnalysisField {
  field: string                 // e.g. "Business Description"
  currentValue: string | null
  currentLength?: number
  recommendedValue: string
  recommendedLength?: number
  priority: 'high' | 'medium' | 'low'
  notes: string
}
```

---

## ⚙️ Content Engine

**File:** `src/lib/contentEngine.ts`

The content engine is the core generation layer. All generation functions check a feature flag before choosing template vs AI path. The deliverable content shape is identical regardless of path — AI is purely a drop-in replacement for template functions.

```typescript
// Feature flag — default false, flip via env var when AI path is ready
const USE_AI = import.meta.env.VITE_ENABLE_AI_CONTENT === 'true'

export function generateDescription(data: BusinessData): DescriptionOutput {
  return USE_AI ? generateDescriptionAI(data) : generateDescriptionTemplate(data)
}
// Same pattern for all generation functions
```

**`BusinessData` interface:**
```typescript
interface BusinessData {
  businessName: string
  businessType: BusinessType
  cityRegion: string
  businessDescription: string | null
  website: string | null
  gbpData: GooglePlacesResult | null  // null for Track A
}
```

**Template description pattern:**
Each business type has its own sentence structure. Variables are filled from `BusinessData`. The description targets 600-720 characters (leaving buffer under the 750-char GBP limit).

Example for `nonprofit`:
```
{{businessName}} is a nonprofit organization serving {{cityRegion}}. We {{missionBrief}} through programs focused on {{topServices}}. Our work strengthens the community by {{impactStatement}}. Located in {{cityRegion}}, we are committed to {{closingValue}}.
```

### Curated Data (`src/data/gbpContent.ts`)

All lookup tables are keyed by `BusinessType`. This data is curated once and never changes unless you update it.

**Structure per business type:**

```typescript
interface GBPTypeContent {
  categories: {
    primary: string
    secondary: string[]
    rationale: string
  }
  services: Array<{ name: string; descriptionTemplate: string }>
  qAndA: Array<{ question: string; answer: string }>
  photoChecklist: Array<{ item: string; why: string; priority: 'high' | 'medium' | 'low' }>
  postTemplates: {
    intro: { body: string; cta: string }
    event: { body: string; cta: string }
    impact: { body: string; cta: string }
  }
  reviewTemplates: {
    positive: string
    mixed: string
  }
}
```

**Business types to curate content for (8):**
`local_service`, `consultant`, `nonprofit`, `church`, `hoa`, `retail`, `creative`, `technology`

Build out `nonprofit` and `church` first (highest-frequency client types), then the rest.

---

## 🔧 Netlify Functions

All functions are TypeScript. Turso client initialized from `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.

| Function | Method | Auth Required | Purpose |
|----------|--------|--------------|---------|
| `submit-lead.ts` | POST | No | Save to `gbp_leads`, send Eric notification via Resend |
| `create-checkout-session.ts` | POST | No | Stripe $99 checkout session creation |
| `verify-payment.ts` | POST | No | Mark lead paid, write to `prospects` table |
| `get-lead.ts` | GET | Auth0 JWT | Retrieve lead by ID for internal tool pre-fill |
| `search-gbp.ts` | GET | Auth0 JWT | Google Places API lookup — returns place data |
| `generate-deliverable.ts` | POST | Auth0 JWT | Run content engine, write to `gbp_deliverables` |
| `get-deliverable-public.ts` | GET | No | Fetch deliverable by token — checks expiry |
| `get-deliverables.ts` | GET | Auth0 JWT | List all deliverables — internal dashboard |
| `get-deliverable.ts` | GET | Auth0 JWT | Single deliverable by ID — internal editor |
| `update-deliverable.ts` | PUT | Auth0 JWT | Update any content section |
| `publish-deliverable.ts` | POST | Auth0 JWT | Set status published, set published_at + expires_at |
| `restore-deliverable.ts` | POST | Auth0 JWT | Reset expires_at + 90 days, set status published |
| `scheduled-gbp-expiry.ts` | Cron | — | Daily — set expired status where expires_at < now |

**Auth pattern for protected functions:**

```typescript
import { verifyAuth0Token } from './utils/auth.ts'

export const handler = async (event) => {
  const auth = await verifyAuth0Token(event)
  if (!auth.valid) return { statusCode: 401, body: 'Unauthorized' }
  // ...
}
```

**`submit-lead.ts` behavior:**
- Validates required fields
- Inserts into `gbp_leads`
- Sends Resend notification to Eric with: business name, type, city, has GBP flag, a direct link to `/dashboard?lead={id}`
- Returns `{ id }` to client — client stores in localStorage then redirects to Stripe

**`verify-payment.ts` behavior:**
- Verifies Stripe session ID
- Marks `gbp_leads.status = 'paid'`
- Writes to `prospects` table: `{ id, business_name, contact_name, email, website, source: 'profile-optimizer', status: 'optimizer_purchased' }`
- Sends Resend confirmation to prospect
- Returns `{ leadId }`

**`search-gbp.ts` behavior:**
- Accepts `?query={business name}&location={city_region}`
- Calls Google Places Text Search API
- Returns array of up to 5 candidate results: `{ placeId, name, address, rating, userRatingsTotal, types }`
- Second call: if `?placeId={id}` is passed, fetches full Place Details: description, categories, phone, hours, photos count, website, reviews count

**`generate-deliverable.ts` behavior:**
- Accepts: `{ leadId?, clientId?, businessData, gbpPlaceId?, gbpData? }`
- Determines track: `A` if no `gbpPlaceId`, `B` if `gbpPlaceId` present
- Runs content engine
- For Track B: builds `gapAnalysis` by comparing `gbpData` fields against generated values
- Generates `token` — 16-char URL-safe random string
- Inserts to `gbp_deliverables` with `status: draft`
- Returns `{ id, token }`

**`scheduled-gbp-expiry.ts`:**
```toml
# netlify.toml
[[plugins]]
[functions]
  schedule = "@daily"
```
Sets `status = 'expired'` where `expires_at IS NOT NULL AND expires_at < unixepoch() AND status = 'published'`

---

## 🖥️ Internal Views

### `/dashboard` — DeliverableListView.vue

- Auth0 protected
- Table columns: Business Name, Track badge (A/B), Status badge, Expires, Views, Actions
- Status badge colors: draft (gray), published (green), expired (amber), archived (red)
- Filter tabs: All / Draft / Published / Expired
- "New Deliverable" button → `/dashboard/edit/new`
- If `?lead={id}` query param present → open new deliverable editor pre-seeded from that lead
- Action buttons per row: Edit, Copy URL (published only), Restore (expired only)

### `/dashboard/edit/:id` — DeliverableEditorView.vue

**Top bar:**
- Business info fields (editable): business name, contact name, email, business type, city/region
- Track badge (A/B) with manual override toggle
- Status badge

**GBP Lookup panel:**
- Search field: business name (pre-filled) + location (pre-filled)
- "Search GBP" button → calls `search-gbp.ts` → shows up to 5 candidate cards with name, address, rating
- "Use This Profile" on a candidate → fetches full Place Details, populates `gbpData`, auto-sets Track B, runs gap analysis
- "No GBP Found / Skip" → confirms Track A

**Content sections (one card each, all inline-editable):**

1. **Business Description** — textarea with live character counter (target: 600-720 / max: 750). Track B: shows current value above with its character count, generated value below.
2. **Categories** — primary (text input), secondary (tag input, up to 9), rationale (textarea)
3. **Services** — add/remove rows, each with name + description fields
4. **Q&A Bank** — add/remove pairs, question + answer fields
5. **Photo Checklist** — add/remove items, item text + why + priority select (high/medium/low)
6. **Posts** — 3 cards, each with type label, body textarea (character counter, max 1500), CTA field
7. **Review Templates** — two textareas: positive, mixed/negative
8. **Gap Analysis** (Track B only) — read-only table: Field / Current / Recommended / Priority / Notes

**Bottom action bar:**
- Save Draft
- Generate Content (re-runs engine, overwrites content)
- Publish (triggers `publish-deliverable.ts`, shows token URL on success)
- Copy URL (after published)

---

## 📄 Public Deliverable Page

**Route:** `/:token` — `DeliverablePage.vue`

No auth. On mount, calls `get-deliverable-public.ts` with token. If expired, shows neutral expiry message — no content visible. If published, renders full deliverable.

**Page structure:**

```
[Header] — Eric's logo + "Google Business Profile Optimizer"
[Hero card] — Business name, track label, "Generated on {date}"
[Section tabs or accordion] — All content sections
[Footer] — "Powered by Phifer Web Solutions" + soft CTA
```

**Sections (all tracks):**

| # | Section | Track A | Track B |
|---|---------|---------|---------|
| 1 | Profile Setup / Assessment | Step-by-step GBP setup guide with content inline at each step | Gap analysis table: current vs recommended per field |
| 2 | Business Description | Generated text + copy button + character count | Current (with count) vs optimized (with count) + copy button |
| 3 | Category Recommendations | Primary highlighted, secondaries listed, rationale | Same |
| 4 | Services | Formatted entries + copy buttons | Same |
| 5 | Q&A Bank | Formatted pairs + copy-all button | Same |
| 6 | Photo Checklist | Priority-grouped, printable layout | Same |
| 7 | First 3 Posts | Post cards with type label, body, CTA + copy buttons | Same |
| 8 | Review Templates | Positive + mixed cards + copy buttons | Same |

**Copy button behavior:** Copies section content to clipboard, shows brief "Copied!" confirmation.

**Soft CTA (footer):** "Ready to put your profile to work? When people click through to your website, what will they find?" → link to health check tool. Non-pushy — no pricing, no hard sell.

**Expiry message:** "This report is no longer active. Contact Eric Phifer to restore access." — no content visible, no indication of what was there.

**View count:** `get-deliverable-public.ts` increments `view_count` on every fetch.

---

## 💳 Payment Flow

```
/get-started form
    ↓ submit
submit-lead.ts → save to gbp_leads → Eric notification email
    ↓ returns { id }
Client stores leadId in localStorage
    ↓ redirect
Stripe $99 checkout (create-checkout-session.ts)
    ↓ payment success
/payment-success?session_id={id}
    ↓
verify-payment.ts
  → mark gbp_leads.status = 'paid'
  → write to prospects table
  → send confirmation email to prospect
    ↓
/payment-success page shows confirmation
    ↓
Eric gets second Resend notification:
  "New Profile Optimizer purchase — {business_name}"
  Link: profile-optimizer.isyourwebsitegood.com/dashboard?lead={id}
```

**`/get-started` form fields:**
- Contact Name (required)
- Business Name (required)
- Email (required)
- Phone
- Website URL
- Business Type (select — 8 options)
- City / Region (required)
- Brief description of your organization (textarea)
- "Do you have a Google Business Profile?" (yes/no toggle)
- "GBP URL" (conditional — shown only if yes)

---

## 🔗 Pipeline Connections

**Prospects table write** (on payment verification):
```sql
INSERT OR IGNORE INTO prospects (id, created_at, updated_at, business_name, contact_name, email, website_url, source, status)
VALUES (?, ?, ?, ?, ?, ?, ?, 'profile-optimizer', 'optimizer_purchased')
```
This enables application form pre-fill at `apply.ericphifer.tech?prospect={id}` using existing infrastructure.

**Client Dashboard connection:**
- `gbp_deliverables.client_id` links deliverable to existing client
- Client Dashboard queries `gbp_deliverables WHERE client_id = ?` to surface the link
- Existing clients get `expires_at = NULL` — permanent access

**AWeber:** No tag applied at this stage. Profile Optimizer sits between `lead-captured` and `application-submitted` in the lifecycle. AWeber integration is deferred — add when email nurture sequence is built.

---

## 📂 Project Structure

```
profile-optimizer/
├── netlify/
│   └── functions/
│       ├── submit-lead.ts
│       ├── create-checkout-session.ts
│       ├── verify-payment.ts
│       ├── get-lead.ts
│       ├── search-gbp.ts
│       ├── generate-deliverable.ts
│       ├── get-deliverable-public.ts
│       ├── get-deliverables.ts
│       ├── get-deliverable.ts
│       ├── update-deliverable.ts
│       ├── publish-deliverable.ts
│       ├── restore-deliverable.ts
│       ├── scheduled-gbp-expiry.ts
│       └── utils/
│           ├── auth.ts          ← Auth0 JWT verification
│           ├── db.ts            ← Turso client init
│           ├── token.ts         ← 16-char URL-safe token generator
│           └── resend.ts        ← Resend email utility
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── style.css        ← Tailwind + @theme block
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue    ← Auth0 user + logout (internal only)
│   │   │   └── PublicHeader.vue ← Logo + tool name (deliverable page)
│   │   └── ui/
│   │       ├── StatusBadge.vue
│   │       ├── CopyButton.vue
│   │       ├── TrackBadge.vue
│   │       └── CharCounter.vue
│   ├── composables/
│   │   └── useTheme.ts          ← Light/dark toggle, localStorage persist
│   ├── data/
│   │   └── gbpContent.ts        ← Curated content per business type
│   ├── lib/
│   │   └── contentEngine.ts     ← All generation functions + AI feature flag
│   ├── pages/
│   │   ├── GetStartedPage.vue   ← Public lead intake form
│   │   ├── PaymentSuccessPage.vue
│   │   ├── dashboard/
│   │   │   ├── DeliverableListView.vue
│   │   │   └── DeliverableEditorView.vue
│   │   └── DeliverablePage.vue  ← Public token-based deliverable
│   ├── router/
│   │   └── index.ts             ← Auth0 guard on /dashboard routes
│   ├── stores/
│   │   ├── useDeliverableStore.ts
│   │   └── useThemeStore.ts
│   ├── types/
│   │   └── index.ts             ← All TypeScript interfaces
│   ├── App.vue
│   └── main.ts
├── database/
│   └── migrations/
│       └── 001_profile_optimizer.sql
├── public/
│   └── favicon.svg
├── .env.example
├── netlify.toml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application ID |
| `AUTH0_SECRET` | Token verification secret |
| `TURSO_DATABASE_URL` | Shared LibSQL database URL |
| `TURSO_AUTH_TOKEN` | Database authentication |
| `STRIPE_SECRET_KEY` | Stripe payment processing |
| `STRIPE_PRICE_ID` | $99 product price ID |
| `RESEND_API_KEY` | Email delivery |
| `NOTIFICATION_EMAIL` | Eric's notification email address |
| `GOOGLE_PLACES_API_KEY` | GBP data lookup |
| `VITE_ENABLE_AI_CONTENT` | `false` — flip to `true` when AI path is ready |

---

## 🚧 Build Order

Build in this sequence — each layer depends on the previous:

1. **Project scaffold** — Vite + Vue 3 + TypeScript + Tailwind CSS 4 + Pinia + Auth0 + Netlify config
2. **Database migration** — `001_profile_optimizer.sql` with both new tables
3. **Netlify function utilities** — `db.ts`, `auth.ts`, `token.ts`, `resend.ts`
4. **Public lead flow** — `submit-lead.ts`, `create-checkout-session.ts`, `verify-payment.ts` + `/get-started` + `/payment-success` views
5. **GBP lookup** — `search-gbp.ts`
6. **Content engine + curated data** — `contentEngine.ts` + `gbpContent.ts` (nonprofit + church first)
7. **Generate/manage functions** — `generate-deliverable.ts`, `get-deliverables.ts`, `get-deliverable.ts`, `update-deliverable.ts`, `publish-deliverable.ts`, `restore-deliverable.ts`
8. **Internal dashboard** — `DeliverableListView.vue` + `DeliverableEditorView.vue`
9. **Public deliverable page** — `DeliverablePage.vue` + `get-deliverable-public.ts`
10. **Expiry cron** — `scheduled-gbp-expiry.ts`
11. **PWA config** — service worker, manifest, offline handling

---

## 📝 Key Decisions & Constraints

- **No AI dependency at launch.** Content engine uses template + curated lookup tables. Feature flag (`VITE_ENABLE_AI_CONTENT`) enables AI path later without structural changes.
- **Same-origin token URLs.** `/{token}` routes live on the same domain as the internal tool. The Vue router must handle token routes without conflicting with named routes — use a catch-all with validation that distinguishes a 16-char token from route names.
- **Shared Turso instance.** Do not create a new database. Connect to the same instance used by health-check, application-assessment, and client-dashboard.
- **Prospects table is pre-existing.** The `prospects` table schema is defined in `application-assessment/database/migrations/001_initial_schema.sql`. Use `INSERT OR IGNORE` when writing to it.
- **Auth0 is internal only.** `/get-started`, `/payment-success`, `/:token`, and `/callback` are fully public. Only `/dashboard` and `/dashboard/edit/:id` require Auth0.
- **Expiry is prospect-only.** `expires_at` is null for deliverables with a `client_id`. The cron only expires records where `expires_at IS NOT NULL`.
- **No client-side API keys.** Google Places API key stays server-side in Netlify Functions only — never in `VITE_` prefixed vars.
