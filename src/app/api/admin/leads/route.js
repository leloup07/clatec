import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET → latest leads (with conversation + consultation requests) and dashboard metrics
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const [leadsRes, metricsRes, requestsRes] = await Promise.all([
    supabase
      .from('leads')
      .select('*, conversations(*), consultation_requests(*)')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('v_dashboard_metrics').select('*').single(),
    // Requests not linked to an intake (NDA requests, direct payments)
    supabase.from('consultation_requests').select('*').is('lead_id', null)
      .order('created_at', { ascending: false }).limit(200),
  ])

  if (leadsRes.error) {
    console.error('Admin leads error:', leadsRes.error)
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 })
  }

  return NextResponse.json({ leads: leadsRes.data || [], metrics: metricsRes.data || null, requests: requestsRes.data || [] })
}
