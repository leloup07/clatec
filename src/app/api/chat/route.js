import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { evaluateMessage, GUARD_RESPONSES } from '@/lib/guard'

export const dynamic = 'force-dynamic'
export const maxDuration = 120 // seconds — a full structured analysis can take a while

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'
const MAX_USER_MESSAGES = 20   // per conversation (cost cap)
const MAX_MESSAGE_CHARS = 4000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST { leadId, message }
// The conversation history and the intake are read from Supabase — never trusted
// from the browser — so a client cannot inject fake assistant turns or alter the
// system prompt.
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const leadId = body.leadId
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!UUID.test(leadId || '')) return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    if (!message) return NextResponse.json({ error: 'Empty message' }, { status: 400 })
    if (message.length > MAX_MESSAGE_CHARS) return NextResponse.json({ error: 'Message too long' }, { status: 400 })

    const supabase = createServerClient()

    const { data: lead } = await supabase.from('leads').select('id, language, intake_raw').eq('id', leadId).maybeSingle()
    if (!lead) return NextResponse.json({ error: 'Invalid session' }, { status: 404 })
    const lang = lead.language === 'es' ? 'es' : 'en'

    const { data: convo } = await supabase
      .from('conversations').select('id, message_count, evasion_count').eq('lead_id', leadId).maybeSingle()
    if (!convo) return NextResponse.json({ error: 'Invalid session' }, { status: 404 })

    const { data: history = [] } = await supabase
      .from('messages').select('role, content').eq('conversation_id', convo.id)
      .in('role', ['user', 'assistant']).order('created_at', { ascending: true })

    const userTurns = history.filter(m => m.role === 'user').length
    if (userTurns >= MAX_USER_MESSAGES) {
      return NextResponse.json({
        success: true, limitReached: true,
        message: lang === 'es'
          ? 'Se ha alcanzado el límite de mensajes de este análisis preliminar. Para continuar, solicita una revisión jurídica profesional.'
          : 'This preliminary analysis has reached its message limit. To continue, please request a professional legal review.',
      })
    }

    // ─── GUARD CHECK ───
    const guardResults = evaluateMessage(message, lang)
    const evasionDetected = guardResults.some(r => r.category === 'evasion')
    const evasionCount = (convo.evasion_count || 0) + (evasionDetected ? 1 : 0)
    if (evasionDetected) {
      await supabase.from('conversations').update({ evasion_count: evasionCount }).eq('id', convo.id)
    }

    const hardBlock = guardResults.find(r => r.severity === 'hard_block') ||
      (evasionCount >= 2 ? { category: 'evasion' } : null)

    if (hardBlock) {
      const text = (GUARD_RESPONSES[hardBlock.category]?.[lang] || GUARD_RESPONSES[hardBlock.category]?.en) +
        (lang === 'en'
          ? '\n\nIf you would like to proceed with professional legal review, you can request a consultation.'
          : '\n\nSi desea proceder con revisión jurídica profesional, puede solicitar una consulta.')
      await saveMessages(supabase, convo, message, text)
      return NextResponse.json({ success: true, message: text, blocked: true, blockCategory: hardBlock.category })
    }

    let systemPrompt = buildSystemPrompt(lead.intake_raw || {}, lang)
    const softBlock = guardResults.find(r => r.severity === 'soft_block')
    if (softBlock) {
      const guardNote = GUARD_RESPONSES[softBlock.category]?.[lang] || GUARD_RESPONSES[softBlock.category]?.en
      systemPrompt += `\n\n═══ ACTIVE BOUNDARY ═══\nThe user's latest message triggered a scope boundary (${softBlock.category}). You MUST:\n1. Acknowledge what they asked\n2. Explain the boundary: "${guardNote}"\n3. Redirect to what CLATEC CAN do for them\n4. If the matter genuinely requires professional review, recommend it.\nDo NOT produce a structured analysis for an out-of-scope request.`
    }

    // ─── CLAUDE ───
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      // If a safety classifier declines, Anthropic re-runs the request on its
      // recommended fallback model instead of returning a refusal.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: systemPrompt,
      messages: [...history.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: message }],
    })

    let assistantMessage
    if (response.stop_reason === 'refusal') {
      assistantMessage = lang === 'es'
        ? 'No puedo procesar esta solicitud dentro del diagnóstico preliminar. Si lo deseas, puedes solicitar una revisión jurídica profesional.'
        : 'This request cannot be processed within the preliminary diagnostic. You can request a professional legal review instead.'
    } else {
      assistantMessage = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n').trim()
      if (!assistantMessage) throw new Error(`Empty response (stop_reason: ${response.stop_reason})`)
    }

    await saveMessages(supabase, convo, message, assistantMessage)

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      guardTriggered: softBlock?.category,
      remaining: MAX_USER_MESSAGES - userTurns - 1,
    })
  } catch (error) {
    console.error('Chat error:', error?.status || '', error?.message || error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}

async function saveMessages(supabase, convo, userContent, assistantContent) {
  try {
    // Two separate inserts so created_at (used for ordering) is strictly increasing
    await supabase.from('messages').insert({ conversation_id: convo.id, role: 'user', content: userContent })
    await supabase.from('messages').insert({ conversation_id: convo.id, role: 'assistant', content: assistantContent })
    await supabase.from('conversations').update({ message_count: (convo.message_count || 0) + 2 }).eq('id', convo.id)
  } catch (e) { console.error('Save messages error:', e) }
}
