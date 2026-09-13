import Link from 'next/link';
import { Suspense } from 'react';
import { BookOpenText, MessageCircle, Phone } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { waLink, telLink, WA_MESSAGES } from '@/lib/whatsapp';

const NAV = [
  ['Catalogue', '/catalogue'], ['Books', '/books'], ['Stationery', '/stationery'], ['Exams', '/books/competitive-exams'], ['Offers', '/offers'], ['School List', '/school-list'], ['Visit', '/visit'],
];

export function Header({ settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md" data-testid="site-header">
      <div className="hidden bg-ink text-[12px] text-stone-300 md:block">
        <div className="container-x flex h-8 items-center justify-between">
          <span>📍 Beside Alphors College, Jagtial Road, Karimnagar · {settings.hours}</span>
          <a href={telLink(settings.phone)} className="hover:text-white" data-testid="topbar-phone">📞 {settings.phone}</a>
        </div>
      </div>
      <div className="container-x flex h-16 items-center gap-3 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" data-testid="site-logo">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brass text-white shadow-book"><BookOpenText size={20} /></span>
          <span className="leading-none">
            <span className="block font-serif text-xl font-bold tracking-tight">Srivani</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[.25em] text-stone-500">Book Stall</span>
          </span>
        </Link>
        <div className="hidden flex-1 md:block"><Suspense><SearchBar compact /></Suspense></div>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" data-testid="main-nav">
          {NAV.map(([l, h]) => <Link key={h} href={h} className="rounded-full px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-cream hover:text-ink">{l}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a href={telLink(settings.phone)} className="btn-ghost hidden !px-3 sm:inline-flex md:hidden" aria-label="Call"><Phone size={16} /></a>
          <a href={waLink(settings.whatsapp, WA_MESSAGES.ask(''))} target="_blank" rel="noopener" className="btn-wa !py-2" data-testid="header-whatsapp-button"><MessageCircle size={16} /> <span className="hidden sm:inline">WhatsApp</span></a>
        </div>
      </div>
      <div className="container-x pb-3 md:hidden"><Suspense><SearchBar compact /></Suspense></div>
    </header>
  );
}
