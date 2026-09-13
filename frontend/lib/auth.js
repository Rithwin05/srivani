import 'server-only';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { getDb } from './db';

export function isAdminEmail(email) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(String(email || '').toLowerCase());
}

export async function getSessionUser() {
  const token = (await cookies()).get('session_token')?.value;
  if (!token) return null;
  const db = await getDb();
  const session = await db.collection('sessions').findOne({ sessionToken: token }, { projection: { _id: 0 } });
  if (!session || new Date(session.expiresAt) < new Date()) return null;
  return db.collection('users').findOne({ userId: session.userId }, { projection: { _id: 0 } });
}

export async function getAdminUser() {
  const user = await getSessionUser();
  return user && isAdminEmail(user.email) ? user : null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

// Exchanges an Emergent session_id for user data + persistent session (server-side only).
export async function exchangeSessionId(sessionId) {
  const res = await fetch('https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data', {
    headers: { 'X-Session-ID': sessionId },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Invalid session');
  const data = await res.json();
  const db = await getDb();
  const existing = await db.collection('users').findOne({ email: data.email }, { projection: { _id: 0 } });
  const userId = existing?.userId || `user_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
  await db.collection('users').updateOne(
    { email: data.email },
    { $set: { name: data.name, picture: data.picture, updatedAt: new Date() }, $setOnInsert: { userId, email: data.email, createdAt: new Date() } },
    { upsert: true }
  );
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.collection('sessions').insertOne({ userId, sessionToken: data.session_token, expiresAt, createdAt: new Date() });
  return { token: data.session_token, expiresAt, email: data.email, isAdmin: isAdminEmail(data.email) };
}
