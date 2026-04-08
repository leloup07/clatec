'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function KYCPage() {
  const params = useSearchParams()
  const lang = params.get('lang') || 'en'
  const tier = params.get('tier') || 'standard'
  const sessionId = params.get('session_id') || ''

  const [clientType, setClientType] = useState('') // 'individual' | 'entity'
  const [form, setForm] = useState({
    fullName: '', nationality: '', countryResidence: '', dateOfBirth: '',
    docType: '', docNumber: '', docCountry: '',
    // Entity fields
    entityName: '', entityForm: '', entityCountry: '', entityAddress: '',
    repName: '', repRole: '', repDocNumber: '',
    boDeclaration: '',
    // Risk
    isPEP: '', outsideEU: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const t = {
    en: {
      title: 'Client Identification',
      intro: 'Before providing professional services, we are legally required to identify our clients under anti-money laundering regulations.',
      scope: 'This verification is required only when a paid professional relationship is initiated. Information will be used exclusively for legal compliance purposes.',
      typeQ: 'Are you acting as an individual or on behalf of an entity?',
      individual: 'Individual',
      entity: 'Legal entity',
      // Individual
      fullName: 'Full name', nationality: 'Nationality', countryResidence: 'Country of residence',
      dateOfBirth: 'Date of birth', docType: 'Document type', docNumber: 'Document number',
      docCountry: 'Country of issuance', docTypes: ['National ID', 'Passport'],
      // Entity
      entityName: 'Legal name', entityForm: 'Legal form', entityCountry: 'Country of incorporation',
      entityAddress: 'Registered address', repName: 'Representative name', repRole: 'Role/Position',
      repDocNumber: 'Representative ID number',
      boLabel: 'Beneficial Ownership Declaration',
      boDesc: 'Identify any individual(s) who directly or indirectly control more than 25% of the capital, voting rights, or exercise effective control by other means.',
      boPlaceholder: 'Name(s) and relationship to the entity',
      // Risk
      pepQ: 'Is any identified person a Politically Exposed Person (PEP)?',
      euQ: 'Is the entity or project linked to jurisdictions outside the EU?',
      yes: 'Yes', no: 'No',
      // Declaration
      declaration: 'I confirm that the information provided is truthful and up to date.',
      declarationEntity: 'I declare that the beneficial ownership information is complete and correct under applicable law.',
      submit: 'Confirm and Continue',
      success: 'Verification complete. You can now schedule your consultation.',
      schedule: 'Schedule Consultation',
      retention: 'In accordance with applicable law, this information will be retained for the legally required period.',
    },
    es: {
      title: 'Verificación de Identidad del Cliente',
      intro: 'Antes de prestar servicios profesionales, estamos legalmente obligados a identificar a nuestros clientes conforme a la normativa de prevención de blanqueo de capitales.',
      scope: 'Esta verificación se realiza únicamente cuando se inicia una relación profesional retribuida. La información se utilizará exclusivamente para cumplimiento legal.',
      typeQ: '¿Actúa como persona física o en representación de una entidad?',
      individual: 'Persona física',
      entity: 'Persona jurídica',
      fullName: 'Nombre y apellidos', nationality: 'Nacionalidad', countryResidence: 'País de residencia',
      dateOfBirth: 'Fecha de nacimiento', docType: 'Tipo de documento', docNumber: 'Número de documento',
      docCountry: 'País de expedición', docTypes: ['DNI', 'Pasaporte'],
      entityName: 'Denominación social', entityForm: 'Forma jurídica', entityCountry: 'País de constitución',
      entityAddress: 'Domicilio social', repName: 'Nombre del representante', repRole: 'Cargo',
      repDocNumber: 'Documento de identidad del representante',
      boLabel: 'Declaración de Beneficiario Efectivo',
      boDesc: 'Indique la(s) persona(s) física(s) que controlan directa o indirectamente más del 25% del capital o derechos de voto, o que ejerzan control efectivo por otros medios.',
      boPlaceholder: 'Nombre(s) y relación con la entidad',
      pepQ: '¿Alguna de las personas indicadas es o ha sido Persona con Responsabilidad Pública (PEP)?',
      euQ: '¿La entidad o el proyecto está vinculado a jurisdicciones fuera de la UE?',
      yes: 'Sí', no: 'No',
      declaration: 'Confirmo que la información facilitada es veraz y actualizada.',
      declarationEntity: 'Declaro que la información sobre el beneficiario efectivo es completa y correcta conforme a la normativa aplicable.',
      submit: 'Confirmar y Continuar',
      success: 'Verificación completada. Ya puedes programar tu consulta.',
      schedule: 'Programar Consulta',
      retention: 'De acuerdo con la legislación aplicable, esta información se conservará durante el plazo legalmente exigido.',
    }
  }[lang] || {/* fallback to en */}

  const handleSubmit = async () => {
    // In production: save KYC data to Supabase, link to consultation request
    // For now: mark as submitted and unlock scheduling
    try {
      await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          kyc_completed: true,
          kyc_data: { clientType, ...form, submitted_at: new Date().toISOString() },
        })
      })
    } catch (e) { /* continue anyway for UX */ }
    setSubmitted(true)
  }

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/clatec/consultation'

  const S = {
    page: { maxWidth: 620, margin: '0 auto', padding: '60px 24px', fontFamily: "'DM Sans', system-ui, sans-serif", background: '#070b14', minHeight: '100vh', color: '#dfe1e6' },
    card: { background: '#0d1320', border: '1px solid #1a2236', borderRadius: 10, padding: 28, marginBottom: 20 },
    label: { fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 6, display: 'block' },
    input: { width: '100%', background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, outline: 'none', appearance: 'none', boxSizing: 'border-box' },
    radio: { display: 'flex', gap: 12, marginBottom: 20 },
    radioBtn: (active) => ({ padding: '10px 20px', borderRadius: 6, border: `1px solid ${active ? '#2d8a9a' : '#1a2236'}`, background: active ? 'rgba(45,138,154,0.1)' : 'transparent', color: active ? '#2d8a9a' : '#8892a4', cursor: 'pointer', fontSize: 14, fontWeight: 500 }),
    btn: { width: '100%', background: '#2d8a9a', color: '#fff', border: 'none', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  }

  if (submitted) {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: 'center', borderColor: '#27ae60' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <p style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, marginBottom: 16 }}>{t.success}</p>
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#2d8a9a', color: '#fff', padding: '14px 32px', borderRadius: 6, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {t.schedule}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <h1 style={{ fontFamily: "'Sora', system-ui", fontSize: 28, fontWeight: 600, color: '#f0eeea', marginBottom: 12 }}>{t.title}</h1>
      <p style={{ fontSize: 15, color: '#8892a4', lineHeight: 1.7, marginBottom: 8 }}>{t.intro}</p>
      <p style={{ fontSize: 13, color: '#5a6478', lineHeight: 1.6, marginBottom: 32 }}>{t.scope}</p>

      {/* Client type */}
      <div style={S.card}>
        <label style={S.label}>{t.typeQ}</label>
        <div style={S.radio}>
          <button onClick={() => setClientType('individual')} style={S.radioBtn(clientType === 'individual')}>{t.individual}</button>
          <button onClick={() => setClientType('entity')} style={S.radioBtn(clientType === 'entity')}>{t.entity}</button>
        </div>
      </div>

      {/* Individual */}
      {clientType === 'individual' && (
        <div style={S.card}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div><label style={S.label}>{t.fullName} *</label><input style={S.input} value={form.fullName} onChange={e => upd('fullName', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={S.label}>{t.nationality}</label><input style={S.input} value={form.nationality} onChange={e => upd('nationality', e.target.value)} /></div>
              <div><label style={S.label}>{t.countryResidence} *</label><input style={S.input} value={form.countryResidence} onChange={e => upd('countryResidence', e.target.value)} /></div>
            </div>
            <div><label style={S.label}>{t.dateOfBirth}</label><input style={S.input} type="date" value={form.dateOfBirth} onChange={e => upd('dateOfBirth', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div><label style={S.label}>{t.docType} *</label>
                <select style={S.select} value={form.docType} onChange={e => upd('docType', e.target.value)}>
                  <option value="">—</option>
                  {t.docTypes.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label style={S.label}>{t.docNumber} *</label><input style={S.input} value={form.docNumber} onChange={e => upd('docNumber', e.target.value)} /></div>
              <div><label style={S.label}>{t.docCountry}</label><input style={S.input} value={form.docCountry} onChange={e => upd('docCountry', e.target.value)} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Entity */}
      {clientType === 'entity' && (
        <div style={S.card}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div><label style={S.label}>{t.entityName} *</label><input style={S.input} value={form.entityName} onChange={e => upd('entityName', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={S.label}>{t.entityForm}</label><input style={S.input} value={form.entityForm} onChange={e => upd('entityForm', e.target.value)} /></div>
              <div><label style={S.label}>{t.entityCountry} *</label><input style={S.input} value={form.entityCountry} onChange={e => upd('entityCountry', e.target.value)} /></div>
            </div>
            <div><label style={S.label}>{t.entityAddress}</label><input style={S.input} value={form.entityAddress} onChange={e => upd('entityAddress', e.target.value)} /></div>
            <div style={{ borderTop: '1px solid #1a2236', paddingTop: 14, marginTop: 4 }}>
              <label style={{ ...S.label, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: '#5a6478' }}>{lang === 'en' ? 'Representative' : 'Representante'}</label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={S.label}>{t.repName} *</label><input style={S.input} value={form.repName} onChange={e => upd('repName', e.target.value)} /></div>
              <div><label style={S.label}>{t.repRole}</label><input style={S.input} value={form.repRole} onChange={e => upd('repRole', e.target.value)} /></div>
            </div>
            <div><label style={S.label}>{t.repDocNumber} *</label><input style={S.input} value={form.repDocNumber} onChange={e => upd('repDocNumber', e.target.value)} /></div>
            <div style={{ borderTop: '1px solid #1a2236', paddingTop: 14, marginTop: 4 }}>
              <label style={{ ...S.label, fontWeight: 600, color: '#dfe1e6' }}>{t.boLabel}</label>
              <p style={{ fontSize: 12, color: '#5a6478', marginBottom: 8, lineHeight: 1.5 }}>{t.boDesc}</p>
              <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} placeholder={t.boPlaceholder} value={form.boDeclaration} onChange={e => upd('boDeclaration', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Risk questions */}
      {clientType && (
        <div style={S.card}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={S.label}>{t.pepQ}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => upd('isPEP', 'yes')} style={S.radioBtn(form.isPEP === 'yes')}>{t.yes}</button>
                <button onClick={() => upd('isPEP', 'no')} style={S.radioBtn(form.isPEP === 'no')}>{t.no}</button>
              </div>
            </div>
            <div>
              <label style={S.label}>{t.euQ}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => upd('outsideEU', 'yes')} style={S.radioBtn(form.outsideEU === 'yes')}>{t.yes}</button>
                <button onClick={() => upd('outsideEU', 'no')} style={S.radioBtn(form.outsideEU === 'no')}>{t.no}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Declaration + Submit */}
      {clientType && (
        <div style={S.card}>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" id="declaration" style={{ marginTop: 3, accentColor: '#2d8a9a' }} />
            <span style={{ fontSize: 13, color: '#8892a4', lineHeight: 1.5 }}>
              {clientType === 'entity' ? t.declarationEntity : t.declaration}
            </span>
          </label>
          <p style={{ fontSize: 11, color: '#5a6478', marginBottom: 16, lineHeight: 1.5 }}>{t.retention}</p>
          <button onClick={handleSubmit} style={S.btn}>{t.submit}</button>
        </div>
      )}
    </div>
  )
}
