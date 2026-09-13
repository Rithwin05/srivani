import Link from 'next/link';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Filters, SortSelect } from './Filters';
import { AskSrivani } from './AskSrivani';
import { SearchBar } from './SearchBar';
import { searchProducts, getFacets } from '@/lib/products';
import { getSettings } from '@/lib/store';

export async function CatalogueView({ searchParams = {}, preset = {}, title, basePath = '/catalogue' }) {
  const params = { ...searchParams, ...preset };
  const [result, facets, settings] = await Promise.all([searchProducts(params), getFacets(params), getSettings()]);
  const heading = params.q ? `Results for “${params.q}”` : title || 'Catalogue';
  const pageHref = (n) => { const p = new URLSearchParams(); Object.entries(searchParams).forEach(([k, v]) => v && p.set(k, v)); p.set('page', n); return `${basePath}?${p}`; };
  return (
    <div className="container-x py-8" data-testid="catalogue-page">
      <div className="mb-6 max-w-3xl"><SearchBar /></div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Srivani catalogue</p>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl" data-testid="catalogue-heading">{heading}</h1>
          <p className="mt-1 text-sm text-stone-500" data-testid="catalogue-count">{result.total} product{result.total === 1 ? '' : 's'}</p>
        </div>
        <SortSelect />
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Filters facets={facets} preset={preset} />
        <div>
          {result.items.length ? (
            <div className="stagger grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" data-testid="product-grid">
              {result.items.map((p) => <ProductCard key={p.id} product={p} wa={settings.whatsapp} />)}
            </div>
          ) : (
            <div className="card flex flex-col items-center p-12 text-center" data-testid="catalogue-empty">
              <SearchX className="text-stone-400" size={40} />
              <h2 className="mt-4 font-serif text-2xl font-bold">No products found</h2>
              <p className="mt-2 text-sm text-stone-500">Try a different spelling, or ask Srivani directly — we'll find it for you.</p>
              <Link href="/catalogue" className="btn-ghost mt-6">Clear search</Link>
            </div>
          )}
          {result.pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2 text-sm" data-testid="pagination">
              {result.page > 1 && <Link href={pageHref(result.page - 1)} className="btn-ghost !py-2" data-testid="pagination-prev"><ChevronLeft size={16} /> Prev</Link>}
              <span className="px-3 text-stone-500">Page {result.page} of {result.pages}</span>
              {result.page < result.pages && <Link href={pageHref(result.page + 1)} className="btn-ghost !py-2" data-testid="pagination-next">Next <ChevronRight size={16} /></Link>}
            </nav>
          )}
          <div className="mt-12"><AskSrivani wa={settings.whatsapp} compact /></div>
        </div>
      </div>
    </div>
  );
}
