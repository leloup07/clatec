import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { computeEscalationFlags, computeComplexityScore } from '@/lib/system-prompt'
// import { Resend } from 'resend'

// const resend = new Resend(process.env.RESEND_API_KEY)

// Map frontend matter type labels to enum values
const MATTER_TYPE_MAP = {
  'Asset tokenization': 'asset_tokenization',
  'Tokenización de activos': 'asset_tokenization',
  'Token issuance': 'token_issuance',
  'Emisión de tokens': 'token_issuance',
  'MiCA-related assessment': 'mica_assessment',
  'Evaluación MiCA': 'mica_assessment',
  'CASP-related issue': 'casp_issue',
  'Cuestión CASP': 'casp_issue',
  'Governance / compliance': 'governance_compliance',
  'Gobernanza / compliance': 'governance_compliance',
  'Cross-border structuring': 'cross_border_structuring',
  'Estructuración transfronteriza': 'cross_border_structuring',
  'Sandbox / regulatory innovation': 'sandbox_regulatory_innovation',
  'Sandbox / innovación regulatoria': 'sandbox_regulatory_innovation',
  'Other': 'other',
  'Otro': 'other',
}

const STAGE_MAP = {
  'Early idea': 'early_idea', 'Idea temprana': 'early_idea',
  'Structuring phase': 'structuring_phase', 'Fase de estructuración': 'structuring_phase',
  'Documentation in progress': 'documentation_in_progress', 'Documentación en curso': 'documentation_in_progress',
  'Ready to launch': 'ready_to_launch', 'Listo para lanzar': 'ready_to_launch',
  'Already operating': 'already_operating', 'Ya operando': 'already_operating',
}

const URGENCY_MAP = {
  'Low': 'low', 'Baja': 'low',
  'Medium': 'medium', 'Media': 'medium',
  'High': 'high', 'Alta': 'high',
}

export async function POST(request) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    // Compute internal scoring
    const escalationFlags = computeEscalationFlags(body)
    const complexityScore = computeComplexityScore(body, escalationFlags)

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        first_name: body.firstName,
        last_name: body.lastName || null,
        email: body.email,
        company: body.company || null,
        role_position: body.role || null,
        country_residence: body.country || null,
        main_jurisdiction: body.mainJurisdiction || null,
        other_jurisdictions: body.otherJurisdictions || null,
        matter_type: MATTER_TYPE_MAP[body.matterType] || 'other',
        project_stage: STAGE_MAP[body.projectStage] || null,
        objective: body.objective || null,
        description: body.description,
        urgency: URGENCY_MAP[body.urgency] || 'medium',
        complexity_score: complexityScore,
        escalation_flag: escalationFlags.length > 0,
        consultation_intent: escalationFlags.length >= 3 ? 8 : escalationFlags.length >= 1 ? 5 : 2,
        language: body.language || 'en',
      })
      .select()
      .single()

    if (leadError) throw leadError

    // Insert conditional intake data based on matter type
    const matterKey = MATTER_TYPE_MAP[body.matterType]
    
    if (matterKey === 'asset_tokenization' || matterKey === 'token_issuance') {
      await supabase.from('intake_tokenization').insert({
        lead_id: lead.id,
        asset_type: body.assetType || null,
        economic_return: body.economicReturn || null,
        investors_expected: body.investorsExpected || null,
        investor_type: body.investorType || null,
        issuance_size: body.issuanceSize || null,
        entity_exists: body.entityExists || null,
        documentation_exists: body.docsExist || null,
      })
    }

    if (matterKey === 'mica_assessment') {
      await supabase.from('intake_mica').insert({
        lead_id: lead.id,
        intended_token_type: body.tokenType || null,
        refers_to_assets: body.refersToAssets || null,
        stable_value: body.stableValue || null,
        crypto_services: body.cryptoServices || null,
        target_jurisdictions: body.targetJurisdictions || null,
        public_marketing: body.publicMarketing || null,
      })
    }

    if (matterKey === 'casp_issue') {
      await supabase.from('intake_casp').insert({
        lead_id: lead.id,
        service_type: body.serviceType || null,
        custody_involved: body.custodyInvolved || null,
        exchange_involved: body.exchangeInvolved || null,
        advisory_involved: body.advisoryInvolved || null,
        client_type: body.clientType || null,
        incorporation_place: body.incorporation || null,
      })
    }

    if (matterKey === 'sandbox_regulatory_innovation') {
      await supabase.from('intake_sandbox').insert({
        lead_id: lead.id,
        target_sandbox: body.targetSandbox || null,
        innovation_element: body.innovationElement || null,
        regulatory_barrier: body.regulatoryBarrier || null,
        mvp_exists: body.mvpExists || null,
        intended_market: body.intendedMarket || null,
        supervisory_angle: body.supervisoryAngle || null,
      })
    }

    // Log consents
    const consents = ['privacy_policy', 'terms_of_use', 'preliminary_guidance_disclaimer']
    for (const consent of consents) {
      await supabase.from('consent_log').insert({
        lead_id: lead.id,
        consent_type: consent,
        version: '1.0',
        accepted: true,
      })
    }

    // Create conversation record
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      message_count: 0,
      escalation_recommended: escalationFlags.length > 0,
      escalation_reasons: escalationFlags,
    })

    // Log analytics event
    await supabase.from('analytics_events').insert({
      event_type: 'intake_completed',
      lead_id: lead.id,
      metadata: { matter_type: matterKey, escalation_flags: escalationFlags, complexity_score: complexityScore },
    })

    // TODO: Send confirmation email via Resend
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL,
    //   to: body.email,
    //   subject: 'CLATEC — Intake Confirmation',
    //   html: `...`
    // })

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id, 
      escalationFlags,
      complexityScore,
    })

  } catch (error) {
    console.error('Intake submission error:', error)
    return NextResponse.json({ error: 'Failed to submit intake' }, { status: 500 })
  }
}
