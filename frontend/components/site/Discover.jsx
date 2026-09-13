import Link from 'next/link';
import { BookOpen, GraduationCap, Library, Palette, PenLine, Printer, Trophy } from 'lucide-react';
import { CLASSES, EXAMS, NEEDS, SHELVES, filterToQuery, slugify } from '@/lib/taxonomy';

const ICONS = { GraduationCap, Library, Trophy, PenLine, Palette, BookOpen, Printer };

export function ShopByNeed() {
  return (
    <section className="py-12 sm:py-16" data-testid="shop-by-need">
      <div className="container-x">
        <p className="eyebrow mb-2">Shop by need</p>
        <h2 className="h2">What are you looking for?</h2>
        <div className="stagger mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {NEEDS.map((n, i) => {
            const Icon = ICONS[n.icon];
            const href = n.href || `/books/${n.slug}`;
            return (
              <Link key={n.slug} href={href} className={`group card relative overflow-hidden p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${i === 0 ? 'sm:col-span-2 sm:row-span-1 lg:col-span-2' : ''}`} data-testid={`need-${n.slug}`}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brass-light text-brass-dark transition-colors group-hover:bg-brass group-hover:text-white"><Icon size={22} /></span>
                <p className="mt-4 text-base font-bold text-ink">{n.label}</p>
                <p className="mt-1 text-xs text-stone-500">{n.hint}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ShopByClassExam() {
  return (
    <section className="bg-cream py-12 sm:py-16" data-testid="shop-by-class-exam">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">📚 Books by class</p>
          <h2 className="h2">Shop by Class</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {CLASSES.map((c) => <Link key={c} href={`/books/${slugify(c)}`} className="rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brass hover:bg-brass hover:text-white" data-testid={`class-${slugify(c)}`}>{c}</Link>)}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2">🏆 Competitive exams</p>
          <h2 className="h2">Shop by Exam</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {EXAMS.map((e) => <Link key={e} href={`/books/${slugify(e)}`} className="rounded-full border border-forest/30 bg-white px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white" data-testid={`exam-${slugify(e)}`}>{e}</Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DigitalShelves() {
  return (
    <section className="py-12 sm:py-16" data-testid="digital-shelves">
      <div className="container-x">
        <p className="eyebrow mb-2">The digital shelf</p>
        <h2 className="h2">Walk through the store</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHELVES.map((s) => (
            <Link key={s.slug} href={`/catalogue${filterToQuery(s.filter)}`} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.tone} p-6 text-white shadow-book transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${s.span ? 'sm:col-span-2 lg:col-span-1' : ''}`} data-testid={`digital-shelf-${s.slug}`}>
              <div className="grain absolute inset-0" />
              <div className="relative flex h-40 flex-col justify-end">
                <div className="absolute right-0 top-0 flex items-end gap-1 opacity-80 transition-transform duration-500 group-hover:-translate-y-1">
                  {[38, 52, 44, 60, 48].map((h, i) => <span key={i} className="w-4 rounded-sm bg-white/25" style={{ height: h, marginLeft: i % 2 ? 1 : 0 }} />)}
                </div>
                <p className="eyebrow !text-white/70">Shelf</p>
                <h3 className="font-serif text-2xl font-bold sm:text-3xl">{s.title}</h3>
                <p className="mt-1 text-sm text-white/80">{s.sub}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-2 shelf-wood" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
