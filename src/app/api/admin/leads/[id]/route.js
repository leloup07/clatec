import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'under_review', 'consultation_requested', 'awaiting_response', 'closed', 'not_qualified', 'archived']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET → chat messages for a lead
export async function GET(_request, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!UUID.test(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const supabase = createServerClient()
  const { data: convo } = await supabase.from('conversations').select('id').eq('lead_id', params.id).maybeSingle()
  if (!convo) return NextResponse.json({ messages: [] })

  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', convo.id)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })

  return NextResponse.json({ messages })
}

// PATCH { status?, internal_notes? } → update a lead
export async function PATCH(request, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!UUID.test(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await request.json().catch(() => ({}))
  const update = {}
  if (typeof body.status === 'string') {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    update.status = body.status
  }
  if (typeof body.internal_notes === 'string') update.internal_notes = body.internal_notes.slice(0, 10000)
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase.from('leads').update(update).eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  await supabase.from('audit_log').insert({
    entity_type: 'lead', entity_id: params.id, action: 'updated', actor: 'admin', new_value: update,
  })

  return NextResponse.json({ success: true })
}
