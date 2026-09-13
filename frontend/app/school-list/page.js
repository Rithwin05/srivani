import { EnquiryForm } from '@/components/site/EnquiryForm';

export const metadata = { title: 'Build Your School List – Send your book & stationery list', description: 'Upload a photo or PDF of your school book list, or type it, and Srivani Book Stall will prepare everything for you.' };

const STEPS = [['Upload or type your list', 'A photo of the school list, a PDF, or just type the items.'], ['We prepare the set', 'Textbooks, guides, notebooks, covers, labels — all together.'], ['Collect at the counter', 'Confirm on WhatsApp and pick it up ready-packed.']];

export default function SchoolListPage() {
  return (
    <div className="container-x py-10" data-testid="school-list-page">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="eyebrow">🎒 Preparing for school?</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Send us your school list</h1>
          <p className="mt-4 text-stone-700">Parents, skip the queue. Share the book and stationery list from your school and we'll get the complete set ready for you at Srivani.</p>
          <ol className="mt-8 space-y-5">{STEPS.map(([t, d], i) => <li key={t} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass font-bold text-white">{i + 1}</span><div><p className="font-semibold">{t}</p><p className="text-sm text-stone-600">{d}</p></div></li>)}</ol>
        </div>
        <EnquiryForm type="school-list" accept="image/*,.pdf" note="Photo (JPG/PNG) or PDF, up to 10 MB." fields={[
          { name: 'name', label: 'Parent / student name', required: true, placeholder: 'Your name' },
          { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true, placeholder: '10-digit mobile number' },
          { name: 'school', label: 'School & class', placeholder: 'e.g. Alphores School, Class 7' },
          { name: 'message', label: 'Type your list (optional if uploading)', type: 'textarea', rows: 6, placeholder: 'Maths textbook, Science guide, 6 long notebooks, geometry box...' },
        ]} />
      </div>
    </div>
  );
}
