import Image from 'next/image';

const TONES = {
  'School Books': ['#B45309', '#78350F'], 'College Books': ['#1D4ED8', '#1E3A8A'], 'Competitive Exams': ['#047857', '#064E3B'],
  Stationery: ['#0369A1', '#0C4A6E'], 'Art & Craft': ['#BE185D', '#831843'], 'General Reading': ['#B91C1C', '#7F1D1D'],
};

// Renders the real image when available, otherwise a generated "book cover" (zero image bytes downloaded).
export function ProductCover({ product, size = 'thumb', priority = false, className = '' }) {
  const src = size === 'thumb' ? product.thumb || product.image : product.image || product.thumb;
  if (src) {
    const external = /^https?:/.test(src);
    return (
      <div className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-cream ${className}`}>
        <Image src={src} alt={product.name} fill unoptimized={external} priority={priority} loading={priority ? undefined : 'lazy'}
          sizes={size === 'thumb' ? '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px' : '(max-width: 768px) 90vw, 480px'} className="object-cover" />
      </div>
    );
  }
  const [a, b] = TONES[product.category] || ['#57534E', '#292524'];
  const isBook = !['Stationery', 'Art & Craft'].includes(product.category);
  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-xl ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-label={product.name}>
      {isBook && <div className="absolute inset-y-0 left-0 w-[7%] bg-black/25" />}
      <div className="absolute inset-0 grain" />
      <div className={`absolute inset-0 flex flex-col justify-between p-[9%] ${isBook ? 'pl-[14%]' : ''} text-white`}>
        <span className="text-[9px] font-semibold uppercase tracking-[.2em] opacity-80">{product.publisher || product.category}</span>
        <div>
          <p className={`font-serif font-bold leading-[1.05] ${size === 'thumb' ? 'text-base sm:text-lg' : 'text-2xl sm:text-4xl'}`} style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
          {(product.author || product.className || product.exam) && <p className="mt-2 text-[10px] font-medium opacity-85">{product.author || product.className || product.exam}</p>}
        </div>
        <span className="text-[9px] uppercase tracking-widest opacity-70">Srivani</span>
      </div>
    </div>
  );
}
