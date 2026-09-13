import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CatalogueView } from '@/components/site/CatalogueView';
import { resolveCollection } from '@/lib/taxonomy';

export async function generateMetadata({ params }) {
  const { section, slug } = await params;
  const col = resolveCollection(section, slug?.[0]);
  if (!col) return {};
  return { title: `${col.title} in Karimnagar`, description: `Browse ${col.title.toLowerCase()} available at Srivani Book Stall, Karimnagar. Enquire on WhatsApp for availability and price.` };
}

export default async function CollectionPage({ params, searchParams }) {
  const [{ section, slug }, sp] = await Promise.all([params, searchParams]);
  const col = resolveCollection(section, slug?.[0]);
  if (!col || (slug && slug.length > 1)) notFound();
  const basePath = `/${section}${slug ? `/${slug[0]}` : ''}`;
  return <Suspense><CatalogueView searchParams={sp} preset={col.filter} title={col.title} basePath={basePath} /></Suspense>;
}
