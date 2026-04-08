'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

export default function UseCasesPage() {
  const { t, lang, setLang } = useLanguage()
  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)' }}>{t.cases.title}</h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.65, marginTop: 10 }}>{t.cases.sub}</p>
        <div style={{ marginTop: 40, display: 'grid', gap: 16 }}>
          {t.cases.items.map((c, i) => (
            <a key={i} href="/intake" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>{c.t}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{c.d}</p>
            </a>
          ))}
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}