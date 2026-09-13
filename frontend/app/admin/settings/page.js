import { getSettings } from '@/lib/store';
import { SettingsForm } from '@/components/admin/OfferForms';

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div data-testid="admin-settings">
      <p className="eyebrow">Store</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-stone-600">Contact details used across the site — WhatsApp buttons, call links, map, store hours and the “at a glance” numbers. <b>Replace the placeholder WhatsApp number before launch.</b></p>
      <div className="mt-6"><SettingsForm settings={settings} /></div>
    </div>
  );
}
