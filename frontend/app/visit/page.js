import { VisitSection } from '@/components/site/Sections';
import { getSettings } from '@/lib/store';

export const metadata = { title: 'Visit Srivani Book Stall – Jagtial Road, Karimnagar', description: 'Address, directions, opening hours and contact for Srivani Book Stall, beside Alphors College, Jagtial Road, Karimnagar.' };

export default async function VisitPage() {
  const settings = await getSettings();
  return <div className="py-6" data-testid="visit-page"><VisitSection settings={settings} full /></div>;
}
