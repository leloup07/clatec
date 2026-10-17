# CLATEC

**Legal Intelligence for Tokenization & Digital Assets**

Structured preliminary regulatory diagnostic for blockchain projects, token issuance, MiCA, CASP, sandbox applications, and cross-border digital asset structuring.

**Domain:** clatec.consulting · **Operator:** Aznar Legal & Compliance SLP

---

## What CLATEC Does

1. Captures qualified leads via intelligent intake with conditional logic
2. Provides structured regulatory diagnostic via AI-guided analysis
3. Identifies escalation triggers and recommends professional review
4. Converts to paid professional consultation with prepayment and KYC
5. Gives the operator a lead management dashboard

**What it does NOT do:** replace legal advice, validate documents, certify compliance, assess tax treatment, or help circumvent regulation.

---

## Architecture

```
Frontend    Next.js 14 (App Router) → Vercel
Database    PostgreSQL via Supabase
AI Layer    Anthropic Claude API (orchestrated backend)
Payments    Stripe (100% prepayment, fixed price)
Email       Resend (transactional)
Booking     Calendly / Cal.com (unlocked after KYC)
```

---

## Project Structure

```
clatec/
├── src/
│   ├── app/
│   │   ├── page.js                    # Home (with differentiation section)
│   │   ├── expertise/page.js          # Regulatory intelligence areas
│   │   ├── how-it-works/page.js       # 3-step flow
│   │   ├── use-cases/page.js          # 7 scenario cards → intake
│   │   ├── consultation/page.js       # Pricing tiers (€450 / €750)
│   │   ├── legal/page.js              # Notice, Privacy, Terms, Disclaimer
│   │   ├── nda/page.js                # NDA download + pre-signed request
│   │   ├── admin/page.js              # Lead dashboard + metrics
│   │   ├── intake/page.js             # Intake form + guided analysis chat
│   │   ├── kyc/page.js                # Post-payment client identification
│   │   └── api/
│   │       ├── intake/route.js         # Intake → Supabase + scoring + flags
│   │       ├── chat/route.js           # Guard check → Claude API
│   │       ├── consultation/route.js   # Consultation request handler
│   │       ├── admin/…                 # Admin session + lead APIs (server-side auth)
│   │       ├── checkout/route.js       # Stripe session creation
│   │       └── checkout/webhook/route.js # Stripe payment confirmation
│   ├── lib/
│   │   ├── supabase.js                # Server-only client (service role)
│   │   ├── admin-auth.js              # Admin password check + signed session cookie
│   │   ├── stripe.js / email.js       # Stripe client + tiers, Resend notifications
│   │   ├── i18n.js                    # Full bilingual content (EN/ES)
│   │   ├── system-prompt.js           # Master prompt + escalation + compound triggers
│   │   └── guard.js                   # Boundary rules + case exclusions
│   └── components/
│       ├── Navbar.jsx
│       └── Footer.jsx
├── public/legal/                      # NDA download
├── docs/
│   ├── clatec-schema.sql              # Full database schema
│   └── prototype.jsx                  # Interactive prototype
├── legal/                             # Source NDA document
├── .env.example
└── package.json
```

---

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in keys
# Run docs/clatec-schema.sql in Supabase SQL editor
npm run dev
```

---

## Key Systems

### Escalation Logic (`system-prompt.js`)

Three layers: individual flags → compound triggers → escalation level.

**13 individual flags** with severity (critical/high/medium): retail investors, custody, ART/EMT, multi-jurisdiction, sandbox, exchange, advisory, CASP services, public marketing, large/significant transaction size.

**5 compound triggers** that weight more than the sum of parts:
- `retail + custody` → critical (most stringent MiCA requirements)
- `stableValue + large issuance` → critical (significant ART/EMT thresholds)
- `sandbox + crossborder` → critical (jurisdiction-specific permissions)
- `CASP + retail` → critical (full authorization + enhanced conduct)
- `exchange + custody` → high (potential DLT infrastructure)

**Escalation levels:** soft (1-2 flags) → medium (3-4 or 1 compound) → strong (5+ or critical compound). Strong escalation requires assumption confirmation before output.

### Case Guard (`guard.js`)

Six boundary categories enforced on every message:
- Definitive legal advice requests → soft block + redirect
- Document review/validation → soft block + redirect
- Regulatory evasion intent → hard block (second attempt = permanent block)
- Pure tax queries → soft block + scope exclusion
- Enforcement/sanctions matters → hard block + immediate exit
- Extreme risk with insufficient maturity → bypass to professional review

### Payment Flow

```
Select tier → Stripe checkout → Payment confirmed
→ KYC form (post-payment, pre-scheduling)
→ Calendly unlocked → Consultation scheduled
```

Two tiers: Structured Review (€450) and Complex Matter Review (€750). Fixed price, not hourly. Prepayment required. Calendar booking disabled until KYC complete.

### KYC

Activated ONLY when paid professional relationship begins. Not during intake, not during chat.
- Individuals: name, ID document, country of residence
- Entities: legal name, incorporation, representative, beneficial ownership (>25%)
- Risk flags: PEP status, non-EU jurisdictions

### Admin Panel (`/admin`)

Server-side login (HttpOnly cookie) → lead list with filters (status, matter type, urgency) → lead detail with full intake, chat history, internal notes, status management → metrics dashboard (totals, conversion rate, categories, urgency distribution).

---

## Database

Schema in `docs/clatec-schema.sql`. 14 tables + 2 views.

Core: `leads`, `conversations`, `messages`, `consultation_requests`, `consent_log`, `audit_log`
Conditional intake: `intake_tokenization`, `intake_mica`, `intake_casp`, `intake_sandbox`
Operations: `email_log`, `admin_users`, `analytics_events`, `knowledge_base`
Views: `v_lead_overview`, `v_dashboard_metrics`

---

## Branding

**Visible:** CLATEC · clatec.consulting
**Discreet (footer/legal only):** "Operated by Aznar Legal & Compliance SLP" · "Supported by qualified legal professionals admitted in Spain and England & Wales"
**Never prominent:** Enrique Aznar's name, "division of Aznar Legal"

---

## Deploy

See **[DEPLOY.md](DEPLOY.md)** (Spanish): Supabase schema, environment variables, Vercel, Stripe webhook, and the Cloudflare DNS cutover from GitHub Pages.

Security model: the browser never talks to Supabase; all data access goes through the API routes with the service role key, and RLS denies everything to the public keys. The admin panel authenticates on the server (`ADMIN_PASSWORD` + HMAC-signed HttpOnly cookie).

---

## License

Proprietary. © Aznar Legal & Compliance SLP. All rights reserved.
