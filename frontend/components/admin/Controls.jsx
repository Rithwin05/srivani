'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteProductAction, toggleFlagAction, setEnquiryStatusAction, seedDemoAction, deleteOfferAction } from '@/app/actions/admin';

export function FlagToggle({ id, flag, value, label }) {
  const [on, setOn] = useState(!!value);
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} onClick={() => start(async () => { setOn(!on); await toggleFlagAction(id, flag, !on); })} title={label}
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${on ? 'bg-forest text-white' : 'bg-cream text-stone-500 hover:bg-line'}`} data-testid={`flag-${flag}-${id}`}>{label}</button>
  );
}

export function DeleteButton({ id, kind = 'product', label = 'Delete' }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} onClick={() => { if (!confirm(`Delete this ${kind}?`)) return; start(async () => { await (kind === 'offer' ? deleteOfferAction(id) : deleteProductAction(id)); router.refresh(); }); }}
      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline" data-testid={`delete-${kind}-${id}`}><Trash2 size={13} /> {label}</button>
  );
}

export function StatusSelect({ id, value }) {
  const router = useRouter();
  return (
    <select defaultValue={value} onChange={async (e) => { await setEnquiryStatusAction(id, e.target.value); router.refresh(); }} className="input !w-auto !py-1.5 text-xs" data-testid={`enquiry-status-${id}`}>
      {['new', 'contacted', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

export function SeedButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  return (
    <div className="flex items-center gap-3">
      <button disabled={pending} onClick={() => { if (!confirm('This replaces ALL products and offers with the demo catalogue. Continue?')) return; start(async () => { const r = await seedDemoAction(); setMsg(`Loaded ${r.count} demo products`); router.refresh(); }); }} className="btn-ghost !py-2 text-xs" data-testid="admin-seed-demo-button">{pending ? 'Loading…' : 'Reset demo catalogue'}</button>
      {msg && <span className="text-xs text-forest">{msg}</span>}
    </div>
  );
}
