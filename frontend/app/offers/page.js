import { OfferCard } from '@/components/site/Sections';
import { AskSrivani } from '@/components/site/AskSrivani';
import { getOffers, getSettings } from '@/lib/store';

export const revalidate = 60;
export const metadata = { title: 'Offers – Today at Srivani', description: 'Current offers and combos at Srivani Book Stall, Karimnagar.' };

export default async function OffersPage() {
  const [offers, settings] = await Promise.all([getOffers(), getSettings()]);
  return (
    <div className="container-x py-10" data-testid="offers-page">
      <p className="eyebrow">🔥 Today's offers</p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">At Srivani today</h1>
      {offers.length ? <div className="stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{offers.map((o) => <OfferCard key={o.id} offer={o} wa={settings.whatsapp} />)}</div> : <p className="mt-8 text-stone-600">No offers right now — check back soon or ask at the counter.</p>}
      <div className="mt-12"><AskSrivani wa={settings.whatsapp} compact /></div>
    </div>
  );
}
