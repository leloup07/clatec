import 'server-only'
import Stripe from 'stripe'

let client
export function getStripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY)
  return client
}

export const TIER_PRICES = {
  standard: { amount: 45000, label_en: 'Structured Review', label_es: 'Revisión Estructurada' },
  complex: { amount: 75000, label_en: 'Complex Matter Review', label_es: 'Revisión de Asunto Complejo' },
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
