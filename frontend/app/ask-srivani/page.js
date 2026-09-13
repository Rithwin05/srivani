import { EnquiryForm } from '@/components/site/EnquiryForm';
import { AskSrivani } from '@/components/site/AskSrivani';
import { getSettings } from '@/lib/store';

export const metadata = { title: 'Ask Srivani – We\'ll find it for you', description: 'Can\'t find a book or stationery item? Ask Srivani Book Stall on WhatsApp and we\'ll help you find it.' };

export default async function AskPage() {
  const settings = await getSettings();
  return (
    <div className="container-x py-10" data-testid="ask-srivani-page">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="eyebrow">🤔 Can't find what you're looking for?</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Ask Srivani</h1>
          <p className="mt-4 text-stone-700">Tell us what you need — a specific title, a guide for your class, an exam book or a stationery item. We check the shelf and reply on WhatsApp, usually within the hour during store timings.</p>
          <p className="mt-6 font-serif text-2xl text-brass-dark">{settings.teluguTagline}</p>
        </div>
        <EnquiryForm type="ask" submitLabel="Ask on WhatsApp" fields={[
          { name: 'message', label: 'What are you looking for?', type: 'textarea', rows: 4, required: true, placeholder: 'e.g. Class 9 Telugu Akademi Social Studies, or Yandamuri novels' },
          { name: 'name', label: 'Your name', placeholder: 'Optional' },
          { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: 'Optional — so we can reply' },
        ]} />
      </div>
    </div>
  );
}
