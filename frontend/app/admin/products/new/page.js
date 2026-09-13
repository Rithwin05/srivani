import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return <div data-testid="admin-new-product"><p className="eyebrow">Products</p><h1 className="mt-1 mb-6 font-serif text-3xl font-bold">Add product</h1><ProductForm /></div>;
}
