import Link from 'next/link';
import { getSettings } from '@/lib/store';

export const metadata = { title: 'About Srivani – A local store. A lifetime of trust.', description: 'The story of Srivani Book Stall, serving students and families in Karimnagar since 2004.' };

export default async function AboutPage() {
  const s = await getSettings();
  const years = new Date().getFullYear() - s.established;
  return (
    <div className="container-x max-w-3xl py-12" data-testid="about-page">
      <p className="eyebrow">About Srivani</p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-6xl">A local store. A lifetime of trust.</h1>
      <p className="mt-6 font-serif text-2xl text-brass-dark">{s.teluguTagline}</p>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-stone-700">
        <p>Srivani Book Stall opened its doors in {s.established} on Jagtial Road, beside Alphors College, with a simple idea: every student in Karimnagar should find the right book at the right time, from someone who knows what they need.</p>
        <p>{years} years later, we are still a family-run counter. We know which guide works for Class 10 Maths, which edition the TSPSC aspirants ask for, and which notebook lasts a full year. Parents bring school lists, teachers bring bulk orders, and students bring questions — we answer all of them.</p>
        <p>This website is our shelf, opened up to your phone. Search {s.statProducts} products, ask us on WhatsApp, and visit the store to collect. The counter is the same; it just got a little bigger.</p>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4 text-center">{[[`${years}+`, 'Years'], [s.statProducts, 'Products'], [`${s.rating}★`, 'Rating']].map(([v, l]) => <div key={l} className="card p-5"><p className="font-serif text-3xl font-bold">{v}</p><p className="eyebrow mt-1 !text-[10px]">{l}</p></div>)}</div>
      <div className="mt-10 flex flex-wrap gap-3"><Link href="/catalogue" className="btn-brass">Explore the shelf</Link><Link href="/visit" className="btn-ghost">Visit the store</Link></div>
    </div>
  );
}
