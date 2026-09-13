import Link from 'next/link';
import { MapPin, MessageCircle, Phone, Star, Clock } from 'lucide-react';
import { SERVICES } from '@/lib/taxonomy';
import { directionsLink, telLink, waLink, WA_MESSAGES, formatPrice } from '@/lib/whatsapp';

export function StoreStats({ settings, total }) {
  const years = new Date().getFullYear() - (settings.established || 2004);
  const items = [
    [settings.statProducts || `${total}+`, 'Products'],
    [settings.statCategories, 'Categories'],
    [`${years}+`, 'Years of Trust'],
    [`${settings.rating}★`, `${settings.reviewCount}+ Reviews`],
  ];
  return (
    <section className="container-x -mt-8 relative z-10" data-testid="store-stats">
      <div className="card grid grid-cols-2 divide-line sm:grid-cols-5 sm:divide-x">
        {items.map(([v, l]) => <div key={l} className="px-4 py-5 text-center"><p className="font-serif text-3xl font-bold text-ink">{v}</p><p className="eyebrow mt-1 !text-[10px]">{l}</p></div>)}
        <div className="col-span-2 flex items-center justify-center gap-2 border-t border-line px-4 py-4 text-sm sm:col-span-1 sm:border-t-0"><span className="h-2.5 w-2.5 rounded-full bg-wa" /> <span><span className="font-semibold text-forest">Open today</span><br /><span className="text-xs text-stone-500">{settings.hours}</span></span></div>
      </div>
    </section>
  );
}

export function SeasonalBanner({ settings }) {
  if (!settings.bannerActive) return null;
  return (
    <section className="py-8" data-testid="seasonal-banner">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-brass px-6 py-12 text-white shadow-lift sm:px-14 sm:py-16">
          <div className="grain absolute inset-0" />
          <div className="relative max-w-2xl">
            <p className="eyebrow !text-amber-100">🎒 This season at Srivani</p>
            <h2 className="mt-2 font-serif text-4xl font-bold sm:text-6xl">{settings.bannerTitle}</h2>
            <p className="mt-4 text-amber-50">{settings.bannerSubtitle}</p>
            <Link href={settings.bannerLink || '/catalogue'} className="btn-dark mt-6" data-testid="seasonal-banner-cta">{settings.bannerCta || 'Explore'}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OfferCard({ offer, wa }) {
  return (
    <div className="card flex flex-col p-6" data-testid={`offer-card-${offer.id}`}>
      {offer.badge && <span className="w-fit rounded-full bg-brass-light px-3 py-1 text-xs font-bold text-brass-dark">{offer.badge}</span>}
      <h3 className="mt-3 font-serif text-2xl font-bold text-ink">{offer.title}</h3>
      <p className="mt-1 text-sm text-stone-600">{offer.subtitle}</p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xl font-bold">{offer.price ? formatPrice(offer.price) : ''}</span>
        <a href={waLink(wa, WA_MESSAGES.offer(offer.title))} target="_blank" rel="noopener" className="btn-wa !py-2 text-xs" data-testid={`offer-enquire-${offer.id}`}><MessageCircle size={14} /> Enquire</a>
      </div>
    </div>
  );
}

export function OffersSection({ offers, wa }) {
  if (!offers.length) return null;
  return (
    <section className="py-12 sm:py-16" data-testid="offers-section">
      <div className="container-x">
        <p className="eyebrow mb-2">🔥 Today's offers</p>
        <h2 className="h2">At Srivani today</h2>
        <div className="stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{offers.slice(0, 3).map((o) => <OfferCard key={o.id} offer={o} wa={wa} />)}</div>
        <Link href="/offers" className="mt-6 inline-block text-sm font-semibold text-brass-dark hover:underline">All offers →</Link>
      </div>
    </section>
  );
}

export function VisitSection({ settings, full = false }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(settings.mapsQuery)}&output=embed`;
  return (
    <section className={full ? 'py-10' : 'py-12 sm:py-16'} id="visit" data-testid="visit-section">
      <div className="container-x grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">📍 Visit Srivani</p>
          <h2 className="h2">{full ? 'Find us on Jagtial Road' : 'Visit our store'}</h2>
          <p className="mt-4 flex items-start gap-3 text-stone-700"><MapPin className="mt-0.5 shrink-0 text-brass" size={18} /> {settings.address}</p>
          <p className="mt-3 flex items-center gap-3 text-stone-700"><Clock className="shrink-0 text-brass" size={18} /> {settings.hours}</p>
          <p className="mt-3 flex items-center gap-3 text-stone-700"><Star className="shrink-0 text-brass" size={18} /> {settings.rating} rating · <a href={settings.reviewsUrl} target="_blank" rel="noopener" className="underline underline-offset-2" data-testid="reviews-link">{settings.reviewCount}+ customer reviews</a></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={directionsLink(settings.mapsQuery)} target="_blank" rel="noopener" className="btn-brass" data-testid="visit-directions-button"><MapPin size={16} /> Get Directions</a>
            <a href={telLink(settings.phone)} className="btn-ghost" data-testid="visit-call-button"><Phone size={16} /> {settings.phone}</a>
            <a href={waLink(settings.whatsapp, WA_MESSAGES.ask(''))} target="_blank" rel="noopener" className="btn-wa" data-testid="visit-whatsapp-button"><MessageCircle size={16} /> WhatsApp</a>
          </div>
          <div id="services" className="mt-8">
            <p className="eyebrow">Services at the counter</p>
            <div className="mt-3 flex flex-wrap gap-2">{SERVICES.map((s) => <span key={s} className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-stone-700">{s}</span>)}</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line shadow-book"><iframe title="Srivani Book Stall map" src={mapSrc} loading="lazy" className="h-[320px] w-full lg:h-full" referrerPolicy="no-referrer-when-downgrade" /></div>
      </div>
    </section>
  );
}
