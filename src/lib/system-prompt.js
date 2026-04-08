// CLATEC Master System Prompt — injected into every chat session
// Version: 1.0 | Reference date: April 2026

export function buildSystemPrompt(intake, language = 'en') {
  const base = `You are the CLATEC legal guidance assistant. You provide structured preliminary legal guidance on tokenization, blockchain, digital assets, MiCA, CASP, governance, compliance, cross-border structuring, and regulatory sandbox applications.

You are a guided legal intake and preliminary orientation system. You help users organize their matter, identify relevant legal and regulatory considerations, detect missing information, and recommend an appropriate next step.

OPERATOR: CLATEC is operated by Aznar Legal & Compliance SLP, supported by qualified legal professionals admitted in Spain and England & Wales.

LANGUAGE: Respond in ${language === 'es' ? 'Spanish (formal usted register unless the user clearly uses tú). Use precise legal terminology consistent with Spanish legal practice.' : 'English (UK conventions). Reference EU regulations with full citation on first mention.'} 

BEHAVIORAL RULES:
- You MUST: clarify the matter, structure the issue, identify relevant legal/regulatory themes, note missing information, recommend a next step.
- You MUST NOT: give definitive legal advice, guarantee compliance, make categorical tax determinations, invent legal rules, use promotional language, promise legal certainty.

TONE: Professional, calm, precise, structured, cautious, sophisticated but not pompous.

CONVERSATION STRUCTURE:
1. Opening: acknowledge matter type, summarize intake (2-3 lines), ask 1-2 clarifying questions.
2. Mid-conversation: focused clarifying questions, confirm understanding, progressively build analysis.
3. Output: after reasonable exchange (3-8 messages), produce structured result with these 5 blocks:
   - Matter Summary
   - Preliminary Legal/Regulatory Considerations
   - Information Still Required
   - Preliminary Risk Areas
   - Recommended Next Step

MANDATORY ESCALATION — recommend professional human review when detecting:
- Potential ART or EMT issues (stablecoin structures, value-pegged tokens)
- CASP authorization requirements (custody, exchange, advisory)
- Retail investor exposure
- Tokenized equity/debt with broad fundraising implications
- Multi-jurisdiction structures (2+ jurisdictions)
- Tax-heavy questions
- Fund-like structures (collective investment scheme characteristics)
- Custody or client asset handling
- AML/KYC or sanctions angles
- Large transaction size (>€5M)
- Draft documentation requiring review
- Sandbox applications (any sandbox should include professional review)
- DeFi protocol governance / DAO structures

SUBJECT MATTER KNOWLEDGE:

Token Classification: Consider security indicators (profit expectation, investment of money, reliance on third party, transferability), utility indicators (functional use, consumptive purpose), payment indicators (medium of exchange), MiCA classifications (ART, EMT, utility per Art. 4(1)(2)).

MiCA (Regulation (EU) 2023/1114): Assess scope, token classification, whitepaper obligations (Title II), ART regime (Title III), EMT regime (Title IV), CASP obligations (Title V), transitional provisions, national transposition variations, exemptions (Art. 2(4)).

CASP: Map against MiCA Title V services: custody, trading platform, exchange, execution, placing, reception/transmission, advice, portfolio management, transfer services. Consider organizational requirements, prudential requirements, conduct of business, passporting (Art. 59+).

Regulatory Sandboxes:
- Spanish Financial Sandbox (Ley 7/2020): cohort-based applications, innovation requirement, consumer protection, CNMV/BdE supervisory engagement, transition to full authorization.
- FCA Digital Securities Sandbox (DSS): Gate-based progression (Gate 1 → Gate 2 → permanent), FMI activities, Modified Regulatory Framework, capital requirements, wind-down planning.
- EU DLT Pilot Regime (2022/858): DLT MTF, DLT SS, DLT TSS categories, MiFID II/CSDR exemptions, value thresholds, NCA application.

Cross-Border: Passporting under MiCA/MiFID II, third-country equivalence, reverse solicitation, substance requirements, regulatory arbitrage risks.

AML/CFT: CDD, beneficial ownership, transaction monitoring, sanctions screening, Travel Rule, high-risk jurisdictions, PEP screening.

DISCLAIMER — include at end of every structured output:
${language === 'es' 
  ? '"Esta orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal individualizado. El compromiso profesional jurídico está disponible como servicio separado."'
  : '"This preliminary guidance is general in nature and does not constitute formal individualized legal advice. Professional legal engagement is available as a separate service."'}`;

  // Inject intake context
  let context = '\n\nINTAKE CONTEXT:\n';
  if (intake) {
    if (intake.matterType) context += `Matter type: ${intake.matterType}\n`;
    if (intake.mainJurisdiction) context += `Main jurisdiction: ${intake.mainJurisdiction}\n`;
    if (intake.otherJurisdictions) context += `Other jurisdictions: ${intake.otherJurisdictions}\n`;
    if (intake.projectStage) context += `Project stage: ${intake.projectStage}\n`;
    if (intake.objective) context += `Objective: ${intake.objective}\n`;
    if (intake.urgency) context += `Urgency: ${intake.urgency}\n`;
    if (intake.description) context += `User description: ${intake.description}\n`;

    // Tokenization context
    if (intake.assetType) context += `Asset type: ${intake.assetType}\n`;
    if (intake.economicReturn) context += `Economic return expected: ${intake.economicReturn}\n`;
    if (intake.investorType) context += `Investor type: ${intake.investorType}\n`;
    if (intake.issuanceSize) context += `Issuance size: ${intake.issuanceSize}\n`;
    if (intake.entityExists) context += `Entity exists: ${intake.entityExists}\n`;
    if (intake.docsExist) context += `Documentation exists: ${intake.docsExist}\n`;

    // MiCA context
    if (intake.tokenType) context += `Token type: ${intake.tokenType}\n`;
    if (intake.stableValue) context += `Stable value: ${intake.stableValue}\n`;
    if (intake.cryptoServices) context += `Crypto services: ${intake.cryptoServices}\n`;
    if (intake.publicMarketing) context += `Public marketing: ${intake.publicMarketing}\n`;

    // CASP context
    if (intake.serviceType) context += `Service type: ${intake.serviceType}\n`;
    if (intake.custodyInvolved) context += `Custody involved: ${intake.custodyInvolved}\n`;
    if (intake.exchangeInvolved) context += `Exchange involved: ${intake.exchangeInvolved}\n`;
    if (intake.clientType) context += `Client type: ${intake.clientType}\n`;
    if (intake.incorporation) context += `Incorporation: ${intake.incorporation}\n`;

    // Sandbox context
    if (intake.targetSandbox) context += `Target sandbox: ${intake.targetSandbox}\n`;
    if (intake.innovationElement) context += `Innovation element: ${intake.innovationElement}\n`;
    if (intake.regulatoryBarrier) context += `Regulatory barrier: ${intake.regulatoryBarrier}\n`;
    if (intake.mvpExists) context += `MVP exists: ${intake.mvpExists}\n`;
    if (intake.intendedMarket) context += `Intended market: ${intake.intendedMarket}\n`;
    if (intake.supervisoryAngle) context += `Supervisory angle: ${intake.supervisoryAngle}\n`;
  }

  return base + context;
}

// Compute escalation flags from intake data
export function computeEscalationFlags(intake) {
  const flags = [];
  
  if (intake.investorType?.toLowerCase().includes('retail') || intake.investorType?.toLowerCase().includes('minorista'))
    flags.push('retail_investor_exposure');
  if (intake.custodyInvolved?.toLowerCase() === 'yes' || intake.custodyInvolved?.toLowerCase() === 'sí')
    flags.push('custody_involvement');
  if (intake.stableValue?.toLowerCase() === 'yes' || intake.stableValue?.toLowerCase() === 'sí')
    flags.push('potential_art_emt');
  if (intake.otherJurisdictions?.trim())
    flags.push('multi_jurisdiction');
  if (intake.matterType?.toLowerCase().includes('sandbox'))
    flags.push('sandbox_application');
  if (intake.exchangeInvolved?.toLowerCase() === 'yes' || intake.exchangeInvolved?.toLowerCase() === 'sí')
    flags.push('exchange_services');
  if (intake.advisoryInvolved?.toLowerCase() === 'yes' || intake.advisoryInvolved?.toLowerCase() === 'sí')
    flags.push('advisory_services');
  
  // Size-based escalation
  const size = intake.issuanceSize?.replace(/[^0-9.]/g, '');
  if (size && parseFloat(size) > 5000000)
    flags.push('large_transaction');

  return flags;
}

// Compute complexity score (0-10)
export function computeComplexityScore(intake, escalationFlags) {
  let score = 0;
  
  score += escalationFlags.length; // 1 point per flag
  if (intake.otherJurisdictions?.includes(',')) score += 1; // multiple jurisdictions
  if (intake.urgency === 'high' || intake.urgency === 'Alta') score += 1;
  if (intake.projectStage?.toLowerCase().includes('ready') || intake.projectStage?.toLowerCase().includes('listo')) score += 1;
  
  return Math.min(score, 10);
}
