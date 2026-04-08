# CLATEC

**Legal Intelligence for Tokenization & Digital Assets**

Structured preliminary legal guidance for blockchain projects, token issuance, MiCA, CASP, sandbox applications, and cross-border digital asset structuring.

**Domain:** [clatec.consulting](https://clatec.consulting)  
**Operator:** Aznar Legal & Compliance SLP

---

## Project Overview

CLATEC is a legal-tech platform that provides structured preliminary legal guidance in the digital assets space. It serves as a commercial intake channel, diagnostic system, and conversion mechanism to professional legal consultation.

### What It Does
1. Explains what CLATEC is and who it serves
2. Captures qualified leads via an intelligent intake form
3. Orders the user's case through conditional intake logic
4. Provides structured preliminary orientation via AI-guided chat
5. Converts to professional consultation request

### What It Does NOT Do
- Replace individualized legal advice
- Guarantee regulatory compliance
- Automate legal document generation (Phase 2+)

---

## Architecture

```
Frontend:   Next.js 14 (App Router) → Vercel
Database:   PostgreSQL via Supabase
AI Layer:   Anthropic Claude API (orchestrated via backend)
Email:      Resend (transactional)
Payments:   Stripe (Phase 2, infrastructure ready)
Booking:    Calendly / Cal.com embed
Analytics:  Google Analytics or privacy-friendly alternative
```

---

## Project Structure

```
clatec/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout, fonts, metadata
│   │   ├── page.js                # Home page
│   │   ├── globals.css            # Design system variables
│   │   ├── expertise/page.js      # Areas of expertise
│   │   ├── how-it-works/page.js   # How it works flow
│   │   ├── use-cases/page.js      # Use case scenarios
│   │   ├── consultation/page.js   # Request consultation form
│   │   ├── legal/page.js          # Legal pages (Notice, Privacy, Terms, Disclaimer)
│   │   ├── intake/page.js         # Intelligent intake form
│   │   ├── chat/page.js           # Guided AI chat
│   │   ├── nda/page.js            # NDA download and request page
│   │   └── api/
│   │       ├── intake/route.js    # Intake submission → Supabase + scoring
│   │       ├── chat/route.js      # Chat orchestration → Claude API
│   │       ├── consultation/route.js  # Consultation request
│   │       └── nda/route.js       # NDA request handling
│   ├── lib/
│   │   ├── supabase.js            # Supabase client (anon + service role)
│   │   └── system-prompt.js       # Master system prompt + escalation logic
│   └── components/                # Shared UI components (to build)
├── public/
│   └── legal/
│       └── CLATEC-NDA-Bilateral-EN-ES.docx
├── docs/
│   ├── clatec-schema.sql          # Full database schema
│   └── clatec-system-prompt.md    # Expanded system prompt documentation
├── legal/
│   └── CLATEC-NDA-Bilateral-EN-ES.docx  # Source NDA document
├── .env.example                   # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works for development)
- Anthropic API key
- Resend account (for transactional email)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/clatec.git
cd clatec

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Initialize database (run in Supabase SQL editor)
# Paste contents of docs/clatec-schema.sql

# Run development server
npm run dev
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Point clatec.consulting DNS to Vercel
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `RESEND_API_KEY` | Phase 1 | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Phase 1 | Sender email address |
| `STRIPE_SECRET_KEY` | Phase 2 | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Phase 2 | Stripe publishable key |
| `NEXT_PUBLIC_CALENDLY_URL` | Phase 1 | Calendly booking URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL |
| `ADMIN_EMAIL` | Yes | Admin notification email |

---

## Database

The schema is in `docs/clatec-schema.sql`. Key tables:

| Table | Purpose |
|-------|---------|
| `leads` | Core lead records with scoring |
| `intake_tokenization` | Conditional: tokenization-specific fields |
| `intake_mica` | Conditional: MiCA-specific fields |
| `intake_casp` | Conditional: CASP-specific fields |
| `intake_sandbox` | Conditional: sandbox-specific fields |
| `conversations` | Chat session metadata + auto-summary |
| `messages` | Individual chat messages |
| `consultation_requests` | Consultation bookings + payment status |
| `consent_log` | GDPR consent records with versioning |
| `audit_log` | All entity changes |
| `email_log` | Transactional email tracking |
| `admin_users` | Admin panel authentication |
| `analytics_events` | Funnel analytics |
| `knowledge_base` | Editable reference content (Phase 2) |

### Admin Views

- `v_lead_overview` — full lead dashboard with conversation and consultation status
- `v_dashboard_metrics` — aggregate KPIs (leads, conversions, categories, urgency distribution)

---

## Chat System

### System Prompt

The master system prompt is in `src/lib/system-prompt.js`. It includes:

- Behavioral rules (what the bot must/must not do)
- Tone guidelines
- Conversation flow structure (opening → mid → structured output)
- Five-block output format (Summary, Considerations, Missing Info, Risks, Next Step)
- 13 mandatory escalation triggers
- Subject matter knowledge (MiCA, CASP, sandboxes, cross-border, AML)
- Bilingual handling (EN/ES)
- Disclaimer injection

### Escalation Logic

The system automatically flags leads requiring human review when detecting:
- Retail investor exposure
- ART/EMT (stablecoin) characteristics
- Custody/exchange/advisory services
- Multi-jurisdiction structures
- Large transactions (>€5M)
- Sandbox applications
- Fund-like structures
- AML/sanctions angles

Flags are computed at intake (`computeEscalationFlags()`) and updated during chat.

---

## NDA System

A bilateral Mutual Non-Disclosure Agreement is available at `/nda`:

- **Download**: users can download the .docx directly
- **Pre-signed request**: users can request a copy pre-signed by CLATEC
- **Bilingual**: English and Spanish in a single document
- **Scope**: covers business plans, legal strategies, token economics, technical architecture, regulatory approaches
- **Term**: 2 years + 3 years post-termination survival
- **Governing law**: Spanish law, Barcelona jurisdiction

The NDA source is in `legal/CLATEC-NDA-Bilateral-EN-ES.docx` and served from `public/legal/`.

---

## Internationalization

The platform is bilingual (English/Spanish) with:
- Application-level language toggle (not i18n middleware)
- All content stored in translation objects
- Language persisted in lead record
- Chat adapts language based on intake
- Legal pages available in both languages

Architecture is prepared for additional languages in Phase 3.

---

## Branding Guidelines

### Visible
- Brand: **CLATEC**
- Domain: clatec.consulting

### Discreet (footer, legal pages only)
- "Operated by Aznar Legal & Compliance SLP"
- "Supported by qualified legal professionals admitted in Spain and England & Wales"

### Never prominent
- Enrique Aznar's name
- "A division of Aznar Legal"
- Aznar Legal as central branding

### Design Direction
- Dark base (#070b14) / Petrol blue accent (#2d8a9a)
- Typography: Sora (display) + DM Sans (body)
- Premium legal-tech aesthetic — NOT crypto retail, NOT traditional law firm
- Clean, structured, generous whitespace

---

## Roadmap

### Phase 1 (MVP)
- [x] Design system and visual identity
- [x] Public website (all pages, bilingual)
- [x] Intelligent intake form with conditional logic
- [x] AI chat flow with system prompt
- [x] Admin basics (via Supabase dashboard + SQL views)
- [x] Email flow infrastructure
- [x] Legal pages (EN/ES)
- [x] Consultation request flow
- [x] NDA download and request
- [x] Database schema with scoring and escalation

### Phase 2
- [ ] Calendly/Cal.com calendar integration refined
- [ ] Stripe payment activation (consultation prepayment)
- [ ] Smarter lead scoring (ML-enhanced)
- [ ] Editable knowledge base
- [ ] Advanced analytics dashboard
- [ ] Document upload flow
- [ ] Custom admin panel

### Phase 3
- [ ] Client portal (returning users)
- [ ] Structured report generation (PDF output)
- [ ] CRM integrations
- [ ] Advanced workflow automations
- [ ] Additional languages

---

## Developer Decisions to Confirm

Before starting implementation, confirm:

1. **Exact stack versions** — Next.js 14 vs 15, React 18 vs 19
2. **Time estimate per phase** — Phase 1 target timeline
3. **Admin panel approach** — Supabase dashboard Phase 1 vs custom panel
4. **Booking solution** — Calendly vs Cal.com
5. **Email templates** — design and content for 5 transactional emails
6. **Deployment strategy** — Vercel project structure, preview deployments
7. **Logging** — Vercel logs vs external (Axiom, Logflare)
8. **Monthly cost estimate** — Supabase (free → Pro at €25/mo), Vercel (free → Pro at €20/mo), Anthropic (usage-based), Resend (free tier: 3K emails/mo), Calendly (free or €10/mo)

---

## Legal Compliance Checklist

- [x] Preliminary guidance disclaimer in Terms, chat, and footer
- [x] No attorney-client relationship disclaimer
- [x] Operator identification (Aznar Legal & Compliance SLP)
- [x] GDPR-compliant privacy policy
- [x] Consent logging with timestamps and versions
- [x] Cookie policy (essential only)
- [x] Data retention aligned with RGPD
- [x] Right to object and erasure procedures documented

---

## License

Proprietary. © Aznar Legal & Compliance SLP. All rights reserved.
