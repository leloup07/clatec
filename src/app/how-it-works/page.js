'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

export default function HowItWorksPage() {
  const { t, lang, setLang } = useLanguage()
  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)' }}>{t.how.title}</h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.65, marginTop: 10 }}>{t.how.sub}</p>
        <div style={{ marginTop: 40, display: 'grid', gap: 24 }}>
          {t.how.steps.map((s, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(45,138,154,0.08)', border: '1px solid rgba(45,138,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 20 }}>{i + 1}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, padding: 24, background: 'rgba(45,138,154,0.04)', border: '1px solid rgba(45,138,154,0.12)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, fontStyle: 'italic' }}>{t.how.disclaimer}</p>
        </div>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <a href="/intake" className="btn-primary" style={{ textDecoration: 'none' }}>{t.cta.start}</a>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}