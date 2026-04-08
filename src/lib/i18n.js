'use client'
import { useState, useCallback } from 'react'

const translations = {
  en: {
    nav: { home: 'Home', expertise: 'Expertise', how: 'How It Works', cases: 'Use Cases', consultation: 'Legal Assessment', legal: 'Legal', nda: 'NDA' },
    cta: {
      start: 'Start Analysis',
      consult: 'Proceed to Legal Assessment',
      learn: 'Learn More',
      escalate: 'Proceed to Legal Assessment',
      escalateSoft: 'Submit for Professional Analysis',
      chatEnd: 'Proceed to Structured Legal Review',
      intake: 'Begin Structured Analysis',
    },
    home: {
      h1: 'Legal Intelligence for Tokenization & Digital Assets',
      sub: 'CLATEC maps the regulatory landscape of your project before you commit. Structured preliminary guidance across MiCA, CASP, sandbox applications, and cross-border digital asset structuring.',
      tagline: 'Clarity before commitment.',
      valueProp: 'Not a chatbot. Not generic legal information. CLATEC is a rule-based regulatory diagnostic that maps your project against MiCA, CASP, and sandbox frameworks — and tells you exactly where professional review is required.',
      areas_title: 'Regulatory Intelligence Across',
      areas: ['Asset Tokenization', 'MiCA Assessment', 'CASP Authorization', 'Sandbox Applications', 'Cross-Border Structuring', 'Governance & Compliance'],
      process_title: 'A Structured Path to Clarity',
      steps: [
        'Describe your project through a guided intake',
        'Receive a structured regulatory mapping',
        'Proceed to professional review with a clear brief'
      ],
      credential: 'Supported by qualified legal professionals admitted in Spain and England & Wales',
      // Social proof / differentiation
      diff_title: 'Why CLATEC',
      diffs: [
        { t: 'Not a chatbot', d: 'Rule-based escalation. Classified output. Structured methodology. If the system cannot resolve it, it tells you — and tells you why.' },
        { t: 'Jurisdiction-specific', d: 'Built on MiCA, the Spanish Financial Sandbox, FCA DSS, and the DLT Pilot Regime. Not generic legal information repackaged.' },
        { t: 'Knows its limits', d: 'CLATEC identifies where preliminary diagnostic ends and professional legal review begins. Every escalation is reasoned, never arbitrary.' },
      ]
    },
    expertise: {
      title: 'Regulatory Intelligence',
      sub: 'Deep knowledge of the frameworks that govern digital assets — applied to your specific structure.',
      items: [
        { t: 'Asset Tokenization', d: 'Legal qualification of the token. Issuer obligations. Investor protection frameworks. Platform requirements. We map the full regulatory surface of your tokenization structure.' },
        { t: 'Token Classification', d: 'Is it a security, utility, ART, EMT, or hybrid? We assess classification indicators against applicable frameworks and identify where regulatory triggers may arise.' },
        { t: 'MiCA Assessment', d: 'Scope analysis. Whitepaper obligations. ART and EMT regimes. Exemptions. Transitional provisions. We identify how MiCA applies to your specific token model.' },
        { t: 'CASP Authorization', d: 'Which services require authorization? What are the organizational and prudential requirements? Passporting analysis. We map the authorization path.' },
        { t: 'Sandbox Applications', d: 'Spanish Financial Sandbox (Ley 7/2020). FCA Digital Securities Sandbox. EU DLT Pilot Regime. We guide application strategy and sandbox-specific compliance from direct experience.' },
        { t: 'Blockchain Structuring', d: 'Entity selection. Multi-jurisdiction coordination. Governance frameworks. Smart contract implications. The legal architecture your project needs.' },
        { t: 'Web3 Compliance', d: 'AML/CFT programs. Sanctions screening. KYC procedures. Travel Rule compliance. Monitoring frameworks built for the realities of Web3.' },
        { t: 'Cross-Border Structuring', d: 'Passporting under MiCA and MiFID II. Substance requirements. Reverse solicitation limits. We coordinate obligations across jurisdictions.' },
      ]
    },
    how: {
      title: 'How It Works',
      sub: 'Three steps from question to structured regulatory clarity.',
      steps: [
        { t: '1. Structured Intake', d: 'You complete a guided questionnaire tailored to your matter type. The system adapts — tokenization, MiCA, CASP, sandbox, or cross-border — asking only what is relevant. This is not a contact form. It is a diagnostic tool.' },
        { t: '2. Regulatory Mapping', d: 'An intelligent analysis system — pre-loaded with your intake context — identifies applicable frameworks, flags regulatory triggers, notes information gaps, and structures the legal dimensions of your project.' },
        { t: '3. Structured Output & Next Step', d: 'You receive a classified preliminary orientation: matter summary, regulatory considerations, missing information, risk areas, and a clear recommendation. Where professional review is warranted, the system tells you — and tells you why.' },
      ],
      disclaimer: 'Preliminary guidance is general in nature and does not constitute formal individualized legal advice. Professional legal engagement is available as a separate service.',
      // Reinforcement
      reinforcement: 'Every analysis follows a consistent methodology. Every output is structured. Every escalation is reasoned.',
    },
    cases: {
      title: 'Use Cases',
      sub: 'Situations where structured preliminary analysis saves time, reduces risk, and sharpens your brief.',
      items: [
        { t: 'Tokenizing a real estate asset', d: 'Map the legal qualification, issuer obligations, investor protection requirements, and jurisdictional considerations — before engaging counsel.' },
        { t: 'Launching a token with uncertain regulatory status', d: 'Assess classification risk: security, utility, ART, or EMT. Identify which obligations follow and where the exposure lies.' },
        { t: 'Determining whether MiCA applies', d: 'Map your token model and service activities against MiCA scope, exemptions, and transitional provisions. Know before you file.' },
        { t: 'Structuring across multiple jurisdictions', d: 'Identify regulatory requirements, passporting options, substance needs, and structuring risks across borders.' },
        { t: 'Assessing CASP authorization requirements', d: 'Analyze your activities against the service definitions. Identify the authorization path. Understand organizational requirements.' },
        { t: 'Applying to a regulatory sandbox', d: 'Evaluate eligibility for the Spanish Financial Sandbox, FCA DSS, or DLT Pilot Regime. Structure your application with professional methodology.' },
        { t: 'Preparing for a legal consultation', d: 'Arrive with a structured brief instead of an unorganized question. CLATEC maps the territory; your lawyer navigates it.' },
      ]
    },
    consultation: {
      title: 'Professional Legal Review',
      sub: 'When the diagnostic identifies regulatory considerations that require professional analysis.',
      desc: 'Matters involving token classification uncertainty, CASP authorization, sandbox applications, or multi-jurisdictional structures typically require structured legal review before implementation. This is a separate professional engagement focused on the specific issues identified in your CLATEC diagnostic.',
      features: [
        'Professionals admitted in Spain and England & Wales',
        'Analysis tailored to the specific issues flagged in your preliminary review',
        'Written opinion where the matter warrants it',
        'Clear next steps and implementation guidance'
      ],
      form: { name: 'Full name', email: 'Email', company: 'Company (optional)', matter: 'Brief description of your matter', preferred: 'Preferred time slot', submit: 'Submit Request', success: 'Your request has been submitted. We will respond within 24–48 hours.' },
      postChat: 'The regulatory considerations identified in your analysis typically require professional review before implementation. This is standard practice for matters of this nature.',
    },
    chat: {
      escalation: {
        soft: 'This type of structure typically requires formal legal review before any implementation step is taken.',
        medium: 'The regulatory considerations identified — {reasons} — go beyond what preliminary diagnostic can resolve. Structured legal review is the standard next step for matters of this nature.',
        strong: 'This matter involves {reasons}. These elements require professional legal analysis before you can proceed. The regulatory exposure identified is material and affects your ability to launch, structure, or operate.',
      },
      outputHeaders: {
        summary: 'Matter Summary',
        considerations: 'Regulatory Considerations Identified',
        missing: 'Information Required for Deeper Analysis',
        risks: 'Key Regulatory Risks Affecting Your Ability to Proceed',
        nextStep: 'Recommended Next Step',
      }
    },
    footer: {
      operator: 'Operated by Aznar Legal & Compliance SLP',
      credential: 'Supported by qualified legal professionals admitted in Spain and England & Wales',
      rights: 'All rights reserved.',
    }
  },

  es: {
    nav: { home: 'Inicio', expertise: 'Áreas', how: 'Cómo Funciona', cases: 'Casos de Uso', consultation: 'Evaluación Jurídica', legal: 'Legal', nda: 'NDA' },
    cta: {
      start: 'Iniciar Análisis',
      consult: 'Proceder a Evaluación Jurídica',
      learn: 'Saber Más',
      escalate: 'Proceder a Evaluación Jurídica',
      escalateSoft: 'Someter a Análisis Profesional',
      chatEnd: 'Proceder a Revisión Jurídica Estructurada',
      intake: 'Comenzar Análisis Estructurado',
    },
    home: {
      h1: 'Inteligencia Jurídica para Tokenización y Activos Digitales',
      sub: 'CLATEC mapea el paisaje regulatorio de tu proyecto antes de que te comprometas. Orientación preliminar estructurada en MiCA, CASP, sandboxes regulatorios y estructuración transfronteriza de activos digitales.',
      tagline: 'Claridad antes del compromiso.',
      valueProp: 'No es un chatbot. No es información jurídica genérica. CLATEC es un diagnóstico regulatorio basado en reglas que mapea tu proyecto contra los marcos MiCA, CASP y sandbox — y te dice exactamente dónde se requiere revisión profesional.',
      areas_title: 'Inteligencia Regulatoria en',
      areas: ['Tokenización de Activos', 'Evaluación MiCA', 'Autorización CASP', 'Solicitudes de Sandbox', 'Estructuración Transfronteriza', 'Gobernanza y Compliance'],
      process_title: 'Un Camino Estructurado hacia la Claridad',
      steps: [
        'Describe tu proyecto mediante un intake guiado',
        'Recibe un mapeo regulatorio estructurado',
        'Procede a revisión profesional con un brief claro'
      ],
      credential: 'Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales',
      diff_title: 'Por Qué CLATEC',
      diffs: [
        { t: 'No es un chatbot', d: 'Escalación basada en reglas. Output clasificado. Metodología estructurada. Si el sistema no puede resolverlo, te lo dice — y te dice por qué.' },
        { t: 'Jurisdiccionalmente específico', d: 'Construido sobre MiCA, el Sandbox Financiero Español, FCA DSS y el Régimen Piloto DLT. No información jurídica genérica reempaquetada.' },
        { t: 'Conoce sus límites', d: 'CLATEC identifica dónde termina el diagnóstico preliminar y dónde comienza la revisión profesional. Cada escalación es razonada, nunca arbitraria.' },
      ]
    },
    expertise: {
      title: 'Inteligencia Regulatoria',
      sub: 'Conocimiento profundo de los marcos que gobiernan los activos digitales — aplicado a tu estructura específica.',
      items: [
        { t: 'Tokenización de Activos', d: 'Calificación jurídica del token. Obligaciones del emisor. Marcos de protección al inversor. Requisitos de plataforma. Mapeamos toda la superficie regulatoria de tu estructura de tokenización.' },
        { t: 'Clasificación de Tokens', d: '¿Es valor, utilidad, ART, EMT o híbrido? Evaluamos indicadores de clasificación contra los marcos aplicables e identificamos dónde pueden surgir activadores regulatorios.' },
        { t: 'Evaluación MiCA', d: 'Análisis de alcance. Obligaciones del libro blanco. Regímenes ART y EMT. Exenciones. Disposiciones transitorias. Identificamos cómo aplica MiCA a tu modelo de token específico.' },
        { t: 'Autorización CASP', d: '¿Qué servicios requieren autorización? ¿Cuáles son los requisitos organizativos y prudenciales? Análisis de pasaporte. Mapeamos la ruta de autorización.' },
        { t: 'Solicitudes de Sandbox', d: 'Sandbox Financiero Español (Ley 7/2020). FCA Digital Securities Sandbox. Régimen Piloto DLT UE. Guiamos estrategia de solicitud y cumplimiento específico del sandbox desde experiencia directa.' },
        { t: 'Estructuración Blockchain', d: 'Selección de entidad. Coordinación multi-jurisdiccional. Marcos de gobernanza. Implicaciones de smart contracts. La arquitectura jurídica que tu proyecto necesita.' },
        { t: 'Compliance Web3', d: 'Programas AML/CFT. Screening de sanciones. Procedimientos KYC. Cumplimiento Travel Rule. Marcos de monitorización construidos para las realidades de Web3.' },
        { t: 'Estructuración Transfronteriza', d: 'Pasaporte bajo MiCA y MiFID II. Requisitos de sustancia. Límites de reverse solicitation. Coordinamos obligaciones entre jurisdicciones.' },
      ]
    },
    how: {
      title: 'Cómo Funciona',
      sub: 'Tres pasos de la pregunta a la claridad regulatoria estructurada.',
      steps: [
        { t: '1. Intake Estructurado', d: 'Completas un cuestionario guiado adaptado a tu tipo de asunto. El sistema se adapta — tokenización, MiCA, CASP, sandbox o transfronterizo — preguntando solo lo relevante. No es un formulario de contacto. Es una herramienta de diagnóstico.' },
        { t: '2. Mapeo Regulatorio', d: 'Un sistema de análisis inteligente — precargado con el contexto de tu intake — identifica marcos aplicables, señala activadores regulatorios, nota lagunas de información y estructura las dimensiones jurídicas de tu proyecto.' },
        { t: '3. Resultado Estructurado y Siguiente Paso', d: 'Recibes una orientación preliminar clasificada: resumen del asunto, consideraciones regulatorias, información faltante, áreas de riesgo y una recomendación clara. Cuando la revisión profesional está justificada, el sistema te lo dice — y te dice por qué.' },
      ],
      disclaimer: 'La orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal individualizado. El compromiso profesional jurídico está disponible como servicio separado.',
      reinforcement: 'Cada análisis sigue una metodología consistente. Cada resultado está estructurado. Cada escalación está razonada.',
    },
    cases: {
      title: 'Casos de Uso',
      sub: 'Situaciones donde el análisis preliminar estructurado ahorra tiempo, reduce riesgo y afila tu brief.',
      items: [
        { t: 'Tokenizar un activo inmobiliario', d: 'Mapear la calificación jurídica, obligaciones del emisor, requisitos de protección al inversor y consideraciones jurisdiccionales — antes de contratar asesoramiento.' },
        { t: 'Lanzar un token con estatus regulatorio incierto', d: 'Evaluar el riesgo de clasificación: valor, utilidad, ART o EMT. Identificar qué obligaciones se derivan y dónde está la exposición.' },
        { t: 'Determinar si MiCA aplica', d: 'Mapear tu modelo de token y actividades de servicio contra el alcance, exenciones y disposiciones transitorias de MiCA. Saber antes de presentar.' },
        { t: 'Estructurar en múltiples jurisdicciones', d: 'Identificar requisitos regulatorios, opciones de pasaporte, necesidades de sustancia y riesgos de estructuración transfronteriza.' },
        { t: 'Evaluar requisitos de autorización CASP', d: 'Analizar tus actividades contra las definiciones de servicios. Identificar la ruta de autorización. Comprender los requisitos organizativos.' },
        { t: 'Solicitar acceso a un sandbox regulatorio', d: 'Evaluar elegibilidad para el Sandbox Financiero Español, FCA DSS o Régimen Piloto DLT UE. Estructurar tu solicitud con metodología profesional.' },
        { t: 'Prepararse para una consulta jurídica', d: 'Llegar con un brief estructurado en vez de una pregunta desordenada. CLATEC mapea el territorio; tu abogado lo navega.' },
      ]
    },
    consultation: {
      title: 'Revisión Jurídica Profesional',
      sub: 'Cuando el diagnóstico identifica consideraciones regulatorias que requieren análisis profesional.',
      desc: 'Los asuntos que implican incertidumbre en la clasificación de tokens, autorización CASP, solicitudes de sandbox o estructuras multi-jurisdiccionales habitualmente requieren revisión jurídica estructurada antes de su implementación. Se trata de un compromiso profesional separado enfocado en las cuestiones específicas identificadas en tu diagnóstico CLATEC.',
      features: [
        'Profesionales habilitados en España e Inglaterra y Gales',
        'Análisis adaptado a las cuestiones específicas señaladas en tu revisión preliminar',
        'Dictamen escrito cuando el asunto lo justifique',
        'Próximos pasos claros y orientación de implementación'
      ],
      form: { name: 'Nombre completo', email: 'Email', company: 'Empresa (opcional)', matter: 'Descripción breve de tu asunto', preferred: 'Franja horaria preferida', submit: 'Enviar Solicitud', success: 'Tu solicitud ha sido enviada. Responderemos en 24–48 horas.' },
      postChat: 'Las consideraciones regulatorias identificadas en tu análisis habitualmente requieren revisión profesional antes de su implementación. Es práctica estándar para asuntos de esta naturaleza.',
    },
    chat: {
      escalation: {
        soft: 'Este tipo de estructura habitualmente requiere revisión jurídica formal antes de cualquier paso de implementación.',
        medium: 'Las consideraciones regulatorias identificadas — {reasons} — exceden lo que el diagnóstico preliminar puede resolver. La revisión jurídica estructurada es el paso estándar para asuntos de esta naturaleza.',
        strong: 'Este asunto implica {reasons}. Estos elementos requieren análisis jurídico profesional antes de proceder. La exposición regulatoria identificada es material y afecta tu capacidad de lanzar, estructurar u operar.',
      },
      outputHeaders: {
        summary: 'Resumen del Asunto',
        considerations: 'Consideraciones Regulatorias Identificadas',
        missing: 'Información Requerida para Análisis Más Profundo',
        risks: 'Riesgos Regulatorios Clave que Afectan Tu Capacidad de Proceder',
        nextStep: 'Siguiente Paso Recomendado',
      }
    },
    footer: {
      operator: 'Operado por Aznar Legal & Compliance SLP',
      credential: 'Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales',
      rights: 'Todos los derechos reservados.',
    }
  }
}

export function useLanguage() {
  const [lang, setLang] = useState('en')
  const t = translations[lang]
  const toggle = useCallback(() => setLang(l => l === 'en' ? 'es' : 'en'), [])
  return { t, lang, setLang, toggle }
}

export { translations }
