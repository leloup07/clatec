import { useState, useEffect, useRef, useCallback } from "react";

// ─── BILINGUAL CONTENT ───────────────────────────────────────────────
const T = {
  en: {
    nav: { home: "Home", expertise: "Expertise", how: "How It Works", cases: "Use Cases", consultation: "Request Consultation", legal: "Legal" },
    cta: { start: "Start Analysis", consult: "Request Consultation", learn: "Learn More" },
    home: {
      h1: "Legal Intelligence for Tokenization & Digital Assets",
      sub: "Structured preliminary guidance for blockchain projects, token issuance, MiCA, CASP, sandbox applications, and cross-border digital asset structuring.",
      tagline: "Clarity before commitment.",
      areas_title: "Core Areas",
      areas: ["Asset Tokenization", "MiCA Assessment", "CASP Structuring", "Sandbox & Innovation", "Cross-Border Structuring", "Governance & Compliance"],
      process_title: "How It Works",
      steps: ["Describe your project", "Receive structured preliminary guidance", "Escalate to professional legal review if needed"],
      credential: "Supported by qualified legal professionals admitted in Spain and England & Wales",
      trust: "Operated by Aznar Legal & Compliance SLP"
    },
    expertise: {
      title: "Areas of Expertise",
      sub: "Deep regulatory knowledge across the digital asset lifecycle.",
      items: [
        { t: "Asset Tokenization", d: "Structuring the tokenization of real estate, debt instruments, fund interests, and other real-world assets. Analysis of legal qualification, issuer obligations, investor protection frameworks, and platform requirements." },
        { t: "Token Classification & Regulatory Assessment", d: "Preliminary assessment of token nature under applicable frameworks — utility, payment, security, asset-referenced, e-money. Identification of regulatory triggers and classification risks." },
        { t: "MiCA-Related Issues", d: "Guidance on the Markets in Crypto-Assets Regulation scope, whitepaper obligations, ART and EMT regimes, exemptions, and transitional provisions. Identification of MiCA applicability to specific token models." },
        { t: "CASP Structuring", d: "Analysis of crypto-asset service provider authorization requirements, scope of regulated services, passporting considerations, and organizational requirements under MiCA and national transpositions." },
        { t: "Sandbox & Regulatory Innovation", d: "Experience with regulatory sandboxes including the Spanish Financial Sandbox (Ley 7/2020), the FCA Digital Securities Sandbox (DSS), and the EU DLT Pilot Regime (EU 2022/858). Guidance on application strategy, regulatory engagement, and compliance within sandbox parameters." },
        { t: "Blockchain Legal Structuring", d: "Legal architecture for blockchain-based projects including entity selection, multi-jurisdiction coordination, governance frameworks, smart contract legal implications, and DAO-related considerations." },
        { t: "Web3 Governance & Compliance", d: "Design and implementation of compliance frameworks for Web3 projects, including AML/CFT programs, sanctions screening protocols, KYC procedures, and ongoing monitoring requirements." },
        { t: "Cross-Border Structuring", d: "Coordination of regulatory obligations across jurisdictions. Analysis of regulatory arbitrage risks, passporting options, and optimal structuring for multi-jurisdiction digital asset projects." }
      ]
    },
    how: {
      title: "How It Works",
      sub: "A structured path from question to clarity.",
      steps: [
        { t: "1. Describe Your Project", d: "Complete a structured intake form tailored to your matter type. The system adapts its questions based on whether you're working on tokenization, MiCA assessment, CASP authorization, sandbox applications, or other digital asset matters." },
        { t: "2. Guided Preliminary Analysis", d: "An intelligent assistant — pre-loaded with your intake context — helps you organize the legal and regulatory dimensions of your project. It identifies relevant considerations, flags missing information, and structures the key issues." },
        { t: "3. Structured Output", d: "You receive a preliminary orientation including: matter summary, relevant legal and regulatory considerations, information gaps, preliminary risk areas, and a recommended next step." },
        { t: "4. Professional Escalation", d: "For matters requiring formal legal advice, human review, or deeper analysis, request a consultation with qualified legal professionals. Complex, regulated, or multi-jurisdictional matters are flagged for escalation automatically." }
      ],
      disclaimer: "The preliminary guidance provided through this platform is general in nature and does not constitute formal individualized legal advice. Professional legal engagement is available as a separate service."
    },
    cases: {
      title: "Use Cases",
      sub: "Common scenarios where CLATEC helps bring clarity.",
      items: [
        { t: "I want to tokenize a real estate asset", d: "Identify the legal qualification of the token, issuer obligations, investor protection requirements, platform needs, and relevant jurisdictional considerations." },
        { t: "I want to launch a token and assess regulatory exposure", d: "Understand whether your token may be classified as a security, utility, ART, or EMT, and what obligations follow." },
        { t: "I need to understand whether MiCA applies to my project", d: "Map your token model and service activities against MiCA scope, exemptions, and transitional provisions." },
        { t: "I am exploring a multi-jurisdiction structure", d: "Identify regulatory requirements across jurisdictions, passporting options, and structuring risks." },
        { t: "I want to assess whether my crypto service requires authorization", d: "Analyze your activities against CASP definitions, identify the authorization path, and understand organizational requirements." },
        { t: "I want to apply to a regulatory sandbox", d: "Evaluate eligibility for the Spanish Financial Sandbox, FCA DSS, or EU DLT Pilot Regime. Structure your application strategy and understand sandbox-specific compliance obligations." },
        { t: "I want to prepare for a legal consultation with a clearer project map", d: "Use CLATEC to organize your matter before engaging professional counsel — saving time and increasing the quality of the consultation." }
      ]
    },
    consultation: {
      title: "Request Consultation",
      sub: "Professional legal review by qualified practitioners.",
      desc: "When your matter requires formal legal advice, detailed regulatory analysis, or human review of documentation, request a professional consultation. This is a separate engagement from the preliminary guidance provided through the platform.",
      features: ["Consultation with legal professionals admitted in Spain and England & Wales", "Tailored analysis of your specific matter", "Written preliminary opinion where applicable", "Follow-up recommendations and next steps"],
      form: { name: "Full name", email: "Email", company: "Company (optional)", matter: "Brief description of your matter", preferred: "Preferred time slot", submit: "Submit Request", success: "Your consultation request has been submitted. We will respond within 24–48 hours." }
    },
    legal: {
      title: "Legal Information",
      notice: {
        t: "Legal Notice",
        body: `This website is operated by Aznar Legal & Compliance SLP (\"Azlyc\"), a Spanish professional limited company registered in Barcelona, with CIF B-XXXXXXXX.\n\nThe platform CLATEC provides structured preliminary legal guidance in the field of digital assets, tokenization, blockchain, and related regulatory matters.\n\nThe preliminary output generated through CLATEC does not constitute formal individualized legal advice. It is general in nature, depends on the information provided by the user, and may be incomplete if relevant facts are omitted.\n\nUse of this platform does not create an attorney-client relationship. Professional legal engagement is available as a separate service upon request.`
      },
      privacy: {
        t: "Privacy Policy",
        body: `Data Controller: Aznar Legal & Compliance SLP.\n\nWe collect personal data you provide through intake forms and chat interactions, including: name, email, company, jurisdictional information, project descriptions, and conversation logs.\n\nPurpose: To provide preliminary legal guidance, process consultation requests, and improve our services.\n\nLegal Basis: Consent (Art. 6(1)(a) GDPR) for processing intake and chat data; legitimate interest (Art. 6(1)(f) GDPR) for platform improvement and security.\n\nRetention: Data is retained for the duration necessary to fulfill the stated purposes and in compliance with applicable legal obligations.\n\nRights: You may exercise your rights of access, rectification, erasure, portability, restriction, and objection by contacting: privacy@clatec.consulting.\n\nInternational Transfers: Data is processed within the EEA. Any transfers outside the EEA are subject to appropriate safeguards.\n\nCookies: This platform uses essential cookies only. No advertising or tracking cookies are deployed.`
      },
      terms: {
        t: "Terms of Use",
        body: `By using CLATEC you agree to the following terms:\n\n1. Nature of Service: CLATEC provides structured preliminary legal guidance. Outputs are general, preliminary, and do not constitute formal legal advice.\n\n2. No Attorney-Client Relationship: Use of this platform does not establish an attorney-client relationship. Such relationship arises only through a separate formal engagement.\n\n3. Accuracy of Information: The quality of guidance depends on the accuracy and completeness of information you provide. CLATEC is not responsible for incomplete or inaccurate outputs resulting from incomplete user input.\n\n4. Professional Consultation: For matters requiring formal legal advice, regulatory filings, or binding opinions, you must engage a qualified legal professional separately.\n\n5. Intellectual Property: All content, design, and technology of this platform belong to Aznar Legal & Compliance SLP.\n\n6. Limitation of Liability: To the maximum extent permitted by law, CLATEC and its operator shall not be liable for any decisions made based on preliminary guidance without subsequent professional legal review.\n\n7. Governing Law: These terms are governed by Spanish law. Courts of Barcelona shall have jurisdiction.`
      },
      disclaimer: {
        t: "Disclaimer",
        body: `The platform provides preliminary general guidance only.\n\nFormal legal advice requires separate professional engagement.\n\nOutputs depend on facts presented by the user and may be incomplete if information is missing.\n\nNo automated output from this platform should be treated as a definitive legal opinion, regulatory clearance, or compliance certification.\n\nUsers are strongly encouraged to seek qualified professional advice before making legal, regulatory, or commercial decisions based on platform outputs.`
      }
    },
    intake: {
      title: "Start Your Analysis",
      sub: "Complete the intake form to provide context for your matter.",
      fields: {
        firstName: "First name", lastName: "Last name", email: "Email",
        company: "Company (optional)", role: "Role / Position (optional)",
        country: "Country of residence", mainJurisdiction: "Main jurisdiction of the project",
        otherJurisdictions: "Other relevant jurisdictions (optional)",
        matterType: "Matter type", projectStage: "Project stage", objective: "Objective",
        description: "Please describe your project or legal/regulatory question",
        urgency: "Urgency",
        // Conditional - Tokenization
        assetType: "Underlying asset type",
        economicReturn: "Are token holders expected to receive economic return?",
        investorsExpected: "Are investors expected?",
        investorType: "Investor type",
        issuanceSize: "Approximate issuance size",
        entityExists: "Does a legal entity already exist?",
        docsExist: "Does any whitepaper, term sheet, or draft documentation exist?",
        // Conditional - MiCA
        tokenType: "Intended token type",
        refersToAssets: "Does the token refer to one or more assets?",
        stableValue: "Is the token intended to be stable in value?",
        cryptoServices: "Will crypto-asset services be provided?",
        targetJurisdictions: "Target jurisdictions",
        publicMarketing: "Is there public marketing?",
        // Conditional - CASP
        serviceType: "Contemplated service type",
        custodyInvolved: "Is custody involved?",
        exchangeInvolved: "Is exchange/execution involved?",
        advisoryInvolved: "Is advisory involved?",
        clientType: "Target client type",
        incorporation: "Place of incorporation / planned incorporation",
        // Conditional - Sandbox
        innovationElement: "What is the innovation element?",
        regulatoryBarrier: "What regulatory barrier exists?",
        mvpExists: "Does an MVP exist?",
        intendedMarket: "Intended market",
        supervisoryAngle: "Supervisory angle as you understand it",
        targetSandbox: "Which sandbox are you considering?"
      },
      matterTypes: ["Asset tokenization", "Token issuance", "MiCA-related assessment", "CASP-related issue", "Governance / compliance", "Cross-border structuring", "Sandbox / regulatory innovation", "Other"],
      stages: ["Early idea", "Structuring phase", "Documentation in progress", "Ready to launch", "Already operating"],
      objectives: ["Understand legal framework", "Identify regulatory issues", "Assess possible structure", "Prepare for professional consultation", "Explore jurisdictional options", "Other"],
      urgencies: ["Low", "Medium", "High"],
      yesNo: ["Yes", "No", "Unsure"],
      investorTypes: ["Retail", "Professional", "Unknown"],
      sandboxOptions: ["Spanish Financial Sandbox (Ley 7/2020)", "FCA Digital Securities Sandbox (DSS)", "EU DLT Pilot Regime (2022/858)", "Other / Multiple", "Not sure yet"],
      consent1: "I accept the Privacy Policy",
      consent2: "I accept the Terms of Use",
      consent3: "I acknowledge that platform output is preliminary and does not constitute formal legal advice",
      submit: "Proceed to Analysis",
      required: "Required"
    },
    chat: {
      title: "Guided Analysis",
      placeholder: "Type your message…",
      send: "Send",
      actions: { consult: "Request Consultation", email: "Email Summary", docs: "Share Documents", end: "End Analysis" },
      thinking: "Analyzing…",
      welcome: "Based on your intake, I understand you are working on"
    },
    footer: {
      operator: "Operated by Aznar Legal & Compliance SLP",
      credential: "Supported by qualified legal professionals admitted in Spain and England & Wales",
      rights: "All rights reserved."
    }
  },
  es: {
    nav: { home: "Inicio", expertise: "Áreas", how: "Cómo Funciona", cases: "Casos de Uso", consultation: "Solicitar Consulta", legal: "Legal" },
    cta: { start: "Iniciar Análisis", consult: "Solicitar Consulta", learn: "Saber Más" },
    home: {
      h1: "Inteligencia Jurídica para Tokenización y Activos Digitales",
      sub: "Orientación jurídica preliminar estructurada para proyectos blockchain, emisión de tokens, MiCA, CASP, sandboxes regulatorios y estructuración transfronteriza de activos digitales.",
      tagline: "Claridad antes del compromiso.",
      areas_title: "Áreas Principales",
      areas: ["Tokenización de Activos", "Evaluación MiCA", "Estructuración CASP", "Sandbox e Innovación", "Estructuración Transfronteriza", "Gobernanza y Compliance"],
      process_title: "Cómo Funciona",
      steps: ["Describe tu proyecto", "Recibe orientación preliminar estructurada", "Escala a revisión profesional si es necesario"],
      credential: "Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales",
      trust: "Operado por Aznar Legal & Compliance SLP"
    },
    expertise: {
      title: "Áreas de Especialidad",
      sub: "Conocimiento regulatorio profundo a lo largo del ciclo de vida de los activos digitales.",
      items: [
        { t: "Tokenización de Activos", d: "Estructuración de la tokenización de activos inmobiliarios, instrumentos de deuda, participaciones en fondos y otros activos del mundo real. Análisis de la calificación jurídica, obligaciones del emisor, marcos de protección al inversor y requisitos de plataforma." },
        { t: "Clasificación de Tokens y Evaluación Regulatoria", d: "Evaluación preliminar de la naturaleza del token según los marcos aplicables — utilidad, pago, valor, referenciado a activos, dinero electrónico. Identificación de activadores regulatorios y riesgos de clasificación." },
        { t: "Cuestiones Relacionadas con MiCA", d: "Orientación sobre el alcance del Reglamento MiCA, obligaciones del libro blanco, regímenes ART y EMT, exenciones y disposiciones transitorias. Identificación de la aplicabilidad de MiCA a modelos de tokens específicos." },
        { t: "Estructuración CASP", d: "Análisis de requisitos de autorización de proveedores de servicios de criptoactivos, alcance de servicios regulados, consideraciones de pasaporte y requisitos organizativos bajo MiCA y transposiciones nacionales." },
        { t: "Sandbox e Innovación Regulatoria", d: "Experiencia con sandboxes regulatorios incluyendo el Sandbox Financiero Español (Ley 7/2020), el FCA Digital Securities Sandbox (DSS) y el Régimen Piloto DLT de la UE (2022/858). Orientación sobre estrategia de solicitud, interlocución regulatoria y cumplimiento dentro de los parámetros del sandbox." },
        { t: "Estructuración Jurídica Blockchain", d: "Arquitectura jurídica para proyectos basados en blockchain incluyendo selección de entidad, coordinación multi-jurisdiccional, marcos de gobernanza, implicaciones jurídicas de contratos inteligentes y consideraciones relacionadas con DAOs." },
        { t: "Gobernanza y Compliance Web3", d: "Diseño e implementación de marcos de cumplimiento para proyectos Web3, incluyendo programas AML/CFT, protocolos de screening de sanciones, procedimientos KYC y requisitos de monitorización continua." },
        { t: "Estructuración Transfronteriza", d: "Coordinación de obligaciones regulatorias entre jurisdicciones. Análisis de riesgos de arbitraje regulatorio, opciones de pasaporte y estructuración óptima para proyectos de activos digitales multi-jurisdiccionales." }
      ]
    },
    how: {
      title: "Cómo Funciona",
      sub: "Un camino estructurado de la pregunta a la claridad.",
      steps: [
        { t: "1. Describe Tu Proyecto", d: "Completa un formulario de intake estructurado adaptado a tu tipo de asunto. El sistema adapta sus preguntas según trabajes en tokenización, evaluación MiCA, autorización CASP, solicitudes de sandbox u otras materias de activos digitales." },
        { t: "2. Análisis Preliminar Guiado", d: "Un asistente inteligente — precargado con el contexto de tu intake — te ayuda a organizar las dimensiones jurídicas y regulatorias de tu proyecto. Identifica consideraciones relevantes, señala información faltante y estructura las cuestiones clave." },
        { t: "3. Resultado Estructurado", d: "Recibes una orientación preliminar que incluye: resumen del asunto, consideraciones jurídicas y regulatorias relevantes, lagunas de información, áreas de riesgo preliminares y siguiente paso recomendado." },
        { t: "4. Escalado Profesional", d: "Para asuntos que requieren asesoramiento jurídico formal, revisión humana o análisis más profundo, solicita una consulta con profesionales jurídicos cualificados. Los asuntos complejos, regulados o multi-jurisdiccionales se señalan para escalado automáticamente." }
      ],
      disclaimer: "La orientación preliminar proporcionada a través de esta plataforma es de carácter general y no constituye asesoramiento jurídico formal individualizado. El compromiso profesional jurídico está disponible como servicio separado bajo solicitud."
    },
    cases: {
      title: "Casos de Uso",
      sub: "Escenarios frecuentes donde CLATEC aporta claridad.",
      items: [
        { t: "Quiero tokenizar un activo inmobiliario", d: "Identificar la calificación jurídica del token, obligaciones del emisor, requisitos de protección al inversor, necesidades de plataforma y consideraciones jurisdiccionales relevantes." },
        { t: "Quiero lanzar un token y evaluar la exposición regulatoria", d: "Comprender si tu token puede clasificarse como valor, utilidad, ART o EMT, y qué obligaciones se derivan." },
        { t: "Necesito entender si MiCA aplica a mi proyecto", d: "Mapear tu modelo de token y actividades de servicio contra el alcance, exenciones y disposiciones transitorias de MiCA." },
        { t: "Estoy explorando una estructura multi-jurisdiccional", d: "Identificar requisitos regulatorios entre jurisdicciones, opciones de pasaporte y riesgos de estructuración." },
        { t: "Quiero evaluar si mi servicio cripto requiere autorización", d: "Analizar tus actividades contra las definiciones CASP, identificar la vía de autorización y comprender los requisitos organizativos." },
        { t: "Quiero solicitar acceso a un sandbox regulatorio", d: "Evaluar la elegibilidad para el Sandbox Financiero Español, FCA DSS o Régimen Piloto DLT de la UE. Estructurar tu estrategia de solicitud y comprender las obligaciones de cumplimiento específicas del sandbox." },
        { t: "Quiero prepararme para una consulta con un mapa más claro del proyecto", d: "Usa CLATEC para organizar tu asunto antes de contratar asesoramiento profesional — ahorrando tiempo y aumentando la calidad de la consulta." }
      ]
    },
    consultation: {
      title: "Solicitar Consulta",
      sub: "Revisión jurídica profesional por profesionales cualificados.",
      desc: "Cuando tu asunto requiere asesoramiento jurídico formal, análisis regulatorio detallado o revisión humana de documentación, solicita una consulta profesional. Se trata de un compromiso separado de la orientación preliminar proporcionada a través de la plataforma.",
      features: ["Consulta con profesionales jurídicos habilitados en España e Inglaterra y Gales", "Análisis adaptado a tu asunto específico", "Dictamen preliminar escrito cuando proceda", "Recomendaciones de seguimiento y próximos pasos"],
      form: { name: "Nombre completo", email: "Email", company: "Empresa (opcional)", matter: "Descripción breve de tu asunto", preferred: "Franja horaria preferida", submit: "Enviar Solicitud", success: "Tu solicitud de consulta ha sido enviada. Responderemos en 24–48 horas." }
    },
    legal: {
      title: "Información Legal",
      notice: {
        t: "Aviso Legal",
        body: `Este sitio web es operado por Aznar Legal & Compliance SLP (\"Azlyc\"), sociedad profesional de responsabilidad limitada española registrada en Barcelona, con CIF B-XXXXXXXX.\n\nLa plataforma CLATEC proporciona orientación jurídica preliminar estructurada en el ámbito de activos digitales, tokenización, blockchain y materias regulatorias relacionadas.\n\nEl resultado preliminar generado a través de CLATEC no constituye asesoramiento jurídico formal individualizado. Es de carácter general, depende de la información facilitada por el usuario y puede ser incompleto si se omiten datos relevantes.\n\nEl uso de esta plataforma no crea una relación abogado-cliente. El compromiso profesional jurídico está disponible como servicio separado bajo solicitud.`
      },
      privacy: {
        t: "Política de Privacidad",
        body: `Responsable del Tratamiento: Aznar Legal & Compliance SLP.\n\nRecogemos datos personales que usted facilita a través de formularios de intake e interacciones de chat, incluyendo: nombre, email, empresa, información jurisdiccional, descripciones de proyectos y registros de conversaciones.\n\nFinalidad: Proporcionar orientación jurídica preliminar, procesar solicitudes de consulta y mejorar nuestros servicios.\n\nBase Jurídica: Consentimiento (Art. 6(1)(a) RGPD) para el tratamiento de datos de intake y chat; interés legítimo (Art. 6(1)(f) RGPD) para mejora de la plataforma y seguridad.\n\nConservación: Los datos se conservan durante el tiempo necesario para cumplir las finalidades indicadas y de conformidad con las obligaciones legales aplicables.\n\nDerechos: Puede ejercer sus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición contactando con: privacy@clatec.consulting.\n\nTransferencias Internacionales: Los datos se tratan dentro del EEE. Cualquier transferencia fuera del EEE está sujeta a garantías adecuadas.\n\nCookies: Esta plataforma utiliza únicamente cookies esenciales. No se despliegan cookies publicitarias ni de seguimiento.`
      },
      terms: {
        t: "Condiciones de Uso",
        body: `Al utilizar CLATEC usted acepta las siguientes condiciones:\n\n1. Naturaleza del Servicio: CLATEC proporciona orientación jurídica preliminar estructurada. Los resultados son generales, preliminares y no constituyen asesoramiento jurídico formal.\n\n2. Ausencia de Relación Abogado-Cliente: El uso de esta plataforma no establece una relación abogado-cliente. Dicha relación surge únicamente a través de un compromiso formal separado.\n\n3. Exactitud de la Información: La calidad de la orientación depende de la exactitud y completitud de la información que usted facilite. CLATEC no es responsable de resultados incompletos o inexactos derivados de información incompleta del usuario.\n\n4. Consulta Profesional: Para asuntos que requieran asesoramiento jurídico formal, presentaciones regulatorias o dictámenes vinculantes, debe contratar un profesional jurídico cualificado por separado.\n\n5. Propiedad Intelectual: Todo el contenido, diseño y tecnología de esta plataforma pertenece a Aznar Legal & Compliance SLP.\n\n6. Limitación de Responsabilidad: En la máxima medida permitida por la ley, CLATEC y su operador no serán responsables de decisiones tomadas sobre la base de la orientación preliminar sin posterior revisión jurídica profesional.\n\n7. Ley Aplicable: Estas condiciones se rigen por la ley española. Los juzgados y tribunales de Barcelona tendrán jurisdicción.`
      },
      disclaimer: {
        t: "Aviso de Limitación",
        body: `La plataforma proporciona únicamente orientación general preliminar.\n\nEl asesoramiento jurídico formal requiere un compromiso profesional separado.\n\nLos resultados dependen de los hechos presentados por el usuario y pueden ser incompletos si falta información.\n\nNingún resultado automatizado de esta plataforma debe tratarse como un dictamen jurídico definitivo, autorización regulatoria o certificación de cumplimiento.\n\nSe recomienda encarecidamente a los usuarios que busquen asesoramiento profesional cualificado antes de tomar decisiones jurídicas, regulatorias o comerciales basadas en los resultados de la plataforma.`
      }
    },
    intake: {
      title: "Inicia Tu Análisis",
      sub: "Completa el formulario de intake para contextualizar tu asunto.",
      fields: {
        firstName: "Nombre", lastName: "Apellidos", email: "Email",
        company: "Empresa (opcional)", role: "Cargo / Posición (opcional)",
        country: "País de residencia", mainJurisdiction: "Jurisdicción principal del proyecto",
        otherJurisdictions: "Otras jurisdicciones relevantes (opcional)",
        matterType: "Tipo de asunto", projectStage: "Fase del proyecto", objective: "Objetivo",
        description: "Describe tu proyecto o pregunta jurídica/regulatoria",
        urgency: "Urgencia",
        assetType: "Tipo de activo subyacente",
        economicReturn: "¿Se espera que los titulares del token reciban retorno económico?",
        investorsExpected: "¿Se esperan inversores?",
        investorType: "Tipo de inversor",
        issuanceSize: "Tamaño aproximado de la emisión contemplada",
        entityExists: "¿Existe ya una entidad jurídica?",
        docsExist: "¿Existe algún whitepaper, term sheet o documentación borrador?",
        tokenType: "Tipo de token previsto",
        refersToAssets: "¿El token se refiere a uno o más activos?",
        stableValue: "¿El token pretende ser estable en valor?",
        cryptoServices: "¿Se prestarán servicios de criptoactivos?",
        targetJurisdictions: "Jurisdicciones objetivo",
        publicMarketing: "¿Hay marketing público?",
        serviceType: "Tipo de servicio contemplado",
        custodyInvolved: "¿Implica custodia?",
        exchangeInvolved: "¿Implica intercambio/ejecución?",
        advisoryInvolved: "¿Implica asesoramiento?",
        clientType: "Tipo de cliente objetivo",
        incorporation: "Lugar de constitución / constitución prevista",
        innovationElement: "¿Cuál es el elemento de innovación?",
        regulatoryBarrier: "¿Qué barrera regulatoria existe?",
        mvpExists: "¿Existe un MVP?",
        intendedMarket: "Mercado previsto",
        supervisoryAngle: "Ángulo supervisor tal como lo entiendes",
        targetSandbox: "¿Qué sandbox estás considerando?"
      },
      matterTypes: ["Tokenización de activos", "Emisión de tokens", "Evaluación MiCA", "Cuestión CASP", "Gobernanza / compliance", "Estructuración transfronteriza", "Sandbox / innovación regulatoria", "Otro"],
      stages: ["Idea temprana", "Fase de estructuración", "Documentación en curso", "Listo para lanzar", "Ya operando"],
      objectives: ["Comprender el marco legal", "Identificar cuestiones regulatorias", "Evaluar posible estructura", "Preparar consulta profesional", "Explorar opciones jurisdiccionales", "Otro"],
      urgencies: ["Baja", "Media", "Alta"],
      yesNo: ["Sí", "No", "No seguro"],
      investorTypes: ["Minorista", "Profesional", "Desconocido"],
      sandboxOptions: ["Sandbox Financiero Español (Ley 7/2020)", "FCA Digital Securities Sandbox (DSS)", "Régimen Piloto DLT UE (2022/858)", "Otro / Múltiple", "No estoy seguro aún"],
      consent1: "Acepto la Política de Privacidad",
      consent2: "Acepto las Condiciones de Uso",
      consent3: "Reconozco que el resultado de la plataforma es preliminar y no constituye asesoramiento jurídico formal",
      submit: "Proceder al Análisis",
      required: "Obligatorio"
    },
    chat: {
      title: "Análisis Guiado",
      placeholder: "Escribe tu mensaje…",
      send: "Enviar",
      actions: { consult: "Solicitar Consulta", email: "Enviar Resumen", docs: "Compartir Documentos", end: "Finalizar Análisis" },
      thinking: "Analizando…",
      welcome: "Según tu intake, entiendo que estás trabajando en"
    },
    footer: {
      operator: "Operado por Aznar Legal & Compliance SLP",
      credential: "Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales",
      rights: "Todos los derechos reservados."
    }
  }
};

// ─── STYLES ──────────────────────────────────────────────────────────
const palette = {
  bg: "#070b14", bgCard: "#0d1320", bgCardHover: "#111827",
  bgInput: "#0f1629", border: "#1a2236", borderFocus: "#2d6a7a",
  accent: "#2d8a9a", accentHover: "#35a0b2", accentMuted: "#1a5a6a",
  text: "#dfe1e6", textMuted: "#8892a4", textDim: "#5a6478",
  white: "#f0eeea", danger: "#c0392b", success: "#27ae60"
};

const font = `'DM Sans', 'Segoe UI', system-ui, sans-serif`;
const fontDisplay = `'Sora', 'DM Sans', system-ui, sans-serif`;

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function CLATEC() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [intakeData, setIntakeData] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [consultationSent, setConsultationSent] = useState(false);
  const t = T[lang];

  const navTo = useCallback((p) => { setPage(p); setMenuOpen(false); window.scrollTo?.(0,0); }, []);

  return (
    <div style={{ fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${palette.accent}44; }
        input, textarea, select { font-family: ${font}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp .5s ease both; }
        .fade-up-d1 { animation: fadeUp .5s ease .1s both; }
        .fade-up-d2 { animation: fadeUp .5s ease .2s both; }
        .fade-up-d3 { animation: fadeUp .5s ease .3s both; }
        .btn-primary { background:${palette.accent}; color:#fff; border:none; padding:14px 32px; border-radius:6px; font-size:15px; font-weight:600; cursor:pointer; transition:all .2s; font-family:${font}; letter-spacing:.3px; }
        .btn-primary:hover { background:${palette.accentHover}; transform:translateY(-1px); }
        .btn-secondary { background:transparent; color:${palette.accent}; border:1px solid ${palette.accent}; padding:12px 28px; border-radius:6px; font-size:14px; font-weight:500; cursor:pointer; transition:all .2s; font-family:${font}; }
        .btn-secondary:hover { background:${palette.accent}15; }
        .input-field { background:${palette.bgInput}; border:1px solid ${palette.border}; color:${palette.text}; padding:12px 16px; border-radius:6px; font-size:14px; width:100%; transition:border-color .2s; outline:none; }
        .input-field:focus { border-color:${palette.borderFocus}; }
        .input-field::placeholder { color:${palette.textDim}; }
        textarea.input-field { resize:vertical; min-height:100px; }
        select.input-field { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238892a4' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; }
        .card { background:${palette.bgCard}; border:1px solid ${palette.border}; border-radius:10px; padding:28px; transition:all .25s; }
        .card:hover { border-color:${palette.accentMuted}; background:${palette.bgCardHover}; }
        a { color:${palette.accent}; text-decoration:none; }
        a:hover { text-decoration:underline; }
        .section-title { font-family:${fontDisplay}; font-size:36px; font-weight:600; color:${palette.white}; letter-spacing:-.5px; }
        .section-sub { font-size:17px; color:${palette.textMuted}; max-width:640px; line-height:1.65; margin-top:10px; }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:`${palette.bg}ee`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${palette.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ fontFamily:fontDisplay, fontSize:22, fontWeight:700, letterSpacing:2, color:palette.white, cursor:"pointer" }} onClick={()=>navTo("home")}>
            CLATEC
          </div>
          {/* Desktop nav */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }} className="desktop-nav">
            {["home","expertise","how","cases","consultation","legal"].map(k => (
              <button key={k} onClick={()=>navTo(k)} style={{ background: page===k ? `${palette.accent}18` : "transparent", color: page===k ? palette.accent : palette.textMuted, border:"none", padding:"8px 14px", borderRadius:6, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all .2s", fontFamily:font }}>
                {t.nav[k]}
              </button>
            ))}
            <div style={{ width:1, height:24, background:palette.border, margin:"0 8px" }} />
            <button onClick={()=>setLang(lang==="en"?"es":"en")} style={{ background:palette.bgCard, color:palette.textMuted, border:`1px solid ${palette.border}`, padding:"6px 12px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", letterSpacing:1, fontFamily:font }}>
              {lang==="en"?"ES":"EN"}
            </button>
            <button className="btn-primary" onClick={()=>navTo("intake")} style={{ padding:"8px 20px", fontSize:13, marginLeft:8 }}>
              {t.cta.start}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── PAGE CONTENT ─── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        {page === "home" && <HomePage t={t} navTo={navTo} />}
        {page === "expertise" && <ExpertisePage t={t} />}
        {page === "how" && <HowPage t={t} navTo={navTo} />}
        {page === "cases" && <CasesPage t={t} navTo={navTo} />}
        {page === "consultation" && <ConsultationPage t={t} sent={consultationSent} setSent={setConsultationSent} />}
        {page === "legal" && <LegalPage t={t} />}
        {page === "intake" && <IntakePage t={t} lang={lang} data={intakeData} setData={setIntakeData} onComplete={(d)=>{ setIntakeData(d); setChatMessages([]); navTo("chat"); }} />}
        {page === "chat" && <ChatPage t={t} lang={lang} intake={intakeData} messages={chatMessages} setMessages={setChatMessages} navTo={navTo} />}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop:`1px solid ${palette.border}`, marginTop:80, padding:"40px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:20 }}>
          <div>
            <div style={{ fontFamily:fontDisplay, fontSize:18, fontWeight:700, letterSpacing:2, color:palette.white, marginBottom:8 }}>CLATEC</div>
            <div style={{ fontSize:12, color:palette.textDim, lineHeight:1.6 }}>
              {t.footer.operator}<br/>{t.footer.credential}
            </div>
          </div>
          <div style={{ fontSize:12, color:palette.textDim }}>
            © {new Date().getFullYear()} CLATEC. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────
function HomePage({ t, navTo }) {
  return (
    <div style={{ paddingTop:80, paddingBottom:60 }}>
      {/* Hero */}
      <div className="fade-up" style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:600, color:palette.accent, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>
          {t.home.tagline}
        </div>
        <h1 style={{ fontFamily:fontDisplay, fontSize:48, fontWeight:700, color:palette.white, lineHeight:1.15, letterSpacing:-.5 }}>
          {t.home.h1}
        </h1>
        <p style={{ fontSize:18, color:palette.textMuted, lineHeight:1.7, marginTop:24, maxWidth:680, margin:"24px auto 0" }}>
          {t.home.sub}
        </p>
        <div style={{ marginTop:40, display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={()=>navTo("intake")} style={{ fontSize:16, padding:"16px 40px" }}>{t.cta.start}</button>
          <button className="btn-secondary" onClick={()=>navTo("consultation")}>{t.cta.consult}</button>
        </div>
      </div>

      {/* Divider line */}
      <div style={{ width:60, height:1, background:palette.border, margin:"64px auto" }} />

      {/* Areas */}
      <div className="fade-up-d1">
        <h2 style={{ fontFamily:fontDisplay, fontSize:14, fontWeight:600, color:palette.accent, letterSpacing:2, textTransform:"uppercase", textAlign:"center", marginBottom:32 }}>
          {t.home.areas_title}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
          {t.home.areas.map((a,i) => (
            <div key={i} className="card" style={{ padding:20, textAlign:"center" }}>
              <span style={{ fontSize:15, fontWeight:500, color:palette.white }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="fade-up-d2" style={{ marginTop:64 }}>
        <h2 style={{ fontFamily:fontDisplay, fontSize:14, fontWeight:600, color:palette.accent, letterSpacing:2, textTransform:"uppercase", textAlign:"center", marginBottom:32 }}>
          {t.home.process_title}
        </h2>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
          {t.home.steps.map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, maxWidth:300 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${palette.accent}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:palette.accent, fontWeight:600, fontSize:14 }}>{i+1}</div>
              <span style={{ fontSize:15, color:palette.textMuted, lineHeight:1.6 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Credential */}
      <div className="fade-up-d3" style={{ marginTop:64, textAlign:"center" }}>
        <p style={{ fontSize:13, color:palette.textDim, fontStyle:"italic" }}>{t.home.credential}</p>
      </div>
    </div>
  );
}

// ─── EXPERTISE PAGE ──────────────────────────────────────────────────
function ExpertisePage({ t }) {
  return (
    <div style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="fade-up">
        <h1 className="section-title">{t.expertise.title}</h1>
        <p className="section-sub">{t.expertise.sub}</p>
      </div>
      <div style={{ marginTop:40, display:"grid", gap:20 }}>
        {t.expertise.items.map((item,i) => (
          <div key={i} className="card fade-up" style={{ animationDelay:`${i*.06}s` }}>
            <h3 style={{ fontFamily:fontDisplay, fontSize:18, fontWeight:600, color:palette.white, marginBottom:10 }}>{item.t}</h3>
            <p style={{ fontSize:14, color:palette.textMuted, lineHeight:1.7 }}>{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS PAGE ───────────────────────────────────────────────
function HowPage({ t, navTo }) {
  return (
    <div style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="fade-up">
        <h1 className="section-title">{t.how.title}</h1>
        <p className="section-sub">{t.how.sub}</p>
      </div>
      <div style={{ marginTop:40, display:"grid", gap:24 }}>
        {t.how.steps.map((s,i) => (
          <div key={i} className="card fade-up" style={{ animationDelay:`${i*.1}s`, display:"flex", gap:20, alignItems:"flex-start" }}>
            <div style={{ width:48, height:48, borderRadius:10, background:`${palette.accent}15`, border:`1px solid ${palette.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:fontDisplay, fontWeight:700, color:palette.accent, fontSize:20 }}>{i+1}</span>
            </div>
            <div>
              <h3 style={{ fontFamily:fontDisplay, fontSize:18, fontWeight:600, color:palette.white, marginBottom:8 }}>{s.t}</h3>
              <p style={{ fontSize:14, color:palette.textMuted, lineHeight:1.7 }}>{s.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:32, padding:24, background:`${palette.accent}08`, border:`1px solid ${palette.accent}20`, borderRadius:8 }}>
        <p style={{ fontSize:13, color:palette.textDim, lineHeight:1.7, fontStyle:"italic" }}>{t.how.disclaimer}</p>
      </div>
      <div style={{ marginTop:32, textAlign:"center" }}>
        <button className="btn-primary" onClick={()=>navTo("intake")}>{t.cta.start}</button>
      </div>
    </div>
  );
}

// ─── USE CASES PAGE ──────────────────────────────────────────────────
function CasesPage({ t, navTo }) {
  return (
    <div style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="fade-up">
        <h1 className="section-title">{t.cases.title}</h1>
        <p className="section-sub">{t.cases.sub}</p>
      </div>
      <div style={{ marginTop:40, display:"grid", gap:16 }}>
        {t.cases.items.map((c,i) => (
          <div key={i} className="card fade-up" style={{ animationDelay:`${i*.06}s`, cursor:"pointer" }} onClick={()=>navTo("intake")}>
            <h3 style={{ fontFamily:fontDisplay, fontSize:16, fontWeight:600, color:palette.white, marginBottom:8 }}>{c.t}</h3>
            <p style={{ fontSize:14, color:palette.textMuted, lineHeight:1.6 }}>{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONSULTATION PAGE ───────────────────────────────────────────────
function ConsultationPage({ t, sent, setSent }) {
  const [form, setForm] = useState({ name:"", email:"", company:"", matter:"", preferred:"" });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div style={{ paddingTop:60, paddingBottom:60, maxWidth:680, margin:"0 auto" }}>
      <div className="fade-up">
        <h1 className="section-title">{t.consultation.title}</h1>
        <p className="section-sub">{t.consultation.sub}</p>
      </div>
      <p style={{ fontSize:15, color:palette.textMuted, lineHeight:1.7, marginTop:24 }}>{t.consultation.desc}</p>
      <ul style={{ marginTop:20, paddingLeft:20 }}>
        {t.consultation.features.map((f,i) => (
          <li key={i} style={{ fontSize:14, color:palette.textMuted, lineHeight:1.8 }}>{f}</li>
        ))}
      </ul>
      {sent ? (
        <div className="card fade-up" style={{ marginTop:32, borderColor:palette.success, textAlign:"center" }}>
          <p style={{ color:palette.success, fontWeight:500 }}>{t.consultation.form.success}</p>
        </div>
      ) : (
        <div className="card fade-up-d1" style={{ marginTop:32 }}>
          <div style={{ display:"grid", gap:16 }}>
            <input className="input-field" placeholder={t.consultation.form.name} value={form.name} onChange={e=>upd("name",e.target.value)} />
            <input className="input-field" placeholder={t.consultation.form.email} type="email" value={form.email} onChange={e=>upd("email",e.target.value)} />
            <input className="input-field" placeholder={t.consultation.form.company} value={form.company} onChange={e=>upd("company",e.target.value)} />
            <textarea className="input-field" placeholder={t.consultation.form.matter} value={form.matter} onChange={e=>upd("matter",e.target.value)} />
            <input className="input-field" placeholder={t.consultation.form.preferred} value={form.preferred} onChange={e=>upd("preferred",e.target.value)} />
            <button className="btn-primary" onClick={()=>{ if(form.name && form.email && form.matter) setSent(true); }} style={{ width:"100%" }}>{t.consultation.form.submit}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEGAL PAGE ──────────────────────────────────────────────────────
function LegalPage({ t }) {
  const [tab, setTab] = useState("notice");
  const tabs = ["notice","privacy","terms","disclaimer"];
  return (
    <div style={{ paddingTop:60, paddingBottom:60 }}>
      <h1 className="section-title fade-up">{t.legal.title}</h1>
      <div style={{ display:"flex", gap:8, marginTop:32, flexWrap:"wrap" }}>
        {tabs.map(k => (
          <button key={k} onClick={()=>setTab(k)} style={{ background: tab===k ? palette.accent : "transparent", color: tab===k ? "#fff" : palette.textMuted, border:`1px solid ${tab===k ? palette.accent : palette.border}`, padding:"10px 20px", borderRadius:6, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:font, transition:"all .2s" }}>
            {t.legal[k].t}
          </button>
        ))}
      </div>
      <div className="card fade-up" style={{ marginTop:24 }}>
        <h2 style={{ fontFamily:fontDisplay, fontSize:22, fontWeight:600, color:palette.white, marginBottom:16 }}>{t.legal[tab].t}</h2>
        <pre style={{ whiteSpace:"pre-wrap", fontSize:14, color:palette.textMuted, lineHeight:1.8, fontFamily:font }}>{t.legal[tab].body}</pre>
      </div>
    </div>
  );
}

// ─── INTAKE FORM ─────────────────────────────────────────────────────
function IntakePage({ t, lang, data, setData, onComplete }) {
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", company:"", role:"", country:"", mainJurisdiction:"", otherJurisdictions:"", matterType:"", projectStage:"", objective:"", description:"", urgency:"", assetType:"", economicReturn:"", investorsExpected:"", investorType:"", issuanceSize:"", entityExists:"", docsExist:"", tokenType:"", refersToAssets:"", stableValue:"", cryptoServices:"", targetJurisdictions:"", publicMarketing:"", serviceType:"", custodyInvolved:"", exchangeInvolved:"", advisoryInvolved:"", clientType:"", incorporation:"", innovationElement:"", regulatoryBarrier:"", mvpExists:"", intendedMarket:"", supervisoryAngle:"", targetSandbox:"", consent1:false, consent2:false, consent3:false, ...data });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  const f = t.intake.fields;

  const isTokenization = form.matterType === t.intake.matterTypes[0] || form.matterType === t.intake.matterTypes[1];
  const isMiCA = form.matterType === t.intake.matterTypes[2];
  const isCASP = form.matterType === t.intake.matterTypes[3];
  const isSandbox = form.matterType === t.intake.matterTypes[6];

  const canSubmit = form.firstName && form.email && form.matterType && form.description && form.consent1 && form.consent2 && form.consent3;

  const Label = ({children, req}) => (
    <label style={{ display:"block", fontSize:13, fontWeight:500, color:palette.textMuted, marginBottom:6 }}>
      {children} {req && <span style={{ color:palette.accent }}>*</span>}
    </label>
  );

  const SelectField = ({ label, value, options, k, req }) => (
    <div>
      <Label req={req}>{label}</Label>
      <select className="input-field" value={value} onChange={e=>upd(k,e.target.value)}>
        <option value="">—</option>
        {options.map((o,i) => <option key={i} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ paddingTop:60, paddingBottom:60, maxWidth:720, margin:"0 auto" }}>
      <div className="fade-up">
        <h1 className="section-title">{t.intake.title}</h1>
        <p className="section-sub">{t.intake.sub}</p>
      </div>

      <div style={{ marginTop:32, display:"grid", gap:20 }}>
        {/* Identity */}
        <div className="card fade-up">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div><Label req>{f.firstName}</Label><input className="input-field" value={form.firstName} onChange={e=>upd("firstName",e.target.value)} /></div>
            <div><Label>{f.lastName}</Label><input className="input-field" value={form.lastName} onChange={e=>upd("lastName",e.target.value)} /></div>
          </div>
          <div style={{ marginTop:16 }}><Label req>{f.email}</Label><input className="input-field" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16 }}>
            <div><Label>{f.company}</Label><input className="input-field" value={form.company} onChange={e=>upd("company",e.target.value)} /></div>
            <div><Label>{f.role}</Label><input className="input-field" value={form.role} onChange={e=>upd("role",e.target.value)} /></div>
          </div>
        </div>

        {/* Jurisdiction */}
        <div className="card fade-up-d1">
          <div style={{ display:"grid", gap:16 }}>
            <div><Label req>{f.country}</Label><input className="input-field" value={form.country} onChange={e=>upd("country",e.target.value)} /></div>
            <div><Label req>{f.mainJurisdiction}</Label><input className="input-field" value={form.mainJurisdiction} onChange={e=>upd("mainJurisdiction",e.target.value)} /></div>
            <div><Label>{f.otherJurisdictions}</Label><input className="input-field" value={form.otherJurisdictions} onChange={e=>upd("otherJurisdictions",e.target.value)} /></div>
          </div>
        </div>

        {/* Matter */}
        <div className="card fade-up-d2">
          <div style={{ display:"grid", gap:16 }}>
            <SelectField label={f.matterType} value={form.matterType} options={t.intake.matterTypes} k="matterType" req />
            <SelectField label={f.projectStage} value={form.projectStage} options={t.intake.stages} k="projectStage" />
            <SelectField label={f.objective} value={form.objective} options={t.intake.objectives} k="objective" />
            <SelectField label={f.urgency} value={form.urgency} options={t.intake.urgencies} k="urgency" />
          </div>
        </div>

        {/* Conditional: Tokenization */}
        {isTokenization && (
          <div className="card fade-up" style={{ borderColor:`${palette.accent}40` }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:palette.accent, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>
              {lang==="en"?"Tokenization Details":"Detalles de Tokenización"}
            </h3>
            <div style={{ display:"grid", gap:16 }}>
              <div><Label>{f.assetType}</Label><input className="input-field" value={form.assetType} onChange={e=>upd("assetType",e.target.value)} /></div>
              <SelectField label={f.economicReturn} value={form.economicReturn} options={t.intake.yesNo} k="economicReturn" />
              <SelectField label={f.investorsExpected} value={form.investorsExpected} options={t.intake.yesNo} k="investorsExpected" />
              <SelectField label={f.investorType} value={form.investorType} options={t.intake.investorTypes} k="investorType" />
              <div><Label>{f.issuanceSize}</Label><input className="input-field" value={form.issuanceSize} onChange={e=>upd("issuanceSize",e.target.value)} placeholder={lang==="en"?"e.g. €5M":"ej. 5M€"} /></div>
              <SelectField label={f.entityExists} value={form.entityExists} options={t.intake.yesNo} k="entityExists" />
              <SelectField label={f.docsExist} value={form.docsExist} options={t.intake.yesNo} k="docsExist" />
            </div>
          </div>
        )}

        {/* Conditional: MiCA */}
        {isMiCA && (
          <div className="card fade-up" style={{ borderColor:`${palette.accent}40` }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:palette.accent, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>
              {lang==="en"?"MiCA Assessment Details":"Detalles Evaluación MiCA"}
            </h3>
            <div style={{ display:"grid", gap:16 }}>
              <div><Label>{f.tokenType}</Label><input className="input-field" value={form.tokenType} onChange={e=>upd("tokenType",e.target.value)} /></div>
              <SelectField label={f.refersToAssets} value={form.refersToAssets} options={t.intake.yesNo} k="refersToAssets" />
              <SelectField label={f.stableValue} value={form.stableValue} options={t.intake.yesNo} k="stableValue" />
              <SelectField label={f.cryptoServices} value={form.cryptoServices} options={t.intake.yesNo} k="cryptoServices" />
              <div><Label>{f.targetJurisdictions}</Label><input className="input-field" value={form.targetJurisdictions} onChange={e=>upd("targetJurisdictions",e.target.value)} /></div>
              <SelectField label={f.publicMarketing} value={form.publicMarketing} options={t.intake.yesNo} k="publicMarketing" />
            </div>
          </div>
        )}

        {/* Conditional: CASP */}
        {isCASP && (
          <div className="card fade-up" style={{ borderColor:`${palette.accent}40` }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:palette.accent, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>
              {lang==="en"?"CASP Details":"Detalles CASP"}
            </h3>
            <div style={{ display:"grid", gap:16 }}>
              <div><Label>{f.serviceType}</Label><input className="input-field" value={form.serviceType} onChange={e=>upd("serviceType",e.target.value)} /></div>
              <SelectField label={f.custodyInvolved} value={form.custodyInvolved} options={t.intake.yesNo} k="custodyInvolved" />
              <SelectField label={f.exchangeInvolved} value={form.exchangeInvolved} options={t.intake.yesNo} k="exchangeInvolved" />
              <SelectField label={f.advisoryInvolved} value={form.advisoryInvolved} options={t.intake.yesNo} k="advisoryInvolved" />
              <div><Label>{f.clientType}</Label><input className="input-field" value={form.clientType} onChange={e=>upd("clientType",e.target.value)} /></div>
              <div><Label>{f.incorporation}</Label><input className="input-field" value={form.incorporation} onChange={e=>upd("incorporation",e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* Conditional: Sandbox */}
        {isSandbox && (
          <div className="card fade-up" style={{ borderColor:`${palette.accent}40` }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:palette.accent, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>
              {lang==="en"?"Sandbox Application Details":"Detalles Solicitud Sandbox"}
            </h3>
            <div style={{ display:"grid", gap:16 }}>
              <SelectField label={f.targetSandbox} value={form.targetSandbox} options={t.intake.sandboxOptions} k="targetSandbox" />
              <div><Label>{f.innovationElement}</Label><textarea className="input-field" value={form.innovationElement} onChange={e=>upd("innovationElement",e.target.value)} /></div>
              <div><Label>{f.regulatoryBarrier}</Label><textarea className="input-field" value={form.regulatoryBarrier} onChange={e=>upd("regulatoryBarrier",e.target.value)} /></div>
              <SelectField label={f.mvpExists} value={form.mvpExists} options={t.intake.yesNo} k="mvpExists" />
              <div><Label>{f.intendedMarket}</Label><input className="input-field" value={form.intendedMarket} onChange={e=>upd("intendedMarket",e.target.value)} /></div>
              <div><Label>{f.supervisoryAngle}</Label><textarea className="input-field" value={form.supervisoryAngle} onChange={e=>upd("supervisoryAngle",e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="card fade-up-d3">
          <Label req>{f.description}</Label>
          <textarea className="input-field" style={{ minHeight:140 }} value={form.description} onChange={e=>upd("description",e.target.value)} />
        </div>

        {/* Consents */}
        <div className="card" style={{ background:`${palette.accent}06` }}>
          {[["consent1", t.intake.consent1], ["consent2", t.intake.consent2], ["consent3", t.intake.consent3]].map(([k, label]) => (
            <label key={k} style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer", marginBottom:12 }}>
              <input type="checkbox" checked={form[k]} onChange={e=>upd(k,e.target.checked)} style={{ marginTop:3, accentColor:palette.accent }} />
              <span style={{ fontSize:13, color:palette.textMuted, lineHeight:1.5 }}>{label} <span style={{ color:palette.accent }}>*</span></span>
            </label>
          ))}
        </div>

        <button className="btn-primary" disabled={!canSubmit} onClick={()=>onComplete(form)} style={{ width:"100%", opacity:canSubmit?1:.5, cursor:canSubmit?"pointer":"not-allowed", padding:16, fontSize:16 }}>
          {t.intake.submit}
        </button>
      </div>
    </div>
  );
}

// ─── CHAT PAGE ───────────────────────────────────────────────────────
function ChatPage({ t, lang, intake, messages, setMessages, navTo }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const initialized = useRef(false);

  // Build initial context message from intake
  useEffect(() => {
    if (initialized.current || messages.length > 0) return;
    initialized.current = true;

    const matterLabel = intake.matterType || "a digital asset matter";
    const jurisdiction = intake.mainJurisdiction || "unspecified jurisdiction";
    const stage = intake.projectStage || "";
    const objective = intake.objective || "";
    const desc = intake.description || "";

    let welcome = lang === "en"
      ? `Thank you for completing the intake. Based on your submission, I understand the following:\n\n**Matter type:** ${matterLabel}\n**Main jurisdiction:** ${jurisdiction}${stage ? `\n**Project stage:** ${stage}` : ""}${objective ? `\n**Objective:** ${objective}` : ""}\n\n`
      : `Gracias por completar el intake. Según tu envío, entiendo lo siguiente:\n\n**Tipo de asunto:** ${matterLabel}\n**Jurisdicción principal:** ${jurisdiction}${stage ? `\n**Fase del proyecto:** ${stage}` : ""}${objective ? `\n**Objetivo:** ${objective}` : ""}\n\n`;

    if (desc) {
      welcome += lang === "en"
        ? `You described your matter as: "${desc.slice(0,200)}${desc.length > 200 ? "…" : ""}"\n\n`
        : `Has descrito tu asunto como: "${desc.slice(0,200)}${desc.length > 200 ? "…" : ""}"\n\n`;
    }

    // Conditional context
    const isTokenization = intake.matterType?.toLowerCase().includes("token");
    const isMiCA = intake.matterType?.toLowerCase().includes("mica");
    const isCASP = intake.matterType?.toLowerCase().includes("casp");
    const isSandbox = intake.matterType?.toLowerCase().includes("sandbox");

    if (isTokenization && intake.assetType) {
      welcome += lang === "en"
        ? `I note the underlying asset type is "${intake.assetType}"${intake.investorsExpected ? `, investors are expected (${intake.investorType || "type unspecified"})` : ""}${intake.issuanceSize ? `, contemplated size: ${intake.issuanceSize}` : ""}.\n\n`
        : `Noto que el activo subyacente es "${intake.assetType}"${intake.investorsExpected ? `, se esperan inversores (${intake.investorType || "tipo no especificado"})` : ""}${intake.issuanceSize ? `, tamaño contemplado: ${intake.issuanceSize}` : ""}.\n\n`;
    }

    if (isSandbox && intake.targetSandbox) {
      welcome += lang === "en"
        ? `You are considering the **${intake.targetSandbox}**${intake.innovationElement ? `. Innovation element: ${intake.innovationElement.slice(0,150)}` : ""}.\n\n`
        : `Estás considerando el **${intake.targetSandbox}**${intake.innovationElement ? `. Elemento de innovación: ${intake.innovationElement.slice(0,150)}` : ""}.\n\n`;
    }

    // Escalation flags
    const escalationTriggers = [];
    if (intake.investorType?.toLowerCase().includes("retail") || intake.investorType?.toLowerCase().includes("minorista")) escalationTriggers.push(lang==="en"?"retail investor exposure":"exposición a inversores minoristas");
    if (intake.custodyInvolved?.toLowerCase() === (lang==="en"?"yes":"sí")) escalationTriggers.push(lang==="en"?"custody involvement":"implicación de custodia");
    if (intake.stableValue?.toLowerCase() === (lang==="en"?"yes":"sí")) escalationTriggers.push(lang==="en"?"potential stablecoin/ART/EMT classification":"posible clasificación stablecoin/ART/EMT");
    if (intake.otherJurisdictions) escalationTriggers.push(lang==="en"?"multi-jurisdictional dimension":"dimensión multi-jurisdiccional");

    if (escalationTriggers.length > 0) {
      welcome += lang === "en"
        ? `⚠ I note the following elements that may warrant particular attention or professional review: ${escalationTriggers.join(", ")}.\n\n`
        : `⚠ Noto los siguientes elementos que pueden requerir atención particular o revisión profesional: ${escalationTriggers.join(", ")}.\n\n`;
    }

    welcome += lang === "en"
      ? "To help me structure the relevant legal and regulatory considerations, could you clarify:\n\n1. Have you already received any regulatory guidance or legal opinion on this matter?\n2. Is there a specific timeline driving this project?"
      : "Para ayudarme a estructurar las consideraciones jurídicas y regulatorias relevantes, ¿podrías aclarar:\n\n1. ¿Has recibido ya alguna orientación regulatoria o dictamen jurídico sobre este asunto?\n2. ¿Hay un calendario específico que impulse este proyecto?";

    setMessages([{ role: "assistant", content: welcome }]);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response (in production, this calls the LLM API)
    setTimeout(() => {
      const aiResponse = lang === "en"
        ? `Thank you for that clarification. Based on what you've shared, here are some preliminary observations:\n\n**1. Matter Summary**\nYour project involves ${intake.matterType?.toLowerCase() || "a digital asset matter"} in ${intake.mainJurisdiction || "the identified jurisdiction"}.\n\n**2. Preliminary Legal/Regulatory Considerations**\n• Token classification will be a central question — the characterization of the token under applicable frameworks will determine the regulatory obligations\n• Depending on the structure, prospectus/whitepaper obligations may apply\n• The jurisdictional dimension requires careful analysis of applicable regimes\n\n**3. Information Still Required**\n• Confirmation of the intended investor base and distribution channels\n• Clarification on the economic rights attached to the token\n• Details of any existing legal entity structure\n\n**4. Preliminary Risk Areas**\n• Regulatory classification uncertainty\n• Potential cross-border compliance obligations\n\n**5. Recommended Next Step**\nGiven the complexity of the matters identified, I would recommend requesting a professional consultation for a detailed regulatory mapping and structuring analysis.\n\n*This preliminary guidance is general in nature and does not constitute formal legal advice.*`
        : `Gracias por esa aclaración. Según lo que has compartido, aquí van algunas observaciones preliminares:\n\n**1. Resumen del Asunto**\nTu proyecto implica ${intake.matterType?.toLowerCase() || "una materia de activos digitales"} en ${intake.mainJurisdiction || "la jurisdicción identificada"}.\n\n**2. Consideraciones Jurídicas/Regulatorias Preliminares**\n• La clasificación del token será una cuestión central — la caracterización del token bajo los marcos aplicables determinará las obligaciones regulatorias\n• Dependiendo de la estructura, pueden aplicar obligaciones de folleto/libro blanco\n• La dimensión jurisdiccional requiere un análisis cuidadoso de los regímenes aplicables\n\n**3. Información Todavía Requerida**\n• Confirmación de la base de inversores prevista y canales de distribución\n• Aclaración sobre los derechos económicos asociados al token\n• Detalles de cualquier estructura de entidad jurídica existente\n\n**4. Áreas de Riesgo Preliminares**\n• Incertidumbre en la clasificación regulatoria\n• Potenciales obligaciones de cumplimiento transfronterizo\n\n**5. Siguiente Paso Recomendado**\nDada la complejidad de las cuestiones identificadas, recomendaría solicitar una consulta profesional para un mapeo regulatorio detallado y análisis de estructuración.\n\n*Esta orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal.*`;
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      setLoading(false);
    }, 2000);
  };

  // Simple markdown-ish rendering
  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:' + palette.white + '">$1</strong>');
      processed = processed.replace(/\*(.+?)\*/g, '<em style="color:' + palette.textDim + '">$1</em>');
      if (line.startsWith("•")) {
        return <div key={i} style={{ paddingLeft:16, marginBottom:4 }} dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.startsWith("⚠")) {
        return <div key={i} style={{ color:"#e8a838", marginBottom:4 }} dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      return <div key={i} style={{ marginBottom: line === "" ? 8 : 2 }} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div style={{ paddingTop:40, paddingBottom:40, maxWidth:800, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h1 style={{ fontFamily:fontDisplay, fontSize:24, fontWeight:600, color:palette.white }}>{t.chat.title}</h1>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-secondary" onClick={()=>navTo("consultation")} style={{ padding:"8px 16px", fontSize:12 }}>{t.chat.actions.consult}</button>
          <button className="btn-secondary" onClick={()=>navTo("home")} style={{ padding:"8px 16px", fontSize:12 }}>{t.chat.actions.end}</button>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={chatRef} style={{ background:palette.bgCard, border:`1px solid ${palette.border}`, borderRadius:10, padding:24, minHeight:400, maxHeight:560, overflowY:"auto", marginBottom:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom:20, display:"flex", flexDirection:"column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ fontSize:11, fontWeight:600, color: msg.role === "user" ? palette.accent : palette.textDim, marginBottom:6, letterSpacing:.5 }}>
              {msg.role === "user" ? (lang==="en"?"You":"Tú") : "CLATEC"}
            </div>
            <div style={{ background: msg.role === "user" ? `${palette.accent}15` : palette.bgInput, border:`1px solid ${msg.role === "user" ? palette.accent + "30" : palette.border}`, borderRadius:8, padding:"14px 18px", maxWidth:"90%", fontSize:14, lineHeight:1.7, color:palette.textMuted }}>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:11, fontWeight:600, color:palette.textDim, letterSpacing:.5 }}>CLATEC</div>
            <div style={{ animation:"pulse 1.2s infinite", fontSize:13, color:palette.accent }}>{t.chat.thinking}</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display:"flex", gap:12 }}>
        <input className="input-field" style={{ flex:1 }} placeholder={t.chat.placeholder} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") sendMessage(); }} />
        <button className="btn-primary" onClick={sendMessage} style={{ padding:"12px 24px" }}>{t.chat.send}</button>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize:11, color:palette.textDim, marginTop:12, textAlign:"center", fontStyle:"italic" }}>
        {lang === "en"
          ? "This preliminary guidance is general in nature and does not constitute formal legal advice."
          : "Esta orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal."}
      </p>
    </div>
  );
}
