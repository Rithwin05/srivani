import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/site/SearchBar';
import { ProductRow } from '@/components/site/ProductRow';
import { AskSrivani } from '@/components/site/AskSrivani';
import { ShopByNeed, ShopByClassExam, DigitalShelves } from '@/components/site/Discover';
import { StoreStats, SeasonalBanner, OffersSection, VisitSection } from '@/components/site/Sections';
import { getHomeData } from '@/lib/products';
import { getSettings, getOffers } from '@/lib/store';
import { directionsLink, telLink, waLink, WA_MESSAGES } from '@/lib/whatsapp';

export const revalidate = 60;

const HERO_IMG = 'https://images.unsplash.com/photo-1601469090980-fc95e8d95544?crop=entropy&cs=srgb&fm=jpg&q=70&w=1600';

export default async function HomePage() {
  const [data, settings, offers] = await Promise.all([getHomeData(), getSettings(), getOffers()]);
  const wa = settings.whatsapp;
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper" data-testid="hero-section">
        <Image src={HERO_IMG} alt="Bookshelves inside a bookstore" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
        <div className="container-x relative pb-20 pt-14 sm:pb-28 sm:pt-20">
          <div className="max-w-3xl animate-rise">
            <p className="eyebrow !text-amber-300">Karimnagar · Since {settings.established} · <span className="font-serif normal-case tracking-normal text-amber-100">{settings.teluguTagline}</span></p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">Srivani Book Stall</h1>
            <p className="mt-4 max-w-xl text-base text-stone-300 sm:text-lg">{settings.tagline}</p>
          </div>
          <div className="mt-8 max-w-2xl animate-rise [animation-delay:.15s]">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-200"><Sparkles size={16} /> What are you looking for today?</p>
            <Suspense><SearchBar /></Suspense>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:.3s]">
            <Link href="/catalogue" className="btn-brass" data-testid="hero-explore-button">Explore {settings.statProducts} Products</Link>
            <a href={waLink(wa, WA_MESSAGES.ask(''))} target="_blank" rel="noopener" className="btn-wa" data-testid="hero-ask-button"><MessageCircle size={16} /> Ask Srivani</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-stone-300">
            <a href={telLink(settings.phone)} className="flex items-center gap-2 hover:text-white" data-testid="hero-call-link"><Phone size={15} className="text-brass" /> Call</a>
            <a href={waLink(wa, WA_MESSAGES.ask(''))} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white"><MessageCircle size={15} className="text-wa" /> WhatsApp</a>
            <a href={directionsLink(settings.mapsQuery)} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white" data-testid="hero-directions-link"><MapPin size={15} className="text-amber-300" /> Directions</a>
          </div>
        </div>
      </section>
      <StoreStats settings={settings} total={data.total} />
      <ShopByNeed />
      <ProductRow id="trending" eyebrow="🔥 Trending now" title="Popular this week" href="/catalogue?flag=trending" products={data.trending} wa={wa} />
      <DigitalShelves />
      <SeasonalBanner settings={settings} />
      <ShopByClassExam />
      <ProductRow id="picks" eyebrow="⭐ Srivani Picks" title="Our staff recommends" href="/catalogue?flag=picks" products={data.picks} wa={wa} />
      <ProductRow id="new" eyebrow="New arrivals" title="Fresh on the shelf" href="/catalogue?flag=new" products={data.newArrivals} wa={wa} />
      <OffersSection offers={offers} wa={wa} />
      <AskSrivani wa={wa} />
      <VisitSection settings={settings} />
    </>
  );
}
