import { ImportForm } from '@/components/admin/ImportForm';

const COLS = 'SKU, Name, Category, Subcategory, Author, Publisher, Price, MRP, Class, Subject, Exam, Language, ISBN, Image, Tags, Description, Featured, NewArrival, Pick, Trending, InStock';

export default function ImportPage() {
  return (
    <div data-testid="admin-import">
      <p className="eyebrow">Products</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Bulk import</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-600">Upload the full catalogue as CSV. Rows are matched by <b>SKU</b> — existing SKUs are updated, new SKUs are created. Only <b>Name</b> is required. Use image URLs in the <b>Image</b> column, or upload images per product after import.</p>
      <div className="mt-4 rounded-xl bg-cream p-4 text-xs text-stone-600"><p className="font-semibold text-ink">Columns</p><p className="mt-1 font-mono">{COLS}</p><a href="/srivani-import-template.csv" download className="mt-3 inline-block font-semibold text-brass-dark underline" data-testid="download-template-link">Download CSV template</a></div>
      <div className="mt-6"><ImportForm /></div>
    </div>
  );
}
