// CLATEC Case Guard v1.0
// Implements boundary rules: what CLATEC will NOT process.
// Rule: if the system wouldn't be comfortable defending that output
// before a regulator or senior colleague, it must not produce it.

// ─── KEYWORD PATTERNS ────────────────────────────────────────────────

const PATTERNS = {
  // 2.1 — Requests for definitive legal advice
  definitive_advice: {
    en: [/\bis\s+(it|this)\s+legal\b/i, /\bconfirm\s+(compliance|that\s+we\s+comply)/i, /\bcan\s+we\s+operate\s+without/i, /\bguarantee/i, /\bassure\s+(me|us)/i, /\bare\s+we\s+(compliant|allowed)/i, /\bis\s+this\s+(permitted|allowed|lawful)/i],
    es: [/\bes\s+legal\b/i, /\bcumple\b/i, /\bconfirm(a|ar)\b/i, /\bpermitido\b/i, /\basegurar\b/i, /\bpodemos\s+operar\s+sin\b/i, /\bgarantiz/i],
  },
  // 2.2 — Document review requests
  document_review: {
    en: [/\breview\s+(this|my|the)\s+(contract|whitepaper|document|statutes|agreement)/i, /\battach/i, /\buploaded?\b/i, /\bvalidate\s+(this|my|the)/i, /\bcheck\s+(this|my)\s+(document|contract)/i],
    es: [/\brevisa(r)?\s+(este|mi|el|los)\b/i, /\badjunto\b/i, /\bvalidar\b/i, /\bsubido\b/i, /\bcomprobar\s+(este|mi)\b/i],
  },
  // 2.4 — Regulatory evasion intent
  evasion: {
    en: [/\bavoid\s+(mica|regulation|casp|licensing|authorization)/i, /\bcircumvent/i, /\bbypass\s+(regulation|rules)/i, /\bnot\s+be\s+(a\s+)?casp/i, /\bwhere\s+(regulation|rules?)\s+(don'?t|do\s+not)\s+apply/i, /\bno\s+regulation/i],
    es: [/\bevitar\s+(mica|regulaci|casp|licencia)/i, /\besquivar/i, /\bsaltarse\b/i, /\bno\s+apli(car|que)\b/i, /\beludir\b/i, /\bpa[ií]s\s+(donde|sin)\s+(no\s+)?(aplique|haya)\s+regulaci/i],
  },
  // 2.5 — Pure tax/accounting queries
  tax_only: {
    en: [/\bhow\s+(is|are|does)\s+(it|the\s+token|this)\s+taxed/i, /\btax\s+(treatment|optimization|planning|implications)\b/i, /\bwhat\s+tax(es)?\b/i, /\bcapital\s+gains\s+tax/i],
    es: [/\bc[oó]mo\s+tributa/i, /\bimpuesto/i, /\bfiscal(idad)?\b/i, /\boptimizaci[oó]n\s+fiscal/i, /\btributaci[oó]n/i],
  },
  // 2.6 — Enforcement/sanctions/contentious
  enforcement: {
    en: [/\bsanction(s|ed)?\s+(by|from|against)/i, /\benforcemen(t)?\s+action/i, /\bregulat(or|ory)\s+(investigation|inquiry|proceeding)/i, /\binspection\b/i, /\bpenalt(y|ies)/i, /\bfine(d|s)?\s+by/i],
    es: [/\bexpediente/i, /\bsanci[oó]n/i, /\brequerimiento/i, /\binspecci[oó]n/i, /\bprocedimiento\s+sancionador/i, /\bmulta\b/i],
  },
};

// ─── GUARD RESULT TYPES ──────────────────────────────────────────────

// hard_block: system MUST NOT produce analysis. Force exit.
// soft_block: system should redirect but can continue if user clarifies.
// warn: system should note limitation but can proceed.

export function evaluateMessage(message, language = 'en') {
  const lang = language === 'es' ? 'es' : 'en';
  const results = [];

  // Check each pattern category
  for (const [category, patterns] of Object.entries(PATTERNS)) {
    const langPatterns = patterns[lang] || patterns.en;
    for (const pattern of langPatterns) {
      if (pattern.test(message)) {
        results.push({ category, severity: SEVERITY_MAP[category] });
        break; // one match per category is enough
      }
    }
  }

  return results;
}

const SEVERITY_MAP = {
  definitive_advice: 'soft_block',
  document_review: 'soft_block',
  evasion: 'hard_block',
  tax_only: 'soft_block',
  enforcement: 'hard_block',
};

// ─── INTAKE-LEVEL GUARD ──────────────────────────────────────────────
// Check whether the intake itself indicates a case that should bypass
// preliminary analysis entirely (2.3 + 2.7)

export function evaluateIntake(intake, flags, compounds) {
  const blocks = [];

  // 2.3 — Critical fields missing for the matter type
  const matterType = intake.matterType?.toLowerCase() || '';

  if (matterType.includes('token') || matterType.includes('issuance') || matterType.includes('emisión')) {
    const required = ['investorType', 'economicReturn'];
    const missing = required.filter(f => !intake[f] || intake[f] === '' || intake[f] === '—');
    if (missing.length > 0) {
      blocks.push({
        type: 'incomplete_data',
        severity: 'warn',
        missing,
        message_en: 'Critical classification data is missing. The regulatory mapping cannot be reliable without investor type and economic return information.',
        message_es: 'Faltan datos críticos de clasificación. El mapeo regulatorio no puede ser fiable sin información sobre tipo de inversor y retorno económico.',
      });
    }
  }

  if (matterType.includes('casp') || matterType.includes('cuestión')) {
    const required = ['custodyInvolved', 'serviceType'];
    const missing = required.filter(f => !intake[f] || intake[f] === '' || intake[f] === '—');
    if (missing.length > 0) {
      blocks.push({
        type: 'incomplete_data',
        severity: 'warn',
        missing,
        message_en: 'Critical service characterization data is missing. CASP assessment requires at minimum the service type and custody involvement.',
        message_es: 'Faltan datos críticos de caracterización del servicio. La evaluación CASP requiere como mínimo el tipo de servicio e implicación de custodia.',
      });
    }
  }

  // 2.7 — Extreme risk with insufficient maturity
  const criticalFlags = flags.filter(f => f.severity === 'critical');
  const entityMissing = intake.entityExists?.toLowerCase() === 'no' || intake.entityExists?.toLowerCase() === 'no';

  if (criticalFlags.length >= 2 && entityMissing) {
    blocks.push({
      type: 'extreme_risk_immature',
      severity: 'hard_block',
      message_en: 'The risk profile identified — including ' + criticalFlags.map(f => f.label_en).join(', ') + ' — combined with the absence of a legal entity, means preliminary mapping is not appropriate. Direct professional review is recommended.',
      message_es: 'El perfil de riesgo identificado — incluyendo ' + criticalFlags.map(f => f.label_es).join(', ') + ' — combinado con la ausencia de entidad jurídica, hace que el mapeo preliminar no sea apropiado. Se recomienda revisión profesional directa.',
    });
  }

  if (compounds.filter(c => c.severity === 'critical').length >= 2 && entityMissing) {
    blocks.push({
      type: 'extreme_compound_risk',
      severity: 'hard_block',
      message_en: 'Multiple critical regulatory combinations have been identified without basic corporate structure in place. This matter requires professional legal structuring, not preliminary mapping.',
      message_es: 'Se han identificado múltiples combinaciones regulatorias críticas sin estructura societaria básica. Este asunto requiere estructuración jurídica profesional, no mapeo preliminar.',
    });
  }

  return blocks;
}

// ─── RESPONSE TEMPLATES ──────────────────────────────────────────────

export const GUARD_RESPONSES = {
  definitive_advice: {
    en: 'CLATEC does not issue definitive determinations of legality or compliance. It can identify the applicable frameworks and factors that affect that conclusion, but cannot confirm compliance. For a definitive assessment, professional legal review is required.',
    es: 'CLATEC no emite determinaciones definitivas de legalidad o cumplimiento. Puede identificar los marcos y factores aplicables que afectan esa conclusión, pero no puede confirmar cumplimiento. Para una evaluación definitiva, se requiere revisión jurídica profesional.',
  },
  document_review: {
    en: 'CLATEC does not review, validate, or analyze legal documents. It can identify which aspects of your documentation should be examined by a qualified professional and what regulatory considerations apply to the document type. For document review, professional engagement is required.',
    es: 'CLATEC no revisa, valida ni analiza documentos jurídicos. Puede identificar qué aspectos de tu documentación deberían ser examinados por un profesional cualificado y qué consideraciones regulatorias aplican al tipo de documento. Para revisión documental, se requiere compromiso profesional.',
  },
  evasion: {
    en: 'CLATEC explains how regulation applies — not how to avoid it. If your objective is to understand the regulatory framework applicable to your structure, we can help map that. If the objective is to circumvent applicable regulation, this falls outside the scope and purpose of this system.',
    es: 'CLATEC explica cómo aplica la regulación — no cómo esquivarla. Si tu objetivo es comprender el marco regulatorio aplicable a tu estructura, podemos ayudar a mapearlo. Si el objetivo es eludir la regulación aplicable, esto queda fuera del alcance y propósito de este sistema.',
  },
  tax_only: {
    en: 'Tax treatment is outside the scope of CLATEC. This system focuses on regulatory and legal structuring considerations. For tax analysis, we recommend engaging a qualified tax advisor.',
    es: 'El tratamiento fiscal queda fuera del alcance de CLATEC. Este sistema se centra en consideraciones regulatorias y de estructuración jurídica. Para análisis fiscal, recomendamos contratar un asesor fiscal cualificado.',
  },
  enforcement: {
    en: 'Matters involving regulatory proceedings, enforcement actions, sanctions, or investigations require immediate professional legal intervention. CLATEC is not designed for these cases. We strongly recommend engaging qualified legal counsel without delay.',
    es: 'Los asuntos que implican procedimientos regulatorios, acciones de enforcement, sanciones o investigaciones requieren intervención jurídica profesional inmediata. CLATEC no está diseñado para estos casos. Recomendamos encarecidamente contratar asesoramiento jurídico cualificado sin demora.',
  },
  incomplete_data: {
    en: 'With the information currently provided, a reliable regulatory mapping is not possible. The following critical information is needed: ',
    es: 'Con la información actualmente proporcionada, no es posible realizar un mapeo regulatorio fiable. Se necesita la siguiente información crítica: ',
  },
  extreme_risk_immature: {
    en: 'Given the risk profile identified, preliminary diagnostic mapping is not appropriate for this matter. Direct professional review is recommended.',
    es: 'Dado el perfil de riesgo identificado, el mapeo diagnóstico preliminar no es apropiado para este asunto. Se recomienda revisión profesional directa.',
  },
};

// ─── EVASION TRACKING ────────────────────────────────────────────────
// Track evasion attempts per session. Second attempt = hard block.

export function trackEvasion(sessionState, detected) {
  if (!detected) return sessionState;
  const count = (sessionState.evasionCount || 0) + 1;
  return {
    ...sessionState,
    evasionCount: count,
    evasionBlocked: count >= 2,
  };
}
