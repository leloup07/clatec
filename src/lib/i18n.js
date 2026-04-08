'use client'
import { useState, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════
// Full bilingual content — EN / ES
// ═══════════════════════════════════════════════════════════

const translations = {
  en: {
    nav: { home: 'Home', expertise: 'Expertise', how: 'How It Works', cases: 'Use Cases', consultation: 'Request Consultation', legal: 'Legal', nda: 'NDA' },
    cta: { start: 'Start Analysis', consult: 'Request Consultation', learn: 'Learn More' },
    home: {
      h1: 'Legal Intelligence for Tokenization & Digital Assets',
      sub: 'Structured preliminary guidance for blockchain projects, token issuance, MiCA, CASP, sandbox applications, and cross-border digital asset structuring.',
      tagline: 'Clarity before commitment.',
      areas_title: 'Core Areas',
      areas: ['Asset Tokenization', 'MiCA Assessment', 'CASP Structuring', 'Sandbox & Innovation', 'Cross-Border Structuring', 'Governance & Compliance'],
      process_title: 'How It Works',
      steps: ['Describe your project', 'Receive structured preliminary guidance', 'Escalate to professional legal review if needed'],
      credential: 'Supported by qualified legal professionals admitted in Spain and England & Wales',
    },
    expertise: {
      title: 'Areas of Expertise',
      sub: 'Deep regulatory knowledge across the digital asset lifecycle.',
      items: [
        { t: 'Asset Tokenization', d: 'Structuring the tokenization of real estate, debt instruments, fund interests, and other real-world assets. Analysis of legal qualification, issuer obligations, investor protection frameworks, and platform requirements.' },
        { t: 'Token Classification & Regulatory Assessment', d: 'Preliminary assessment of token nature under applicable frameworks — utility, payment, security, asset-referenced, e-money. Identification of regulatory triggers and classification risks.' },
        { t: 'MiCA-Related Issues', d: 'Guidance on the Markets in Crypto-Assets Regulation scope, whitepaper obligations, ART and EMT regimes, exemptions, and transitional provisions.' },
        { t: 'CASP Structuring', d: 'Analysis of crypto-asset service provider authorization requirements, scope of regulated services, passporting considerations, and organizational requirements under MiCA.' },
        { t: 'Sandbox & Regulatory Innovation', d: 'Experience with the Spanish Financial Sandbox (Ley 7/2020), FCA Digital Securities Sandbox (DSS), and EU DLT Pilot Regime (EU 2022/858). Guidance on application strategy and sandbox-specific compliance.' },
        { t: 'Blockchain Legal Structuring', d: 'Legal architecture for blockchain-based projects including entity selection, multi-jurisdiction coordination, governance frameworks, and smart contract legal implications.' },
        { t: 'Web3 Governance & Compliance', d: 'Design and implementation of compliance frameworks for Web3 projects, including AML/CFT programs, sanctions screening, KYC procedures, and ongoing monitoring.' },
        { t: 'Cross-Border Structuring', d: 'Coordination of regulatory obligations across jurisdictions. Analysis of passporting options, substance requirements, and optimal structuring for multi-jurisdiction projects.' },
      ]
    },
    how: {
      title: 'How It Works',
      sub: 'A structured path from question to clarity.',
      steps: [
        { t: '1. Describe Your Project', d: 'Complete a structured intake form tailored to your matter type. The system adapts its questions based on whether you\'re working on tokenization, MiCA, CASP, sandbox, or other matters.' },
        { t: '2. Guided Preliminary Analysis', d: 'An intelligent assistant — pre-loaded with your intake context — helps you organize the legal and regulatory dimensions of your project.' },
        { t: '3. Structured Output', d: 'You receive a preliminary orientation: matter summary, relevant considerations, information gaps, risk areas, and recommended next step.' },
        { t: '4. Professional Escalation', d: 'For matters requiring formal legal advice or human review, request a consultation with qualified legal professionals. Complex matters are flagged for escalation automatically.' },
      ],
      disclaimer: 'The preliminary guidance provided through this platform is general in nature and does not constitute formal individualized legal advice. Professional legal engagement is available as a separate service.',
    },
    cases: {
      title: 'Use Cases',
      sub: 'Common scenarios where CLATEC helps bring clarity.',
      items: [
        { t: 'I want to tokenize a real estate asset', d: 'Identify the legal qualification, issuer obligations, investor protection requirements, and jurisdictional considerations.' },
        { t: 'I want to launch a token and assess regulatory exposure', d: 'Understand whether your token may be classified as a security, utility, ART, or EMT.' },
        { t: 'I need to understand whether MiCA applies', d: 'Map your token model against MiCA scope, exemptions, and transitional provisions.' },
        { t: 'I am exploring a multi-jurisdiction structure', d: 'Identify regulatory requirements, passporting options, and structuring risks across jurisdictions.' },
        { t: 'I want to assess whether my crypto service requires authorization', d: 'Analyze your activities against CASP definitions and identify the authorization path.' },
        { t: 'I want to apply to a regulatory sandbox', d: 'Evaluate eligibility for the Spanish Financial Sandbox, FCA DSS, or EU DLT Pilot Regime.' },
        { t: 'I want to prepare for a legal consultation', d: 'Use CLATEC to organize your matter before engaging professional counsel.' },
      ]
    },
    consultation: {
      title: 'Request Consultation',
      sub: 'Professional legal review by qualified practitioners.',
      desc: 'When your matter requires formal legal advice, detailed regulatory analysis, or human review of documentation, request a professional consultation.',
      features: ['Consultation with professionals admitted in Spain and England & Wales', 'Tailored analysis of your specific matter', 'Written preliminary opinion where applicable', 'Follow-up recommendations and next steps'],
      form: { name: 'Full name', email: 'Email', company: 'Company (optional)', matter: 'Brief description of your matter', preferred: 'Preferred time slot', submit: 'Submit Request', success: 'Your request has been submitted. We will respond within 24–48 hours.' }
    },
    footer: {
      operator: 'Operated by Aznar Legal & Compliance SLP',
      credential: 'Supported by qualified legal professionals admitted in Spain and England & Wales',
      rights: 'All rights reserved.',
    }
  },
  es: {
    nav: { home: 'Inicio', expertise: 'Áreas', how: 'Cómo Funciona', cases: 'Casos de Uso', consultation: 'Solicitar Consulta', legal: 'Legal', nda: 'NDA' },
    cta: { start: 'Iniciar Análisis', consult: 'Solicitar Consulta', learn: 'Saber Más' },
    home: {
      h1: 'Inteligencia Jurídica para Tokenización y Activos Digitales',
      sub: 'Orientación jurídica preliminar estructurada para proyectos blockchain, emisión de tokens, MiCA, CASP, sandboxes regulatorios y estructuración transfronteriza.',
      tagline: 'Claridad antes del compromiso.',
      areas_title: 'Áreas Principales',
      areas: ['Tokenización de Activos', 'Evaluación MiCA', 'Estructuración CASP', 'Sandbox e Innovación', 'Estructuración Transfronteriza', 'Gobernanza y Compliance'],
      process_title: 'Cómo Funciona',
      steps: ['Describe tu proyecto', 'Recibe orientación preliminar estructurada', 'Escala a revisión profesional si es necesario'],
      credential: 'Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales',
    },
    expertise: {
      title: 'Áreas de Especialidad',
      sub: 'Conocimiento regulatorio profundo a lo largo del ciclo de vida de los activos digitales.',
      items: [
        { t: 'Tokenización de Activos', d: 'Estructuración de la tokenización de activos inmobiliarios, instrumentos de deuda, participaciones en fondos y otros activos reales.' },
        { t: 'Clasificación de Tokens y Evaluación Regulatoria', d: 'Evaluación preliminar de la naturaleza del token — utilidad, pago, valor, referenciado a activos, dinero electrónico.' },
        { t: 'Cuestiones MiCA', d: 'Orientación sobre el alcance del Reglamento MiCA, obligaciones del libro blanco, regímenes ART y EMT, exenciones y disposiciones transitorias.' },
        { t: 'Estructuración CASP', d: 'Análisis de requisitos de autorización CASP, alcance de servicios regulados, pasaporte y requisitos organizativos bajo MiCA.' },
        { t: 'Sandbox e Innovación Regulatoria', d: 'Experiencia con el Sandbox Financiero Español (Ley 7/2020), FCA DSS y Régimen Piloto DLT UE (2022/858).' },
        { t: 'Estructuración Jurídica Blockchain', d: 'Arquitectura jurídica para proyectos blockchain incluyendo selección de entidad, coordinación multi-jurisdiccional y marcos de gobernanza.' },
        { t: 'Gobernanza y Compliance Web3', d: 'Diseño e implementación de marcos de cumplimiento para proyectos Web3, incluyendo programas AML/CFT y procedimientos KYC.' },
        { t: 'Estructuración Transfronteriza', d: 'Coordinación de obligaciones regulatorias entre jurisdicciones, opciones de pasaporte y estructuración óptima multi-jurisdiccional.' },
      ]
    },
    how: {
      title: 'Cómo Funciona',
      sub: 'Un camino estructurado de la pregunta a la claridad.',
      steps: [
        { t: '1. Describe Tu Proyecto', d: 'Completa un formulario de intake estructurado adaptado a tu tipo de asunto.' },
        { t: '2. Análisis Preliminar Guiado', d: 'Un asistente inteligente precargado con tu contexto te ayuda a organizar las dimensiones jurídicas y regulatorias.' },
        { t: '3. Resultado Estructurado', d: 'Recibes una orientación preliminar: resumen, consideraciones relevantes, lagunas de información, riesgos y siguiente paso.' },
        { t: '4. Escalado Profesional', d: 'Para asuntos que requieren asesoramiento formal, solicita consulta con profesionales cualificados.' },
      ],
      disclaimer: 'La orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal individualizado.',
    },
    cases: {
      title: 'Casos de Uso',
      sub: 'Escenarios frecuentes donde CLATEC aporta claridad.',
      items: [
        { t: 'Quiero tokenizar un activo inmobiliario', d: 'Identificar la calificación jurídica, obligaciones del emisor y requisitos de protección al inversor.' },
        { t: 'Quiero lanzar un token y evaluar la exposición regulatoria', d: 'Comprender si tu token puede clasificarse como valor, utilidad, ART o EMT.' },
        { t: 'Necesito entender si MiCA aplica', d: 'Mapear tu modelo de token contra el alcance, exenciones y disposiciones transitorias de MiCA.' },
        { t: 'Estoy explorando una estructura multi-jurisdiccional', d: 'Identificar requisitos regulatorios, opciones de pasaporte y riesgos de estructuración.' },
        { t: 'Quiero evaluar si mi servicio cripto requiere autorización', d: 'Analizar tus actividades contra las definiciones CASP e identificar la vía de autorización.' },
        { t: 'Quiero solicitar acceso a un sandbox regulatorio', d: 'Evaluar la elegibilidad para el Sandbox Financiero Español, FCA DSS o Régimen Piloto DLT UE.' },
        { t: 'Quiero prepararme para una consulta', d: 'Usa CLATEC para organizar tu asunto antes de contratar asesoramiento profesional.' },
      ]
    },
    consultation: {
      title: 'Solicitar Consulta',
      sub: 'Revisión jurídica profesional por profesionales cualificados.',
      desc: 'Cuando tu asunto requiere asesoramiento jurídico formal, análisis regulatorio detallado o revisión humana, solicita una consulta profesional.',
      features: ['Consulta con profesionales habilitados en España e Inglaterra y Gales', 'Análisis adaptado a tu asunto específico', 'Dictamen preliminar escrito cuando proceda', 'Recomendaciones de seguimiento y próximos pasos'],
      form: { name: 'Nombre completo', email: 'Email', company: 'Empresa (opcional)', matter: 'Descripción breve de tu asunto', preferred: 'Franja horaria preferida', submit: 'Enviar Solicitud', success: 'Tu solicitud ha sido enviada. Responderemos en 24–48 horas.' }
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
