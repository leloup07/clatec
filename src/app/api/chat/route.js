import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { buildSystemPrompt } from '@/lib/system-prompt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { leadId, messages, intake, language } = await request.json()
    const supabase = createServerClient()

    // Build system prompt with intake context
    const systemPrompt = buildSystemPrompt(intake, language || 'en')

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    const assistantMessage = response.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('\n')

    // Save message to database
    if (leadId) {
      // Get conversation ID
      const { data: convo } = await supabase
        .from('conversations')
        .select('id, message_count')
        .eq('lead_id', leadId)
        .single()

      if (convo) {
        // Save user message (last in the array)
        const lastUserMsg = messages[messages.length - 1]
        if (lastUserMsg?.role === 'user') {
          await supabase.from('messages').insert({
            conversation_id: convo.id,
            role: 'user',
            content: lastUserMsg.content,
          })
        }

        // Save assistant response
        await supabase.from('messages').insert({
          conversation_id: convo.id,
          role: 'assistant',
          content: assistantMessage,
        })

        // Update message count
        await supabase
          .from('conversations')
          .update({ message_count: convo.message_count + 2 })
          .eq('id', convo.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
