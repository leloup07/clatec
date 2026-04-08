'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'

// Full legal content is in the prototype (docs/prototype.jsx)
// Import from a dedicated legal content module in production
const legalContent = {
  en: {
    notice: { t: 'Legal Notice', body: 'This website is operated by Aznar Legal & Compliance SLP, a Spanish professional limited company, operating under the brand CLATEC, with registered office in Barcelona, Spain.\n\nThe platform CLATEC provides structured preliminary legal guidance in the field of digital assets, tokenization, blockchain, and related regulatory matters.\n\nThe preliminary output generated through CLATEC does not constitute formal individualized legal advice. It is general in nature, depends on the information provided by the user, and may be incomplete if relevant facts are omitted.\n\nUse of this platform does not create an attorney-client relationship. Professional legal engagement is available as a separate service upon request.' },
    privacy: { t: 'Privacy Policy', body: 'Data Controller: Aznar Legal & Compliance SLP.\n\nWe collect personal data you provide through intake forms and chat interactions, including: name, email, company, jurisdictional information, project descriptions, and conversation logs.\n\nPurpose: To provide preliminary legal guidance, process consultation requests, and improve our services.\n\nLegal Basis: Consent (Art. 6(1)(a) GDPR); legitimate interest (Art. 6(1)(f) GDPR) for platform improvement.\n\nRights: Access, rectification, erasure, portability, restriction, and objection via privacy@clatec.consulting.\n\nCookies: Essential cookies only. No advertising or tracking cookies.' },
    terms: { t: 'Terms of Use', body: '1. Nature of Service: CLATEC provides structured preliminary legal guidance. Outputs are general and do not constitute formal legal advice.\n\n2. No Attorney-Client Relationship: Use of this platform does not establish such relationship.\n\n3. Accuracy: Guidance quality depends on information provided by the user.\n\n4. Professional Consultation: Formal advice requires separate professional engagement.\n\n5. Intellectual Property: All content belongs to Aznar Legal & Compliance SLP.\n\n6. Limitation of Liability: To the maximum extent permitted by law.\n\n7. Governing Law: Spanish law. Courts of Barcelona.' },
    disclaimer: { t: 'Disclaimer', body: 'The platform provides preliminary general guidance only.\n\nFormal legal advice requires separate professional engagement.\n\nOutputs depend on facts presented by the user and may be incomplete.\n\nNo automated output should be treated as a definitive legal opinion, regulatory clearance, or compliance certification.' },
  },
  es: {
    notice: { t: 'Aviso Legal', body: 'Este sitio web es operado por Aznar Legal & Compliance SLP, sociedad profesional de responsabilidad limitada española, que opera bajo la marca CLATEC, con domicilio social en Barcelona, España.\n\nLa plataforma CLATEC proporciona orientación jurídica preliminar estructurada en el ámbito de activos digitales, tokenización, blockchain y materias regulatorias relacionadas.\n\nEl resultado preliminar generado no constituye asesoramiento jurídico formal individualizado.\n\nEl uso de esta plataforma no crea una relación abogado-cliente.' },
    privacy: { t: 'Política de Privacidad', body: 'Responsable: Aznar Legal & Compliance SLP.\n\nRecogemos datos personales facilitados a través de formularios e interacciones de chat.\n\nFinalidad: Proporcionar orientación jurídica preliminar y procesar solicitudes de consulta.\n\nBase Jurídica: Consentimiento (Art. 6(1)(a) RGPD); interés legítimo (Art. 6(1)(f) RGPD).\n\nDerechos: Acceso, rectificación, supresión, portabilidad, limitación y oposición via privacy@clatec.consulting.\n\nCookies: Únicamente cookies esenciales.' },
    terms: { t: 'Condiciones de Uso', body: '1. Naturaleza del Servicio: CLATEC proporciona orientación jurídica preliminar. Los resultados no constituyen asesoramiento jurídico formal.\n\n2. Ausencia de Relación Abogado-Cliente.\n\n3. Exactitud: La calidad depende de la información facilitada por el usuario.\n\n4. Consulta Profesional: El asesoramiento formal requiere compromiso profesional separado.\n\n5. Propiedad Intelectual: Todo el contenido pertenece a Aznar Legal & Compliance SLP.\n\n6. Limitación de Responsabilidad: En la máxima medida permitida por la ley.\n\n7. Ley Aplicable: Ley española. Juzgados de Barcelona.' },
    disclaimer: { t: 'Aviso de Limitación', body: 'La plataforma proporciona únicamente orientación general preliminar.\n\nEl asesoramiento jurídico formal requiere un compromiso profesional separado.\n\nLos resultados dependen de los hechos presentados por el usuario y pueden ser incompletos.' },
  }
}

export default function LegalPage() {
  const { t, lang, setLang } = useLanguage()
  const [tab, setTab] = useState('notice')
  const tabs = ['notice', 'privacy', 'terms', 'disclaimer']
  const content = legalContent[lang]

  return (
    <>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--white)' }}>
          {lang === 'en' ? 'Legal Information' : 'Información Legal'}
        </h1>
        <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
          {tabs.map(k => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? 'var(--accent)' : 'transparent',
              color: tab === k ? '#fff' : 'var(--text-muted)',
              border: tab === k ? '1px solid var(--accent)' : '1px solid var(--border)',
              padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
            }}>
              {content[k].t}
            </button>
          ))}
        </div>
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>{content[tab].t}</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, fontFamily: 'var(--font)' }}>
            {content[tab].body.replace(/\\n/g, '\n')}
          </pre>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}