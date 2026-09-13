import Link from 'next/link';
import { getDashboardStats } from '@/lib/store';
import { SeedButton } from '@/components/admin/Controls';

export default async function AdminDashboard() {
  const s = await getDashboardStats();
  const cards = [[s.products, 'Products', '/admin/products'], [s.newEnquiries, 'New enquiries', '/admin/enquiries'], [s.enquiries, 'Total enquiries', '/admin/enquiries'], [s.offers, 'Active offers', '/admin/offers']];
  return (
    <div data-testid="admin-dashboard">
      <p className="eyebrow">Srivani Admin</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([v, l, h]) => <Link key={l} href={h} className="card p-5 transition-shadow hover:shadow-lift"><p className="font-serif text-4xl font-bold" data-testid={`stat-${l.toLowerCase().replace(/\s+/g, '-')}`}>{v}</p><p className="eyebrow mt-1 !text-[10px]">{l}</p></Link>)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <h2 className="font-serif text-2xl font-bold">Categories</h2>
          <p className="text-xs text-stone-500">Categories and subcategories are derived from your products — add a product with a new category and it appears here and in filters automatically.</p>
          <ul className="mt-4 divide-y divide-line" data-testid="admin-categories">
            {s.categories.map((c) => <li key={c.name} className="py-3"><div className="flex justify-between text-sm font-semibold"><span>{c.name || '(uncategorised)'}</span><span className="text-stone-500">{c.count}</span></div><p className="mt-1 text-xs text-stone-500">{c.subs.join(' · ') || '—'}</p></li>)}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="card p-6"><h3 className="font-bold">Quick actions</h3><div className="mt-3 flex flex-col gap-2"><Link href="/admin/products/new" className="btn-brass !py-2 text-xs">Add product</Link><Link href="/admin/import" className="btn-ghost !py-2 text-xs">Bulk import CSV</Link><Link href="/admin/offers" className="btn-ghost !py-2 text-xs">Edit offers & banner</Link></div></div>
          <div className="card p-6"><h3 className="font-bold">Demo data</h3><p className="mb-3 mt-1 text-xs text-stone-500">Restore the ~90 demo products for presentations.</p><SeedButton /></div>
        </div>
      </div>
    </div>
  );
}
