import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ProductRow({ eyebrow, title, href, products, wa, id }) {
  if (!products?.length) return null;
  return (
    <section className="py-12 sm:py-16" id={id} data-testid={`row-${id}`}>
      <div className="container-x">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="h2">{title}</h2>
          </div>
          {href && <Link href={href} className="hidden items-center gap-1 text-sm font-semibold text-brass-dark hover:underline sm:inline-flex" data-testid={`row-${id}-view-all`}>View all <ArrowRight size={16} /></Link>}
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {products.map((p) => <ProductCard key={p.id} product={p} wa={wa} className="w-[160px] shrink-0 snap-start sm:w-[200px] lg:w-[220px]" />)}
        </div>
        {href && <Link href={href} className="btn-ghost mt-2 w-full sm:hidden">View all</Link>}
      </div>
    </section>
  );
}
