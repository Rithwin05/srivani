'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

export function AdminLogin({ deniedEmail }) {
  const router = useRouter();
  const processed = useRef(false);
  const [status, setStatus] = useState(() => (typeof window !== 'undefined' && window.location.hash.includes('session_id=') ? 'processing' : 'idle'));
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('session_id=') || processed.current) return;
    processed.current = true;
    const sessionId = new URLSearchParams(hash.slice(1)).get('session_id');
    fetch('/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }), credentials: 'include' })
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || 'Login failed'); window.history.replaceState(null, '', '/admin'); router.refresh(); })
      .catch((e) => { setError(e.message); setStatus('idle'); });
  }, [router]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/admin';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-16" data-testid="admin-login-page">
      <div className="card w-full max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-ink text-brass"><LockKeyhole /></span>
        <p className="eyebrow mt-5">Srivani Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold">Store counter login</h1>
        {status === 'processing' ? (
          <p className="mt-6 text-sm text-stone-600" data-testid="admin-login-processing">Signing you in…</p>
        ) : (
          <>
            <p className="mt-3 text-sm text-stone-600">Sign in with the store's Google account to manage products, offers and enquiries.</p>
            {deniedEmail && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="admin-login-denied">{deniedEmail} is not an admin account. Ask the owner to add it in ADMIN_EMAILS.</p>}
            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="admin-login-error">{error}</p>}
            <button onClick={login} className="btn-brass mt-6 w-full" data-testid="admin-google-login-button">Continue with Google</button>
            {deniedEmail && <form action="/auth/logout" method="post" className="mt-3"><button className="text-xs text-stone-500 underline" data-testid="admin-switch-account">Switch account</button></form>}
          </>
        )}
      </div>
    </div>
  );
}
