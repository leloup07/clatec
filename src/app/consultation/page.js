'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

export default function ConsultationPage() {
  const { t, lang, setLang } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', company: '', matter: '', preferred: '' })
  const [sent, setSent] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const c = t.consultation

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.matter) return
    try {
      await fetch('/api/consultation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } catch (e) { /* silent */ }
    setSent(true)
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)' }}>{c.title}</h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10 }}>{c.sub}</p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 24 }}>{c.desc}</p>
        <ul style={{ marginTop: 20, paddingLeft: 20 }}>
          {c.features.map((f, i) => <li key={i} style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{f}</li>)}
        </ul>
        {sent ? (
          <div className="card" style={{ marginTop: 32, borderColor: 'var(--success)', textAlign: 'center' }}>
            <p style={{ color: 'var(--success)', fontWeight: 500 }}>{c.form.success}</p>
          </div>
        ) : (
          <div className="card" style={{ marginTop: 32 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <input className="input-field" placeholder={c.form.name} value={form.name} onChange={e => upd('name', e.target.value)} />
              <input className="input-field" placeholder={c.form.email} type="email" value={form.email} onChange={e => upd('email', e.target.value)} />
              <input className="input-field" placeholder={c.form.company} value={form.company} onChange={e => upd('company', e.target.value)} />
              <textarea className="input-field" placeholder={c.form.matter} value={form.matter} onChange={e => upd('matter', e.target.value)} />
              <input className="input-field" placeholder={c.form.preferred} value={form.preferred} onChange={e => upd('preferred', e.target.value)} />
              <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>{c.form.submit}</button>
            </div>
          </div>
        )}
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}