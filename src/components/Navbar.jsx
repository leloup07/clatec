'use client'

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'expertise', href: '/expertise' },
  { key: 'how', href: '/how-it-works' },
  { key: 'cases', href: '/use-cases' },
  { key: 'consultation', href: '/consultation' },
  { key: 'legal', href: '/legal' },
]

export default function Navbar({ lang, setLang, t }) {
  // t is optional — if not passed, use nav labels from lang
  const labels = t?.nav || (lang === 'es'
    ? { home: 'Inicio', expertise: 'Áreas', how: 'Cómo Funciona', cases: 'Casos de Uso', consultation: 'Solicitar Consulta', legal: 'Legal' }
    : { home: 'Home', expertise: 'Expertise', how: 'How It Works', cases: 'Use Cases', consultation: 'Request Consultation', legal: 'Legal' }
  )

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(7,11,20,0.93)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 2, color: 'var(--white)', textDecoration: 'none' }}>
          CLATEC
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {navLinks.map(({ key, href }) => (
            <a key={key} href={href} style={{
              color: 'var(--text-muted)', padding: '8px 14px', borderRadius: 6,
              fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all .2s',
            }}>
              {labels[key]}
            </a>
          ))}
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} style={{
            background: 'var(--bg-card)', color: 'var(--text-muted)',
            border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: 1,
          }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <a href="/intake" style={{
            background: 'var(--accent)', color: '#fff', padding: '8px 20px',
            borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginLeft: 8,
          }}>
            {lang === 'en' ? 'Start Analysis' : 'Iniciar Análisis'}
          </a>
        </div>
      </div>
    </nav>
  )
}
