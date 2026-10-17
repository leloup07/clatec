import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getStripe, UUID } from '@/lib/stripe'
import { notifyPayment } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object
    if (session.payment_status !== 'paid') return NextResponse.json({ received: true })

    const supabase = createServerClient()
    const { data: updated } = await supabase
      .from('consultation_requests')
      .update({ payment_status: 'paid', status: 'confirmed' })
      .eq('stripe_payment_id', session.id)
      .neq('payment_status', 'paid') // idempotent: Stripe may retry
      .select('id')

    const leadId = UUID.test(session.metadata?.lead_id || '') ? session.metadata.lead_id : null
    if (leadId) {
      await supabase.from('leads').update({ status: 'consultation_requested' }).eq('id', leadId)
    }

    if (updated?.length) {
      await supabase.from('analytics_events').insert({
        event_type: 'payment_completed', lead_id: leadId,
        metadata: { tier: session.metadata?.tier, amount: session.amount_total / 100 },
      })
      await notifyPayment({
        email: session.customer_details?.email || session.customer_email,
        name: session.metadata?.client_name,
        tier: session.metadata?.tier,
        amount: session.amount_total / 100,
      })
    }
  }

  return NextResponse.json({ received: true })
}
