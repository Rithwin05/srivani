import Link from 'next/link';
import { adminListProducts } from '@/lib/products';
import { ProductCover } from '@/components/site/ProductCover';
import { FlagToggle, DeleteButton } from '@/components/admin/Controls';
import { formatPrice } from '@/lib/whatsapp';

export default async function AdminProducts({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const r = await adminListProducts({ q: sp.q || '', page });
  const href = (n) => `/admin/products?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: n })}`;
  return (
    <div data-testid="admin-products">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="eyebrow">Products</p><h1 className="mt-1 font-serif text-3xl font-bold">All products <span className="text-lg text-stone-400">({r.total})</span></h1></div>
        <div className="flex gap-2"><Link href="/admin/import" className="btn-ghost !py-2 text-xs">Bulk import</Link><Link href="/admin/products/new" className="btn-brass !py-2 text-xs" data-testid="admin-add-product-link">+ Add product</Link></div>
      </div>
      <form className="mt-5 flex gap-2" data-testid="admin-product-search"><input name="q" defaultValue={sp.q || ''} placeholder="Search by name, SKU, author, publisher…" className="input" data-testid="admin-product-search-input" /><button className="btn-dark !py-2">Search</button></form>
      <div className="card mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wider text-stone-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Flags</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {r.items.map((p) => (
              <tr key={p.id} data-testid={`admin-product-row-${p.sku || p.id}`}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 shrink-0"><ProductCover product={p} /></div><div className="min-w-0"><p className="truncate font-semibold">{p.name}</p><p className="truncate text-xs text-stone-500">{p.sku} · {p.author || p.publisher}</p></div></div></td>
                <td className="px-4 py-3 text-xs text-stone-600">{p.category}<br /><span className="text-stone-400">{p.subcategory} {p.className} {p.exam}</span></td>
                <td className="px-4 py-3 font-semibold">{formatPrice(p.price) || '—'}</td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{[['featured', 'Featured'], ['newArrival', 'New'], ['pick', 'Pick'], ['trending', 'Trending'], ['inStock', 'In stock']].map(([f, l]) => <FlagToggle key={f} id={p.id} flag={f} value={p[f]} label={l} />)}</div></td>
                <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3 whitespace-nowrap"><Link href={`/product/${p.slug}`} className="text-xs text-stone-500 hover:underline" target="_blank">View</Link><Link href={`/admin/products/${p.id}`} className="text-xs font-semibold text-brass-dark hover:underline" data-testid={`admin-edit-${p.sku || p.id}`}>Edit</Link><DeleteButton id={p.id} /></div></td>
              </tr>
            ))}
            {!r.items.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone-500">No products match.</td></tr>}
          </tbody>
        </table>
      </div>
      {r.pages > 1 && <div className="mt-4 flex items-center justify-center gap-3 text-sm">{page > 1 && <Link href={href(page - 1)} className="btn-ghost !py-2">Prev</Link>}<span className="text-stone-500">Page {page} / {r.pages}</span>{page < r.pages && <Link href={href(page + 1)} className="btn-ghost !py-2">Next</Link>}</div>}
    </div>
  );
}
