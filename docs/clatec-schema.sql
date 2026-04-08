-- ═══════════════════════════════════════════════════════════════════
-- CLATEC — Database Schema (PostgreSQL / Supabase)
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────────────

CREATE TYPE lead_status AS ENUM (
  'new',
  'under_review',
  'consultation_requested',
  'awaiting_response',
  'closed',
  'not_qualified',
  'archived'
);

CREATE TYPE matter_type AS ENUM (
  'asset_tokenization',
  'token_issuance',
  'mica_assessment',
  'casp_issue',
  'governance_compliance',
  'cross_border_structuring',
  'sandbox_regulatory_innovation',
  'other'
);

CREATE TYPE project_stage AS ENUM (
  'early_idea',
  'structuring_phase',
  'documentation_in_progress',
  'ready_to_launch',
  'already_operating'
);

CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');

CREATE TYPE consultation_status AS ENUM (
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

-- ─── LEADS ───────────────────────────────────────────────────────────

CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Identity
  first_name      TEXT NOT NULL,
  last_name       TEXT,
  email           TEXT NOT NULL,
  company         TEXT,
  role_position   TEXT,

  -- Jurisdiction
  country_residence     TEXT,
  main_jurisdiction     TEXT,
  other_jurisdictions   TEXT,

  -- Matter classification
  matter_type     matter_type NOT NULL,
  project_stage   project_stage,
  objective       TEXT,
  description     TEXT NOT NULL,
  urgency         urgency_level DEFAULT 'medium',

  -- Internal scoring (computed by backend)
  complexity_score      INTEGER DEFAULT 0 CHECK (complexity_score BETWEEN 0 AND 10),
  escalation_flag       BOOLEAN DEFAULT false,
  consultation_intent   INTEGER DEFAULT 0 CHECK (consultation_intent BETWEEN 0 AND 10),

  -- Workflow
  status          lead_status NOT NULL DEFAULT 'new',
  assigned_to     TEXT,
  internal_notes  TEXT,
  follow_up_date  DATE,

  -- Language
  language        TEXT DEFAULT 'en' CHECK (language IN ('en', 'es'))
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_matter_type ON leads(matter_type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_urgency ON leads(urgency);
CREATE INDEX idx_leads_escalation ON leads(escalation_flag) WHERE escalation_flag = true;

-- ─── CONDITIONAL INTAKE: TOKENIZATION ────────────────────────────────

CREATE TABLE intake_tokenization (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  asset_type              TEXT,
  economic_return         TEXT,   -- yes / no / unsure
  investors_expected      TEXT,
  investor_type           TEXT,   -- retail / professional / unknown
  issuance_size           TEXT,
  entity_exists           TEXT,
  documentation_exists    TEXT,

  UNIQUE(lead_id)
);

-- ─── CONDITIONAL INTAKE: MiCA ────────────────────────────────────────

CREATE TABLE intake_mica (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  intended_token_type     TEXT,
  refers_to_assets        TEXT,
  stable_value            TEXT,
  crypto_services         TEXT,
  target_jurisdictions    TEXT,
  public_marketing        TEXT,

  UNIQUE(lead_id)
);

-- ─── CONDITIONAL INTAKE: CASP ────────────────────────────────────────

CREATE TABLE intake_casp (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  service_type            TEXT,
  custody_involved        TEXT,
  exchange_involved       TEXT,
  advisory_involved       TEXT,
  client_type             TEXT,
  incorporation_place     TEXT,

  UNIQUE(lead_id)
);

-- ─── CONDITIONAL INTAKE: SANDBOX ─────────────────────────────────────

CREATE TABLE intake_sandbox (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  target_sandbox          TEXT,   -- Spanish FS / FCA DSS / DLT Pilot / Other
  innovation_element      TEXT,
  regulatory_barrier      TEXT,
  mvp_exists              TEXT,
  intended_market         TEXT,
  supervisory_angle       TEXT,

  UNIQUE(lead_id)
);

-- ─── CONVERSATIONS ───────────────────────────────────────────────────

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Metadata
  message_count   INTEGER DEFAULT 0,
  auto_summary    TEXT,           -- AI-generated summary, editable by admin
  escalation_recommended BOOLEAN DEFAULT false,
  escalation_reasons     TEXT[],  -- array of reasons

  UNIQUE(lead_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  
  -- For assistant messages: structured output blocks
  matter_summary           TEXT,
  legal_considerations     TEXT,
  information_required     TEXT,
  risk_areas               TEXT,
  recommended_next_step    TEXT
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- ─── CONSULTATION REQUESTS ───────────────────────────────────────────

CREATE TABLE consultation_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Request details
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  company         TEXT,
  matter_description TEXT,
  preferred_slot  TEXT,

  -- Status and workflow
  status          consultation_status NOT NULL DEFAULT 'requested',
  scheduled_at    TIMESTAMPTZ,
  duration_min    INTEGER DEFAULT 60,
  
  -- Payment (prepared for Phase 2)
  payment_required    BOOLEAN DEFAULT false,
  payment_amount      DECIMAL(10,2),
  payment_currency    TEXT DEFAULT 'EUR',
  stripe_payment_id   TEXT,
  payment_status      TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),

  -- Admin
  internal_notes  TEXT,
  follow_up_sent  BOOLEAN DEFAULT false
);

CREATE INDEX idx_consultations_status ON consultation_requests(status);
CREATE INDEX idx_consultations_lead ON consultation_requests(lead_id);

-- ─── CONSENT LOG ─────────────────────────────────────────────────────

CREATE TABLE consent_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  consent_type    TEXT NOT NULL,  -- 'privacy_policy', 'terms_of_use', 'preliminary_guidance_disclaimer', 'chat_usage'
  version         TEXT NOT NULL,  -- version identifier of the document accepted
  ip_address      TEXT,
  user_agent      TEXT,
  accepted        BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_consent_lead ON consent_log(lead_id);

-- ─── AUDIT LOG ───────────────────────────────────────────────────────

CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  entity_type     TEXT NOT NULL,  -- 'lead', 'consultation', 'conversation', etc.
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,  -- 'created', 'updated', 'status_changed', 'viewed', etc.
  actor           TEXT,           -- admin user or 'system'
  old_value       JSONB,
  new_value       JSONB,
  metadata        JSONB
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ─── EMAIL LOG ───────────────────────────────────────────────────────

CREATE TABLE email_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
  recipient       TEXT NOT NULL,
  template        TEXT NOT NULL,  -- 'intake_confirmation', 'summary_sent', 'consultation_confirmation', 'booking_confirmation', 'follow_up'
  subject         TEXT,
  status          TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  provider_id     TEXT,           -- Resend message ID
  metadata        JSONB
);

-- ─── ADMIN USERS ─────────────────────────────────────────────────────

CREATE TABLE admin_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'reviewer', 'readonly')),
  active          BOOLEAN DEFAULT true,
  last_login      TIMESTAMPTZ
);

-- ─── ANALYTICS EVENTS ────────────────────────────────────────────────

CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  event_type      TEXT NOT NULL,  -- 'page_view', 'start_analysis_click', 'intake_completed', 'chat_started', 'consultation_requested', 'booking_completed', 'payment_completed'
  lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
  page            TEXT,
  metadata        JSONB,
  session_id      TEXT,
  ip_address      TEXT,
  user_agent      TEXT
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ─── KNOWLEDGE BASE (Phase 2) ────────────────────────────────────────

CREATE TABLE knowledge_base (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  category        TEXT NOT NULL,
  subcategory     TEXT,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  language        TEXT DEFAULT 'en',
  active          BOOLEAN DEFAULT true,
  version         INTEGER DEFAULT 1
);

CREATE INDEX idx_kb_category ON knowledge_base(category, active);

-- ─── HELPER FUNCTIONS ────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER consultation_requests_updated_at BEFORE UPDATE ON consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY (Supabase) ──────────────────────────────────

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies (adjust for your auth setup)
CREATE POLICY admin_leads ON leads FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_conversations ON conversations FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_messages ON messages FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Public insert for lead creation (intake form)
CREATE POLICY public_insert_leads ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY public_insert_consent ON consent_log FOR INSERT
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- VIEWS (Admin Dashboard)
-- ═══════════════════════════════════════════════════════════════════

CREATE VIEW v_lead_overview AS
SELECT
  l.id,
  l.created_at,
  l.first_name || ' ' || COALESCE(l.last_name, '') AS full_name,
  l.email,
  l.company,
  l.matter_type,
  l.urgency,
  l.status,
  l.complexity_score,
  l.escalation_flag,
  l.main_jurisdiction,
  c.message_count,
  c.auto_summary,
  c.escalation_recommended,
  cr.status AS consultation_status,
  cr.scheduled_at
FROM leads l
LEFT JOIN conversations c ON c.lead_id = l.id
LEFT JOIN consultation_requests cr ON cr.lead_id = l.id
ORDER BY l.created_at DESC;

CREATE VIEW v_dashboard_metrics AS
SELECT
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE status = 'consultation_requested') AS total_consultations_requested,
  COUNT(*) FILTER (WHERE escalation_flag = true) AS total_escalated,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'consultation_requested')::DECIMAL /
    NULLIF(COUNT(*), 0) * 100, 1
  ) AS conversion_rate_pct,
  COUNT(*) FILTER (WHERE matter_type = 'asset_tokenization') AS cat_tokenization,
  COUNT(*) FILTER (WHERE matter_type = 'mica_assessment') AS cat_mica,
  COUNT(*) FILTER (WHERE matter_type = 'casp_issue') AS cat_casp,
  COUNT(*) FILTER (WHERE matter_type = 'sandbox_regulatory_innovation') AS cat_sandbox,
  COUNT(*) FILTER (WHERE matter_type = 'cross_border_structuring') AS cat_cross_border,
  COUNT(*) FILTER (WHERE urgency = 'high') AS urgency_high,
  COUNT(*) FILTER (WHERE urgency = 'medium') AS urgency_medium,
  COUNT(*) FILTER (WHERE urgency = 'low') AS urgency_low
FROM leads;
