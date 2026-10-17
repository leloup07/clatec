'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

// Intake form → /api/intake (saved in Supabase) → guided analysis chat → /api/chat (Claude).
// Ported from docs/prototype.jsx, with the simulated responses replaced by the real API.

const TX = {
  en: {
    title: 'Start Your Analysis',
    sub: 'Complete the intake form to provide context for your matter.',
    fields: {
      firstName: 'First name', lastName: 'Last name', email: 'Email',
      company: 'Company (optional)', role: 'Role / Position (optional)',
      country: 'Country of residence', mainJurisdiction: 'Main jurisdiction of the project',
      otherJurisdictions: 'Other relevant jurisdictions (optional, comma-separated)',
      matterType: 'Matter type', projectStage: 'Project stage', objective: 'Objective',
      description: 'Please describe your project or legal/regulatory question',
      urgency: 'Urgency',
      assetType: 'Underlying asset type',
      economicReturn: 'Are token holders expected to receive economic return?',
      investorsExpected: 'Are investors expected?',
      investorType: 'Investor type',
      issuanceSize: 'Approximate issuance size',
      entityExists: 'Does a legal entity already exist?',
      docsExist: 'Does any whitepaper, term sheet, or draft documentation exist?',
      tokenType: 'Intended token type',
      refersToAssets: 'Does the token refer to one or more assets?',
      stableValue: 'Is the token intended to be stable in value?',
      cryptoServices: 'Will crypto-asset services be provided?',
      targetJurisdictions: 'Target jurisdictions',
      publicMarketing: 'Is there public marketing?',
      serviceType: 'Contemplated service type',
      custodyInvolved: 'Is custody involved?',
      exchangeInvolved: 'Is exchange/execution involved?',
      advisoryInvolved: 'Is advisory involved?',
      clientType: 'Target client type',
      incorporation: 'Place of incorporation / planned incorporation',
      innovationElement: 'What is the innovation element?',
      regulatoryBarrier: 'What regulatory barrier exists?',
      mvpExists: 'Does an MVP exist?',
      intendedMarket: 'Intended market',
      supervisoryAngle: 'Supervisory angle as you understand it',
      targetSandbox: 'Which sandbox are you considering?',
    },
    matterTypes: ['Asset tokenization', 'Token issuance', 'MiCA-related assessment', 'CASP-related issue', 'Governance / compliance', 'Cross-border structuring', 'Sandbox / regulatory innovation', 'Other'],
    stages: ['Early idea', 'Structuring phase', 'Documentation in progress', 'Ready to launch', 'Already operating'],
    objectives: ['Understand legal framework', 'Identify regulatory issues', 'Assess possible structure', 'Prepare for professional consultation', 'Explore jurisdictional options', 'Other'],
    urgencies: ['Low', 'Medium', 'High'],
    yesNo: ['Yes', 'No', 'Unsure'],
    investorTypes: ['Retail', 'Professional', 'Unknown'],
    sandboxOptions: ['Spanish Financial Sandbox (Ley 7/2020)', 'FCA Digital Securities Sandbox (DSS)', 'EU DLT Pilot Regime (2022/858)', 'Other / Multiple', 'Not sure yet'],
    sections: { tokenization: 'Tokenization Details', mica: 'MiCA Assessment Details', casp: 'CASP Details', sandbox: 'Sandbox Application Details' },
    consent1: 'I accept the Privacy Policy',
    consent2: 'I accept the Terms of Use',
    consent3: 'I acknowledge that platform output is preliminary and does not constitute formal legal advice',
    submit: 'Proceed to Analysis',
    submitting: 'Saving…',
    submitError: 'Your intake could not be saved. Please check the required fields and try again.',
    chatTitle: 'Guided Analysis',
    placeholder: 'Type your message…',
    send: 'Send',
    consult: 'Request Professional Review',
    newAnalysis: 'New Analysis',
    thinking: 'Analyzing…',
    you: 'You',
    chatError: 'The analysis service is temporarily unavailable. Please try again in a moment.',
    disclaimer: 'This preliminary guidance is general in nature and does not constitute formal legal advice.',
  },
  es: {
    title: 'Inicia Tu Análisis',
    sub: 'Completa el formulario de intake para contextualizar tu asunto.',
    fields: {
      firstName: 'Nombre', lastName: 'Apellidos', email: 'Email',
      company: 'Empresa (opcional)', role: 'Cargo / Posición (opcional)',
      country: 'País de residencia', mainJurisdiction: 'Jurisdicción principal del proyecto',
      otherJurisdictions: 'Otras jurisdicciones relevantes (opcional, separadas por comas)',
      matterType: 'Tipo de asunto', projectStage: 'Fase del proyecto', objective: 'Objetivo',
      description: 'Describe tu proyecto o pregunta jurídica/regulatoria',
      urgency: 'Urgencia',
      assetType: 'Tipo de activo subyacente',
      economicReturn: '¿Se espera que los titulares del token reciban retorno económico?',
      investorsExpected: '¿Se esperan inversores?',
      investorType: 'Tipo de inversor',
      issuanceSize: 'Tamaño aproximado de la emisión contemplada',
      entityExists: '¿Existe ya una entidad jurídica?',
      docsExist: '¿Existe algún whitepaper, term sheet o documentación borrador?',
      tokenType: 'Tipo de token previsto',
      refersToAssets: '¿El token se refiere a uno o más activos?',
      stableValue: '¿El token pretende ser estable en valor?',
      cryptoServices: '¿Se prestarán servicios de criptoactivos?',
      targetJurisdictions: 'Jurisdicciones objetivo',
      publicMarketing: '¿Hay marketing público?',
      serviceType: 'Tipo de servicio contemplado',
      custodyInvolved: '¿Implica custodia?',
      exchangeInvolved: '¿Implica intercambio/ejecución?',
      advisoryInvolved: '¿Implica asesoramiento?',
      clientType: 'Tipo de cliente objetivo',
      incorporation: 'Lugar de constitución / constitución prevista',
      innovationElement: '¿Cuál es el elemento de innovación?',
      regulatoryBarrier: '¿Qué barrera regulatoria existe?',
      mvpExists: '¿Existe un MVP?',
      intendedMarket: 'Mercado previsto',
      supervisoryAngle: 'Ángulo supervisor tal como lo entiendes',
      targetSandbox: '¿Qué sandbox estás considerando?',
    },
    matterTypes: ['Tokenización de activos', 'Emisión de tokens', 'Evaluación MiCA', 'Cuestión CASP', 'Gobernanza / compliance', 'Estructuración transfronteriza', 'Sandbox / innovación regulatoria', 'Otro'],
    stages: ['Idea temprana', 'Fase de estructuración', 'Documentación en curso', 'Listo para lanzar', 'Ya operando'],
    objectives: ['Comprender el marco legal', 'Identificar cuestiones regulatorias', 'Evaluar posible estructura', 'Preparar consulta profesional', 'Explorar opciones jurisdiccionales', 'Otro'],
    urgencies: ['Baja', 'Media', 'Alta'],
    yesNo: ['Sí', 'No', 'No seguro'],
    investorTypes: ['Minorista', 'Profesional', 'Desconocido'],
    sandboxOptions: ['Sandbox Financiero Español (Ley 7/2020)', 'FCA Digital Securities Sandbox (DSS)', 'Régimen Piloto DLT UE (2022/858)', 'Otro / Múltiple', 'No estoy seguro aún'],
    sections: { tokenization: 'Detalles de Tokenización', mica: 'Detalles Evaluación MiCA', casp: 'Detalles CASP', sandbox: 'Detalles Solicitud Sandbox' },
    consent1: 'Acepto la Política de Privacidad',
    consent2: 'Acepto las Condiciones de Uso',
    consent3: 'Reconozco que el resultado de la plataforma es preliminar y no constituye asesoramiento jurídico formal',
    submit: 'Proceder al Análisis',
    submitting: 'Guardando…',
    submitError: 'No se ha podido guardar el intake. Revisa los campos obligatorios e inténtalo de nuevo.',
    chatTitle: 'Análisis Guiado',
    placeholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    consult: 'Solicitar Revisión Profesional',
    newAnalysis: 'Nuevo Análisis',
    thinking: 'Analizando…',
    you: 'Tú',
    chatError: 'El servicio de análisis no está disponible en este momento. Inténtalo de nuevo en unos instantes.',
    disclaimer: 'Esta orientación preliminar es de carácter general y no constituye asesoramiento jurídico formal.',
  },
}

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', company: '', role: '', country: '', mainJurisdiction: '', otherJurisdictions: '',
  matterType: '', projectStage: '', objective: '', description: '', urgency: '',
  assetType: '', economicReturn: '', investorsExpected: '', investorType: '', issuanceSize: '', entityExists: '', docsExist: '',
  tokenType: '', refersToAssets: '', stableValue: '', cryptoServices: '', targetJurisdictions: '', publicMarketing: '',
  serviceType: '', custodyInvolved: '', exchangeInvolved: '', advisoryInvolved: '', clientType: '', incorporation: '',
  innovationElement: '', regulatoryBarrier: '', mvpExists: '', intendedMarket: '', supervisoryAngle: '', targetSandbox: '',
  consent1: false, consent2: false, consent3: false, website: '',
}

const STORE_KEY = 'clatec_chat'

function loadStored() {
  try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null') } catch { return null }
}
function saveStored(v) {
  try { v ? sessionStorage.setItem(STORE_KEY, JSON.stringify(v)) : sessionStorage.removeItem(STORE_KEY) } catch { /* ignore */ }
}

export default function IntakePage() {
  const { lang, setLang } = useLanguage()
  const t = TX[lang]
  const [session, setSession] = useState(null) // { leadId, lang, messages }
  const [ready, setReady] = useState(false)

  useEffect(() => { setSession(loadStored()); setReady(true) }, [])
  useEffect(() => { if (ready) saveStored(session) }, [session, ready])

  const reset = () => {
    setSession(null)
    try { sessionStorage.removeItem('clatec_lead_id') } catch { /* ignore */ }
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>
        {!ready ? null : session
          ? <Chat t={TX[session.lang] || t} session={session} setSession={setSession} onReset={reset} />
          : <IntakeForm t={t} lang={lang} onDone={setSession} />}
      </main>
      <Footer lang={lang} />
    </>
  )
}

// ─── INTAKE FORM ─────────────────────────────────────────────────────

function IntakeForm({ t, lang, onDone }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const f = t.fields

  const isTokenization = form.matterType === t.matterTypes[0] || form.matterType === t.matterTypes[1]
  const isMiCA = form.matterType === t.matterTypes[2]
  const isCASP = form.matterType === t.matterTypes[3]
  const isSandbox = form.matterType === t.matterTypes[6]

  const canSubmit = form.firstName && form.email && form.country && form.mainJurisdiction && form.matterType &&
    form.description && form.consent1 && form.consent2 && form.consent3 && !sending

  const submit = async () => {
    if (!canSubmit) return
    setSending(true); setError('')
    try {
      const res = await fetch('/api/intake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: lang }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.leadId) throw new Error(data.error || 'intake')
      try { sessionStorage.setItem('clatec_lead_id', data.leadId) } catch { /* ignore */ }
      onDone({ leadId: data.leadId, lang, messages: [{ role: 'assistant', content: buildWelcome(form, lang, data.escalationFlags || []) }] })
      window.scrollTo(0, 0)
    } catch {
      setError(t.submitError)
      setSending(false)
    }
  }

  const Label = ({ children, req }) => (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
      {children} {req && <span style={{ color: 'var(--accent)' }}>*</span>}
    </label>
  )
  const Input = ({ k, req, area, placeholder }) => (
    <div>
      <Label req={req}>{f[k]}</Label>
      {area
        ? <textarea className="input-field" value={form[k]} onChange={e => upd(k, e.target.value)} maxLength={5000} />
        : <input className="input-field" value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={placeholder} maxLength={300} type={k === 'email' ? 'email' : 'text'} />}
    </div>
  )
  const Select = ({ k, options, req }) => (
    <div>
      <Label req={req}>{f[k]}</Label>
      <select className="input-field" value={form[k]} onChange={e => upd(k, e.target.value)}>
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
  const Section = ({ title, children }) => (
    <div className="card fade-up" style={{ borderColor: 'rgba(45,138,154,0.25)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>{title}</h3>
      <div style={{ display: 'grid', gap: 16 }}>{children}</div>
    </div>
  )

  return (
    <div style={{ paddingTop: 60, paddingBottom: 60 }}>
      <h1 className="section-title">{t.title}</h1>
      <p className="section-sub">{t.sub}</p>

      <div style={{ marginTop: 32, display: 'grid', gap: 20 }}>
        <div className="card">
          <div className="grid-2">{Input({ k: 'firstName', req: true })}{Input({ k: 'lastName' })}</div>
          <div style={{ marginTop: 16 }}>{Input({ k: 'email', req: true })}</div>
          <div className="grid-2" style={{ marginTop: 16 }}>{Input({ k: 'company' })}{Input({ k: 'role' })}</div>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gap: 16 }}>
            {Input({ k: 'country', req: true })}
            {Input({ k: 'mainJurisdiction', req: true })}
            {Input({ k: 'otherJurisdictions' })}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gap: 16 }}>
            {Select({ k: 'matterType', options: t.matterTypes, req: true })}
            {Select({ k: 'projectStage', options: t.stages })}
            {Select({ k: 'objective', options: t.objectives })}
            {Select({ k: 'urgency', options: t.urgencies })}
          </div>
        </div>

        {isTokenization && Section({ title: t.sections.tokenization, children: <>
          {Input({ k: 'assetType' })}
          {Select({ k: 'economicReturn', options: t.yesNo })}
          {Select({ k: 'investorsExpected', options: t.yesNo })}
          {Select({ k: 'investorType', options: t.investorTypes })}
          {Input({ k: 'issuanceSize', placeholder: lang === 'en' ? 'e.g. €5,000,000' : 'ej. 5.000.000 €' })}
          {Select({ k: 'entityExists', options: t.yesNo })}
          {Select({ k: 'docsExist', options: t.yesNo })}
        </> })}

        {isMiCA && Section({ title: t.sections.mica, children: <>
          {Input({ k: 'tokenType' })}
          {Select({ k: 'refersToAssets', options: t.yesNo })}
          {Select({ k: 'stableValue', options: t.yesNo })}
          {Select({ k: 'cryptoServices', options: t.yesNo })}
          {Input({ k: 'targetJurisdictions' })}
          {Select({ k: 'publicMarketing', options: t.yesNo })}
        </> })}

        {isCASP && Section({ title: t.sections.casp, children: <>
          {Input({ k: 'serviceType' })}
          {Select({ k: 'custodyInvolved', options: t.yesNo })}
          {Select({ k: 'exchangeInvolved', options: t.yesNo })}
          {Select({ k: 'advisoryInvolved', options: t.yesNo })}
          {Input({ k: 'clientType' })}
          {Input({ k: 'incorporation' })}
        </> })}

        {isSandbox && Section({ title: t.sections.sandbox, children: <>
          {Select({ k: 'targetSandbox', options: t.sandboxOptions })}
          {Input({ k: 'innovationElement', area: true })}
          {Input({ k: 'regulatoryBarrier', area: true })}
          {Select({ k: 'mvpExists', options: t.yesNo })}
          {Input({ k: 'intendedMarket' })}
          {Input({ k: 'supervisoryAngle', area: true })}
        </> })}

        <div className="card">
          <Label req>{f.description}</Label>
          <textarea className="input-field" style={{ minHeight: 140 }} value={form.description} maxLength={5000}
            onChange={e => upd('description', e.target.value)} />
        </div>

        {/* Honeypot (hidden from people, filled by bots) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website}
          onChange={e => upd('website', e.target.value)}
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

        <div className="card" style={{ background: 'rgba(45,138,154,0.03)' }}>
          {[['consent1', t.consent1, '/legal'], ['consent2', t.consent2, '/legal'], ['consent3', t.consent3]].map(([k, label, href]) => (
            <label key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 12 }}>
              <input type="checkbox" checked={form[k]} onChange={e => upd(k, e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {href ? <a href={href} target="_blank" rel="noopener noreferrer">{label}</a> : label} <span style={{ color: 'var(--accent)' }}>*</span>
              </span>
            </label>
          ))}
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</p>}
        <button className="btn-primary" disabled={!canSubmit} onClick={submit} style={{ width: '100%', padding: 16, fontSize: 16 }}>
          {sending ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  )
}

function buildWelcome(intake, lang, flags) {
  const en = lang === 'en'
  let w = en
    ? `Thank you for completing the intake. Based on your submission, I understand the following:\n\n**Matter type:** ${intake.matterType}\n**Main jurisdiction:** ${intake.mainJurisdiction || '—'}`
    : `Gracias por completar el intake. Según tu envío, entiendo lo siguiente:\n\n**Tipo de asunto:** ${intake.matterType}\n**Jurisdicción principal:** ${intake.mainJurisdiction || '—'}`
  if (intake.projectStage) w += en ? `\n**Project stage:** ${intake.projectStage}` : `\n**Fase del proyecto:** ${intake.projectStage}`
  if (intake.objective) w += en ? `\n**Objective:** ${intake.objective}` : `\n**Objetivo:** ${intake.objective}`
  w += '\n\n'
  if (flags.length > 0) {
    const labels = flags.map(fl => (en ? fl.label_en : fl.label_es)).join(', ')
    w += en
      ? `⚠ I note the following elements that may warrant particular attention or professional review: ${labels}.\n\n`
      : `⚠ Noto los siguientes elementos que pueden requerir atención particular o revisión profesional: ${labels}.\n\n`
  }
  w += en
    ? 'To help me structure the relevant legal and regulatory considerations, could you clarify:\n\n1. Have you already received any regulatory guidance or legal opinion on this matter?\n2. Is there a specific timeline driving this project?'
    : 'Para ayudarme a estructurar las consideraciones jurídicas y regulatorias relevantes, ¿podrías aclarar:\n\n1. ¿Has recibido ya alguna orientación regulatoria o dictamen jurídico sobre este asunto?\n2. ¿Hay un calendario específico que impulse este proyecto?'
  return w
}

// ─── CHAT ────────────────────────────────────────────────────────────

function Chat({ t, session, setSession, onReset }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const chatRef = useRef(null)
  const messages = session.messages

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading || limitReached) return
    setError('')
    setInput('')
    setLoading(true)
    setSession(s => ({ ...s, messages: [...s.messages, { role: 'user', content: text }] }))
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: session.leadId, message: text }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.message) throw new Error(data.error || 'chat')
      if (data.limitReached || data.remaining === 0) setLimitReached(true)
      setSession(s => ({ ...s, messages: [...s.messages, { role: 'assistant', content: data.message }] }))
    } catch {
      // Put the text back so the user can retry
      setSession(s => ({ ...s, messages: s.messages.slice(0, -1) }))
      setInput(text)
      setError(t.chatError)
    }
    setLoading(false)
  }

  return (
    <div style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--white)' }}>{t.chatTitle}</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a className="btn-secondary" href="/consultation" style={{ padding: '8px 16px', fontSize: 12, textDecoration: 'none' }}>{t.consult}</a>
          <button className="btn-secondary" onClick={onReset} style={{ padding: '8px 16px', fontSize: 12 }}>{t.newAnalysis}</button>
        </div>
      </div>

      <div ref={chatRef} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, minHeight: 400, maxHeight: '65vh', overflowY: 'auto', marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: msg.role === 'user' ? 'var(--accent)' : 'var(--text-dim)', marginBottom: 6, letterSpacing: .5 }}>
              {msg.role === 'user' ? t.you : 'CLATEC'}
            </div>
            <div style={{
              background: msg.role === 'user' ? 'rgba(45,138,154,0.08)' : 'var(--bg-input)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(45,138,154,0.2)' : 'var(--border)'}`,
              borderRadius: 8, padding: '14px 18px', maxWidth: '92%', fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)',
              whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal', overflowWrap: 'anywhere',
            }}>
              {msg.role === 'user' ? msg.content : <Markdown text={msg.content} />}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: .5 }}>CLATEC</div>
            <div style={{ animation: 'pulse 1.2s infinite', fontSize: 13, color: 'var(--accent)' }}>{t.thinking}</div>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <textarea className="input-field" style={{ flex: 1, minHeight: 48, height: 48 }} placeholder={t.placeholder} value={input}
          maxLength={4000} disabled={limitReached}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} />
        <button className="btn-primary" onClick={send} disabled={loading || !input.trim() || limitReached} style={{ padding: '12px 24px' }}>{t.send}</button>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 12, textAlign: 'center', fontStyle: 'italic' }}>{t.disclaimer}</p>
    </div>
  )
}

// Minimal, safe Markdown → React (no innerHTML): headings, bullets, numbered
// lists, rules, **bold** and *italic*.
function inline(text, keyPrefix) {
  const parts = []
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g
  let last = 0, m, i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const tok = m[0]
    parts.push(tok.startsWith('**')
      ? <strong key={`${keyPrefix}-${i++}`} style={{ color: 'var(--white)' }}>{tok.slice(2, -2)}</strong>
      : <em key={`${keyPrefix}-${i++}`} style={{ color: 'var(--text-dim)' }}>{tok.slice(1, -1)}</em>)
    last = m.index + tok.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function Markdown({ text }) {
  return text.split('\n').map((line, i) => {
    const k = `l${i}`
    if (/^\s*---+\s*$/.test(line)) return <hr key={k} style={{ border: 0, borderTop: '1px solid var(--border)', margin: '12px 0' }} />
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) return <div key={k} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--white)', fontSize: 15, marginTop: 14, marginBottom: 6 }}>{inline(h[2], k)}</div>
    const b = line.match(/^\s*[-•*]\s+(.*)$/)
    if (b) return <div key={k} style={{ paddingLeft: 16, marginBottom: 4, position: 'relative' }}><span style={{ position: 'absolute', left: 2 }}>•</span>{inline(b[1], k)}</div>
    const n = line.match(/^\s*(\d+)[.)]\s+(.*)$/)
    if (n) return <div key={k} style={{ paddingLeft: 20, marginBottom: 4, position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>{n[1]}.</span>{inline(n[2], k)}</div>
    if (line.startsWith('⚠')) return <div key={k} style={{ color: '#e8a838', marginBottom: 4 }}>{inline(line, k)}</div>
    return <div key={k} style={{ marginBottom: line.trim() === '' ? 8 : 2 }}>{inline(line, k)}</div>
  })
}
