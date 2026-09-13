import Link from 'next/link';
import { MapPin, MessageCircle, Phone, Search } from 'lucide-react';
import { directionsLink, telLink, waLink, WA_MESSAGES } from '@/lib/whatsapp';

export function MobileBar({ settings }) {
  const items = [
    ['Call', Phone, telLink(settings.phone), false],
    ['WhatsApp', MessageCircle, waLink(settings.whatsapp, WA_MESSAGES.ask('')), true],
    ['Directions', MapPin, directionsLink(settings.mapsQuery), true],
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-stone-800 bg-ink text-[11px] font-medium text-stone-300 md:hidden" data-testid="mobile-bottom-bar">
      {items.map(([l, Icon, href, ext]) => (
        <a key={l} href={href} target={ext ? '_blank' : undefined} rel={ext ? 'noopener' : undefined} className="flex flex-col items-center gap-1 py-2.5 active:bg-stone-800" data-testid={`mobile-bar-${l.toLowerCase()}`}><Icon size={18} className={l === 'WhatsApp' ? 'text-wa' : ''} />{l}</a>
      ))}
      <Link href="/catalogue" className="flex flex-col items-center gap-1 py-2.5 active:bg-stone-800" data-testid="mobile-bar-search"><Search size={18} />Search</Link>
    </nav>
  );
}
