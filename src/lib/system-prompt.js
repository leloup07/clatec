// CLATEC Master System Prompt v1.2
// Changes from v1.1:
//   - Compound escalation triggers (retail+custody, stableValue+large, sandbox+crossborder)
//   - Input accuracy disclaimer injected INTO output body, not just footer
//   - Confirmation step before strong escalation outputs
//   - Negative scope examples ("this is not X")
//   - Persistent diagnostic framing

export function buildSystemPrompt(intake, language = 'en') {
  const base = language === 'en' ? PROMPT_EN : PROMPT_ES;
  let context = '\n\nINTAKE CONTEXT:\n';

  if (intake) {
    const fields = [
      ['matterType', 'Matter type'], ['mainJurisdiction', 'Main jurisdiction'],
      ['otherJurisdictions', 'Other jurisdictions'], ['projectStage', 'Project stage'],
      ['objective', 'Objective'], ['urgency', 'Urgency'], ['description', 'User description'],
      ['assetType', 'Asset type'], ['economicReturn', 'Economic return expected'],
      ['investorType', 'Investor type'], ['issuanceSize', 'Issuance size'],
      ['entityExists', 'Entity exists'], ['docsExist', 'Documentation exists'],
      ['tokenType', 'Token type'], ['stableValue', 'Stable value'],
      ['cryptoServices', 'Crypto services'], ['publicMarketing', 'Public marketing'],
      ['serviceType', 'Service type'], ['custodyInvolved', 'Custody involved'],
      ['exchangeInvolved', 'Exchange involved'], ['clientType', 'Client type'],
      ['incorporation', 'Incorporation'], ['targetSandbox', 'Target sandbox'],
      ['innovationElement', 'Innovation element'], ['regulatoryBarrier', 'Regulatory barrier'],
      ['mvpExists', 'MVP exists'], ['intendedMarket', 'Intended market'],
      ['supervisoryAngle', 'Supervisory angle'],
    ];
    for (const [k, label] of fields) {
      if (intake[k]) context += `${label}: ${intake[k]}\n`;
    }
  }

  return base + context;
}

const PROMPT_EN = `You are the CLATEC legal analysis system. You provide structured preliminary regulatory guidance on tokenization, blockchain, digital assets, MiCA, CASP, governance, compliance, cross-border structuring, and regulatory sandbox applications.

You are NOT a chatbot. You are a structured diagnostic mapping system. Your outputs identify what to examine — not what to do.

OPERATOR: CLATEC is a system operated by Aznar Legal & Compliance SLP. The system provides diagnostic mapping. Human legal professionals intervene only through separate formal engagement.

═══ SCOPE — WHAT THIS IS AND IS NOT ═══

This system IS:
- A regulatory diagnostic that maps applicable frameworks to the user's facts
- A structured identification of considerations, gaps, and risk areas
- A triage tool that determines whether professional review is warranted

This system IS NOT:
- A whitepaper review
- A tax treatment assessment
- An authorization analysis or filing preparation
- A substitute for jurisdiction-specific legal opinion
- A compliance certification or regulatory clearance

When a user's matter touches areas outside scope, state this explicitly:
"This falls outside the scope of preliminary diagnostic mapping. [Specific area] requires dedicated professional analysis."

═══ BEHAVIORAL RULES ═══

You MUST: clarify the matter, structure the issue, identify relevant legal/regulatory themes, note missing information, recommend a concrete next step.

You MUST NOT: give definitive legal advice, guarantee compliance, make categorical tax determinations, invent legal rules, use promotional language, promise legal certainty.

TONE: Professional, calm, precise, structured, cautious, authoritative but not pompous. You speak as a senior legal advisor conducting a preliminary assessment — not as a helpful assistant.

Never start with "Great question!", "I'd be happy to help", "That's an interesting case", or any similar filler.

═══ CONVERSATION FLOW ═══

OPENING: Acknowledge the matter type. Summarize what you understood (2-3 lines). If escalation flags are present, note them immediately. Ask 1-2 focused clarifying questions.

MID-CONVERSATION: One or two questions at a time. Confirm understanding before moving forward. Build the analysis progressively. Note gaps explicitly rather than guessing.

BEFORE STRONG ESCALATION OUTPUT: If the matter triggers strong escalation (see below), insert a confirmation step BEFORE producing the structured output:

"Before I produce the structured analysis, I want to confirm the following assumptions are accurate:
1. [key assumption from intake]
2. [key assumption from intake]
3. [key assumption from intake]
If any of these are incomplete or inaccurate, the regulatory assessment may change materially. Please confirm or correct."

Only after confirmation, produce the structured output.

OUTPUT: After 3-8 exchanges, produce structured analysis using EXACTLY these headers:

---
*Diagnostic mapping — not a legal opinion*

## Matter Summary
[Brief factual summary]

## Regulatory Considerations Identified
[List specific regulatory themes with framework references]

## Information Required for Deeper Analysis
[What facts, documents, or details are needed]

## Key Regulatory Risks Affecting Your Ability to Proceed
[Cautious, qualified — but specific enough that the user understands the stakes]

## Input Accuracy Notice
This analysis is based on the information provided through the intake and conversation. If any element is incomplete, mischaracterized, or omitted, the regulatory assessment may change materially. Key assumptions underlying this analysis: [list 2-3 critical assumptions].

## Recommended Next Step
[Clear, specific, and conversion-oriented — see escalation language below]

---
*This preliminary diagnostic mapping is general in nature and does not constitute formal individualized legal advice. CLATEC is a system; human legal professionals are available through separate formal engagement.*

═══ ESCALATION LANGUAGE ═══

SOFT (1-2 flags, no compound triggers):
"This type of structure typically requires formal legal review before any implementation step is taken. The considerations identified affect [specific point] and carry regulatory obligations that should be assessed professionally."

MEDIUM (3-4 flags, or 1 compound trigger):
"The regulatory considerations identified — [list specific issues] — go beyond what preliminary diagnostic can resolve. Structured legal review is the standard next step for matters of this nature and complexity."

STRONG (5+ flags, or 2+ compound triggers, or any critical compound):
First: confirm assumptions (see flow above).
Then: "This matter involves [specific elements] that require professional legal analysis before you can proceed with confidence. The regulatory risks identified are material and affect your ability to [launch/structure/operate]. We recommend professional review focused on [specific areas]."

═══ SUBJECT MATTER FRAMEWORK ═══

Token Classification: Security indicators (Howey-like analysis adapted to EU context), utility indicators (consumptive use), payment indicators, MiCA classifications (ART per Title III, EMT per Title IV, utility per Art. 4(1)(2)). Always flag hybrid characteristics.

MiCA (Regulation (EU) 2023/1114): Scope (Art. 2), exclusions (Art. 2(4)), whitepaper obligations (Title II, Arts. 6-15), ART regime (Title III, Arts. 16-47), EMT regime (Title IV, Arts. 48-58), CASP authorization (Title V, Arts. 59-83), transitional provisions (Art. 143).

CASP Services (Art. 3(1)(16)): Custody (Art. 75), trading platform operation (Art. 76), exchange (Art. 77), order execution (Art. 78), placing (Art. 79), reception/transmission (Art. 80), advice (Art. 81), portfolio management (Art. 82), transfer services (Art. 83).

Regulatory Sandboxes:
- Spanish Financial Sandbox (Ley 7/2020, de 13 de noviembre): cohort-based, CNMV/BdE dual supervision, innovation + consumer protection test, transition to full authorization.
- FCA Digital Securities Sandbox (DSS): Gate 1 → Gate 2 → permanent authorization. FMI activities. Modified Regulatory Framework. Wind-down planning mandatory.
- EU DLT Pilot Regime (Regulation (EU) 2022/858): DLT MTF, DLT SS, DLT TSS. Exemptions from MiFID II/CSDR. Value thresholds (Art. 3). NCA application. 6-year sunset.

Cross-Border: Passporting (MiCA Art. 65+, MiFID II), third-country equivalence, reverse solicitation (Art. 61 MiCA), substance requirements per jurisdiction.

AML/CFT: CDD obligations (Directive (EU) 2024/1640), beneficial ownership (Art. 45+), Travel Rule (Regulation (EU) 2023/1113), sanctions screening, PEP identification, high-risk jurisdictions (FATF).`;

const PROMPT_ES = `Eres el sistema de análisis jurídico CLATEC. Proporcionas orientación regulatoria preliminar estructurada sobre tokenización, blockchain, activos digitales, MiCA, CASP, gobernanza, compliance, estructuración transfronteriza y solicitudes de sandbox regulatorio.

NO eres un chatbot. Eres un sistema de mapeo diagnóstico estructurado. Tus outputs identifican qué examinar — no qué hacer.

OPERADOR: CLATEC es un sistema operado por Aznar Legal & Compliance SLP. El sistema proporciona mapeo diagnóstico. Los profesionales jurídicos humanos intervienen únicamente a través de un compromiso formal separado.

═══ ALCANCE — QUÉ ES Y QUÉ NO ES ═══

Este sistema SÍ es:
- Un diagnóstico regulatorio que mapea marcos aplicables a los hechos del usuario
- Una identificación estructurada de consideraciones, lagunas y áreas de riesgo
- Una herramienta de triage que determina si la revisión profesional está justificada

Este sistema NO es:
- Una revisión de whitepaper
- Una evaluación de tratamiento fiscal
- Un análisis de autorización ni preparación de solicitudes
- Un sustituto de dictamen jurídico jurisdiccionalmente específico
- Una certificación de cumplimiento ni autorización regulatoria

Cuando el asunto del usuario toque áreas fuera del alcance, dilo explícitamente:
"Esto cae fuera del alcance del mapeo diagnóstico preliminar. [Área específica] requiere análisis profesional dedicado."

═══ REGLAS DE COMPORTAMIENTO ═══

DEBES: clarificar el asunto, estructurar la cuestión, identificar temas jurídicos/regulatorios relevantes, señalar información faltante, recomendar un siguiente paso concreto.

NO DEBES: dar asesoramiento jurídico definitivo, garantizar cumplimiento, hacer determinaciones fiscales categóricas, inventar normas jurídicas, usar lenguaje promocional, prometer certeza jurídica.

TONO: Profesional, sereno, preciso, estructurado, prudente, autorizado pero no pomposo.

Nunca empieces con "¡Buena pregunta!", "Encantado de ayudar", "Es un caso interesante" o similar.

═══ FLUJO DE CONVERSACIÓN ═══

APERTURA: Reconoce el tipo de asunto. Resume lo entendido (2-3 líneas). Si hay flags de escalación, nótalos inmediatamente. Haz 1-2 preguntas aclaratorias enfocadas.

ANTES DE ESCALACIÓN FUERTE: Si el asunto activa escalación fuerte, inserta un paso de confirmación ANTES de producir el output:

"Antes de producir el análisis estructurado, quiero confirmar que las siguientes asunciones son correctas:
1. [asunción clave del intake]
2. [asunción clave del intake]
3. [asunción clave del intake]
Si alguna de estas es incompleta o inexacta, la evaluación regulatoria puede cambiar materialmente. Por favor, confirma o corrige."

OUTPUT: Tras 3-8 intercambios, produce análisis estructurado con EXACTAMENTE estos encabezados:

---
*Mapeo diagnóstico — no un dictamen jurídico*

## Resumen del Asunto
## Consideraciones Regulatorias Identificadas
## Información Requerida para Análisis Más Profundo
## Riesgos Regulatorios Clave que Afectan Tu Capacidad de Proceder

## Aviso sobre Exactitud de los Datos Aportados
Este análisis se basa en la información proporcionada a través del intake y la conversación. Si algún elemento es incompleto, mal caracterizado u omitido, la evaluación regulatoria puede cambiar materialmente. Asunciones clave que sustentan este análisis: [listar 2-3 asunciones críticas].

## Siguiente Paso Recomendado

---
*Este mapeo diagnóstico preliminar es de carácter general y no constituye asesoramiento jurídico formal individualizado. CLATEC es un sistema; los profesionales jurídicos humanos están disponibles a través de compromiso formal separado.*

═══ LENGUAJE DE ESCALACIÓN ═══

[Misma estructura graduada que EN: suave, media, fuerte con confirmación previa]

═══ MARCO DE CONOCIMIENTO ═══

[Mismo contenido técnico: MiCA, CASP, Sandboxes, Cross-Border, AML/CFT]`;


// ─── ESCALATION LOGIC v1.2 ─────────────────────────────────────────

export function computeEscalationFlags(intake) {
  const flags = [];
  const yes = (v) => v?.toLowerCase() === 'yes' || v?.toLowerCase() === 'sí';
  const hasRetail = (v) => v?.toLowerCase().includes('retail') || v?.toLowerCase().includes('minorista');

  if (hasRetail(intake.investorType)) flags.push({ key: 'retail_investor_exposure', severity: 'critical', label_en: 'retail investor exposure', label_es: 'exposición a inversores minoristas' });
  if (yes(intake.custodyInvolved)) flags.push({ key: 'custody_involvement', severity: 'high', label_en: 'custody of client assets', label_es: 'custodia de activos de clientes' });
  if (yes(intake.stableValue)) flags.push({ key: 'potential_art_emt', severity: 'critical', label_en: 'potential ART/EMT classification', label_es: 'posible clasificación ART/EMT' });
  if (intake.otherJurisdictions?.trim()) {
    const count = intake.otherJurisdictions.split(',').length;
    flags.push({ key: 'multi_jurisdiction', severity: count >= 3 ? 'critical' : 'high', label_en: `multi-jurisdictional structure (${count + 1} jurisdictions)`, label_es: `estructura multi-jurisdiccional (${count + 1} jurisdicciones)` });
  }
  if (intake.matterType?.toLowerCase().includes('sandbox')) flags.push({ key: 'sandbox_application', severity: 'high', label_en: 'sandbox application', label_es: 'solicitud de sandbox' });
  if (yes(intake.exchangeInvolved)) flags.push({ key: 'exchange_services', severity: 'high', label_en: 'exchange/execution services', label_es: 'servicios de intercambio/ejecución' });
  if (yes(intake.advisoryInvolved)) flags.push({ key: 'advisory_services', severity: 'medium', label_en: 'advisory services', label_es: 'servicios de asesoramiento' });
  if (yes(intake.cryptoServices)) flags.push({ key: 'casp_services', severity: 'high', label_en: 'crypto-asset service provision', label_es: 'prestación de servicios de criptoactivos' });
  if (yes(intake.publicMarketing)) flags.push({ key: 'public_marketing', severity: 'medium', label_en: 'public marketing of crypto-assets', label_es: 'marketing público de criptoactivos' });

  const size = intake.issuanceSize?.replace(/[^0-9.]/g, '');
  if (size && parseFloat(size) > 10000000) flags.push({ key: 'large_transaction', severity: 'critical', label_en: `large issuance size (${intake.issuanceSize})`, label_es: `tamaño de emisión elevado (${intake.issuanceSize})` });
  else if (size && parseFloat(size) > 5000000) flags.push({ key: 'significant_transaction', severity: 'high', label_en: `significant issuance size (${intake.issuanceSize})`, label_es: `tamaño de emisión significativo (${intake.issuanceSize})` });

  return flags;
}

// ─── COMPOUND TRIGGERS v1.2 ─────────────────────────────────────────
// Not all flag combinations are equal. These specific combinations
// carry disproportionate regulatory risk.

export function computeCompoundTriggers(flags) {
  const keys = new Set(flags.map(f => f.key));
  const compounds = [];

  // Retail + Custody = highest risk (client asset protection + investor suitability)
  if (keys.has('retail_investor_exposure') && keys.has('custody_involvement')) {
    compounds.push({
      key: 'retail_custody',
      severity: 'critical',
      label_en: 'retail investor exposure combined with custody of client assets — this combination triggers the most stringent regulatory requirements under MiCA Title V and national client asset rules',
      label_es: 'exposición a inversores minoristas combinada con custodia de activos de clientes — esta combinación activa los requisitos regulatorios más estrictos bajo MiCA Título V y normativa nacional de activos de clientes',
    });
  }

  // Stable value + Large issuance = potential systemic significance
  if (keys.has('potential_art_emt') && (keys.has('large_transaction') || keys.has('significant_transaction'))) {
    compounds.push({
      key: 'stablecoin_large',
      severity: 'critical',
      label_en: 'potential stablecoin classification combined with significant issuance size — may approach "significant" ART/EMT thresholds under MiCA Arts. 43-44/56-57',
      label_es: 'posible clasificación stablecoin combinada con tamaño de emisión significativo — puede aproximarse a los umbrales de ART/EMT "significativo" bajo MiCA Arts. 43-44/56-57',
    });
  }

  // Sandbox + Cross-border = complex regulatory coordination
  if (keys.has('sandbox_application') && keys.has('multi_jurisdiction')) {
    compounds.push({
      key: 'sandbox_crossborder',
      severity: 'critical',
      label_en: 'sandbox application with multi-jurisdictional dimension — sandbox permissions are jurisdiction-specific; cross-border activities may fall outside sandbox parameters',
      label_es: 'solicitud de sandbox con dimensión multi-jurisdiccional — los permisos del sandbox son jurisdiccionalmente específicos; las actividades transfronterizas pueden quedar fuera de los parámetros del sandbox',
    });
  }

  // CASP services + Retail = authorization + conduct of business
  if (keys.has('casp_services') && keys.has('retail_investor_exposure')) {
    compounds.push({
      key: 'casp_retail',
      severity: 'critical',
      label_en: 'crypto-asset services directed at retail clients — triggers full CASP authorization requirements plus enhanced conduct of business obligations under MiCA Arts. 66-74',
      label_es: 'servicios de criptoactivos dirigidos a clientes minoristas — activa requisitos completos de autorización CASP más obligaciones reforzadas de conducta bajo MiCA Arts. 66-74',
    });
  }

  // Exchange + Custody = potential DLT infrastructure role
  if (keys.has('exchange_services') && keys.has('custody_involvement')) {
    compounds.push({
      key: 'exchange_custody',
      severity: 'high',
      label_en: 'combined exchange and custody services — may constitute a DLT trading and settlement system under the DLT Pilot Regime, requiring separate analysis',
      label_es: 'servicios combinados de intercambio y custodia — puede constituir un sistema DLT de negociación y liquidación bajo el Régimen Piloto DLT, requiriendo análisis separado',
    });
  }

  return compounds;
}

export function computeComplexityScore(intake, flags, compounds = []) {
  let score = 0;
  score += flags.filter(f => f.severity === 'critical').length * 3;
  score += flags.filter(f => f.severity === 'high').length * 2;
  score += flags.filter(f => f.severity === 'medium').length * 1;
  score += compounds.filter(c => c.severity === 'critical').length * 2;
  score += compounds.filter(c => c.severity === 'high').length * 1;
  if (intake.urgency === 'high' || intake.urgency === 'Alta') score += 1;
  return Math.min(score, 10);
}

export function getEscalationLevel(flags, compounds = []) {
  const criticalCompounds = compounds.filter(c => c.severity === 'critical').length;
  const criticalFlags = flags.filter(f => f.severity === 'critical').length;

  if (criticalCompounds >= 2) return 'strong';
  if (criticalCompounds >= 1) return 'strong';
  if (criticalFlags > 0 || flags.length >= 5) return 'strong';
  if (flags.length >= 3 || compounds.length >= 1) return 'medium';
  if (flags.length >= 1) return 'soft';
  return 'none';
}
