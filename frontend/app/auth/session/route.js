import { NextResponse } from 'next/server';
import { exchangeSessionId } from '@/lib/auth';

export async function POST(req) {
  const { sessionId } = await req.json().catch(() => ({}));
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  try {
    const s = await exchangeSessionId(sessionId);
    const res = NextResponse.json({ ok: true, email: s.email, isAdmin: s.isAdmin });
    res.cookies.set('session_token', s.token, { httpOnly: true, secure: true, sameSite: 'none', path: '/', expires: s.expiresAt });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
