import { Suspense } from 'react';
import { CatalogueView } from '@/components/site/CatalogueView';

export const metadata = { title: 'Catalogue – Search 1,500+ Books & Stationery', description: 'Search and filter the complete Srivani Book Stall catalogue by category, class, subject, exam, author and publisher.' };

export default async function CataloguePage({ searchParams }) {
  const sp = await searchParams;
  return <Suspense><CatalogueView searchParams={sp} /></Suspense>;
}
