import { getEnquiries } from '@/lib/store';
import { StatusSelect } from '@/components/admin/Controls';

const LABEL = { ask: 'Ask Srivani', 'school-list': 'School list', bulk: 'Bulk', product: 'Product' };

export default async function AdminEnquiries() {
  const list = await getEnquiries();
  return (
    <div data-testid="admin-enquiries">
      <p className="eyebrow">Customers</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Enquiries <span className="text-lg text-stone-400">({list.length})</span></h1>
      <div className="mt-6 space-y-3">
        {list.map((e) => (
          <div key={e.id} className={`card p-5 ${e.status === 'new' ? 'border-l-4 border-l-brass' : ''}`} data-testid={`enquiry-${e.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-stone-600">{LABEL[e.type] || e.type}</span>
                <p className="mt-2 font-semibold">{e.name || 'Anonymous'}{e.institution ? ` · ${e.institution}` : ''}{e.school ? ` · ${e.school}` : ''}</p>
                <p className="text-xs text-stone-500">{e.phone ? <a href={`tel:${e.phone}`} className="underline">{e.phone}</a> : 'No phone'} · {new Date(e.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <StatusSelect id={e.id} value={e.status} />
            </div>
            {e.productName && <p className="mt-3 text-sm">Product: <b>{e.productName}</b></p>}
            {e.message && <p className="mt-3 whitespace-pre-wrap text-sm text-stone-700">{e.message}</p>}
            {e.quantity && <p className="mt-1 text-sm text-stone-600">Quantity: {e.quantity}</p>}
            {e.fileUrl && <a href={e.fileUrl} target="_blank" rel="noopener" className="mt-2 inline-block text-xs font-semibold text-brass-dark underline">View attached list</a>}
          </div>
        ))}
        {!list.length && <p className="text-stone-500">No enquiries yet.</p>}
      </div>
    </div>
  );
}
