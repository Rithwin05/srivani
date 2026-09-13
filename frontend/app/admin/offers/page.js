import { getOffers, getSettings } from '@/lib/store';
import { OfferForm, BannerForm } from '@/components/admin/OfferForms';
import { DeleteButton } from '@/components/admin/Controls';
import { formatPrice } from '@/lib/whatsapp';

export default async function AdminOffers() {
  const [offers, settings] = await Promise.all([getOffers(false), getSettings()]);
  return (
    <div data-testid="admin-offers">
      <p className="eyebrow">Marketing</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Offers & seasonal banner</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-bold">Seasonal homepage banner</h2>
          <BannerForm settings={settings} />
        </div>
        <div className="space-y-4">
          <h2 className="font-bold">Add offer</h2>
          <OfferForm />
        </div>
      </div>
      <h2 className="mt-10 font-bold">Current offers ({offers.length})</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <details key={o.id} className="card p-5" data-testid={`admin-offer-${o.id}`}>
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{o.title} {!o.active && <span className="ml-1 rounded bg-cream px-1.5 text-[10px] text-stone-500">hidden</span>}</p><p className="text-xs text-stone-500">{o.subtitle}</p></div><span className="font-bold">{o.price ? formatPrice(o.price) : ''}</span></div>
              <div className="mt-2 flex gap-3 text-xs"><span className="text-brass-dark">Edit ▾</span><DeleteButton id={o.id} kind="offer" /></div>
            </summary>
            <div className="mt-4"><OfferForm offer={o} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
