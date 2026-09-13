'use client';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { waLink, WA_MESSAGES } from '@/lib/whatsapp';

export function AskSrivani({ wa, compact = false }) {
  const [need, setNeed] = useState('');
  const href = waLink(wa, WA_MESSAGES.ask(need.trim()));
  return (
    <section className={compact ? '' : 'py-12 sm:py-16'} data-testid="ask-srivani-section">
      <div className={compact ? '' : 'container-x'}>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-paper shadow-lift sm:px-12 sm:py-14">
          <div className="grain absolute inset-0" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow !text-amber-300">Can't find something?</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">Ask Srivani</h2>
              <p className="mt-3 max-w-md text-stone-300">Tell us what you need and we'll find it for you — books, guides, stationery or anything for school. We reply on WhatsApp.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); window.open(href, '_blank', 'noopener'); }} className="flex flex-col gap-3 sm:flex-row">
              <input value={need} onChange={(e) => setNeed(e.target.value)} placeholder="e.g. Class 8 Telugu guide, TSPSC Group 2 book..." className="input !border-stone-700 !bg-stone-900 !text-paper placeholder:!text-stone-500 sm:flex-1" data-testid="ask-srivani-input" />
              <button type="submit" className="btn-wa" data-testid="ask-srivani-whatsapp-button"><MessageCircle size={18} /> WhatsApp Srivani</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
