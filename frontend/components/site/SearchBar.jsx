'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

const HINTS = ['Class 10 maths', 'Navneet', 'SSC', 'A4 notebook', 'Telugu novel', 'R.S. Aggarwal', 'TSPSC Group 4'];

export function SearchBar({ compact = false, autoFocus = false }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const submit = (e) => { e.preventDefault(); router.push(`/catalogue${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); };
  return (
    <div className="w-full">
      <form onSubmit={submit} role="search" className={`group relative flex items-center rounded-full border bg-white transition-shadow ${compact ? 'border-line-strong shadow-sm focus-within:shadow-book' : 'border-line-strong p-1.5 shadow-lift focus-within:ring-4 focus-within:ring-brass/20'}`}>
        <Search className={`ml-4 shrink-0 text-stone-400 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
        <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus={autoFocus} placeholder="Search books, authors, publishers, stationery..." aria-label="Search products"
          className={`w-full bg-transparent px-3 text-ink placeholder:text-stone-400 focus:outline-none ${compact ? 'h-10 text-sm' : 'h-12 text-base sm:h-14 sm:text-lg'}`} data-testid={compact ? 'header-search-input' : 'hero-search-input'} />
        <button type="submit" className={compact ? 'btn-brass !px-4 !py-2 mr-1 text-xs whitespace-nowrap' : 'btn-brass whitespace-nowrap'} data-testid={compact ? 'header-search-submit' : 'hero-search-submit'}>{compact ? 'Go' : 'Find it'}</button>
      </form>
      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span>Try:</span>
          {HINTS.map((h) => <button key={h} type="button" onClick={() => router.push(`/catalogue?q=${encodeURIComponent(h)}`)} className="rounded-full border border-line bg-white/70 px-3 py-1 text-stone-700 transition-colors hover:border-brass hover:text-brass-dark" data-testid={`search-hint-${h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{h}</button>)}
        </div>
      )}
    </div>
  );
}
