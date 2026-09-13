'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { SORTS } from '@/lib/taxonomy';

const GROUPS = [['category', 'Category'], ['subcategory', 'Subcategory'], ['class', 'Class'], ['subject', 'Subject'], ['exam', 'Exam'], ['author', 'Author'], ['publisher', 'Publisher']];
const FACET_KEY = { class: 'className' };

function useHrefBuilder() {
  const pathname = usePathname();
  const sp = useSearchParams();
  return (changes) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    p.delete('page');
    const s = p.toString();
    return s ? `${pathname}?${s}` : pathname;
  };
}

export function SortSelect() {
  const router = useRouter();
  const sp = useSearchParams();
  const build = useHrefBuilder();
  return (
    <label className="flex items-center gap-2 text-sm text-stone-600">Sort
      <select value={sp.get('sort') || 'popular'} onChange={(e) => router.push(build({ sort: e.target.value }))} className="input !w-auto !py-2" data-testid="sort-select">
        {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </label>
  );
}

export function Filters({ facets, preset = {} }) {
  const sp = useSearchParams();
  const router = useRouter();
  const build = useHrefBuilder();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({ category: true, class: true, exam: true, subcategory: true });
  const active = GROUPS.filter(([k]) => sp.get(k)).map(([k, l]) => [k, l, sp.get(k)]);
  const hidden = new Set(Object.keys(preset).map((k) => (k === 'className' ? 'class' : k)));
  const submitPrice = (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); router.push(build({ min: f.get('min'), max: f.get('max') })); };
  return (
    <aside data-testid="catalogue-filters">
      <button onClick={() => setOpen(!open)} className="btn-ghost mb-4 w-full lg:hidden" data-testid="filters-toggle"><SlidersHorizontal size={16} /> Filters {active.length ? `(${active.length})` : ''}</button>
      <div className={`${open ? 'block' : 'hidden'} space-y-5 lg:block`}>
        {(active.length > 0 || sp.get('min') || sp.get('max')) && (
          <div className="flex flex-wrap gap-2" data-testid="active-filters">
            {active.map(([k, l, v]) => <Link key={k} href={build({ [k]: '' })} className="inline-flex items-center gap-1 rounded-full bg-brass-light px-3 py-1 text-xs font-semibold text-brass-dark" data-testid={`active-filter-${k}`}>{l}: {v} <X size={12} /></Link>)}
            {(sp.get('min') || sp.get('max')) && <Link href={build({ min: '', max: '' })} className="inline-flex items-center gap-1 rounded-full bg-brass-light px-3 py-1 text-xs font-semibold text-brass-dark">₹{sp.get('min') || 0}–{sp.get('max') || '∞'} <X size={12} /></Link>}
            <Link href={build({ category: '', subcategory: '', class: '', subject: '', exam: '', author: '', publisher: '', min: '', max: '' })} className="text-xs font-semibold text-stone-500 underline" data-testid="clear-filters">Clear all</Link>
          </div>
        )}
        {GROUPS.filter(([k]) => !hidden.has(k)).map(([k, label]) => {
          const list = facets[FACET_KEY[k] || k] || [];
          if (!list.length) return null;
          const isOpen = expanded[k];
          return (
            <div key={k} className="border-b border-line pb-4" data-testid={`filter-group-${k}`}>
              <button onClick={() => setExpanded({ ...expanded, [k]: !isOpen })} className="flex w-full items-center justify-between py-1 text-sm font-bold text-ink">{label} <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
              {isOpen && (
                <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1 text-sm">
                  {list.map((f) => {
                    const on = sp.get(k) === f.value;
                    return <li key={f.value}><Link href={build({ [k]: on ? '' : f.value })} className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${on ? 'bg-brass text-white' : 'text-stone-700 hover:bg-cream'}`} data-testid={`filter-${k}-${f.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}><span className="truncate">{f.value}</span><span className={`ml-2 text-xs ${on ? 'text-white/80' : 'text-stone-400'}`}>{f.count}</span></Link></li>;
                  })}
                </ul>
              )}
            </div>
          );
        })}
        <form onSubmit={submitPrice} className="space-y-2" data-testid="filter-price">
          <p className="text-sm font-bold">Price (₹)</p>
          <div className="flex items-center gap-2">
            <input name="min" type="number" min="0" defaultValue={sp.get('min') || ''} placeholder="Min" className="input !py-2" data-testid="price-min" />
            <span className="text-stone-400">–</span>
            <input name="max" type="number" min="0" defaultValue={sp.get('max') || ''} placeholder="Max" className="input !py-2" data-testid="price-max" />
          </div>
          <button className="btn-ghost w-full !py-2 text-xs" data-testid="price-apply">Apply</button>
        </form>
      </div>
    </aside>
  );
}
