'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

export default function ExpertisePage() {
  const { t, lang, setLang } = useLanguage()
  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)', letterSpacing: -0.5 }}>{t.expertise.title}</h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.65, marginTop: 10 }}>{t.expertise.sub}</p>
        <div style={{ marginTop: 40, display: 'grid', gap: 20 }}>
          {t.expertise.items.map((item, i) => (
            <div key={i} className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--white)', marginBottom: 10 }}>{item.t}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}