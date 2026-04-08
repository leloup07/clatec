'use client'
import { useState } from 'react'

export default function NDAPage() {
  const [lang, setLang] = useState('en')
  const [form, setForm] = useState({ name: '', company: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const t = {
    en: {
      title: 'Non-Disclosure Agreement',
      sub: 'Before sharing detailed project information, we offer the protection of a mutual NDA.',
      desc: 'Download our bilateral Non-Disclosure Agreement (English and Spanish versions included in a single document). Once signed by both parties, you may share project details with full confidentiality protection.',
      nameLabel: 'Full name',
      companyLabel: 'Company name',
      emailLabel: 'Email',
      download: 'Download NDA (EN/ES)',
      request: 'Request Pre-Signed Copy',
      requestDesc: 'If you prefer to receive a copy pre-signed by CLATEC, provide your details below:',
      sent: 'Your request has been submitted. We will send a pre-signed copy within 24 hours.',
      features: [
        'Mutual confidentiality — both parties are equally protected',
        'Covers: business plans, legal strategies, token economics, technical architecture, regulatory approaches',
        'Two-year term with three-year post-termination survival',
        'Governed by Spanish law, jurisdiction of Barcelona',
        'GDPR-compliant data protection clause',
        'Bilingual document (English and Spanish)'
      ]
    },
    es: {
      title: 'Acuerdo de Confidencialidad',
      sub: 'Antes de compartir información detallada sobre tu proyecto, ofrecemos la protección de un NDA mutuo.',
      desc: 'Descarga nuestro Acuerdo Mutuo de Confidencialidad (versiones en inglés y español incluidas en un único documento). Una vez firmado por ambas partes, podrás compartir los detalles del proyecto con plena protección de confidencialidad.',
      nameLabel: 'Nombre completo',
      companyLabel: 'Nombre de la empresa',
      emailLabel: 'Email',
      download: 'Descargar NDA (EN/ES)',
      request: 'Solicitar Copia Prefirmada',
      requestDesc: 'Si prefieres recibir una copia prefirmada por CLATEC, facilita tus datos:',
      sent: 'Tu solicitud ha sido enviada. Enviaremos una copia prefirmada en 24 horas.',
      features: [
        'Confidencialidad mutua — ambas partes igualmente protegidas',
        'Cubre: planes de negocio, estrategias jurídicas, tokenomics, arquitectura técnica, enfoques regulatorios',
        'Duración de dos años con supervivencia post-terminación de tres años',
        'Regido por ley española, jurisdicción de Barcelona',
        'Cláusula de protección de datos conforme al RGPD',
        'Documento bilingüe (inglés y español)'
      ]
    }
  }

  const c = t[lang]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          style={{ background: '#0d1320', color: '#8892a4', border: '1px solid #1a2236', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#f0eeea', marginBottom: 12 }}>{c.title}</h1>
      <p style={{ fontSize: 17, color: '#8892a4', lineHeight: 1.65, marginBottom: 24 }}>{c.sub}</p>
      <p style={{ fontSize: 15, color: '#8892a4', lineHeight: 1.7, marginBottom: 32 }}>{c.desc}</p>

      <ul style={{ marginBottom: 32, paddingLeft: 20 }}>
        {c.features.map((f, i) => (
          <li key={i} style={{ fontSize: 14, color: '#8892a4', lineHeight: 1.8 }}>{f}</li>
        ))}
      </ul>

      {/* Download button */}
      <a href="/legal/CLATEC-NDA-Bilateral-EN-ES.docx" download
        style={{ display: 'inline-block', background: '#2d8a9a', color: '#fff', padding: '14px 32px', borderRadius: 6, fontSize: 15, fontWeight: 600, textDecoration: 'none', marginBottom: 40 }}>
        {c.download}
      </a>

      {/* Pre-signed request */}
      <div style={{ background: '#0d1320', border: '1px solid #1a2236', borderRadius: 10, padding: 28, marginTop: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f0eeea', marginBottom: 8 }}>{c.request}</h3>
        <p style={{ fontSize: 14, color: '#5a6478', marginBottom: 20 }}>{c.requestDesc}</p>

        {submitted ? (
          <p style={{ color: '#27ae60', fontWeight: 500 }}>{c.sent}</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            <input placeholder={c.nameLabel} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              style={{ background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, outline: 'none' }} />
            <input placeholder={c.companyLabel} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
              style={{ background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, outline: 'none' }} />
            <input placeholder={c.emailLabel} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={{ background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, outline: 'none' }} />
            <button onClick={() => { if (form.name && form.email) setSubmitted(true) }}
              style={{ background: '#2d8a9a', color: '#fff', border: 'none', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              {c.request}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
