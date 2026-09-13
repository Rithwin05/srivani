import { listAllForSitemap } from '@/lib/products';
import { CLASSES, EXAMS, NEEDS, slugify } from '@/lib/taxonomy';

export const revalidate = 3600;

export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();
  const statics = ['', '/catalogue', '/books', '/stationery', '/offers', '/ask-srivani', '/school-list', '/bulk-enquiry', '/about', '/visit'].map((p) => ({ url: site + p, lastModified: now, priority: p === '' ? 1 : 0.8 }));
  const collections = [...NEEDS.filter((n) => n.filter).map((n) => `/books/${n.slug}`), ...CLASSES.map((c) => `/books/${slugify(c)}`), ...EXAMS.map((e) => `/books/${slugify(e)}`)].map((p) => ({ url: site + p, lastModified: now, priority: 0.7 }));
  const products = (await listAllForSitemap().catch(() => [])).map((p) => ({ url: `${site}/product/${p.slug}`, lastModified: p.updatedAt || now, priority: 0.6 }));
  return [...statics, ...collections, ...products];
}
