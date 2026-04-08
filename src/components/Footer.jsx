'use client'

export default function Footer({ lang, t }) {
  const f = t?.footer || (lang === 'es'
    ? { operator: 'Operado por Aznar Legal & Compliance SLP', credential: 'Con el apoyo de profesionales jurídicos habilitados en España e Inglaterra y Gales', rights: 'Todos los derechos reservados.' }
    : { operator: 'Operated by Aznar Legal & Compliance SLP', credential: 'Supported by qualified legal professionals admitted in Spain and England & Wales', rights: 'All rights reserved.' }
  )

  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 80, padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: 2, color: 'var(--white)', marginBottom: 8 }}>CLATEC</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            {f.operator}<br />{f.credential}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-dim)' }}>
          <a href="/legal" style={{ color: 'var(--text-dim)' }}>{lang === 'en' ? 'Legal' : 'Legal'}</a>
          <a href="/nda" style={{ color: 'var(--text-dim)' }}>NDA</a>
          <span>© {new Date().getFullYear()} CLATEC. {f.rights}</span>
        </div>
      </div>
    </footer>
  )
}
