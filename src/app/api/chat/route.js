import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { evaluateMessage, GUARD_RESPONSES, trackEvasion } from '@/lib/guard'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { leadId, messages, intake, language, sessionState = {} } = await request.json()
    const supabase = createServerClient()
    const lang = language || 'en'

    // ─── GUARD CHECK on latest user message ───
    const lastUserMsg = messages[messages.length - 1]
    if (lastUserMsg?.role === 'user') {
      const guardResults = evaluateMessage(lastUserMsg.content, lang)

      // Check for hard blocks (evasion, enforcement)
      const hardBlocks = guardResults.filter(r =>
        r.severity === 'hard_block' ||
        (r.category === 'evasion' && sessionState.evasionBlocked)
      )

      if (hardBlocks.length > 0) {
        const category = hardBlocks[0].category
        const response = GUARD_RESPONSES[category]?.[lang] || GUARD_RESPONSES[category]?.en
        const suffix = lang === 'en'
          ? '\n\nIf you would like to proceed with professional legal review, you can request a consultation.'
          : '\n\nSi desea proceder con revisión jurídica profesional, puede solicitar una consulta.'

        return NextResponse.json({
          success: true,
          message: response + suffix,
          blocked: true,
          blockCategory: category,
          sessionState: trackEvasion(sessionState, category === 'evasion'),
        })
      }

      // Check for soft blocks (definitive advice, doc review, tax)
      const softBlocks = guardResults.filter(r => r.severity === 'soft_block')

      if (softBlocks.length > 0) {
        const category = softBlocks[0].category
        const guardNote = GUARD_RESPONSES[category]?.[lang] || GUARD_RESPONSES[category]?.en

        // For soft blocks: inject the guard response as system context,
        // then let the LLM continue but with the boundary enforced
        const guardedMessages = [
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: lastUserMsg.content
          },
          // We'll prepend the guard note to the system prompt instead
        ]

        const systemPrompt = buildSystemPrompt(intake, lang) +
          `\n\n═══ ACTIVE BOUNDARY ═══\nThe user's latest message triggered a scope boundary (${category}). You MUST:\n1. Acknowledge what they asked\n2. Explain the boundary: "${guardNote}"\n3. Redirect to what CLATEC CAN do for them\n4. If the matter genuinely requires professional review, recommend it.\nDo NOT produce a structured analysis for an out-of-scope request.`

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: guardedMessages.map(m => ({ role: m.role, content: m.content }))
        })

        const assistantMessage = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n')

        await saveMessages(supabase, leadId, lastUserMsg.content, assistantMessage)

        return NextResponse.json({
          success: true,
          message: assistantMessage,
          guardTriggered: category,
          sessionState: trackEvasion(sessionState, category === 'evasion'),
        })
      }

      // Track evasion even if first attempt was soft-redirected
      if (guardResults.some(r => r.category === 'evasion')) {
        const updatedState = trackEvasion(sessionState, true)
        // First evasion attempt: redirect (handled above as soft_block initially,
        // but evasion is hard_block — so this path means no evasion detected this time)
      }
    }

    // ─── NORMAL FLOW: no guard triggered ───
    const systemPrompt = buildSystemPrompt(intake, lang)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })

    const assistantMessage = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n')

    await saveMessages(supabase, leadId, lastUserMsg?.content, assistantMessage)

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionState,
      usage: { input_tokens: response.usage.input_tokens, output_tokens: response.usage.output_tokens },
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}

async function saveMessages(supabase, leadId, userContent, assistantContent) {
  if (!leadId) return
  try {
    const { data: convo } = await supabase
      .from('conversations')
      .select('id, message_count')
      .eq('lead_id', leadId)
      .single()

    if (convo) {
      if (userContent) {
        await supabase.from('messages').insert({ conversation_id: convo.id, role: 'user', content: userContent })
      }
      await supabase.from('messages').insert({ conversation_id: convo.id, role: 'assistant', content: assistantContent })
      await supabase.from('conversations').update({ message_count: (convo.message_count || 0) + 2 }).eq('id', convo.id)
    }
  } catch (e) { console.error('Save messages error:', e) }
}
