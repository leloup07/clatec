import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('consultation_requests')
      .insert({
        lead_id: body.leadId || null,
        full_name: body.name,
        email: body.email,
        company: body.company || null,
        matter_description: body.matter || null,
        preferred_slot: body.preferred || null,
        status: 'requested',
      })
      .select()
      .single()

    if (error) throw error

    // Update lead status if linked
    if (body.leadId) {
      await supabase
        .from('leads')
        .update({ status: 'consultation_requested' })
        .eq('id', body.leadId)

      await supabase.from('analytics_events').insert({
        event_type: 'consultation_requested',
        lead_id: body.leadId,
      })
    }

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({ success: true, consultationId: data.id })
  } catch (error) {
    console.error('Consultation request error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
