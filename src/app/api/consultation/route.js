import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getStripe, UUID, EMAIL_RE } from '@/lib/stripe'
import { notifyConsultationRequest, notifyKyc } from '@/lib/email'

export const dynamic = 'force-dynamic'

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// POST → consultation request without payment (contact-style request)
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = str(body.name, 200)
    const email = str(body.email, 200)
    if (!name || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Name and valid email required' }, { status: 400 })

    const supabase = createServerClient()
    let leadId = null
    if (UUID.test(body.leadId || '')) {
      const { data } = await supabase.from('leads').select('id').eq('id', body.leadId).maybeSingle()
      leadId = data?.id || null
    }

    const { data, error } = await supabase
      .from('consultation_requests')
      .insert({
        lead_id: leadId,
        full_name: name,
        email,
        company: str(body.company, 200) || null,
        matter_description: str(body.matter, 5000) || null,
        preferred_slot: str(body.preferred, 200) || null,
        status: 'requested',
      })
      .select('id')
      .single()
    if (error) throw error

    if (leadId) {
      await supabase.from('leads').update({ status: 'consultation_requested' }).eq('id', leadId)
      await supabase.from('analytics_events').insert({ event_type: 'consultation_requested', lead_id: leadId })
    }

    await notifyConsultationRequest({ name, email, company: body.company, matter: str(body.matter, 5000) })
    return NextResponse.json({ success: true, consultationId: data.id })
  } catch (error) {
    console.error('Consultation request error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}

const KYC_FIELDS = [
  'clientType', 'fullName', 'nationality', 'countryResidence', 'dateOfBirth', 'docType', 'docNumber', 'docCountry',
  'entityName', 'entityForm', 'entityCountry', 'entityAddress', 'repName', 'repRole', 'repDocNumber',
  'boDeclaration', 'isPEP', 'outsideEU',
]

// PATCH { sessionId, kyc_data } → store KYC after a verified payment and
// release the booking link.
export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const sessionId = str(body.sessionId, 200)
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return NextResponse.json({ error: 'Invalid session' }, { status: 400 })

    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return NextResponse.json({ error: 'Payment not confirmed' }, { status: 402 })

    const kyc = {}
    for (const k of KYC_FIELDS) {
      const v = str(body.kyc_data?.[k], k === 'boDeclaration' ? 3000 : 200)
      if (v) kyc[k] = v
    }
    if (!['individual', 'entity'].includes(kyc.clientType)) return NextResponse.json({ error: 'Invalid KYC data' }, { status: 400 })

    const supabase = createServerClient()
    const { data: cr } = await supabase
      .from('consultation_requests').select('id, kyc_completed_at').eq('stripe_payment_id', sessionId).maybeSingle()
    if (!cr) return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })

    // First submission wins; a reload after success just gets the link again
    if (!cr.kyc_completed_at) {
      const { error } = await supabase.from('consultation_requests').update({
        kyc_data: { ...kyc, submitted_at: new Date().toISOString() },
        kyc_completed_at: new Date().toISOString(),
        payment_status: 'paid',
        status: 'confirmed',
      }).eq('id', cr.id)
      if (error) throw error
      await notifyKyc({ email: session.customer_details?.email || session.customer_email, tier: session.metadata?.tier })
    }

    return NextResponse.json({ success: true, calendlyUrl: process.env.CALENDLY_URL || null })
  } catch (error) {
    console.error('KYC error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to save KYC' }, { status: 500 })
  }
}
