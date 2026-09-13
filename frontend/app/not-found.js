import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center" data-testid="not-found">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">This shelf is empty</h1>
      <p className="mt-3 text-stone-600">We couldn't find that page. Try searching the catalogue or ask Srivani.</p>
      <div className="mt-8 flex justify-center gap-3"><Link href="/catalogue" className="btn-brass">Search catalogue</Link><Link href="/ask-srivani" className="btn-ghost">Ask Srivani</Link></div>
    </div>
  );
}
