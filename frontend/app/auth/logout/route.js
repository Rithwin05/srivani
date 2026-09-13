import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';

export async function POST() {
  const token = (await cookies()).get('session_token')?.value;
  if (token) (await getDb()).collection('sessions').deleteOne({ sessionToken: token }).catch(() => {});
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session_token', '', { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 0 });
  return res;
}
