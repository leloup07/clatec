import 'server-only'
import { Resend } from 'resend'

// Internal notifications to ADMIN_EMAIL via Resend. Plain text only (no user
// content rendered as HTML). If Resend is not configured, this is a no-op so
// the rest of the flow keeps working.

async function send(subject, text) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.ADMIN_EMAIL
  if (!key || !from || !to) return
  try {
    await new Resend(key).emails.send({ from, to, subject, text })
  } catch (e) {
    console.error('Email error:', e?.message || e)
  }
}

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://clatec.consulting'

export function notifyNewLead(lead, escalationLevel) {
  return send(
    `CLATEC · Nuevo intake: ${lead.matter_type}${escalationLevel !== 'none' ? ` (escalado ${escalationLevel})` : ''}`,
    `Nuevo lead en CLATEC\n\n` +
    `Nombre: ${lead.first_name} ${lead.last_name || ''}\n` +
    `Email: ${lead.email}\n` +
    `Empresa: ${lead.company || '—'}\n` +
    `Asunto: ${lead.matter_type}\n` +
    `Jurisdicción: ${lead.main_jurisdiction || '—'}\n` +
    `Urgencia: ${lead.urgency}\n` +
    `Complejidad: ${lead.complexity_score}/10\n\n` +
    `Panel: ${appUrl()}/admin`
  )
}

export function notifyPayment({ email, name, tier, amount }) {
  return send(
    `CLATEC · Pago recibido: ${tier} (${amount} €)`,
    `Pago confirmado por Stripe\n\nCliente: ${name || '—'}\nEmail: ${email || '—'}\nTramo: ${tier}\nImporte: ${amount} €\n\nPanel: ${appUrl()}/admin`
  )
}

export function notifyKyc({ email, tier }) {
  return send(
    `CLATEC · KYC completado (${tier})`,
    `El cliente ${email || '—'} ha completado la identificación (KYC) y puede agendar la consulta.\n\nPanel: ${appUrl()}/admin`
  )
}

export function notifyConsultationRequest({ name, email, company, matter }) {
  return send(
    `CLATEC · Solicitud de consulta de ${name}`,
    `Nueva solicitud de consulta\n\nNombre: ${name}\nEmail: ${email}\nEmpresa: ${company || '—'}\n\n${matter || ''}\n\nPanel: ${appUrl()}/admin`
  )
}
