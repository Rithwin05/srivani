import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';
import { ProductCover } from '@/components/site/ProductCover';
import { ProductRow } from '@/components/site/ProductRow';
import { AskSrivani } from '@/components/site/AskSrivani';
import { getProductBySlug, getRelated, getAlsoNeed } from '@/lib/products';
import { getSettings } from '@/lib/store';
import { filterToQuery, slugify } from '@/lib/taxonomy';
import { formatPrice, waLink, WA_MESSAGES } from '@/lib/whatsapp';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: 'Product not found' };
  const title = `${p.name}${p.price ? ` – ${formatPrice(p.price)}` : ''}`;
  const description = p.description || `${p.name}${p.author ? ` by ${p.author}` : ''}${p.publisher ? ` (${p.publisher})` : ''} available at Srivani Book Stall, Karimnagar. Enquire on WhatsApp.`;
  return { title, description, alternates: { canonical: `/product/${p.slug}` }, openGraph: { title, description, type: 'website', images: p.image && /^https?:/.test(p.image) ? [p.image] : undefined } };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [related, alsoNeed, settings] = await Promise.all([getRelated(product), getAlsoNeed(product), getSettings()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.product(product.name));
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const specs = [['Author', product.author], ['Publisher', product.publisher], ['Category', product.category], ['Subcategory', product.subcategory], ['Class', product.className], ['Subject', product.subject], ['Exam', product.exam], ['Language', product.language], ['ISBN', product.isbn], ['SKU', product.sku]].filter(([, v]) => v);
  const crumbs = [['Home', '/'], ['Catalogue', '/catalogue'], [product.category, `/catalogue${filterToQuery({ category: product.category })}`], [product.name, `/product/${product.slug}`]];
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': product.category === 'Stationery' || product.category === 'Art & Craft' ? 'Product' : 'Book', name: product.name, description: product.description, sku: product.sku, isbn: product.isbn || undefined, author: product.author ? { '@type': 'Person', name: product.author } : undefined, publisher: product.publisher ? { '@type': 'Organization', name: product.publisher } : undefined, brand: product.publisher ? { '@type': 'Brand', name: product.publisher } : undefined, image: product.image ? (/^https?:/.test(product.image) ? product.image : site + product.image) : undefined,
      offers: product.price ? { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: product.inStock ? 'https://schema.org/InStoreOnly' : 'https://schema.org/LimitedAvailability', url: `${site}/product/${product.slug}`, seller: { '@type': 'BookStore', name: settings.storeName } } : undefined },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site + href })) },
  ];
  return (
    <div data-testid="product-page">
      <div className="container-x pt-6">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-stone-500" aria-label="Breadcrumb" data-testid="breadcrumb">
          {crumbs.map(([n, h], i) => <span key={h} className="flex items-center gap-1">{i > 0 && <span>/</span>}{i < crumbs.length - 1 ? <Link href={h} className="hover:text-brass-dark">{n}</Link> : <span className="text-ink">{n}</span>}</span>)}
        </nav>
        <Link href="/catalogue" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brass-dark hover:underline" data-testid="back-to-catalogue"><ArrowLeft size={16} /> Back to Catalogue</Link>
      </div>
      <section className="container-x grid gap-8 py-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <div className="mx-auto w-full max-w-[360px] lg:max-w-none"><ProductCover product={product} size="main" priority className="shadow-lift" /></div>
        <div>
          <p className="eyebrow">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-5xl" data-testid="product-name">{product.name}</h1>
          {(product.author || product.publisher) && <p className="mt-3 text-stone-600">{product.author && <>by <span className="font-semibold text-ink">{product.author}</span></>}{product.author && product.publisher && ' · '}{product.publisher}</p>}
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <p className="text-4xl font-bold text-ink" data-testid="product-price">{formatPrice(product.price) || 'Ask for price'}</p>
            {product.mrp && product.mrp > product.price && <p className="pb-1 text-stone-400 line-through">{formatPrice(product.mrp)}</p>}
          </div>
          <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${product.inStock ? 'bg-forest-light text-forest' : 'bg-cream text-stone-600'}`} data-testid="product-availability"><CheckCircle2 size={16} /> {product.inStock ? 'Usually in store — confirm on WhatsApp' : 'Check availability'}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={wa} target="_blank" rel="noopener" className="btn-wa !py-3.5 text-base" data-testid="product-whatsapp-button"><MessageCircle size={18} /> Ask on WhatsApp</a>
            <Link href="/visit" className="btn-ghost" data-testid="product-visit-link"><MapPin size={16} /> Available at Srivani Book Stall</Link>
          </div>
          <p className="mt-3 text-xs text-stone-500">Message pre-filled: “{WA_MESSAGES.product(product.name)}”</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-sm sm:grid-cols-3" data-testid="product-specs">
            {specs.map(([k, v]) => <div key={k}><dt className="eyebrow !text-[10px]">{k}</dt><dd className="mt-0.5 font-medium text-ink">{k === 'Class' ? <Link href={`/books/${slugify(v)}`} className="hover:text-brass-dark">{v}</Link> : v}</dd></div>)}
          </dl>
          {product.description && <div className="mt-8"><h2 className="font-serif text-2xl font-bold">About this product</h2><p className="mt-2 leading-relaxed text-stone-700" data-testid="product-description">{product.description}</p></div>}
          {product.tags?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{product.tags.map((t) => <Link key={t} href={`/catalogue?q=${encodeURIComponent(t)}`} className="rounded-full bg-cream px-3 py-1 text-xs text-stone-600 hover:bg-brass-light">#{t}</Link>)}</div>}
        </div>
      </section>
      <div className="bg-cream"><ProductRow id="also-need" eyebrow="You may also need" title="Complete the set" products={alsoNeed} wa={settings.whatsapp} /></div>
      <ProductRow id="related" eyebrow="You may also like" title="Related products" products={related} wa={settings.whatsapp} href={`/catalogue${filterToQuery({ category: product.category })}`} />
      <AskSrivani wa={settings.whatsapp} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
