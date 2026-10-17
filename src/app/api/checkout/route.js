import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getStripe, TIER_PRICES, UUID, EMAIL_RE } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// POST { tier, name, email, company?, matter?, preferred?, leadId?, language }
// Creates a Stripe Checkout session (price fixed server-side) and records a
// pending consultation request. Returns { url } to redirect the browser.
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const tierConfig = TIER_PRICES[body.tier]
    if (!tierConfig) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

    const name = str(body.name, 200)
    const email = str(body.email, 200)
    if (!name || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Name and valid email required' }, { status: 400 })

    const lang = body.language === 'es' ? 'es' : 'en'
    const label = lang === 'es' ? tierConfig.label_es : tierConfig.label_en
    const supabase = createServerClient()

    // Only link to a lead that actually exists
    let leadId = null
    if (UUID.test(body.leadId || '')) {
      const { data } = await supabase.from('leads').select('id').eq('id', body.leadId).maybeSingle()
      leadId = data?.id || null
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: tierConfig.amount,
          product_data: {
            name: `CLATEC — ${label}`,
            description: lang === 'es'
              ? 'Revisión profesional estructurada basada en análisis CLATEC. Precio fijo, alcance definido.'
              : 'Structured professional review based on CLATEC analysis. Fixed price, defined scope.',
          },
        },
        quantity: 1,
      }],
      metadata: { lead_id: leadId || '', tier: body.tier, client_name: name, language: lang },
      locale: lang === 'es' ? 'es' : 'en',
      // After payment → KYC form → then scheduling
      success_url: `${appUrl}/kyc?session_id={CHECKOUT_SESSION_ID}&tier=${body.tier}&lang=${lang}`,
      cancel_url: `${appUrl}/consultation?cancelled=true`,
      invoice_creation: { enabled: true },
      automatic_tax: { enabled: false }, // IVA handled manually via invoice
    })

    const { error } = await supabase.from('consultation_requests').insert({
      lead_id: leadId,
      full_name: name,
      email,
      company: str(body.company, 200) || null,
      matter_description: str(body.matter, 5000) || null,
      preferred_slot: str(body.preferred, 200) || null,
      tier: body.tier,
      status: 'requested',
      payment_required: true,
      payment_amount: tierConfig.amount / 100,
      payment_currency: 'EUR',
      stripe_payment_id: session.id,
      payment_status: 'pending',
    })
    if (error) console.error('Consultation insert error:', error)

    await supabase.from('analytics_events').insert({
      event_type: 'checkout_initiated', lead_id: leadId, metadata: { tier: body.tier, amount: tierConfig.amount / 100 },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
