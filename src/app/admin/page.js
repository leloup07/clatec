'use client'
import { useState, useEffect, useCallback } from 'react'

// In production, use createServerClient or Supabase RLS
// For now, this uses the anon key with admin RLS policies
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function query(table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  url.searchParams.set('select', params.select || '*')
  if (params.order) url.searchParams.set('order', params.order)
  if (params.limit) url.searchParams.set('limit', params.limit)
  if (params.filters) {
    for (const [k, v] of Object.entries(params.filters)) {
      url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  })
  return res.json()
}

async function update(table, id, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`
  return fetch(url, {
    method: 'PATCH',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

const STATUSES = ['new', 'under_review', 'consultation_requested', 'awaiting_response', 'closed', 'not_qualified', 'archived']
const STATUS_COLORS = {
  new: '#2d8a9a', under_review: '#e8a838', consultation_requested: '#27ae60',
  awaiting_response: '#8e44ad', closed: '#5a6478', not_qualified: '#c0392b', archived: '#3d4555'
}

export default function AdminPanel() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [leads, setLeads] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [filter, setFilter] = useState({ status: '', matter: '', urgency: '' })
  const [view, setView] = useState('list') // list | detail | metrics
  const [loading, setLoading] = useState(false)

  // Simple auth (replace with Supabase Auth in production)
  const login = () => {
    // In production, use Supabase Auth. This is a placeholder.
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'clatec-admin-2026') {
      setAuth(true)
    }
  }

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const data = await query('leads', {
        select: '*, conversations(*), consultation_requests(*)',
        order: 'created_at.desc',
        limit: '100'
      })
      setLeads(data || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  const loadMessages = async (leadId) => {
    try {
      const convos = await query('conversations', { filters: { lead_id: `eq.${leadId}` } })
      if (convos?.[0]) {
        const msgs = await query('messages', {
          filters: { conversation_id: `eq.${convos[0].id}` },
          order: 'created_at.asc'
        })
        setMessages(msgs || [])
      }
    } catch (e) { console.error(e) }
  }

  const loadMetrics = async () => {
    try {
      const data = await query('v_dashboard_metrics')
      setMetrics(data?.[0] || null)
    } catch (e) { console.error(e) }
  }

  const updateStatus = async (leadId, status) => {
    await update('leads', leadId, { status })
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
    if (selected?.id === leadId) setSelected(prev => ({ ...prev, status }))
  }

  const updateNotes = async (leadId, notes) => {
    await update('leads', leadId, { internal_notes: notes })
  }

  useEffect(() => { if (auth) { loadLeads(); loadMetrics(); } }, [auth, loadLeads])

  const filteredLeads = leads.filter(l => {
    if (filter.status && l.status !== filter.status) return false
    if (filter.matter && l.matter_type !== filter.matter) return false
    if (filter.urgency && l.urgency !== filter.urgency) return false
    return true
  })

  // ─── LOGIN ───
  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', background: '#070b14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ background: '#0d1320', border: '1px solid #1a2236', borderRadius: 10, padding: 40, width: 360 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0eeea', letterSpacing: 2, marginBottom: 8 }}>CLATEC</div>
          <div style={{ fontSize: 13, color: '#5a6478', marginBottom: 32 }}>Admin Panel</div>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px 16px', borderRadius: 6, fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={login}
            style={{ width: '100%', background: '#2d8a9a', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // ─── MAIN PANEL ───
  const S = {
    page: { minHeight: '100vh', background: '#070b14', color: '#dfe1e6', fontFamily: "'DM Sans', system-ui, sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1a2236' },
    sidebar: { width: 280, borderRight: '1px solid #1a2236', overflowY: 'auto', height: 'calc(100vh - 57px)' },
    main: { flex: 1, padding: 24, overflowY: 'auto', height: 'calc(100vh - 57px)' },
    card: { background: '#0d1320', border: '1px solid #1a2236', borderRadius: 8, padding: 20, marginBottom: 16 },
    badge: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${color}20`, color, letterSpacing: 0.5 }),
    label: { fontSize: 11, fontWeight: 600, color: '#5a6478', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
    value: { fontSize: 14, color: '#dfe1e6', marginBottom: 12 },
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f0eeea', letterSpacing: 2 }}>CLATEC</span>
          <span style={{ fontSize: 12, color: '#5a6478' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['list', 'metrics'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? '#2d8a9a' : 'transparent', color: view === v ? '#fff' : '#8892a4',
              border: `1px solid ${view === v ? '#2d8a9a' : '#1a2236'}`, padding: '6px 16px', borderRadius: 6,
              fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize'
            }}>{v === 'list' ? 'Leads' : 'Metrics'}</button>
          ))}
          <button onClick={loadLeads} style={{ background: 'transparent', color: '#8892a4', border: '1px solid #1a2236', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>↻ Refresh</button>
        </div>
      </div>

      {/* Metrics View */}
      {view === 'metrics' && metrics && (
        <div style={{ padding: 24, maxWidth: 900 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f0eeea', marginBottom: 24 }}>Dashboard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Leads', value: metrics.total_leads, color: '#2d8a9a' },
              { label: 'Consultations Requested', value: metrics.total_consultations_requested, color: '#27ae60' },
              { label: 'Conversion Rate', value: `${metrics.conversion_rate_pct || 0}%`, color: '#e8a838' },
              { label: 'Escalated', value: metrics.total_escalated, color: '#c0392b' },
            ].map((m, i) => (
              <div key={i} style={S.card}>
                <div style={S.label}>{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, marginTop: 24 }}>
            <div style={S.label}>By Category</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {[
                ['Tokenization', metrics.cat_tokenization],
                ['MiCA', metrics.cat_mica],
                ['CASP', metrics.cat_casp],
                ['Sandbox', metrics.cat_sandbox],
                ['Cross-border', metrics.cat_cross_border],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1a2236' }}>
                  <span style={{ fontSize: 13, color: '#8892a4' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#dfe1e6' }}>{v || 0}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...S.card, marginTop: 16 }}>
            <div style={S.label}>By Urgency</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {[['High', metrics.urgency_high, '#c0392b'], ['Medium', metrics.urgency_medium, '#e8a838'], ['Low', metrics.urgency_low, '#27ae60']].map(([k, v, c]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v || 0}</div>
                  <div style={{ fontSize: 11, color: '#5a6478' }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lead List + Detail */}
      {view === 'list' && (
        <div style={{ display: 'flex' }}>
          {/* Sidebar: Lead List */}
          <div style={S.sidebar}>
            {/* Filters */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a2236', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <select value={filter.status} onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}
                style={{ background: '#0f1629', border: '1px solid #1a2236', color: '#8892a4', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>
                <option value="">All statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
              <select value={filter.urgency} onChange={e => setFilter(p => ({ ...p, urgency: e.target.value }))}
                style={{ background: '#0f1629', border: '1px solid #1a2236', color: '#8892a4', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>
                <option value="">All urgency</option>
                {['low', 'medium', 'high'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            {/* Lead cards */}
            <div style={{ padding: 8 }}>
              {loading && <div style={{ padding: 16, textAlign: 'center', color: '#5a6478', fontSize: 13 }}>Loading…</div>}
              {filteredLeads.map(lead => (
                <div key={lead.id} onClick={() => { setSelected(lead); loadMessages(lead.id); }}
                  style={{
                    padding: '12px 14px', borderRadius: 6, marginBottom: 4, cursor: 'pointer',
                    background: selected?.id === lead.id ? '#111827' : 'transparent',
                    border: `1px solid ${selected?.id === lead.id ? '#2d6a7a' : 'transparent'}`,
                    transition: 'all .15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f0eeea' }}>{lead.first_name} {lead.last_name || ''}</span>
                    <span style={S.badge(STATUS_COLORS[lead.status] || '#5a6478')}>{lead.status?.replace(/_/g, ' ')}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#5a6478' }}>{lead.matter_type?.replace(/_/g, ' ')} · {lead.main_jurisdiction || '—'}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {lead.escalation_flag && <span style={S.badge('#c0392b')}>⚠ escalation</span>}
                    {lead.urgency === 'high' && <span style={S.badge('#e8a838')}>urgent</span>}
                  </div>
                </div>
              ))}
              {!loading && filteredLeads.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#5a6478', fontSize: 13 }}>No leads found</div>
              )}
            </div>
          </div>

          {/* Main: Lead Detail */}
          <div style={S.main}>
            {!selected ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#5a6478' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>←</div>
                <div style={{ fontSize: 14 }}>Select a lead to view details</div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f0eeea', marginBottom: 4 }}>
                      {selected.first_name} {selected.last_name || ''}
                    </h2>
                    <div style={{ fontSize: 13, color: '#5a6478' }}>
                      {selected.email} {selected.company ? `· ${selected.company}` : ''} {selected.role_position ? `· ${selected.role_position}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        style={{
                          background: selected.status === s ? STATUS_COLORS[s] : 'transparent',
                          color: selected.status === s ? '#fff' : '#5a6478',
                          border: `1px solid ${selected.status === s ? STATUS_COLORS[s] : '#1a2236'}`,
                          padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                        }}>{s.replace(/_/g, ' ')}</button>
                    ))}
                  </div>
                </div>

                {/* Scores */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <span style={S.badge(STATUS_COLORS[selected.status])}>{selected.status?.replace(/_/g, ' ')}</span>
                  <span style={S.badge('#e8a838')}>complexity: {selected.complexity_score}/10</span>
                  <span style={S.badge('#8e44ad')}>urgency: {selected.urgency}</span>
                  {selected.escalation_flag && <span style={S.badge('#c0392b')}>⚠ escalation recommended</span>}
                </div>

                {/* Matter details */}
                <div style={S.card}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div><div style={S.label}>Matter Type</div><div style={S.value}>{selected.matter_type?.replace(/_/g, ' ')}</div></div>
                    <div><div style={S.label}>Main Jurisdiction</div><div style={S.value}>{selected.main_jurisdiction || '—'}</div></div>
                    <div><div style={S.label}>Other Jurisdictions</div><div style={S.value}>{selected.other_jurisdictions || '—'}</div></div>
                    <div><div style={S.label}>Project Stage</div><div style={S.value}>{selected.project_stage?.replace(/_/g, ' ') || '—'}</div></div>
                    <div><div style={S.label}>Objective</div><div style={S.value}>{selected.objective || '—'}</div></div>
                    <div><div style={S.label}>Created</div><div style={S.value}>{new Date(selected.created_at).toLocaleDateString()}</div></div>
                  </div>
                </div>

                {/* Description */}
                <div style={S.card}>
                  <div style={S.label}>User Description</div>
                  <div style={{ fontSize: 14, color: '#dfe1e6', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.description}</div>
                </div>

                {/* Chat history */}
                {messages.length > 0 && (
                  <div style={S.card}>
                    <div style={S.label}>Conversation ({messages.length} messages)</div>
                    <div style={{ maxHeight: 400, overflowY: 'auto', marginTop: 8 }}>
                      {messages.map((msg, i) => (
                        <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < messages.length - 1 ? '1px solid #1a2236' : 'none' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: msg.role === 'user' ? '#2d8a9a' : '#5a6478', marginBottom: 4 }}>
                            {msg.role === 'user' ? 'USER' : 'CLATEC'} · {new Date(msg.created_at).toLocaleTimeString()}
                          </div>
                          <div style={{ fontSize: 13, color: '#dfe1e6', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal notes */}
                <div style={S.card}>
                  <div style={S.label}>Internal Notes</div>
                  <textarea value={selected.internal_notes || ''} onChange={e => setSelected(p => ({ ...p, internal_notes: e.target.value }))}
                    onBlur={() => updateNotes(selected.id, selected.internal_notes)}
                    placeholder="Add internal notes…"
                    style={{ width: '100%', background: '#0f1629', border: '1px solid #1a2236', color: '#dfe1e6', padding: '12px', borderRadius: 6, fontSize: 13, minHeight: 80, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginTop: 8 }} />
                </div>

                {/* Consultation requests */}
                {selected.consultation_requests?.length > 0 && (
                  <div style={{ ...S.card, borderColor: '#27ae60' }}>
                    <div style={S.label}>Consultation Requests</div>
                    {selected.consultation_requests.map((cr, i) => (
                      <div key={i} style={{ marginTop: 8 }}>
                        <span style={S.badge('#27ae60')}>{cr.status}</span>
                        <span style={{ fontSize: 12, color: '#5a6478', marginLeft: 8 }}>{cr.preferred_slot || 'No slot specified'}</span>
                        {cr.matter_description && <p style={{ fontSize: 13, color: '#8892a4', marginTop: 4 }}>{cr.matter_description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
