import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { ProductCover } from './ProductCover';
import { formatPrice, waLink, WA_MESSAGES } from '@/lib/whatsapp';

export function ProductCard({ product, wa, className = '' }) {
  return (
    <article className={`group card flex flex-col overflow-hidden p-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`} data-testid={`product-card-${product.slug}`}>
      <Link href={`/product/${product.slug}`} className="block" data-testid={`product-card-link-${product.slug}`}>
        <ProductCover product={product} />
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brass-dark">{product.name}</Link>
        <p className="mt-1 line-clamp-1 text-xs text-stone-500">{product.author || product.publisher || product.category}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-base font-bold text-ink" data-testid={`product-price-${product.slug}`}>{formatPrice(product.price) || 'Ask price'}</p>
            <p className={`text-[11px] font-medium ${product.inStock ? 'text-forest' : 'text-stone-500'}`}>{product.inStock ? '● In store' : 'Check availability'}</p>
          </div>
          {wa && <a href={waLink(wa, WA_MESSAGES.product(product.name))} target="_blank" rel="noopener" aria-label={`Enquire about ${product.name} on WhatsApp`} className="grid h-9 w-9 place-items-center rounded-full bg-wa/10 text-wa transition-colors hover:bg-wa hover:text-white" data-testid={`product-card-whatsapp-${product.slug}`}><MessageCircle size={16} /></a>}
        </div>
      </div>
    </article>
  );
}
