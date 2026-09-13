import { EnquiryForm } from '@/components/site/EnquiryForm';

export const metadata = { title: 'Bulk Enquiry – Books & Stationery for Schools, Colleges & Institutions', description: 'Request a bulk quotation from Srivani Book Stall, Karimnagar for schools, colleges, tuition centres and offices.' };

export default function BulkPage() {
  return (
    <div className="container-x py-10" data-testid="bulk-enquiry-page">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="eyebrow">🏫 Need books in bulk?</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Request a bulk quotation</h1>
          <p className="mt-4 text-stone-700">Schools, colleges, tuition centres, hostels and offices — share your requirement and we'll send a quotation with institutional pricing. Notebooks, textbooks, exam pads, stationery kits, printing and binding.</p>
          <ul className="mt-6 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">{['Institutional pricing', 'Class-wise book sets', 'Custom notebooks & pads', 'Printing & binding jobs', 'Delivery within Karimnagar', 'GST invoice available'].map((t) => <li key={t} className="rounded-xl bg-cream px-3 py-2">✓ {t}</li>)}</ul>
        </div>
        <EnquiryForm type="bulk" submitLabel="Submit Enquiry" accept="image/*,.pdf,.xlsx,.xls,.csv" note="Attach your requirement list (PDF, Excel, photo)." fields={[
          { name: 'institution', label: 'Institution name', required: true, placeholder: 'School / College / Company' },
          { name: 'name', label: 'Contact person', required: true },
          { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true },
          { name: 'message', label: 'Requirements', type: 'textarea', rows: 5, required: true, placeholder: 'e.g. 400 long notebooks (200 pg), 120 sets of Class 6 textbooks...' },
          { name: 'quantity', label: 'Approx. quantity', placeholder: 'e.g. 500 units / 120 sets' },
        ]} />
      </div>
    </div>
  );
}
