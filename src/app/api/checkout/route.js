import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const TIER_PRICES = {
  standard: { amount: 45000, label_en: 'Structured Review', label_es: 'Revisión Estructurada' },
  complex: { amount: 75000, label_en: 'Complex Matter Review', label_es: 'Revisión de Asunto Complejo' },
}

export async function POST(request) {
  try {
    const { tier, leadId, email, name, language } = await request.json()
    const tierConfig = TIER_PRICES[tier]
    if (!tierConfig) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

    const lang = language || 'en'
    const label = lang === 'es' ? tierConfig.label_es : tierConfig.label_en

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
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
      metadata: {
        lead_id: leadId || '',
        tier,
        client_name: name || '',
        language: lang,
      },
      // After payment → KYC form → then scheduling
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/kyc?session_id={CHECKOUT_SESSION_ID}&tier=${tier}&lang=${lang}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/consultation?cancelled=true`,
      // Invoice generation
      invoice_creation: { enabled: true },
      // Spanish tax
      automatic_tax: { enabled: false }, // Handle IVA manually via invoice
    })

    // Update lead status
    if (leadId) {
      const supabase = createServerClient()
      await supabase.from('consultation_requests').insert({
        lead_id: leadId,
        full_name: name || '',
        email: email || '',
        status: 'requested',
        payment_required: true,
        payment_amount: tierConfig.amount / 100,
        payment_currency: 'EUR',
        stripe_payment_id: session.id,
        payment_status: 'pending',
      })
      await supabase.from('analytics_events').insert({
        event_type: 'checkout_initiated', lead_id: leadId,
        metadata: { tier, amount: tierConfig.amount / 100 },
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
