import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, checkPassword, createSessionValue, isAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET → is the current browser logged in?
export async function GET() {
  return NextResponse.json({ authenticated: isAdmin() })
}

// POST { password } → login
export async function POST(request) {
  let password = ''
  try { ({ password } = await request.json()) } catch { /* empty body */ }

  if (!checkPassword(password)) {
    // Slow down brute-force attempts
    await new Promise(r => setTimeout(r, 1000))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const { value, maxAge } = createSessionValue()
  const res = NextResponse.json({ authenticated: true })
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge,
  })
  return res
}

// DELETE → logout
export async function DELETE() {
  const res = NextResponse.json({ authenticated: false })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
  return res
}
