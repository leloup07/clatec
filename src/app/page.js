'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

export default function Home() {
  const { t, lang, setLang } = useLanguage()

  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <section style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {t.home.tagline}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, color: 'var(--white)', lineHeight: 1.15, letterSpacing: -0.5 }}>
            {t.home.h1}
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 24, maxWidth: 680, margin: '24px auto 0' }}>
            {t.home.sub}
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/intake" style={{ background: 'var(--accent)', color: '#fff', padding: '16px 40px', borderRadius: 6, fontSize: 16, fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}>
              {t.cta.intake || t.cta.start}
            </a>
            <a href="/consultation" style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '14px 28px', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
              {t.cta.consult}
            </a>
          </div>
        </section>

        {/* Value Proposition - NOT A CHATBOT */}
        <section style={{ maxWidth: 700, margin: '0 auto 64px', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, padding: '24px 32px', background: 'rgba(45,138,154,0.04)', border: '1px solid rgba(45,138,154,0.12)', borderRadius: 8 }}>
            {t.home.valueProp}
          </p>
        </section>

        {/* Divider */}
        <div style={{ width: 60, height: 1, background: 'var(--border)', margin: '0 auto 64px' }} />

        {/* Why CLATEC - Differentiation */}
        {t.home.diffs && (
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>
              {t.home.diff_title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {t.home.diffs.map((d, i) => (
                <div key={i} className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 10 }}>{d.t}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{d.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Areas */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>
            {t.home.areas_title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {t.home.areas.map((a, i) => (
              <div key={i} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--white)' }}>{a}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>
            {t.home.process_title}
          </h2>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {t.home.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: 300 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>{i + 1}</div>
                <span style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* NDA CTA */}
        <section style={{ marginTop: 64, textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--white)', marginBottom: 12 }}>
              {lang === 'en' ? 'Need confidentiality first?' : '¿Necesitas confidencialidad primero?'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'Download our bilateral NDA to protect your project details before sharing.'
                : 'Descarga nuestro NDA bilateral para proteger los detalles de tu proyecto antes de compartir.'}
            </p>
            <a href="/nda" style={{ color: 'var(--accent)', border: '1px solid var(--accent)', padding: '10px 24px', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              {lang === 'en' ? 'Download NDA' : 'Descargar NDA'}
            </a>
          </div>
        </section>

        {/* Credential */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic' }}>{t.home.credential}</p>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}
