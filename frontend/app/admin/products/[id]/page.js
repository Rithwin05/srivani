import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  return <div data-testid="admin-edit-product"><p className="eyebrow">Products</p><h1 className="mt-1 mb-6 font-serif text-3xl font-bold">Edit: {product.name}</h1><ProductForm product={product} /></div>;
}
