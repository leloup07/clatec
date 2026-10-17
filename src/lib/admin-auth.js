import 'server-only'
import { createHmac, createHash, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Server-side admin authentication.
// ADMIN_PASSWORD and ADMIN_SESSION_SECRET are server-only env vars (no NEXT_PUBLIC_
// prefix), so they never reach the browser. A successful login sets an HttpOnly,
// Secure, SameSite=Strict cookie holding "<expiry>.<HMAC(expiry)>".

export const ADMIN_COOKIE = 'clatec_admin'
const SESSION_HOURS = 8

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 32) throw new Error('ADMIN_SESSION_SECRET missing or shorter than 32 chars')
  return s
}

function sign(value) {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

function safeEqual(a, b) {
  // Hash first so both buffers have the same length
  const ha = createHash('sha256').update(String(a)).digest()
  const hb = createHash('sha256').update(String(b)).digest()
  return timingSafeEqual(ha, hb)
}

export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || expected.length < 12) return false
  return safeEqual(candidate || '', expected)
}

export function createSessionValue() {
  const exp = String(Date.now() + SESSION_HOURS * 3600 * 1000)
  return { value: `${exp}.${sign(exp)}`, maxAge: SESSION_HOURS * 3600 }
}

export function isValidSession(value) {
  if (!value || typeof value !== 'string') return false
  const [exp, sig] = value.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp)) return false
  if (Number(exp) < Date.now()) return false
  return safeEqual(sig, sign(exp))
}

export function isAdmin() {
  try {
    return isValidSession(cookies().get(ADMIN_COOKIE)?.value)
  } catch {
    return false
  }
}
