'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveOfferAction, saveSettingsAction } from '@/app/actions/admin';

function useSubmit(action) {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const onSubmit = async (e) => { e.preventDefault(); setMsg('Saving…'); const r = await action(new FormData(e.currentTarget)); setMsg(r.error || 'Saved ✓'); router.refresh(); };
  return [onSubmit, msg];
}

export function OfferForm({ offer = {} }) {
  const [onSubmit, msg] = useSubmit(saveOfferAction);
  const k = offer.id || 'new';
  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5" data-testid={`offer-form-${k}`}>
      <input type="hidden" name="id" value={offer.id || ''} />
      <div><label className="label">Title *</label><input name="title" required defaultValue={offer.title || ''} className="input" data-testid={`offer-title-${k}`} /></div>
      <div><label className="label">Subtitle</label><input name="subtitle" defaultValue={offer.subtitle || ''} className="input" data-testid={`offer-subtitle-${k}`} /></div>
      <div className="grid grid-cols-2 gap-3"><div><label className="label">Price (₹)</label><input name="price" type="number" defaultValue={offer.price ?? ''} className="input" data-testid={`offer-price-${k}`} /></div><div><label className="label">Badge</label><input name="badge" defaultValue={offer.badge || ''} placeholder="Back to School" className="input" /></div></div>
      <div><label className="label">Link (optional)</label><input name="link" defaultValue={offer.link || ''} placeholder="/books/class-10" className="input" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={offer.active ?? true} className="h-4 w-4 accent-brass" /> Active (visible on site)</label>
      <div className="flex items-center gap-3"><button className="btn-brass !py-2 text-xs" data-testid={`offer-save-${k}`}>Save offer</button><span className="text-xs text-stone-500">{msg}</span></div>
    </form>
  );
}

export function BannerForm({ settings }) {
  const [onSubmit, msg] = useSubmit(saveSettingsAction);
  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5" data-testid="banner-form">
      {Object.entries(settings).filter(([k]) => !k.startsWith('banner') && k !== 'id' && k !== 'updatedAt').map(([k, v]) => <input key={k} type="hidden" name={k} value={v ?? ''} />)}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="bannerActive" defaultChecked={settings.bannerActive} className="h-4 w-4 accent-brass" data-testid="banner-active" /> Show banner on homepage</label>
      <div><label className="label">Title</label><input name="bannerTitle" defaultValue={settings.bannerTitle} className="input" data-testid="banner-title" /></div>
      <div><label className="label">Subtitle</label><textarea name="bannerSubtitle" rows={2} defaultValue={settings.bannerSubtitle} className="input" /></div>
      <div className="grid grid-cols-2 gap-3"><div><label className="label">Button text</label><input name="bannerCta" defaultValue={settings.bannerCta} className="input" /></div><div><label className="label">Button link</label><input name="bannerLink" defaultValue={settings.bannerLink} className="input" /></div></div>
      <p className="text-[11px] text-stone-500">Ideas: 🎒 Back to School (Jun–Jul) · 🏆 Prepare. Practice. Perform. (exam season) · 📚 Books They'll Love (Children's Day)</p>
      <div className="flex items-center gap-3"><button className="btn-brass !py-2 text-xs" data-testid="banner-save">Save banner</button><span className="text-xs text-stone-500">{msg}</span></div>
    </form>
  );
}

export function SettingsForm({ settings }) {
  const [onSubmit, msg] = useSubmit(saveSettingsAction);
  const fields = [['storeName', 'Store name'], ['phone', 'Phone (display)'], ['whatsapp', 'WhatsApp number (digits with country code, e.g. 919849212345)'], ['hours', 'Opening hours'], ['established', 'Established year'], ['city', 'City'], ['address', 'Full address'], ['mapsQuery', 'Google Maps search text'], ['reviewsUrl', 'Reviews / Google profile URL'], ['rating', 'Rating (e.g. 4.5)'], ['reviewCount', 'Review count'], ['statProducts', 'Stat: products (e.g. 1,500+)'], ['statCategories', 'Stat: categories (e.g. 25+)'], ['tagline', 'Tagline'], ['teluguTagline', 'Telugu tagline']];
  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:grid-cols-2" data-testid="settings-form">
      {['bannerActive', 'bannerTitle', 'bannerSubtitle', 'bannerCta', 'bannerLink'].map((k) => k === 'bannerActive' ? <input key={k} type="hidden" name={k} value={settings[k] ? 'true' : ''} /> : <input key={k} type="hidden" name={k} value={settings[k] ?? ''} />)}
      {fields.map(([k, l]) => <div key={k} className={['address', 'mapsQuery', 'reviewsUrl', 'tagline', 'teluguTagline'].includes(k) ? 'sm:col-span-2' : ''}><label className="label" htmlFor={`s-${k}`}>{l}</label><input id={`s-${k}`} name={k} defaultValue={settings[k] ?? ''} className="input" data-testid={`settings-${k}`} /></div>)}
      <div className="flex items-center gap-3 sm:col-span-2"><button className="btn-brass" data-testid="settings-save">Save settings</button><span className="text-sm text-stone-500" data-testid="settings-status">{msg}</span></div>
    </form>
  );
}
