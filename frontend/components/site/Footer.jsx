import Link from 'next/link';
import { BookOpenText, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SERVICES } from '@/lib/taxonomy';
import { directionsLink, telLink, waLink, WA_MESSAGES } from '@/lib/whatsapp';

const COLS = [
  ['Explore', [['Catalogue', '/catalogue'], ['School Books', '/books/school'], ['Competitive Exams', '/books/competitive-exams'], ['Stationery', '/stationery'], ['New Arrivals', '/catalogue?flag=new'], ['Offers', '/offers']]],
  ['Customer Tools', [['Ask Srivani', '/ask-srivani'], ['School List Upload', '/school-list'], ['Bulk Enquiry', '/bulk-enquiry'], ['Visit the Store', '/visit'], ['About Srivani', '/about']]],
];

export function Footer({ settings }) {
  return (
    <footer className="mt-16 bg-ink text-stone-300" data-testid="site-footer">
      <div className="h-3 shelf-wood" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-paper"><BookOpenText className="text-brass" /> <span className="font-serif text-2xl font-bold">Srivani Book Stall</span></div>
          <p className="mt-3 text-sm">Books | Stationery | Education | Services</p>
          <p className="mt-4 font-serif text-lg text-amber-200">{settings.teluguTagline}</p>
          <p className="mt-4 text-xs text-stone-500">Serving Karimnagar since {settings.established}</p>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <p className="eyebrow !text-stone-500">{h}</p>
            <ul className="mt-4 space-y-2 text-sm">{links.map(([l, href]) => <li key={href}><Link href={href} className="hover:text-white">{l}</Link></li>)}</ul>
          </div>
        ))}
        <div>
          <p className="eyebrow !text-stone-500">Services</p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs">{SERVICES.map((s) => <li key={s} className="rounded-full border border-stone-700 px-3 py-1">{s}</li>)}</ul>
          <p className="eyebrow mt-6 !text-stone-500">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={telLink(settings.phone)} className="flex items-center gap-2 hover:text-white"><Phone size={14} /> {settings.phone}</a></li>
            <li><a href={waLink(settings.whatsapp, WA_MESSAGES.ask(''))} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white"><MessageCircle size={14} /> WhatsApp</a></li>
            <li><a href={directionsLink(settings.mapsQuery)} target="_blank" rel="noopener" className="flex items-start gap-2 hover:text-white"><MapPin size={14} className="mt-1 shrink-0" /> <span>{settings.address}</span></a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} Srivani Book Stall, Karimnagar · <Link href="/admin" className="hover:text-stone-300">Admin</Link></div>
    </footer>
  );
}
