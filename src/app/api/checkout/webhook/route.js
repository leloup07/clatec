import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const supabase = createServerClient()

    // Update consultation request payment status
    if (session.id) {
      await supabase
        .from('consultation_requests')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('stripe_payment_id', session.id)

      // Update lead status
      if (session.metadata?.lead_id) {
        await supabase
          .from('leads')
          .update({ status: 'consultation_requested' })
          .eq('id', session.metadata.lead_id)

        await supabase.from('analytics_events').insert({
          event_type: 'payment_completed',
          lead_id: session.metadata.lead_id,
          metadata: { tier: session.metadata.tier, amount: session.amount_total / 100 },
        })
      }
    }

    // TODO: Send confirmation email via Resend
  }

  return NextResponse.json({ received: true })
}
