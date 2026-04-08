'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

const TIERS = {
  en: [
    {
      id: 'standard',
      name: 'Structured Review',
      price: '€450',
      description: 'Professional review of your CLATEC diagnostic output. Focused on the 2–3 critical regulatory considerations identified.',
      includes: [
        'Review of CLATEC diagnostic mapping',
        'Confirmation of key assumptions',
        'Analysis of critical regulatory risks',
        'Recommended next steps',
        'Post-session written summary',
      ],
      note: 'Suitable for most tokenization, MiCA, and CASP matters.',
      cta: 'Request Structured Review',
    },
    {
      id: 'complex',
      name: 'Complex Matter Review',
      price: '€750',
      description: 'In-depth professional review for matters involving sandbox applications, potential ART/EMT classification, or multi-jurisdictional structures.',
      includes: [
        'Everything in Structured Review',
        'Extended analysis session (up to 90 min)',
        'Multi-framework regulatory mapping',
        'Decision tree for key structuring choices',
        'Scope recommendation for formal engagement',
      ],
      note: 'Recommended for sandbox, stablecoin, and cross-border matters.',
      cta: 'Request Complex Review',
    },
  ],
  es: [
    {
      id: 'standard',
      name: 'Revisión Estructurada',
      price: '€450',
      description: 'Revisión profesional de tu output diagnóstico CLATEC. Enfocada en las 2–3 consideraciones regulatorias críticas identificadas.',
      includes: [
        'Revisión del mapeo diagnóstico CLATEC',
        'Confirmación de asunciones clave',
        'Análisis de riesgos regulatorios críticos',
        'Próximos pasos recomendados',
        'Resumen escrito post-sesión',
      ],
      note: 'Adecuado para la mayoría de asuntos de tokenización, MiCA y CASP.',
      cta: 'Solicitar Revisión Estructurada',
    },
    {
      id: 'complex',
      name: 'Revisión de Asunto Complejo',
      price: '€750',
      description: 'Revisión profesional en profundidad para asuntos que implican solicitudes de sandbox, posible clasificación ART/EMT o estructuras multi-jurisdiccionales.',
      includes: [
        'Todo lo incluido en la Revisión Estructurada',
        'Sesión de análisis extendida (hasta 90 min)',
        'Mapeo regulatorio multi-marco',
        'Árbol de decisión para opciones de estructuración clave',
        'Recomendación de alcance para compromiso formal',
      ],
      note: 'Recomendado para asuntos de sandbox, stablecoin y transfronterizos.',
      cta: 'Solicitar Revisión Compleja',
    },
  ],
}

export default function ConsultationPage() {
  const { t, lang, setLang } = useLanguage()
  const [selectedTier, setSelectedTier] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', matter: '', preferred: '', tier: '' })
  const [sent, setSent] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const tiers = TIERS[lang]

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    try {
      await fetch('/api/consultation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier: selectedTier })
      })
    } catch (e) { /* silent */ }
    setSent(true)
  }

  const S = {
    page: { maxWidth: 900, margin: '0 auto', padding: '60px 24px' },
    h1: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)' },
    sub: { fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10, maxWidth: 640 },
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={S.page}>
        <h1 style={S.h1}>
          {lang === 'en' ? 'Professional Legal Review' : 'Revisión Jurídica Profesional'}
        </h1>
        <p style={S.sub}>
          {lang === 'en'
            ? 'When the diagnostic mapping identifies regulatory risks that affect your ability to proceed, the next step is a structured professional review. Not a call. Not a chat. A focused legal analysis of the decisions that matter.'
            : 'Cuando el mapeo diagnóstico identifica riesgos regulatorios que afectan tu capacidad de proceder, el siguiente paso es una revisión profesional estructurada. No una llamada. No un chat. Un análisis jurídico enfocado en las decisiones que importan.'}
        </p>

        {/* Positioning statement */}
        <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(45,138,154,0.04)', border: '1px solid rgba(45,138,154,0.12)', borderRadius: 8 }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
            {lang === 'en'
              ? 'Fixed price. Defined scope. Based on your CLATEC diagnostic output. No improvisation.'
              : 'Precio fijo. Alcance definido. Basado en tu output diagnóstico CLATEC. Sin improvisación.'}
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {lang === 'en' ? 'How It Works' : 'Cómo Funciona'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {(lang === 'en' ? [
              { n: '1', t: 'Before', d: 'You complete the CLATEC diagnostic. We already have your matter summary, regulatory flags, and key risks.' },
              { n: '2', t: 'During', d: 'Confirmation of assumptions. Deep dive into 2–3 critical risks. What changes if A vs B. What requires formal engagement.' },
              { n: '3', t: 'After', d: 'Written summary. Decision framework. Recommended scope if further engagement is warranted.' },
            ] : [
              { n: '1', t: 'Antes', d: 'Completas el diagnóstico CLATEC. Ya tenemos tu resumen, flags regulatorios y riesgos clave.' },
              { n: '2', t: 'Durante', d: 'Confirmación de supuestos. Profundización en 2–3 riesgos críticos. Qué cambia si A vs B. Qué requiere compromiso formal.' },
              { n: '3', t: 'Después', d: 'Resumen escrito. Marco de decisión. Alcance recomendado si se justifica compromiso ulterior.' },
            ]).map((s, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
          {tiers.map((tier) => (
            <div key={tier.id} onClick={() => { setSelectedTier(tier.id); upd('tier', tier.id); }}
              className="card" style={{
                padding: 28, cursor: 'pointer',
                borderColor: selectedTier === tier.id ? 'var(--accent)' : 'var(--border)',
                background: selectedTier === tier.id ? 'rgba(45,138,154,0.06)' : 'var(--bg-card)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--white)' }}>{tier.name}</h3>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{tier.price}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{tier.description}</p>
              <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                {tier.includes.map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item}</li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>{tier.note}</p>
              {selectedTier === tier.id && (
                <div style={{ marginTop: 12, padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>✓ {lang === 'en' ? 'Selected' : 'Seleccionado'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* VAT note */}
        <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 32 }}>
          {lang === 'en' ? 'All prices exclude VAT (IVA). Invoiced by Aznar Legal & Compliance SLP.' : 'Todos los precios excluyen IVA. Facturado por Aznar Legal & Compliance SLP.'}
        </p>

        {/* Request form */}
        {sent ? (
          <div className="card" style={{ borderColor: 'var(--success)', textAlign: 'center', padding: 32 }}>
            <p style={{ color: 'var(--success)', fontWeight: 500, fontSize: 16 }}>
              {lang === 'en' ? 'Your request has been submitted. We will respond within 24–48 hours with confirmation and scheduling details.' : 'Tu solicitud ha sido enviada. Responderemos en 24–48 horas con confirmación y detalles de programación.'}
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>
              {lang === 'en' ? 'Request a Review' : 'Solicitar Revisión'}
            </h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <input className="input-field" placeholder={lang === 'en' ? 'Full name' : 'Nombre completo'} value={form.name} onChange={e => upd('name', e.target.value)} />
              <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={e => upd('email', e.target.value)} />
              <input className="input-field" placeholder={lang === 'en' ? 'Company (optional)' : 'Empresa (opcional)'} value={form.company} onChange={e => upd('company', e.target.value)} />
              <textarea className="input-field" placeholder={lang === 'en' ? 'Brief description or reference to your CLATEC analysis' : 'Descripción breve o referencia a tu análisis CLATEC'} value={form.matter} onChange={e => upd('matter', e.target.value)} />
              <input className="input-field" placeholder={lang === 'en' ? 'Preferred time slot' : 'Franja horaria preferida'} value={form.preferred} onChange={e => upd('preferred', e.target.value)} />
              <button onClick={handleSubmit} disabled={!form.name || !form.email || !selectedTier}
                style={{
                  width: '100%', background: (form.name && form.email && selectedTier) ? 'var(--accent)' : 'var(--border)',
                  color: '#fff', border: 'none', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 600,
                  cursor: (form.name && form.email && selectedTier) ? 'pointer' : 'not-allowed',
                }}>
                {selectedTier
                  ? (tiers.find(t => t.id === selectedTier)?.cta || (lang === 'en' ? 'Submit Request' : 'Enviar Solicitud'))
                  : (lang === 'en' ? 'Select a review type above' : 'Selecciona un tipo de revisión arriba')}
              </button>
            </div>
          </div>
        )}

        {/* Credential */}
        <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginTop: 32, fontStyle: 'italic' }}>
          {lang === 'en'
            ? 'Consultations conducted by legal professionals admitted in Spain and England & Wales.'
            : 'Consultas realizadas por profesionales jurídicos habilitados en España e Inglaterra y Gales.'}
        </p>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}
