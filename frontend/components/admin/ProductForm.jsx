'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProductAction } from '@/app/actions/admin';
import { CATEGORIES, CLASSES, EXAMS } from '@/lib/taxonomy';
import { ProductCover } from '@/components/site/ProductCover';

const F = ({ name, label, children, className = '' }) => <div className={className}><label className="label" htmlFor={`pf-${name}`}>{label}</label>{children}</div>;

export function ProductForm({ product = {} }) {
  const router = useRouter();
  const [state, setState] = useState({ loading: false, error: '', ok: '' });
  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true, error: '', ok: '' });
    const res = await saveProductAction(new FormData(e.currentTarget));
    if (res.error) return setState({ loading: false, error: res.error, ok: '' });
    setState({ loading: false, error: '', ok: 'Saved' });
    router.push('/admin/products');
    router.refresh();
  };
  const text = (name, label, extra = {}) => <F name={name} label={label}><input id={`pf-${name}`} name={name} defaultValue={product[name] ?? ''} className="input" data-testid={`pf-${name}`} {...extra} /></F>;
  const list = (name, label, options) => <F name={name} label={label}><input id={`pf-${name}`} name={name} list={`dl-${name}`} defaultValue={product[name] ?? ''} className="input" data-testid={`pf-${name}`} /><datalist id={`dl-${name}`}>{options.map((o) => <option key={o} value={o} />)}</datalist></F>;
  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_280px]" data-testid="product-form">
      <input type="hidden" name="id" value={product.id || ''} />
      <div className="card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {text('name', 'Product name *', { required: true })}
          {text('sku', 'SKU')}
          {text('author', 'Author')}
          {text('publisher', 'Publisher / Brand')}
          {list('category', 'Category *', CATEGORIES)}
          {text('subcategory', 'Subcategory')}
          {list('className', 'Class', CLASSES)}
          {text('subject', 'Subject')}
          {list('exam', 'Exam', EXAMS)}
          {text('language', 'Language')}
          {text('isbn', 'ISBN')}
          {text('popularity', 'Popularity (sort weight)', { type: 'number' })}
          {text('price', 'Price (₹)', { type: 'number', step: '1' })}
          {text('mrp', 'MRP (₹)', { type: 'number', step: '1' })}
        </div>
        <F name="tags" label="Tags (comma separated)"><input id="pf-tags" name="tags" defaultValue={(product.tags || []).join(', ')} className="input" placeholder="maths, class 10, ssc" data-testid="pf-tags" /></F>
        <F name="description" label="Description"><textarea id="pf-description" name="description" rows={4} defaultValue={product.description || ''} className="input" data-testid="pf-description" /></F>
        <div className="flex flex-wrap gap-4 text-sm">
          {[['featured', 'Featured'], ['newArrival', 'New arrival'], ['pick', 'Srivani Pick'], ['trending', 'Trending'], ['inStock', 'In stock']].map(([n, l]) => <label key={n} className="flex items-center gap-2"><input type="checkbox" name={n} defaultChecked={product[n] ?? n === 'inStock'} className="h-4 w-4 accent-brass" data-testid={`pf-${n}`} /> {l}</label>)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-5">
          <p className="label">Image</p>
          <div className="mx-auto w-40"><ProductCover product={product.name ? product : { name: 'Preview cover', category: product.category }} /></div>
          <label className="label mt-4" htmlFor="pf-imageFile">Upload image (auto-optimized to WebP + thumbnail)</label>
          <input id="pf-imageFile" name="imageFile" type="file" accept="image/*" className="input !py-2 text-xs" data-testid="pf-imageFile" />
          <label className="label mt-3" htmlFor="pf-imageUrl">…or image URL</label>
          <input id="pf-imageUrl" name="imageUrl" defaultValue={/^https?:/.test(product.image || '') ? product.image : ''} placeholder="https://…" className="input text-xs" data-testid="pf-imageUrl" />
          <p className="mt-2 text-[11px] text-stone-500">Without an image, a generated cover with the title is shown.</p>
        </div>
        {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="pf-error">{state.error}</p>}
        <button disabled={state.loading} className="btn-brass w-full disabled:opacity-60" data-testid="pf-submit">{state.loading ? 'Saving…' : 'Save product'}</button>
      </div>
    </form>
  );
}
