'use client';
import { useState } from 'react';
import { MessageCircle, Upload, CheckCircle2 } from 'lucide-react';
import { submitEnquiry } from '@/app/actions/enquiries';

export function EnquiryForm({ type, fields, submitLabel = 'Send to Srivani on WhatsApp', accept, note }) {
  const [state, setState] = useState({ loading: false, error: '', done: null });
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('type', type);
    setState({ loading: true, error: '', done: null });
    const res = await submitEnquiry(fd);
    if (res.error) return setState({ loading: false, error: res.error, done: null });
    setState({ loading: false, error: '', done: res.whatsapp });
    window.open(res.whatsapp, '_blank', 'noopener');
  };
  if (state.done) {
    return (
      <div className="card p-8 text-center" data-testid="enquiry-success">
        <CheckCircle2 className="mx-auto text-wa" size={44} />
        <h3 className="mt-4 font-serif text-2xl font-bold">Received at the counter!</h3>
        <p className="mt-2 text-sm text-stone-600">We've saved your enquiry. If WhatsApp didn't open, tap below.</p>
        <a href={state.done} target="_blank" rel="noopener" className="btn-wa mt-6" data-testid="enquiry-whatsapp-link"><MessageCircle size={16} /> Open WhatsApp</a>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" data-testid={`enquiry-form-${type}`}>
      {fields.map((f) => (
        <div key={f.name}>
          <label className="label" htmlFor={`${type}-${f.name}`}>{f.label}{f.required && ' *'}</label>
          {f.type === 'textarea' ? (
            <textarea id={`${type}-${f.name}`} name={f.name} rows={f.rows || 5} required={f.required} placeholder={f.placeholder} className="input" data-testid={`enquiry-${f.name}`} />
          ) : (
            <input id={`${type}-${f.name}`} name={f.name} type={f.type || 'text'} required={f.required} placeholder={f.placeholder} className="input" data-testid={`enquiry-${f.name}`} />
          )}
        </div>
      ))}
      {accept && (
        <div>
          <label className="label" htmlFor={`${type}-file`}><Upload size={12} className="mr-1 inline" /> Upload photo or PDF (optional)</label>
          <input id={`${type}-file`} name="file" type="file" accept={accept} className="input !py-2 file:mr-3 file:rounded-full file:border-0 file:bg-brass-light file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brass-dark" data-testid="enquiry-file" />
          {note && <p className="mt-1 text-xs text-stone-500">{note}</p>}
        </div>
      )}
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="enquiry-error">{state.error}</p>}
      <button disabled={state.loading} className="btn-wa w-full disabled:opacity-60" data-testid="enquiry-submit"><MessageCircle size={18} /> {state.loading ? 'Sending…' : submitLabel}</button>
    </form>
  );
}
